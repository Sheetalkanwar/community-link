from fastapi import APIRouter, Depends, HTTPException
from pydantic import BaseModel
from sqlalchemy.orm import Session
from security import get_current_user

from database import get_db
from models.skill import Skill
from models.user_skill import UserSkill
from models.user import User



router = APIRouter(
    prefix="/api/skills",
    tags=["Skills"]
)


class AddSkillRequest(BaseModel):
    skill_name: str
    skill_type: str
    level: str | None = None


@router.post("/")
def add_skill(
    skill_data: AddSkillRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    skill_type = skill_data.skill_type.upper()

    if skill_type not in ["TEACH", "LEARN"]:
        raise HTTPException(
            status_code=400,
            detail="skill_type must be TEACH or LEARN"
        )

    skill = (
        db.query(Skill)
        .filter(Skill.name.ilike(skill_data.skill_name.strip()))
        .first()
    )

    if not skill:
        skill = Skill(
            name=skill_data.skill_name.strip()
        )

        db.add(skill)
        db.commit()
        db.refresh(skill)

    existing = (
        db.query(UserSkill)
        .filter(
            UserSkill.user_id == current_user.id,
            UserSkill.skill_id == skill.id,
            UserSkill.type == skill_type
        )
        .first()
    )

    if existing:
        raise HTTPException(
            status_code=400,
            detail="You already have this skill"
        )

    user_skill = UserSkill(
        user_id=current_user.id,
        skill_id=skill.id,
        type=skill_type,
        level=skill_data.level
    )

    db.add(user_skill)
    db.commit()
    db.refresh(user_skill)

    return {
        "message": "Skill added successfully",
        "skill": {
            "id": skill.id,
            "name": skill.name,
            "type": user_skill.type,
            "level": user_skill.level
        }
    }


@router.get("/")
def get_my_skills(
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    results = (
        db.query(UserSkill, Skill)
        .join(
            Skill,
            UserSkill.skill_id == Skill.id
        )
        .filter(
            UserSkill.user_id == current_user.id
        )
        .all()
    )

    return [
        {
            "id": user_skill.id,
            "skill_id": skill.id,
            "name": skill.name,
            "type": user_skill.type,
            "level": user_skill.level
        }
        for user_skill, skill in results
    ]


@router.delete("/{user_skill_id}")
def delete_skill(
    user_skill_id: int,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    user_skill = (
        db.query(UserSkill)
        .filter(
            UserSkill.id == user_skill_id,
            UserSkill.user_id == current_user.id
        )
        .first()
    )

    if not user_skill:
        raise HTTPException(
            status_code=404,
            detail="Skill not found"
        )

    db.delete(user_skill)
    db.commit()

    return {
        "message": "Skill removed successfully"
    }

@router.put("/{user_skill_id}")
def update_skill(
    user_skill_id: int,
    skill_data: AddSkillRequest,
    current_user: User = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    skill_type = skill_data.skill_type.upper()

    if skill_type not in ["TEACH", "LEARN"]:
        raise HTTPException(
            status_code=400,
            detail="skill_type must be TEACH or LEARN"
        )

    user_skill = (
        db.query(UserSkill)
        .filter(
            UserSkill.id == user_skill_id,
            UserSkill.user_id == current_user.id
        )
        .first()
    )

    if not user_skill:
        raise HTTPException(
            status_code=404,
            detail="Skill not found"
        )

    user_skill.type = skill_type
    user_skill.level = skill_data.level

    db.commit()
    db.refresh(user_skill)

    return {
        "message": "Skill updated successfully",
        "skill": {
            "id": user_skill.id,
            "skill_id": user_skill.skill_id,
            "type": user_skill.type,
            "level": user_skill.level
        }
    }