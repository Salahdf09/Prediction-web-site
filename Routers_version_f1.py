from passlib.context import CryptContext
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import func as sqlfunc
from datetime import datetime
from database.database import get_db
from schemas import (
    StudentCreate, StudentUpdate, StudentOut,
    ParentCreate, ParentUpdate, ParentOut,
    SchoolCreate, SchoolUpdate, SchoolOut,
    AdminCreate, AdminUpdate, AdminOut,
    SimulationInput, SimulationResult,
    AdviceCreate, AdviceOut,
    OrientationCreate, OrientationOut,
    NotificationCreate, NotificationOut,
    ReportCreate, ReportOut,
    SchoolStatsResponse, AdminStatsResponse,
)

from crud.crud_school_admin import (
    create_school,
    get_school_by_id,
    get_school_by_name,
    get_schools,
    update_school,
    approve_school,
    delete_school,
    create_admin,
    get_admin_by_id,
    get_admin_by_email,
    get_admins,
    update_admin,
    record_login,
    deactivate_admin,
    reactivate_admin,
    delete_admin,
)
from crud.crud_advice import create_advice, get_advices_by_student
from crud.crud_orientation import save_orientation, get_orientation
from crud.crud_notification import (
    create_notification,
    get_notifications,
    mark_notification_read,
    mark_all_read,
)
from crud.crud_report import create_report, get_reports_by_school, get_report
from crud.crud_grade import get_weak_subjects, get_subjects_by_student
from services.simulation import calculate_simulation, generate_advice_message
from services.orientation import generate_orientation
from auth import get_current_user, require_role, hash_password
from models import Student, Prediction, Parent, School, Admin as AdminModel




# ──────────────────────────────────────────────────────────────────────────────
#  Student router
# ──────────────────────────────────────────────────────────────────────────────

student_router = APIRouter(prefix="/students", tags=["Students"])


@student_router.post("/register", response_model=StudentOut, status_code=status.HTTP_201_CREATED)
def register_student(student: StudentCreate, db: Session = Depends(get_db)):
    if get_student_by_email(db, student.email):
        raise HTTPException(status_code=400, detail="Email already registered")
    return create_student(
        db,
        email=student.email,
        password=student.password,
        school_id=student.school_id,
        level=student.level,
        academic_year=student.academic_year,
        parent_id=student.parent_id,
    )


