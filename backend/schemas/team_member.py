from pydantic import BaseModel, EmailStr
from typing import Optional


class TeamMemberBase(BaseModel):
    name: str
    email: EmailStr
    role: str
    avatar: Optional[str] = None


class TeamMemberCreate(TeamMemberBase):
    pass


class TeamMemberUpdate(TeamMemberBase):
    pass


class TeamMemberResponse(TeamMemberBase):
    id: int

    class Config:
        from_attributes = True