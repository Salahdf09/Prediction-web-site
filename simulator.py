"""
simulator.py — Calcul de la moyenne annuelle et estimation du risque
Pas d'IA nécessaire : pure logique Python basée sur le diagramme de classes.
"""

from pydantic import BaseModel, Field


# ─────────────────────────────────────────────
# SCHÉMAS Pydantic
# ─────────────────────────────────────────────
class SimulationInput(BaseModel):
    trimester1: float = Field(..., ge=0, le=20, description="Moyenne du 1er trimestre")
    trimester2: float = Field(..., ge=0, le=20, description="Moyenne du 2ème trimestre")
    trimester3: float = Field(..., ge=0, le=20, description="Moyenne du 3ème trimestre")


class SimulationResult(BaseModel):
    trimester1: float
    trimester2: float
    trimester3: float
    annual_average: float
    pass_status: str       # "Pass" | "Fail"
    risk_level: str        # "Low" | "Medium" | "High"
    mention: str           # "Passable" | "Assez Bien" | "Bien" | "Très Bien" | "Insuffisant"
    message: str


# ─────────────────────────────────────────────
# LOGIQUE DE CALCUL (calculateProbability du diagramme)
# ─────────────────────────────────────────────
def calculate_simulation(data: SimulationInput) -> SimulationResult:
    """
    Calcule la moyenne annuelle pondérée et évalue le niveau de risque.
    Pondération Algérie BEM/BAC : T1=25%, T2=25%, T3=50%
    """
    # Moyenne pondérée
    annual_average = round(
        (data.trimester1 * 0.25 + data.trimester2 * 0.25 + data.trimester3 * 0.50),
        2
    )

    # Statut réussite/échec
    pass_status = "Pass" if annual_average >= 10 else "Fail"

    # Niveau de risque
    if annual_average >= 14:
        risk_level = "Low"
    elif annual_average >= 10:
        risk_level = "Medium"
    else:
        risk_level = "High"

    # Mention
    if annual_average >= 16:
        mention = "Très Bien"
    elif annual_average >= 14:
        mention = "Bien"
    elif annual_average >= 12:
        mention = "Assez Bien"
    elif annual_average >= 10:
        mention = "Passable"
    else:
        mention = "Insuffisant"

    # Message motivant
    message = _build_message(annual_average, pass_status, risk_level)

    return SimulationResult(
        trimester1=data.trimester1,
        trimester2=data.trimester2,
        trimester3=data.trimester3,
        annual_average=annual_average,
        pass_status=pass_status,
        risk_level=risk_level,
        mention=mention,
        message=message
    )


def _build_message(avg: float, status: str, risk: str) -> str:
    if status == "Pass" and risk == "Low":
        return (
            f"Félicitations ! Votre moyenne de {avg}/20 est excellente. "
            "Continuez sur cette lancée et vous décrocherez votre examen avec brio !"
        )
    elif status == "Pass" and risk == "Medium":
        return (
            f"Bien ! Votre moyenne de {avg}/20 vous place dans la zone de réussite. "
            "Quelques efforts supplémentaires vous permettront d'améliorer encore votre résultat."
        )
    else:
        return (
            f"Votre moyenne actuelle est de {avg}/20. "
            "Ne vous découragez pas : reconnaître vos points faibles est la première étape pour progresser. "
            "Concentrez-vous sur les matières difficiles et consultez vos enseignants."
        )
