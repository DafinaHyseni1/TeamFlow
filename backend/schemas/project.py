from pydantic import BaseModel
from typing import Optional


class ProjectBase(BaseModel):
    name: str
    category: str
    description: Optional[str] = None
    progress: int = 0
    color: str = "purple"
    total_tasks: int = 0
    completed_tasks: int = 0


class ProjectCreate(ProjectBase):
    pass


class ProjectUpdate(ProjectBase):
    pass


class ProjectResponse(ProjectBase):
    id: int

    class Config:
        from_attributes = True