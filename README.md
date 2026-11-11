
# TeamFlow

TeamFlow is a project management web application I developed to make it easier to organize projects, keep track of tasks, and manage team members in one place.

The application includes a dashboard where users can see their project activity, monitor progress, and keep track of upcoming deadlines.

## Features

- User registration and login
- Dashboard with project and task statistics
- Create, edit, and delete projects
- Manage tasks, priorities, and statuses
- Add and manage team members
- Calendar for tracking task deadlines
- AI-generated task suggestions based on project type
- AI assistant for workspace-related questions
- Separate workspace data for each user

## Built With

**Frontend**
- React
- TypeScript
- CSS
- Vite

**Backend**
- Python
- FastAPI
- SQLAlchemy
- PostgreSQL

**Other Technologies**
- JWT
- Argon2
- OpenAI API
- Git and GitHub

## Project Structure

```text
TeamFlow/
├── frontend/
│   ├── src/
│   └── package.json
│
├── backend/
│   ├── models/
│   ├── schemas/
│   ├── main.py
│   ├── database.py
│   └── requirements.txt
│
└── README.md
```

## Running the Project Locally

### Frontend

```bash
cd frontend
npm install
npm run dev
```

### Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn main:app --reload
```

The frontend will be available at:

`http://localhost:5173`

The backend API will be available at:

`http://127.0.0.1:8000`

API documentation:

`http://127.0.0.1:8000/docs`

## About the Project

I built TeamFlow as a full-stack development project to work with both frontend and backend technologies, database management, API integration, and user authentication.

Throughout development, I focused on making the main features work together properly, from creating projects and managing tasks to tracking progress through the dashboard.

The project is still open to improvements and additional features.

## Author

**Dafina Hyseni**
