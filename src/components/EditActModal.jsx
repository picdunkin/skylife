import React, { useState, useEffect } from 'react';
import { useGame } from '../context/GameContext';

const EditActModal = ({ actId, mode, onClose }) => {
    const { gameState, addAct, updateAct } = useGame();

    const existingAct = actId ? gameState.acts.find(a => a.id === actId) : null;

    const [formData, setFormData] = useState({
        title: existingAct?.title || '',
        dateRange: existingAct?.dateRange || '',
        description: existingAct?.description || ''
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        if (mode === 'add') {
            addAct({
                ...formData,
                quests: []
            });
        } else {
            updateAct(actId, formData);
        }

        onClose();
    };

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
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
                onClick={(e) => e.stopPropagation()}
                style={{
                    background: '#1a1a1a',
                    border: '2px solid #cda869',
                    padding: '30px',
                    maxWidth: '500px',
                    width: '90%',
                    maxHeight: '80vh',
                    overflowY: 'auto'
                }}
            >
                <h2 style={{ marginTop: 0, color: '#cda869' }}>
                    {mode === 'add' ? 'Добавить Акт' : 'Редактировать Акт'}
                </h2>

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '5px', color: '#aaa' }}>
                            Название
                        </label>
                        <input
                            type="text"
                            value={formData.title}
                            onChange={(e) => handleChange('title', e.target.value)}
                            required
                            style={{
                                width: '100%',
                                padding: '10px',
                                background: '#000',
                                border: '1px solid #555',
                                color: '#fff',
                                fontSize: '1rem'
                            }}
                        />
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '5px', color: '#aaa' }}>
                            Даты
                        </label>
                        <input
                            type="text"
                            value={formData.dateRange}
                            onChange={(e) => handleChange('dateRange', e.target.value)}
                            placeholder="ДЕК 2025 – ФЕВ 2026"
                            style={{
                                width: '100%',
                                padding: '10px',
                                background: '#000',
                                border: '1px solid #555',
                                color: '#fff',
                                fontSize: '1rem'
                            }}
                        />
                    </div>

                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '5px', color: '#aaa' }}>
                            Описание
                        </label>
                        <textarea
                            value={formData.description}
                            onChange={(e) => handleChange('description', e.target.value)}
                            rows={3}
                            style={{
                                width: '100%',
                                padding: '10px',
                                background: '#000',
                                border: '1px solid #555',
                                color: '#fff',
                                fontSize: '1rem',
                                resize: 'vertical'
                            }}
                        />
                    </div>

                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                        <button
                            type="button"
                            onClick={onClose}
                            style={{
                                padding: '10px 20px',
                                background: 'transparent',
                                border: '1px solid #555',
                                color: '#aaa',
                                cursor: 'pointer',
                                fontSize: '1rem'
                            }}
                        >
                            Отмена
                        </button>
                        <button
                            type="submit"
                            style={{
                                padding: '10px 20px',
                                background: '#cda869',
                                border: 'none',
                                color: '#000',
                                cursor: 'pointer',
                                fontSize: '1rem',
                                fontWeight: 'bold'
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

export default EditActModal;
