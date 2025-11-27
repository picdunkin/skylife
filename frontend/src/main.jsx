import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './styles/skyrim.css'
import App from './App.jsx'
import { GameProvider } from './context/GameContext'
import { NotificationProvider } from './context/NotificationContext'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <NotificationProvider>
      <GameProvider>
        <App />
      </GameProvider>
    </NotificationProvider>
  </StrictMode>,
)
