"""
crud_users.py — CRUD pour User, Student, Parent, School, Administrator

Architecture : chaque entité (Student, Parent, School, Administrator) est un
sous-type de User (héritage en table séparée). La création se fait en deux
étapes : d'abord un User, puis l'entité spécialisée avec id_user comme FK.
"""
from passlib.context import CryptContext
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
from sqlalchemy.orm import Session
from datetime import datetime
from models import User, Student, Parent, School, Administrator
from database import get_db


# ══════════════════════════════════════════════
#  USER  (table de base)
# ══════════════════════════════════════════════

def create_user(db: Session, name: str, email: str,
                password: str, role: str) -> User:
    hashed = pwd_context.hash(password)              
    user = User(name=name, email=email, password=password, role=role)
    db.add(user)
    db.commit()
    db.refresh(user)
    return user


def get_user_by_id(db: Session, user_id: int) -> User | None:
    return db.query(User).filter(User.id_user == user_id).first()


def get_user_by_email(db: Session, email: str) -> User | None:
    return db.query(User).filter(User.email == email).first()


def get_users(db: Session, skip: int = 0, limit: int = 100) -> list[User]:
    return db.query(User).offset(skip).limit(limit).all()

def update_user(db: Session, user_id: int, name: str = None,
                email: str = None, password: str = None) -> User | None:
    user = get_user_by_id(db, user_id)
    if not user:
        return None
    if name is not None:
        user.name = name
    if email is not None:
        user.email = email
    if password is not None:
        user.password_hash = pwd_context.hash(password)  # ✅ Hash !
    db.commit()
    db.refresh(user)
    return user


def delete_user(db: Session, user_id: int) -> User | None:
    user = get_user_by_id(db, user_id)
    if not user:
        return None
    db.delete(user)
    db.commit()
    return user


# ══════════════════════════════════════════════
#  STUDENT
#  Champs propres : level, attendanceRate, homeworkRate,
#                   academic_year, id_school (FK), id_parent (FK)
# ══════════════════════════════════════════════

def create_student(db: Session, user_id: int, level: str,
                   school_id: int, parent_id: int = None,
                   homework_rate: float = 0.0,
                   academic_year: int = None) -> Student:
    student = Student(
        id_user=user_id,
        level=level,
        id_school=school_id,
        id_parent=parent_id,
        homeworkRate=homework_rate,
        academic_year=academic_year,
    )
    db.add(student)
    db.commit()
    db.refresh(student)
    return student


def get_student_by_id(db: Session, student_id: int) -> Student | None:
    return db.query(Student).filter(Student.id_student == student_id).first()


def get_student_by_user_id(db: Session, user_id: int) -> Student | None:
    """Retrouve le Student à partir de son id_user (clé vers User)."""
    return db.query(Student).filter(Student.id_user == user_id).first()


def get_students(db: Session, skip: int = 0, limit: int = 100) -> list[Student]:
    return db.query(Student).offset(skip).limit(limit).all()


def update_student(db: Session, student_id: int, level: str = None,
                   school_id: int = None, parent_id: int = None,
                   homework_rate: float = None,
                   academic_year: int = None) -> Student | None:
    student = get_student_by_id(db, student_id)
    if not student:
        return None
    if level is not None:
        student.level = level
    if school_id is not None:
        student.id_school = school_id
    if parent_id is not None:
        student.id_parent = parent_id
    if homework_rate is not None:
        student.homeworkRate = homework_rate
    if academic_year is not None:
        student.academic_year = academic_year
    db.commit()
    db.refresh(student)
    return student


def delete_student(db: Session, student_id: int) -> Student | None:
    student = get_student_by_id(db, student_id)
    if not student:
        return None
    db.delete(student)
    db.commit()
    return student


# ══════════════════════════════════════════════
#  PARENT
#  Champs propres : phone, address, profession
#  (Le lien vers l'élève est porté par Student.id_parent)
# ══════════════════════════════════════════════

def create_parent(db: Session, user_id: int, phone: str,
                  address: str = None, profession: str = None) -> Parent:
    parent = Parent(
        id_user=user_id,
        phone=phone,
        address=address,
        profession=profession,
    )
    db.add(parent)
    db.commit()
    db.refresh(parent)
    return parent


def get_parent_by_id(db: Session, parent_id: int) -> Parent | None:
    return db.query(Parent).filter(Parent.id_parent == parent_id).first()


