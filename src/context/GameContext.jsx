import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { db } from '../firebase';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';
import { ACTS } from '../data/quests';
import { playSound } from '../utils/sounds';
import { useAuth } from '../hooks/useAuth';
import { useQuests } from '../hooks/useQuests';
import { useSkills } from '../hooks/useSkills';
import { useNotification } from './NotificationContext';

const GameContext = createContext();

export const useGame = () => useContext(GameContext);

const INITIAL_STATE = {
    completedQuestIds: [],
    unlockedActIds: ['act-1'], // Act 1 is always unlocked
    metrics: {}, // { "m-applications": 5 }
    objectives: {}, // { "obj-remove-ambition": true }
    notes: {},
    acts: ACTS, // Now storing acts in state
    skills: [], // { id, title, targetPerWeek, level, xp, history: [{date, count}] }
    money: 0 // Septims
};

export const GameProvider = ({ children }) => {
    const { user, loading: authLoading, login: authLogin, logout } = useAuth();
    const { showNotification } = useNotification();

    const [gameState, setGameState] = useState(INITIAL_STATE);
    const [dataLoading, setDataLoading] = useState(true);
    const [editMode, setEditMode] = useState(false);

    // Firestore Sync
    useEffect(() => {
        if (!user) {
            setGameState(INITIAL_STATE);
            setDataLoading(false);
            return;
        }

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
            setDataLoading(false);
        }, (error) => {
            console.error("Firestore sync error:", error);
            showNotification("Ошибка синхронизации данных", "error");
            setDataLoading(false);
        });

        return unsubscribe;
    }, [user, showNotification]);

    const saveState = async (newState) => {
        setGameState(newState);
        if (user) {
            const userRef = doc(db, 'users', user.uid);
            try {
                await setDoc(userRef, newState, { merge: true });
            } catch (error) {
                console.error("Save state error:", error);
                showNotification("Ошибка сохранения", "error");
            }
        }
    };

    // Hooks for logic
    const questLogic = useQuests(gameState, saveState, playSound);
    const skillLogic = useSkills(gameState, saveState, playSound);

    const login = async () => {
        try {
            await authLogin();
            showNotification("Добро пожаловать, Довакин!", "success");
        } catch (error) {
            // Error is already logged in useAuth, but we handle UI here
            let message = "Ошибка авторизации";
            switch (error.code) {
                case 'auth/popup-closed-by-user':
                    message = 'Вы закрыли окно авторизации.';
                    break;
                case 'auth/popup-blocked':
                    message = 'Браузер заблокировал окно.';
                    break;
                default:
                    message = error.message;
            }
            showNotification(message, "error");
            throw error;
        }
    };

    // Actions that didn't fit into hooks yet (Metrics, Objectives, EditMode)
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

    const toggleEditMode = () => {
        setEditMode(prev => !prev);
    };

    const loading = authLoading || (user && dataLoading);

    const value = useMemo(() => ({
        user,
        gameState,
        loading,
        editMode,
        login,
        logout,
        updateMetric,
        toggleObjective,
        toggleEditMode,
        ...questLogic,
        ...skillLogic
    }), [user, gameState, loading, editMode, questLogic, skillLogic]);

    return (
        <GameContext.Provider value={value}>
            {children}
        </GameContext.Provider>
    );
};
