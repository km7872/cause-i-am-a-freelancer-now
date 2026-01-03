# Panther AI

## Project Description

Panther AI is an AI-powered productivity ecosystem built specifically for freelancers and independent contractors to manage the complexities of multi-client work. It transforms static contract documents into an interactive command center, ensuring professionals stay ahead of deadlines and are always prepared for stakeholder meetings.

## 📸 Demo
TBD

## 📦 Installation steps
Follow these steps to get Panther AI up and running:

### 1. Clone the Repository

First, clone the project repository to your local machine and change the directory to cause-i-am-a-freelancer-now

`git clone hhttps://github.com/km7872/cause-i-am-a-freelancer-now.git`

### 2. Environment variables setup
Create a .env file in the project root and add the below keys with their values.

#### GEMINI API KEY
    Steps to Generate a Gemini API Key

    1. Go to Google AI Studio: Open a web browser and go to the Google AI Studio API key page.

    2. Sign In: Log in with your Google account. You may need to review and accept the Terms of Service.

    3. Create API Key: Click the Create API key button.

    4. Select a Project: Select an existing Google Cloud project or create a new one. A new project will be created by default if you do not have any.

    5. Copy the Key: The API key will be generated and displayed. Copy this key immediately, as it will not be shown again for security reasons. Once copied you can paste the code in .env file
        "GEMINI_API_KEY=xxxxxxxx"

    6. Store Securely: Store your API key in a secure location, such as a password manager or as an environment variable in your development environment. 

#### EMAIL_TO
    Your choice of destination email address

    EMAIL_TO="xxx@gmail.com"

#### EMAIL_FROM
    Your choice of source email address

    EMAIL_FROM="xxx@gmail.com"

#### EMAIL_PASS
    Steps to Generate the SMTP_PASS(in this case EMAIL_PASS)

    1. Go to your Google Account Settings.
    
    2. Navigate to Security.
    
    3. Under "How you sign in to Google," ensure 2-Step Verification is ON.
    
    4. Search for "App passwords" in the top search bar (or look for it under the 2-Step Verification section).
    
    5. Enter a name (e.g., "RAG Email Agent").
    
    6. Google will give you a 16-character code (e.g., abcd efgh ijkl mnop).
    
    7. Copy this code and use it as your EMAIL_PASS in your .env file.
        "EMAIL_PASS=xxxxxxxx"
    
    [!IMPORTANT] Do not include the spaces when you paste the password into your code.

#### REDIS_HOST
    REDIS_HOST=localhost

#### REDIS_PORT
    REDIS_PORT=6379
    
### 3. Redis Setup
To start redis: `docker run -d -p 6379:6379 redis`

### 4. Backend Setup
1. Navigate into the cause-i-am-a-freelancer-now directory:
`cd cause-i-am-a-freelancer-now`

2. Create and activate a Python virtual environment:
`python -m venv venv && source venv/bin/activate`
On Windows, use `venv\Scripts\activate`

3. Install the required Python packages:
`pip install -r requirements.txt` (only first time)

4. Start the backend server:
`uvicorn app.main:app --reload`
(The backend server will typically run on  http://localhost:8000 .)

### 5. Frontend Setup
1. Open a new terminal window or tab and navigate back to the root cause-i-am-a-freelancer-now directory, then into the frontend  directory:
`cd .. && cd frontend`

2. Install the required node packages:
`npm install` (only first time)

3. Run the frontend application:
`npm run dev`
(The frontend application will typically open in your web browser at  http://localhost:8080  or a similar port.)

## 🛠 Usage
Once both the backend and frontend servers are running, open your web browser and navigate to the frontend application (usually `http://localhost:8080`).

*   **Submit the PDF Document** - Submit the contract by clicking on the "+ Add contract button" on the top right corner.
*   **Chat with your contract** - Click on any contract present on the dashboard and chat regarding your deliverables, pay and termination details

## Core Capabilities

### Smart Contract Dashboard
Centralizes multi-client engagements, automatically extracting and visualizing roles, companies, and timelines.

### Contractual Intelligence (RAG)
An AI-driven chat interface that allows users to query their agreements for instant clarity on payment terms, notice periods, and deliverables.

### Agentic Escalation
A "fail-safe" RAG workflow that identifies information gaps and automatically triggers email escalations to clients or support when the AI cannot find a definitive answer.

### Proactive Lifecycle Alerts
Automated reminder engine that defaults to a 30-day "Contract Ending" warning, preventing gaps in income and ensuring timely renewals.

### Meeting Prep & "Rant" Log
A unique feedback loop where users log daily wins, challenges (rants), and progress. The AI synthesizes these updates to generate structured reports for Stand-up calls, Weekly syncs, and Managerial reviews.

### Customizable Notification Engine
Highly flexible cadence (daily, weekly, monthly) for progress check-ins, ensuring freelancers never walk into a meeting unprepared.

## ✨ Current Features that were implemented for the MVP
- **Chat with the contract**: Users can interact with the chat agent to clarify information related to deliverables, pay, termination details, contract extensions etc. 
- **Email support for escalation**: If the chat agent cannot provide answer for the user query, an email agent will be instantiated to send email to the contract provider mentioning the user query in the email body.

## ✨ Future Features to be implemented
- **Update Portfolio**: Users can add the work items they have been working on.
- **Prep for Standup**: The user can use the data from update portfolio whenever they want to prepare for stand up call, weekly meeting/ call with manager.
- **View Reminders**: The users can set up reminders for contract - default 30 days before ending

## Redis Usage
To optimize performance, the system utilizes ***Redis as a semantic cache***. This layer identifies repetitive queries and serves previously generated answers directly from the vector store, bypassing the LLM to minimize token consumption and thereby saving cost.

## 🧰 Tech Stack
**Backend:**
*   Python 3.12
*   FastAPI
*   Gemini LLM
*   Redis (Vector Similarity Search)
*   LangChain & Pydantic (Orchestration)

**Frontend:**
*   ReactJS
*  Typescript

**Prerequisites:**
*   Python 3.8+
*   Gemini Account and API key
*   A suitable IDE (Pycharm, vscode)


## Credits/Resources used
* **Lovable** - For quickly developing the Frontend for our application
* **Gemini** - Gemini LLM for answering the user queries

## Results

### Chat Interface Output
<img width="1673" height="949" alt="Image" src="https://github.com/user-attachments/assets/239a0ef4-beba-48a3-97f1-d4caee6ce2cf" />

### Dashboard Output
<img width="1673" height="949" alt="Image" src="https://github.com/user-attachments/assets/50beb9bf-d639-4b13-9494-9b80782df0f1" />


To stop Redis: `docker stop redis` 

To remove it: `docker rm redis`

