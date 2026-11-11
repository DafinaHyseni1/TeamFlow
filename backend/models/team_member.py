
from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from database import Base


class TeamMember(Base):
    __tablename__ = "team_members"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    email = Column(String(255), unique=True, nullable=False)
    role = Column(String(100), nullable=False)
    avatar = Column(String(10), nullable=True)

    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    owner = relationship("User", backref="team_members")
