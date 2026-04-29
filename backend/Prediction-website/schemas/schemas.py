from pydantic import BaseModel, EmailStr
from typing import Optional, Literal

class StudentCreate(BaseModel):
    firstName: str
    familyName: str
    email: EmailStr
    studentPersonalId: str   # this is user_code
    schoolName: str
    level: str
    stream: str
    password: str

class StudentLogin(BaseModel):
    email: EmailStr
    user_code: str
    password: str

class StudentResponse(BaseModel):
    student_id: int
    email: str
    first_name: str
    last_name: str
    grade: Optional[str]
    stream: Optional[str]
    attendance_rate: Optional[float]
    homework_rate: Optional[float]
    class Config:
        from_attributes = True

class ParentCreate(BaseModel):
    email: EmailStr
    phone_number: Optional[str]
    student_code: str        # child's user_code — also used as parent's login code
    password: str

class ParentLogin(BaseModel):
    email: EmailStr
    user_code: str
    password: str

class ParentResponse(BaseModel):
    parent_id: int
    email: str
    phone_number: Optional[str]
    student_id: int
    user_code: str           # = child's student code, needed to show after signup
    class Config:
        from_attributes = True

class SchoolCreate(BaseModel):
    name: str
    address: str
    school_code: str         # ADD
    email: EmailStr
    password: str

class SchoolLogin(BaseModel):
    email: EmailStr
    school_code: str
    password: str

class SchoolResponse(BaseModel):
    school_id: int
    name: str
    address: str
    email: str
    class Config:
        from_attributes = True

class AdminCreate(BaseModel):
    username: str
    admin_code: str          # ADD
    email: EmailStr
    password: str

class AdminLogin(BaseModel):
    email: EmailStr
    admin_code: str
    password: str

class AdminResponse(BaseModel):
    user_id: int
    username: str
    email: str
    role: str
    class Config:
        from_attributes = True

class Token(BaseModel):
    access_token: str
    token_type: str
    role: str
    # OTP / Auth schemas
class ForgotPasswordRequest(BaseModel):
    email: EmailStr

class VerifyOTPRequest(BaseModel):
    email: EmailStr
    code: str

class ResetPasswordRequest(BaseModel):
    email: EmailStr
    code: str
    new_password: str
    confirm_password: str

class LoginRequest(BaseModel):
    email: EmailStr
    password: str
    role: Literal["student", "parent", "school", "admin"]

class TokenResponse(BaseModel):
    access_token: str
    role: str
    user_id: int

class MeResponse(BaseModel):
    user_id: int
    role: str
    email: str
    name: str