from sqlalchemy import Column, Integer, String, ForeignKey
from database import Base


class UserSkill(Base):
    __tablename__ = "user_skills"

    id = Column(Integer, primary_key=True, index=True)

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    skill_id = Column(
        Integer,
        ForeignKey("skills.id"),
        nullable=False
    )

    type = Column(
        String(20),
        nullable=False
    )

    level = Column(
        String(30),
        nullable=True
    )