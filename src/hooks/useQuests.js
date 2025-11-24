import { calculateGlobalReward, calculateLevelUp } from '../utils/gameRules';

export const useQuests = (gameState, saveState, playSound, triggerFloatingText) => {

    const completeQuest = (questId, event) => {
        if (gameState.completedQuestIds.includes(questId)) return;

        const newCompleted = [...gameState.completedQuestIds, questId];

        let newGlobalXp = gameState.globalXP || 0;
        let newGlobalLevel = gameState.globalLevel || 1;
        let newMoney = gameState.money || 0;

        // Calculate Reward
        const { xp, money } = calculateGlobalReward('QUEST');

        // Calculate Level Up
        const { newXp, newLevel, leveledUp } = calculateLevelUp(newGlobalXp + xp, newGlobalLevel);

        if (leveledUp) {
            playSound('levelUp');
        } else {
            playSound('questDone'); // Original sound if no level up
        }

        newGlobalXp = newXp;
        newGlobalLevel = newLevel;
        newMoney += money;

        if (event && triggerFloatingText) {
            triggerFloatingText(event.clientX, event.clientY, `+${xp} XP`, '#4caf50');
            setTimeout(() => {
                triggerFloatingText(event.clientX, event.clientY - 30, `+${money} 🪙`, '#cda869');
            }, 200);
        }

        // Logic for unlocking acts could go here or be derived

        saveState({
            ...gameState,
            completedQuestIds: newCompleted,
            globalXP: newGlobalXp,
            globalLevel: newGlobalLevel,
            money: newMoney
        });
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
