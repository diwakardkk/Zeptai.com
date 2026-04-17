import re

HINDI_TERMS = {
    "haan",
    "achha",
    "mera",
    "naam",
    "umar",
    "dard",
    "bukhar",
    "saans",
    "thakan",
    "sir",
    "pet",
    "mujhe",
    "nahi",
    "kyunki",
    "dhadkan",
    "neend",
    "tension",
}


def normalize_language_preference(language_preference: str | None) -> str:
    normalized = (language_preference or "auto").strip().lower()
    if normalized in {"en", "english"}:
        return "en"
    if normalized in {"hi", "hindi"}:
        return "hi"
    if normalized in {"mixed", "hinglish"}:
        return "mixed"
    return "auto"


def detect_language(text: str, preferred: str | None = None) -> str:
    normalized_preference = normalize_language_preference(preferred)
    sample = text.strip().lower()
    if not sample:
        return normalized_preference if normalized_preference != "auto" else "en"

    devanagari_chars = len(re.findall(r"[\u0900-\u097F]", sample))
    ascii_letters = len(re.findall(r"[a-z]", sample))
    hindi_hits = sum(1 for term in HINDI_TERMS if re.search(rf"\b{re.escape(term)}\b", sample))

    if devanagari_chars > 4 and ascii_letters > 10:
        return "mixed"
    if devanagari_chars > 4 or hindi_hits >= 2:
        return "hi"
    if hindi_hits == 1 and ascii_letters > 10:
        return "mixed"
    if normalized_preference != "auto":
        return normalized_preference
    return "en"


def choose_reply_language(user_text: str, preferred: str | None, session_language: str) -> str:
    detected = detect_language(user_text, preferred)
    if detected == "auto":
        return session_language if session_language != "auto" else "en"
    return detected


def language_display(language: str) -> str:
    normalized = normalize_language_preference(language)
    if normalized == "hi":
        return "Hindi"
    if normalized == "mixed":
        return "Hinglish"
    if normalized == "en":
        return "English"
    return "Auto"