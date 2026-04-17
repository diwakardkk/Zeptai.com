from fastapi import APIRouter, File, Form, HTTPException, UploadFile
from fastapi.responses import Response

from app.schemas.companion_doctor import (
    CompanionFeedbackRequest,
    CompanionFeedbackResponse,
    CompanionSTTResponse,
    CompanionTTSRequest,
)
from app.services.companion_doctor.language_utils import normalize_language_preference
from app.services.companion_doctor.safety_service import assess_safety
from app.services.companion_doctor.stt_refinement_service import refine_transcript
from app.services.companion_doctor.voice_service import synthesize_companion_audio
from app.services.stt_service import transcribe_audio

router = APIRouter(prefix="/companion", tags=["companion-voice"])

ALLOWED_CONTENT_TYPES = {
    "audio/webm",
    "audio/webm;codecs=opus",
    "audio/wav",
    "audio/mp3",
    "audio/mpeg",
    "audio/ogg",
    "audio/ogg;codecs=opus",
    "audio/m4a",
    "audio/mp4",
    "application/octet-stream",
}


def _normalize_content_type(content_type: str | None) -> str:
    return (content_type or "").split(";", 1)[0].strip().lower()


@router.post("/stt", response_model=CompanionSTTResponse)
async def companion_stt(
    audio: UploadFile = File(...),
    session_id: str | None = Form(default=None),
    language_preference: str = Form(default="auto"),
):
    content_type = _normalize_content_type(audio.content_type)
    if content_type and content_type not in ALLOWED_CONTENT_TYPES:
        raise HTTPException(status_code=400, detail="Unsupported audio format")

    audio_bytes = await audio.read()
    if len(audio_bytes) < 100:
        raise HTTPException(status_code=400, detail="Audio file is too small or empty")

    raw_transcript = await transcribe_audio(audio_bytes, filename=audio.filename or "companion.webm")
    refined_text, detected_language = await refine_transcript(raw_transcript, language_preference)
    safety = assess_safety(refined_text, detected_language)
    return CompanionSTTResponse(
        session_id=session_id,
        raw_transcript=raw_transcript,
        refined_user_text=refined_text,
        detected_language=normalize_language_preference(detected_language),
        safety_flags=safety.flags,
        emergency_flag=safety.emergency_flag,
    )


@router.post("/tts")
async def companion_tts(request: CompanionTTSRequest):
    audio_bytes, media_type, tts_text = await synthesize_companion_audio(
        request.text,
        voice=request.voice,
        provider=request.provider,
    )
    return Response(
        content=audio_bytes,
        media_type=media_type,
        headers={
            "Cache-Control": "no-store",
            "X-Companion-Language": normalize_language_preference(request.language_preference),
            "X-Companion-TTS-Chars": str(len(tts_text)),
        },
    )


@router.post("/feedback", response_model=CompanionFeedbackResponse)
async def companion_feedback(request: CompanionFeedbackRequest):
    if not request.consent_to_share:
        return CompanionFeedbackResponse(
            ok=True,
            stored=False,
            message="Thanks for the feedback. This demo keeps feedback local unless you explicitly choose a storage-enabled build.",
        )

    return CompanionFeedbackResponse(
        ok=True,
        stored=False,
        message="Thanks for sharing feedback. This privacy-first build does not persist companion feedback yet.",
    )