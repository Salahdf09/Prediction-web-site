from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean, Text, ForeignKey, Date
from sqlalchemy.orm import relationship
from datetime import datetime
from database.database import Base


# ──────────────────────────────────────────────
#  Core user / auth
# ──────────────────────────────────────────────

class User(Base):
    __tablename__ = 'users'

    user_id       = Column(Integer, primary_key=True, index=True)
    name          = Column(String(100), nullable=False)
    email         = Column(String(100), unique=True, index=True, nullable=False)
    password_hash = Column(String(128), nullable=False)
    role          = Column(String(20), default='user')


class Admin(Base):
    __tablename__ = 'admins'

    admin_id      = Column(Integer, primary_key=True, index=True)
    user_id       = Column(Integer, ForeignKey('users.user_id'), nullable=False)
    access_level  = Column(String(50), nullable=True)
    department    = Column(String(100), nullable=True)
    last_login    = Column(DateTime, nullable=True)

    user              = relationship("User")
    training_sessions = relationship("TrainingSession", back_populates="administrator")


class School(Base):
    __tablename__ = 'schools'

    school_id     = Column(Integer, primary_key=True, index=True)
    user_id       = Column(Integer, ForeignKey('users.user_id'), nullable=False)
    address       = Column(String(200), nullable=False)
    phone         = Column(String(20), nullable=True)
    is_approved = Column(Boolean, default=False)
    user      = relationship("User")
    students  = relationship("Student", back_populates="school")
    reports   = relationship("Report", back_populates="school")


class Parent(Base):
    __tablename__ = 'parents'

    parent_id     = Column(Integer, primary_key=True, index=True)
    user_id       = Column(Integer, ForeignKey('users.user_id'), nullable=False)
    phone         = Column(String(20), nullable=True)
    address       = Column(String(200), nullable=True)
    profession    = Column(String(100), nullable=True)

    user     = relationship("User")
    students = relationship("Student", back_populates="parent")


class Student(Base):
    __tablename__ = 'students'

    student_id    = Column(Integer, primary_key=True, index=True)
    user_id       = Column(Integer, ForeignKey('users.user_id'), nullable=False)
    school_id     = Column(Integer, ForeignKey('schools.school_id'), nullable=False)
    parent_id     = Column(Integer, ForeignKey('parents.parent_id'), nullable=True)
    level         = Column(String(50), nullable=True)
    academic_year = Column(Integer, nullable=True)

    user          = relationship("User")
    school        = relationship("School", back_populates="students")
    parent        = relationship("Parent", back_populates="students")
    grade_records = relationship("GradeRecord", back_populates="student")
    predictions   = relationship("Prediction", back_populates="student")
    orientations  = relationship("Orientation", back_populates="student")


# ──────────────────────────────────────────────
#  Academic records
# ──────────────────────────────────────────────

class GradeRecord(Base):
    __tablename__ = 'grade_records'

    grade_id      = Column(Integer, primary_key=True, index=True, autoincrement=True)
    student_id    = Column(Integer, ForeignKey('students.student_id'), nullable=False)
    trimester1    = Column(Float, nullable=True)
    trimester2    = Column(Float, nullable=True)
    trimester3    = Column(Float, nullable=True)
    final_grade   = Column(Float, nullable=True)
    academic_year = Column(Integer, nullable=True)

    student = relationship("Student", back_populates="grade_records")


# ──────────────────────────────────────────────
#  ML pipeline
# ──────────────────────────────────────────────

class MLModel(Base):
    __tablename__ = 'ml_models'

    model_id      = Column(Integer, primary_key=True, index=True, autoincrement=True)
    model_name    = Column(String(100), nullable=False)
    model_type    = Column(String(50), nullable=True)
    description   = Column(Text, nullable=True)
    creation_date = Column(Date, nullable=True)
    file_path     = Column(String(255), nullable=True)

    training_sessions = relationship("TrainingSession", back_populates="ml_model")


class TrainingSession(Base):
    __tablename__ = 'training_sessions'

    session_id            = Column(Integer, primary_key=True, index=True, autoincrement=True)
    model_id              = Column(Integer, ForeignKey('ml_models.model_id'), nullable=False)
    admin_id              = Column(Integer, ForeignKey('admins.admin_id'), nullable=False)
    start_date            = Column(Date, nullable=True)
    end_date              = Column(Date, nullable=True)
    status                = Column(String(50), nullable=True)
    dataset_used          = Column(String(255), nullable=True)
    training_time_seconds = Column(Integer, nullable=True)

    ml_model      = relationship("MLModel", back_populates="training_sessions")
    administrator = relationship("Admin", back_populates="training_sessions")
    model_metrics = relationship("ModelMetrics", back_populates="session")
    training_logs = relationship("TrainingLogs", back_populates="session")
    predictions   = relationship("Prediction", back_populates="session")


