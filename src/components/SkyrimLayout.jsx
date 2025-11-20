import React, { useState } from 'react';
import QuestList from './QuestList';
import QuestDetail from './QuestDetail';
import EditActModal from './EditActModal';
import EditQuestModal from './EditQuestModal';
import { useGame } from '../context/GameContext';

const SkyrimLayout = () => {
    const [selectedQuestId, setSelectedQuestId] = useState(null);
    const [editActData, setEditActData] = useState(null); // { actId, mode: 'add'|'edit' }
    const [editQuestData, setEditQuestData] = useState(null); // { actId, questId, mode: 'add'|'edit' }
    const { gameState, editMode, toggleEditMode, deleteAct, deleteQuest } = useGame();

    const handleSelectQuest = (questId) => {
        setSelectedQuestId(questId);
    };

    const handleBack = () => {
        setSelectedQuestId(null);
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

    return (
        <div className="skyrim-container">
            <div className={`quest-list-panel ${selectedQuestId ? 'hidden-mobile' : ''}`}>
                <div style={{
                    padding: '20px',
                    textAlign: 'center',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: '15px',
                    position: 'relative'
                }}>
                    <h1 style={{ fontSize: '1.5rem', color: '#aaa', margin: 0 }}>ЖУРНАЛ</h1>
                    <button
                        onClick={toggleEditMode}
                        style={{
                            background: 'transparent',
                            border: 'none',
                            cursor: 'pointer',
                            fontSize: '1.2rem',
                            opacity: editMode ? 1 : 0.4,
                            transition: 'opacity 0.3s',
                            padding: '5px'
                        }}
                        title={editMode ? 'Выйти из режима редактирования' : 'Войти в режим редактирования'}
                    >
                        ✏️
                    </button>
                </div>
                <QuestList
                    onSelect={handleSelectQuest}
                    selectedId={selectedQuestId}
                    onEditAct={handleEditAct}
                    onEditQuest={handleEditQuest}
                />
            </div>

            <div className={`quest-detail-panel ${selectedQuestId ? 'active' : ''}`}>
                {selectedQuestId ? (
                    <QuestDetail
                        questId={selectedQuestId}
                        onBack={handleBack}
                    />
                ) : (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: '#555' }}>
                        <p>Выберите квест для просмотра деталей</p>
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
        </div>
    );
};

export default SkyrimLayout;
