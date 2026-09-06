from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from database import get_db
from security import get_current_user
from models.user import User
from models.message import Message
from models.connection import Connection


router = APIRouter(
    prefix="/api/messages",
    tags=["Messages"],
)


class MessageCreate(BaseModel):
    receiver_id: int
    content: str


@router.post("/")
def send_message(
    message_data: MessageCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):

    if message_data.receiver_id == current_user.id:
        raise HTTPException(
            status_code=400,
            detail="You cannot message yourself",
        )

    receiver = (
        db.query(User)
        .filter(User.id == message_data.receiver_id)
        .first()
    )

    if not receiver:
        raise HTTPException(
            status_code=404,
            detail="User not found",
        )

    connection = (
        db.query(Connection)
        .filter(
            (
                (Connection.sender_id == current_user.id)
                & (Connection.receiver_id == message_data.receiver_id)
            )
            |
            (
                (Connection.sender_id == message_data.receiver_id)
                & (Connection.receiver_id == current_user.id)
            ),
            Connection.status == "ACCEPTED",
        )
        .first()
    )

    if not connection:
        raise HTTPException(
            status_code=403,
            detail="You can only message connected users",
        )

    content = message_data.content.strip()

    if not content:
        raise HTTPException(
            status_code=400,
            detail="Message cannot be empty",
        )

    message = Message(
        sender_id=current_user.id,
        receiver_id=message_data.receiver_id,
        content=content,
    )

    db.add(message)
    db.commit()
    db.refresh(message)

    return {
        "message": "Message sent successfully",
        "data": {
            "id": message.id,
            "sender_id": message.sender_id,
            "receiver_id": message.receiver_id,
            "content": message.content,
            "created_at": message.created_at,
        },
    }


@router.get("/{user_id}")
def get_messages(
    user_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):

    if user_id == current_user.id:
        raise HTTPException(
            status_code=400,
            detail="You cannot view messages with yourself",
        )

    connection = (
        db.query(Connection)
        .filter(
            (
                (Connection.sender_id == current_user.id)
                & (Connection.receiver_id == user_id)
            )
            |
            (
                (Connection.sender_id == user_id)
                & (Connection.receiver_id == current_user.id)
            ),
            Connection.status == "ACCEPTED",
        )
        .first()
    )

    if not connection:
        raise HTTPException(
            status_code=403,
            detail="You can only view messages with connected users",
        )

    messages = (
        db.query(Message)
        .filter(
            (
                (Message.sender_id == current_user.id)
                & (Message.receiver_id == user_id)
            )
            |
            (
                (Message.sender_id == user_id)
                & (Message.receiver_id == current_user.id)
            )
        )
        .order_by(Message.created_at.asc())
        .all()
    )

    return [
        {
            "id": message.id,
            "sender_id": message.sender_id,
            "receiver_id": message.receiver_id,
            "content": message.content,
            "created_at": message.created_at,
        }
        for message in messages
    ]