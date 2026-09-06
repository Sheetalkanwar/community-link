from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from database import SessionLocal
from security import get_current_user
from models.user import User
from models.connection_request import ConnectionRequest


router = APIRouter(
    prefix="/api/requests",
    tags=["Connection Requests"],
)


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()


class ConnectionRequestCreate(BaseModel):
    receiver_id: int


@router.post("/")
def send_connection_request(
    request_data: ConnectionRequestCreate,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if request_data.receiver_id == current_user.id:
        raise HTTPException(
            status_code=400,
            detail="You cannot send a request to yourself",
        )

    receiver = (
        db.query(User)
        .filter(User.id == request_data.receiver_id)
        .first()
    )

    if not receiver:
        raise HTTPException(
            status_code=404,
            detail="User not found",
        )

    existing_request = (
        db.query(ConnectionRequest)
        .filter(
            ConnectionRequest.sender_id == current_user.id,
            ConnectionRequest.receiver_id == request_data.receiver_id,
            ConnectionRequest.status == "PENDING",
        )
        .first()
    )

    if existing_request:
        raise HTTPException(
            status_code=400,
            detail="Connection request already sent",
        )

    connection_request = ConnectionRequest(
        sender_id=current_user.id,
        receiver_id=request_data.receiver_id,
        status="PENDING",
    )

    db.add(connection_request)
    db.commit()
    db.refresh(connection_request)

    return {
        "message": "Connection request sent",
        "request_id": connection_request.id,
        "receiver_id": receiver.id,
        "status": connection_request.status,
    }


@router.get("/received")
def get_received_requests(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    requests = (
        db.query(ConnectionRequest, User)
        .join(
            User,
            User.id == ConnectionRequest.sender_id
        )
        .filter(
            ConnectionRequest.receiver_id == current_user.id,
            ConnectionRequest.status == "PENDING",
        )
        .all()
    )

    return [
        {
            "request_id": request.id,
            "sender_id": sender.id,
            "sender_name": sender.name,
            "sender_email": sender.email,
            "sender_bio": sender.bio,
            "sender_location": sender.location,
            "status": request.status,
        }
        for request, sender in requests
    ]