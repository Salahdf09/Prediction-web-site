"""
main.py — Point d'entrée de l'application PredictSchool API
"""

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from database.database import engine, Base
import models  # noqa: F401 — importer les modèles pour que SQLAlchemy les enregistre

# ─────────────────────────────────────────────
#  ROUTERS
# ─────────────────────────────────────────────

from auth import auth_router

from routers import (
    # Entités principales
    student_router,
    parent_router,
    school_router,
    admin_router,
    # Fonctionnalités métier
    router_simulator,
    router_advice,
    router_orientation,
    # Systèmes complémentaires
    router_notifications,
    router_reports,
    # Statistiques
    router_statistics,
)

# ─────────────────────────────────────────────
#  CRÉATION DES TABLES
# ─────────────────────────────────────────────

Base.metadata.create_all(bind=engine)

# ─────────────────────────────────────────────
#  APPLICATION
# ─────────────────────────────────────────────

app = FastAPI(
    title="PredictSchool API",
    description=(
        "API de prédiction des résultats aux examens officiels — "
        "Projet 2CP ESI (PRJP05_EQ53)"
    ),
    version="2.0.0",
    docs_url="/docs",
    redoc_url="/redoc",
)

# ─────────────────────────────────────────────
#  CORS
# ─────────────────────────────────────────────

app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:3000",   # React (CRA)
        "http://localhost:5173",   # Vite / React
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ─────────────────────────────────────────────
#  INCLUSION DES ROUTERS
# ─────────────────────────────────────────────

# PRIORITÉ 1 — Authentification (login, OTP, reset password, /me)
app.include_router(auth_router)

# PRIORITÉ 2 — Entités principales (CRUD complet)
app.include_router(student_router)    # /students
app.include_router(parent_router)     # /parents
app.include_router(school_router)     # /schools
app.include_router(admin_router)      # /admins

# PRIORITÉ 3 — Fonctionnalités métier
app.include_router(router_simulator)    # /students/{id}/simulate
app.include_router(router_advice)       # /students/{id}/advice
app.include_router(router_orientation)  # /students/{id}/orientation

# PRIORITÉ 4 — Systèmes complémentaires
app.include_router(router_notifications)  # /notifications, /students/{id}/notifications
app.include_router(router_reports)        # /schools/{id}/reports

# PRIORITÉ 5 — Statistiques réelles (DB)
app.include_router(router_statistics)     # /schools/{id}/statistics, /admins/{id}/statistics

# ─────────────────────────────────────────────
#  ROUTES DE BASE
# ─────────────────────────────────────────────

@app.get("/", tags=["Root"])
def root():
    return {
        "message": "PredictSchool API v2.0 — Projet 2CP ESI",
        "docs":    "/docs",
        "redoc":   "/redoc",
    }


@app.get("/health", tags=["Root"])
def health():
    return {"status": "ok"}
