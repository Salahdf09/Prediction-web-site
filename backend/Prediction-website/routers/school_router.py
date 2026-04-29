from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from database.database import get_db
from models.models import School
from schemas.schemas import SchoolCreate, SchoolResponse, Token
from utils.auth import verify_password, get_password_hash, create_access_token
from datetime import timedelta

router = APIRouter(prefix="/schools", tags=["schools"])

@router.post("/register", response_model=SchoolResponse)
def register_school(school: SchoolCreate, db: Session = Depends(get_db)):
    if db.query(School).filter(School.email == school.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    if db.query(School).filter(School.name == school.name).first():
        raise HTTPException(status_code=400, detail="School name already registered")
    if db.query(School).filter(School.school_code == school.school_code).first():
        raise HTTPException(status_code=400, detail="School ID already exists")
    hashed_password = get_password_hash(school.password)
    db_school = School(
        school_code=school.school_code,   # ADD
        name=school.name,
        address=school.address,
        email=school.email,
        password_hash=hashed_password
    )
    db.add(db_school)
    db.commit()
    db.refresh(db_school)
    return {"school_id": db_school.school_id, "name": db_school.name, "address": db_school.address, "email": db_school.email}

@router.post("/login", response_model=Token)
def login_school(email: str = Query(...), school_code: str = Query(...), password: str = Query(...), db: Session = Depends(get_db)):
    db_school = db.query(School).filter(
        func.lower(School.email) == email.lower(),
        School.school_code == school_code
    ).first()
    if not db_school or not verify_password(password, db_school.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    access_token = create_access_token(
        data={"sub": str(db_school.school_id), "role": "school"},
        expires_delta=timedelta(minutes=30)
    )
    return {"access_token": access_token, "token_type": "bearer", "role": "school"}