"""
services/orientation.py
Logique métier pour générer automatiquement une orientation
basée sur la moyenne annuelle et les matières de l'élève.
"""

from typing import List, Optional


# ─────────────────────────────────────────────
#  CONSTANTES
# ─────────────────────────────────────────────

# Seuil de passage (système algérien)
PASS_THRESHOLD = 10.0

# Seuils de mention
MENTION_EXCELLENT  = 16.0
MENTION_VERY_GOOD  = 14.0
MENTION_GOOD       = 12.0
MENTION_AVERAGE    = 10.0

# Mapping matière → filière favorisée
SUBJECT_STREAM_MAP = {
    # Sciences
    "mathematiques":  "Sciences",
    "maths":          "Sciences",
    "physique":       "Sciences",
    "chimie":         "Sciences",
    "svt":            "Sciences",
    "biologie":       "Sciences Naturelles",
    "sciences":       "Sciences",

    # Technologie
    "informatique":   "Technologie",
    "technologie":    "Technologie",
    "electronique":   "Technologie",

    # Lettres / Humanités
    "arabe":          "Lettres et Langues",
    "francais":       "Lettres et Langues",
    "anglais":        "Lettres et Langues",
    "histoire":       "Sciences Humaines",
    "geographie":     "Sciences Humaines",
    "philosophie":    "Sciences Humaines",

    # Gestion / Économie
    "economie":       "Gestion et Économie",
    "gestion":        "Gestion et Économie",
    "comptabilite":   "Gestion et Économie",
}

# Streams disponibles avec description
STREAM_DESCRIPTIONS = {
    "Sciences": (
        "Vos performances en mathématiques et sciences exactes sont solides. "
        "La filière Sciences vous permettra d'accéder aux études d'ingénierie, "
        "médecine ou recherche scientifique."
    ),
    "Sciences Naturelles": (
        "Vos résultats en biologie et sciences naturelles sont remarquables. "
        "Cette filière ouvre la voie aux études médicales, pharmaceutiques "
        "et agronomiques."
    ),
    "Technologie": (
        "Vos aptitudes en informatique et technologie sont excellentes. "
        "Cette filière vous prépare aux métiers du numérique, de l'ingénierie "
        "et du développement technologique."
    ),
    "Lettres et Langues": (
        "Vos compétences linguistiques et littéraires sont remarquables. "
        "Cette filière vous prépare aux métiers de la communication, "
        "de l'enseignement et de la traduction."
    ),
    "Sciences Humaines": (
        "Vos performances en sciences humaines et sociales sont solides. "
        "Cette filière ouvre la voie aux études en droit, sociologie, "
        "psychologie et sciences politiques."
    ),
    "Gestion et Économie": (
        "Vos résultats en économie et gestion sont remarquables. "
        "Cette filière vous prépare aux métiers de la finance, "
        "du commerce et de l'administration des entreprises."
    ),
    "Générale": (
        "Votre profil est équilibré entre plusieurs matières. "
        "Une filière générale vous permettra de garder toutes vos options ouvertes "
        "avant de vous spécialiser."
    ),
}


# ─────────────────────────────────────────────
#  HELPERS
# ─────────────────────────────────────────────

def _get_mention(average: float) -> str:
    if average >= MENTION_EXCELLENT:
        return "Très Bien"
    if average >= MENTION_VERY_GOOD:
        return "Bien"
    if average >= MENTION_GOOD:
        return "Assez Bien"
    if average >= MENTION_AVERAGE:
        return "Passable"
    return "Insuffisant"


def _normalize(name: str) -> str:
    """Normalise un nom de matière pour la comparaison."""
    return (
        name.lower()
        .strip()
        .replace("é", "e")
        .replace("è", "e")
        .replace("ê", "e")
        .replace("à", "a")
        .replace("â", "a")
        .replace("ô", "o")
        .replace("û", "u")
        .replace("î", "i")
        .replace("ç", "c")
        .replace("-", " ")
    )


def _find_stream_for_subject(subject_name: str) -> Optional[str]:
    """Retourne la filière associée à une matière, ou None."""
    normalized = _normalize(subject_name)
    for keyword, stream in SUBJECT_STREAM_MAP.items():
        if keyword in normalized:
            return stream
    return None


# ─────────────────────────────────────────────
#  FONCTION PRINCIPALE
# ─────────────────────────────────────────────

def generate_orientation(
    annual_average: float,
    subjects: list,          # liste d'objets avec .name et .grade (ou dicts)
) -> dict:
    """
    Génère une orientation automatique.

    Paramètres
    ----------
    annual_average : float
        Moyenne annuelle de l'élève (sur 20).
    subjects : list
        Liste de matières avec leurs notes.
        Chaque élément peut être :
          - un objet avec attributs .name (str) et .grade (float)
          - un dict avec clés "name" (str) et "grade" (float)

    Retourne
    --------
    dict avec :
        recommended_stream : str
        explanation        : str
        mention            : str
        annual_average     : float
        strong_subjects    : list[str]
        weak_subjects      : list[str]
    """

    # ── Normaliser les sujets en dicts ──────────
    subject_list = []
    for s in subjects:
        if isinstance(s, dict):
            subject_list.append({"name": s.get("name", ""), "grade": s.get("grade", 0.0)})
        else:
            subject_list.append({"name": getattr(s, "name", ""), "grade": getattr(s, "grade", 0.0)})

    # ── Classer les matières ────────────────────
    strong_subjects = [s["name"] for s in subject_list if s["grade"] >= 12.0]
    weak_subjects   = [s["name"] for s in subject_list if s["grade"] < 10.0]

    # ── Voter pour la filière ───────────────────
    stream_votes: dict[str, float] = {}

    for s in subject_list:
        stream = _find_stream_for_subject(s["name"])
        if stream:
            # Pondérer par la note
            stream_votes[stream] = stream_votes.get(stream, 0.0) + s["grade"]

    if stream_votes:
        recommended_stream = max(stream_votes, key=stream_votes.get)
    else:
        recommended_stream = "Générale"

    # ── Si moyenne insuffisante → signaler ──────
    if annual_average < PASS_THRESHOLD:
        explanation = (
            f"Avec une moyenne de {annual_average:.2f}/20, un travail de rattrapage "
            f"est nécessaire avant de confirmer une orientation. "
            f"Concentrez-vous sur : {', '.join(weak_subjects) or 'toutes les matières'}."
        )
    else:
        base_explanation = STREAM_DESCRIPTIONS.get(
            recommended_stream, STREAM_DESCRIPTIONS["Générale"]
        )
        strong_txt = f" Points forts : {', '.join(strong_subjects)}." if strong_subjects else ""
        explanation = base_explanation + strong_txt

    mention = _get_mention(annual_average)

    return {
        "recommended_stream": recommended_stream,
        "explanation":        explanation,
        "mention":            mention,
        "annual_average":     round(annual_average, 2),
        "strong_subjects":    strong_subjects,
        "weak_subjects":      weak_subjects,
    }
