from langchain.chat_models import init_chat_model
from langchain_huggingface import HuggingFaceEmbeddings

embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
llm = init_chat_model("gemini-2.5-flash", model_provider="google_genai")
template = """
You are a factual assistant. Answer the question below ONLY using the provided context.
If the information is not in the context, you must say: "No information available."

CONTEXT:
{context}

QUESTION: {question}

ANSWER:"""
FEEDBACK_CSV_FILE = "feedback.csv"
