from datetime import datetime
from enum import Enum
from typing import Optional

from pydantic import BaseModel, Field


class CompanionSessionState(str, Enum):
    onboarding = "onboarding"
    conversation = "conversation"
    emergency = "emergency"
    limit_reached = "limit_reached"
    ended = "ended"
    expired = "expired"


class CompanionTurnRole(str, Enum):
    system = "system"
    user = "user"
    assistant = "assistant"


class CompanionProfile(BaseModel):
    name: Optional[str] = None
    age: Optional[int] = None
    gender: Optional[str] = None
    marital_status: Optional[str] = None


class CompanionTurn(BaseModel):
    role: CompanionTurnRole
    text: str
    language: str = "auto"
    created_at: datetime = Field(default_factory=datetime.utcnow)


class CompanionSafetyAssessment(BaseModel):
    emergency_flag: bool = False
    flags: list[str] = Field(default_factory=list)
    escalation_message: Optional[str] = None


class CompanionProfileExtraction(BaseModel):
    name: Optional[str] = None
    age: Optional[int] = None
    gender: Optional[str] = None
    marital_status: Optional[str] = None
    missing_fields: list[str] = Field(default_factory=list)
    should_follow_up: bool = False
    health_context_present: bool = False


class CompanionSession(BaseModel):
    session_id: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    expires_at: datetime
    state: CompanionSessionState = CompanionSessionState.onboarding
    mode: str = "voice"
    detected_language: str = "auto"
    profile: CompanionProfile = Field(default_factory=CompanionProfile)
    turns: list[CompanionTurn] = Field(default_factory=list)
    user_turn_count: int = 0
    onboarding_complete: bool = False
    profile_follow_up_used: int = 0
    last_refined_user_text: Optional[str] = None