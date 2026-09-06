from sqlalchemy import Column, Integer, ForeignKey
from database import Base


class CommunityMember(Base):
    __tablename__ = "community_members"

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