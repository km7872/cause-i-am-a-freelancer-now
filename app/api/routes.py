from fastapi import APIRouter, UploadFile, File, HTTPException
from app.pdfservice.pdf import extract_text_from_pdf
from app.extractor.extractor import extract_fields
# from app.db.redis import redis_client
import uuid
import json

router = APIRouter()
doc_info = {}

@router.post("/upload")
async def upload_document(file: UploadFile = File(...)):
    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files allowed")

    document_id = str(uuid.uuid4())

    text = extract_text_from_pdf(file)
    # redis_client.set(f"doc:{document_id}:text", text)
    doc_info[document_id] = text
    # print(text)

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
