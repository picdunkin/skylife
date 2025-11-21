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
    acts: ACTS, // Now storing acts in state
    skills: [], // { id, title, targetPerWeek, level, xp, history: [{date, count}] }
    money: 0 // Septims
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

    // Skills Logic
    const addSkill = (skill) => {
        const newSkills = [...(gameState.skills || []), {
            ...skill,
            id: `skill-${Date.now()}`,
            level: 1,
            xp: 0,
            history: []
        }];
        saveState({ ...gameState, skills: newSkills });
    };

    const updateSkill = (skillId, updates) => {
        const newSkills = (gameState.skills || []).map(skill =>
            skill.id === skillId ? { ...skill, ...updates } : skill
        );
        saveState({ ...gameState, skills: newSkills });
    };

    const deleteSkill = (skillId) => {
        const newSkills = (gameState.skills || []).filter(skill => skill.id !== skillId);
        saveState({ ...gameState, skills: newSkills });
    };

    const checkInSkill = (skillId) => {
        const skill = (gameState.skills || []).find(s => s.id === skillId);
        if (!skill) return;

        const today = new Date().toISOString().split('T')[0];

        // Check if already checked in today
        // Actually, user might want to check in multiple times? 
        // "1 чек ин = ..." implies discrete events. 
        // But usually habits are once a day. 
        // Let's assume multiple check-ins are allowed if the user wants, 
        // but for "days of week" tracking we usually care about unique days.
        // However, the formula relies on "WeeklyCount".

        // Let's calculate Weekly Count based on history in the last 7 days.
        const oneWeekAgo = new Date();
        oneWeekAgo.setDate(oneWeekAgo.getDate() - 6); // Last 7 days including today

        const recentCheckIns = (skill.history || []).filter(h => new Date(h.date) >= oneWeekAgo);

        // Count unique days or total check-ins? 
        // "допустим надо ходить 3 раза из 7 это 100%" -> "1 раз мы даем... 2 раз мы даем..."
        // This implies count of check-ins in the current week/period.
        // Let's use total check-ins in the last 7 days (sliding window) or current calendar week?
        // Usually "per week" means Monday-Sunday.
        // Let's stick to Monday-Sunday for "Weekly Count".

        const getMonday = (d) => {
            d = new Date(d);
            const day = d.getDay(),
                diff = d.getDate() - day + (day === 0 ? -6 : 1); // adjust when day is sunday
            return new Date(d.setDate(diff));
        };

        const monday = getMonday(new Date());
        monday.setHours(0, 0, 0, 0);

        const thisWeekCheckIns = (skill.history || []).filter(h => new Date(h.date) >= monday);
        const daysDone = thisWeekCheckIns.length;
        const target = skill.targetPerWeek || 3;

        // XP Formula
        // 1 check-in = 100 * LEVEL
        const baseXP = skill.level * 100;

        let multiplier = 1;
        if (daysDone > 0) {
            // 1 check-in * roundup(days_done / days_need_to_be_done * 10)
            multiplier = Math.ceil((daysDone / target) * 10);
        }

        const xpGained = baseXP * multiplier;

        // Level Up Logic
        // XP_TO_LEVEL = ((CURRENT_LEVEL * 1.2) ^ 1.5) * 100
        let newXP = skill.xp + xpGained;
        let newLevel = skill.level;

        const xpToNextLevel = (lvl) => Math.floor(Math.pow(lvl * 1.2, 1.5) * 100);

        while (newXP >= xpToNextLevel(newLevel)) {
            newXP -= xpToNextLevel(newLevel);
            newLevel++;
            playSound('levelUp');
        }

        // Money Reward (Septims)
        // Let's keep it proportional to multiplier? User didn't specify change for money.
        // "также даются септимы за чек ин"
        // Let's keep 10 * multiplier for now.
        const moneyGained = 10 * multiplier;

        const newHistory = [...(skill.history || []), { date: new Date().toISOString(), xp: xpGained }];

        const newSkills = gameState.skills.map(s =>
            s.id === skillId ? {
                ...s,
                xp: newXP,
                level: newLevel,
                history: newHistory
            } : s
        );

        const newMoney = (gameState.money || 0) + moneyGained;

        saveState({ ...gameState, skills: newSkills, money: newMoney });
        playSound('checkbox');
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
        deleteQuest,
        addSkill,
        updateSkill,
        deleteSkill,
        checkInSkill
    };

    return (
        <GameContext.Provider value={value}>
            {children}
        </GameContext.Provider>
    );
};
