"""
seed.py — Peuplement initial de la base de données
Aligné avec les modèles mis à jour (sans attendance_rate / homework_rate)
"""

import random
from datetime import datetime, timedelta

from sqlalchemy.orm import Session
from database.database import SessionLocal, engine, Base
from models import (
    User, Student, Parent, School, Admin,
    GradeRecord, Prediction, Orientation, Advice,
    Report, Notification, MLModel, TrainingSession,
    ModelMetrics, TrainingLogs, PredictionEvaluation,
)
from auth import hash_password


# ─────────────────────────────────────────────
#  DONNÉES DE RÉFÉRENCE
# ─────────────────────────────────────────────

SCHOOLS_DATA = [
    ("Highland Academy",        "123 Education St, Alger"),
    ("Greenwood High",          "456 Learning Blvd, Oran"),
    ("Riverdale Scholastic",    "789 Academic Ave, Constantine"),
    ("Summit Prep",             "101 Peak Road, Annaba"),
    ("Oceanview International", "202 Coastal Way, Tizi Ouzou"),
]

LEVELS      = ["1ère AS", "2ème AS", "3ème AS"]
STREAMS     = ["Science", "Mathématiques", "Lettres", "Technologie", "Gestion"]
RISK_LEVELS = ["Low", "Medium", "High"]
SUBJECTS    = ["Mathématiques", "Physique", "Littérature", "Histoire", "Informatique"]

ADVICE_MESSAGES = [
    "Maintiens ces efforts constants, tu es sur la bonne voie.",
    "Concentre-toi davantage sur les Mathématiques et la Physique.",
    "Participe aux sessions de soutien scolaire disponibles.",
    "Excellente progression en Littérature, continue ainsi.",
    "La régularité dans les devoirs est la clé de l'amélioration.",
]

ORIENTATION_EXPLANATIONS = {
    "Science":        "Excellentes performances en Mathématiques et Physique.",
    "Mathématiques":  "Résultats remarquables en Maths, orientation recommandée.",
    "Lettres":        "Fortes aptitudes en Littérature et Histoire.",
    "Technologie":    "Bon profil technique, orienté vers les sciences appliquées.",
    "Gestion":        "Compétences équilibrées, bon profil pour la filière gestion.",
}


def _rand_grade() -> float:
    """Note entre 4 et 20 (système algérien /20)."""
    return round(random.uniform(4.0, 20.0), 2)


def _pass_probability(final_grade: float) -> float:
    """Probabilité de réussite estimée selon la note finale."""
    return round(min(max((final_grade - 4) / 16, 0.0), 1.0), 2)


# ─────────────────────────────────────────────
#  SEED
# ─────────────────────────────────────────────

