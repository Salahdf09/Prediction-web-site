"""
auth.py — JWT Authentication + Password Hashing
Install: pip install python-jose[cryptography] passlib[bcrypt]
"""

import random
import string
from datetime import datetime, timedelta
from typing import Optional

from jose import JWTError, jwt
from passlib.context import CryptContext

from fastapi import APIRouter, Depends, HTTPException, status
from fastapi.security import OAuth2PasswordBearer
from pydantic import BaseModel
from sqlalchemy.orm import Session

<<<<<<< HEAD
from database.database import get_db
=======
from database import get_db
>>>>>>> origin/prediction-_app--Atefhh
from models import Student, Parent, School, Admin, OTPCode

# ─────────────────────────────────────────────
#  CONFIG
# ─────────────────────────────────────────────
  
import os
SECRET_KEY = os.getenv("SECRET_KEY", "fallback_dev_only")
ALGORITHM  = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24   # 24 h

pwd_context   = CryptContext(schemes=["bcrypt"], deprecated="auto")
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

# ─────────────────────────────────────────────
#  PASSWORD
# ─────────────────────────────────────────────

def hash_password(plain_password: str) -> str:
    """Hash un mot de passe avec bcrypt."""
    return pwd_context.hash(plain_password)


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Vérifie un mot de passe en clair contre le hash."""
    return pwd_context.verify(plain_password, hashed_password)


# ─────────────────────────────────────────────
#  TOKEN JWT
# ─────────────────────────────────────────────

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """
    Crée un JWT.
    data doit contenir :
        {
            "sub":  <user_id: int>,
            "role": "student" | "parent" | "school" | "admin"
        }
    """
    to_encode = data.copy()
    # Assure que sub est stocké en string dans le JWT (standard RFC 7519)
    to_encode["sub"] = str(to_encode["sub"])
    expire = datetime.utcnow() + (
        expires_delta or timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    )
    to_encode["exp"] = expire
    return jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)


def decode_access_token(token: str) -> dict:
    """Décode et valide un JWT. Lève HTTPException si invalide."""
    credentials_exception = HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Token invalide ou expiré",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        raw_id: str = payload.get("sub")
        role: str   = payload.get("role")
        if raw_id is None or role is None:
            raise credentials_exception
        return {"user_id": int(raw_id), "role": role}
    except (JWTError, ValueError):
        raise credentials_exception


# ─────────────────────────────────────────────
#  DÉPENDANCES FastAPI
# ─────────────────────────────────────────────

def get_current_user(token: str = Depends(oauth2_scheme)) -> dict:
    """Dépendance injectée dans les routes protégées."""
    return decode_access_token(token)


def require_role(*roles: str):
    """
    Dépendance qui vérifie le rôle.
    Exemple :
        @router.get("/admin-only", dependencies=[Depends(require_role("admin"))])
    """
    def role_checker(current_user: dict = Depends(get_current_user)):
        if current_user["role"] not in roles:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail=f"Accès refusé. Rôle(s) requis : {list(roles)}",
            )
        return current_user
    return role_checker


# ─────────────────────────────────────────────
#  HELPERS — résolution utilisateur par rôle
# ─────────────────────────────────────────────



def _resolve_user(db: Session, email: str, role: str):
    from models import User
    role_map = {
        "student": (Student, "student_id"),
        "parent":  (Parent,  "parent_id"),
        "school":  (School,  "school_id"),
        "admin":   (Admin,   "admin_id"),
    }
    if role not in role_map:
        return None, None, None

    model, pk_field = role_map[role]

    #  L'email est dans la table User, pas dans Student/Parent etc.
    user_base = db.query(User).filter(User.email == email).first()
    if not user_base:
        return None, None, None

    entity = db.query(model).filter(model.user_id == user_base.user_id).first()
    if not entity:
        return None, None, None

    return entity, getattr(entity, pk_field), user_base.password_hash


# ─────────────────────────────────────────────
#  OTP HELPERS
# ─────────────────────────────────────────────

def _generate_otp(length: int = 6) -> str:
    return "".join(random.choices(string.digits, k=length))


def _save_otp(db: Session, email: str, code: str, ttl_minutes: int = 10) -> OTPCode:
    # Invalide les anciens OTP non utilisés pour cet email
    db.query(OTPCode).filter(
        OTPCode.email == email, OTPCode.is_used == False
    ).delete()
    otp = OTPCode(
        email=email,
        code=code,
        expires_at=datetime.utcnow() + timedelta(minutes=ttl_minutes),
    )
    db.add(otp)
    db.commit()
    db.refresh(otp)
    return otp


def _verify_otp(db: Session, email: str, code: str) -> bool:
    otp = (
        db.query(OTPCode)
        .filter(
            OTPCode.email == email,
            OTPCode.code == code,
            OTPCode.is_used == False,
            OTPCode.expires_at > datetime.utcnow(),
        )
        .first()
    )
    if not otp:
        return False
    otp.is_used = True
    db.commit()
    return True


# ─────────────────────────────────────────────
#  AUTH ROUTER
# ─────────────────────────────────────────────

auth_router = APIRouter(prefix="/auth", tags=["Auth"])


# ---------- Schemas ----------

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


# ---------- Endpoints ----------

@auth_router.post("/login", response_model=LoginResponse)
def login(body: LoginRequest, db: Session = Depends(get_db)):
    """
    Point d'entrée unique pour tous les rôles.
    Retourne un JWT avec {sub, role}.
    """
    user, user_id, password_hash = _resolve_user(db, body.email, body.role)

    if user is None:
        raise HTTPException(status_code=401, detail="Email ou mot de passe invalide")

    if not verify_password(body.password, password_hash):
        raise HTTPException(status_code=401, detail="Email ou mot de passe invalide")

    # Mise à jour last_login pour les admins
    if body.role == "admin":
        user.last_login = datetime.utcnow()
        db.commit()

    token = create_access_token({"sub": user_id, "role": body.role})
    return LoginResponse(access_token=token, role=body.role, user_id=user_id)


@auth_router.post("/otp/send")
def send_otp(body: OTPRequest, db: Session = Depends(get_db)):
    """
    Génère et enregistre un OTP pour l'email donné.
    En production, envoyer le code par email (SMTP / SendGrid…).
    """
    user, _, _ = _resolve_user(db, body.email, body.role)
    if user is None:
        # Réponse générique pour ne pas révéler si l'email existe
        return {"message": "Si cet email existe, un code a été envoyé."}

    code = _generate_otp()
    _save_otp(db, body.email, code)

    # TODO: envoyer le code par email
    # send_email(body.email, subject="Votre code OTP", body=f"Code : {code}")

    return {"message": "Si cet email existe, un code a été envoyé."}


@auth_router.post("/otp/verify")
def verify_otp(body: OTPVerifyRequest, db: Session = Depends(get_db)):
    """Vérifie un OTP sans réinitialiser le mot de passe."""
    if not _verify_otp(db, body.email, body.code):
        raise HTTPException(status_code=400, detail="Code invalide ou expiré")
    return {"message": "Code valide"}


@auth_router.post("/password/reset")
def reset_password(body: PasswordResetRequest, db: Session = Depends(get_db)):
    """
    Réinitialise le mot de passe après vérification de l'OTP.
    """
    if body.new_password != body.confirm_password:
        raise HTTPException(status_code=400, detail="Les mots de passe ne correspondent pas")

    if not _verify_otp(db, body.email, body.code):
        raise HTTPException(status_code=400, detail="Code OTP invalide ou expiré")

    user, _, _ = _resolve_user(db, body.email, body.role)
    if user is None:
        raise HTTPException(status_code=404, detail="Utilisateur introuvable")

    user.password_hash = hash_password(body.new_password)
    db.commit()
    return {"message": "Mot de passe réinitialisé avec succès"}


@auth_router.get("/me")
def get_me(
    current_user: dict = Depends(get_current_user),
    db: Session = Depends(get_db),
):
    """Retourne les informations de l'utilisateur connecté."""
    role    = current_user["role"]
    user_id = current_user["user_id"]

    role_map = {
        "student": (Student, "student_id"),
        "parent":  (Parent,  "parent_id"),
        "school":  (School,  "school_id"),
        "admin":   (Admin,   "admin_id"),
    }
    if role not in role_map:
        raise HTTPException(status_code=400, detail="Rôle inconnu")

    model, pk_field = role_map[role]
    user = db.query(model).filter(getattr(model, pk_field) == user_id).first()
    if not user:
        raise HTTPException(status_code=404, detail="Utilisateur introuvable")

    return {"role": role, "user_id": user_id, "email": user.email}
