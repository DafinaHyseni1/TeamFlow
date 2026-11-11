from sqlalchemy import Column, Integer, String, ForeignKey
from sqlalchemy.orm import relationship
from database import Base


class Task(Base):
    __tablename__ = "tasks"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)

    project_id = Column(
        Integer,
        ForeignKey("projects.id"),
        nullable=False
    )

    priority = Column(String(20), default="Medium")
    status = Column(String(30), default="To Do")
    due_date = Column(String(20), nullable=True)

    project = relationship("Project", backref="tasks")
