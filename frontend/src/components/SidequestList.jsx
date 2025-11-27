import React, { useState } from 'react';
import { useGame } from '../context/GameContext';

const SidequestList = () => {
    const { gameState, addSidequest, toggleSidequest, deleteSidequest } = useGame();
    const [newQuestTitle, setNewQuestTitle] = useState('');

    const handleAdd = (e) => {
        e.preventDefault();
        if (newQuestTitle.trim()) {
            addSidequest(newQuestTitle.trim());
            setNewQuestTitle('');
        }
    };

    return (
        <div className="quest-list">
            <div className="add-sidequest-container" style={{
                padding: '15px',
                borderBottom: '1px solid rgba(255,255,255,0.1)',
                marginBottom: '10px'
            }}>
                <form onSubmit={handleAdd} style={{ display: 'flex', gap: '10px' }}>
                    <input
                        type="text"
                        value={newQuestTitle}
                        onChange={(e) => setNewQuestTitle(e.target.value)}
                        placeholder="Добавить новую задачу..."
                        style={{
                            flex: 1,
                            background: 'rgba(0, 0, 0, 0.5)',
                            border: '1px solid #555',
                            color: '#fff',
                            padding: '8px 12px',
                            fontFamily: 'inherit',
                            fontSize: '1.2rem'
                        }}
                    />
                    <button
                        type="submit"
                        disabled={!newQuestTitle.trim()}
                        style={{
                            background: 'none',
                            border: '1px solid #cda869',
                            color: '#cda869',
                            padding: '8px 15px',
                            cursor: 'pointer',
                            fontSize: '1.1rem',
                            opacity: newQuestTitle.trim() ? 1 : 0.5
                        }}
                    >
                        ДОБАВИТЬ
                    </button>
                </form>
            </div>

            <div className="sidequest-items">
                {(gameState.sidequests || []).length === 0 && (
                    <div style={{ padding: '20px', textAlign: 'center', color: '#888', fontStyle: 'italic' }}>
                        Список задач пуст...
                    </div>
                )}

                {[...(gameState.sidequests || [])].reverse().map(quest => (
                    <div
                        key={quest.id}
                        className={`quest-item ${quest.completed ? 'completed' : ''}`}
                        style={{ display: 'flex', alignItems: 'center', padding: '10px 15px' }}
                    >
                        <span
                            onClick={() => toggleSidequest(quest.id)}
                            className={`quest-marker ${quest.completed ? 'completed' : ''}`}
                            style={{ cursor: 'pointer', marginRight: '10px' }}
                        >
                            {quest.completed ? '◆' : '◇'}
                        </span>
                        <span
                            onClick={() => toggleSidequest(quest.id)}
                            style={{
                                flex: 1,
                                cursor: 'pointer',
                                textDecoration: quest.completed ? 'line-through' : 'none',
                                color: quest.completed ? '#888' : '#fff'
                            }}
                        >
                            {quest.title}
                        </span>
                        <button
                            onClick={() => deleteSidequest(quest.id)}
                            className="icon-btn"
                            title="Удалить задачу"
                            style={{ opacity: 0.5, marginLeft: '10px' }}
                        >
                            🗑️
                        </button>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default SidequestList;
