from fastapi import APIRouter, Header, HTTPException

from app.schemas.companion_doctor import (
    CompanionEndRequest,
    CompanionEndResponse,
    CompanionMessageRequest,
    CompanionMessageResponse,
    CompanionStartRequest,
    CompanionStartResponse,
)
from app.services.companion_doctor.conversation_service import (
    end_session,
    process_message,
    start_session,
)

router = APIRouter(prefix="/companion/chat", tags=["companion-chat"])


@router.post("/start", response_model=CompanionStartResponse)
async def start_companion_chat(
    request: CompanionStartRequest,
    x_companion_client_id: str = Header(default="anonymous"),
):
    return await start_session(request, x_companion_client_id)


@router.post("/message", response_model=CompanionMessageResponse)
async def send_companion_message(
    request: CompanionMessageRequest,
    x_companion_client_id: str = Header(default="anonymous"),
):
    try:
        return await process_message(request, x_companion_client_id)
    except ValueError as exc:
        raise HTTPException(status_code=404, detail=str(exc)) from exc


@router.post("/end", response_model=CompanionEndResponse)
async def end_companion_chat(request: CompanionEndRequest):
    return await end_session(request.session_id)