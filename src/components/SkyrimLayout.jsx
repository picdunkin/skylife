import React, { useState } from 'react';
import QuestList from './QuestList';
import QuestDetail from './QuestDetail';
import { useGame } from '../context/GameContext';

const SkyrimLayout = () => {
    const [selectedQuestId, setSelectedQuestId] = useState(null);
    const { gameState } = useGame();

    const handleSelectQuest = (questId) => {
        setSelectedQuestId(questId);
    };

    const handleBack = () => {
        setSelectedQuestId(null);
    };

    return (
        <div className="skyrim-container">
            <div className={`quest-list-panel ${selectedQuestId ? 'hidden-mobile' : ''}`}>
                <div style={{ padding: '20px', textAlign: 'center' }}>
                    <h1 style={{ fontSize: '1.5rem', color: '#aaa' }}>ЖУРНАЛ</h1>
                </div>
                <QuestList
                    onSelect={handleSelectQuest}
                    selectedId={selectedQuestId}
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
        </div>
    );
};

export default SkyrimLayout;
