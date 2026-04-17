# Companion Doctor Test Plan

Manual QA checklist:

1. English input
- Start a voice session and say: "I'm Rahul, 31, male. I've had a headache since last night."
- Confirm onboarding extraction works and follow-up asks about duration, sleep, hydration, or severity.

2. Hindi input
- Start a session and say: "Mera naam Suman hai, meri age 45 hai, mujhe do din se bukhar hai."
- Confirm reply remains natural Hindi and asks focused fever follow-up.

3. Hinglish mixed input
- Say: "I feel low, kaafi stress hai, and sleep bhi kharab hai."
- Confirm response stays natural Hinglish and not awkwardly translated.

4. Interruption during TTS
- Trigger a voice reply and start speaking while the assistant audio is playing.
- Confirm playback stops immediately and the system returns to listening.

5. Emergency red-flag input
- Use text mode with: "I have severe chest pain and trouble breathing."
- Confirm the assistant exits casual mode and gives urgent escalation advice immediately.

6. Free usage limit reached
- Continue until the configured turn limit is reached.
- Confirm the UI shows the limit state and the backend returns `should_end_session=true`.

7. Privacy behavior
- Confirm no new transcript rows appear in SQLite, Firestore, or vector stores.
- Confirm companion sessions disappear after TTL expiry or restart.

8. Reload and reset behavior
- Reload the companion page mid-session.
- Confirm the session safely resets and no old conversation is restored.

9. Graceful API failure
- Temporarily break `NURSE_API_BASE` and confirm the UI shows a useful error without crashing.

10. Missing microphone permission fallback
- Deny mic permission in the browser.
- Confirm the UI switches cleanly to text mode with a helpful message.