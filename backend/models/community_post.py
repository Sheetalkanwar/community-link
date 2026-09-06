from sqlalchemy import Column, Integer, Text, ForeignKey
from database import Base


class CommunityPost(Base):
    __tablename__ = "community_posts"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    community_id = Column(
        Integer,
        ForeignKey("communities.id"),
        nullable=False
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    content = Column(
        Text,
        nullable=False
    )