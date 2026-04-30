from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from sqlalchemy import func
from database.database import get_db
from models.models import School, Student
from schemas.schemas import SchoolCreate, SchoolResponse, SchoolStudentCreate, Token
from utils.auth import verify_password, get_password_hash, create_access_token
from datetime import timedelta
from .dashboard_helpers import school_stats_for_students, student_list_item

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


@router.get("/{school_id}/students")
def get_school_students(school_id: int, db: Session = Depends(get_db)):
    if not db.query(School).filter(School.school_id == school_id).first():
        raise HTTPException(status_code=404, detail="School not found")
    students = db.query(Student).filter(Student.school_id == school_id).all()
    return {"students": [student_list_item(db, student) for student in students]}


@router.post("/{school_id}/students")
def create_school_student(school_id: int, payload: SchoolStudentCreate, db: Session = Depends(get_db)):
    if not db.query(School).filter(School.school_id == school_id).first():
        raise HTTPException(status_code=404, detail="School not found")
    if db.query(Student).filter(func.lower(Student.email) == payload.email.lower()).first():
        raise HTTPException(status_code=400, detail="Student email already registered")
    if db.query(Student).filter(func.lower(Student.user_code) == payload.studentPersonalId.lower()).first():
        raise HTTPException(status_code=400, detail="Student ID already exists")

    first_name, last_name = _student_names(payload)
    student = Student(
        school_id=school_id,
        user_code=payload.studentPersonalId,
        first_name=first_name,
        last_name=last_name,
        email=payload.email,
        grade=payload.level,
        stream=payload.stream,
        password_hash=get_password_hash(payload.password),
        attendance_rate=0.0,
        homework_rate=0.0,
    )
    db.add(student)
    db.commit()
    db.refresh(student)
    return student_list_item(db, student)


@router.get("/{school_id}/statistics")
def get_school_statistics(school_id: int, db: Session = Depends(get_db)):
    if not db.query(School).filter(School.school_id == school_id).first():
        raise HTTPException(status_code=404, detail="School not found")
    students = db.query(Student).filter(Student.school_id == school_id).all()
    return school_stats_for_students(db, students)


def _student_names(payload: SchoolStudentCreate) -> tuple[str, str]:
    if payload.firstName or payload.familyName:
        return (payload.firstName or "Student").strip(), (payload.familyName or "").strip()

    parts = (payload.name or "Student").strip().split()
    first_name = parts[0] if parts else "Student"
    last_name = " ".join(parts[1:])
    return first_name, last_name
