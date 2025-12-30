from langchain.chat_models import init_chat_model
from langchain_huggingface import HuggingFaceEmbeddings
from langchain_core.prompts import ChatPromptTemplate, MessagesPlaceholder

embeddings = HuggingFaceEmbeddings(model_name="sentence-transformers/all-MiniLM-L6-v2")
llm = init_chat_model("gemini-2.5-flash", model_provider="google_genai")
# template = """
# You are a factual assistant. Answer the question below ONLY using the provided context.
# If the information is not in the context, you must say: "No information available."
#
# CONTEXT:
# {context}
#
# QUESTION: {question}
#
# ANSWER:"""

prompt = ChatPromptTemplate.from_messages([
    ("system", """You are a factual assistant. Answer the question below ONLY using the provided context.
If the information is not in the context, use the 'escalate_to_email' tool.

CONTEXT:
{context}"""),
    ("human", "{question}"),
    # This placeholder is the "scratchpad" the agent needs to track tool calls
    MessagesPlaceholder(variable_name="agent_scratchpad"),
])

FEEDBACK_CSV_FILE = "feedback.csv"
