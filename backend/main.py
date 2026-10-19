import os

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database import Base, engine

# Models
from models.user import User
from models.user_skill import UserSkill
from models.skill import Skill
from models.message import Message
from models.connection import Connection
from models.post import Post
from models.post_like import PostLike
from models.post_comment import PostComment
from models.community_post import CommunityPost
from models.community_post_like import CommunityPostLike
from models.community_post_comment import CommunityPostComment

# Routes
from api.auth.routes import router as auth_router
from api.Skills.routes import router as skills_router
from api.matches.routes import router as matches_router
from api.posts.routes import router as posts_router
from api.connections.routes import router as connections_router
from api.messages.routes import router as messages_router
from api.communities.routes import router as communities_router


# =========================================================
# DATABASE
# =========================================================

Base.metadata.create_all(bind=engine)


# =========================================================
# FASTAPI APP
# =========================================================

app = FastAPI(
    title="LocalLink API",
    description="Backend API for the LocalLink community platform",
    version="1.0.0",
)


# =========================================================
# CORS
# =========================================================


# =========================================================
# CORS
# =========================================================

frontend_url = os.getenv(
    "FRONTEND_URL",
    "http://localhost:5173"
)

allowed_origins = [
    "http://localhost:5173",
    "https://community-link-6.onrender.com",
]

if frontend_url not in allowed_origins:
    allowed_origins.append(frontend_url)

app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)



# =========================================================
# ROUTES
# =========================================================

app.include_router(auth_router)
app.include_router(skills_router)
app.include_router(matches_router)
app.include_router(posts_router)
app.include_router(connections_router)
app.include_router(messages_router)
app.include_router(communities_router)


# =========================================================
# ROOT
# =========================================================

@app.get("/")
def home():
    return {
        "message": "LocalLink API is running"
    }


# =========================================================
# HEALTH CHECK
# =========================================================

@app.get("/health")
def health():
    try:
        with engine.connect():
            return {
                "status": "healthy",
                "database": "connected"
            }

    except Exception:
        return {
            "status": "unhealthy",
            "database": "disconnected"
        }