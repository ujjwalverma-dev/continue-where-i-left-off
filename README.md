
**StarForge 2026 — VoxForge**  
**Team: Binary Brains**

Continuum is a voice-first AI experience designed to help users continue unfinished interactions without having to start from zero.

Interview practice is the current demonstration use case.

## The Problem

Existing AI assistants can remember conversations, but users can still lose the useful context of an unfinished task and have to reconstruct what they were doing.

Continuum focuses on preserving the **latest useful interaction context** so users can return and continue.

# Continuum — Never Start From Zero
#Website_Link - https://continuum-voice.vercel.app/


## How It Works

```text
User speaks
    ↓
Groq Whisper
Speech → Text
    ↓
Qdrant
Relevant context retrieval
    ↓
GPT-OSS
Response generation
    ↓
Rime
Text → Speech
    ↓
User hears response

The voice interaction is turn-based:

Listening → Processing → Continuum speaking → Review → Your turn

Qdrant provides relevant supporting context, while the application preserves the latest useful continuity state for future sessions.

Technology Stack
Frontend: Next.js, React, TypeScript
Backend: Node.js, Express, TypeScript
Speech-to-text: Groq Whisper (whisper-large-v3-turbo)
LLM: Groq openai/gpt-oss-120b
Retrieval: Qdrant
Text-to-speech: Rime
Continuity: Browser localStorage


Key Features
Voice-based interaction
Speech-to-text with Groq Whisper
Relevant context retrieval with Qdrant
Contextual response generation with GPT-OSS
Rime-generated spoken responses
Review screen after each completed turn
Continue from the latest useful context
Start a new chat without carrying forward previous context


Repository Structure
frontend/     Next.js / React application
backend/      Node.js / TypeScript API
shared/       Shared TypeScript contracts


Local Setup
Requirements
Node.js 22+
Groq API key
Qdrant Cloud project/API key
Rime API key

1. Clone the repository
git clone <YOUR_GITHUB_REPOSITORY_URL>
cd <REPOSITORY_DIRECTORY>

2. Configure the backend

Create:

backend/.env

using:

backend/.env.example

Add:

RIME_API_KEY=
QDRANT_URL=
QDRANT_API_KEY=
LLM_API_KEY=
STT_API_KEY=

PORT=4000
FRONTEND_ORIGIN=http://localhost:3000

Never commit the real .env file.

3. Start the backend
cd backend
npm install
npm run dev

Backend:

http://localhost:4000

Health check:

http://localhost:4000/health
4. Start the frontend

Open another terminal:

cd frontend
npm install
npm run dev

Open:

http://localhost:3000
Qdrant Knowledge Base

The prototype uses a small synthetic interview-preparation dataset in Qdrant.

To seed the collection:

cd backend
npm run seed

The retrieval endpoint can be tested with:

POST /api/interview/search
API
Endpoint	Purpose
GET /health	Backend health check
POST /api/stt	Speech → transcript
POST /api/interview/search	Qdrant retrieval
POST /api/interview	Context retrieval + GPT-OSS response
POST /api/tts	Text → Rime speech
Validation

The project has been validated with:

cd backend
npm run typecheck
npm run build

cd ../frontend
npm run lint
npm run build

The local end-to-end flow has also been tested:

Microphone
   ↓
Groq Whisper
   ↓
Qdrant
   ↓
GPT-OSS
   ↓
Rime
   ↓
Browser audio


Security
API keys remain server-side.
.env files are Git-ignored.
.env.example contains no secrets.
Provider keys are never exposed through NEXT_PUBLIC_* variables.
The interview knowledge dataset is synthetic.
Current Scope

Continuum is a working prototype, not a production multi-user system.

The current implementation preserves the latest useful interaction context. Future versions could add persistent accounts, richer task memory, additional task types, and production-scale multi-user storage.

Credits -
🤝 Pathway  
🤝 Rime  
🤝 Weya  
🤝 Qdrant


Team

Binary Brains
Project: Continuum
Track: StarForge 2026 — VoxForge
