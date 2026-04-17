import json
import re

from app.core.logging import get_logger
from app.models.companion_doctor import CompanionProfile, CompanionProfileExtraction
from app.services.companion_doctor.client import get_client
from app.services.companion_doctor.prompt_loader import load_prompt
from app.core.companion_config import companion_settings

logger = get_logger(__name__)


def _fallback_extract(text: str) -> CompanionProfileExtraction:
    sample = text.strip()
    lowered = sample.lower()

    name_match = re.search(r"(?:my name is|i am|i'm|mera naam|main)\s+([A-Za-z\u0900-\u097F]+)", sample, re.IGNORECASE)
    age_match = re.search(r"\b(1?[0-9]{1,2})\b", sample)

    gender = None
    gender_map = {
        "male": ["male", "man", "boy", "ladka", "पुरुष"],
        "female": ["female", "woman", "girl", "ladki", "महिला"],
        "non-binary": ["non-binary", "nonbinary", "queer"],
    }
    for normalized, terms in gender_map.items():
        if any(term.lower() in lowered for term in terms):
            gender = normalized
            break

    marital_status = None
    if "married" in lowered or "shaadi" in lowered:
        marital_status = "married"
    elif "single" in lowered:
        marital_status = "single"

    extraction = CompanionProfileExtraction(
        name=name_match.group(1).strip().title() if name_match else None,
        age=int(age_match.group(1)) if age_match else None,
        gender=gender,
        marital_status=marital_status,
        health_context_present=bool(re.search(r"pain|stress|sleep|fever|dard|bukhar|thakan|anx", lowered)),
    )
    extraction.missing_fields = [field for field, value in {
        "name": extraction.name,
        "age": extraction.age,
        "gender": extraction.gender,
    }.items() if value in (None, "")]
    extraction.should_follow_up = bool(extraction.missing_fields) and not extraction.health_context_present
    return extraction


async def extract_profile(user_text: str, existing_profile: CompanionProfile) -> CompanionProfileExtraction:
    prompt = load_prompt("profile_extraction.md")
    client = get_client()
    try:
        response = await client.chat.completions.create(
            model=companion_settings.chat_model,
            response_format={"type": "json_object"},
            temperature=0,
            max_tokens=250,
            messages=[
                {"role": "system", "content": prompt},
                {
                    "role": "user",
                    "content": (
                        f"Existing profile: {existing_profile.model_dump_json()}\n"
                        f"User message: {user_text}"
                    ),
                },
            ],
        )
        raw_payload = response.choices[0].message.content or "{}"
        data = json.loads(raw_payload)
        extraction = CompanionProfileExtraction(
            name=data.get("name"),
            age=data.get("age"),
            gender=data.get("gender"),
            marital_status=data.get("marital_status"),
            missing_fields=data.get("missing_fields") or [],
            should_follow_up=bool(data.get("should_follow_up")),
            health_context_present=bool(data.get("health_context_present")),
        )
        return extraction
    except Exception as exc:
        logger.warning(f"Companion profile extraction fallback used: {exc}")
        return _fallback_extract(user_text)


def merge_profile(existing_profile: CompanionProfile, extraction: CompanionProfileExtraction) -> CompanionProfile:
    updated = existing_profile.model_copy(deep=True)
    if extraction.name and not updated.name:
        updated.name = extraction.name
    if extraction.age is not None and updated.age is None:
        updated.age = extraction.age
    if extraction.gender and not updated.gender:
        updated.gender = extraction.gender
    if extraction.marital_status and not updated.marital_status:
        updated.marital_status = extraction.marital_status
    return updated