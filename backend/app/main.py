from fastapi import FastAPI
from backend.app.database.database import Base,engine
from backend.app.models.user import User 
from backend.app.routes.user import router as user_router
from backend.app.routes.message_shield import router as message_shield_router
Base.metadata.create_all(bind=engine)
app= FastAPI(
    title="PhishX API",
    
    version="1.0.0"
)
app.include_router(user_router,prefix="/users", tags=["users"])
app.include_router(message_shield_router,prefix="/message-shield", tags=["message-shield"])
@app.get("/")
def home():
    return{"message":"welcome to phishx backend"}