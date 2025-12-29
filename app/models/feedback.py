from pydantic import BaseModel

class Feedback(BaseModel):
    query: str
    answer: str
    feedback_type: int | None