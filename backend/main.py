from api.connections.routes import router as connections_router
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from models.user_skill import UserSkill
from models.skill import Skill
from api.Skills.routes import router as skills_router
from database import Base, engine
from models.user import User
from api.auth.routes import router as auth_router
from api.matches.routes import router as matches_router
from models.message import Message
from api.messages.routes import router as messages_router
from models.post_like import PostLike
from models.post import Post
from api.posts.routes import router as posts_router
from models.connection import Connection
from models.post_comment import PostComment
from api.communities.routes import router as communities_router
from models.community_post import CommunityPost
from models.community_post_like import CommunityPostLike
from models.community_post_comment import CommunityPostComment


Base.metadata.create_all(bind=engine)


app = FastAPI()


app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


app.include_router(auth_router)
app.include_router(skills_router)
app.include_router(matches_router)

app.include_router(posts_router)
app.include_router(connections_router)
app.include_router(messages_router)
app.include_router(communities_router)

@app.get("/")
def home():
    return {
        "message": "LocalLink API is running"
    }


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