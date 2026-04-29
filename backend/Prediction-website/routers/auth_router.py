from fastapi import APIRouter, Depends, HTTPException, Header, status
from sqlalchemy.orm import Session
from datetime import timedelta
from jose import JWTError, jwt

from database.database import get_db
from models.models import Student, Parent, School, User
from crud.otp_crud import create_otp, verify_otp
from schemas.schemas import (
    ForgotPasswordRequest, VerifyOTPRequest, ResetPasswordRequest,
    LoginRequest, TokenResponse, MeResponse,
)
from utils.auth import get_password_hash, verify_password, create_access_token, SECRET_KEY, ALGORITHM

router = APIRouter(prefix="/auth", tags=["auth"])

# ── helpers ──────────────────────────────────────────────────────────────────

def _find_user_by_email(db: Session, email: str):
    for model in [Student, Parent, School, User]:
        user = db.query(model).filter(model.email == email).first()
        if user:
            return user, model
    return None, None


def _lookup_user(db: Session, role: str, email: str):
    """Return (user, user_id) for the given role, or (None, None)."""
    email_lower = email.lower()
    if role == "student":
        u = db.query(Student).filter(Student.email.ilike(email_lower)).first()
        return u, (u.student_id if u else None)
    if role == "parent":
        u = db.query(Parent).filter(Parent.email.ilike(email_lower)).first()
        return u, (u.parent_id if u else None)
    if role == "school":
        u = db.query(School).filter(School.email.ilike(email_lower)).first()
        return u, (u.school_id if u else None)
    if role == "admin":
        u = db.query(User).filter(User.email.ilike(email_lower), User.role == "admin").first()
        return u, (u.user_id if u else None)
    return None, None


def _user_name(role: str, user) -> str:
    if role == "student":
        return f"{user.first_name} {user.last_name}".strip()
    if role == "school":
        return user.name
    if role == "admin":
        return user.username
    return user.email  # parent has no display name field


# ── unified login ─────────────────────────────────────────────────────────────

@router.post("/login", response_model=TokenResponse)
def unified_login(payload: LoginRequest, db: Session = Depends(get_db)):
    user, user_id = _lookup_user(db, payload.role, payload.email)
    if not user or not verify_password(payload.password, user.password_hash):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid credentials")
    token = create_access_token(
        data={"sub": str(user_id), "role": payload.role},
        expires_delta=timedelta(minutes=30),
    )
    return {"access_token": token, "role": payload.role, "user_id": user_id}


# ── /me ───────────────────────────────────────────────────────────────────────

@router.get("/me", response_model=MeResponse)
def get_me(authorization: str = Header(...), db: Session = Depends(get_db)):
    try:
        scheme, token = authorization.split()
        if scheme.lower() != "bearer":
            raise ValueError()
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: int = int(payload["sub"])
        role: str = payload["role"]
    except (JWTError, ValueError, KeyError):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired token")

    user, _ = _lookup_user(db, role, "")  # we query by id below
    # _lookup_user queries by email — query by id directly
    if role == "student":
        user = db.query(Student).filter(Student.student_id == user_id).first()
    elif role == "parent":
        user = db.query(Parent).filter(Parent.parent_id == user_id).first()
    elif role == "school":
        user = db.query(School).filter(School.school_id == user_id).first()
    elif role == "admin":
        user = db.query(User).filter(User.user_id == user_id).first()
    else:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid role in token")

    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="User not found")

    return {"user_id": user_id, "role": role, "email": user.email, "name": _user_name(role, user)}


# ── password reset (OTP flow) ─────────────────────────────────────────────────

@router.post("/forgot-password")
def forgot_password(payload: ForgotPasswordRequest, db: Session = Depends(get_db)):
    user, _ = _find_user_by_email(db, payload.email)
    if user:
        otp = create_otp(db, payload.email)
        print(f"[OTP] Email: {payload.email} | Code: {otp.code}")
    # neutral response — never reveal whether the email exists
    return {"message": "If this email exists, a code has been sent."}


@router.post("/verify-otp")
def verify_otp_route(payload: VerifyOTPRequest, db: Session = Depends(get_db)):
    if not verify_otp(db, payload.email, payload.code):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid or expired OTP code")
    return {"message": "Code verified. You can now reset your password."}


@router.post("/reset-password")
def reset_password(payload: ResetPasswordRequest, db: Session = Depends(get_db)):
    if payload.new_password != payload.confirm_password:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Passwords do not match")
    if not verify_otp(db, payload.email, payload.code):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid or expired OTP code")
    user, _ = _find_user_by_email(db, payload.email)
    if not user:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Email not found")
    user.password_hash = get_password_hash(payload.new_password)
    db.commit()
    return {"message": "Password reset successfully."}
