# SkyLife - Gamified Life Management

A Skyrim-themed gamification app for personal productivity and life management.

## Architecture

Monorepo with microservices architecture:

```
skylife/
├── frontend/          # React + Vite
├── services/
│   ├── gateway/       # Nginx API Gateway
│   ├── auth/          # Laravel - Google OAuth
│   ├── quests/        # Laravel - Quests & Acts
│   ├── skills/        # Laravel - Skills & Checkins
│   ├── users/         # Laravel - User profiles & levels
│   └── ai/            # Laravel - AI characters & dialogues
└── shared/
    └── api-specs/     # OpenAPI specifications
```

## Quick Start

### Prerequisites
- Docker & Docker Compose
- Node.js 20+ (for local frontend development)

### Development

1. Copy environment variables:
```bash
cp .env.example .env
# Edit .env with your values
```

2. Start all services:
```bash
docker-compose up -d
```

3. Access:
   - Frontend: http://localhost:3000
   - API Gateway: http://localhost:8080
   - MySQL: localhost:3306
   - Redis: localhost:6379

### Frontend Only (without Docker)
```bash
cd frontend
npm install
npm run dev
```

### Creating Laravel Services

Each service needs to be initialized with Laravel:

```bash
# Example for auth service
cd services/auth
composer create-project laravel/laravel . --prefer-dist
```

## Services

| Service | Port | Description |
|---------|------|-------------|
| frontend | 3000 | React SPA |
| gateway | 8080 | API Gateway (Nginx) |
| auth | - | Authentication (Google OAuth) |
| quests | - | Quests, Acts, Sidequests |
| skills | - | Skills, Checkins, Levels |
| users | - | User profiles, XP, Septims |
| ai | - | AI characters, Dialogues |
| mysql | 3306 | Database |
| redis | 6379 | Cache & Sessions |

## Features!!!

- 🎮 **Skyrim-style UI** - Dark, atmospheric interface with gold accents
- 🔒 **Progressive Quest System** - Acts unlock sequentially as you complete quests
- 📊 **Metric Tracking** - Track progress with limited and unlimited metrics
- 🔊 **Sound Effects** - Immersive audio feedback for actions
- 💾 **Cloud Sync** - Firebase authentication and Firestore persistence
- 📱 **Mobile Responsive** - Works on desktop and mobile devices

## Sound Effects

The app includes three sound effects:
- **Checkbox** (`/assets/sounds/checkbox.mp3`) - Plays when toggling objectives
- **Metrics Change** (`/assets/sounds/metics-change.mp3`) - Plays when updating metrics
- **Quest Done** (`/assets/sounds/quest-done.mp3`) - Plays when completing a quest

## Setup

1. **Install dependencies**:
   ```bash
   npm install
   ```

2. **Configure Firebase**:
   - Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
   - Enable Authentication (Google Sign-In)
   - Enable Firestore Database
   - Copy `.env.example` to `.env` and add your Firebase config

3. **Run development server**:
   ```bash
   npm run dev
   ```

4. **Build for production**:
   ```bash
   npm run build
   ```

## Project Structure

```
src/
├── components/       # React components
│   ├── SkyrimLayout.jsx
│   ├── QuestList.jsx
│   ├── QuestDetail.jsx
│   └── MetricInput.jsx
├── context/         # React Context (GameContext)
├── data/           # Quest configuration
├── styles/         # CSS files
├── utils/          # Utilities (sound player)
└── firebase.js     # Firebase config

public/
└── assets/
    └── sounds/     # Sound effects
```

## Customization

### Adding Custom Fonts
Place font files in `src/assets/fonts/` and update `src/styles/skyrim.css`:
```css
@font-face {
  font-family: 'SkyrimHeader';
  src: url('/src/assets/fonts/YourFont.ttf');
}
```

### Adding Background
Place a `fog-overlay.png` in the `public/` folder for the foggy background effect.

## License

MIT