class ModelMetrics(Base):
    __tablename__ = 'model_metrics'

    metric_id    = Column(Integer, primary_key=True, index=True, autoincrement=True)
    session_id   = Column(Integer, ForeignKey('training_sessions.session_id'), nullable=False)
    metric_name  = Column(String(100), nullable=False)
    metric_value = Column(Float, nullable=True)
    created_at   = Column(DateTime, default=datetime.utcnow)

    session = relationship("TrainingSession", back_populates="model_metrics")


class TrainingLogs(Base):
    __tablename__ = 'training_logs'

    log_id        = Column(Integer, primary_key=True, index=True, autoincrement=True)
    session_id    = Column(Integer, ForeignKey('training_sessions.session_id'), nullable=False)
    log_type      = Column(String(50), nullable=True)
    log_message   = Column(Text, nullable=True)
    log_timestamp = Column(DateTime, default=datetime.utcnow)

    session = relationship("TrainingSession", back_populates="training_logs")


# ──────────────────────────────────────────────
#  Predictions & outputs
# ──────────────────────────────────────────────

class Prediction(Base):
    __tablename__ = 'predictions'

    prediction_id    = Column(Integer, primary_key=True, index=True, autoincrement=True)
    student_id       = Column(Integer, ForeignKey('students.student_id'), nullable=False)
    session_id       = Column(Integer, ForeignKey('training_sessions.session_id'), nullable=True)
    admin_id         = Column(Integer, ForeignKey('admins.admin_id'), nullable=True)
    prediction_date  = Column(Date, default=datetime.utcnow)
    predicted_grade  = Column(Float, nullable=True)
    pass_probability = Column(Float, nullable=True)
    risk_level       = Column(String(50), nullable=True)
    confidence_score = Column(Float, nullable=True)

    student     = relationship("Student", back_populates="predictions")
    session     = relationship("TrainingSession", back_populates="predictions")
    orientations = relationship("Orientation", back_populates="prediction")
    advices      = relationship("Advice", back_populates="prediction")
    evaluation   = relationship("PredictionEvaluation", back_populates="prediction", uselist=False)


class PredictionEvaluation(Base):
    __tablename__ = 'prediction_evaluations'

    eval_id             = Column(Integer, primary_key=True, index=True, autoincrement=True)
    prediction_id       = Column(Integer, ForeignKey('predictions.prediction_id'), nullable=False)
    actual_grade        = Column(Float, nullable=True)
    deviation           = Column(Float, nullable=True)
    is_correct          = Column(Boolean, nullable=True)
    evaluation_category = Column(String(100), nullable=True)
    feedback            = Column(Text, nullable=True)
    evaluated_at        = Column(DateTime, default=datetime.utcnow)

    prediction = relationship("Prediction", back_populates="evaluation")


class Orientation(Base):
    __tablename__ = 'orientations'

    orientation_id     = Column(Integer, primary_key=True, index=True, autoincrement=True)
    student_id         = Column(Integer, ForeignKey('students.student_id'), nullable=False)
    prediction_id      = Column(Integer, ForeignKey('predictions.prediction_id'), nullable=True)
    recommended_stream = Column(String(100), nullable=False)
    explanation        = Column(Text, nullable=True)
    generated_at       = Column(DateTime, default=datetime.utcnow)

    student    = relationship("Student", back_populates="orientations")
    prediction = relationship("Prediction", back_populates="orientations")


class Advice(Base):
    __tablename__ = 'advices'

    advice_id       = Column(Integer, primary_key=True, index=True, autoincrement=True)
    prediction_id   = Column(Integer, ForeignKey('predictions.prediction_id'), nullable=False)
    message         = Column(Text, nullable=False)
    subject_related = Column(String(100), nullable=True)
    generated_at    = Column(DateTime, default=datetime.utcnow)

    prediction = relationship("Prediction", back_populates="advices")


# ──────────────────────────────────────────────
#  Reports & notifications
# ──────────────────────────────────────────────

class Report(Base):
    __tablename__ = 'reports'

    report_id     = Column(Integer, primary_key=True, index=True)
    school_id     = Column(Integer, ForeignKey('schools.school_id'), nullable=False)
    prediction_id = Column(Integer, ForeignKey('predictions.prediction_id'), nullable=False)
    report_date   = Column(DateTime, default=datetime.utcnow)

    school = relationship("School", back_populates="reports")


class Notification(Base):
    __tablename__ = 'notifications'

    notification_id = Column(Integer, primary_key=True, index=True, autoincrement=True)
    user_id         = Column(Integer, nullable=False)
    role            = Column(String(20), nullable=False)
    type            = Column(String(50), nullable=False)
    message         = Column(Text, nullable=False)
    is_read         = Column(Boolean, default=False)
    created_at      = Column(DateTime, default=datetime.utcnow)


class OTPCode(Base):
    __tablename__ = 'otp_codes'

    id         = Column(Integer, primary_key=True, autoincrement=True)
    email      = Column(String(255), nullable=False, index=True)
    code       = Column(String(6), nullable=False)
    is_used    = Column(Boolean, default=False)
    expires_at = Column(DateTime, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
