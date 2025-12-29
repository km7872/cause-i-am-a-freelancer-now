from langchain.chat_models import init_chat_model
from langchain_huggingface import HuggingFaceEmbeddings

embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
llm = init_chat_model("gemini-2.5-flash", model_provider="google_genai")
