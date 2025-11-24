import React, { useState } from 'react';
import QuestList from './QuestList';
import QuestDetail from './QuestDetail';
import EditActModal from './EditActModal';
import EditQuestModal from './EditQuestModal';
import SkillsList from './SkillsList';
import SkillDetail from './SkillDetail';
import EditSkillModal from './EditSkillModal';
import SidequestList from './SidequestList';
import { useGame } from '../context/GameContext';
import { calculateXpToNextLevel } from '../utils/gameRules';

const SkyrimLayout = () => {
    const [selectedQuestId, setSelectedQuestId] = useState(null);
    const [selectedSkillId, setSelectedSkillId] = useState(null);
    const [currentView, setCurrentView] = useState('journal'); // 'journal', 'skills', 'sidequests'
    const [editActData, setEditActData] = useState(null); // { actId, mode: 'add'|'edit' }
    const [editQuestData, setEditQuestData] = useState(null); // { actId, questId, mode: 'add'|'edit' }
    const [editSkillData, setEditSkillData] = useState(null); // { skillId, mode: 'add'|'edit' }
    const { gameState, editMode, toggleEditMode, deleteAct, deleteQuest, deleteSkill } = useGame();

    const handleSelectQuest = (questId) => {
        setSelectedQuestId(questId);
        setSelectedSkillId(null);
    };

    const handleSelectSkill = (skillId) => {
        setSelectedSkillId(skillId);
        setSelectedQuestId(null);
    };

    const handleBack = () => {
        setSelectedQuestId(null);
        setSelectedSkillId(null);
    };

    const handleEditAct = (actId, mode) => {
        if (mode === 'delete') {
            deleteAct(actId);
        } else {
            setEditActData({ actId, mode });
        }
    };

    const handleEditQuest = (actId, questId, mode) => {
        if (mode === 'delete') {
            deleteQuest(actId, questId);
        } else {
            setEditQuestData({ actId, questId, mode });
        }
    };

    const handleEditSkill = (skillId, mode) => {
        if (mode === 'delete') {
            deleteSkill(skillId);
        } else {
            setEditSkillData({ skillId, mode });
        }
    };

    return (
        <div className="skyrim-container">
            <div className={`quest-list-panel ${selectedQuestId || selectedSkillId ? 'hidden-mobile' : ''}`}>
                <div style={{
                    padding: '8px 15px 0 15px',
                    borderBottom: '1px solid rgba(255,255,255,0.1)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '8px'
                }}>
                    {/* Level/XP and Money Row */}
                    <div style={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        gap: '10px'
                    }}>
                        {/* Level & XP Progress */}
                        <div style={{
                            width: '50%',
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '4px',
                            paddingBottom: '1rem'
                        }}>
                            <div style={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                                color: '#8a8a8aff',
                                fontWeight: 'bold',
                                fontSize: '0.95rem',
                            }}>
                                <span>Уровень {gameState.globalLevel || 1}</span>
                                <span style={{ fontSize: '0.85rem', opacity: 0.8 }}>
                                    {gameState.globalXP || 0} / {calculateXpToNextLevel(gameState.globalLevel || 1)}
                                </span>
                            </div>
                            <div style={{
                                width: '100%',
                                height: '6px',
                                backgroundColor: 'rgba(0,0,0,0.5)',
                                border: '1px solid #555',
                                borderRadius: '3px',
                                overflow: 'hidden'
                            }}>
                                <div style={{
                                    width: `${Math.min(100, ((gameState.globalXP || 0) / calculateXpToNextLevel(gameState.globalLevel || 1)) * 100)}%`,
                                    height: '100%',
                                    backgroundColor: '#b8b8b8ff',
                                    transition: 'width 0.5s ease-out'
                                }} />
                            </div>
                        </div>

                        {/* Money Counter */}
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: '5px',
                            color: '#cda869',
                            fontWeight: 'bold',
                            lineHeight: 1
                        }}>
                            <span>{gameState.money || 0}</span>
                            <span>🪙</span>
                        </div>
                    </div>

                    {/* Navigation Tabs */}
                    <div className="hide-scrollbar" style={{
                        display: 'flex',
                        gap: '15px',
                        overflowX: 'auto',
                        whiteSpace: 'nowrap',
                        paddingBottom: '10px',
                        scrollbarWidth: 'none',
                        msOverflowStyle: 'none',
                        maskImage: 'linear-gradient(to right, black 90%, transparent 100%)',
                        WebkitMaskImage: 'linear-gradient(to right, black 90%, transparent 100%)'
                    }}>
                        <style>
                            {`
                                .hide-scrollbar::-webkit-scrollbar { 
                                    display: none; 
                                }
                            `}
                        </style>
                        <button
                            onClick={() => setCurrentView('journal')}
                            style={{
                                background: 'none',
                                border: 'none',
                                borderBottom: currentView === 'journal' ? '2px solid #cda869' : '2px solid transparent',
                                color: currentView === 'journal' ? '#cda869' : '#888',
                                fontSize: '1.3rem',
                                cursor: 'pointer',
                                padding: '5px 0',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '5px',
                                flexShrink: 0
                            }}
                        >
                            <span className="tab-label">ГЛАВНАЯ</span>
                        </button>
                        <button
                            onClick={() => setCurrentView('skills')}
                            style={{
                                background: 'none',
                                border: 'none',
                                borderBottom: currentView === 'skills' ? '2px solid #cda869' : '2px solid transparent',
                                color: currentView === 'skills' ? '#cda869' : '#888',
                                fontSize: '1.3rem',
                                cursor: 'pointer',
                                padding: '5px 0',
                                flexShrink: 0
                            }}
                        >
                            СКИЛЛЫ
                        </button>
                        <button
                            onClick={() => setCurrentView('sidequests')}
                            style={{
                                background: 'none',
                                border: 'none',
                                borderBottom: currentView === 'sidequests' ? '2px solid #cda869' : '2px solid transparent',
                                color: currentView === 'sidequests' ? '#cda869' : '#888',
                                fontSize: '1.3rem',
                                cursor: 'pointer',
                                padding: '5px 0',
                                flexShrink: 0
                            }}
                        >
                            САЙДКВЕСТЫ
                        </button>

                        {/* Edit Toggle Button */}
                        <button
                            onClick={toggleEditMode}
                            style={{
                                background: 'none',
                                border: 'none',
                                borderBottom: '2px solid transparent',
                                color: editMode ? '#cda869' : '#888',
                                fontSize: '1.1rem',
                                cursor: 'pointer',
                                padding: '5px 0',
                                opacity: editMode ? 1 : 0.6,
                                transition: 'opacity 0.3s',
                                flexShrink: 0
                            }}
                            title={editMode ? 'Выйти из режима редактирования' : 'Войти в режим редактирования'}
                        >
                            ✏️
                        </button>
                    </div>
                </div>

                {currentView === 'journal' && (
                    <QuestList
                        onSelect={handleSelectQuest}
                        selectedId={selectedQuestId}
                        onEditAct={handleEditAct}
                        onEditQuest={handleEditQuest}
                    />
                )}

                {currentView === 'skills' && (
                    <SkillsList
                        onSelect={handleSelectSkill}
                        selectedId={selectedSkillId}
                        onEditSkill={handleEditSkill}
                    />
                )}

                {currentView === 'sidequests' && (
                    <SidequestList />
                )}
            </div>

            <div className={`quest-detail-panel ${selectedQuestId || selectedSkillId ? 'active' : ''}`}>
                {selectedQuestId ? (
                    <QuestDetail
                        questId={selectedQuestId}
                        onBack={handleBack}
                    />
                ) : selectedSkillId ? (
                    <SkillDetail
                        skillId={selectedSkillId}
                        onBack={handleBack}
                    />
                ) : (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#555' }}>
                        <p>Выберите элемент для просмотра деталей</p>
                    </div>
                )}
            </div>

            {editActData && (
                <EditActModal
                    actId={editActData.actId}
                    mode={editActData.mode}
                    onClose={() => setEditActData(null)}
                />
            )}

            {editQuestData && (
                <EditQuestModal
                    actId={editQuestData.actId}
                    questId={editQuestData.questId}
                    mode={editQuestData.mode}
                    onClose={() => setEditQuestData(null)}
                />
            )}

            {editSkillData && (
                <EditSkillModal
                    skillId={editSkillData.skillId}
                    mode={editSkillData.mode}
                    onClose={() => setEditSkillData(null)}
                />
            )}
        </div>
    );
};

export default SkyrimLayout;
