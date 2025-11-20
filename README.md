# Skylife - Gamification Dashboard

Skyrim-themed personal quest tracker with Firebase integration.

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
