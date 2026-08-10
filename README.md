# Continue Where I Left Off — VoxForge prototype

This repository contains a StarForge 2026 VoxForge prototype for an interview-preparation voice agent. It currently provides a safe, runnable integration foundation only; it does **not** send recordings, retrieve data, call an LLM, or synthesize speech yet.

## Architecture

```text
Browser UI (frontend, Next.js)
  -> /api/* same-origin request
  -> Next.js rewrite (BACKEND_URL)
  -> Node/TypeScript API (backend, Express)
  -> provider wrappers (not invoked yet): Groq STT/LLM, Qdrant, Rime

Shared request/response contracts live in shared/interview.ts.
```

- `frontend/` remains the existing Next.js App Router prototype and contains browser-only UI/state.
- `backend/` is an Express/TypeScript service. It owns provider configuration and all future calls to Groq, Qdrant, and Rime.
- `shared/` contains data-only TypeScript contracts safe to import from either side. It must not contain backend implementation or secrets.

The backend exposes `GET /health` and placeholders for `POST /api/stt`, `POST /api/interview`, and `POST /api/tts`. The placeholders report missing configuration with `503`, or `501` when configured, and make no provider network calls.

## Interview knowledge retrieval

Qdrant now holds a small, synthetic interview-preparation dataset in the `interview_knowledge` collection. The Qdrant Cloud Inference model `sentence-transformers/all-MiniLM-L6-v2` creates the 384-dimensional `content` vector, so no additional embedding provider or key is required.

Initialize or re-run the idempotent seed:

```bash
cd backend
npm run seed
```

Search the real collection through the backend:

```bash
curl -X POST http://localhost:4000/api/interview/search \
  -H "Content-Type: application/json" \
  -d '{"query":"How should I explain my biggest software project?"}'
```

The response is a `results` array containing text, similarity score, source, title, and category. This shape is the future LLM orchestration context; the LLM is not invoked by this endpoint.

## Interview intelligence

`POST /api/interview` accepts a required transcript plus optional `role` and `interviewType`. It retrieves the three most relevant `interview_knowledge` records, includes their actual content in the Groq `openai/gpt-oss-120b` request, and returns concise structured coaching with the Qdrant records the model identified as used.

```powershell
Invoke-RestMethod -Method Post -Uri "http://localhost:4000/api/interview" -ContentType "application/json" -Body '{"transcript":"I built a stock analysis web application using Next.js and APIs. I worked on the frontend and connected several data sources.","role":"Software Engineering Intern","interviewType":"technical"}'
```

The response includes `interviewerResponse`, `feedback`, a 1–10 `score` or `null`, and `retrievedContext` metadata. The endpoint does not invoke Rime or the frontend.

## Speech to text

`POST /api/stt` accepts one `multipart/form-data` field named `audio`, keeps it in memory only for the request, and transcribes it through the server-side Groq SDK using `whisper-large-v3-turbo`. Supported formats are FLAC, MP3, MP4/M4A, OGG, WAV, and WebM. Uploads are limited to 20 MB.

With the backend running, test it with a local audio file:

```powershell
curl.exe -X POST http://localhost:4000/api/stt -F "audio=@C:\path\to\recording.wav;type=audio/wav"
```

The endpoint returns `{ "transcript": "..." }`. It does not invoke the LLM or Rime.

## Text to speech

`POST /api/tts` accepts `{ "text": "..." }` and returns Rime-generated browser-playable WAV audio directly. The backend uses the server-only `RIME_API_KEY` with Rime's `arcana` model and `astra` speaker; no audio provider credential is sent to the browser.

```powershell
curl.exe -X POST http://localhost:4000/api/tts -H "Content-Type: application/json" -d "{\"text\":\"Let us continue with your interview answer.\"}" -o response.wav
```

## Environment variables

Copy `backend/.env.example` to `backend/.env`, then add real values locally:

```bash
RIME_API_KEY=
QDRANT_URL=
QDRANT_API_KEY=
LLM_API_KEY=
STT_API_KEY=
```

`LLM_API_KEY` and `STT_API_KEY` configure separate Groq SDK clients for the planned `openai/gpt-oss-120b` and `whisper-large-v3-turbo` calls. `RIME_API_KEY` is retained exclusively in the backend's future REST wrapper, which will use Node's built-in `fetch`; Qdrant uses the official JavaScript client.

Optionally copy `frontend/.env.example` to `frontend/.env.local` and set `BACKEND_URL` if the backend is not at `http://localhost:4000`. This setting is only a rewrite destination—never put provider keys in frontend variables, especially not `NEXT_PUBLIC_*` variables.

`.env` files are Git-ignored. Never commit API keys, tokens, recordings, or other sensitive interview data.

## Run locally

Use Node 22 or later.

In one terminal:

```bash
cd backend
npm install
npm run dev
```

In another terminal:

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:3000`. To verify the API foundation directly, request `http://localhost:4000/health`.

## Checks

```bash
cd backend
npm run typecheck
npm run build

cd ../frontend
npm run lint
npm run build
```

## Deliberate scope boundary

The complete microphone → STT → retrieval → interview orchestration → LLM → Rime TTS flow is intentionally not implemented. Before adding it, agree and document the API payloads, audio upload format, Qdrant collection/schema and retrieval semantics, conversation/session state, failure behavior, and provider response handling.
