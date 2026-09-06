from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from models.post_like import PostLike
from database import get_db
from security import get_current_user
from models.user import User
from models.post import Post
from models.post_comment import PostComment


router = APIRouter(
    prefix="/api/posts",
    tags=["Posts"]
)


class CreatePostRequest(BaseModel):
    type: str
    title: str
    description: str


@router.post("/")
def create_post(
    post_data: CreatePostRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    allowed_types = [
        "Need Help",
        "Offer Help",
        "Study",
        "Lost & Found",
        "Buy & Sell",
        "Activities",
    ]

    if post_data.type not in allowed_types:
        raise HTTPException(
            status_code=400,
            detail="Invalid post type"
        )

    post = Post(
        user_id=current_user.id,
        type=post_data.type,
        title=post_data.title,
        description=post_data.description,
    )

    db.add(post)
    db.commit()
    db.refresh(post)

    return {
        "message": "Post created successfully",
        "post": {
            "id": post.id,
            "type": post.type,
            "title": post.title,
            "description": post.description,
            "user_id": post.user_id,
        }
    }


@router.get("/")
def get_posts(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    results = (
        db.query(Post, User)
        .join(
            User,
            Post.user_id == User.id
        )
        .order_by(Post.id.desc())
        .all()
    )

    return [
        {
            "id": post.id,
            "type": post.type,
            "title": post.title,
            "description": post.description,
            "user_id": user.id,
            "author": user.name,
            "likes": db.query(PostLike)
                .filter(
                    PostLike.post_id == post.id
                )
                .count(),
            "liked_by_current_user": db.query(PostLike)
                .filter(
                    PostLike.post_id == post.id,
                    PostLike.user_id == current_user.id
                )
                .first() is not None,
        }
        for post, user in results
    ]


@router.delete("/{post_id}")
def delete_post(
    post_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    post = (
        db.query(Post)
        .filter(Post.id == post_id)
        .first()
    )

    if not post:
        raise HTTPException(
            status_code=404,
            detail="Post not found"
        )

    if post.user_id != current_user.id:
        raise HTTPException(
            status_code=403,
            detail="You can only delete your own posts"
        )

    db.delete(post)
    db.commit()

    return {
        "message": "Post deleted successfully"
    }

@router.post("/{post_id}/like")
def like_post(
    post_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    post = (
        db.query(Post)
        .filter(Post.id == post_id)
        .first()
    )

    if not post:
        raise HTTPException(
            status_code=404,
            detail="Post not found"
        )

    existing_like = (
        db.query(PostLike)
        .filter(
            PostLike.post_id == post_id,
            PostLike.user_id == current_user.id
        )
        .first()
    )

    if existing_like:
        raise HTTPException(
            status_code=400,
            detail="Post already liked"
        )

    like = PostLike(
        post_id=post_id,
        user_id=current_user.id
    )

    db.add(like)
    db.commit()

    like_count = (
        db.query(PostLike)
        .filter(
            PostLike.post_id == post_id
        )
        .count()
    )

    return {
        "message": "Post liked successfully",
        "liked": True,
        "likes": like_count
    }


@router.delete("/{post_id}/like")
def unlike_post(
    post_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    like = (
        db.query(PostLike)
        .filter(
            PostLike.post_id == post_id,
            PostLike.user_id == current_user.id
        )
        .first()
    )

    if not like:
        raise HTTPException(
            status_code=404,
            detail="Like not found"
        )

    db.delete(like)
    db.commit()

    like_count = (
        db.query(PostLike)
        .filter(
            PostLike.post_id == post_id
        )
        .count()
    )

    return {
        "message": "Post unliked successfully",
        "liked": False,
        "likes": like_count
    }

class CreateCommentRequest(BaseModel):
    content: str


@router.post("/{post_id}/comments")
def create_comment(
    post_id: int,
    comment_data: CreateCommentRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    post = (
        db.query(Post)
        .filter(Post.id == post_id)
        .first()
    )

    if not post:
        raise HTTPException(
            status_code=404,
            detail="Post not found"
        )

    if not comment_data.content.strip():
        raise HTTPException(
            status_code=400,
            detail="Comment cannot be empty"
        )

    comment = PostComment(
        post_id=post_id,
        user_id=current_user.id,
        content=comment_data.content.strip(),
    )

    db.add(comment)
    db.commit()
    db.refresh(comment)

    return {
        "message": "Comment added successfully",
        "comment": {
            "id": comment.id,
            "post_id": comment.post_id,
            "user_id": comment.user_id,
            "author": current_user.name,
            "content": comment.content,
            "created_at": comment.created_at,
        }
    }


@router.get("/{post_id}/comments")
def get_post_comments(
    post_id: int,
    db: Session = Depends(get_db),
):
    post = (
        db.query(Post)
        .filter(Post.id == post_id)
        .first()
    )

    if not post:
        raise HTTPException(
            status_code=404,
            detail="Post not found"
        )

    results = (
        db.query(PostComment, User)
        .join(
            User,
            PostComment.user_id == User.id
        )
        .filter(
            PostComment.post_id == post_id
        )
        .order_by(
            PostComment.created_at.asc()
        )
        .all()
    )

    return [
        {
            "id": comment.id,
            "post_id": comment.post_id,
            "user_id": user.id,
            "author": user.name,
            "content": comment.content,
            "created_at": comment.created_at,
        }
        for comment, user in results
    ]