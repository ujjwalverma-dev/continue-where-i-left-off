# Binary Brains Repository Guide

## Project and Current Phase

This repository is the shared source of truth for Binary Brains' **Continue Where I Left Off** project for StarForge 2026 (VoxForge).

The project is currently in the **neutral frontend-prototype phase**. The target user and narrow use case are not final. Keep product language and prototype work generic enough to change direction without a rewrite.

Do not begin backend, voice, retrieval, authentication, or production infrastructure work until the team has made and documented the relevant decisions.

## Repository Areas

- `frontend/` contains the Next.js App Router frontend, React UI, frontend state, and prototype mock data.
- `backend/` is reserved for a future backend/API, voice orchestration, Rime, Qdrant, task-state logic, and backend tests. Do not select a backend framework or add implementation here without an explicit team decision.
- `shared/` is reserved for TypeScript contracts, schemas, or constants that are genuinely required by both frontend and backend. Do not use it as a general utilities folder.
- `docs/` contains product research, architecture decisions, API contracts, technical research, demo notes, evaluation/proof, and hackathon submission material.

Keep boundaries clear so teammates can work in parallel. Do not create separate applications or unrelated repository structures for individual roles.

## Frontend Prototype Rules

- Use TypeScript with strict typing; avoid unnecessary `any`.
- The intended frontend stack is Next.js, React, TypeScript, App Router, and Tailwind CSS.
- Until integration is deliberately designed, use isolated mock data and keep it separate from presentational components.
- Prefer a clear flow: UI components -> application/state logic -> data-access layer -> mock data. Later, the data-access layer may connect to the backend.
- Do not implement Rime, Qdrant, backend functionality, API routes, authentication, secrets, or undocumented API contracts during this phase.
- Do not present mock behavior as completed AI, voice, retrieval, or production functionality.

## Future Integration Rules

The eventual product must be a useful voice-first task-continuity experience, not a text chatbot with a microphone attached. Rime-generated speech and Qdrant retrieval must each have a meaningful role in the final interaction.

Before frontend/backend integration, document and agree on endpoint names, methods, request/response/error schemas, identifiers, authentication, streaming, audio flow, task-state semantics, and retrieval semantics. Add shared types only after those contracts are agreed.

The backend architecture, target user, persistence, authentication, API shape, Rime/Qdrant design, and production challenge are intentionally undecided. Do not infer or lock them in without an explicit decision.

## Collaboration and Git

- Treat `main` as the stable integrated project. Use focused feature branches and pull requests for significant integrations.
- Do not push, commit, or rewrite unrelated work unless explicitly requested.
- Do not assume two people or AI agents can safely edit the same files at once. Prefer clear area ownership and focused changes.
- Before cross-area changes, inspect the current implementation and established interfaces; preserve teammates' work and documented contracts.
- Before a large architectural change, explain the proposal and why it is needed.

## AI-Assisted Work

All AI tools must work within this repository and follow this guide. They must not replace the chosen frontend stack, silently rename major directories, invent backend contracts, add unnecessary dependencies, or remove another teammate's implementation without justification.

Keep generated code understandable enough for the team to explain to hackathon judges. Prefer readable, maintainable code with small, sensible component and module boundaries over premature abstraction or generated complexity.

## Quality, Security, and Documentation

- Make minimal, scoped changes; do not rewrite unrelated files.
- Check whether the existing stack can solve a problem before adding a dependency.
- Run relevant lint, typecheck, build, or tests after meaningful implementation work; do not run application checks when no application exists.
- Never commit API keys, tokens, passwords, private keys, `.env` files with secrets, or sensitive personal information. Use environment variables and only commit a sanitized `.env.example` when needed.
- Use synthetic or de-identified data for any future sensitive workflow.
- Keep project documentation accurate. Do not claim completed integrations, benchmarks, evaluations, or proof that do not exist.

