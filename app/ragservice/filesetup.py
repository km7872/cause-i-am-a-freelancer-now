from langchain_core.documents import Document
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_chroma import Chroma
from app.ragservice.config  import embeddings
import os
import shutil

def create_text_chunks(text):
    docs = [Document(page_content=text)]
    for index, doc in enumerate(docs):
        doc.metadata["page_number"] = index + 1

    splitter = RecursiveCharacterTextSplitter(chunk_size=500, chunk_overlap=50)
    chunks = splitter.split_documents(docs)
    return chunks


def create_vector_store(new_chunks, file_id):
    collection_name = file_id
    if os.path.exists(file_id):
        shutil.rmtree(file_id)
    vector_store = Chroma.from_documents(
        documents=new_chunks,
        collection_name=collection_name,
        embedding=embeddings,
        persist_directory=file_id,
    )
    return vector_store
