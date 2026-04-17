import json

from app.core.companion_config import companion_settings
from app.core.logging import get_logger
from app.db.companion_usage_repo import consume_turn, get_or_create_usage
from app.models.companion_doctor import (
    CompanionSession,
    CompanionSessionState,
    CompanionTurn,
    CompanionTurnRole,
)
from app.schemas.companion_doctor import (
    CompanionEndResponse,
    CompanionMessageRequest,
    CompanionMessageResponse,
    CompanionStartRequest,
    CompanionStartResponse,
)
from app.services.companion_doctor.client import get_client
from app.services.companion_doctor.knowledge_service import get_support_context
from app.services.companion_doctor.language_utils import (
    choose_reply_language,
    language_display,
    normalize_language_preference,
)
from app.services.companion_doctor.profile_service import extract_profile, merge_profile
from app.services.companion_doctor.prompt_loader import (
    age_band_for_age,
    format_demographic_context,
    load_json_resource,
    load_prompt,
)
from app.services.companion_doctor.response_polisher import polish_response, prepare_tts_text
from app.services.companion_doctor.safety_service import assess_safety
from app.services.companion_doctor.session_store import (
    create_session,
    end_session as end_session_store,
    get_session,
    remaining_turns,
    save_session,
)

logger = get_logger(__name__)
UPGRADE_URL = "/pricing"


def _opening_message(language: str) -> str:
    if language == "hi":
        return (
            "Namaste, main ZeptAI ki supportive health companion hoon. "
            "Main licensed doctor nahi hoon, aur yeh emergency service bhi nahi hai. "
            "Shuru karne se pehle, kya aap apna naam, age, aur gender bata sakte hain?"
        )
    if language == "mixed":
        return (
            "Hi, main ZeptAI ki supportive AI health companion hoon. "
            "Main real doctor ka replacement nahi hoon, aur emergencies ke liye nahi hoon. "
            "Before we begin, may I know your name, age, and gender?"
        )
    return (
        "Hi, I'm ZeptAI's supportive AI health companion. "
        "I'm not a licensed doctor and this is not for emergencies. "
        "Before we begin, may I know your name, age, and gender?"
    )


def _privacy_note() -> str:
    return "Your conversation is kept in temporary memory only for the active session and is not stored permanently."


def _non_emergency_notice() -> str:
    return "Not for emergencies. For severe or urgent symptoms, contact local emergency care or go to the nearest hospital."


def _missing_profile_line(missing_fields: list[str], language: str) -> str:
    field_label = ", ".join(missing_fields)
    if language == "hi":
        return (
            f"Agar aap comfortable hon, to apna {field_label} bhi share kar dijiye. "
            "Usse main thoda better context ke saath baat kar paungi."
        )
    if language == "mixed":
        return (
            f"If you're comfortable, please also share your {field_label}. "
            "That helps me respond with better context."
        )
    return f"If you're comfortable, please also share your {field_label}. That helps me respond with better context."


def _limit_message(language: str) -> str:
    if language == "hi":
        return (
            "Aaj ke free demo turns khatam ho gaye hain. "
            "Agar symptoms bane rahein ya zyada badh jaayen, to kripya doctor se consult kijiye."
        )
    if language == "mixed":
        return (
            "Aaj ke free demo turns khatam ho gaye hain. "
            "Agar problem theek na ho ya symptoms badhein, to please doctor se consult kijiye."
        )
    return (
        "You've reached the free demo limit for this session. "
        "If the problem continues or worsens, please speak with a clinician."
    )


def _access_locked_message(language: str) -> str:
    if language == "hi":
        return (
            "Aapke free companion credits use ho chuke hain. "
            "Agar aap continue karna chahte hain, to more access ke liye pricing page dekhiye."
        )
    if language == "mixed":
        return (
            "Aapke free companion credits use ho chuke hain. "
            "To continue, please pricing page par jaakar more access lijiye."
        )
    return "Your free companion credits have been used. To continue, please visit the pricing page for more access."


