import React, { useState } from 'react';
import { useGame } from '../context/GameContext';

const QuestList = ({ onSelect, selectedId, onEditAct, onEditQuest }) => {
    const { gameState, isActUnlocked, editMode } = useGame();
    const [expandedActs, setExpandedActs] = useState(gameState.acts.map(a => a.id)); // All expanded by default

    const toggleAct = (actId) => {
        setExpandedActs(prev =>
            prev.includes(actId) ? prev.filter(id => id !== actId) : [...prev, actId]
        );
    };

    const isQuestCompleted = (questId) => gameState.completedQuestIds.includes(questId);

    return (
        <div className="quest-list">
            {gameState.acts.map((act, actIndex) => {
                const actUnlocked = isActUnlocked(act.id);

                return (
                    <div key={act.id} className="act-group">
                        <div
                            className="act-header"
                            style={{
                                padding: '10px 20px',
                                cursor: 'pointer',
                                color: actUnlocked ? '#cda869' : '#555',
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                background: 'rgba(255,255,255,0.05)',
                                marginBottom: '2px',
                                opacity: actUnlocked ? 1 : 0.5
                            }}
                        >
                            <span onClick={() => toggleAct(act.id)} style={{ flex: 1 }}>
                                {act.title}
                                {!actUnlocked && ' 🔒'}
                            </span>

                            {editMode && (
                                <div style={{ display: 'flex', gap: '8px', marginRight: '10px' }}>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onEditAct(act.id, 'edit');
                                        }}
                                        style={{
                                            background: 'transparent',
                                            border: 'none',
                                            cursor: 'pointer',
                                            fontSize: '1rem',
                                            opacity: 0.7
                                        }}
                                        title="Редактировать акт"
                                    >
                                        ✏️
                                    </button>
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            if (confirm(`Удалить акт "${act.title}"?`)) {
                                                onEditAct(act.id, 'delete');
                                            }
                                        }}
                                        style={{
                                            background: 'transparent',
                                            border: 'none',
                                            cursor: 'pointer',
                                            fontSize: '1rem',
                                            opacity: 0.7
                                        }}
                                        title="Удалить акт"
                                    >
                                        🗑️
                                    </button>
                                </div>
                            )}

                            <span
                                onClick={() => toggleAct(act.id)}
                                style={{ fontSize: '0.8rem', opacity: 0.7 }}
                            >
                                {expandedActs.includes(act.id) ? '▼' : '▶'}
                            </span>
                        </div>

                        {expandedActs.includes(act.id) && (
                            <div className="act-quests">
                                {act.quests.map(quest => {
                                    const completed = isQuestCompleted(quest.id);
                                    const isSelected = selectedId === quest.id;

                                    return (
                                        <div
                                            key={quest.id}
                                            style={{
                                                padding: '12px 30px',
                                                cursor: 'pointer',
                                                color: isSelected ? '#fff' : (completed ? '#888' : (actUnlocked ? '#ccc' : '#555')),
                                                background: isSelected ? 'rgba(205, 168, 105, 0.1)' : 'transparent',
                                                borderLeft: isSelected ? '4px solid #cda869' : '4px solid transparent',
                                                display: 'flex',
                                                alignItems: 'center',
                                                gap: '10px',
                                                opacity: actUnlocked ? 1 : 0.4
                                            }}
                                        >
                                            <span
                                                onClick={() => onSelect(quest.id)}
                                                style={{
                                                    color: completed ? '#cda869' : (actUnlocked ? '#444' : '#333'),
                                                    fontSize: '1.2rem',
                                                    flex: 'none'
                                                }}
                                            >
                                                {completed ? '◆' : '◇'}
                                            </span>
                                            <span onClick={() => onSelect(quest.id)} style={{ flex: 1 }}>
                                                {quest.title}
                                            </span>

                                            {editMode && (
                                                <div style={{ display: 'flex', gap: '8px' }}>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            onEditQuest(act.id, quest.id, 'edit');
                                                        }}
                                                        style={{
                                                            background: 'transparent',
                                                            border: 'none',
                                                            cursor: 'pointer',
                                                            fontSize: '0.9rem',
                                                            opacity: 0.6
                                                        }}
                                                        title="Редактировать квест"
                                                    >
                                                        ✏️
                                                    </button>
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            if (confirm(`Удалить квест "${quest.title}"?`)) {
                                                                onEditQuest(act.id, quest.id, 'delete');
                                                            }
                                                        }}
                                                        style={{
                                                            background: 'transparent',
                                                            border: 'none',
                                                            cursor: 'pointer',
                                                            fontSize: '0.9rem',
                                                            opacity: 0.6
                                                        }}
                                                        title="Удалить квест"
                                                    >
                                                        🗑️
                                                    </button>
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}

                                {editMode && (
                                    <div
                                        onClick={() => onEditQuest(act.id, null, 'add')}
                                        style={{
                                            padding: '12px 30px',
                                            cursor: 'pointer',
                                            color: '#888',
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '10px',
                                            fontStyle: 'italic',
                                            opacity: 0.7
                                        }}
                                    >
                                        <span style={{ fontSize: '1.2rem' }}>➕</span>
                                        <span>Добавить квест</span>
                                    </div>
                                )}
                            </div>
                        )}

                        {editMode && actIndex === gameState.acts.length - 1 && (
                            <div
                                onClick={() => onEditAct(null, 'add')}
                                style={{
                                    padding: '10px 20px',
                                    cursor: 'pointer',
                                    color: '#888',
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: '10px',
                                    background: 'rgba(255,255,255,0.03)',
                                    marginTop: '2px',
                                    fontStyle: 'italic',
                                    opacity: 0.7
                                }}
                            >
                                <span style={{ fontSize: '1.2rem' }}>➕</span>
                                <span>Добавить акт</span>
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default QuestList;