def seed_db():
    print("=== Réinitialisation de la base de données ===")
    Base.metadata.drop_all(bind=engine)
    Base.metadata.create_all(bind=engine)

    db: Session = SessionLocal()

    try:
        # ── 1. SCHOOLS ────────────────────────────────────────────────────────
        print("\n[1/8] Création des établissements...")
        schools: list[School] = []
        for name, address in SCHOOLS_DATA:
            # Chaque école a un User associé (role="school")
            user = User(
                name=name,
                email=f"{name.lower().replace(' ', '.')}@school.dz",
                password_hash=hash_password("school_pass_123"),
                role="school",
            )
            db.add(user)
            db.flush()

            school = School(
                user_id=user.user_id,
                address=address,
                phone=f"021-{random.randint(100,999)}-{random.randint(100,999)}",
            )
            db.add(school)
            schools.append(school)

        db.commit()
        print(f"  ✓ {len(schools)} établissements créés.")

        # ── 2. PARENTS ────────────────────────────────────────────────────────
        print("[2/8] Création des parents...")
        parents: list[Parent] = []
        for i in range(1, 31):  # 30 parents
            user = User(
                name=f"Parent {i}",
                email=f"parent{i}@example.dz",
                password_hash=hash_password("parent_pass_123"),
                role="parent",
            )
            db.add(user)
            db.flush()

            parent = Parent(
                user_id=user.user_id,
                phone=f"06{random.randint(10,99)}-{random.randint(100,999)}-{random.randint(100,999)}",
                address=f"{random.randint(1,200)} Rue des Fleurs, Alger",
                profession=random.choice(["Ingénieur", "Médecin", "Enseignant", "Commerçant", "Fonctionnaire"]),
            )
            db.add(parent)
            parents.append(parent)

        db.commit()
        print(f"  ✓ {len(parents)} parents créés.")

        # ── 3. STUDENTS ───────────────────────────────────────────────────────
        print("[3/8] Création des étudiants...")
        students: list[Student] = []
        for i in range(1, 41):  # 40 étudiants
            school = random.choice(schools)
            parent = parents[i - 1] if i <= len(parents) else None

            user = User(
                name=f"Étudiant {i}",
                email=f"student{i}@example.dz",
                password_hash=hash_password("student_pass_123"),
                role="student",
            )
            db.add(user)
            db.flush()

            student = Student(
                user_id=user.user_id,
                school_id=school.school_id,
                parent_id=parent.parent_id if parent else None,
                level=random.choice(LEVELS),
                academic_year=random.choice([2023, 2024, 2025]),
            )
            db.add(student)
            students.append(student)

        db.commit()
        print(f"  ✓ {len(students)} étudiants créés.")

        # ── 4. GRADE RECORDS ──────────────────────────────────────────────────
        print("[4/8] Création des bulletins de notes...")
        grade_records = []
        for student in students:
            t1 = _rand_grade()
            t2 = _rand_grade()
            t3 = _rand_grade()
            final = round((t1 + t2 + t3) / 3, 2)

            gr = GradeRecord(
                student_id=student.student_id,
                trimester1=t1,
                trimester2=t2,
                trimester3=t3,
                final_grade=final,
                academic_year=student.academic_year,
            )
            db.add(gr)
            grade_records.append((student, gr))

        db.commit()
        print(f"  ✓ {len(grade_records)} bulletins créés.")

        # ── 5. ML MODEL & TRAINING SESSION ───────────────────────────────────
        print("[5/8] Création du modèle ML et d'une session d'entraînement...")

        # Admin système
        admin_user = User(
            name="Administrateur Principal",
            email="admin.main@predictschool.dz",
            password_hash=hash_password("super_secret_admin"),
            role="admin",
        )
        db.add(admin_user)
        db.flush()

        admin = Admin(
            user_id=admin_user.user_id,
            access_level="superadmin",
            department="Informatique",
            last_login=datetime.utcnow(),
        )
        db.add(admin)
        db.flush()

        # Admins supplémentaires
        for j, (name, email) in enumerate([
            ("Support Admin",  "support@predictschool.dz"),
            ("Atef Admin",     "atef@predictschool.dz"),
        ], start=2):
            u = User(name=name, email=email,
                     password_hash=hash_password("admin_pass_123"), role="admin")
            db.add(u)
            db.flush()
            db.add(Admin(user_id=u.user_id, access_level="admin", department="Support"))

        ml_model = MLModel(
            model_name="LinearRegression_v1",
            model_type="Linear Regression",
            description="Modèle de régression linéaire entraîné sur les notes trimestrielles.",
            creation_date=datetime.utcnow().date(),
            file_path="models/linear_regression_v1.joblib",
        )
        db.add(ml_model)
        db.flush()

        session = TrainingSession(
            model_id=ml_model.model_id,
            admin_id=admin.admin_id,
            start_date=(datetime.utcnow() - timedelta(hours=2)).date(),
            end_date=datetime.utcnow().date(),
            status="completed",
            dataset_used="students_grades_2024.csv",
            training_time_seconds=random.randint(5, 30),
        )
        db.add(session)
        db.flush()

        # Métriques
        for metric_name, value in [("MAE", 1.23), ("R²", 0.87), ("Accuracy", 0.89)]:
            db.add(ModelMetrics(
                session_id=session.session_id,
                metric_name=metric_name,
                metric_value=value,
            ))

        # Logs
        for log_type, msg in [
            ("INFO",    "Chargement des données depuis le CSV."),
            ("INFO",    "Entraînement du modèle démarré."),
            ("SUCCESS", "Modèle entraîné et sauvegardé avec succès."),
        ]:
            db.add(TrainingLogs(
                session_id=session.session_id,
                log_type=log_type,
                log_message=msg,
            ))

        db.commit()
        print("  ✓ Modèle ML, session, métriques et logs créés.")

        # ── 6. PREDICTIONS, ORIENTATIONS, ADVICE ─────────────────────────────
        print("[6/8] Création des prédictions, orientations et conseils...")
        for student, gr in grade_records:
            final      = gr.final_grade
            pass_prob  = _pass_probability(final)
            risk       = "Low" if pass_prob >= 0.7 else ("Medium" if pass_prob >= 0.4 else "High")
            conf_score = round(random.uniform(0.70, 0.99), 2)

            prediction = Prediction(
                student_id=student.student_id,
                session_id=session.session_id,
                admin_id=admin.admin_id,
                prediction_date=datetime.utcnow().date(),
                predicted_grade=final,
                pass_probability=pass_prob,
                risk_level=risk,
                confidence_score=conf_score,
            )
            db.add(prediction)
            db.flush()

            # Advice lié à la prédiction
            db.add(Advice(
                prediction_id=prediction.prediction_id,
                message=random.choice(ADVICE_MESSAGES),
                subject_related=random.choice(SUBJECTS),
            ))

            # Orientation
            stream = random.choice(STREAMS)
            db.add(Orientation(
                student_id=student.student_id,
                prediction_id=prediction.prediction_id,
                recommended_stream=stream,
                explanation=ORIENTATION_EXPLANATIONS[stream],
            ))

            # Évaluation de prédiction (simulée pour données historiques)
            actual_grade = round(final + random.uniform(-2.0, 2.0), 2)
            actual_grade = min(max(actual_grade, 0), 20)
            deviation    = round(abs(final - actual_grade), 2)
            db.add(PredictionEvaluation(
                prediction_id=prediction.prediction_id,
                actual_grade=actual_grade,
                deviation=deviation,
                is_correct=deviation <= 2.0,
                evaluation_category="Bon" if deviation <= 1.0 else ("Acceptable" if deviation <= 2.0 else "Écart important"),
                feedback="Évaluation automatique post-examen.",
            ))

            # Report pour l'école
            db.add(Report(
                school_id=student.school_id,
                prediction_id=prediction.prediction_id,
                report_date=datetime.utcnow() - timedelta(days=random.randint(0, 30)),
            ))

        db.commit()
        print(f"  ✓ Prédictions, orientations, conseils et rapports créés pour {len(grade_records)} étudiants.")

        # ── 7. NOTIFICATIONS ──────────────────────────────────────────────────
        print("[7/8] Création des notifications...")
        notif_count = 0
        for student in students[:10]:   # notifications pour les 10 premiers étudiants
            db.add(Notification(
                user_id=student.student_id,
                role="student",
                type="prediction",
                message="Votre résultat de prédiction est disponible.",
                is_read=random.choice([True, False]),
            ))
            notif_count += 1

        for parent in parents[:10]:     # notifications pour les 10 premiers parents
            db.add(Notification(
                user_id=parent.parent_id,
                role="parent",
                type="prediction",
                message="Les résultats de prédiction de votre enfant sont disponibles.",
                is_read=random.choice([True, False]),
            ))
            notif_count += 1

        db.commit()
        print(f"  ✓ {notif_count} notifications créées.")

        # ── 8. RÉSUMÉ ─────────────────────────────────────────────────────────
        print("\n" + "=" * 50)
        print("✅  SEED TERMINÉ AVEC SUCCÈS")
        print("=" * 50)
        print(f"  Établissements  : {len(schools)}")
        print(f"  Parents         : {len(parents)}")
        print(f"  Étudiants       : {len(students)}")
        print(f"  Bulletins       : {len(grade_records)}")
        print(f"  Prédictions     : {len(grade_records)}")
        print(f"  Notifications   : {notif_count}")
        print(f"  Modèle ML       : {ml_model.model_name}")
        print("=" * 50)

    except Exception as e:
        print(f"\n❌  ERREUR lors du seed : {e}")
        db.rollback()
        raise
    finally:
        db.close()


if __name__ == "__main__":
    seed_db()
