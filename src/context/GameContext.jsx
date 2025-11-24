import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { db } from '../firebase';
import { doc, setDoc, onSnapshot } from 'firebase/firestore';
import { ACTS } from '../data/quests';
import { playSound } from '../utils/sounds';
import { useAuth } from '../hooks/useAuth';
import { useQuests } from '../hooks/useQuests';
import { useSkills } from '../hooks/useSkills';
import { useSidequests } from '../hooks/useSidequests';
import { useNotification } from './NotificationContext';
import { calculateLevelUp, calculateGlobalReward, calculateXpToNextLevel } from '../utils/gameRules';
import FloatingText from '../components/FloatingText';

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
    sidequests: [], // { id, title, completed, createdAt }
    money: 0, // Septims
    globalLevel: 1,
    globalXP: 0
};

export const GameProvider = ({ children }) => {
    const { user, loading: authLoading, login: authLogin, logout } = useAuth();
    const { showNotification } = useNotification();

    const [gameState, setGameState] = useState(INITIAL_STATE);
    const [dataLoading, setDataLoading] = useState(true);
    const [editMode, setEditMode] = useState(false);
    const [floatingTexts, setFloatingTexts] = useState([]); // { id, x, y, text, color }

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

    const triggerFloatingText = (x, y, text, color = '#cda869') => {
        const id = Date.now() + Math.random();
        setFloatingTexts(prev => [...prev, { id, x, y, text, color }]);
    };

    const removeFloatingText = (id) => {
        setFloatingTexts(prev => prev.filter(ft => ft.id !== id));
    };

    const addGlobalXP = (amount) => {
        const { newXp, newLevel, leveledUp } = calculateLevelUp(gameState.globalXP + amount, gameState.globalLevel);

        if (leveledUp) {
            playSound('levelUp');
            showNotification(`Уровень повышен! Теперь вы уровень ${newLevel}`, 'success');
        }

        return { newXp, newLevel };
    };

    const questLogic = useQuests(gameState, saveState, playSound, triggerFloatingText);
    const skillLogic = useSkills(gameState, saveState, playSound, triggerFloatingText);
    const sidequestLogic = useSidequests(gameState, saveState, playSound, triggerFloatingText);

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

    const updateMetric = (metricId, value, event) => {
        playSound('metricsChange');
        const newMetrics = { ...gameState.metrics, [metricId]: value };

        // Calculate Reward
        const { xp, money } = calculateGlobalReward('METRIC');

        // Update Global State
        const { newXp, newLevel } = addGlobalXP(xp);
        const newMoney = (gameState.money || 0) + money;

        saveState({
            ...gameState,
            metrics: newMetrics,
            globalXP: newXp,
            globalLevel: newLevel,
            money: newMoney
        });

        // Trigger Visual Feedback
        if (event) {
            triggerFloatingText(event.clientX, event.clientY, `+${xp} XP`, '#4caf50');
            setTimeout(() => {
                triggerFloatingText(event.clientX, event.clientY - 30, `+${money} 🪙`, '#cda869');
            }, 200);
        }
    };

    const toggleObjective = (objectiveId, event) => {
        const current = gameState.objectives[objectiveId] || false;
        const newObjectives = { ...gameState.objectives, [objectiveId]: !current };

        let newGlobalXp = gameState.globalXP || 0;
        let newGlobalLevel = gameState.globalLevel || 1;
        let newMoney = gameState.money || 0;

        if (!current) { // If checking
            // Calculate Reward
            const { xp, money } = calculateGlobalReward('CHECKBOX');

            // Calculate Level Up
            const { newXp, newLevel, leveledUp } = calculateLevelUp(newGlobalXp + xp, newGlobalLevel);

            if (leveledUp) {
                playSound('levelUp');
                showNotification(`Уровень повышен! Теперь вы уровень ${newLevel}`, 'success');
            }

            newGlobalXp = newXp;
            newGlobalLevel = newLevel;
            newMoney += money;

            if (event) {
                triggerFloatingText(event.clientX, event.clientY, `+${xp} XP`, '#4caf50');
                setTimeout(() => {
                    triggerFloatingText(event.clientX, event.clientY - 30, `+${money} 🪙`, '#cda869');
                }, 200);
            }
        }

        saveState({
            ...gameState,
            objectives: newObjectives,
            globalXP: newGlobalXp,
            globalLevel: newGlobalLevel,
            money: newMoney
        });
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
        triggerFloatingText,
        addGlobalXP,
        ...questLogic,
        ...skillLogic,
        ...sidequestLogic
    }), [user, gameState, loading, editMode, questLogic, skillLogic]);

    return (
        <GameContext.Provider value={value}>
            {children}
            {floatingTexts.map(ft => (
                <FloatingText
                    key={ft.id}
                    x={ft.x}
                    y={ft.y}
                    text={ft.text}
                    color={ft.color}
                    onComplete={() => removeFloatingText(ft.id)}
                />
            ))}
        </GameContext.Provider>
    );
};
