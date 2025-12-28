Part 1: Read contract and extract dates

Install dependencies:
pip install -r requirements.txt

Get OpenAPI Key add it in .env in project folder

Run app: uvicorn app.main:app --reload


APIs
POST /upload -> {document_id: uuid}
{file: File}


POST /extract/{document_id} -> {    "start_date": "...", 
                                    "end_date": "...",
                                    "position": "...",
                                    "company": "..."
                                    }

