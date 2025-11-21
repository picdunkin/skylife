import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';

const EditSkillModal = ({ skillId, mode, onClose }) => {
    const { gameState, addSkill, updateSkill } = useGame();
    const [title, setTitle] = useState('');
    const [targetPerWeek, setTargetPerWeek] = useState(3);

    useEffect(() => {
        if (mode === 'edit' && skillId) {
            const skill = gameState.skills.find(s => s.id === skillId);
            if (skill) {
                setTitle(skill.title);
                setTargetPerWeek(skill.targetPerWeek || 3);
            }
        }
    }, [mode, skillId, gameState.skills]);

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!title.trim()) return;

        if (mode === 'add') {
            addSkill({
                title,
                targetPerWeek: parseInt(targetPerWeek)
            });
        } else {
            updateSkill(skillId, {
                title,
                targetPerWeek: parseInt(targetPerWeek)
            });
        }
        onClose();
    };

    return (
        <div
            className="modal-overlay"
            onClick={onClose}
            style={{
                position: 'fixed',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'rgba(0, 0, 0, 0.8)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 1000
            }}
        >
            <div
                className="modal-content"
                onClick={e => e.stopPropagation()}
                style={{
                    background: '#1a1a1a',
                    border: '2px solid #cda869',
                    padding: '30px',
                    maxWidth: '500px',
                    width: '90%',
                    maxHeight: '80vh',
                    overflowY: 'auto',
                    boxShadow: '0 0 20px rgba(0,0,0,0.8)'
                }}
            >
                <h2 style={{ marginTop: 0, color: '#cda869', fontFamily: 'Cinzel, serif', textAlign: 'center', marginBottom: '25px' }}>
                    {mode === 'add' ? 'Новый Навык' : 'Редактировать Навык'}
                </h2>
                <form onSubmit={handleSubmit}>
                    <div className="form-group" style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', color: '#aaa', fontSize: '0.9rem' }}>
                            Название
                        </label>
                        <input
                            type="text"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            placeholder="Например: Спортзал"
                            autoFocus
                            style={{
                                width: '100%',
                                padding: '12px',
                                background: '#000',
                                border: '1px solid #555',
                                color: '#fff',
                                fontSize: '1rem',
                                boxSizing: 'border-box'
                            }}
                        />
                    </div>
                    <div className="form-group" style={{ marginBottom: '30px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', color: '#aaa', fontSize: '0.9rem' }}>
                            Цель (раз в неделю)
                        </label>
                        <input
                            type="number"
                            min="1"
                            max="7"
                            value={targetPerWeek}
                            onChange={e => setTargetPerWeek(e.target.value)}
                            style={{
                                width: '100%',
                                padding: '12px',
                                background: '#000',
                                border: '1px solid #555',
                                color: '#fff',
                                fontSize: '1rem',
                                boxSizing: 'border-box'
                            }}
                        />
                    </div>
                    <div className="modal-actions" style={{ display: 'flex', gap: '15px', justifyContent: 'flex-end' }}>
                        <button
                            type="button"
                            onClick={onClose}
                            style={{
                                padding: '10px 20px',
                                background: 'transparent',
                                border: '1px solid #555',
                                color: '#aaa',
                                cursor: 'pointer',
                                fontSize: '1rem',
                                transition: 'all 0.2s'
                            }}
                        >
                            Отмена
                        </button>
                        <button
                            type="submit"
                            className="primary-btn"
                            style={{
                                padding: '10px 25px',
                                background: '#cda869',
                                border: 'none',
                                color: '#000',
                                cursor: 'pointer',
                                fontSize: '1rem',
                                fontWeight: 'bold',
                                transition: 'all 0.2s'
                            }}
                        >
                            Сохранить
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default EditSkillModal;
