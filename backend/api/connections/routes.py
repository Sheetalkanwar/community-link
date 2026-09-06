from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from database import get_db
from security import get_current_user
from models.user import User
from models.connection import Connection


router = APIRouter(
    prefix="/api/connections",
    tags=["Connections"]
)


@router.post("/{receiver_id}")
def send_connection_request(
    receiver_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    if receiver_id == current_user.id:
        raise HTTPException(
            status_code=400,
            detail="You cannot connect with yourself"
        )

    receiver = (
        db.query(User)
        .filter(User.id == receiver_id)
        .first()
    )

    if not receiver:
        raise HTTPException(
            status_code=404,
            detail="User not found"
        )

    existing = (
        db.query(Connection)
        .filter(
            Connection.sender_id == current_user.id,
            Connection.receiver_id == receiver_id
        )
        .first()
    )

    if existing:
        raise HTTPException(
            status_code=400,
            detail="Connection request already sent"
        )

    reverse = (
        db.query(Connection)
        .filter(
            Connection.sender_id == receiver_id,
            Connection.receiver_id == current_user.id
        )
        .first()
    )

    if reverse:
        raise HTTPException(
            status_code=400,
            detail="This user has already sent you a connection request"
        )

    connection = Connection(
        sender_id=current_user.id,
        receiver_id=receiver_id,
        status="PENDING"
    )

    db.add(connection)
    db.commit()
    db.refresh(connection)

    return {
        "message": "Connection request sent",
        "connection_id": connection.id,
        "status": connection.status
    }


@router.get("/received")
def get_received_requests(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    requests = (
        db.query(Connection, User)
        .join(
            User,
            User.id == Connection.sender_id
        )
        .filter(
            Connection.receiver_id == current_user.id,
            Connection.status == "PENDING"
        )
        .all()
    )

    return [
        {
            "connection_id": connection.id,
            "user_id": user.id,
            "name": user.name,
            "bio": user.bio,
            "location": user.location,
            "status": connection.status
        }
        for connection, user in requests
    ]


@router.put("/{connection_id}/accept")
def accept_connection(
    connection_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    connection = (
        db.query(Connection)
        .filter(
            Connection.id == connection_id,
            Connection.receiver_id == current_user.id,
            Connection.status == "PENDING"
        )
        .first()
    )

    if not connection:
        raise HTTPException(
            status_code=404,
            detail="Connection request not found"
        )

    connection.status = "ACCEPTED"

    db.commit()
    db.refresh(connection)

    return {
        "message": "Connection accepted",
        "status": connection.status
    }


@router.put("/{connection_id}/reject")
def reject_connection(
    connection_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    connection = (
        db.query(Connection)
        .filter(
            Connection.id == connection_id,
            Connection.receiver_id == current_user.id,
            Connection.status == "PENDING"
        )
        .first()
    )

    if not connection:
        raise HTTPException(
            status_code=404,
            detail="Connection request not found"
        )

    connection.status = "REJECTED"

    db.commit()
    db.refresh(connection)

    return {
        "message": "Connection rejected",
        "status": connection.status
    }

@router.get("/")
def get_connections(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    connections = (
        db.query(Connection, User)
        .join(
            User,
            (
                (User.id == Connection.sender_id) |
                (User.id == Connection.receiver_id)
            )
        )
        .filter(
            Connection.status == "ACCEPTED",
            (
                (Connection.sender_id == current_user.id) |
                (Connection.receiver_id == current_user.id)
            ),
            User.id != current_user.id,
        )
        .all()
    )

    return [
        {
            "connection_id": connection.id,
            "user_id": user.id,
            "name": user.name,
            "bio": user.bio,
            "location": user.location,
        }
        for connection, user in connections
    ]

