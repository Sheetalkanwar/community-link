from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session

from database import get_db
from security import get_current_user

from models.user import User
from models.community import Community
from models.community_member import CommunityMember
from models.community_post import CommunityPost
from models.community_post_like import CommunityPostLike
from models.community_post_comment import CommunityPostComment


router = APIRouter(
    prefix="/api/communities",
    tags=["Communities"],
)


# =========================================================
# Request Models
# =========================================================

class CreateCommunityRequest(BaseModel):
    name: str
    description: str
    category: str


class CreatePostRequest(BaseModel):
    content: str


class CreateCommentRequest(BaseModel):
    content: str


# =========================================================
# Allowed Categories
# =========================================================

ALLOWED_CATEGORIES = [
    "Study",
    "Creative",
    "Activities",
    "Technology",
    "Hobbies",
]


# =========================================================
# Get All Communities
# =========================================================

@router.get("/")
def get_communities(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    communities = (
        db.query(Community)
        .order_by(Community.id.desc())
        .all()
    )

    result = []

    for community in communities:

        member_count = (
            db.query(CommunityMember)
            .filter(
                CommunityMember.community_id == community.id
            )
            .count()
        )

        membership = (
            db.query(CommunityMember)
            .filter(
                CommunityMember.community_id == community.id,
                CommunityMember.user_id == current_user.id,
            )
            .first()
        )

        result.append(
            {
                "id": community.id,
                "name": community.name,
                "description": community.description,
                "category": community.category,
                "members": member_count,
                "joined": membership is not None,
                "created_by": community.created_by,
            }
        )

    return result


# =========================================================
# Get Single Community
# =========================================================

@router.get("/{community_id}")
def get_community(
    community_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    community = (
        db.query(Community)
        .filter(
            Community.id == community_id
        )
        .first()
    )

    if not community:
        raise HTTPException(
            status_code=404,
            detail="Community not found",
        )

    members = (
        db.query(CommunityMember)
        .filter(
            CommunityMember.community_id == community_id
        )
        .all()
    )

    joined = any(
        member.user_id == current_user.id
        for member in members
    )

    member_list = []

    for member in members:

        user = (
            db.query(User)
            .filter(
                User.id == member.user_id
            )
            .first()
        )

        if user:
            member_list.append(
                {
                    "id": user.id,
                    "name": user.name,
                }
            )

    return {
        "id": community.id,
        "name": community.name,
        "description": community.description,
        "category": community.category,
        "members": len(members),
        "joined": joined,
        "created_by": community.created_by,
        "member_list": member_list,
    }


# =========================================================
# Create Community
# =========================================================

@router.post("/")
def create_community(
    community_data: CreateCommunityRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    name = community_data.name.strip()
    description = community_data.description.strip()
    category = community_data.category.strip()

    if not name:
        raise HTTPException(
            status_code=400,
            detail="Community name cannot be empty",
        )

    if not description:
        raise HTTPException(
            status_code=400,
            detail="Community description cannot be empty",
        )

    if category not in ALLOWED_CATEGORIES:
        raise HTTPException(
            status_code=400,
            detail="Invalid community category",
        )

    existing = (
        db.query(Community)
        .filter(
            Community.name == name
        )
        .first()
    )

    if existing:
        raise HTTPException(
            status_code=400,
            detail="A community with this name already exists",
        )

    community = Community(
        name=name,
        description=description,
        category=category,
        created_by=current_user.id,
    )

    db.add(community)
    db.commit()
    db.refresh(community)

    member = CommunityMember(
        community_id=community.id,
        user_id=current_user.id,
    )

    db.add(member)
    db.commit()

    return {
        "message": "Community created successfully",
        "community": {
            "id": community.id,
            "name": community.name,
            "description": community.description,
            "category": community.category,
            "members": 1,
            "joined": True,
            "created_by": community.created_by,
        },
    }


# =========================================================
# Join Community
# =========================================================

@router.post("/{community_id}/join")
def join_community(
    community_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    community = (
        db.query(Community)
        .filter(
            Community.id == community_id
        )
        .first()
    )

    if not community:
        raise HTTPException(
            status_code=404,
            detail="Community not found",
        )

    existing_member = (
        db.query(CommunityMember)
        .filter(
            CommunityMember.community_id == community_id,
            CommunityMember.user_id == current_user.id,
        )
        .first()
    )

    if existing_member:
        raise HTTPException(
            status_code=400,
            detail="You are already a member of this community",
        )

    member = CommunityMember(
        community_id=community_id,
        user_id=current_user.id,
    )

    db.add(member)
    db.commit()

    member_count = (
        db.query(CommunityMember)
        .filter(
            CommunityMember.community_id == community_id
        )
        .count()
    )

    return {
        "message": "Joined community successfully",
        "members": member_count,
        "joined": True,
    }


# =========================================================
# Leave Community
# =========================================================

@router.delete("/{community_id}/leave")
def leave_community(
    community_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    community = (
        db.query(Community)
        .filter(
            Community.id == community_id
        )
        .first()
    )

    if not community:
        raise HTTPException(
            status_code=404,
            detail="Community not found",
        )

    membership = (
        db.query(CommunityMember)
        .filter(
            CommunityMember.community_id == community_id,
            CommunityMember.user_id == current_user.id,
        )
        .first()
    )

    if not membership:
        raise HTTPException(
            status_code=400,
            detail="You are not a member of this community",
        )

    if community.created_by == current_user.id:
        raise HTTPException(
            status_code=400,
            detail="Community creator cannot leave the community",
        )

    db.delete(membership)
    db.commit()

    member_count = (
        db.query(CommunityMember)
        .filter(
            CommunityMember.community_id == community_id
        )
        .count()
    )

    return {
        "message": "Left community successfully",
        "members": member_count,
        "joined": False,
    }


# =========================================================
# Get Community Posts
# =========================================================

@router.get("/{community_id}/posts")
def get_community_posts(
    community_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    community = (
        db.query(Community)
        .filter(
            Community.id == community_id
        )
        .first()
    )

    if not community:
        raise HTTPException(
            status_code=404,
            detail="Community not found",
        )

    posts = (
        db.query(CommunityPost)
        .filter(
            CommunityPost.community_id == community_id
        )
        .order_by(
            CommunityPost.id.desc()
        )
        .all()
    )

    result = []

    for post in posts:

        user = (
            db.query(User)
            .filter(
                User.id == post.user_id
            )
            .first()
        )

        like_count = (
            db.query(CommunityPostLike)
            .filter(
                CommunityPostLike.community_post_id == post.id
            )
            .count()
        )

        liked_by_current_user = (
            db.query(CommunityPostLike)
            .filter(
                CommunityPostLike.community_post_id == post.id,
                CommunityPostLike.user_id == current_user.id,
            )
            .first()
            is not None
        )

        comment_count = (
            db.query(CommunityPostComment)
            .filter(
                CommunityPostComment.community_post_id == post.id
            )
            .count()
        )

        result.append(
            {
                "id": post.id,
                "content": post.content,
                "user_id": post.user_id,
                "user_name": (
                    user.name
                    if user
                    else "Unknown User"
                ),
                "community_id": post.community_id,
                "likes": like_count,
                "liked_by_current_user": liked_by_current_user,
                "comments": comment_count,
            }
        )

    return result


# =========================================================
# Create Community Post
# =========================================================

@router.post("/{community_id}/posts")
def create_community_post(
    community_id: int,
    post_data: CreatePostRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    community = (
        db.query(Community)
        .filter(
            Community.id == community_id
        )
        .first()
    )

    if not community:
        raise HTTPException(
            status_code=404,
            detail="Community not found",
        )

    membership = (
        db.query(CommunityMember)
        .filter(
            CommunityMember.community_id == community_id,
            CommunityMember.user_id == current_user.id,
        )
        .first()
    )

    if not membership:
        raise HTTPException(
            status_code=403,
            detail="You must join the community before creating a post",
        )

    content = post_data.content.strip()

    if not content:
        raise HTTPException(
            status_code=400,
            detail="Post content cannot be empty",
        )

    post = CommunityPost(
        community_id=community_id,
        user_id=current_user.id,
        content=content,
    )

    db.add(post)
    db.commit()
    db.refresh(post)

    return {
        "id": post.id,
        "content": post.content,
        "user_id": post.user_id,
        "user_name": current_user.name,
        "community_id": post.community_id,
        "likes": 0,
        "liked_by_current_user": False,
        "comments": 0,
    }


# =========================================================
# Like Community Post
# =========================================================

@router.post("/{community_id}/posts/{post_id}/like")
def like_community_post(
    community_id: int,
    post_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    community = (
        db.query(Community)
        .filter(
            Community.id == community_id
        )
        .first()
    )

    if not community:
        raise HTTPException(
            status_code=404,
            detail="Community not found",
        )

    membership = (
        db.query(CommunityMember)
        .filter(
            CommunityMember.community_id == community_id,
            CommunityMember.user_id == current_user.id,
        )
        .first()
    )

    if not membership:
        raise HTTPException(
            status_code=403,
            detail="You must join the community first",
        )

    post = (
        db.query(CommunityPost)
        .filter(
            CommunityPost.id == post_id,
            CommunityPost.community_id == community_id,
        )
        .first()
    )

    if not post:
        raise HTTPException(
            status_code=404,
            detail="Community post not found",
        )

    existing_like = (
        db.query(CommunityPostLike)
        .filter(
            CommunityPostLike.community_post_id == post_id,
            CommunityPostLike.user_id == current_user.id,
        )
        .first()
    )

    if existing_like:
        raise HTTPException(
            status_code=400,
            detail="Post already liked",
        )

    like = CommunityPostLike(
        community_post_id=post_id,
        user_id=current_user.id,
    )

    db.add(like)
    db.commit()

    like_count = (
        db.query(CommunityPostLike)
        .filter(
            CommunityPostLike.community_post_id == post_id
        )
        .count()
    )

    return {
        "message": "Community post liked successfully",
        "liked": True,
        "likes": like_count,
    }


# =========================================================
# Unlike Community Post
# =========================================================

@router.delete("/{community_id}/posts/{post_id}/like")
def unlike_community_post(
    community_id: int,
    post_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    community = (
        db.query(Community)
        .filter(
            Community.id == community_id
        )
        .first()
    )

    if not community:
        raise HTTPException(
            status_code=404,
            detail="Community not found",
        )

    membership = (
        db.query(CommunityMember)
        .filter(
            CommunityMember.community_id == community_id,
            CommunityMember.user_id == current_user.id,
        )
        .first()
    )

    if not membership:
        raise HTTPException(
            status_code=403,
            detail="You must join the community first",
        )

    post = (
        db.query(CommunityPost)
        .filter(
            CommunityPost.id == post_id,
            CommunityPost.community_id == community_id,
        )
        .first()
    )

    if not post:
        raise HTTPException(
            status_code=404,
            detail="Community post not found",
        )

    like = (
        db.query(CommunityPostLike)
        .filter(
            CommunityPostLike.community_post_id == post_id,
            CommunityPostLike.user_id == current_user.id,
        )
        .first()
    )

    if not like:
        raise HTTPException(
            status_code=404,
            detail="Like not found",
        )

    db.delete(like)
    db.commit()

    like_count = (
        db.query(CommunityPostLike)
        .filter(
            CommunityPostLike.community_post_id == post_id
        )
        .count()
    )

    return {
        "message": "Community post unliked successfully",
        "liked": False,
        "likes": like_count,
    }


# =========================================================
# Create Community Post Comment
# =========================================================

@router.post("/{community_id}/posts/{post_id}/comments")
def create_community_post_comment(
    community_id: int,
    post_id: int,
    comment_data: CreateCommentRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    community = (
        db.query(Community)
        .filter(
            Community.id == community_id
        )
        .first()
    )

    if not community:
        raise HTTPException(
            status_code=404,
            detail="Community not found",
        )

    membership = (
        db.query(CommunityMember)
        .filter(
            CommunityMember.community_id == community_id,
            CommunityMember.user_id == current_user.id,
        )
        .first()
    )

    if not membership:
        raise HTTPException(
            status_code=403,
            detail="You must join the community first",
        )

    post = (
        db.query(CommunityPost)
        .filter(
            CommunityPost.id == post_id,
            CommunityPost.community_id == community_id,
        )
        .first()
    )

    if not post:
        raise HTTPException(
            status_code=404,
            detail="Community post not found",
        )

    content = comment_data.content.strip()

    if not content:
        raise HTTPException(
            status_code=400,
            detail="Comment cannot be empty",
        )

    comment = CommunityPostComment(
        community_post_id=post_id,
        user_id=current_user.id,
        content=content,
    )

    db.add(comment)
    db.commit()
    db.refresh(comment)

    return {
        "message": "Comment added successfully",
        "comment": {
            "id": comment.id,
            "community_post_id": comment.community_post_id,
            "user_id": comment.user_id,
            "author": current_user.name,
            "content": comment.content,
            "created_at": comment.created_at,
        },
    }


# =========================================================
# Get Community Post Comments
# =========================================================

@router.get("/{community_id}/posts/{post_id}/comments")
def get_community_post_comments(
    community_id: int,
    post_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    community = (
        db.query(Community)
        .filter(
            Community.id == community_id
        )
        .first()
    )

    if not community:
        raise HTTPException(
            status_code=404,
            detail="Community not found",
        )

    post = (
        db.query(CommunityPost)
        .filter(
            CommunityPost.id == post_id,
            CommunityPost.community_id == community_id,
        )
        .first()
    )

    if not post:
        raise HTTPException(
            status_code=404,
            detail="Community post not found",
        )

    results = (
        db.query(
            CommunityPostComment,
            User,
        )
        .join(
            User,
            CommunityPostComment.user_id == User.id,
        )
        .filter(
            CommunityPostComment.community_post_id == post_id,
        )
        .order_by(
            CommunityPostComment.created_at.asc()
        )
        .all()
    )

    return [
        {
            "id": comment.id,
            "community_post_id": comment.community_post_id,
            "user_id": user.id,
            "author": user.name,
            "content": comment.content,
            "created_at": comment.created_at,
        }
        for comment, user in results
    ]