import React from 'react';
import { useGame } from '../context/GameContext';

const SkillsList = ({ onSelect, selectedId, onEditSkill }) => {
    const { gameState, editMode } = useGame();
    const skills = gameState.skills || [];

    const getWeeklyProgress = (history) => {
        const getMonday = (d) => {
            d = new Date(d);
            const day = d.getDay(),
                diff = d.getDate() - day + (day === 0 ? -6 : 1);
            return new Date(d.setDate(diff));
        };
        const monday = getMonday(new Date());
        monday.setHours(0, 0, 0, 0);

        const thisWeekCheckIns = (history || []).filter(h => new Date(h.date) >= monday);

        // Map check-ins to days of week (0-6, Mon-Sun)
        const days = [false, false, false, false, false, false, false];
        thisWeekCheckIns.forEach(h => {
            const date = new Date(h.date);
            let dayIndex = date.getDay() - 1; // Mon=0, Sun=6
            if (dayIndex === -1) dayIndex = 6; // Sunday correction
            if (dayIndex >= 0 && dayIndex < 7) {
                days[dayIndex] = true;
            }
        });
        return days;
    };

    return (
        <div className="skills-list" style={{ padding: '10px' }}>
            <style>{`
                .skill-item {
                    padding: 10px;
                    margin-bottom: 10px;
                    background: rgba(255, 255, 255, 0.05);
                    border: 1px solid transparent;
                    cursor: pointer;
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }
                @media (max-width: 768px) {
                    .skill-item {
                        padding: 15px; /* Increased padding for mobile */
                        margin-bottom: 15px;
                    }
                }
            `}</style>
            {skills.map(skill => {
                const isSelected = selectedId === skill.id;
                const progress = getWeeklyProgress(skill.history);

                return (
                    <div
                        key={skill.id}
                        onClick={() => onSelect(skill.id)}
                        className="skill-item"
                        style={{
                            background: isSelected ? 'rgba(205, 168, 105, 0.1)' : 'rgba(255, 255, 255, 0.05)',
                            border: isSelected ? '1px solid #cda869' : '1px solid transparent',
                        }}
                    >
                        <div style={{ flex: 1 }}>
                            <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#fff' }}>
                                {skill.title}
                            </div>
                            <div style={{ display: 'flex', gap: '5px', marginTop: '5px' }}>
                                {['ПН', 'ВТ', 'СР', 'ЧТ', 'ПТ', 'СБ', 'ВС'].map((day, index) => (
                                    <div key={index} style={{
                                        fontSize: '0.6rem',
                                        color: progress[index] ? '#cda869' : '#555',
                                        width: '20px',
                                        textAlign: 'center'
                                    }}>
                                        <div style={{ marginBottom: '2px' }}>{day}</div>
                                        <div style={{
                                            height: '4px',
                                            background: progress[index] ? '#cda869' : '#333'
                                        }} />
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div style={{
                            background: '#000',
                            padding: '5px 10px',
                            border: '1px solid #333',
                            color: '#cda869',
                            fontSize: '0.9rem',
                            fontWeight: 'bold',
                            minWidth: '80px',
                            textAlign: 'center'
                        }}>
                            LEVEL {skill.level}
                        </div>

                        {editMode && (
                            <div style={{ display: 'flex', flexDirection: 'column', gap: '5px', marginLeft: '10px' }}>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        onEditSkill(skill.id, 'edit');
                                    }}
                                    style={{ background: 'none', border: 'none', cursor: 'pointer', opacity: 0.7 }}
                                >
                                    ✏️
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        if (confirm(`Удалить навык "${skill.title}"?`)) {
                                            onEditSkill(skill.id, 'delete');
                                        }
                                    }}
                                    style={{ background: 'none', border: 'none', cursor: 'pointer', opacity: 0.7 }}
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
                    onClick={() => onEditSkill(null, 'add')}
                    style={{
                        padding: '15px',
                        marginTop: '10px',
                        border: '1px dashed #555',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        gap: '10px',
                        color: '#888'
                    }}
                >
                    <span style={{ fontSize: '1.2rem' }}>➕</span>
                    <span>Добавить навык</span>
                </div>
            )}
        </div>
    );
};

export default SkillsList;
