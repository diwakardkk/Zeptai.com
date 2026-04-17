from datetime import datetime, timedelta
from uuid import uuid4

from app.core.companion_config import companion_settings
from app.models.companion_doctor import CompanionSession, CompanionSessionState

_sessions: dict[str, CompanionSession] = {}


def _utcnow() -> datetime:
    return datetime.utcnow()


def _new_expiry() -> datetime:
    return _utcnow() + timedelta(seconds=companion_settings.session_ttl_seconds)


def _cleanup_expired_sessions() -> None:
    now = _utcnow()
    expired_ids = [session_id for session_id, session in _sessions.items() if session.expires_at <= now]
    for session_id in expired_ids:
        _sessions.pop(session_id, None)


def create_session(language_preference: str, mode: str) -> CompanionSession:
    _cleanup_expired_sessions()
    session = CompanionSession(
        session_id=str(uuid4()),
        expires_at=_new_expiry(),
        detected_language=language_preference,
        mode=mode,
    )
    _sessions[session.session_id] = session
    return session


def get_session(session_id: str) -> CompanionSession | None:
    _cleanup_expired_sessions()
    session = _sessions.get(session_id)
    if session is None:
        return None
    session.expires_at = _new_expiry()
    return session


def save_session(session: CompanionSession) -> CompanionSession:
    session.expires_at = _new_expiry()
    _sessions[session.session_id] = session
    return session


def end_session(session_id: str) -> bool:
    session = _sessions.get(session_id)
    if session is not None:
        session.state = CompanionSessionState.ended
    return _sessions.pop(session_id, None) is not None


def remaining_turns(session: CompanionSession) -> int:
    return max(companion_settings.max_turns - session.user_turn_count, 0)