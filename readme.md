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


Run backend by uvicorn app.main:app --reload in one cmd
...............................................................
Run frontend 
cd frontend
npm install (only first time)
npm run dev


Redis: 
.............................................
Create a .env file in the project root:

REDIS_HOST=localhost
REDIS_PORT=6379
⚠️ .env is not committed. Each developer must create their own.
(Optionally can also add GoogleAPIKEY here)

To start redis: docker run -d -p 6379:6379 redis

To stop Redis: docker stop redis

To remove it: docker rm redis
................................................


