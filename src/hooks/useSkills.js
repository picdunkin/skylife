import { getMonday, getTodayISO } from '../utils/dateUtils';
import { calculateXpGain, calculateLevelUp, calculateMoneyReward } from '../utils/gameRules';

export const useSkills = (gameState, saveState, playSound) => {

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

        // Check if already checked in today
        const today = new Date();
        const isCheckedInToday = (skill.history || []).some(h => {
            const hDate = new Date(h.date);
            return hDate.getDate() === today.getDate() &&
                hDate.getMonth() === today.getMonth() &&
                hDate.getFullYear() === today.getFullYear();
        });

        if (isCheckedInToday) return;

        const monday = getMonday(new Date());
        monday.setHours(0, 0, 0, 0);

        const thisWeekCheckIns = (skill.history || []).filter(h => new Date(h.date) >= monday);
        const uniqueDays = new Set(thisWeekCheckIns.map(h => new Date(h.date).toDateString())).size;
        const daysDone = uniqueDays;

        // Calculate XP
        const { xpGained, multiplier } = calculateXpGain(skill, daysDone);

        // Calculate Level Up
        const { newXp, newLevel, leveledUp } = calculateLevelUp(skill.xp + xpGained, skill.level);

        if (leveledUp) {
            playSound('levelUp');
        } else {
            playSound('checkbox');
        }

        // Calculate Money
        const moneyGained = calculateMoneyReward(multiplier);

        const newHistory = [...(skill.history || []), { date: new Date().toISOString(), xp: xpGained }];

        const newSkills = gameState.skills.map(s =>
            s.id === skillId ? {
                ...s,
                xp: newXp,
                level: newLevel,
                history: newHistory
            } : s
        );

        const newMoney = (gameState.money || 0) + moneyGained;

        saveState({ ...gameState, skills: newSkills, money: newMoney });
    };

    return {
        addSkill,
        updateSkill,
        deleteSkill,
        checkInSkill
    };
};
