from fastapi import HTTPException
from backend.app.security.hashing import verify_password
from backend.app.security.hashing import hash_password
from fastapi import APIRouter,Depends
from sqlalchemy.orm import Session
from backend.app.database.database import get_db
from backend.app.models.user import User
from backend.app.schemas.user import UserCreate, UserLogin
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
@router.post("/login")
def login(user: UserLogin, db: Session=Depends(get_db)):
    db_user = db.query(User).filter(User.email == user.email).first()
    if not db_user:
        raise HTTPException(status_code=400, detail="no user found with this email")
    if not verify_password(user.password, db_user.password):
        raise HTTPException(status_code=401, detail="Invalid email or password")
    return {"message": "Login successful","id":db_user.id,"name":db_user.name,"email":db_user.email}