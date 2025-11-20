import React, { useState } from 'react';
import { useGame } from '../context/GameContext';

const EditQuestModal = ({ actId, questId, mode, onClose }) => {
    const { gameState, addQuest, updateQuest } = useGame();

    const act = gameState.acts.find(a => a.id === actId);
    const existingQuest = questId ? act?.quests.find(q => q.id === questId) : null;

    const [formData, setFormData] = useState({
        title: existingQuest?.title || '',
        description: existingQuest?.description || '',
        objectives: existingQuest?.objectives || [],
        rewards: existingQuest?.rewards || [],
        metrics: existingQuest?.metrics || []
    });

    const handleSubmit = (e) => {
        e.preventDefault();

        if (mode === 'add') {
            addQuest(actId, formData);
        } else {
            updateQuest(actId, questId, formData);
        }

        onClose();
    };

    const handleChange = (field, value) => {
        setFormData(prev => ({ ...prev, [field]: value }));
    };

    // Objectives management
    const addObjective = () => {
        setFormData(prev => ({
            ...prev,
            objectives: [...prev.objectives, { id: `obj-${Date.now()}`, text: '', type: 'boolean' }]
        }));
    };

    const updateObjective = (index, text) => {
        setFormData(prev => ({
            ...prev,
            objectives: prev.objectives.map((obj, i) =>
                i === index ? { ...obj, text } : obj
            )
        }));
    };

    const removeObjective = (index) => {
        setFormData(prev => ({
            ...prev,
            objectives: prev.objectives.filter((_, i) => i !== index)
        }));
    };

    // Rewards management
    const addReward = () => {
        setFormData(prev => ({
            ...prev,
            rewards: [...prev.rewards, '']
        }));
    };

    const updateReward = (index, value) => {
        setFormData(prev => ({
            ...prev,
            rewards: prev.rewards.map((r, i) => i === index ? value : r)
        }));
    };

    const removeReward = (index) => {
        setFormData(prev => ({
            ...prev,
            rewards: prev.rewards.filter((_, i) => i !== index)
        }));
    };

    // Metrics management
    const addMetric = () => {
        setFormData(prev => ({
            ...prev,
            metrics: [...prev.metrics, { id: `m-${Date.now()}`, label: '', target: 0, type: 'limited' }]
        }));
    };

    const updateMetric = (index, field, value) => {
        setFormData(prev => ({
            ...prev,
            metrics: prev.metrics.map((m, i) =>
                i === index ? { ...m, [field]: value } : m
            )
        }));
    };

    const removeMetric = (index) => {
        setFormData(prev => ({
            ...prev,
            metrics: prev.metrics.filter((_, i) => i !== index)
        }));
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
                    maxWidth: '600px',
                    width: '90%',
                    maxHeight: '80vh',
                    overflowY: 'auto'
                }}
            >
                <h2 style={{ marginTop: 0, color: '#cda869' }}>
                    {mode === 'add' ? 'Добавить Квест' : 'Редактировать Квест'}
                </h2>

                <form onSubmit={handleSubmit}>
                    {/* Basic Info */}
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

                    {/* Objectives */}
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '10px', color: '#aaa' }}>
                            Задачи
                        </label>
                        {formData.objectives.map((obj, index) => (
                            <div key={index} style={{ display: 'flex', gap: '5px', marginBottom: '5px' }}>
                                <input
                                    type="text"
                                    value={obj.text}
                                    onChange={(e) => updateObjective(index, e.target.value)}
                                    placeholder="Текст задачи"
                                    style={{
                                        flex: 1,
                                        padding: '8px',
                                        background: '#000',
                                        border: '1px solid #555',
                                        color: '#fff',
                                        fontSize: '0.9rem'
                                    }}
                                />
                                <button
                                    type="button"
                                    onClick={() => removeObjective(index)}
                                    style={{
                                        padding: '8px 12px',
                                        background: '#500',
                                        border: 'none',
                                        color: '#fff',
                                        cursor: 'pointer'
                                    }}
                                >
                                    🗑️
                                </button>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={addObjective}
                            style={{
                                padding: '8px 15px',
                                background: 'transparent',
                                border: '1px dashed #555',
                                color: '#888',
                                cursor: 'pointer',
                                width: '100%',
                                marginTop: '5px'
                            }}
                        >
                            + Добавить задачу
                        </button>
                    </div>

                    {/* Rewards */}
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '10px', color: '#aaa' }}>
                            Награды
                        </label>
                        {formData.rewards.map((reward, index) => (
                            <div key={index} style={{ display: 'flex', gap: '5px', marginBottom: '5px' }}>
                                <input
                                    type="text"
                                    value={reward}
                                    onChange={(e) => updateReward(index, e.target.value)}
                                    placeholder="Награда"
                                    style={{
                                        flex: 1,
                                        padding: '8px',
                                        background: '#000',
                                        border: '1px solid #555',
                                        color: '#fff',
                                        fontSize: '0.9rem'
                                    }}
                                />
                                <button
                                    type="button"
                                    onClick={() => removeReward(index)}
                                    style={{
                                        padding: '8px 12px',
                                        background: '#500',
                                        border: 'none',
                                        color: '#fff',
                                        cursor: 'pointer'
                                    }}
                                >
                                    🗑️
                                </button>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={addReward}
                            style={{
                                padding: '8px 15px',
                                background: 'transparent',
                                border: '1px dashed #555',
                                color: '#888',
                                cursor: 'pointer',
                                width: '100%',
                                marginTop: '5px'
                            }}
                        >
                            + Добавить награду
                        </button>
                    </div>

                    {/* Metrics */}
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '10px', color: '#aaa' }}>
                            Метрики
                        </label>
                        {formData.metrics.map((metric, index) => (
                            <div key={index} style={{ marginBottom: '10px', padding: '10px', background: '#0a0a0a', border: '1px solid #333' }}>
                                <div style={{ display: 'flex', gap: '5px', marginBottom: '5px' }}>
                                    <input
                                        type="text"
                                        value={metric.label}
                                        onChange={(e) => updateMetric(index, 'label', e.target.value)}
                                        placeholder="Название метрики"
                                        style={{
                                            flex: 1,
                                            padding: '8px',
                                            background: '#000',
                                            border: '1px solid #555',
                                            color: '#fff',
                                            fontSize: '0.9rem'
                                        }}
                                    />
                                    <button
                                        type="button"
                                        onClick={() => removeMetric(index)}
                                        style={{
                                            padding: '8px 12px',
                                            background: '#500',
                                            border: 'none',
                                            color: '#fff',
                                            cursor: 'pointer'
                                        }}
                                    >
                                        🗑️
                                    </button>
                                </div>
                                <div style={{ display: 'flex', gap: '10px' }}>
                                    <input
                                        type="number"
                                        value={metric.target}
                                        onChange={(e) => updateMetric(index, 'target', parseInt(e.target.value) || 0)}
                                        placeholder="Цель"
                                        style={{
                                            flex: 1,
                                            padding: '8px',
                                            background: '#000',
                                            border: '1px solid #555',
                                            color: '#fff',
                                            fontSize: '0.9rem'
                                        }}
                                    />
                                    <select
                                        value={metric.type}
                                        onChange={(e) => updateMetric(index, 'type', e.target.value)}
                                        style={{
                                            flex: 1,
                                            padding: '8px',
                                            background: '#000',
                                            border: '1px solid #555',
                                            color: '#fff',
                                            fontSize: '0.9rem'
                                        }}
                                    >
                                        <option value="limited">Ограниченная</option>
                                        <option value="unlimited">Неограниченная</option>
                                    </select>
                                </div>
                            </div>
                        ))}
                        <button
                            type="button"
                            onClick={addMetric}
                            style={{
                                padding: '8px 15px',
                                background: 'transparent',
                                border: '1px dashed #555',
                                color: '#888',
                                cursor: 'pointer',
                                width: '100%',
                                marginTop: '5px'
                            }}
                        >
                            + Добавить метрику
                        </button>
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

export default EditQuestModal;
