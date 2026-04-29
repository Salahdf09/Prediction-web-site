from fastapi import APIRouter, Depends, HTTPException, Query, Header
from sqlalchemy.orm import Session
from sqlalchemy import func
from database.database import get_db
from models.models import Student, School
from schemas.schemas import StudentCreate, StudentLogin, StudentResponse, Token
from utils.auth import verify_password, get_password_hash, create_access_token
from datetime import timedelta
from jose import JWTError, jwt
import os

SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key")
ALGORITHM = "HS256"

router = APIRouter(prefix="/students", tags=["students"])

@router.post("/register", response_model=StudentResponse)
def register_student(student: StudentCreate, db: Session = Depends(get_db)):
    if db.query(Student).filter(Student.email == student.email).first():
        raise HTTPException(status_code=400, detail="Email already registered")
    if db.query(Student).filter(func.lower(Student.user_code) == student.studentPersonalId.lower()).first():
        raise HTTPException(status_code=400, detail="Student ID already exists")
    db_school = db.query(School).filter(School.name == student.schoolName).first()
    if not db_school:
        raise HTTPException(status_code=400, detail="School not found. Make sure the school name matches exactly.")
    hashed_password = get_password_hash(student.password)
    db_student = Student(
        user_code=student.studentPersonalId,  # ADD
        first_name=student.firstName,
        last_name=student.familyName,
        email=student.email,
        password_hash=hashed_password,
        grade=student.level,
        stream=student.stream,
        school_id=db_school.school_id
    )
    db.add(db_student)
    db.commit()
    db.refresh(db_student)
    return {"student_id": db_student.student_id, "email": db_student.email, "first_name": db_student.first_name, "last_name": db_student.last_name, "grade": db_student.grade, "stream": db_student.stream, "attendance_rate": db_student.attendance_rate, "homework_rate": db_student.homework_rate}

@router.get("/me", response_model=StudentResponse)
def get_current_student(authorization: str = Header(...), db: Session = Depends(get_db)):
    try:
        scheme, token = authorization.split()
        if scheme.lower() != "bearer":
            raise HTTPException(status_code=401, detail="Invalid auth scheme")
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        student_id: int = int(payload.get("sub"))
        role: str = payload.get("role")
        if role != "student":
            raise HTTPException(status_code=403, detail="Not a student token")
    except (JWTError, ValueError, AttributeError):
        raise HTTPException(status_code=401, detail="Invalid or expired token")
    student = db.query(Student).filter(Student.student_id == student_id).first()
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    return student

@router.post("/login", response_model=Token)
def login_student(email: str = Query(...), user_code: str = Query(...), password: str = Query(...), db: Session = Depends(get_db)):
    db_student = db.query(Student).filter(
        func.lower(Student.email) == email.lower(),
        Student.user_code == user_code
    ).first()
    if not db_student or not verify_password(password, db_student.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    access_token = create_access_token(
        data={"sub": str(db_student.student_id), "role": "student"},
        expires_delta=timedelta(minutes=30)
    )
    return {"access_token": access_token, "token_type": "bearer", "role": "student"}