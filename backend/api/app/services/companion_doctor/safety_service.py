import re

from app.models.companion_doctor import CompanionSafetyAssessment
from app.services.companion_doctor.language_utils import detect_language
from app.services.companion_doctor.prompt_loader import load_json_resource

EMERGENCY_PATTERNS: dict[str, list[str]] = {
    "self_harm": [
        r"\bkill myself\b",
        r"\bend my life\b",
        r"\bsuicid(al|e)\b",
        r"\bself harm\b",
        r"khud ko nuksan",
        r"marna chaht[ai]",
        r"jaan dena",
    ],
    "chest_pain": [
        r"\bsevere chest pain\b",
        r"\bchest tightness\b",
        r"seene me(n)? tez dard",
        r"chest pain",
    ],
    "stroke": [
        r"\bstroke\b",
        r"face droop",
        r"slurred speech",
        r"body numb",
        r"ek side sun",
    ],
    "breathing_distress": [
        r"\bcan't breathe\b",
        r"\bbreathing trouble\b",
        r"saans (nahi|nahin) aa rahi",
        r"saans lene me dikkat",
        r"shortness of breath",
    ],
    "seizure": [r"\bseizure\b", r"fit aa raha", r"convulsion"],
    "bleeding": [r"uncontrolled bleeding", r"bahut khoon", r"heavy bleeding"],
    "unconsciousness": [r"unconscious", r"not waking up", r"behosh"],
    "pregnancy_acute_risk": [
        r"pregnan.* bleeding",
        r"pregnan.* severe pain",
        r"garbh.* bleeding",
        r"pregnant and faint",
    ],
}


def _pick_phrase(flag: str, language: str) -> str:
    phrase_bank = load_json_resource("safe_escalation_phrase_bank.json")
    category = phrase_bank.get(flag) or phrase_bank["generic"]
    return category.get(language) or category.get("mixed") or category["en"]


def assess_safety(user_text: str, preferred_language: str | None = None) -> CompanionSafetyAssessment:
    sample = user_text.strip().lower()
    flags = [flag for flag, patterns in EMERGENCY_PATTERNS.items() if any(re.search(pattern, sample) for pattern in patterns)]
    if not flags:
        return CompanionSafetyAssessment(emergency_flag=False, flags=[])

    language = detect_language(user_text, preferred_language)
    message = _pick_phrase(flags[0], language)
    return CompanionSafetyAssessment(
        emergency_flag=True,
        flags=flags,
        escalation_message=message,
    )