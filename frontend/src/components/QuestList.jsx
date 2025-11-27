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
                            className={`act-header ${actUnlocked ? 'unlocked' : 'locked'}`}
                        >
                            <span onClick={() => toggleAct(act.id)} style={{ flex: 1 }}>
                                {act.title}
                                {!actUnlocked && ' 🔒'}
                            </span>

                            {editMode && (
                                <div className="act-controls">
                                    <button
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            onEditAct(act.id, 'edit');
                                        }}
                                        className="icon-btn"
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
                                        className="icon-btn"
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

                                    let itemClass = 'quest-item';
                                    if (isSelected) itemClass += ' selected';
                                    if (completed) itemClass += ' completed';
                                    if (!actUnlocked) itemClass += ' locked';

                                    return (
                                        <div
                                            key={quest.id}
                                            className={itemClass}
                                        >
                                            <span
                                                onClick={() => onSelect(quest.id)}
                                                className={`quest-marker ${completed ? 'completed' : ''}`}
                                            >
                                                {completed ? '◆' : '◇'}
                                            </span>
                                            <span onClick={() => onSelect(quest.id)} style={{ flex: 1 }}>
                                                {quest.title}
                                            </span>

                                            {editMode && (
                                                <div className="quest-controls">
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            onEditQuest(act.id, quest.id, 'edit');
                                                        }}
                                                        className="icon-btn"
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
                                                        className="icon-btn"
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
                                        className="add-item-button"
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
                                className="add-act-button"
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
