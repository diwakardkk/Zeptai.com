# ZeptAI Monorepo

AI-powered company website and Nurse API backend.

## Folder Structure
```text
Zeptai.com/
├── frontend/        # Next.js website (App Router + contact API route)
├── backend/
│   └── api/         # FastAPI service (RAG, chat, STT, TTS, reports)
└── README.md
```

## Run Frontend (Browser)
```bash
cd frontend
npm install
npm run dev
```
Open `http://localhost:3000`.

## Run Backend API
```bash
cd backend/api
python -m venv venv
source venv/bin/activate      # macOS/Linux
pip install -r requirements.txt
uvicorn app.main:app --host 0.0.0.0 --port 8000
```

API health check: `http://localhost:8000/health`

## Environment
- Frontend uses `NEXT_PUBLIC_NURSE_API_BASE` to target backend.
- Local default fallback in UI: `http://127.0.0.1:8000/api/v1`.
