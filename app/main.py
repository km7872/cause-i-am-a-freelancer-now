from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.routes import router

app = FastAPI(
    title="Freelancer API",
    version="1.0.0"
)

# Define allowed origins for frontend
origins = [
    "http://localhost:8080",
    "http://127.0.0.1:8080",
    "http://localhost:8000",
    "http://127.0.0.1:8000",
]

#  CORSMiddleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"], # Allow POST, GET, etc.
    allow_headers=["*"], # Allow all headers
)
# Adding state variables
app.state.qa_chain = None
app.state.retriever = None

app.include_router(router)

@app.get("/health")
def health():
    return {"status": "ok"}
