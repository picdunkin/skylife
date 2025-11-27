# SkyLife Project Overview

SkyLife is a Skyrim-themed gamified life management application. It helps users track goals, skills, and daily progress through a system inspired by RPG mechanics: quests, skills, levels, and in-game currency.

This document provides a high-level overview of the project, its purpose, and core user experience.

## Purpose

- Turn real-life goals and routines into an engaging RPG-like experience.
- Provide a structured way to manage long-term goals (Acts & Quests) and short-term tasks (Sidequests).
- Track skill development over time with visual feedback and levels.

## High-Level Features

- Quest system with Acts and main quests
- Skill tracking with levels and weekly targets
- Sidequests (quick tasks / todos)
- Global player level, XP, and in-game currency (Septims)
- Skyrim-inspired UI, sounds, and theming
- Firebase-based authentication and data persistence

## Technology Stack

- **Frontend**: React + Vite, styled with custom Skyrim-themed UI
- **Backend (planned)**: Multiple Laravel microservices (Auth, Quests, Skills, Users, AI)
- **Database**:
  - Frontend MVP: Firebase Firestore (NoSQL)
  - Backend: MySQL per service (skylife_auth, skylife_quests, etc.)
- **Infrastructure**:
  - Docker / Docker Compose (monorepo)
  - Nginx API Gateway
  - Redis for cache/queues

## Monorepo Structure (High Level)

- `frontend/` – React SPA, user-facing UI
- `services/` – Laravel services (auth, quests, skills, users, ai)
- `services/gateway/` – Nginx-based API gateway
- `shared/api-specs/` – API contracts (OpenAPI, etc.)
- `docs/` – Project documentation (this folder)

For more details about specific modules, see:
- `docs/features.md` – Detailed feature breakdown
- `docs/architecture.md` – Backend and infrastructure architecture
