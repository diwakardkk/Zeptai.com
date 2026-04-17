# Companion Doctor Feature

This feature adds a fully isolated, privacy-first wellness conversation experience.

What it does:
- Adds companion-only endpoints under `/api/v1/companion/*`
- Keeps session state in memory with TTL only
- Does not write transcripts to SQLite, Firestore, files, analytics logs, or FAISS
- Uses a separate prompt stack and separate companion knowledge base
- Supports bilingual English, Hindi, and natural Hinglish responses
- Uses the repo's existing OpenAI/STT/TTS provider pattern

Backend routes:
- `POST /api/v1/companion/chat/start`
- `POST /api/v1/companion/chat/message`
- `POST /api/v1/companion/chat/end`
- `POST /api/v1/companion/stt`
- `POST /api/v1/companion/tts`
- `POST /api/v1/companion/feedback`

Frontend entry points:
- Homepage promotional section after hero
- Dedicated page at `/companion-doctor`
- Text fallback at `/companion-doctor?mode=text`

Isolation guarantees:
- Existing intake demo UI remains separate
- Existing chat, report, session, admin, STT, and TTS routes remain intact
- No shared persistence or database schema changes were added

Voice behavior:
- One-tap start for microphone mode
- Silence-based turn completion
- Optional transcript editing before send
- Client-side interruption handling that stops current playback immediately

Configuration:
- Companion-specific settings are read from `backend/api/.env.example`
- Frontend reuses the existing `NURSE_API_BASE` or `NEXT_PUBLIC_NURSE_API_BASE`

Known design choice:
- Feedback endpoint is present but intentionally non-persistent in this build, even when consent is provided