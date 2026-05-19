import re

HINDI_TERMS = {
    # Common conversation
    "haan",
    "nahi",
    "achha",
    "theek",
    "aur",
    "kya",
    "kyunki",
    "lekin",
    "toh",
    "yeh",
    "woh",
    "mujhe",
    "mera",
    "meri",
    "humko",
    "aapko",
    "main",
    "hum",
    # Body / symptoms
    "dard",
    "bukhar",
    "saans",
    "thakan",
    "neend",
    "sir",
    "pet",
    "seena",
    "peeth",
    "haath",
    "pair",
    "takleef",
    "taklif",
    "bimaar",
    "bimaari",
    "sar",
    "aankhein",
    "naak",
    "gala",
    "khaansi",
    "ulti",
    "chakkar",
    "kamzori",
    "paseena",
    "khujli",
    "sujan",
    # Time / duration
    "kal",
    "parso",
    "aaj",
    "subah",
    "raat",
    "din",
    "ghante",
    "hafte",
    "mahine",
    "se",
    "pehle",
    # Questions
    "kab",
    "kitna",
    "kaise",
    "kaisa",
    "kaisi",
    "kahan",
    "kyun",
    # Identity
    "naam",
    "umar",
    "umra",
    # Misc
    "tension",
    "takleef",
    "bata",
    "batao",
    "lagta",
    "lagti",
    "hota",
    "hoti",
    "rehta",
    "rehti",
    "dhadkan",
    "shaadi",
    "sharir",
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
    """
    Choose reply language with session-language locking.

    Once a session language is established (not 'auto'), it is preserved unless
    the new detection is clearly different and unambiguous (high signal).
    A single English medical word in a Hindi sentence will NOT trigger a switch.
    """
    detected = detect_language(user_text, preferred)

    # No session language set yet — use detected or preference
    if session_language in ("auto", ""):
        if detected == "auto":
            return normalize_language_preference(preferred) or "en"
        return detected

    # Session language already established — keep it unless clear full-language switch
    if detected == "auto":
        return session_language

    # Count Hindi signal strength — if clearly different from session, allow switch
    sample = user_text.strip().lower()
    devanagari_chars = len(re.findall(r"[\u0900-\u097F]", sample))
    hindi_hits = sum(1 for term in HINDI_TERMS if re.search(rf"\b{re.escape(term)}\b", sample))

    words = sample.split()
    word_count = len(words) if words else 1

    if session_language in ("hi", "mixed"):
        # Don't switch away from Hindi/Hinglish unless the message has NO Hindi signal at all
        # and is at least 5 words long (clear language switch)
        if detected == "en" and hindi_hits == 0 and devanagari_chars == 0 and word_count >= 5:
            return "en"
        return session_language

    if session_language == "en":
        # Don't switch away from English unless clear Hindi/Hinglish signal
        if detected in ("hi", "mixed") and (hindi_hits >= 2 or devanagari_chars > 2):
            return detected
        return session_language

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