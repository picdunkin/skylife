import React from 'react';
import { useGame } from '../context/GameContext';

const SkillDetail = ({ skillId, onBack }) => {
    const { gameState, checkInSkill } = useGame();
    const skill = (gameState.skills || []).find(s => s.id === skillId);

    if (!skill) return null;

    const xpToNextLevel = Math.floor(Math.pow(skill.level * 1.2, 1.5) * 100);
    const progressPercent = Math.min(100, (skill.xp / xpToNextLevel) * 100);

    const getMonday = (d) => {
        d = new Date(d);
        const day = d.getDay(),
            diff = d.getDate() - day + (day === 0 ? -6 : 1);
        return new Date(d.setDate(diff));
    };

    const monday = getMonday(new Date());
    monday.setHours(0, 0, 0, 0);
    const thisWeekCheckIns = (skill.history || []).filter(h => new Date(h.date) >= monday);
    const weeklyCount = thisWeekCheckIns.length;

    // Calculate potential XP for next check-in
    const daysDone = weeklyCount;
    const target = skill.targetPerWeek || 3;
    const baseXP = skill.level * 100;

    let nextMultiplier = 1;
    if (daysDone > 0) {
        nextMultiplier = Math.ceil((daysDone / target) * 10);
    }

    const potentialXP = baseXP * nextMultiplier;

    // Calendar Widget Logic
    const renderCalendar = () => {
        const today = new Date();
        const year = today.getFullYear();
        const month = today.getMonth();

        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const firstDayOfMonth = new Date(year, month, 1).getDay(); // 0=Sun

        // Adjust for Mon start
        const startOffset = firstDayOfMonth === 0 ? 6 : firstDayOfMonth - 1;

        const days = [];
        for (let i = 0; i < startOffset; i++) {
            days.push(<div key={`empty-${i}`} className="calendar-day empty"></div>);
        }

        for (let d = 1; d <= daysInMonth; d++) {
            // Construct local YYYY-MM-DD for the cell
            const cellDate = new Date(year, month, d);
            const cellDateStr = `${cellDate.getFullYear()}-${String(cellDate.getMonth() + 1).padStart(2, '0')}-${String(cellDate.getDate()).padStart(2, '0')}`;

            const hasCheckIn = (skill.history || []).some(h => {
                const hDate = new Date(h.date);
                const hDateStr = `${hDate.getFullYear()}-${String(hDate.getMonth() + 1).padStart(2, '0')}-${String(hDate.getDate()).padStart(2, '0')}`;
                return hDateStr === cellDateStr;
            });

            days.push(
                <div
                    key={d}
                    className={`calendar-day ${hasCheckIn ? 'active' : ''}`}
                    title={cellDateStr}
                >
                    {d}
                </div>
            );
        }

        return days;
    };

    return (
        <div className="quest-detail">
            <button
                className="mobile-back-btn"
                onClick={onBack}
                style={{ display: 'none', marginBottom: '20px' }}
            >
                ← НАЗАД
            </button>

            <h1 style={{ color: '#cda869' }}>{skill.title}</h1>

            <div style={{ fontSize: '2rem', marginBottom: '20px' }}>
                Уровень {skill.level}
            </div>

            <div className="xp-bar-container" style={{ marginBottom: '10px', background: '#333', height: '20px', width: '100%', borderRadius: '10px', overflow: 'hidden' }}>
                <div
                    className="xp-bar-fill"
                    style={{
                        width: `${progressPercent}%`,
                        height: '100%',
                        background: 'linear-gradient(90deg, #cda869, #f0e68c)',
                        transition: 'width 0.5s ease'
                    }}
                />
            </div>
            <div style={{ textAlign: 'right', color: '#888', marginBottom: '30px' }}>
                {skill.xp} / {xpToNextLevel} XP
            </div>

            <div style={{ display: 'flex', gap: '40px', flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: '300px' }}>
                    <div style={{
                        border: '1px solid #555',
                        padding: '20px',
                        borderRadius: '10px',
                        background: 'rgba(0,0,0,0.5)',
                        marginBottom: '20px'
                    }}>
                        <h3 style={{ marginTop: 0 }}>Награда в септимах</h3>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#ffd700' }}>
                            <span style={{ fontSize: '2rem' }}>💰</span>
                            <span style={{ fontSize: '1.5rem' }}>+{10 * nextMultiplier}</span>
                        </div>
                    </div>

                    <button
                        onClick={() => checkInSkill(skillId)}
                        className="action-btn"
                        style={{
                            fontSize: '1.5rem',
                            padding: '20px 40px',
                            width: '100%',
                            background: 'rgba(205, 168, 105, 0.2)',
                            border: '2px solid #cda869',
                            color: '#fff',
                            cursor: 'pointer',
                            marginBottom: '20px'
                        }}
                    >
                        ЧЕК ИН <span style={{ fontSize: '1rem', color: '#cda869' }}>+{potentialXP} XP</span>
                    </button>

                    <div style={{ marginBottom: '20px', fontSize: '1.2rem' }}>
                        Стрик {weeklyCount} из {skill.targetPerWeek} на этой неделе
                        {weeklyCount >= skill.targetPerWeek && <span style={{ color: '#4caf50', marginLeft: '10px' }}>✓ Цель выполнена!</span>}
                    </div>
                </div>

                <div style={{ flex: 1, minWidth: '300px' }}>
                    <h3 style={{ marginTop: 0 }}>Месячный график</h3>
                    <div className="calendar-grid" style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(7, 1fr)',
                        gap: '5px',
                        marginTop: '10px'
                    }}>
                        {['Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб', 'Вс'].map(d => (
                            <div key={d} style={{ textAlign: 'center', color: '#888', fontSize: '0.8rem' }}>{d}</div>
                        ))}
                        {renderCalendar()}
                    </div>
                </div>
            </div>

            <style jsx>{`
                .calendar-day {
                    aspect-ratio: 1;
                    border: 1px solid #333;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    font-size: 0.9rem;
                    color: #555;
                }
                .calendar-day.active {
                    background: rgba(205, 168, 105, 0.3);
                    border-color: #cda869;
                    color: #fff;
                    font-weight: bold;
                }
                .calendar-day.empty {
                    border: none;
                }
            `}</style>
            <style>{`
                @media (max-width: 768px) {
                    .mobile-back-btn { display: block !important; }
                }
            `}</style>
        </div>
    );
};

export default SkillDetail;
