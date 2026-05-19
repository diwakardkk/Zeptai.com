import json
import re

from app.core.companion_config import companion_settings
from app.core.logging import get_logger
from app.services.companion_doctor.client import get_client
from app.services.companion_doctor.language_utils import detect_language
from app.services.companion_doctor.prompt_loader import load_prompt

logger = get_logger(__name__)


def _fast_refine_transcript(raw_transcript: str) -> str:
    cleaned = re.sub(r"\s+", " ", raw_transcript).strip(" ,")
    if not cleaned:
        return ""
    if cleaned[0].isascii() and cleaned[0].isalpha():
        cleaned = cleaned[0].upper() + cleaned[1:]
    return cleaned


def _should_use_llm_refinement(cleaned: str) -> bool:
    if not cleaned:
        return False
    if len(cleaned) <= 220 and "\n" not in cleaned:
        return False
    return True


async def refine_transcript(
    raw_transcript: str,
    language_preference: str = "auto",
    session_language: str = "auto",
) -> tuple[str, str, str]:
    """
    Returns (refined_text, detected_language, confidence).
    confidence is one of: "low", "medium", "high"
    """
    cleaned = raw_transcript.strip()
    detected_language = detect_language(cleaned, language_preference)
    if not cleaned:
        return "", detected_language, "low"

    fast_refined = _fast_refine_transcript(cleaned)
    if not _should_use_llm_refinement(fast_refined):
        # Determine simple confidence for fast path
        words = fast_refined.split()
        if len(words) < 3:
            confidence = "low"
        elif len(words) < 8:
            confidence = "medium"
        else:
            confidence = "high"
        return fast_refined, detected_language, confidence

    client = get_client()
    prompt = load_prompt("stt_refinement.md")
    # Pass session_language as a hint for ambiguous cases
    lang_hint = session_language if session_language not in ("auto", "") else language_preference
    try:
        response = await client.chat.completions.create(
            model=companion_settings.chat_model,
            response_format={"type": "json_object"},
            temperature=0.1,
            max_tokens=280,
            messages=[
                {"role": "system", "content": prompt},
                {
                    "role": "user",
                    "content": (
                        f"Language preference: {language_preference}\n"
                        f"Session language hint: {lang_hint}\n"
                        f"Raw transcript: {cleaned}"
                    ),
                },
            ],
        )
        payload = json.loads(response.choices[0].message.content or "{}")
        refined_text = str(payload.get("refined_text") or fast_refined).strip()
        detected_language = str(payload.get("detected_language") or detected_language).strip() or detected_language
        confidence = str(payload.get("confidence") or "medium").strip()
        if confidence not in {"low", "medium", "high"}:
            confidence = "medium"
        return refined_text, detected_language, confidence
    except Exception as exc:
        logger.warning(f"Companion STT refinement fallback used: {exc}")
        return fast_refined, detected_language, "medium"