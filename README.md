Continuum — Never Start From Zero

«Continuum helps users return to an unfinished voice interaction with relevant context instead of starting from zero again.»

Team: Binary Brains
Project: Continuum
Track: VoxForge

"Live Website" (https://continuum-voice.vercel.app/)

---

Product Demo

Full Demo

"Watch the full Continuum demo on YouTube" (https://youtu.be/kdfuuF3q84I?si=8-CXvzG-yIL7cQYh)

The demo shows the working voice interaction and the current Continuum experience.

---

The Problem

AI assistants can generate useful responses during a conversation, but returning to an unfinished task can still require the user to reconstruct what they were doing.

This is particularly noticeable in tasks that are naturally conversational. A user may begin an interview-practice session, leave before completing it, and later want to continue from the useful context that already exists.

Continuum explores a simple idea:

«The next interaction should begin with the context that matters, not from zero.»

The current implementation demonstrates this idea through a voice-first interview-practice experience.

---

Why Voice?

Interview practice is inherently conversational. Speaking an answer aloud is closer to the real interaction than typing an answer into a text box.

Continuum therefore uses voice for the main interaction:

1. The user speaks an answer or request.
2. The system transcribes the speech.
3. Relevant context is retrieved.
4. A response is generated.
5. Rime converts the response into speech.
6. The user hears the response and continues the interaction.

Voice is therefore part of the task itself rather than simply a microphone attached to a text chatbot.

---

What Continuum Contributes

Continuum explores how voice interaction, retrieval, and application-level continuity can be combined into a single workflow.

The project separates:

- Current interaction state — what is happening now.
- Retrieved knowledge — relevant information needed for the current request.
- Continuity state — the latest useful context needed to continue an unfinished interaction.

Qdrant is used as a functional retrieval layer rather than as a decorative database. Retrieved context is passed into response generation and therefore affects the resulting interaction.

The project does not claim model-internal continual learning. Continuity is implemented at the application layer using retrieval and stored interaction state.

---

How It Works

User speaks
    ↓
Groq Whisper
Speech → Text
    ↓
Application Backend
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

Listening
    ↓
Processing
    ↓
Continuum speaking
    ↓
Review
    ↓
Your turn

---

Architecture

"Continuum Architecture" (docs/architecture.png)

The main components are:

- Frontend: captures voice input and plays generated audio.
- Backend: orchestrates speech recognition, retrieval, response generation, and speech synthesis.
- Groq Whisper: converts user speech into text.
- Qdrant: retrieves relevant interview knowledge and context.
- GPT-OSS: generates the contextual response.
- Rime: converts the generated response into spoken audio.
- Browser localStorage: preserves the latest useful continuity state for the current prototype.

---

Qdrant's Role

Qdrant has a functional role in Continuum's response-generation pipeline.

The prototype contains a small synthetic interview-preparation knowledge base. When the user speaks, the application retrieves relevant context from Qdrant before generating the response.

User speech
     ↓
Transcript
     ↓
Retrieval query
     ↓
Qdrant
     ↓
Relevant context
     ↓
GPT-OSS
     ↓
Rime speech

The retrieved context is therefore part of the information available to the response-generation step.

The current implementation uses the most relevant retrieved results for the response-generation flow.

---

Rime

Rime provides the spoken output of the main interaction.

The final implementation uses Rime-generated speech as an essential part of the user experience. The user receives the system's response through spoken audio rather than only through text.

The exact Rime model, voice, language, and transport configuration used by the final implementation are defined in the application configuration and can be verified from the source code.

---

Key Features

- Voice-based interview practice
- Speech-to-text using Groq Whisper
- Context retrieval using Qdrant
- Contextual response generation using GPT-OSS
- Spoken responses using Rime
- Review screen after each completed turn
- Continuation from the latest useful context
- Ability to start a new chat without carrying forward previous context
- Server-side API key handling
- Synthetic interview-preparation knowledge base

---

Technology Stack

Component| Technology
Frontend| Next.js, React, TypeScript
Backend| Node.js, Express, TypeScript
Speech-to-text| Groq Whisper ("whisper-large-v3-turbo")
LLM| Groq "openai/gpt-oss-120b"
Retrieval| Qdrant
Text-to-speech| Rime
Continuity state| Browser localStorage

---

Performance Metrics

Continuum is evaluated using metrics that correspond to the actual voice experience and the project's retrieval and continuity behavior.

The current repository contains build, type-check, lint, and end-to-end validation. Final numerical performance measurements should be reported only from measurements taken against the final implementation.

Evaluation Metrics

Metric| Why it matters
End-to-end voice response latency| Measures the delay experienced by the user from speech input to usable spoken output.
Qdrant retrieval latency| Measures the overhead introduced by contextual retrieval.
Top-K retrieval relevance| Measures whether retrieved context is relevant to the user's request.
End-to-end successful turns| Measures reliability of the complete speech → retrieval → generation → speech pipeline.
Continuation success rate| Measures whether the system resumes the intended context instead of starting from zero.

These metrics were selected because voice performance should be evaluated from the user's perspective, while retrieval and continuation quality directly support Continuum's central claim.

---

Reproducibility

Requirements

- Node.js 22+
- Groq API key
- Qdrant Cloud project/API key
- Rime API key

1. Clone the Repository

git clone <YOUR_GITHUB_REPOSITORY_URL>
cd <REPOSITORY_DIRECTORY>

2. Configure the Backend

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

Never commit the real ".env" file.

3. Start the Backend

cd backend
npm install
npm run dev

Backend:

http://localhost:4000

Health check:

http://localhost:4000/health

4. Start the Frontend

Open another terminal:

cd frontend
npm install
npm run dev

Open:

http://localhost:3000

5. Seed the Qdrant Knowledge Base

The prototype uses a small synthetic interview-preparation dataset in Qdrant.

cd backend
npm run seed

6. Reproduce the Central Flow

1. Start the backend.
2. Start the frontend.
3. Open the voice interview experience.
4. Use the microphone to ask or answer an interview question.
5. Verify that speech is transcribed.
6. Verify that relevant context is retrieved from Qdrant.
7. Verify that GPT-OSS generates the response.
8. Verify that Rime produces spoken output.
9. Continue the interaction using the returned context.

---

API

Endpoint| Purpose
"GET /health"| Backend health check
"POST /api/stt"| Speech → transcript
"POST /api/interview/search"| Qdrant retrieval
"POST /api/interview"| Context retrieval + GPT-OSS response
"POST /api/tts"| Text → Rime speech

---

Qdrant Knowledge Base

The prototype uses a small synthetic interview-preparation dataset.

The collection can be initialized using:

cd backend
npm run seed

The retrieval endpoint can be tested with:

POST /api/interview/search

The retrieved context is then used by the interview response flow.

---

Validation

The project has been validated using the following checks.

Backend

cd backend
npm run typecheck
npm run build

Frontend

cd frontend
npm run lint
npm run build

End-to-End Flow

The local end-to-end pipeline has been tested as:

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

---

Security and Data

- API keys remain server-side.
- ".env" files are Git-ignored.
- ".env.example" contains no secrets.
- Provider keys are not exposed through "NEXT_PUBLIC_*" variables.
- The interview knowledge dataset is synthetic.
- No real sensitive user information is required for the demonstration.

---

Limitations

Continuum is a working prototype rather than a production multi-user system.

Current limitations include:

- Interview practice is the primary demonstrated use case.
- Continuity state is currently maintained through browser localStorage.
- The current Qdrant dataset is a small synthetic interview-preparation knowledge base.
- The prototype does not provide account-based persistent memory.
- The current system is not designed for production-scale concurrent users.
- The project does not claim model-internal continual learning.
- Performance measurements are based on the final tested prototype configuration and should not be interpreted as production-scale benchmarks.

---

Future Vision

Continuum's long-term vision is to make continuity useful across more meaningful, long-running interactions.

One potential future direction is mental-wellbeing support.

People can have recurring conversations around stress, loneliness, motivation, personal goals, or difficult periods in their lives. A future version of Continuum could allow users to return to these conversations without having to repeatedly explain their situation from the beginning.

For example:

Previous conversation
        ↓
Important context identified
        ↓
User returns later
        ↓
Relevant context retrieved
        ↓
Conversation continues naturally

The goal would not be to replace professional mental-health care or make clinical decisions. Instead, Continuum could explore how user-controlled conversational continuity can make supportive AI interactions feel less repetitive and more coherent over time.

A future implementation could explore:

- Long-term conversational memory
- User-controlled memory and deletion
- Context relevance and memory expiration
- Voice-based check-ins
- Personal goals and recurring topics
- Retrieval of only the context relevant to the current conversation
- Strong privacy and consent controls
- Clear boundaries and escalation to appropriate human or professional support when necessary

This direction is intentionally future-facing. The current Continuum prototype is an interview-practice application and should not be interpreted as a mental-health product or clinical system.

---

Repository Structure

frontend/     Next.js / React application
backend/      Node.js / TypeScript API
shared/       Shared TypeScript contracts
docs/
  architecture.png
  screenshots/

---

Team Contributions

Ujjwal

- Frontend development
- Voice interaction interface
- Application integration
- Repository and deployment work
- Demo and presentation 

Dhruvansh Tripathi

- Backend and system workflow
- Qdrant/retrieval work
- Technical research
- Testing and validation
- Presentation

Team Member 3

- Product research and problem framing
- Documentation and presentation
- Testing and evaluation
- Project coordination

---

Credits

Continuum was built using technologies and guidance from the StarForge partner ecosystem.

- Pathway — Title Partner
- Rime — Voice Models Partner
- Weya AI — Platinum Partner
- Qdrant — Vector Search Partner

Weya AI was used as a production voice-agent and workflow perspective; it is not a required runtime dependency of the current prototype.

---

Acknowledgements

The project follows the VoxForge requirements around essential voice interaction, meaningful Qdrant usage, reproducible implementation, and measurable proof.

The project also follows the distinction between application-level memory and retrieval and model-internal continual learning described in the StarForge problem statement.

---

Current Scope

Continuum currently demonstrates one focused problem:

«How can a voice interaction resume with useful context instead of forcing the user to start from zero?»

Interview practice is the current demonstration environment.

Future versions could extend the same continuity architecture to additional unfinished tasks, persistent user accounts, richer memory policies, cross-channel continuity, and larger-scale evaluation.