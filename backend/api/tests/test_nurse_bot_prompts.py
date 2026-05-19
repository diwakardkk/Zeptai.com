"""
Manual test script for nurse-bot conversation prompt pipeline.

Run with:
    cd backend/api
    python -m pytest tests/test_nurse_bot_prompts.py -v

Or run directly for quick output:
    python tests/test_nurse_bot_prompts.py
"""
import re
import sys
import os

# Add the api folder to the path so imports resolve
sys.path.insert(0, os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app.services.companion_doctor.language_utils import (
    detect_language,
    choose_reply_language,
    normalize_language_preference,
)
from app.services.companion_doctor.response_polisher import (
    normalize_assistant_voice,
)
from app.models.companion_doctor import IntakeSlots


# ---------------------------------------------------------------------------
# Helpers
# ---------------------------------------------------------------------------

def _check(label: str, condition: bool, detail: str = "") -> bool:
    status = "PASS" if condition else "FAIL"
    print(f"  [{status}] {label}" + (f" — {detail}" if detail else ""))
    return condition


# ---------------------------------------------------------------------------
# Case 1: Hindi detection and language lock
# ---------------------------------------------------------------------------

def test_hindi_detection():
    print("\nCase 1: Hindi language detection")
    results = []

    user = "Mujhe kal se bukhar hai."
    lang = detect_language(user)
    results.append(_check("Hindi Hinglish detected as 'hi' or 'mixed'", lang in ("hi", "mixed"), f"got {lang!r}"))

    user = "मुझे कल से बुखार है"
    lang = detect_language(user)
    results.append(_check("Devanagari detected as 'hi'", lang == "hi", f"got {lang!r}"))

    user = "I have fever since yesterday"
    lang = detect_language(user)
    results.append(_check("English detected as 'en'", lang == "en", f"got {lang!r}"))

    return all(results)


# ---------------------------------------------------------------------------
# Case 2: Session language lock — stay Hindi when one English word used
# ---------------------------------------------------------------------------

def test_session_language_lock():
    print("\nCase 2: Session language lock")
    results = []

    # Patient starts in Hinglish, then says one English medical word "pain"
    session_lang = "mixed"
    user_with_one_english = "Mujhe pain ho raha hai"
    reply_lang = choose_reply_language(user_with_one_english, None, session_lang)
    results.append(_check(
        "Session stays Hinglish when patient uses one English word in Hindi sentence",
        reply_lang == "mixed",
        f"got {reply_lang!r}",
    ))

    # Patient fully switches to English (5+ English words, no Hindi)
    session_lang = "hi"
    user_full_english = "I am feeling much better now."
    reply_lang = choose_reply_language(user_full_english, None, session_lang)
    results.append(_check(
        "Session language switches to English on full English message",
        reply_lang == "en",
        f"got {reply_lang!r}",
    ))

    # Locked Hindi stays Hindi even with a short message
    session_lang = "hi"
    user_short = "Haan"
    reply_lang = choose_reply_language(user_short, None, session_lang)
    results.append(_check(
        "Short Hindi response keeps session language",
        reply_lang == "hi",
        f"got {reply_lang!r}",
    ))

    return all(results)


# ---------------------------------------------------------------------------
# Case 3: Feminine voice normalization
# ---------------------------------------------------------------------------

def test_feminine_normalization():
    print("\nCase 3: Feminine voice normalization")
    results = []

    text = "Main samajh raha hoon. Ye kab se ho raha hai?"
    normalized = normalize_assistant_voice(text, "mixed")
    results.append(_check(
        "Masculine 'raha hoon' replaced with 'rahi hoon'",
        "rahi hoon" in normalized,
        f"got: {normalized!r}",
    ))

    text = "Main madad kar paunga."
    normalized = normalize_assistant_voice(text, "hi")
    results.append(_check(
        "Masculine 'paunga' replaced with 'paungi'",
        "paungi" in normalized,
        f"got: {normalized!r}",
    ))

    text = "I understand. Let me help you."
    normalized = normalize_assistant_voice(text, "en")
    results.append(_check(
        "English text not modified by feminine normalization",
        normalized == text,
        f"got: {normalized!r}",
    ))

    return all(results)


# ---------------------------------------------------------------------------
# Case 4: Slot tracking — next missing slot
# ---------------------------------------------------------------------------

def test_slot_tracking():
    print("\nCase 4: Slot tracking — IntakeSlots.next_missing_slot()")
    results = []

    slots = IntakeSlots()
    results.append(_check("Empty slots: next is chief_complaint", slots.next_missing_slot() == "chief_complaint"))

    slots.chief_complaint = "fever"
    results.append(_check("After chief_complaint: next is duration", slots.next_missing_slot() == "duration"))

    slots.duration = "2 days"
    results.append(_check("After duration: next is severity", slots.next_missing_slot() == "severity"))

    slots.severity = "moderate"
    results.append(_check("After severity: next is associated_symptoms", slots.next_missing_slot() == "associated_symptoms"))

    slots.associated_symptoms = ["cough", "body pain"]
    results.append(_check("After associated_symptoms: next is medications", slots.next_missing_slot() == "medications"))

    slots.medications = ["paracetamol"]
    slots.allergies = ["penicillin"]
    slots.medical_history = ["diabetes"]
    results.append(_check("All slots filled: next is None", slots.next_missing_slot() is None))

    return all(results)


# ---------------------------------------------------------------------------
# Case 5: Repetition guard — filled_summary contains filled slots only
# ---------------------------------------------------------------------------

def test_filled_summary():
    print("\nCase 5: Slot filled_summary")
    results = []

    slots = IntakeSlots(chief_complaint="bukhar", duration="2 din se")
    summary = slots.filled_summary()
    results.append(_check("Summary contains chief_complaint", "chief_complaint" in summary))
    results.append(_check("Summary contains duration", "duration" in summary))
    results.append(_check("Summary does not contain severity (unfilled)", "severity" not in summary))

    return all(results)


# ---------------------------------------------------------------------------
# Case 6: Emergency keywords in language_utils (no diagnosis in reply)
# ---------------------------------------------------------------------------

def test_emergency_keywords_in_core():
    print("\nCase 6: core/prompts.py — EMERGENCY_KEYWORDS coverage")
    from app.core.prompts import EMERGENCY_KEYWORDS
    required = [
        "chest pain", "stroke", "seizure", "severe bleeding",
        "can't breathe", "unconscious",
    ]
    results = []
    for kw in required:
        results.append(_check(f"Keyword '{kw}' in EMERGENCY_KEYWORDS", kw in EMERGENCY_KEYWORDS))
    return all(results)


# ---------------------------------------------------------------------------
# Case 7: Bilingual greeting
# ---------------------------------------------------------------------------

def test_bilingual_greeting():
    print("\nCase 7: Bilingual greeting — get_greeting()")
    from app.core.prompts import get_greeting
    results = []

    eng = get_greeting("en")
    results.append(_check("English greeting has 'name'", "name" in eng.lower()))

    hi = get_greeting("hi")
    results.append(_check("Hindi greeting has 'naam'", "naam" in hi.lower()))

    mixed = get_greeting("mixed")
    results.append(_check("Hinglish greeting has 'naam'", "naam" in mixed.lower()))

    with_name = get_greeting("en", "Priya")
    results.append(_check("Named greeting includes 'Priya'", "Priya" in with_name))

    return all(results)


# ---------------------------------------------------------------------------
# Run all
# ---------------------------------------------------------------------------

if __name__ == "__main__":
    tests = [
        test_hindi_detection,
        test_session_language_lock,
        test_feminine_normalization,
        test_slot_tracking,
        test_filled_summary,
        test_emergency_keywords_in_core,
        test_bilingual_greeting,
    ]
    passed = 0
    failed = 0
    for t in tests:
        try:
            ok = t()
        except Exception as e:
            print(f"  [ERROR] {t.__name__}: {e}")
            ok = False
        if ok:
            passed += 1
        else:
            failed += 1

    print(f"\n{'='*50}")
    print(f"Results: {passed} passed, {failed} failed out of {len(tests)} test cases")
    sys.exit(0 if failed == 0 else 1)
