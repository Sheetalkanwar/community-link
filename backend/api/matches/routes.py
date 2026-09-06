from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session

from database import get_db
from security import get_current_user
from models.user import User
from models.skill import Skill
from models.user_skill import UserSkill


router = APIRouter(
    prefix="/api/matches",
    tags=["Matches"]
)


@router.get("/")
def get_matches(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    # Get skills that the current user wants to learn
    learning_skills = (
        db.query(UserSkill)
        .filter(
            UserSkill.user_id == current_user.id,
            UserSkill.type == "LEARN"
        )
        .all()
    )

    skill_ids = [
        user_skill.skill_id
        for user_skill in learning_skills
    ]

    if not skill_ids:
        return []


    # Find users who teach those skills
    matches = (
        db.query(User, Skill, UserSkill)
        .join(
            UserSkill,
            User.id == UserSkill.user_id
        )
        .join(
            Skill,
            Skill.id == UserSkill.skill_id
        )
        .filter(
            UserSkill.type == "TEACH",
            UserSkill.skill_id.in_(skill_ids),
            User.id != current_user.id
        )
        .all()
    )


    # Group multiple matching skills under the same user
    result = {}

    for user, skill, user_skill in matches:

        if user.id not in result:
            result[user.id] = {
                "user_id": user.id,
                "name": user.name,
                "bio": user.bio,
                "location": user.location,
                "matched_skills": []
            }

        result[user.id]["matched_skills"].append({
            "skill": skill.name,
            "level": user_skill.level
        })


    return list(result.values())