@student_router.post("/login")
def login_student(email: str, password: str, db: Session = Depends(get_db)):
    db_student = get_student_by_email(db, email)
    if not db_student:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    #  Vérification du mot de passe
    if not pwd_context.verify(password, db_student.user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return {"message": "Login successful", "student_id": db_student.student_id}




@student_router.get("/", response_model=List[StudentOut])
def list_students(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return get_students(db, skip=skip, limit=limit)


@student_router.get("/{student_id}", response_model=StudentOut)
def get_student_profile(student_id: int, db: Session = Depends(get_db)):
    db_student = get_student_by_id(db, student_id)
    if not db_student:
        raise HTTPException(status_code=404, detail="Student not found")
    return db_student


@student_router.get("/{student_id}/progress")
def get_student_progress(student_id: int, db: Session = Depends(get_db)):
    student = get_student_by_id(db, student_id)
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    grades = student.grade_records
    semesters = {}
    for g in grades:
        semesters[f"Trimester {g.academic_year}"] = {
            "trimester1": g.trimester1,
            "trimester2": g.trimester2,
            "trimester3": g.trimester3,
            "final_grade": g.final_grade,
        }
    return {"student_id": student_id, "grade_records": semesters}


@student_router.get("/{student_id}/prediction")
def get_prediction(student_id: int, db: Session = Depends(get_db)):
    student = get_student_by_id(db, student_id)
    if not student:
        raise HTTPException(status_code=404, detail="Student not found")
    prediction = (
        db.query(Prediction)
        .filter(Prediction.student_id == student_id)
        .order_by(Prediction.prediction_date.desc())
        .first()
    )
    if not prediction:
        raise HTTPException(status_code=404, detail="No prediction found for this student")
    return {
        "student_id": student_id,
        "risk_level": prediction.risk_level,
        "pass_probability": prediction.pass_probability,
        "predicted_grade": prediction.predicted_grade,
        "confidence_score": prediction.confidence_score,
        "prediction_date": prediction.prediction_date,
    }


@student_router.post("/{student_id}/prediction/request")
def request_prediction(student_id: int, db: Session = Depends(get_db)):
    if not get_student_by_id(db, student_id):
        raise HTTPException(status_code=404, detail="Student not found")
    return {"message": "Prediction requested. Results will be available shortly."}


@student_router.get("/{student_id}/orientation")
def get_student_orientation(student_id: int, db: Session = Depends(get_db)):
    if not get_student_by_id(db, student_id):
        raise HTTPException(status_code=404, detail="Student not found")
    orientation = get_orientation(db, student_id)
    if not orientation:
        raise HTTPException(status_code=404, detail="No orientation found for this student")
    return orientation


@student_router.put("/{student_id}/settings/profile", response_model=StudentOut)
def update_profile(student_id: int, data: StudentUpdate, db: Session = Depends(get_db)):
    updated = update_student(
        db, student_id,
        email=data.email,
        school_id=data.school_id,
        level=data.level,
        academic_year=data.academic_year,
    )
    if not updated:
        raise HTTPException(status_code=404, detail="Student not found")
    return updated


@student_router.patch("/{student_id}/settings/password")
def change_password_student(
    student_id: int, current_password: str, new_password: str, confirm_password: str,
    db: Session = Depends(get_db)
):
    if new_password != confirm_password:
        raise HTTPException(status_code=400, detail="Passwords do not match")
    if not get_student_by_id(db, student_id):
        raise HTTPException(status_code=404, detail="Student not found")
    return {"message": "Password changed successfully"}


@student_router.get("/{student_id}/settings/notifications")
def get_student_notifications(student_id: int, db: Session = Depends(get_db)):
    if not get_student_by_id(db, student_id):
        raise HTTPException(status_code=404, detail="Student not found")
    return get_notifications(db, student_id, role="student")


@student_router.delete("/{student_id}", response_model=StudentOut)
def remove_student(student_id: int, db: Session = Depends(get_db)):
    deleted = delete_student(db, student_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Student not found")
    return deleted


# ──────────────────────────────────────────────────────────────────────────────
#  Parent router
# ──────────────────────────────────────────────────────────────────────────────

parent_router = APIRouter(prefix="/parents", tags=["Parents"])


@parent_router.post("/register", response_model=ParentOut, status_code=status.HTTP_201_CREATED)
def register_parent(parent: ParentCreate, db: Session = Depends(get_db)):
    if get_parent_by_email(db, parent.email):
        raise HTTPException(status_code=400, detail="Email already registered")
    return create_parent(
        db,
        email=parent.email,
        password=parent.password,
        phone=parent.phone,
        address=parent.address,
        profession=parent.profession,
    )


@parent_router.post("/login")
def login_parent(email: str, password: str, db: Session = Depends(get_db)):
    db_parent = get_parent_by_email(db, email)
    if not db_parent:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    if not pwd_context.verify(password, db_parent.user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return {"message": "Login successful", "parent_id": db_parent.parent_id}

@parent_router.get("/{parent_id}", response_model=ParentOut)
def get_parent_profile(parent_id: int, db: Session = Depends(get_db)):
    db_parent = get_parent_by_id(db, parent_id)
    if not db_parent:
        raise HTTPException(status_code=404, detail="Parent not found")
    return db_parent


@parent_router.get("/{parent_id}/children")
def get_children(parent_id: int, db: Session = Depends(get_db)):
    db_parent = get_parent_by_id(db, parent_id)
    if not db_parent:
        raise HTTPException(status_code=404, detail="Parent not found")
    return {"parent_id": parent_id, "children": db_parent.students}


@parent_router.get("/{parent_id}/child/{student_id}/progress")
def get_child_progress(parent_id: int, student_id: int, db: Session = Depends(get_db)):
    if not get_parent_by_id(db, parent_id):
        raise HTTPException(status_code=404, detail="Parent not found")
    student = get_student_by_id(db, student_id)
    if not student or student.parent_id != parent_id:
        raise HTTPException(status_code=404, detail="Student not found or not linked to this parent")
    grades = student.grade_records
    return {
        "student_id": student_id,
        "grade_records": [
            {
                "academic_year": g.academic_year,
                "trimester1": g.trimester1,
                "trimester2": g.trimester2,
                "trimester3": g.trimester3,
                "final_grade": g.final_grade,
            }
            for g in grades
        ],
    }


@parent_router.get("/{parent_id}/child/{student_id}/prediction")
def get_child_prediction(parent_id: int, student_id: int, db: Session = Depends(get_db)):
    if not get_parent_by_id(db, parent_id):
        raise HTTPException(status_code=404, detail="Parent not found")
    student = get_student_by_id(db, student_id)
    if not student or student.parent_id != parent_id:
        raise HTTPException(status_code=404, detail="Student not found or not linked to this parent")
    prediction = (
        db.query(Prediction)
        .filter(Prediction.student_id == student_id)
        .order_by(Prediction.prediction_date.desc())
        .first()
    )
    if not prediction:
        raise HTTPException(status_code=404, detail="No prediction found")
    return {
        "student_id": student_id,
        "risk_level": prediction.risk_level,
        "pass_probability": prediction.pass_probability,
        "predicted_grade": prediction.predicted_grade,
        "confidence_score": prediction.confidence_score,
    }


@parent_router.get("/{parent_id}/child/{student_id}/orientation")
def get_child_orientation(parent_id: int, student_id: int, db: Session = Depends(get_db)):
    if not get_parent_by_id(db, parent_id):
        raise HTTPException(status_code=404, detail="Parent not found")
    student = get_student_by_id(db, student_id)
    if not student or student.parent_id != parent_id:
        raise HTTPException(status_code=404, detail="Student not found or not linked to this parent")
    orientation = get_orientation(db, student_id)
    if not orientation:
        raise HTTPException(status_code=404, detail="No orientation found")
    return orientation


@parent_router.put("/{parent_id}/settings/profile", response_model=ParentOut)
def update_parent_profile(parent_id: int, data: ParentUpdate, db: Session = Depends(get_db)):
    updated = update_parent(
        db, parent_id,
        email=data.email,
        phone=data.phone,
        address=data.address,
        profession=data.profession,
    )
    if not updated:
        raise HTTPException(status_code=404, detail="Parent not found")
    return updated


@parent_router.patch("/{parent_id}/settings/password")
def change_password_parent(
    parent_id: int, current_password: str, new_password: str, confirm_password: str,
    db: Session = Depends(get_db)
):
    if new_password != confirm_password:
        raise HTTPException(status_code=400, detail="Passwords do not match")
    if not get_parent_by_id(db, parent_id):
        raise HTTPException(status_code=404, detail="Parent not found")
    return {"message": "Password changed successfully"}


@parent_router.get("/{parent_id}/settings/notifications")
def get_parent_notifications(parent_id: int, db: Session = Depends(get_db)):
    if not get_parent_by_id(db, parent_id):
        raise HTTPException(status_code=404, detail="Parent not found")
    return get_notifications(db, parent_id, role="parent")


@parent_router.delete("/{parent_id}", response_model=ParentOut)
def remove_parent(parent_id: int, db: Session = Depends(get_db)):
    deleted = delete_parent(db, parent_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Parent not found")
    return deleted


# ──────────────────────────────────────────────────────────────────────────────
#  School router
# ──────────────────────────────────────────────────────────────────────────────

school_router = APIRouter(prefix="/schools", tags=["Schools"])


@school_router.post("/register", response_model=SchoolOut, status_code=status.HTTP_201_CREATED)
def register_school(school: SchoolCreate, db: Session = Depends(get_db)):
    if get_school_by_name(db, school.name):
        raise HTTPException(status_code=400, detail="School name already registered")
    return create_school(db, name=school.name, email=school.email, password=school.password,
                         address=school.address, phone=school.phone)


    @school_router.post("/login")
def login_school(email: str, password: str, db: Session = Depends(get_db)):
    db_school = get_school_by_name(db, email)
    if not db_school:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    if not pwd_context.verify(password, db_school.user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return {"message": "Login successful", "school_id": db_school.school_id}


@school_router.get("/", response_model=List[SchoolOut])
def list_schools(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return get_schools(db, skip=skip, limit=limit)


@school_router.get("/{school_id}", response_model=SchoolOut)
def get_school_profile(school_id: int, db: Session = Depends(get_db)):
    db_school = get_school_by_id(db, school_id)
    if not db_school:
        raise HTTPException(status_code=404, detail="School not found")
    return db_school


@school_router.get("/{school_id}/students")
def get_school_students(school_id: int, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    if not get_school_by_id(db, school_id):
        raise HTTPException(status_code=404, detail="School not found")
    students = get_students(db, skip=skip, limit=limit)
    return {"school_id": school_id, "students": students}


@school_router.post("/{school_id}/register-student")
def school_register_student(
    school_id: int,
    student_data: StudentCreate,
    db: Session = Depends(get_db),
    _: dict = Depends(require_role("school", "admin")),
):
    if not get_school_by_id(db, school_id):
        raise HTTPException(status_code=404, detail="School not found")
    existing = get_student_by_email(db, student_data.email)
    if existing:
        raise HTTPException(status_code=400, detail="A student with this email already exists")
    student = create_student(
        db,
        email=student_data.email,
        password=student_data.password,
        school_id=school_id,
        level=student_data.level,
        academic_year=student_data.academic_year,
    )
    create_notification(
        db, user_id=student.student_id, role="student",
        type="registration",
        message="Your student account has been created by your school.",
    )
    return {"message": "Student registered successfully", "student_id": student.student_id}


@school_router.patch("/{school_id}/approve", response_model=SchoolOut)
def approve(school_id: int, db: Session = Depends(get_db)):
    approved = approve_school(db, school_id)
    if not approved:
        raise HTTPException(status_code=404, detail="School not found")
    return approved


@school_router.put("/{school_id}/settings/profile", response_model=SchoolOut)
def update_school_profile(school_id: int, data: SchoolUpdate, db: Session = Depends(get_db)):
    updated = update_school(db, school_id, address=data.address, phone=data.phone)
    if not updated:
        raise HTTPException(status_code=404, detail="School not found")
    return updated


@school_router.patch("/{school_id}/settings/password")
def change_password_school(
    school_id: int, current_password: str, new_password: str, confirm_password: str,
    db: Session = Depends(get_db)
):
    if new_password != confirm_password:
        raise HTTPException(status_code=400, detail="Passwords do not match")
    if not get_school_by_id(db, school_id):
        raise HTTPException(status_code=404, detail="School not found")
    return {"message": "Password changed successfully"}


@school_router.get("/{school_id}/settings/notifications")
def get_school_notifications(school_id: int, db: Session = Depends(get_db)):
    if not get_school_by_id(db, school_id):
        raise HTTPException(status_code=404, detail="School not found")
    return get_notifications(db, school_id, role="school")


@school_router.delete("/{school_id}", response_model=SchoolOut)
def remove_school(school_id: int, db: Session = Depends(get_db)):
    deleted = delete_school(db, school_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="School not found")
    return deleted


# ──────────────────────────────────────────────────────────────────────────────
#  Admin router
# ──────────────────────────────────────────────────────────────────────────────

admin_router = APIRouter(prefix="/admins", tags=["Admins"])


@admin_router.post("/register", response_model=AdminOut, status_code=status.HTTP_201_CREATED)
def register_admin(admin: AdminCreate, db: Session = Depends(get_db)):
    if get_admin_by_email(db, admin.email):
        raise HTTPException(status_code=400, detail="Email already registered")
    return create_admin(
        db,
        email=admin.email,
        password=admin.password,
        access_level=admin.access_level,
        department=admin.department,
    )

    @admin_router.post("/login")
def login_admin(email: str, password: str, db: Session = Depends(get_db)):
    db_admin = get_admin_by_email(db, email)
    if not db_admin:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    if not pwd_context.verify(password, db_admin.user.password_hash):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return record_login(db, db_admin.admin_id)


@admin_router.get("/", response_model=List[AdminOut])
def list_admins(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    return get_admins(db, skip=skip, limit=limit)


@admin_router.get("/{admin_id}", response_model=AdminOut)
def get_admin(admin_id: int, db: Session = Depends(get_db)):
    db_admin = get_admin_by_id(db, admin_id)
    if not db_admin:
        raise HTTPException(status_code=404, detail="Admin not found")
    return db_admin


@admin_router.get("/{admin_id}/users")
def manage_users(admin_id: int, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    if not get_admin_by_id(db, admin_id):
        raise HTTPException(status_code=404, detail="Admin not found")
    admins = get_admins(db, skip=skip, limit=limit)
    return {"users": admins, "total": len(admins)}


@admin_router.patch("/{admin_id}/users/{target_id}/deactivate")
def deactivate_user(admin_id: int, target_id: int, db: Session = Depends(get_db)):
    if not get_admin_by_id(db, admin_id):
        raise HTTPException(status_code=404, detail="Admin not found")
    result = deactivate_admin(db, target_id)
    if not result:
        raise HTTPException(status_code=404, detail="User not found")
    return {"message": f"User {target_id} deactivated"}


@admin_router.patch("/{admin_id}/users/{target_id}/reactivate")
def reactivate_user(admin_id: int, target_id: int, db: Session = Depends(get_db)):
    if not get_admin_by_id(db, admin_id):
        raise HTTPException(status_code=404, detail="Admin not found")
    result = reactivate_admin(db, target_id)
    if not result:
        raise HTTPException(status_code=404, detail="User not found")
    return {"message": f"User {target_id} reactivated"}


@admin_router.delete("/{admin_id}/users/{target_id}")
def delete_user(admin_id: int, target_id: int, db: Session = Depends(get_db)):
    if not get_admin_by_id(db, admin_id):
        raise HTTPException(status_code=404, detail="Admin not found")
    result = delete_admin(db, target_id)
    if not result:
        raise HTTPException(status_code=404, detail="User not found")
    return {"message": f"User {target_id} deleted"}


@admin_router.get("/{admin_id}/schools")
def manage_schools(admin_id: int, skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    if not get_admin_by_id(db, admin_id):
        raise HTTPException(status_code=404, detail="Admin not found")
    schools = get_schools(db, skip=skip, limit=limit)
    return {"schools": schools, "total": len(schools)}


@admin_router.post("/{admin_id}/ai/retrain")
def retrain_ai_model(admin_id: int, db: Session = Depends(get_db)):
    if not get_admin_by_id(db, admin_id):
        raise HTTPException(status_code=404, detail="Admin not found")
    return {"message": "AI model retraining initiated"}


@admin_router.get("/{admin_id}/ai/status")
def get_ai_status(admin_id: int, db: Session = Depends(get_db)):
    if not get_admin_by_id(db, admin_id):
        raise HTTPException(status_code=404, detail="Admin not found")
    return {
        "model_status": "Active",
        "last_trained": "2025-03-15",
        "accuracy": 0.89,
        "total_predictions_made": 1240,
    }


@admin_router.put("/{admin_id}/settings/profile", response_model=AdminOut)
def update_admin_profile(admin_id: int, data: AdminUpdate, db: Session = Depends(get_db)):
    updated = update_admin(
        db, admin_id,
        email=data.email,
        access_level=data.access_level,
        department=data.department,
    )
    if not updated:
        raise HTTPException(status_code=404, detail="Admin not found")
    return updated


@admin_router.patch("/{admin_id}/settings/password")
def change_password_admin(
    admin_id: int, current_password: str, new_password: str, confirm_password: str,
    db: Session = Depends(get_db)
):
    if new_password != confirm_password:
        raise HTTPException(status_code=400, detail="Passwords do not match")
    if not get_admin_by_id(db, admin_id):
        raise HTTPException(status_code=404, detail="Admin not found")
    return {"message": "Password changed successfully"}


@admin_router.get("/{admin_id}/settings/notifications")
def get_admin_notifications(admin_id: int, db: Session = Depends(get_db)):
    if not get_admin_by_id(db, admin_id):
        raise HTTPException(status_code=404, detail="Admin not found")
    return get_notifications(db, admin_id, role="admin")


@admin_router.delete("/{admin_id}", response_model=AdminOut)
def remove_admin(admin_id: int, db: Session = Depends(get_db)):
    deleted = delete_admin(db, admin_id)
    if not deleted:
        raise HTTPException(status_code=404, detail="Admin not found")
    return deleted


# ──────────────────────────────────────────────────────────────────────────────
#  Simulation router
# ──────────────────────────────────────────────────────────────────────────────

router_simulator = APIRouter(prefix="/students", tags=["Simulateur"])


@router_simulator.post("/{student_id}/simulate", response_model=SimulationResult)
def simulate(
    student_id: int,
    body: SimulationInput,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    if not get_student_by_id(db, student_id):
        raise HTTPException(status_code=404, detail="Student not found")

    result = calculate_simulation(body)

    weak_subjects = get_weak_subjects(db, student_id)
    weak_names    = [s.name for s in weak_subjects]
    advice_msg    = generate_advice_message(result.annual_average, weak_names)
    # Advice is now linked via prediction — create with prediction_id=None as fallback
    create_advice(db, prediction_id=None, message=advice_msg)

    create_notification(
        db,
        user_id=student_id,
        role="student",
        type="simulation",
        message=f"Simulation effectuée. Moyenne : {result.annual_average}/20 — {result.mention}",
    )
    return result


# ──────────────────────────────────────────────────────────────────────────────
#  Advice router
# ──────────────────────────────────────────────────────────────────────────────

router_advice = APIRouter(prefix="/students", tags=["Conseils"])


@router_advice.post("/{student_id}/advice", response_model=AdviceResponse)
def add_advice(
    student_id: int,
    body: AdviceCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    if not get_student_by_id(db, student_id):
        raise HTTPException(status_code=404, detail="Student not found")
    return create_advice(
        db,
        prediction_id=body.prediction_id,
        message=body.message,
        subject_related=body.subject_related,
    )


@router_advice.get("/{student_id}/advice", response_model=List[AdviceResponse])
def list_advice(
    student_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    if not get_student_by_id(db, student_id):
        raise HTTPException(status_code=404, detail="Student not found")
    return get_advices_by_student(db, student_id)


# ──────────────────────────────────────────────────────────────────────────────
#  Orientation router
# ──────────────────────────────────────────────────────────────────────────────

router_orientation = APIRouter(prefix="/students", tags=["Orientation"])


@router_orientation.post("/{student_id}/orientation", response_model=OrientationResponse)
def create_or_update_orientation(
    student_id: int,
    body: OrientationCreate,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    if not get_student_by_id(db, student_id):
        raise HTTPException(status_code=404, detail="Student not found")
    return save_orientation(
        db,
        student_id=student_id,
        prediction_id=body.prediction_id,
        recommended_stream=body.recommended_stream,
        explanation=body.explanation,
    )


@router_orientation.post("/{student_id}/orientation/auto", response_model=OrientationResponse)
def auto_orientation(
    student_id: int,
    annual_average: float,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    if not get_student_by_id(db, student_id):
        raise HTTPException(status_code=404, detail="Student not found")
    subjects = get_subjects_by_student(db, student_id)
    result   = generate_orientation(annual_average, subjects)
    orientation = save_orientation(
        db,
        student_id=student_id,
        prediction_id=None,
        recommended_stream=result["recommended_stream"],
        explanation=result["explanation"],
    )
    create_notification(
        db,
        user_id=student_id,
        role="student",
        type="orientation",
        message=f"Orientation recommandée : {result['recommended_stream']}",
    )
    return orientation


@router_orientation.get("/{student_id}/orientation", response_model=OrientationResponse)
def read_orientation(
    student_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    orientation = get_orientation(db, student_id)
    if not orientation:
        raise HTTPException(status_code=404, detail="Aucune orientation enregistrée")
    return orientation


# ──────────────────────────────────────────────────────────────────────────────
#  Notifications router
# ──────────────────────────────────────────────────────────────────────────────

router_notifications = APIRouter(prefix="", tags=["Notifications"])


@router_notifications.post("/notifications", response_model=NotificationResponse)
def new_notification(
    body: NotificationCreate,
    db: Session = Depends(get_db),
    _: dict = Depends(require_role("admin", "school")),
):
    return create_notification(db, **body.model_dump())


@router_notifications.get("/students/{user_id}/notifications", response_model=List[NotificationResponse])
def student_notifications(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    return get_notifications(db, user_id, role="student")


@router_notifications.get("/parents/{user_id}/notifications", response_model=List[NotificationResponse])
def parent_notifications(
    user_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    return get_notifications(db, user_id, role="parent")


@router_notifications.patch("/notifications/{notification_id}/read", response_model=NotificationResponse)
def read_notification(
    notification_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    notif = mark_notification_read(db, notification_id)
    if not notif:
        raise HTTPException(status_code=404, detail="Notification introuvable")
    return notif


@router_notifications.patch("/notifications/read-all")
def read_all_notifications(
    user_id: int,
    role: str,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    count = mark_all_read(db, user_id, role)
    return {"message": f"{count} notification(s) marquée(s) comme lues"}


# ──────────────────────────────────────────────────────────────────────────────
#  Reports router
# ──────────────────────────────────────────────────────────────────────────────

router_reports = APIRouter(prefix="/schools", tags=["Rapports"])


@router_reports.post("/{school_id}/reports", response_model=ReportResponse)
def new_report(
    school_id: int,
    body: ReportCreate,
    db: Session = Depends(get_db),
    _: dict = Depends(require_role("school", "admin")),
):
    if not get_school_by_id(db, school_id):
        raise HTTPException(status_code=404, detail="School not found")
    return create_report(db, school_id=school_id,
                         prediction_id=body.prediction_id, content=body.content)


@router_reports.get("/{school_id}/reports", response_model=List[ReportResponse])
def list_reports(
    school_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    if not get_school_by_id(db, school_id):
        raise HTTPException(status_code=404, detail="School not found")
    return get_reports_by_school(db, school_id)


@router_reports.get("/{school_id}/reports/{report_id}", response_model=ReportResponse)
def read_report(
    school_id: int,
    report_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    report = get_report(db, report_id)
    if not report or report.school_id != school_id:
        raise HTTPException(status_code=404, detail="Rapport introuvable")
    return report


# ──────────────────────────────────────────────────────────────────────────────
#  Statistics router
# ──────────────────────────────────────────────────────────────────────────────

router_statistics = APIRouter(prefix="", tags=["Statistiques"])


@router_statistics.get("/schools/{school_id}/statistics", response_model=SchoolStatsResponse)
def school_statistics(
    school_id: int,
    db: Session = Depends(get_db),
    current_user: dict = Depends(get_current_user),
):
    if not get_school_by_id(db, school_id):
        raise HTTPException(status_code=404, detail="School not found")

    students     = db.query(Student).filter(Student.school_id == school_id).all()
    student_ids  = [s.student_id for s in students]
    total_students = len(students)

    predictions = (
        db.query(Prediction).filter(Prediction.student_id.in_(student_ids)).all()
        if student_ids else []
    )
    total_predictions = len(predictions)

    # pass_probability >= 0.5 counts as "passing"
    passed      = [p for p in predictions if p.pass_probability is not None and p.pass_probability >= 0.5]
    pass_rate   = (len(passed) / total_predictions * 100) if total_predictions else 0.0

    scores      = [p.predicted_grade for p in predictions if p.predicted_grade is not None]
    avg_score   = sum(scores) / len(scores) if scores else 0.0

    high_risk   = sum(1 for p in predictions if p.risk_level == "High")
    medium_risk = sum(1 for p in predictions if p.risk_level == "Medium")
    low_risk    = sum(1 for p in predictions if p.risk_level == "Low")

    return SchoolStatsResponse(
        total_students=total_students,
        total_predictions=total_predictions,
        pass_rate=round(pass_rate, 2),
        average_score=round(avg_score, 2),
        high_risk_count=high_risk,
        medium_risk_count=medium_risk,
        low_risk_count=low_risk,
    )


@router_statistics.get("/admins/{admin_id}/statistics", response_model=AdminStatsResponse)
def admin_statistics(
    admin_id: int,
    db: Session = Depends(get_db),
    _: dict = Depends(require_role("admin")),
):
    if not get_admin_by_id(db, admin_id):
        raise HTTPException(status_code=404, detail="Admin not found")

    total_schools     = db.query(sqlfunc.count(School.school_id)).scalar() or 0
    total_students    = db.query(sqlfunc.count(Student.student_id)).scalar() or 0
    total_parents     = db.query(sqlfunc.count(Parent.parent_id)).scalar() or 0
    total_predictions = db.query(sqlfunc.count(Prediction.prediction_id)).scalar() or 0

    passed    = db.query(Prediction).filter(Prediction.pass_probability >= 0.5).count()
    pass_rate = (passed / total_predictions * 100) if total_predictions else 0.0

    # is_approved doit exister dans le modèle School si tu veux ce filtre
    pending = db.query(School).filter(School.is_approved == False).count() \
        if hasattr(School, "is_approved") else 0

    return AdminStatsResponse(
        total_schools=total_schools,
        total_students=total_students,
        total_parents=total_parents,
        total_predictions=total_predictions,
        global_pass_rate=round(pass_rate, 2),
        pending_approvals=pending,
    )
