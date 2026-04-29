"""
Script to populate database with test data
"""
from database.database import SessionLocal, engine, Base
from models.models import User, Student, Parent, School, Prediction, Report
from utils.auth import get_password_hash
from datetime import datetime

# Create tables
Base.metadata.create_all(bind=engine)

db = SessionLocal()

# Clear existing data
db.query(Student).delete()
db.query(Parent).delete()
db.query(School).delete()
db.query(User).delete()
db.query(Prediction).delete()
db.query(Report).delete()
db.commit()

print("=" * 60)
print("Populating Database with Test Data")
print("=" * 60)
print()

# CREATE SCHOOLS
print("Creating Schools...")
school1 = School(
    name="Lincoln High School",
    address="123 Main Street, Springfield, IL 62701",
    email="contact@lincolnhs.edu",
    password_hash=get_password_hash("School123!"),
)
school2 = School(
    name="Central Academy",
    address="456 Oak Avenue, Chicago, IL 60601",
    email="contact@centralacademy.edu",
    password_hash=get_password_hash("School456!"),
)
db.add_all([school1, school2])
db.commit()
db.refresh(school1)
db.refresh(school2)
print(f"[OK] Created 2 schools")
print()

# CREATE STUDENTS
print("Creating Students...")
students_data = [
    {
        "first_name": "John",
        "last_name": "Smith",
        "email": "john.smith@student.edu",
        "password": "Student123!",
        "grade": "10",
        "stream": "Science",
        "school_id": school1.school_id,
        "attendance_rate": 92.5,
        "homework_rate": 88.0,
    },
    {
        "first_name": "Sarah",
        "last_name": "Johnson",
        "email": "sarah.johnson@student.edu",
        "password": "Student456!",
        "grade": "11",
        "stream": "Commerce",
        "school_id": school1.school_id,
        "attendance_rate": 95.0,
        "homework_rate": 91.5,
    },
    {
        "first_name": "Michael",
        "last_name": "Williams",
        "email": "michael.williams@student.edu",
        "password": "Student789!",
        "grade": "10",
        "stream": "Arts",
        "school_id": school2.school_id,
        "attendance_rate": 85.0,
        "homework_rate": 75.0,
    },
    {
        "first_name": "Emma",
        "last_name": "Brown",
        "email": "emma.brown@student.edu",
        "password": "Student999!",
        "grade": "12",
        "stream": "Science",
        "school_id": school2.school_id,
        "attendance_rate": 98.0,
        "homework_rate": 96.0,
    },
]

students = []
for student_data in students_data:
    password = student_data.pop("password")
    student = Student(
        **student_data,
        password_hash=get_password_hash(password),
    )
    students.append(student)
    db.add(student)
    student_data["password"] = password  # Re-add for later display

db.commit()
for student in students:
    db.refresh(student)
print(f"[OK] Created {len(students)} students")
print()

# CREATE PARENTS
print("Creating Parents...")
parents_data = [
    {
        "email": "robert.smith@parent.edu",
        "password": "Parent123!",
        "phone_number": "+1-555-0101",
        "student_id": students[0].student_id,
    },
    {
        "email": "lisa.johnson@parent.edu",
        "password": "Parent456!",
        "phone_number": "+1-555-0102",
        "student_id": students[1].student_id,
    },
    {
        "email": "james.williams@parent.edu",
        "password": "Parent789!",
        "phone_number": "+1-555-0103",
        "student_id": students[2].student_id,
    },
]

parents = []
for parent_data in parents_data:
    password = parent_data.pop("password")
    parent = Parent(
        **parent_data,
        password_hash=get_password_hash(password),
    )
    parents.append(parent)
    db.add(parent)
    parent_data["password"] = password  # Re-add for later display

db.commit()
for parent in parents:
    db.refresh(parent)
print(f"[OK] Created {len(parents)} parents")
print()

