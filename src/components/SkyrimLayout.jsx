import React, { useState } from 'react';
import QuestList from './QuestList';
import QuestDetail from './QuestDetail';
import EditActModal from './EditActModal';
import EditQuestModal from './EditQuestModal';
import SkillsList from './SkillsList';
import SkillDetail from './SkillDetail';
import EditSkillModal from './EditSkillModal';
import { useGame } from '../context/GameContext';

const SkyrimLayout = () => {
    const [selectedQuestId, setSelectedQuestId] = useState(null);
    const [selectedSkillId, setSelectedSkillId] = useState(null);
    const [currentView, setCurrentView] = useState('journal'); // 'journal', 'skills', 'dailies'
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
                    padding: '10px 15px 0 15px',
                    borderBottom: '1px solid rgba(255,255,255,0.1)',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px'
                }}>
                    {/* Money Counter */}
                    <div style={{
                        alignSelf: 'flex-end',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '5px',
                        color: '#cda869',
                        fontWeight: 'bold',
                        fontSize: '1.2rem',
                        lineHeight: 1
                    }}>
                        <span>{gameState.money || 0}</span>
                        <span style={{ fontSize: '1.5rem' }}>🪙</span>
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
                                fontSize: '1.1rem',
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
                                fontSize: '1.1rem',
                                cursor: 'pointer',
                                padding: '5px 0',
                                flexShrink: 0
                            }}
                        >
                            СКИЛЛЫ
                        </button>
                        <button
                            onClick={() => setCurrentView('dailies')}
                            style={{
                                background: 'none',
                                border: 'none',
                                borderBottom: currentView === 'dailies' ? '2px solid #cda869' : '2px solid transparent',
                                color: currentView === 'dailies' ? '#cda869' : '#888',
                                fontSize: '1.1rem',
                                cursor: 'pointer',
                                padding: '5px 0',
                                flexShrink: 0
                            }}
                        >
                            ДЕЙЛИКИ
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

                {currentView === 'dailies' && (
                    <div style={{ padding: '40px', textAlign: 'center', color: '#888' }}>
                        <p>Раздел "Дейлики" в разработке...</p>
                    </div>
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
