# API Service Reference
Base URL: `http://localhost:8001/api/v1`

Auth: none (development). Add auth middleware before production.

## Health
`GET /health`
- Response: `{ "status": "ok", "project": "Hospital Intake Bot" }`

## Chat
`POST /chat/start`
- Start a new intake session.
- Body:
```json
{
  "patient_name": "Jane Doe",
  "language": "en",
  "voice_mode": false
}
```

`POST /chat/message`
- Send a user message and get AI reply.
- Header: `X-Conversation-Id: <conversation_id>`
- Body:
```json
{
  "conversation_id": "uuid",
  "message": "text"
}
```

## Speech to Text (STT)
`POST /stt/transcribe`
- Form file `audio` (`webm`, `wav`, `mp3`, `ogg`, `m4a`).
- Returns `{ "transcript": "...", "filename": "..." }`.

## Text to Speech (TTS)
`POST /tts/speak`
- Body:
```json
{
  "text": "Hello patient",
  "voice": "alloy",
  "backend": "openai|piper"
}
```

## Sessions
`GET /sessions/list`
`GET /sessions/{conversation_id}`

## Reports
`POST /report/vitals`
`GET /report/{conversation_id}`
`POST /report/export/{conversation_id}`

## Admin
`GET /admin/seed`

## Data / RAG
- Knowledge JSON: `data/source_json/hospital_knowledge.json`
- Vectorstore: `data/vectorstore/` (FAISS)

## Environment
Copy `.env.example` to `.env` and set at least:
- `OPENAI_API_KEY`
- `STT_BACKEND`, `TTS_BACKEND`
- `VECTOR_STORE_PATH`, `AUDIO_STORE_PATH`

## Run Locally
```bash
cd backend/api
python -m venv venv
.\venv\Scripts\pip install -r requirements.txt
cp .env.example .env
uvicorn app.main:app --host 0.0.0.0 --port 8001
```

Health: `http://localhost:8001/health`
