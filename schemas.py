"""
schemas.py
Tous les schémas Pydantic de l'application regroupés ici.
Les routers importent depuis ce fichier plutôt que de redéfinir les classes.
"""

from pydantic import BaseModel, EmailStr
from typing import Optional, List
from datetime import datetime, date


# ══════════════════════════════════════════════
#  USER (base commune)
# ══════════════════════════════════════════════

class UserBase(BaseModel):
    email: str
    name: str

class UserOut(BaseModel):
    user_id: int
    email: str
    name: str
    role: str

    class Config:
        from_attributes = True


# ══════════════════════════════════════════════
#  STUDENT
# ══════════════════════════════════════════════

class StudentCreate(BaseModel):
    email: str
    password: str
    name: str
    school_id: int
    level: Optional[str] = None
    academic_year: Optional[int] = None
    parent_id: Optional[int] = None

class StudentUpdate(BaseModel):
    email: Optional[str] = None
    name: Optional[str] = None
    password: Optional[str] = None
    school_id: Optional[int] = None
    level: Optional[str] = None
    academic_year: Optional[int] = None

class StudentOut(BaseModel):
    student_id: int
    email: str
    school_id: int
    level: Optional[str] = None
    academic_year: Optional[int] = None
    parent_id: Optional[int] = None

    class Config:
        from_attributes = True


# ══════════════════════════════════════════════
#  PARENT
# ══════════════════════════════════════════════

class ParentCreate(BaseModel):
    email: str
    password: str
    name: str
    phone: Optional[str] = None
    address: Optional[str] = None
    profession: Optional[str] = None

class ParentUpdate(BaseModel):
    email: Optional[str] = None
    name: Optional[str] = None
    password: Optional[str] = None
    phone: Optional[str] = None
    address: Optional[str] = None
    profession: Optional[str] = None

class ParentOut(BaseModel):
    parent_id: int
    email: str
    phone: Optional[str] = None
    address: Optional[str] = None
    profession: Optional[str] = None

    class Config:
        from_attributes = True


# ══════════════════════════════════════════════
#  SCHOOL
# ══════════════════════════════════════════════

class SchoolCreate(BaseModel):
    email: str
    password: str
    name: str
    address: str
    phone: Optional[str] = None

class SchoolUpdate(BaseModel):
    address: Optional[str] = None
    phone: Optional[str] = None

class SchoolOut(BaseModel):
    school_id: int
    address: str
    phone: Optional[str] = None

    class Config:
        from_attributes = True


# ══════════════════════════════════════════════
#  ADMIN
# ══════════════════════════════════════════════

class AdminCreate(BaseModel):
    email: str
    password: str
    access_level: Optional[str] = None
    department: Optional[str] = None

class AdminUpdate(BaseModel):
    email: Optional[str] = None
    access_level: Optional[str] = None
    department: Optional[str] = None

class AdminOut(BaseModel):
    admin_id: int
    access_level: Optional[str] = None
    department: Optional[str] = None
    last_login: Optional[datetime] = None
    

    class Config:
        from_attributes = True
       

# ══════════════════════════════════════════════
#  GRADE RECORD
# ══════════════════════════════════════════════

class GradeRecordCreate(BaseModel):
    student_id: int
    trimester1: Optional[float] = None
    trimester2: Optional[float] = None
    trimester3: Optional[float] = None
    final_grade: Optional[float] = None
    academic_year: Optional[int] = None

class GradeRecordOut(BaseModel):
    grade_id: int
    student_id: int
    trimester1: Optional[float] = None
    trimester2: Optional[float] = None
    trimester3: Optional[float] = None
    final_grade: Optional[float] = None
    academic_year: Optional[int] = None

    class Config:
        from_attributes = True


# ══════════════════════════════════════════════
#  PREDICTION
# ══════════════════════════════════════════════

class PredictionCreate(BaseModel):
    student_id: int
    session_id: Optional[int] = None
    admin_id: Optional[int] = None
    predicted_grade: Optional[float] = None
    pass_probability: Optional[float] = None
    risk_level: Optional[str] = None
    confidence_score: Optional[float] = None

class PredictionOut(BaseModel):
    prediction_id: int
    student_id: int
    session_id: Optional[int] = None
    prediction_date: Optional[date] = None
    predicted_grade: Optional[float] = None
    pass_probability: Optional[float] = None
    risk_level: Optional[str] = None
    confidence_score: Optional[float] = None

    class Config:
        from_attributes = True
    administrator = relationship("Admin")    


# ══════════════════════════════════════════════
#  PREDICTION EVALUATION
# ══════════════════════════════════════════════

class PredictionEvaluationCreate(BaseModel):
    prediction_id: int
    actual_grade: Optional[float] = None
    deviation: Optional[float] = None
    is_correct: Optional[bool] = None
    evaluation_category: Optional[str] = None
    feedback: Optional[str] = None

