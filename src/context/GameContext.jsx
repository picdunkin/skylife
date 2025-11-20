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
    notes: {}
};

export const GameProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [gameState, setGameState] = useState(INITIAL_STATE);
    const [loading, setLoading] = useState(true);

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
                setGameState(docSnap.data());
            } else {
                // Create new user document
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

    const login = () => signInWithPopup(auth, googleProvider);
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
        const actIndex = ACTS.findIndex(act => act.id === actId);
        if (actIndex <= 0) return true;

        const previousAct = ACTS[actIndex - 1];

        // Check if all quests in the previous act are completed
        const allPreviousQuestsCompleted = previousAct.quests.every(quest =>
            gameState.completedQuestIds.includes(quest.id)
        );

        return allPreviousQuestsCompleted;
    };

    const value = {
        user,
        gameState,
        loading,
        login,
        logout,
        updateMetric,
        toggleObjective,
        completeQuest,
        unlockAct,
        isActUnlocked
    };

    return (
        <GameContext.Provider value={value}>
            {children}
        </GameContext.Provider>
    );
};