def get_parent_by_user_id(db: Session, user_id: int) -> Parent | None:
    return db.query(Parent).filter(Parent.id_user == user_id).first()


def get_parents(db: Session, skip: int = 0, limit: int = 100) -> list[Parent]:
    return db.query(Parent).offset(skip).limit(limit).all()


def update_parent(db: Session, parent_id: int, phone: str = None,
                  address: str = None, profession: str = None) -> Parent | None:
    parent = get_parent_by_id(db, parent_id)
    if not parent:
        return None
    if phone is not None:
        parent.phone = phone
    if address is not None:
        parent.address = address
    if profession is not None:
        parent.profession = profession
    db.commit()
    db.refresh(parent)
    return parent


def delete_parent(db: Session, parent_id: int) -> Parent | None:
    parent = get_parent_by_id(db, parent_id)
    if not parent:
        return None
    db.delete(parent)
    db.commit()
    return parent


# ══════════════════════════════════════════════
#  SCHOOL
#  Champs propres : address, phone
#  (Le nom de l'école est le champ `name` de son User parent)
# ══════════════════════════════════════════════

def create_school(db: Session, user_id: int,
                  address: str, phone: str) -> School:
    school = School(id_user=user_id, address=address, phone=phone)
    db.add(school)
    db.commit()
    db.refresh(school)
    return school


def get_school_by_id(db: Session, school_id: int) -> School | None:
    return db.query(School).filter(School.id_school == school_id).first()


def get_school_by_user_id(db: Session, user_id: int) -> School | None:
    return db.query(School).filter(School.id_user == user_id).first()


def get_schools(db: Session, skip: int = 0, limit: int = 100) -> list[School]:
    return db.query(School).offset(skip).limit(limit).all()


def update_school(db: Session, school_id: int,
                  address: str = None, phone: str = None) -> School | None:
    school = get_school_by_id(db, school_id)
    if not school:
        return None
    if address is not None:
        school.address = address
    if phone is not None:
        school.phone = phone
    db.commit()
    db.refresh(school)
    return school


def approve_school(db: Session, school_id: int) -> School | None:
    """
    Appelée par Administrator.approveSchool().
    Si le modèle School possède un champ is_approved, il est mis à True ici.
    """
    school = get_school_by_id(db, school_id)
    if not school:
        return None
    if hasattr(school, "is_approved"):
        school.is_approved = True
        db.commit()
        db.refresh(school)
    return school


def delete_school(db: Session, school_id: int) -> School | None:
    school = get_school_by_id(db, school_id)
    if not school:
        return None
    db.delete(school)
    db.commit()
    return school


# ══════════════════════════════════════════════
#  ADMINISTRATOR
#  Champs propres : access_level, department, last_login
# ══════════════════════════════════════════════

def create_administrator(db: Session, user_id: int, access_level: str,
                          department: str = None) -> Administrator:
    admin = Administrator(
        id_user=user_id,
        access_level=access_level,
        department=department,
    )
    db.add(admin)
    db.commit()
    db.refresh(admin)
    return admin


def get_administrator_by_id(db: Session, admin_id: int) -> Administrator | None:
    return db.query(Administrator).filter(Administrator.id_admin == admin_id).first()


def get_administrator_by_user_id(db: Session, user_id: int) -> Administrator | None:
    return db.query(Administrator).filter(Administrator.id_user == user_id).first()


def get_administrators(db: Session, skip: int = 0,
                        limit: int = 100) -> list[Administrator]:
    return db.query(Administrator).offset(skip).limit(limit).all()


def update_administrator(db: Session, admin_id: int,
                          access_level: str = None,
                          department: str = None) -> Administrator | None:
    admin = get_administrator_by_id(db, admin_id)
    if not admin:
        return None
    if access_level is not None:
        admin.access_level = access_level
    if department is not None:
        admin.department = department
    db.commit()
    db.refresh(admin)
    return admin


def record_admin_login(db: Session, admin_id: int) -> Administrator | None:
    """Met à jour last_login à l'heure actuelle (UTC)."""
    admin = get_administrator_by_id(db, admin_id)
    if not admin:
        return None
    admin.last_login = datetime.utcnow()
    db.commit()
    db.refresh(admin)
    return admin


def delete_administrator(db: Session, admin_id: int) -> Administrator | None:
    admin = get_administrator_by_id(db, admin_id)
    if not admin:
        return None
    db.delete(admin)
    db.commit()
    return admin
