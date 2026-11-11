from pydantic import BaseModel
from typing import Optional


class TaskBase(BaseModel):
    name: str
    project_id: int
    priority: str = "Medium"
    status: str = "To Do"
    due_date: Optional[str] = None


class TaskCreate(TaskBase):
    pass


class TaskUpdate(TaskBase):
    pass


class TaskResponse(TaskBase):
    id: int

    class Config:
        from_attributes = True