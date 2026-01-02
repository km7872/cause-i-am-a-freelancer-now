# from openai import OpenAI
from google.genai import Client
import json
from dotenv import load_dotenv
import os
import re

load_dotenv()

# client = OpenAI(api_key=os.getenv("OPENAI_API_KEY"))
client = Client(api_key=os.getenv("GOOGLE_API_KEY"))
def safe_json_parse(content: str) -> dict:
    content = re.sub(r"```(?:json)?", "", content)
    content = content.replace("```", "").strip()

    return json.loads(content)

def extract_fields(text: str) -> dict:
    prompt = f"""
        You are an information extraction system.

        Extract the following fields from the text below.
        If a field is not present, return null.

        Return ONLY valid JSON.

        Fields:
        - start_date in yyyy-mm-dd format
        - start_date_str - in month day, year format
        - end_date in yyyy-mm-dd format
        - end_date_str - in month day, year format
        - position
        - company
        - salary - give hourly rate only, if salary is annual, divide by 2080, only numbers

        Text:
        \"\"\"
        {text}
        \"\"\"
        """

    # response = client.chat.completions.create(
    #     model="gpt-4o-mini",
    #     messages=[
    #         {"role": "user", "content": prompt}
    #     ],
    #     temperature=0
    # )

    # content = response.choices[0].message.content
    # print(type(content))

    # return json.loads(content)
    response = client.models.generate_content(
    model="gemini-2.5-flash-lite",
    contents=[{
        "role": "user",
        "parts": [{"text": prompt}]
    }],
    config={
        "response_mime_type": "application/json",
        "temperature": 0
    }
)
    content = response.text
    # return content
    return safe_json_parse(content)
    # return {}
