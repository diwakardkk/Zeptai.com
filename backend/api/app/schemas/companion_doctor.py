from typing import Literal, Optional

from pydantic import BaseModel, Field


class CompanionStartRequest(BaseModel):
    language_preference: str = Field(default="auto")
    mode: Literal["voice", "text"] = Field(default="voice")


class CompanionStartResponse(BaseModel):
    session_id: str
    assistant_text: str
    detected_language: str
    safety_flags: list[str] = Field(default_factory=list)
    emergency_flag: bool = False
    should_end_session: bool = False
    remaining_free_turns: int
    state: str
    privacy_note: str
    non_emergency_notice: str
    access_locked: bool = False
    upgrade_url: Optional[str] = None


class CompanionMessageRequest(BaseModel):
    session_id: str
    message: str = Field(min_length=1, max_length=1500)
    language_preference: str = Field(default="auto")
    channel: Literal["voice", "text"] = Field(default="text")


class CompanionMessageResponse(BaseModel):
    session_id: str
    detected_language: str
    refined_user_text: str
    assistant_text: str
    tts_text: str
    safety_flags: list[str] = Field(default_factory=list)
    emergency_flag: bool = False
    should_end_session: bool = False
    remaining_free_turns: int
    state: str
    access_locked: bool = False
    upgrade_url: Optional[str] = None


class CompanionEndRequest(BaseModel):
    session_id: str


class CompanionEndResponse(BaseModel):
    ok: bool
    session_id: str
    message: str


class CompanionFeedbackRequest(BaseModel):
    session_id: Optional[str] = None
    rating: int = Field(ge=1, le=5)
    sentiment: Optional[Literal["up", "down"]] = None
    text: Optional[str] = Field(default=None, max_length=1500)
    consent_to_share: bool = False


class CompanionFeedbackResponse(BaseModel):
    ok: bool
    stored: bool
    message: str


class CompanionSTTResponse(BaseModel):
    session_id: Optional[str] = None
    raw_transcript: str
    refined_user_text: str
    detected_language: str
    safety_flags: list[str] = Field(default_factory=list)
    emergency_flag: bool = False


class CompanionTTSRequest(BaseModel):
    session_id: Optional[str] = None
    text: str = Field(min_length=1, max_length=3000)
    language_preference: str = Field(default="auto")
    voice: Optional[str] = None
    provider: Optional[str] = None