import json
import re

from app.core.companion_config import companion_settings
from app.core.logging import get_logger
from app.services.companion_doctor.client import get_client
from app.services.companion_doctor.prompt_loader import load_prompt

logger = get_logger(__name__)

HINDI_FEMININE_NORMALIZATIONS = (
    (r"\b[Mm]ain samajh raha hoon\b", "Main samajh rahi hoon"),
    (r"\b[Mm]ain sun raha hoon\b", "Main sun rahi hoon"),
    (r"\b[Mm]ain dekh raha hoon\b", "Main dekh rahi hoon"),
    (r"\b[Mm]ain soch raha hoon\b", "Main soch rahi hoon"),
    (r"\b[Mm]ain bol raha hoon\b", "Main bol rahi hoon"),
    (r"\b[Mm]ain keh raha hoon\b", "Main keh rahi hoon"),
    (r"\b[Mm]ain samjha raha hoon\b", "Main samjha rahi hoon"),
    (r"\b[Mm]ain bata raha hoon\b", "Main bata rahi hoon"),
    (r"\b[Mm]ain koshish kar raha hoon\b", "Main koshish kar rahi hoon"),
    (r"\b[Mm]ain madad kar paunga\b", "Main madad kar paungi"),
    (r"\b[Mm]ain baat kar paunga\b", "Main baat kar paungi"),
)


def prepare_tts_text(text: str) -> str:
    cleaned = re.sub(r"\*+", "", text)
    cleaned = re.sub(r"\s+", " ", cleaned).strip()
    cleaned = cleaned.replace(" - ", ", ")
    cleaned = re.sub(r"([.!?])\s*", r"\1 ", cleaned)
    return cleaned.strip()


def normalize_assistant_voice(text: str, language: str) -> str:
    normalized = text
    if language not in {"hi", "mixed"}:
        return normalized

    for pattern, replacement in HINDI_FEMININE_NORMALIZATIONS:
        normalized = re.sub(pattern, replacement, normalized)
    return normalized


async def polish_response(text: str, language: str, emergency_flag: bool = False) -> str:
    fallback = prepare_tts_text(normalize_assistant_voice(text, language))
    if emergency_flag or not companion_settings.enable_llm_polish:
        return fallback

    prompt = load_prompt("response_polishing.md")
    client = get_client()
    try:
        response = await client.chat.completions.create(
            model=companion_settings.chat_model,
            response_format={"type": "json_object"},
            temperature=0.2,
            max_tokens=220,
            messages=[
                {"role": "system", "content": prompt},
                {"role": "user", "content": f"Language: {language}\nDraft: {text}"},
            ],
        )
        payload = json.loads(response.choices[0].message.content or "{}")
        polished_text = str(payload.get("polished_text") or fallback).strip()
        return prepare_tts_text(normalize_assistant_voice(polished_text, language))
    except Exception as exc:
        logger.warning(f"Companion response polishing fallback used: {exc}")
        return fallback