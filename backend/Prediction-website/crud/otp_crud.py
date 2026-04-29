from sqlalchemy.orm import Session
from models.otp import OTP
from datetime import datetime, timedelta
import random
import string

def create_otp(db: Session, email: str) -> OTP:
    # Delete old OTPs for this email
    db.query(OTP).filter(OTP.email == email).delete()
    db.commit()

    code = "".join(random.choices(string.digits, k=6))
    expires_at = datetime.utcnow() + timedelta(minutes=10)

    otp = OTP(email=email, code=code, expires_at=expires_at)
    db.add(otp)
    db.commit()
    db.refresh(otp)
    return otp

def verify_otp(db: Session, email: str, code: str) -> bool:
    otp = db.query(OTP).filter(
        OTP.email == email,
        OTP.code == code,
        OTP.used == 0,
        OTP.expires_at > datetime.utcnow()
    ).first()

    if not otp:
        return False

    otp.used = 1
    db.commit()
    return True