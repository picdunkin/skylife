import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db, googleProvider } from '../firebase';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, setDoc, getDoc, onSnapshot } from 'firebase/firestore';
import { ACTS } from '../data/quests';
import { playSound } from '../utils/sounds';

const GameContext = createContext();

export const useGame = () => useContext(GameContext);

const INITIAL_STATE = {
    completedQuestIds: [],
    unlockedActIds: ['act-1'], // Act 1 is always unlocked
    metrics: {}, // { "m-applications": 5 }
    objectives: {}, // { "obj-remove-ambition": true }
    notes: {},
    acts: ACTS // Now storing acts in state
};

export const GameProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [gameState, setGameState] = useState(INITIAL_STATE);
    const [loading, setLoading] = useState(true);
    const [editMode, setEditMode] = useState(false);

    // Auth Listener
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
            setUser(currentUser);
            if (!currentUser) {
                setGameState(INITIAL_STATE);
                setLoading(false);
            }
        });
        return unsubscribe;
    }, []);

    // Firestore Sync
    useEffect(() => {
        if (!user) return;

        const userRef = doc(db, 'users', user.uid);
        const unsubscribe = onSnapshot(userRef, (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data();
                // If acts don't exist in Firebase, use default ACTS
                if (!data.acts) {
                    data.acts = ACTS;
                    setDoc(userRef, data, { merge: true });
                }
                setGameState(data);
            } else {
                // Create new user document with default acts
                setDoc(userRef, INITIAL_STATE);
            }
            setLoading(false);
        });

        return unsubscribe;
    }, [user]);

    const saveState = async (newState) => {
        setGameState(newState);
        if (user) {
            const userRef = doc(db, 'users', user.uid);
            await setDoc(userRef, newState, { merge: true });
        }
    };

    const login = async () => {
        try {
            const result = await signInWithPopup(auth, googleProvider);
            console.log('✅ Авторизация успешна:', result.user.email);
            return result;
        } catch (error) {
            console.error('❌ Ошибка авторизации:', error.code, error.message);

            // Детальные сообщения об ошибках
            switch (error.code) {
                case 'auth/popup-closed-by-user':
                    alert('Вы закрыли окно авторизации. Попробуйте снова.');
                    break;
                case 'auth/popup-blocked':
                    alert('Браузер заблокировал всплывающее окно. Разрешите popup для этого сайта.');
                    break;
                case 'auth/unauthorized-domain':
                    alert('Домен не авторизован. Добавьте localhost в Firebase Console → Authentication → Settings → Authorized domains');
                    break;
                case 'auth/configuration-not-found':
                    alert('Google Authentication не настроен. Включите его в Firebase Console → Authentication → Sign-in method');
                    break;
                case 'auth/invalid-api-key':
                    alert('Неверный API ключ. Проверьте файл .env');
                    break;
                default:
                    alert(`Ошибка авторизации: ${error.message}`);
            }

            throw error;
        }
    };
    const logout = () => signOut(auth);

    // Actions
    const updateMetric = (metricId, value) => {
        playSound('metricsChange');
        const newMetrics = { ...gameState.metrics, [metricId]: value };
        saveState({ ...gameState, metrics: newMetrics });
    };

    const toggleObjective = (objectiveId) => {
        const current = gameState.objectives[objectiveId] || false;
        const newObjectives = { ...gameState.objectives, [objectiveId]: !current };
        saveState({ ...gameState, objectives: newObjectives });
    };

    const completeQuest = (questId) => {
        if (gameState.completedQuestIds.includes(questId)) return;

        const newCompleted = [...gameState.completedQuestIds, questId];

        // Check for Act Unlocks logic here (simplified for now)
        // e.g., if all quests in Act 1 are done, unlock Act 2
        // For now, we'll just save the quest completion.

        saveState({ ...gameState, completedQuestIds: newCompleted });

        // Play quest completion sound
        playSound('questDone');
    };

    const unlockAct = (actId) => {
        if (gameState.unlockedActIds.includes(actId)) return;
        const newUnlocked = [...gameState.unlockedActIds, actId];
        saveState({ ...gameState, unlockedActIds: newUnlocked });
    };

    // Check if an act is unlocked
    const isActUnlocked = (actId) => {
        // Act 1 is always unlocked
        if (actId === 'act-1') return true;

        // Find the previous act
        const actIndex = gameState.acts.findIndex(act => act.id === actId);
        if (actIndex <= 0) return true;

        const previousAct = gameState.acts[actIndex - 1];

        // Check if all quests in the previous act are completed
        const allPreviousQuestsCompleted = previousAct.quests.every(quest =>
            gameState.completedQuestIds.includes(quest.id)
        );

        return allPreviousQuestsCompleted;
    };

    // Edit Mode
    const toggleEditMode = () => {
        setEditMode(prev => !prev);
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
        // Also remove completed quests and unlocked status for this act
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
        // Remove from completed quests if it was completed
        const newCompleted = gameState.completedQuestIds.filter(id => id !== questId);

        saveState({
            ...gameState,
            acts: newActs,
            completedQuestIds: newCompleted
        });
    };

    const value = {
        user,
        gameState,
        loading,
        editMode,
        login,
        logout,
        updateMetric,
        toggleObjective,
        completeQuest,
        unlockAct,
        isActUnlocked,
        toggleEditMode,
        addAct,
        updateAct,
        deleteAct,
        addQuest,
        updateQuest,
        deleteQuest
    };

    return (
        <GameContext.Provider value={value}>
            {children}
        </GameContext.Provider>
    );
};
