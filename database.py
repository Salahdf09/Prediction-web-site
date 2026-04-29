from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, declarative_base
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Database URL configuration
# Priority: .env DATABASE_URL > Hardcoded fallback
DEFAULT_URL = "postgresql://neondb_owner:npg_Rj2ZcfWoVJn3@ep-billowing-dawn-amt59nn6-pooler.c-5.us-east-1.aws.neon.tech/neondb?sslmode=require"
DATABASE_URL = os.getenv("DATABASE_URL", DEFAULT_URL)

# SQLAlchemy requires "postgresql://" but some environments provide "postgres://"
if DATABASE_URL.startswith("postgres://"):
    DATABASE_URL = DATABASE_URL.replace("postgres://", "postgresql://", 1)

# Create the SQLAlchemy engine
# connect_args={"check_same_thread": False} is only required for SQLite
if DATABASE_URL.startswith("sqlite"):
    engine = create_engine(
        DATABASE_URL, connect_args={"check_same_thread": False}
    )
else:
    engine = create_engine(DATABASE_URL)

# Create a SessionLocal class for database sessions
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

# Create a Base class for models to inherit from
Base = declarative_base()

# Dependency to provide a database session to FastAPI routes
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
