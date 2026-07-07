from fastapi import FastAPI
from backend.app.database.database import Base, engine
from backend.app.models.user import User 
from backend.app.routes.user import router as user_router
from backend.app.routes.message_shield import router as message_shield_router
from fastapi.middleware.cors import CORSMiddleware

# Initialize database tables
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="PhishX API",
    version="1.0.0"
)

# Enable CORS so the React frontend on any port can access this API safely
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"]
)

# User routes grouped under /users
app.include_router(user_router, prefix="/users", tags=["users"])

# Match your friend's frontend route structure precisely:
# This changes the URL from /message-shield/stream-analyze to /v1/stream-analyze
app.include_router(message_shield_router, prefix="/v1", tags=["message-shield"])

@app.get("/")
def home():
    return {"message": "welcome to phishx backend"}