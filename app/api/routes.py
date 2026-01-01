from fastapi import APIRouter, UploadFile, File, HTTPException, Request
from langchain_classic.agents import create_tool_calling_agent, AgentExecutor
from app.models.question import Question
from app.models.feedback import Feedback
from app.pdfservice.pdf import extract_text_from_pdf
from app.extractor.extractor import extract_fields
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

router = APIRouter()
doc_info = {}

@router.post("/upload")
async def upload_document(request: Request, file: UploadFile = File(...)):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files allowed")

    document_id = str(uuid.uuid4())

    text = extract_text_from_pdf(file)
    # redis_client.set(f"doc:{document_id}:text", text)
    doc_info[document_id] = text
    # create the embeddings of the text of the file
    new_chunks = create_text_chunks(doc_info[document_id])
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
    return {"document_id": document_id}


@router.post("/extract/{document_id}")
async def extract_document(document_id: str):
    # text = redis_client.get(f"doc:{document_id}:text")
    text = doc_info.get(document_id)

    if not text:
        raise HTTPException(status_code=404, detail="Document not found")

    extracted = extract_fields(text)

    # redis_client.set(
    #     f"doc:{document_id}:extracted",
    #     json.dumps(extracted)
    # )

    return extracted

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
    store_in_redis(user_query, ai_msg.content)
    return {"response": ai_msg.content}

@router.post("/submit_feedback")
def submit_feedback(feedback: Feedback):
    feedback_dict = feedback.model_dump()
    save_feedback_to_csv(feedback_dict)