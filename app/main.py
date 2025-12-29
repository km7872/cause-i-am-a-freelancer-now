from fastapi import FastAPI
from app.api.routes import router

app = FastAPI(
    title="Freelancer API",
    version="1.0.0"
)
# Adding state variables
app.state.qa_chain = None
app.state.retriever = None

app.include_router(router)

@app.get("/health")
def health():
    return {"status": "ok"}
