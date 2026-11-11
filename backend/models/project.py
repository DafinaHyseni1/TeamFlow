from sqlalchemy import Column, Integer, String, Text, ForeignKey
from sqlalchemy.orm import relationship
from database import Base


class Project(Base):
    __tablename__ = "projects"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    category = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)
    progress = Column(Integer, default=0)
    color = Column(String(50), default="purple")
    total_tasks = Column(Integer, default=0)
    completed_tasks = Column(Integer, default=0)

    user_id = Column(Integer, ForeignKey("users.id"), nullable=True)
    owner = relationship("User", backref="projects")
