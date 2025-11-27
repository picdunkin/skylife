# SkyLife Architecture

This document describes the planned architecture of the SkyLife monorepo, including frontend, backend services, and infrastructure.

## 1. Monorepo Layout

- `frontend/`
  - React + Vite SPA
  - Integrates with Firebase (Auth + Firestore)
  - Talks to backend via API Gateway (`/api/...`)
- `services/`
  - `auth/` – Laravel, authentication & OAuth integration
  - `quests/` – Laravel, quest & acts domain logic
  - `skills/` – Laravel, skills & check-ins domain logic
  - `users/` – Laravel, user profile, XP, Septims
  - `ai/` – Laravel, AI characters & dialog orchestration
  - `gateway/` – Nginx config for routing `/api/*` to services
- `shared/api-specs/`
  - API definitions (OpenAPI/Swagger) for inter-service and frontend contracts

## 2. Frontend (React + Vite)

- Built into static assets served by Nginx in production container.
- Dev mode uses Vite dev server with hot reload.
- Reads configuration from `VITE_...` env variables (e.g. Firebase config, `VITE_API_URL`).

## 3. Backend Services (Laravel)

Each Laravel service is an independent application with its own database schema and responsibilities.

### Auth Service

- Google OAuth 2.0 login.
- Token issuance for other services (planned).
- Bridges Firebase Auth and internal user system (planned).

### Quests Service

- Manages Acts, Quests, Objectives.
- Provides APIs to list, create, update, and complete quests.
- Calculates and returns XP & currency rewards for quest completion.

### Skills Service

- Manages Skills and Skill Levels.
- Handles skill check-ins and weekly goals.
- Computes XP gain per check-in, skill level thresholds.

### Users Service

- Central user profile store (XP, level, Septims, preferences).
- Aggregates data from quests and skills.
- Exposes profile and stats to frontend and AI.

### AI Service

- Coordinates AI NPCs and dialogue flows.
- Integrates with external LLM APIs (e.g. OpenAI) using `OPENAI_API_KEY`.
- Uses user/quest/skill context to generate in-world conversations.

## 4. Infrastructure

### Docker / Docker Compose

- `docker-compose.yml`
  - Defines all services: Gateway, Frontend, and 5 Laravel microservices.
  - Production-style configuration (Nginx + PHP-FPM + built frontend).
- `docker-compose.dev.yml`
  - Overrides for development (Vite dev server, volume mounts for Laravel code, `APP_DEBUG=true`).

Core services:

- **Firebase Firestore**
  - Single NoSQL database for all data.
  - Each Laravel service connects via Firebase Admin SDK.
  - No local database containers needed.
- **Gateway (Nginx)**
  - Routes `/api/auth`, `/api/quests`, `/api/skills`, `/api/users`, `/api/ai`, etc.
  - Handles CORS and basic reverse proxying.

## 5. Environment & Config

- Root `.env`
  - `FIREBASE_PROJECT_ID`, `GOOGLE_CLIENT_ID`, `GOOGLE_CLIENT_SECRET`, `OPENAI_API_KEY`
- `frontend/.env`
  - Vite-specific vars prefixed with `VITE_...` for Firebase and API URL.
- `firebase-credentials.json`
  - Service account key for Firebase Admin SDK (mounted into containers).
- Each Laravel service
  - Reads `FIREBASE_CREDENTIALS` and `FIREBASE_PROJECT_ID` from environment.

## 6. Deployment (Planned)

Potential deployment targets:

- **Google Cloud Run**
  - Each service as an independent container.
  - Frontend served by a static host or Nginx container.
- **GKE (Google Kubernetes Engine)**
  - Compose configuration converted to Kubernetes manifests.
- **Compute Engine VM**
  - Single VM with Docker + `docker compose up -d` for simple deployments.

Future docs can refine each area:
- `docs/auth-service.md`
- `docs/quests-service.md`
- `docs/skills-service.md`
- `docs/users-service.md`
- `docs/ai-service.md`
