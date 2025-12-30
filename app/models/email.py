from pydantic import BaseModel, Field

class EmailSchema(BaseModel):
    query: str = Field(description="The original user question that could not be answered.")
    reason: str = Field(description="Brief reason why the RAG could not answer (e.g., 'No documents found').")

