# TeamFlow – AI-Powered Project Management

TeamFlow is a full-stack project management application designed to help teams organize projects, manage tasks, collaborate, and improve productivity with AI-powered assistance.

The application combines a modern React frontend with a Python FastAPI backend and PostgreSQL database.

## Features

### Dashboard
- Overview of projects and tasks
- Project and task statistics
- Centralized workspace

### Project Management
- Create and manage projects
- Organize projects by category
- View project details and progress

### Task Management
- Create, update, and manage tasks
- Assign task priorities and statuses
- Organize tasks within projects

### Team Management
- View team members
- Manage team member information
- Keep team information organized

### AI Assistant
- AI-powered task generation
- Generate suggested tasks based on project requirements
- AI assistance for project planning

### Authentication
- User registration and login
- Password hashing
- JWT-based authentication
- Protected API endpoints

## Tech Stack

**Frontend**
- React
- TypeScript
- Vite
- CSS

**Backend**
- Python
- FastAPI
- SQLAlchemy
- Pydantic
- JWT Authentication

**Database**
- PostgreSQL

**AI Integration**
- OpenAI API

**Development Tools**
- Git
- GitHub
- Visual Studio Code
- npm
- Uvicorn

## Project Structure

```text
TeamFlow/
│
├── backend/
│   ├── models/
│   ├── schemas/
│   ├── ai.py
│   ├── auth.py
│   ├── database.py
│   ├── main.py
│   ├── requirements.txt
│   └── .env
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── ai/
│   │   │   ├── auth/
│   │   │   ├── calendar/
│   │   │   ├── dashboard/
│   │   │   ├── layout/
│   │   │   ├── projects/
│   │   │   ├── settings/
│   │   │   ├── tasks/
│   │   │   └── team/
│   │   ├── services/
│   │   ├── types/
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   └── vite.config.ts
│
├── .gitignore
└── README.md
```

## Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/DafinaHyseni1/TeamFlow.git
cd TeamFlow
```

### 2. Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

Create a virtual environment:

```bash
python3 -m venv venv
```

Activate the environment:

**macOS / Linux**

```bash
source venv/bin/activate
```

Install dependencies:

```bash
pip install -r requirements.txt
```

### 3. Environment Variables

Create a `.env` file inside the backend directory.

Configure the required environment variables:

```env
TEAMFLOW_SECRET_KEY=your_secret_key
OPENAI_API_KEY=your_openai_api_key
DATABASE_URL=your_postgresql_connection_string
```

Replace the example values with your own credentials. Never commit your `.env` file or expose API keys.

### 4. Database Setup

Make sure PostgreSQL is installed and running.

Create a PostgreSQL database for the application and configure its connection string in the backend environment.

### 5. Start the Backend

From the `backend` directory, run:

```bash
uvicorn main:app --reload --port 8001
```

Backend URL:

```text
http://127.0.0.1:8001
```

### 6. Frontend Setup

Open another terminal and navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

Frontend URL:

```text
http://localhost:5173
```

## API

The backend provides REST API endpoints for authentication, projects, tasks, team members, and AI functionality.

Main endpoint groups include:

- `/auth` – User authentication
- `/projects` – Project management
- `/tasks` – Task management
- `/team-members` – Team member management
- `/ai` – AI-powered functionality

## Future Improvements

- Enhanced team collaboration
- Advanced project analytics
- Additional AI-powered productivity features
- Deployment and production optimization

## Author

**Dafina Hyseni**

Software Developer | Frontend & Full-Stack Development

GitHub: https://github.com/DafinaHyseni1

Portfolio: https://dafinahyseni1.github.io/Portfolio
