from sqlalchemy import Column, Integer, String, ForeignKey

from database import Base


class ConnectionRequest(Base):
    __tablename__ = "connection_requests"

    id = Column(
        Integer,
        primary_key=True,
        index=True
    )

    sender_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    receiver_id = Column(
        Integer,
        ForeignKey("users.id"),
        nullable=False
    )

    status = Column(
        String(20),
        nullable=False,
        default="PENDING"
    )