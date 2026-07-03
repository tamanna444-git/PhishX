from fastapi import FastAPI
from backend.app.database.database import Base,engine
from backend.app.models.user import User 
from backend.app.routes.user import router as user_router
Base.metadata.create_all(bind=engine)
app= FastAPI(
    title="PhishX API",
    
    version="1.0.0"
)
app.include_router(user_router,prefix="/users", tags=["users"])
@app.get("/")
def home():
    return{"message":"welcome to phishx backend"}