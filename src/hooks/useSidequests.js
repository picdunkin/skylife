export const useSidequests = (gameState, saveState, playSound) => {

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

    const toggleSidequest = (id) => {
        const newSidequests = (gameState.sidequests || []).map(sq => {
            if (sq.id === id) {
                const newCompleted = !sq.completed;
                if (newCompleted) {
                    playSound('checkbox');
                }
                return { ...sq, completed: newCompleted };
            }
            return sq;
        });
        saveState({ ...gameState, sidequests: newSidequests });
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
