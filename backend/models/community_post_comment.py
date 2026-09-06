from sqlalchemy import Column, Integer, Text, ForeignKey, DateTime
from datetime import datetime, timezone

from database import Base


class CommunityPostComment(Base):
    __tablename__ = "community_post_comments"

    id = Column(
        Integer,
        primary_key=True,
        index=True,
    )

    community_post_id = Column(
        Integer,
        ForeignKey("community_posts.id"),
        nullable=False,
    )

    user_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False,
    )

    content = Column(
        Text,
        nullable=False,
    )

    created_at = Column(
        DateTime,
        default=lambda: datetime.now(timezone.utc),
        nullable=False,
    )