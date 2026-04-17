import json
from functools import lru_cache
from pathlib import Path
from typing import Any

from app.core.companion_config import companion_settings

PROMPT_DIR = Path(companion_settings.prompt_dir)
RESOURCE_DIR = PROMPT_DIR / "resources"


@lru_cache(maxsize=32)
def load_prompt(filename: str) -> str:
    return (PROMPT_DIR / filename).read_text(encoding="utf-8").strip()


@lru_cache(maxsize=32)
def load_json_resource(filename: str) -> dict[str, Any]:
    return json.loads((RESOURCE_DIR / filename).read_text(encoding="utf-8"))


def age_band_for_age(age: int | None) -> str:
    if age is None:
        return "adult"
    if age <= 17:
        return "child_teen"
    if age <= 29:
        return "young_adult"
    if age <= 59:
        return "adult"
    return "older_adult"


def format_demographic_context(name: str | None, age: int | None, gender: str | None) -> str:
    parts: list[str] = []
    if name:
        parts.append(f"name: {name}")
    if age is not None:
        parts.append(f"age: {age}")
    if gender:
        parts.append(f"gender: {gender}")
    return ", ".join(parts) if parts else "No confirmed demographic details yet."