import os
import smtplib
from langchain_core.tools import tool
from app.models.email import EmailSchema
from email.mime.text import MIMEText

@tool("escalate_to_email", args_schema=EmailSchema)
def escalate_to_email(query: str, reason: str):
    """
    Call this tool ONLY when the available context does not contain the answer
    to the user's question. This will email the support team for a manual response.
    """
    # Placeholder for your SMTP/SendGrid logic
    email = os.getenv("EMAIL_FROM")
    password = os.getenv("EMAIL_PASS")
    smtp_host = "smtp.gmail.com"
    smtp_port = 587


    msg = MIMEText(f"The contractor has query with respect to {query}. Looking forward to hearing from you. \n Best, \n User")
    msg["From"] = email
    msg["To"] = os.getenv("EMAIL_TO")
    msg["Subject"] = f"Help needed for user asked query - {query}"

    with smtplib.SMTP(smtp_host, smtp_port) as server:
        server.starttls()
        server.login(email, password)
        server.send_message(msg)

    return  f"Sent escalation email regarding {query}"
