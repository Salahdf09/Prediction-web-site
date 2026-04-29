from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database.database import engine, Base
from models import otp  # import so OTP table gets created
from routers import student_router, parent_router, school_router, admin_router, auth_router
import os
from dotenv import load_dotenv

load_dotenv()

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Prediction Website API",
    description="API for student prediction and academic guidance",
    version="1.0.0",
    docs_url=None,
    redoc_url=None
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174", "http://127.0.0.1:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(student_router)
app.include_router(parent_router)
app.include_router(school_router)
app.include_router(admin_router)
app.include_router(auth_router)

@app.get("/health")
def health_check():
    return {"status": "ok", "message": "API is running"}