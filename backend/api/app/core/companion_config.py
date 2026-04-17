from functools import lru_cache
from pathlib import Path

from pydantic import Field
from pydantic_settings import BaseSettings

from app.core.config import settings


class CompanionSettings(BaseSettings):
    enabled: bool = Field(default=True, validation_alias="COMPANION_ENABLED")
    session_ttl_seconds: int = Field(default=900, validation_alias="COMPANION_SESSION_TTL_SECONDS")
    max_turns: int = Field(default=10, validation_alias="COMPANION_MAX_TURNS")
    max_input_chars: int = Field(default=1500, validation_alias="COMPANION_MAX_INPUT_CHARS")
    rag_top_k: int = Field(default=3, validation_alias="COMPANION_RAG_TOP_K")
    default_language: str = Field(default="auto", validation_alias="COMPANION_DEFAULT_LANGUAGE")
    tts_backend: str = Field(default=settings.tts_backend, validation_alias="COMPANION_TTS_BACKEND")
    tts_voice: str = Field(default=settings.openai_tts_voice, validation_alias="COMPANION_TTS_VOICE")
    enable_llm_polish: bool = Field(default=False, validation_alias="COMPANION_ENABLE_LLM_POLISH")
    chat_temperature: float = Field(default=0.55, validation_alias="COMPANION_CHAT_TEMPERATURE")
    prompt_dir: str = Field(
        default=str(Path(__file__).resolve().parents[1] / "prompts" / "companion_doctor"),
        validation_alias="COMPANION_PROMPT_DIR",
    )
    knowledge_base_path: str = Field(
        default=str(Path(__file__).resolve().parents[2] / "data" / "companion_doctor" / "knowledge_base.json"),
        validation_alias="COMPANION_KNOWLEDGE_BASE_PATH",
    )

    class Config:
        env_file = ".env"
        env_file_encoding = "utf-8"
        case_sensitive = False

    @property
    def chat_model(self) -> str:
        return settings.openai_chat_model

    @property
    def stt_model(self) -> str:
        return settings.openai_stt_model

    @property
    def tts_model(self) -> str:
        return settings.openai_tts_model


@lru_cache()
def get_companion_settings() -> CompanionSettings:
    return CompanionSettings()


companion_settings = get_companion_settings()