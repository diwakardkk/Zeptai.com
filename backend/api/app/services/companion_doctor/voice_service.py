from app.core.companion_config import companion_settings
from app.services.companion_doctor.response_polisher import prepare_tts_text
from app.services.tts_service import synthesize_speech


async def synthesize_companion_audio(
    text: str,
    voice: str | None = None,
    provider: str | None = None,
) -> tuple[bytes, str, str]:
    tts_text = prepare_tts_text(text)
    audio_bytes, media_type = await synthesize_speech(
        tts_text,
        voice=voice or companion_settings.tts_voice,
        backend=provider or companion_settings.tts_backend,
    )
    return audio_bytes, media_type, tts_text