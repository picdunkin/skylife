# SkyLife Features

This document describes the main features of the SkyLife application, organized by domain: quests, skills, sidequests, users, and AI.

## 1. Global Game Layer

- **Global Level & XP**
  - User has an overall level that increases based on XP gained from actions.
  - XP is awarded for completing quests, sidequests, and performing skill check-ins.
- **In-game Currency (Septims)**
  - Virtual currency earned alongside XP.
  - Planned usage: unlocking cosmetic items, perks, or narrative content.
- **Feedback & Immersion**
  - Sound effects for key actions (checkbox toggle, metrics change, quest completion).
  - Floating +XP and +🪙 notifications for instant feedback.

## 2. Quest System

- **Acts & Main Quests**
  - Quests are grouped into "Acts" representing major life chapters or goals.
  - Acts can be unlocked progressively (e.g., Act II after Act I completion).
- **Quest Details**
  - Title, description, objectives/steps.
  - Rewards: XP and Septims.
- **Quest Progress**
  - Mark quest as in-progress / completed.
  - Progress indicators on the main screen.
- **Management (Edit Mode)**
  - Add / edit / delete acts and quests.
  - Modal-based UI for editing content.

## 3. Skills System

- **Skills & Levels**
  - Each skill has its own XP and level progression.
  - Levels are derived from accumulated XP with configurable curves.
- **Check-ins**
  - Daily or frequent logging of practice for a given skill.
  - Each check-in can give XP and possibly Septims.
- **Weekly Targets**
  - `targetPerWeek` per skill defines desired practice frequency.
  - UI hints when the user is below target.
- **History & Analytics (planned)**
  - Timeline of check-ins per skill.
  - Visual charts of progress over time.

## 4. Sidequests (Quick Tasks)

- **Lightweight Task System**
  - Simple todo-style tasks with lower stakes than main quests.
  - Useful for ad-hoc errands or small habits.
- **Rewards**
  - XP and currency on completion.
- **CRUD**
  - Add / edit / delete sidequests.

## 5. User Profile

- **Player Stats**
  - Global level, total XP, total Septims.
  - Summary of completed quests, active skills, streaks (planned).
- **Identity & Auth**
  - Login via Google OAuth (Firebase Auth currently, Laravel Auth service planned).
  - User-specific data stored in Firestore and later mirrored into backend services.

## 6. AI Service (Planned)

- **AI NPCs (Companions / Mentors)**
  - In-world characters that interact with the user.
  - Personalized advice or encouragement based on current quests and skills.
- **Dialogues**
  - Branching or dynamic dialogs driven by AI models.
  - Context from user profile, quests, and skill progress.

## 7. UI / UX

- **Skyrim-Themed UI**
  - Dark, atmospheric palette.
  - Gold accent color for important elements (#cda869 style).
- **Responsive Layout**
  - Desktop and mobile layout adjustments.
  - Hiding non-critical side panels on mobile.
- **Navigation**
  - Main tabs/sections: Home (Quests), Skills, Sidequests.
  - Possible future sections: Profile, AI Companions, Shop.

For architecture-level details, see `docs/architecture.md`.
