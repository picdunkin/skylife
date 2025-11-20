import React, { useState } from 'react';
import { ACTS } from '../data/quests';
import { useGame } from '../context/GameContext';

const QuestList = ({ onSelect, selectedId }) => {
    const { gameState, isActUnlocked } = useGame();
    const [expandedActs, setExpandedActs] = useState(ACTS.map(a => a.id)); // All expanded by default

    const toggleAct = (actId) => {
        setExpandedActs(prev =>
            prev.includes(actId) ? prev.filter(id => id !== actId) : [...prev, actId]
        );
    };

    const isQuestCompleted = (questId) => gameState.completedQuestIds.includes(questId);

    return (
        <div className="quest-list">
            {ACTS.map(act => {
                const actUnlocked = isActUnlocked(act.id);

                return (
                    <div key={act.id} className="act-group">
                        <div
                            className="act-header"
                            onClick={() => toggleAct(act.id)}
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
                            <span>
                                {act.title}
                                {!actUnlocked && ' 🔒'}
                            </span>
                            <span style={{ fontSize: '0.8rem', opacity: 0.7 }}>{expandedActs.includes(act.id) ? '▼' : '▶'}</span>
                        </div>

                        {expandedActs.includes(act.id) && (
                            <div className="act-quests">
                                {act.quests.map(quest => {
                                    const completed = isQuestCompleted(quest.id);
                                    const isSelected = selectedId === quest.id;

                                    return (
                                        <div
                                            key={quest.id}
                                            onClick={() => onSelect(quest.id)}
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
                                            <span style={{ color: completed ? '#cda869' : (actUnlocked ? '#444' : '#333'), fontSize: '1.2rem' }}>
                                                {completed ? '◆' : '◇'}
                                            </span>
                                            <span>{quest.title}</span>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
};

export default QuestList;
