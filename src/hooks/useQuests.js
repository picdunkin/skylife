export const useQuests = (gameState, saveState, playSound) => {

    const completeQuest = (questId) => {
        if (gameState.completedQuestIds.includes(questId)) return;

        const newCompleted = [...gameState.completedQuestIds, questId];

        // Logic for unlocking acts could go here or be derived

        saveState({ ...gameState, completedQuestIds: newCompleted });
        playSound('questDone');
    };

    const unlockAct = (actId) => {
        if (gameState.unlockedActIds.includes(actId)) return;
        const newUnlocked = [...gameState.unlockedActIds, actId];
        saveState({ ...gameState, unlockedActIds: newUnlocked });
    };

    const isActUnlocked = (actId) => {
        if (actId === 'act-1') return true;

        const actIndex = gameState.acts.findIndex(act => act.id === actId);
        if (actIndex <= 0) return true;

        const previousAct = gameState.acts[actIndex - 1];
        const allPreviousQuestsCompleted = previousAct.quests.every(quest =>
            gameState.completedQuestIds.includes(quest.id)
        );

        return allPreviousQuestsCompleted;
    };

    // CRUD for Acts
    const addAct = (act) => {
        const newActs = [...gameState.acts, { ...act, id: `act-${Date.now()}` }];
        saveState({ ...gameState, acts: newActs });
    };

    const updateAct = (actId, updatedAct) => {
        const newActs = gameState.acts.map(act =>
            act.id === actId ? { ...act, ...updatedAct } : act
        );
        saveState({ ...gameState, acts: newActs });
    };

    const deleteAct = (actId) => {
        const newActs = gameState.acts.filter(act => act.id !== actId);
        const questIdsToRemove = gameState.acts
            .find(act => act.id === actId)?.quests.map(q => q.id) || [];

        const newCompleted = gameState.completedQuestIds.filter(
            id => !questIdsToRemove.includes(id)
        );
        const newUnlocked = gameState.unlockedActIds.filter(id => id !== actId);

        saveState({
            ...gameState,
            acts: newActs,
            completedQuestIds: newCompleted,
            unlockedActIds: newUnlocked
        });
    };

    // CRUD for Quests
    const addQuest = (actId, quest) => {
        const newActs = gameState.acts.map(act => {
            if (act.id === actId) {
                return {
                    ...act,
                    quests: [...act.quests, { ...quest, id: `q-${Date.now()}` }]
                };
            }
            return act;
        });
        saveState({ ...gameState, acts: newActs });
    };

    const updateQuest = (actId, questId, updatedQuest) => {
        const newActs = gameState.acts.map(act => {
            if (act.id === actId) {
                return {
                    ...act,
                    quests: act.quests.map(quest =>
                        quest.id === questId ? { ...quest, ...updatedQuest } : quest
                    )
                };
            }
            return act;
        });
        saveState({ ...gameState, acts: newActs });
    };

    const deleteQuest = (actId, questId) => {
        const newActs = gameState.acts.map(act => {
            if (act.id === actId) {
                return {
                    ...act,
                    quests: act.quests.filter(quest => quest.id !== questId)
                };
            }
            return act;
        });
        const newCompleted = gameState.completedQuestIds.filter(id => id !== questId);

        saveState({
            ...gameState,
            acts: newActs,
            completedQuestIds: newCompleted
        });
    };

    return {
        completeQuest,
        unlockAct,
        isActUnlocked,
        addAct,
        updateAct,
        deleteAct,
        addQuest,
        updateQuest,
        deleteQuest
    };
};