# CREATE ADMINS
print("Creating Admins...")
admins_data = [
    {
        "username": "admin_john",
        "email": "admin.john@system.edu",
        "password": "Admin123!",
        "role": "admin",
    },
    {
        "username": "admin_sarah",
        "email": "admin.sarah@system.edu",
        "password": "Admin456!",
        "role": "admin",
    },
]

admins = []
for admin_data in admins_data:
    password = admin_data.pop("password")
    admin = User(
        **admin_data,
        password_hash=get_password_hash(password),
    )
    admins.append(admin)
    db.add(admin)
    admin_data["password"] = password  # Re-add for later display

db.commit()
for admin in admins:
    db.refresh(admin)
print(f"[OK] Created {len(admins)} admins")
print()

# CREATE PREDICTIONS
print("Creating Predictions...")
predictions = [
    Prediction(
        student_id=students[0].student_id,
        result="GOOD",
        advice="Continue with the good work! Your attendance and homework are excellent.",
        progress="Making steady progress in Science stream",
        stats="92.5% attendance, 88% homework completion",
    ),
    Prediction(
        student_id=students[1].student_id,
        result="EXCELLENT",
        advice="Outstanding performance! Keep maintaining this level.",
        progress="Excelling in Commerce stream with strong fundamentals",
        stats="95% attendance, 91.5% homework completion",
    ),
    Prediction(
        student_id=students[2].student_id,
        result="AVERAGE",
        advice="Work on improving attendance and homework completion.",
        progress="Need to focus more on Arts stream studies",
        stats="85% attendance, 75% homework completion",
    ),
    Prediction(
        student_id=students[3].student_id,
        result="EXCELLENT",
        advice="Exceptional student! Consider advanced programs.",
        progress="Top performer in Science stream",
        stats="98% attendance, 96% homework completion",
    ),
]
db.add_all(predictions)
db.commit()
print(f"[OK] Created {len(predictions)} predictions")
print()

# CREATE REPORTS
print("Creating Reports...")
reports = [
    Report(
        school_id=school1.school_id,
        prediction_id=predictions[0].prediction_id,
    ),
    Report(
        school_id=school1.school_id,
        prediction_id=predictions[1].prediction_id,
    ),
    Report(
        school_id=school2.school_id,
        prediction_id=predictions[2].prediction_id,
    ),
    Report(
        school_id=school2.school_id,
        prediction_id=predictions[3].prediction_id,
    ),
]
db.add_all(reports)
db.commit()
print(f"[OK] Created {len(reports)} reports")
print()

db.close()

# DISPLAY CREDENTIALS
print("\n" + "=" * 60)
print("TEST CREDENTIALS")
print("=" * 60)
print()

print("[SCHOOL] SCHOOL ACCOUNTS:")
print("-" * 60)
print(f"School 1: Lincoln High School")
print(f"  Email:    contact@lincolnhs.edu")
print(f"  Password: School123!")
print()
print(f"School 2: Central Academy")
print(f"  Email:    contact@centralacademy.edu")
print(f"  Password: School456!")
print()

print("[STUDENT] STUDENT ACCOUNTS:")
print("-" * 60)
for i, student_data in enumerate(students_data):
    print(f"Student {i+1}: {student_data['first_name']} {student_data['last_name']}")
    print(f"  Email:    {student_data['email']}")
    print(f"  Password: {student_data['password']}")
    print()

print("[PARENT] PARENT ACCOUNTS:")
print("-" * 60)
for i, parent_data in enumerate(parents_data):
    print(f"Parent {i+1}")
    print(f"  Email:    {parent_data['email']}")
    print(f"  Password: {parent_data['password']}")
    print()

print("[ADMIN] ADMIN ACCOUNTS:")
print("-" * 60)
for i, admin_data in enumerate(admins_data):
    print(f"Admin {i+1}: {admin_data['username']}")
    print(f"  Email:    {admin_data['email']}")
    print(f"  Password: {admin_data['password']}")
    print()

print("=" * 60)
print("[OK] Database populated successfully!")
print("=" * 60)
