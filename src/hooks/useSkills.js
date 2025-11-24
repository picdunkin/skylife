import { getMonday, getTodayISO } from '../utils/dateUtils';
import { calculateXpGain, calculateLevelUp, calculateMoneyReward } from '../utils/gameRules';

export const useSkills = (gameState, saveState, playSound, triggerFloatingText) => {

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

    const checkInSkill = (skillId, event) => {
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

        // Calculate Level Up (Skill)
        const { newXp: newSkillXp, newLevel: newSkillLevel, leveledUp: skillLeveledUp } = calculateLevelUp(skill.xp + xpGained, skill.level);

        if (skillLeveledUp) {
            playSound('levelUp');
        } else {
            playSound('checkbox');
        }

        // Calculate Money
        const moneyGained = calculateMoneyReward(multiplier);

        // Calculate Global Level Up
        // "XP for checkin should also be added to global level"
        const { newXp: newGlobalXp, newLevel: newGlobalLevel, leveledUp: globalLeveledUp } = calculateLevelUp((gameState.globalXP || 0) + xpGained, (gameState.globalLevel || 1));

        if (globalLeveledUp) {
            // If both level up, play sound again or rely on the first one?
            // Usually one sound is enough, but maybe a notification.
            // GameContext handles global level up notification if we used addGlobalXP, but here we calculate manually to batch updates.
            // Let's just play sound if skill didn't level up, to avoid double sound.
            if (!skillLeveledUp) playSound('levelUp');
        }

        const newHistory = [...(skill.history || []), { date: new Date().toISOString(), xp: xpGained }];

        const newSkills = gameState.skills.map(s =>
            s.id === skillId ? {
                ...s,
                xp: newSkillXp,
                level: newSkillLevel,
                history: newHistory
            } : s
        );

        const newMoney = (gameState.money || 0) + moneyGained;

        saveState({
            ...gameState,
            skills: newSkills,
            money: newMoney,
            globalXP: newGlobalXp,
            globalLevel: newGlobalLevel
        });

        if (event && triggerFloatingText) {
            triggerFloatingText(event.clientX, event.clientY, `+${xpGained} XP`, '#4caf50');
            setTimeout(() => {
                triggerFloatingText(event.clientX, event.clientY - 30, `+${moneyGained} 🪙`, '#cda869');
            }, 200);
        }
    };

    return {
        addSkill,
        updateSkill,
        deleteSkill,
        checkInSkill
    };
};
