from fastapi import APIRouter, Depends, HTTPException, Query, Header
from sqlalchemy.orm import Session
from sqlalchemy import func
from database.database import get_db
from models.models import Parent, Student, ParentStudent
from schemas.schemas import ParentCreate, ParentLogin, ParentResponse, Token, StudentResponse
from utils.auth import verify_password, get_password_hash, create_access_token
from datetime import timedelta
from jose import JWTError, jwt
import os
from typing import List

SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key")
ALGORITHM = "HS256"

router = APIRouter(prefix="/parents", tags=["parents"])

@router.post("/register", response_model=ParentResponse)
def register_parent(parent: ParentCreate, db: Session = Depends(get_db)):
    if db.query(Parent).filter(Parent.email == parent.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    student = db.query(Student).filter(Student.user_code == parent.student_code).first()
    if not student:
        raise HTTPException(status_code=400, detail="Student not found. Check the student code.")
    if db.query(Parent).filter(Parent.user_code == parent.student_code).first():
        raise HTTPException(status_code=400, detail="A parent account already exists for this student.")
    hashed_password = get_password_hash(parent.password)
    db_parent = Parent(
        user_code=parent.student_code,   # child's code becomes parent's login code
        email=parent.email,
        phone_number=parent.phone_number,
        student_id=student.student_id,
        password_hash=hashed_password
    )
    db.add(db_parent)
    db.commit()
    db.refresh(db_parent)
    db.add(ParentStudent(parent_id=db_parent.parent_id, student_id=student.student_id))
    db.commit()
    return db_parent

@router.post("/login", response_model=Token)
def login_parent(email: str = Query(...), user_code: str = Query(...), password: str = Query(...), db: Session = Depends(get_db)):
    db_parent = db.query(Parent).filter(
        func.lower(Parent.email) == email.lower(),
        Parent.user_code == user_code
    ).first()
    if not db_parent or not verify_password(password, db_parent.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    access_token = create_access_token(
        data={"sub": str(db_parent.parent_id), "role": "parent"},
        expires_delta=timedelta(minutes=30)
    )
    return {"access_token": access_token, "token_type": "bearer", "role": "parent"}

@router.get("/me/children", response_model=List[StudentResponse])
def get_my_children(authorization: str = Header(...), db: Session = Depends(get_db)):
    try:
        scheme, token = authorization.split()
        if scheme.lower() != "bearer":
            raise HTTPException(status_code=401, detail="Invalid auth scheme")
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        parent_id: int = int(payload.get("sub"))
        role: str = payload.get("role")
        if role != "parent":
            raise HTTPException(status_code=403, detail="Not a parent token")
    except (JWTError, ValueError, AttributeError):
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    links = db.query(ParentStudent).filter(ParentStudent.parent_id == parent_id).all()
    student_ids = [l.student_id for l in links]
    return db.query(Student).filter(Student.student_id.in_(student_ids)).all()