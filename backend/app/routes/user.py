from backend.app.security.hashing import hash_password
from fastapi import APIRouter,Depends
from sqlalchemy.orm import Session
from backend.app.database.database import get_db
from backend.app.models.user import User
from backend.app.schemas.user import UserCreate
router= APIRouter()
@router.get("/")
def test():
    return{"messsage":"user route working"}
@router.post("/register")
def register_user(user:UserCreate,db: Session=Depends(get_db)):
    new_user =User(
        name=user.name,
        email=user.email,
        password=hash_password(user.password)

    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return{"mesage":"user registered sucessfully","id":new_user.id}
