from fastapi import APIRouter, UploadFile, File, HTTPException, Request
from app.models.question import Question
from app.pdfservice.pdf import extract_text_from_pdf
from app.extractor.extractor import extract_fields
from app.ragservice.filesetup import create_text_chunks, create_vector_store
from app.ragservice.config import llm
from langchain_classic.chains import RetrievalQA
# from app.db.redis import redis_client
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
    new_retriever = new_vector_store.as_retriever(search_kwargs={"k": 3})
    qa_chain = RetrievalQA.from_chain_type(
        llm=llm,
        chain_type="stuff",
        retriever=new_retriever
    )
    request.app.state.qa_chain = qa_chain
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
    user_query = question.question
    response = qa_chain.invoke({"query": user_query})
    return {"User Query": response["result"]}
