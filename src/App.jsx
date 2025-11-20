import React from 'react';
import SkyrimLayout from './components/SkyrimLayout';
import { useGame } from './context/GameContext';

function App() {
  const { user, loading, login } = useGame();

  if (loading) {
    return (
      <div style={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        background: '#000'
      }}>
        Загрузка...
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'url(/fog-overlay.png), #000',
        backgroundSize: 'cover'
      }}>
        <h1 style={{ fontSize: '4rem', marginBottom: '2rem', textShadow: '0 0 10px #000' }}>SKYLIFE</h1>
        <button
          onClick={login}
          style={{
            fontSize: '1.5rem',
            padding: '15px 40px',
            border: '2px solid #cda869',
            background: 'rgba(0,0,0,0.8)'
          }}
        >
          НАЧАТЬ НОВУЮ ИГРУ
        </button>
        <p style={{ marginTop: '20px', color: '#888' }}>(Вход через Google)</p>
      </div>
    );
  }

  return <SkyrimLayout />;
}

export default App;
