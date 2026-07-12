from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.app.database.database import get_db
# 1. Update this import line:
from backend.app.models.user import DBUser
from backend.app.schemas.user import UserCreate, UserLogin
from backend.app.security.hashing import hash_password, verify_password

router = APIRouter()

@router.post("/register")
def register_user(user: UserCreate, db: Session = Depends(get_db)):
    # 2. Query using DBUser
    existing_user = db.query(DBUser).filter(DBUser.operator_id == user.operator_id).first()
    if existing_user:
        raise HTTPException(status_code=400, detail="An operator with this ID already exists.")

    # 3. Create record using DBUser
    new_user = DBUser(
        operator_id=user.operator_id,
        neural_key=hash_password(user.neural_key)
    )
    db.add(new_user)
    db.commit()
    db.refresh(new_user)
    return {"message": "Operator registered successfully", "id": new_user.id}

@router.post("/login")
def login(user: UserLogin, db: Session = Depends(get_db)):
    # 4. Update login query to use DBUser
    db_user = db.query(DBUser).filter(DBUser.operator_id == user.operator_id).first()
    if not db_user:
        raise HTTPException(status_code=400, detail="No operator found with this ID")

    if not verify_password(user.neural_key, db_user.neural_key):
        raise HTTPException(status_code=401, detail="Invalid Operator ID or Neural Key")

    return {"message": "Login successful", "id": db_user.id, "operator_id": db_user.operator_id}