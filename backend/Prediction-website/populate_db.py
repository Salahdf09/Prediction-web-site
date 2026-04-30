"""
Create demo PostgreSQL data for the Prediction Website.

Run from backend/Prediction-website:
    python populate_db.py
"""
from database.database import Base, SessionLocal, engine
from models.models import Parent, ParentStudent, Prediction, Report, School, Student, User
from models.otp import OTP
from utils.auth import get_password_hash


DEMO_PASSWORD = "Demo123!"


def reset_database(db):
    db.query(OTP).delete()
    db.query(Report).delete()
    db.query(Prediction).delete()
    db.query(ParentStudent).delete()
    db.query(Parent).delete()
    db.query(Student).delete()
    db.query(User).delete()
    db.query(School).delete()
    db.commit()


def main():
    Base.metadata.create_all(bind=engine)
    db = SessionLocal()

    try:
        reset_database(db)

        school = School(
            school_code="SCH-DEMO-001",
            name="Codex Demo School",
            address="123 Demo Avenue, Algiers",
            email="demo.school@example.com",
            password_hash=get_password_hash(DEMO_PASSWORD),
        )
        db.add(school)
        db.commit()
        db.refresh(school)

        students = [
            Student(
                school_id=school.school_id,
                user_code="STD-DEMO-001",
                first_name="Yasmine",
                last_name="Bouziane",
                email="demo.student@example.com",
                grade="2AS",
                stream="Science",
                password_hash=get_password_hash(DEMO_PASSWORD),
                attendance_rate=92.0,
                homework_rate=88.0,
            ),
            Student(
                school_id=school.school_id,
                user_code="STD-DEMO-002",
                first_name="Atef",
                last_name="Kechid",
                email="demo.student2@example.com",
                grade="2AS",
                stream="Commerce",
                password_hash=get_password_hash(DEMO_PASSWORD),
                attendance_rate=84.0,
                homework_rate=81.0,
            ),
        ]
        db.add_all(students)
        db.commit()
        for student in students:
            db.refresh(student)

        parent = Parent(
            student_id=students[0].student_id,
            user_code=students[0].user_code,
            email="demo.parent@example.com",
            phone_number="+213555000000",
            password_hash=get_password_hash(DEMO_PASSWORD),
        )
        db.add(parent)
        db.commit()
        db.refresh(parent)
        db.add(ParentStudent(parent_id=parent.parent_id, student_id=students[0].student_id))

        admin = User(
            admin_code="ADM-DEMO-001",
            username="demo_admin",
            email="demo.admin@example.com",
            password_hash=get_password_hash(DEMO_PASSWORD),
            role="admin",
        )
        db.add(admin)

        predictions = [
            Prediction(
                student_id=students[0].student_id,
                result="PASS",
                advice="Strong performance. Keep practicing official exam exercises.",
                progress="Stable academic progress with good attendance.",
                stats="Attendance 92%, homework 88%",
            ),
            Prediction(
                student_id=students[1].student_id,
                result="PASS",
                advice="Good progress. Improve homework consistency before exams.",
                progress="Improving progress with medium risk.",
                stats="Attendance 84%, homework 81%",
            ),
        ]
        db.add_all(predictions)
        db.commit()
        for prediction in predictions:
            db.refresh(prediction)

        db.add(Report(school_id=school.school_id, prediction_id=predictions[0].prediction_id))
        db.commit()

        print("Demo data created successfully.")
        print()
        print("Login URL: http://localhost:5173/login")
        print(f"Password for all accounts: {DEMO_PASSWORD}")
        print()
        print("Student: demo.student@example.com")
        print("Parent:  demo.parent@example.com")
        print("School:  demo.school@example.com")
        print("Admin:   demo.admin@example.com")
        print()
        print("Codes:")
        print("Student ID: STD-DEMO-001")
        print("School ID:  SCH-DEMO-001")
        print("Admin ID:   ADM-DEMO-001")
    finally:
        db.close()


if __name__ == "__main__":
    main()