class PredictionEvaluationOut(BaseModel):
    eval_id: int
    prediction_id: int
    actual_grade: Optional[float] = None
    deviation: Optional[float] = None
    is_correct: Optional[bool] = None
    evaluation_category: Optional[str] = None
    feedback: Optional[str] = None
    evaluated_at: datetime

    class Config:
        from_attributes = True


# ══════════════════════════════════════════════
#  ADVICE
# ══════════════════════════════════════════════

class AdviceCreate(BaseModel):
    prediction_id: int
    message: str
    subject_related: Optional[str] = None

class AdviceOut(BaseModel):
    advice_id: int
    prediction_id: int
    message: str
    subject_related: Optional[str] = None
    generated_at: datetime

    class Config:
        from_attributes = True


# ══════════════════════════════════════════════
#  ORIENTATION
# ══════════════════════════════════════════════

class OrientationCreate(BaseModel):
    student_id: int
    prediction_id: Optional[int] = None
    recommended_stream: str
    explanation: Optional[str] = None

class OrientationOut(BaseModel):
    orientation_id: int
    student_id: int
    prediction_id: Optional[int] = None
    recommended_stream: str
    explanation: Optional[str] = None
    generated_at: datetime

    class Config:
        from_attributes = True


# ══════════════════════════════════════════════
#  ML MODEL
# ══════════════════════════════════════════════

class MLModelCreate(BaseModel):
    model_name: str
    model_type: Optional[str] = None
    description: Optional[str] = None
    file_path: Optional[str] = None

class MLModelOut(BaseModel):
    model_id: int
    model_name: str
    model_type: Optional[str] = None
    description: Optional[str] = None
    creation_date: Optional[date] = None
    file_path: Optional[str] = None

    class Config:
        from_attributes = True


# ══════════════════════════════════════════════
#  TRAINING SESSION
# ══════════════════════════════════════════════

class TrainingSessionCreate(BaseModel):
    model_id: int
    admin_id: int
    dataset_used: Optional[str] = None

class TrainingSessionOut(BaseModel):
    session_id: int
    model_id: int
    admin_id: int
    start_date: Optional[date] = None
    end_date: Optional[date] = None
    status: Optional[str] = None
    dataset_used: Optional[str] = None
    training_time_seconds: Optional[int] = None

    class Config:
        from_attributes = True


# ══════════════════════════════════════════════
#  MODEL METRICS
# ══════════════════════════════════════════════

class ModelMetricsOut(BaseModel):
    metric_id: int
    session_id: int
    metric_name: str
    metric_value: Optional[float] = None
    created_at: datetime

    class Config:
        from_attributes = True


# ══════════════════════════════════════════════
#  TRAINING LOGS
# ══════════════════════════════════════════════

class TrainingLogsOut(BaseModel):
    log_id: int
    session_id: int
    log_type: Optional[str] = None
    log_message: Optional[str] = None
    log_timestamp: datetime

    class Config:
        from_attributes = True


# ══════════════════════════════════════════════
#  NOTIFICATION
# ══════════════════════════════════════════════

class NotificationCreate(BaseModel):
    user_id: int
    role: str
    type: str
    message: str

class NotificationOut(BaseModel):
    notification_id: int
    user_id: int
    role: str
    type: str
    message: str
    is_read: bool
    created_at: datetime

    class Config:
        from_attributes = True


# ══════════════════════════════════════════════
#  REPORT
# ══════════════════════════════════════════════

class ReportCreate(BaseModel):
    school_id: int
    prediction_id: int

class ReportOut(BaseModel):
    report_id: int
    school_id: int
    prediction_id: int
    report_date: datetime

    class Config:
        from_attributes = True


# ══════════════════════════════════════════════
#  AUTH
# ══════════════════════════════════════════════

class LoginRequest(BaseModel):
    email: str
    password: str
    role: str   # "student" | "parent" | "school" | "admin"

class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: str
    user_id: int

class OTPRequest(BaseModel):
    email: str
    role: str

class OTPVerifyRequest(BaseModel):
    email: str
    role: str
    code: str

class PasswordResetRequest(BaseModel):
    email: str
    role: str
    code: str
    new_password: str
    confirm_password: str


# ══════════════════════════════════════════════
#  SIMULATION
# ══════════════════════════════════════════════

class SimulationInput(BaseModel):
    trimester1: float
    trimester2: float
    trimester3: float

class SimulationResult(BaseModel):
    annual_average: float
    mention: str
    risk_level: str
    pass_probability: float
    trimester1: float
    trimester2: float
    trimester3: float


# ══════════════════════════════════════════════
#  STATISTICS
# ══════════════════════════════════════════════

class SchoolStatsResponse(BaseModel):
    total_students: int
    total_predictions: int
    pass_rate: float
    average_score: float
    high_risk_count: int
    medium_risk_count: int
    low_risk_count: int

class AdminStatsResponse(BaseModel):
    total_schools: int
    total_students: int
    total_parents: int
    total_predictions: int
    global_pass_rate: float
    pending_approvals: int
