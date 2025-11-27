import React, { useState } from 'react';
import SkyrimLayout from './components/SkyrimLayout';
import { useGame } from './context/GameContext';

function App() {
  const { user, loading, login } = useGame();
  const [isLoggingIn, setIsLoggingIn] = useState(false);

  const handleLogin = async () => {
    setIsLoggingIn(true);
    try {
      await login();
    } catch (error) {
      // Error already handled in GameContext
    } finally {
      setIsLoggingIn(false);
    }
  };

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
          onClick={handleLogin}
          disabled={isLoggingIn}
          style={{
            fontSize: '1.5rem',
            padding: '15px 40px',
            border: '2px solid #cda869',
            background: 'rgba(0,0,0,0.8)',
            opacity: isLoggingIn ? 0.6 : 1,
            cursor: isLoggingIn ? 'wait' : 'pointer'
          }}
        >
          {isLoggingIn ? 'ЗАГРУЗКА...' : 'НАЧАТЬ НОВУЮ ИГРУ'}
        </button>
        <p style={{ marginTop: '20px', color: '#888' }}>(Вход через Google)</p>
        {isLoggingIn && (
          <p style={{ marginTop: '10px', color: '#cda869', fontSize: '0.9rem' }}>
            Откройте всплывающее окно для авторизации...
          </p>
        )}
      </div>
    );
  }

  return <SkyrimLayout />;
}

export default App;
