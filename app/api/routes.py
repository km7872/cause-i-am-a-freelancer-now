from fastapi import APIRouter, UploadFile, File, HTTPException, Request
from langchain_classic.agents import create_tool_calling_agent, AgentExecutor
from app.models.question import Question
from app.models.feedback import Feedback
from app.pdfservice.pdf import extract_text_from_pdf
from app.extractor.extractor import extract_fields, safe_json_parse
from app.ragservice.filesetup import create_text_chunks, create_vector_store
from app.ragservice.config import llm, prompt
from app.ragservice.feedback import save_feedback_to_csv
from app.ragservice.email import escalate_to_email
from langchain_classic.chains import RetrievalQA
from app.db.redis import retrieve_from_redis, store_in_redis
from langchain_core.prompts import ChatPromptTemplate

from langchain_core.runnables import RunnablePassthrough
import uuid
import json
from datetime import datetime
from app.db.redis import redis_client

router = APIRouter()
# doc_info = {}
# prompt = ChatPromptTemplate.from_template(template)

FORMAT_DOCID_KEY = "doc:{}"

DUMMY_FIELDS = {
    "start_date": "2023-01-01",
    "start_date_str": "January 1, 2023",
    "end_date": "2023-12-31",
    "end_date_str": "December 31, 2023",
    "position": "Software Engineer",
    "company": "Parth Corp",
    "salary": "50"
}

@router.post("/upload")
async def upload_document(request: Request,file: UploadFile = File(...)):
# async def upload_document(file: UploadFile = File(...)):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files allowed")

    document_id = str(uuid.uuid4())

    last_doc_id = redis_client.get("last_doc_id")
    # print("Last doc ID to delete:", last_doc_id)
    if last_doc_id:
        await delete_document(last_doc_id)
        # print("Does it exist in Redis?", redis_client.exists(FORMAT_DOCID_KEY.format(last_doc_id)))

    text = extract_text_from_pdf(file)
    # redis_client.set(f"doc:{document_id}:text", text)
    
    
    fields = DUMMY_FIELDS
    # fields = extract_fields(text)
    redis_client.hset(
        FORMAT_DOCID_KEY.format(document_id),
        mapping={
            "text": text,
            "fields": json.dumps(fields)
        }
    )

    redis_client.sadd("docs:ids", document_id)

    # doc_info[document_id] = text
    # info = redis_client.get(f"doc:{document_id}:text")
    info = redis_client.hget(FORMAT_DOCID_KEY.format(document_id), "text")
    # create the embeddings of the text of the file
    new_chunks = create_text_chunks(info)
    new_vector_store = create_vector_store(new_chunks, document_id)
    new_retriever = new_vector_store.as_retriever(
        search_type="similarity_score_threshold",
        search_kwargs={'score_threshold': 0.1}  # Only keep chunks with >70% match
    )
    qa_chain = RetrievalQA.from_chain_type(
        llm=llm,
        chain_type="stuff",
        retriever=new_retriever
    )
    request.app.state.qa_chain = qa_chain
    request.app.state.retriever = new_retriever
    redis_client.set("last_doc_id", document_id)
    return {"document_id": document_id}

@router.delete("/delete_document/{document_id}")
async def delete_document(document_id: str):
    if redis_client.exists(FORMAT_DOCID_KEY.format(document_id)):
        redis_client.hdel(FORMAT_DOCID_KEY.format(document_id), "text", "fields")
        
        # Remove the document ID from the set
        redis_client.srem("docs:ids", document_id)
        
        return 200
    return 404

@router.get('/contracts')
def get_contracts():
    contracts = []

    doc_ids = redis_client.smembers("docs:ids")
    # print(doc_ids)
    # print(type(doc_ids))

    for doc_id in doc_ids:
        # print(doc_id)
        # print(type(doc_id))
        key = FORMAT_DOCID_KEY.format(doc_id)
        fields = json.loads(redis_client.hget(key, "fields"))
        status = 'active'
        if "end_date" in fields and fields["end_date"]!="":
            end_date = datetime.strptime(fields["end_date"], "%Y-%m-%d")
            today = datetime.today()

            # Add status
            if end_date < today:
                status = "expired"
        fields["status"] = status

        contract = {
            "id": doc_id,
            "fields": fields,
        }

        contracts.append(contract)

    return contracts

@router.post("/extract/{document_id}")
async def extract_document(document_id: int):
    fields = redis_client.hget(FORMAT_DOCID_KEY.format(document_id), "fields")

    return fields or {}

@router.post("/user_query")
def get_user_query(question: Question, request: Request):
    qa_chain =  request.app.state.qa_chain
    retriever = request.app.state.retriever
    user_query = question.question
    # check if the user query is already cached
    cached_answer = retrieve_from_redis(user_query)
    if cached_answer:
        return {"response": cached_answer}

    #Bind the tool to the LLM
    llm_with_tools = llm.bind_tools([escalate_to_email])
    docs = retriever.invoke(user_query)
    context_str = "\n".join([d.page_content for d in docs]) if docs else "No documents found."

    ai_msg = llm_with_tools.invoke(f"Context: {context_str}\nQuestion: {user_query}")

    # Check if Gemini wants to call a tool
    if ai_msg.tool_calls:
        for tool_call in ai_msg.tool_calls:
            if tool_call["name"] == "escalate_to_email":
                # Manually run the function
                tool_output = escalate_to_email.invoke(tool_call["args"])

                # Return the result immediately to the user
                return {"response": tool_output}

    # If no tool was called, return the text answer and store the result in cache
    store_in_redis(user_query, ai_msg.content[0]['text'])
    return {"response": ai_msg.content}

@router.post("/submit_feedback")
def submit_feedback(feedback: Feedback):
    feedback_dict = feedback.model_dump()
    save_feedback_to_csv(feedback_dict)