def _locked_start_response(language: str) -> CompanionStartResponse:
    return CompanionStartResponse(
        session_id="",
        assistant_text=_access_locked_message(language),
        detected_language=language,
        should_end_session=True,
        remaining_free_turns=0,
        state=CompanionSessionState.ended.value,
        privacy_note=_privacy_note(),
        non_emergency_notice=_non_emergency_notice(),
        access_locked=True,
        upgrade_url=UPGRADE_URL,
    )


def _locked_message_response(language: str, refined_user_text: str) -> CompanionMessageResponse:
    assistant_text = _access_locked_message(language)
    return CompanionMessageResponse(
        session_id="",
        detected_language=language,
        refined_user_text=refined_user_text,
        assistant_text=assistant_text,
        tts_text=prepare_tts_text(assistant_text),
        should_end_session=True,
        remaining_free_turns=0,
        state=CompanionSessionState.ended.value,
        access_locked=True,
        upgrade_url=UPGRADE_URL,
    )


def _compact_history(session: CompanionSession, omit_latest_user: bool = False) -> list[dict[str, str]]:
    recent_turns = session.turns[-8:]
    if omit_latest_user and recent_turns and recent_turns[-1].role == CompanionTurnRole.user:
        recent_turns = recent_turns[:-1]
    return [{"role": turn.role.value, "content": turn.text} for turn in recent_turns]


def _build_system_prompt(session: CompanionSession, user_text: str, reply_language: str, support_context: str) -> str:
    system_base = load_prompt("system_base.md")
    safety = load_prompt("safety_guardrails.md")
    bilingual_style = load_prompt("bilingual_style.md")
    conversation_strategy = load_prompt("conversational_strategy.md")
    emergency_escalation = load_prompt("emergency_escalation.md")

    age_band = age_band_for_age(session.profile.age)
    age_map = load_json_resource("age_group_strategy_map.json")
    symptom_map = load_json_resource("symptom_follow_up_map.json")
    symptom_hints = []
    lowered = user_text.lower()
    for symptom, details in symptom_map.items():
        if symptom.replace("_", " ") in lowered or any(keyword in lowered for keyword in details.get("keywords", [])):
            symptom_hints.append(f"{symptom}: {details['focus']}")

    demographic_context = format_demographic_context(
        session.profile.name,
        session.profile.age,
        session.profile.gender,
    )
    age_strategy = age_map.get(age_band, {})
    return "\n\n".join(
        [
            system_base.format(reply_language=language_display(reply_language)),
            safety,
            bilingual_style.format(reply_language=language_display(reply_language)),
            conversation_strategy.format(
                age_band=age_band,
                demographic_context=demographic_context,
                age_strategy=json.dumps(age_strategy, ensure_ascii=False),
                symptom_hints="; ".join(symptom_hints) if symptom_hints else "Ask only one or two focused follow-up questions.",
                retrieved_context=support_context or "No retrieval context available.",
            ),
            emergency_escalation,
        ]
    )


async def start_session(request: CompanionStartRequest, client_id: str) -> CompanionStartResponse:
    language = normalize_language_preference(request.language_preference)
    usage = get_or_create_usage(client_id)
    if usage.access_locked:
        return _locked_start_response(language)

    session = create_session(language, request.mode)
    session.user_turn_count = usage.turns_used
    greeting = _opening_message(language)
    session.turns.append(
        CompanionTurn(role=CompanionTurnRole.assistant, text=greeting, language=language)
    )
    save_session(session)
    return CompanionStartResponse(
        session_id=session.session_id,
        assistant_text=greeting,
        detected_language=language,
        remaining_free_turns=remaining_turns(session),
        state=session.state.value,
        privacy_note=_privacy_note(),
        non_emergency_notice=_non_emergency_notice(),
        access_locked=False,
        upgrade_url=None,
    )


