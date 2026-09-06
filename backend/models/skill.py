from sqlalchemy import Column, Integer, String

from database import Base


class Skill(Base):
    __tablename__ = "skills"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(
        String(100),
        unique=True,
        nullable=False,
        index=True
    )

    category = Column(
        String(100),
        nullable=True
    )