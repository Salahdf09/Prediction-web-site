from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from database.database import get_db
from models.models import User
from schemas.schemas import AdminCreate, AdminLogin, AdminResponse, Token
from utils.auth import verify_password, get_password_hash, create_access_token
from datetime import timedelta

router = APIRouter(prefix="/admins", tags=["admins"])

@router.post("/register", response_model=AdminResponse)
def register_admin(admin: AdminCreate, db: Session = Depends(get_db)):
    if db.query(User).filter(User.email == admin.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    if db.query(User).filter(User.admin_code == admin.admin_code).first():
        raise HTTPException(status_code=400, detail="Admin code already exists")
    if db.query(User).filter(User.username == admin.username).first():
        raise HTTPException(status_code=400, detail="Username already exists")
    hashed_password = get_password_hash(admin.password)
    db_admin = User(
        admin_code=admin.admin_code,
        username=admin.username,
        email=admin.email,
        password_hash=hashed_password,
        role="admin"
    )
    db.add(db_admin)
    db.commit()
    db.refresh(db_admin)
    return {"user_id": db_admin.user_id, "username": db_admin.username, "email": db_admin.email, "role": db_admin.role}

@router.post("/login", response_model=Token)
def login_admin(email: str = Query(...), admin_code: str = Query(...), password: str = Query(...), db: Session = Depends(get_db)):
    db_admin = db.query(User).filter(
        func.lower(User.email) == email.lower(),
        User.admin_code == admin_code,
        User.role == "admin"
    ).first()
    if not db_admin or not verify_password(password, db_admin.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    access_token = create_access_token(
        data={"sub": str(db_admin.user_id), "role": "admin"},
        expires_delta=timedelta(minutes=30)
    )
    return {"access_token": access_token, "token_type": "bearer", "role": "admin"}


