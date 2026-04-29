"""
routers_auth.py — Router d'authentification JWT
Préfixe : /auth
"""

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session

from database import get_db           # ← adapter selon votre projet
from auth import (
    verify_password, create_access_token,
    hash_password, get_current_user
)
from crud_new import create_otp, verify_otp as check_otp
from schemas_new import (
    LoginRequest, TokenResponse, MeResponse,
    ForgotPasswordRequest, VerifyOTPRequest, ResetPasswordRequest
)
# Import des modèles existants
# from models import Student, Parent, School, Admin   ← adapter

router = APIRouter(prefix="/auth", tags=["Authentification"])


# ─────────────────────────────────────────────
# Helper : trouver l'utilisateur par email et rôle
# ─────────────────────────────────────────────
def _find_user(db: Session, email: str, role: str):
    """
    Retourne (user_object, user_id, name) selon le rôle.
    Adapter les imports et noms de champs selon vos modèles.
    """
    from models import Student, Parent, School, Admin   # adapter

    model_map = {
        "student": Student,
        "parent":  Parent,
        "school":  School,
        "admin":   Admin,
    }
    model = model_map.get(role)
    if model is None:
        return None, None, None

    user = db.query(model).filter(model.email == email).first()
    if user is None:
        return None, None, None

    # Récupérer l'id et le nom (adapter selon vos colonnes)
    uid  = getattr(user, f"{role}_id", None) or getattr(user, "id", None)
    name = getattr(user, "name", "") or getattr(user, "school_name", "") or email
    return user, uid, name


# ─────────────────────────────────────────────
# POST /auth/login
# ─────────────────────────────────────────────
@router.post("/login", response_model=TokenResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    user, uid, name = _find_user(db, payload.email, payload.role)

    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Email ou rôle incorrect"
        )

    if not verify_password(payload.password, user.password):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Mot de passe incorrect"
        )

    token = create_access_token({"sub": str(uid), "role": payload.role})
    return TokenResponse(access_token=token, role=payload.role, user_id=uid)


# ─────────────────────────────────────────────
# GET /auth/me  — utilisateur connecté
# ─────────────────────────────────────────────
@router.get("/me", response_model=MeResponse)
def get_me(db: Session = Depends(get_db),
           current_user: dict = Depends(get_current_user)):
    user, uid, name = _find_user(
        db,
        email=None,      # on cherche par id
        role=current_user["role"]
    )
    # Chercher directement par id
    from models import Student, Parent, School, Admin
    model_map = {"student": Student, "parent": Parent,
                 "school": School, "admin": Admin}
    model = model_map[current_user["role"]]
    user  = db.query(model).filter(
        getattr(model, f"{current_user['role']}_id") == int(current_user["user_id"])
    ).first()

    if not user:
        raise HTTPException(status_code=404, detail="Utilisateur introuvable")

    return MeResponse(
        user_id=int(current_user["user_id"]),
        role=current_user["role"],
        email=user.email,
        name=getattr(user, "name", "") or getattr(user, "school_name", "")
    )


# ─────────────────────────────────────────────
# POST /auth/forgot-password  — envoyer OTP
# ─────────────────────────────────────────────
@router.post("/forgot-password")
def forgot_password(payload: ForgotPasswordRequest, db: Session = Depends(get_db)):
    """
    Génère un OTP et l'envoie par email.
    En production : utiliser smtplib ou une API email (SendGrid, etc.)
    """
    # Vérifier si l'email existe (dans n'importe quel rôle)
    from models import Student, Parent, School, Admin
    found = False
    for model in [Student, Parent, School, Admin]:
        if db.query(model).filter(model.email == payload.email).first():
            found = True
            break

    if not found:
        # Réponse neutre pour éviter l'énumération d'emails
        return {"message": "Si cet email existe, un code vous a été envoyé."}

    otp = create_otp(db, payload.email)

    # ── ENVOI EMAIL ──────────────────────────────────────────
    # Remplacer par votre service email réel
    _send_otp_email(payload.email, otp.code)
    # ─────────────────────────────────────────────────────────

    return {"message": "Code OTP envoyé à votre adresse email."}


# ─────────────────────────────────────────────
# POST /auth/verify-otp  — vérifier le code
# ─────────────────────────────────────────────
@router.post("/verify-otp")
def verify_otp_route(payload: VerifyOTPRequest, db: Session = Depends(get_db)):
    valid = check_otp(db, payload.email, payload.code)
    if not valid:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Code OTP invalide ou expiré"
        )
    return {"message": "Code vérifié avec succès. Vous pouvez réinitialiser votre mot de passe."}


# ─────────────────────────────────────────────
# POST /auth/reset-password
# ─────────────────────────────────────────────
@router.post("/reset-password")
def reset_password(payload: ResetPasswordRequest, db: Session = Depends(get_db)):
    if payload.new_password != payload.confirm_password:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Les mots de passe ne correspondent pas"
        )

    # Vérifier l'OTP une dernière fois
    valid = check_otp(db, payload.email, payload.code)
    if not valid:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Code OTP invalide ou expiré"
        )

    # Mettre à jour le mot de passe dans le bon modèle
    from models import Student, Parent, School, Admin
    new_hash = hash_password(payload.new_password)
    updated = False

    for model in [Student, Parent, School, Admin]:
        user = db.query(model).filter(model.email == payload.email).first()
        if user:
            user.password = new_hash
            db.commit()
            updated = True
            break

    if not updated:
        raise HTTPException(status_code=404, detail="Email introuvable")

    return {"message": "Mot de passe réinitialisé avec succès."}


# ─────────────────────────────────────────────
# Utilitaire email (à remplacer en production)
# ─────────────────────────────────────────────
def _send_otp_email(email: str, code: str):
    """
    Stub : affiche le code dans la console.
    En production, utiliser smtplib ou SendGrid :

    import smtplib
    from email.mime.text import MIMEText
    msg = MIMEText(f"Votre code de vérification : {code}")
    msg["Subject"] = "Réinitialisation de mot de passe"
    msg["From"] = "noreply@votreapp.com"
    msg["To"] = email
    with smtplib.SMTP("smtp.gmail.com", 587) as smtp:
        smtp.starttls()
        smtp.login("user", "pass")
        smtp.send_message(msg)
    """
    print(f"[OTP] Email: {email} | Code: {code}")   # ← remplacer par vrai envoi
