from sqlalchemy import Column, Integer, String, Float, DateTime, Boolean, Text, ForeignKey, DECIMAL
from sqlalchemy.orm import relationship
from datetime import datetime
from database.database import Base

class Student(Base):
    __tablename__ = 'students'
    student_id = Column(Integer, primary_key=True, index=True)
    school_id = Column(Integer, ForeignKey('schools.school_id'), nullable=False)
    user_code = Column(String(50), unique=True, index=True, nullable=False)  # ADD THIS
    first_name = Column(String(100), nullable=True)
    last_name = Column(String(100), nullable=True)
    email = Column(String(100), unique=True, index=True, nullable=False)
    grade = Column(String(10), nullable=True)
    stream = Column(String(50), nullable=True)
    password_hash = Column(String(128), nullable=False)
    attendance_rate = Column(Float, nullable=True, default=0.0)
    homework_rate = Column(Float, nullable=True, default=0.0)

class Parent(Base):
    __tablename__ = 'parents'
    parent_id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey('students.student_id'), nullable=False)
    user_code = Column(String(50), unique=True, index=True, nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    phone_number = Column(String(20), nullable=True)
    password_hash = Column(String(128), nullable=False)
    children = relationship("ParentStudent", backref="parent", cascade="all, delete-orphan")

class ParentStudent(Base):
    __tablename__ = 'parent_students'
    id = Column(Integer, primary_key=True, index=True)
    parent_id = Column(Integer, ForeignKey('parents.parent_id'), nullable=False)
    student_id = Column(Integer, ForeignKey('students.student_id'), nullable=False)

class School(Base):
    __tablename__ = 'schools'
    school_id = Column(Integer, primary_key=True, index=True)
    school_code = Column(String(50), unique=True, index=True, nullable=False)  # ADD THIS
    name = Column(String(100), unique=True, index=True, nullable=False)
    address = Column(String(200), nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    password_hash = Column(String(128), nullable=False)

class User(Base):  # Admin
    __tablename__ = 'users'
    user_id = Column(Integer, primary_key=True, index=True)
    admin_code = Column(String(50), unique=True, index=True, nullable=False)  # ADD THIS
    username = Column(String(50), unique=True, index=True, nullable=False)
    email = Column(String(100), unique=True, index=True, nullable=False)
    password_hash = Column(String(128), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    role = Column(String(20), default='user')
class Prediction(Base):
    __tablename__ = 'predictions'

    prediction_id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey('students.student_id'), nullable=False)
    result = Column(String(50), nullable=False)
    advice = Column(Text, nullable=True)
    progress = Column(Text, nullable=True)
    stats = Column(Text, nullable=True)       

class Report(Base):
    __tablename__ = 'reports'
    report_id = Column(Integer, primary_key=True, index=True)
    school_id = Column(Integer, ForeignKey('schools.school_id'), nullable=False)
    prediction_id = Column(Integer, ForeignKey('predictions.prediction_id'), nullable=False)
    report_date = Column(DateTime, default=datetime.utcnow)
