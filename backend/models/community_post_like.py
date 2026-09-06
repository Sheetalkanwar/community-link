from sqlalchemy import Column, Integer, ForeignKey, UniqueConstraint

from database import Base


class CommunityPostLike(Base):
    __tablename__ = "community_post_likes"

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

    __table_args__ = (
        UniqueConstraint(
            "community_post_id",
            "user_id",
            name="unique_community_post_user_like",
        ),
    )