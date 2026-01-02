from pydantic import BaseModel

class Question(BaseModel):
    question: str
    contract_id: str