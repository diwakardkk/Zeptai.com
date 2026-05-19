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


class IntakeSlots(BaseModel):
    """Tracks which intake information has been collected in this session."""
    chief_complaint: Optional[str] = None
    duration: Optional[str] = None
    severity: Optional[str] = None
    associated_symptoms: list[str] = Field(default_factory=list)
    medications: list[str] = Field(default_factory=list)
    allergies: list[str] = Field(default_factory=list)
    medical_history: list[str] = Field(default_factory=list)

    def filled_summary(self) -> str:
        """Return a human-readable summary of collected slots for prompt injection."""
        lines = []
        if self.chief_complaint:
            lines.append(f"chief_complaint: {self.chief_complaint}")
        if self.duration:
            lines.append(f"duration: {self.duration}")
        if self.severity:
            lines.append(f"severity: {self.severity}")
        if self.associated_symptoms:
            lines.append(f"associated_symptoms: {', '.join(self.associated_symptoms)}")
        if self.medications:
            lines.append(f"medications: {', '.join(self.medications)}")
        if self.allergies:
            lines.append(f"allergies: {', '.join(self.allergies)}")
        if self.medical_history:
            lines.append(f"medical_history: {', '.join(self.medical_history)}")
        return "\n".join(lines) if lines else "None collected yet."

    def next_missing_slot(self) -> Optional[str]:
        """Return the name of the next priority slot that is still empty."""
        if not self.chief_complaint:
            return "chief_complaint"
        if not self.duration:
            return "duration"
        if not self.severity:
            return "severity"
        if not self.associated_symptoms:
            return "associated_symptoms"
        if not self.medications:
            return "medications"
        if not self.allergies:
            return "allergies"
        if not self.medical_history:
            return "medical_history"
        return None


class CompanionSession(BaseModel):
    session_id: str
    created_at: datetime = Field(default_factory=datetime.utcnow)
    expires_at: datetime
    state: CompanionSessionState = CompanionSessionState.onboarding
    mode: str = "voice"
    detected_language: str = "auto"
    session_language: str = "auto"  # locked language after first meaningful turn
    profile: CompanionProfile = Field(default_factory=CompanionProfile)
    intake_slots: IntakeSlots = Field(default_factory=IntakeSlots)
    last_asked_slot: Optional[str] = None
    turns: list[CompanionTurn] = Field(default_factory=list)
    user_turn_count: int = 0
    onboarding_complete: bool = False
    profile_follow_up_used: int = 0
    last_refined_user_text: Optional[str] = None