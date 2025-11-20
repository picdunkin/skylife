import React from 'react';
import { ACTS } from '../data/quests';
import { useGame } from '../context/GameContext';
import MetricInput from './MetricInput';
import { playSound } from '../utils/sounds';

const QuestDetail = ({ questId, onBack }) => {
    const { gameState, toggleObjective, updateMetric, completeQuest, isActUnlocked } = useGame();

    // Find the quest data and its act
    let quest = null;
    let questAct = null;
    for (const act of ACTS) {
        const found = act.quests.find(q => q.id === questId);
        if (found) {
            quest = found;
            questAct = act;
            break;
        }
    }

    if (!quest) return <div>Квест не найден</div>;

    const isCompleted = gameState.completedQuestIds.includes(questId);
    const actUnlocked = isActUnlocked(questAct.id);

    return (
        <div className="quest-detail">
            <button
                className="mobile-back-btn"
                onClick={onBack}
                style={{ display: 'none', marginBottom: '20px' }} // Hidden by default, shown via CSS media query if needed
            >
                ← НАЗАД
            </button>

            {!actUnlocked && (
                <div style={{
                    padding: '10px 20px',
                    background: 'rgba(255, 100, 100, 0.1)',
                    border: '1px solid #555',
                    borderRadius: '4px',
                    marginBottom: '20px',
                    color: '#888',
                    textAlign: 'center'
                }}>
                    🔒 Этот акт заблокирован. Завершите все квесты предыдущего акта.
                </div>
            )}

            <h1 style={{ color: isCompleted ? '#cda869' : (actUnlocked ? '#fff' : '#666') }}>
                {quest.title} {isCompleted && ' (ВЫПОЛНЕН)'}
            </h1>

            <p style={{
                fontFamily: "var(--font-hand)",
                fontSize: '1.1rem',
                color: actUnlocked ? '#ccc' : '#666',
                fontStyle: 'italic',
                marginBottom: '30px',
                lineHeight: '1.6'
            }}>
                {quest.description}
            </p>

            <div className="objectives-section" style={{ marginBottom: '30px' }}>
                <h2>ЗАДАЧИ</h2>

                {/* Boolean Objectives */}
                {quest.objectives.map(obj => {
                    const isChecked = gameState.objectives[obj.id] || false;
                    return (
                        <div
                            key={obj.id}
                            className="objective-item"
                            onClick={() => {
                                if (actUnlocked) {
                                    playSound('checkbox');
                                    toggleObjective(obj.id);
                                }
                            }}
                            style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '10px',
                                marginBottom: '10px',
                                cursor: actUnlocked ? 'pointer' : 'not-allowed',
                                opacity: isChecked ? 0.6 : (actUnlocked ? 1 : 0.3)
                            }}
                        >
                            <div style={{
                                width: '16px',
                                height: '16px',
                                minWidth: '16px',
                                border: `1px solid ${actUnlocked ? '#cda869' : '#555'}`,
                                background: isChecked ? (actUnlocked ? '#cda869' : '#555') : 'transparent',
                                display: 'flex', alignItems: 'center', justifyContent: 'center'
                            }}>
                                {isChecked && <span style={{ color: '#000', fontSize: '12px' }}>✓</span>}
                            </div>
                            <span style={{
                                textDecoration: isChecked ? 'line-through' : 'none',
                                wordWrap: 'break-word',
                                overflowWrap: 'break-word',
                                flex: 1
                            }}>{obj.text}</span>
                        </div>
                    );
                })}

                {/* Metrics */}
                {quest.metrics.length > 0 && (
                    <div style={{ marginTop: '20px' }}>
                        {quest.metrics.map(metric => (
                            <MetricInput
                                key={metric.id}
                                metric={metric}
                                currentValue={gameState.metrics[metric.id] || 0}
                                onUpdate={(val) => actUnlocked && updateMetric(metric.id, val)}
                                disabled={!actUnlocked}
                            />
                        ))}
                    </div>
                )}
            </div>

            <div className="rewards-section" style={{ marginBottom: '40px' }}>
                <h2>НАГРАДЫ</h2>
                <ul style={{ listStyle: 'none', padding: 0 }}>
                    {quest.rewards.map((reward, idx) => (
                        <li key={idx} style={{ marginBottom: '5px', color: actUnlocked ? '#eecfa1' : '#666' }}>
                            ✦ {reward}
                        </li>
                    ))}
                </ul>
            </div>

            <div className="actions-section">
                {!isCompleted ? (
                    <button
                        onClick={() => actUnlocked && completeQuest(questId)}
                        disabled={!actUnlocked}
                        style={{
                            width: '100%',
                            padding: '15px',
                            fontSize: '1.2rem',
                            border: `2px solid ${actUnlocked ? '#cda869' : '#555'}`,
                            background: actUnlocked ? 'rgba(205, 168, 105, 0.1)' : 'rgba(50, 50, 50, 0.1)',
                            cursor: actUnlocked ? 'pointer' : 'not-allowed',
                            opacity: actUnlocked ? 1 : 0.5
                        }}
                    >
                        ЗАВЕРШИТЬ КВЕСТ
                    </button>
                ) : (
                    <div style={{
                        textAlign: 'center',
                        padding: '20px',
                        border: '1px solid #444',
                        color: '#888'
                    }}>
                        КВЕСТ ВЫПОЛНЕН
                    </div>
                )}
            </div>

            {/* Mobile Back Button Style Injection */}
            <style>{`
        @media (max-width: 768px) {
          .mobile-back-btn { display: block !important; }
        }
      `}</style>
        </div>
    );
};

export default QuestDetail;
