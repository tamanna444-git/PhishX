from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.app.database.database import get_db
from backend.app.models.user import User
from backend.app.schemas.user import UserCreate, UserLogin
from backend.app.security.hashing import hash_password, verify_password

router = APIRouter()


@router.get("/")
def test():
    return {"message": "user route working"}


@router.post("/register")
def register_user(user: UserCreate, db: Session = Depends(get_db)):
    existing_user = db.query(User).filter(User.operator_id == user.operator_id).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="An operator with this ID already exists.")

    new_user = User(
        operator_id=user.operator_id,
        neural_key=hash_password(user.neural_key)
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"message": "Operator registered successfully", "id": new_user.id}


@router.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    db_user = db.query(User).filter(User.operator_id == user.operator_id).first()
    if not db_user:
        raise HTTPException(status_code=400, detail="No operator found with this ID")

    if not verify_password(user.neural_key, db_user.neural_key):
        raise HTTPException(status_code=401, detail="Invalid Operator ID or Neural Key")

    return {"message": "Login successful", "id": db_user.id, "operator_id": db_user.operator_id}