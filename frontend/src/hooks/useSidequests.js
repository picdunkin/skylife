import { calculateGlobalReward, calculateLevelUp } from '../utils/gameRules';
export const useSidequests = (gameState, saveState, playSound, triggerFloatingText) => {

    const addSidequest = (title) => {
        const newSidequests = [...(gameState.sidequests || []), {
            id: `sq-${Date.now()}`,
            title,
            completed: false,
            createdAt: new Date().toISOString()
        }];
        saveState({ ...gameState, sidequests: newSidequests });
        playSound('journalUpdate');
    };

    const toggleSidequest = (id, event) => {
        const sidequest = (gameState.sidequests || []).find(sq => sq.id === id);
        if (!sidequest) return;

        const newCompleted = !sidequest.completed;
        let newGlobalXp = gameState.globalXP || 0;
        let newGlobalLevel = gameState.globalLevel || 1;
        let newMoney = gameState.money || 0;

        if (newCompleted) {
            playSound('checkbox');

            // Calculate Reward
            // "за закрытие квеста - 10x чекинов" -> QUEST type
            const { xp, money } = calculateGlobalReward('QUEST');

            // Calculate Level Up
            const { newXp, newLevel, leveledUp } = calculateLevelUp(newGlobalXp + xp, newGlobalLevel);

            if (leveledUp) {
                playSound('levelUp');
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
        }

        const newSidequests = (gameState.sidequests || []).map(sq => {
            if (sq.id === id) {
                return { ...sq, completed: newCompleted };
            }
            return sq;
        });

        saveState({
            ...gameState,
            sidequests: newSidequests,
            globalXP: newGlobalXp,
            globalLevel: newGlobalLevel,
            money: newMoney
        });
    };

    const deleteSidequest = (id) => {
        const newSidequests = (gameState.sidequests || []).filter(sq => sq.id !== id);
        saveState({ ...gameState, sidequests: newSidequests });
    };

    return {
        addSidequest,
        toggleSidequest,
        deleteSidequest
    };
};
