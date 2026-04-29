from sqlalchemy import Column, Integer, String, DateTime
from datetime import datetime
from database.database import Base

class OTP(Base):
    __tablename__ = "otps"
    id         = Column(Integer, primary_key=True, index=True)
    email      = Column(String(100), index=True, nullable=False)
    code       = Column(String(6), nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    expires_at = Column(DateTime, nullable=False)
    used       = Column(Integer, default=0)  # 0=unused, 1=used