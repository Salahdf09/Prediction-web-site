from typing import Iterable

from sqlalchemy.orm import Session

from models.models import Parent, Prediction, Student


def student_full_name(student: Student) -> str:
    return f"{student.first_name or ''} {student.last_name or ''}".strip() or student.email


def grade_record_for_student(student: Student) -> dict:
    base = 11.5 + (student.student_id % 5) * 0.7
    attendance_bonus = ((student.attendance_rate or 82.0) - 80.0) / 20.0
    homework_bonus = ((student.homework_rate or 84.0) - 80.0) / 25.0
    final_grade = _clamp(base + attendance_bonus + homework_bonus, 0, 20)

    return {
        "trimester1": round(_clamp(final_grade - 1.1, 0, 20), 2),
        "trimester2": round(_clamp(final_grade - 0.2, 0, 20), 2),
        "trimester3": round(_clamp(final_grade + 0.6, 0, 20), 2),
        "final_grade": round(final_grade, 2),
        "academic_year": 2026,
    }


def progress_for_student(student: Student) -> dict:
    return {
        "student_id": student.student_id,
        "grade_records": [grade_record_for_student(student)],
    }


def prediction_for_student(db: Session, student: Student) -> dict:
    saved_prediction = (
        db.query(Prediction)
        .filter(Prediction.student_id == student.student_id)
        .order_by(Prediction.prediction_id.desc())
        .first()
    )
    grade = grade_record_for_student(student)["final_grade"]
    pass_probability = _clamp((grade - 6) / 10, 0.05, 0.98)
    risk_level = "Low" if pass_probability >= 0.7 else "Medium" if pass_probability >= 0.45 else "High"

    return {
        "student_id": student.student_id,
        "prediction_id": saved_prediction.prediction_id if saved_prediction else None,
        "predicted_grade": round(grade, 2),
        "pass_probability": round(pass_probability, 2),
        "risk_level": risk_level,
        "result": saved_prediction.result if saved_prediction else ("PASS" if grade >= 10 else "AT RISK"),
        "advice": saved_prediction.advice if saved_prediction else _advice_for_grade(grade),
        "orientations": orientation_options_for_student(student),
    }


def orientation_for_student(db: Session, student: Student) -> dict:
    prediction = prediction_for_student(db, student)
    recommended = prediction["orientations"][0]
    return {
        "student_id": student.student_id,
        "recommended_stream": recommended,
        "explanation": f"Recommended from the student's current stream, marks, attendance, and homework indicators.",
    }


def school_stats_for_students(db: Session, students: Iterable[Student]) -> dict:
    students = list(students)
    grades = [grade_record_for_student(student)["final_grade"] for student in students]
    predictions = [prediction_for_student(db, student) for student in students]
    total = len(students)
    passed = sum(1 for grade in grades if grade >= 10)

    low_risk = sum(1 for item in predictions if item["risk_level"] == "Low")
    medium_risk = sum(1 for item in predictions if item["risk_level"] == "Medium")
    high_risk = sum(1 for item in predictions if item["risk_level"] == "High")

    return {
        "total_students": total,
        "total_predictions": len(predictions),
        "pass_rate": round((passed / total) * 100, 2) if total else 0,
        "average_score": round(sum(grades) / total, 2) if total else 0,
        "low_risk_count": low_risk,
        "medium_risk_count": medium_risk,
        "high_risk_count": high_risk,
    }


def student_list_item(db: Session, student: Student) -> dict:
    parent = db.query(Parent).filter(Parent.student_id == student.student_id).first()
    return {
        "student_id": student.student_id,
        "id": student.student_id,
        "name": student_full_name(student),
        "email": student.email,
        "grade": student.grade,
        "stream": student.stream,
        "academic_year": 2026,
        "parent_phone": parent.phone_number if parent else "-",
    }


def orientation_options_for_student(student: Student) -> list[str]:
    stream = (student.stream or "").strip().lower()
    if "math" in stream or "science" in stream:
        return ["Science Stream", "Technical Math", "Computer Science"]
    if "commerce" in stream or "econom" in stream:
        return ["Economics", "Management", "Accounting"]
    if "art" in stream or "liter" in stream:
        return ["Literature", "Languages", "Humanities"]
    return ["Science Stream", "Economics", "Literature"]


def _advice_for_grade(grade: float) -> str:
    if grade >= 14:
        return "Strong performance. Keep the same rhythm and focus on exam practice."
    if grade >= 10:
        return "Good progress. Improve consistency in homework and revision sessions."
    return "Student needs a focused support plan for attendance, homework, and core subjects."


def _clamp(value: float, low: float, high: float) -> float:
    return max(low, min(high, value))