async def process_message(request: CompanionMessageRequest, client_id: str) -> CompanionMessageResponse:
    session = get_session(request.session_id)
    if session is None:
        usage = get_or_create_usage(client_id)
        language = normalize_language_preference(request.language_preference)
        if usage.access_locked:
            return _locked_message_response(language, request.message.strip()[: companion_settings.max_input_chars])
        raise ValueError("Companion session not found or expired.")

    user_text = request.message.strip()[: companion_settings.max_input_chars]
    reply_language = choose_reply_language(user_text, request.language_preference, session.detected_language)
    session.detected_language = reply_language

    usage = get_or_create_usage(client_id)
    session.user_turn_count = max(session.user_turn_count, usage.turns_used)
    if usage.access_locked or remaining_turns(session) <= 0:
        session.state = CompanionSessionState.limit_reached
        end_session_store(session.session_id)
        return _locked_message_response(reply_language, user_text)

    safety = assess_safety(user_text, reply_language)
    usage = consume_turn(client_id)
    session.user_turn_count = usage.turns_used
    session.last_refined_user_text = user_text
    session.turns.append(CompanionTurn(role=CompanionTurnRole.user, text=user_text, language=reply_language))

    if not session.onboarding_complete:
        extraction = await extract_profile(user_text, session.profile)
        session.profile = merge_profile(session.profile, extraction)
        session.onboarding_complete = True
        session.state = CompanionSessionState.conversation
    else:
        extraction = None

    if safety.emergency_flag:
        session.state = CompanionSessionState.emergency
        assistant_text = safety.escalation_message or _non_emergency_notice()
        session.turns.append(
            CompanionTurn(role=CompanionTurnRole.assistant, text=assistant_text, language=reply_language)
        )
        save_session(session)
        return CompanionMessageResponse(
            session_id=session.session_id,
            detected_language=reply_language,
            refined_user_text=user_text,
            assistant_text=assistant_text,
            tts_text=prepare_tts_text(assistant_text),
            safety_flags=safety.flags,
            emergency_flag=True,
            should_end_session=True,
            remaining_free_turns=remaining_turns(session),
            state=session.state.value,
        )

    support_context, _ = get_support_context(user_text)
    system_prompt = _build_system_prompt(session, user_text, reply_language, support_context)
    messages = [{"role": "system", "content": system_prompt}, *_compact_history(session, omit_latest_user=True)]
    messages.append({"role": "user", "content": user_text})

    client = get_client()
    response = await client.chat.completions.create(
        model=companion_settings.chat_model,
        temperature=companion_settings.chat_temperature,
        max_tokens=180,
        messages=messages,
    )
    assistant_text = (response.choices[0].message.content or "Let's go step by step.").strip()

    if extraction and extraction.should_follow_up and session.profile_follow_up_used < 1:
        assistant_text = f"{assistant_text}\n\n{_missing_profile_line(extraction.missing_fields, reply_language)}"
        session.profile_follow_up_used += 1

    assistant_text = await polish_response(assistant_text, reply_language)
    should_end_session = False
    turns_left = remaining_turns(session)
    access_locked = False
    if usage.access_locked or turns_left <= 0:
        session.state = CompanionSessionState.limit_reached
        assistant_text = f"{assistant_text}\n\n{_access_locked_message(reply_language)}"
        should_end_session = True
        access_locked = True

    session.turns.append(
        CompanionTurn(role=CompanionTurnRole.assistant, text=assistant_text, language=reply_language)
    )
    if should_end_session:
        end_session_store(session.session_id)
    else:
        save_session(session)

    return CompanionMessageResponse(
        session_id=session.session_id,
        detected_language=reply_language,
        refined_user_text=user_text,
        assistant_text=assistant_text,
        tts_text=prepare_tts_text(assistant_text),
        safety_flags=safety.flags,
        emergency_flag=False,
        should_end_session=should_end_session,
        remaining_free_turns=remaining_turns(session),
        state=CompanionSessionState.ended.value if should_end_session else session.state.value,
        access_locked=access_locked,
        upgrade_url=UPGRADE_URL if access_locked else None,
    )


async def end_session(session_id: str) -> CompanionEndResponse:
    deleted = end_session_store(session_id)
    return CompanionEndResponse(
        ok=deleted,
        session_id=session_id,
        message="Companion session ended. Nothing was persisted from this conversation.",
    )