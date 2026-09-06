from sqlalchemy import Column, Integer, String, Text
from database import Base


class Community(Base):
    __tablename__ = "communities"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    name = Column(
        String(100),
        nullable=False
    )

    description = Column(
        Text,
        nullable=False
    )

    category = Column(
        String(50),
        nullable=False
    )

    created_by = Column(
        Integer,
        nullable=False
    )