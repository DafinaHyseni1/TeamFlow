
from datetime import date
import json
import os

from dotenv import load_dotenv
from fastapi import APIRouter, Depends, HTTPException
from openai import OpenAI, APIError, AuthenticationError, RateLimitError
from sqlalchemy.orm import Session

from database import get_db
from auth import get_current_user
from models import Project, Task, TeamMember, User


load_dotenv()

router = APIRouter(prefix="/ai", tags=["AI Assistant"])

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

client = OpenAI(api_key=OPENAI_API_KEY) if OPENAI_API_KEY else None




@router.post("/chat")
def chat_with_ai(
    message: str,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    if client is None:
        raise HTTPException(
            status_code=503,
            detail="OpenAI API key is not configured."
        )

    if not message.strip():
        raise HTTPException(
            status_code=400,
            detail="Message cannot be empty."
        )

    projects = db.query(Project).filter(
        Project.user_id == current_user.id
    ).all()

    tasks = db.query(Task).join(Project).filter(
        Project.user_id == current_user.id
    ).all()

    team_members = db.query(TeamMember).filter(
        TeamMember.user_id == current_user.id
    ).all()

    completed = [t for t in tasks if t.status == "Completed"]
    in_progress = [t for t in tasks if t.status == "In Progress"]
    pending = [t for t in tasks if t.status == "To Do"]

    overdue = []

    for task in tasks:
        if task.due_date and task.status != "Completed":
            try:
                if date.fromisoformat(task.due_date) < date.today():
                    overdue.append(task)
            except ValueError:
                continue

    project_insights = []

    for project in projects:
        project_tasks = [
            task for task in tasks
            if task.project_id == project.id
        ]

        total = len(project_tasks)

        completed_count = sum(
            1 for task in project_tasks
            if task.status == "Completed"
        )

        in_progress_count = sum(
            1 for task in project_tasks
            if task.status == "In Progress"
        )

        pending_count = sum(
            1 for task in project_tasks
            if task.status == "To Do"
        )

        progress = round(
            (
                completed_count * 100
                + in_progress_count * 50
            ) / total
        ) if total else 0

        project_insights.append({
            "project_name": project.name,
            "category": project.category,
            "description": project.description,
            "total_tasks": total,
            "completed_tasks": completed_count,
            "in_progress_tasks": in_progress_count,
            "pending_tasks": pending_count,
            "progress": progress,
            "needs_attention": total == 0 or pending_count > 0
        })

    workspace_data = {
        "total_projects": len(projects),
        "total_tasks": len(tasks),
        "completed_tasks": len(completed),
        "in_progress_tasks": len(in_progress),
        "pending_tasks": len(pending),
        "overdue_tasks": len(overdue),
        "team_members": len(team_members),
        "projects": project_insights
    }

    project_names = {
        project.id: project.name
        for project in projects
    }

    ai_context = {
        "workspace": workspace_data,
        "tasks": [
            {
                "name": task.name,
                "project": project_names.get(
                    task.project_id,
                    "Unknown project"
                ),
                "status": task.status,
                "priority": task.priority,
                "due_date": task.due_date
            }
            for task in tasks
        ],
        "team_roles": [
            member.role for member in team_members
        ]
    }

    instructions = """
    You are TeamFlow AI, an intelligent project management assistant.

    Your job is to help users manage and understand their workspace.

    You have access to the user's TeamFlow workspace data in the input.

    Your responsibilities:
    - Answer questions about projects and their progress.
    - Analyze tasks and their statuses.
    - Identify overdue and pending tasks.
    - Explain project performance.
    - Suggest practical improvements.
    - Help users organize their work.
    - Answer questions about team information when available.

    Rules:
    1. Use the provided workspace data when answering.
    2. Never invent projects, tasks, dates, or statistics.
    3. If information is unavailable, say so clearly.
    4. Give practical and understandable recommendations.
    5. Keep answers structured and easy to read.
    6. Use bullet points when helpful.
    7. Match the language used by the user.
    8. Do not claim that you created, edited, or deleted anything.
       You can only provide advice.
    9. Do not calculate individual team workloads because
       task assignments are not available.
    """

    try:
        ai_response = client.responses.create(
            model="gpt-5.5",
            instructions=instructions,
            input=(
                "TEAMFLOW WORKSPACE DATA:\n"
                f"{json.dumps(ai_context, ensure_ascii=False, indent=2)}"
                "\n\nUSER QUESTION:\n"
                f"{message}"
            ),
            max_output_tokens=800
        )

        response_text = ai_response.output_text

        return {
            "message": message,
            "workspace": workspace_data,
            "response": response_text
        }

    except AuthenticationError:
        raise HTTPException(
            status_code=502,
            detail="OpenAI authentication failed. Check your API key."
        )

    except RateLimitError:
        raise HTTPException(
            status_code=429,
            detail="OpenAI API rate limit or usage limit reached."
        )

    except APIError:
        raise HTTPException(
            status_code=502,
            detail="OpenAI API request failed. Please try again."
        )




@router.post("/generate-tasks")
def generate_project_tasks(
    project_id: int,
    db: Session = Depends(get_db),
    current_user: User = Depends(get_current_user)
):
    project = db.query(Project).filter(
        Project.id == project_id,
        Project.user_id == current_user.id
    ).first()

    if not project:
        raise HTTPException(
            status_code=404,
            detail="Project not found"
        )

    category = project.category.lower()
    project_name = project.name.lower()

    suggestions = []

    if "e-commerce" in category or "e-commerce" in project_name:
        suggestions = [
            "Design the homepage",
            "Build product listing page",
            "Create product details page",
            "Implement shopping cart",
            "Develop checkout functionality",
            "Integrate payment API",
            "Test the application"
        ]

    elif "web" in category or "website" in project_name:
        suggestions = [
            "Define website structure",
            "Design homepage layout",
            "Develop responsive navigation",
            "Build main website pages",
            "Implement frontend functionality",
            "Integrate backend functionality",
            "Test responsive design"
        ]

    elif "software" in category or "development" in category:
        suggestions = [
            "Define project requirements",
            "Design application architecture",
            "Set up development environment",
            "Implement core functionality",
            "Integrate APIs",
            "Perform application testing",
            "Prepare project documentation"
        ]

    else:
        suggestions = [
            "Define project requirements",
            "Create project structure",
            "Plan implementation",
            "Develop core functionality",
            "Test project functionality",
            "Review and finalize project"
        ]

    return {
        "project_id": project.id,
        "project_name": project.name,
        "suggested_tasks": [
            {
                "name": task,
                "priority": "Medium",
                "status": "To Do"
            }
            for task in suggestions
        ],
        "message": (
            f"Generated {len(suggestions)} task suggestions "
            f"for {project.name}."
        )
    }
