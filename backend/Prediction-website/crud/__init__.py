from sqlalchemy.orm import Session
from models.models import Student, Parent, School, User
#----student crud operations
from models.models import Student


def create_student(db : Session,email : str, school_id : int, grade : str):
    db_student = Student(email=email, school_id=school_id, grade=grade)
    db.add(db_student)
    db.commit()
    db.refresh(db_student)
    return db_student
def get_student_by_id(db : Session, student_id : int):
    return db.query(Student).filter(Student.student_id == student_id).first()

def get_student_by_email(db : Session, email : str):
    return db.query(Student).filter(Student.email == email).first()

def update_student(db : Session, student_id : int, email : str = None, school_id : int = None, grade : str = None):
    db_student = get_student_by_id(db, student_id)
    if not db_student:
        return None
    if email:
        db_student.email = email
    if school_id:
        db_student.school_id = school_id
    if grade:
        db_student.grade = grade
    db.commit()
    db.refresh(db_student)
    return db_student

def delete_student(db : Session, student_id : int):
    db_student = get_student_by_id(db, student_id)
    if not db_student:
        return None
    db.delete(db_student)
    db.commit()
    return db_student

def get_students(db : Session, skip : int = 0, limit : int = 100):
    return db.query(Student).offset(skip).limit(limit).all()


#----parent crud operations
from models.models import Parent

def create_parent(db : Session, email : str, student_id : int, phone_number : str):
    db_parent = Parent(email=email, student_id=student_id, phone_number=phone_number)
    db.add(db_parent)
    db.commit()
    db.refresh(db_parent)
    return db_parent

def get_parent_by_id(db : Session, parent_id : int):
    return db.query(Parent).filter(Parent.parent_id == parent_id).first()

def get_parent_by_email(db : Session, email : str):
    return db.query(Parent).filter(Parent.email == email).first()

def update_parent(db : Session, parent_id : int, email : str = None, student_id : int = None, phone_number : str = None):
    db_parent = get_parent_by_id(db, parent_id)
    if not db_parent:
        return None
    if email:
        db_parent.email = email
    if student_id:
        db_parent.student_id = student_id
    if phone_number:
        db_parent.phone_number = phone_number
    db.commit()
    db.refresh(db_parent)
    return db_parent

def delete_parent(db : Session, parent_id : int):
    db_parent = get_parent_by_id(db, parent_id)
    if not db_parent:
        return None
    db.delete(db_parent)
    db.commit()
    return db_parent
# ============================================================
# SCHOOL CRUD OPERATIONS
# ============================================================

def create_school(db: Session, name: str, address: str):
    """Insert a new school row into the DB."""
    db_school = School(name=name, address=address)
    db.add(db_school)        
    db.commit()              
    db.refresh(db_school)    
    return db_school

def get_school_by_id(db: Session, school_id: int):
    """Return a single school by primary key, or None."""
    return db.query(School).filter(School.school_id == school_id).first()

def get_school_by_name(db: Session, name: str):
    
    return db.query(School).filter(School.name == name).first()

def get_schools(db: Session, skip: int = 0, limit: int = 100):
    
    return db.query(School).offset(skip).limit(limit).all()

def update_school(db: Session, school_id: int, name: str = None, address: str = None):

    db_school = get_school_by_id(db, school_id)
    if not db_school:
        return None
    if name:
        db_school.name = name
    if address:
        db_school.address = address
    db.commit()
    db.refresh(db_school)
    return db_school

def approve_school(db: Session, school_id: int):
    
    db_school = get_school_by_id(db, school_id)
    if not db_school:
        return None
    db_school.is_approved = True
    db.commit()
    db.refresh(db_school)
    return db_school

def delete_school(db: Session, school_id: int):
    db_school = get_school_by_id(db, school_id)
    if not db_school:
        return None
    db.delete(db_school)
    db.commit()
    return db_school


# ============================================================
# ADMIN CRUD OPERATIONS  (admin rows live in the User table)
# ============================================================

def create_admin(db: Session, username: str, admin_code: str, email: str, password_hash: str):
    db_admin = User(username=username, admin_code=admin_code, email=email,
                    password_hash=password_hash, role="admin")
    db.add(db_admin)
    db.commit()
    db.refresh(db_admin)
    return db_admin

def get_admin_by_id(db: Session, admin_id: int):
    return db.query(User).filter(User.user_id == admin_id, User.role == "admin").first()

def get_admin_by_email(db: Session, email: str):
    return db.query(User).filter(User.email == email, User.role == "admin").first()

def get_admins(db: Session, skip: int = 0, limit: int = 100):
    return db.query(User).filter(User.role == "admin").offset(skip).limit(limit).all()

def update_admin(db: Session, admin_id: int, email: str = None, password_hash: str = None):
    db_admin = get_admin_by_id(db, admin_id)
    if not db_admin:
        return None
    if email:
        db_admin.email = email
    if password_hash:
        db_admin.password_hash = password_hash
    db.commit()
    db.refresh(db_admin)
    return db_admin

def delete_admin(db: Session, admin_id: int):
    db_admin = get_admin_by_id(db, admin_id)
    if not db_admin:
        return None
    db.delete(db_admin)
    db.commit()
    return db_admin
