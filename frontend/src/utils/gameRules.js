export const BASE_XP = 100;
export const BASE_MONEY = 10;

export const REWARD_TYPES = {
    METRIC: { xpMultiplier: 1, moneyMultiplier: 1 },
    CHECKBOX: { xpMultiplier: 2.5, moneyMultiplier: 1 },
    QUEST: { xpMultiplier: 10, moneyMultiplier: 10 }, // Sidequests and Main Quests
};

export const calculateGlobalReward = (type) => {
    const reward = REWARD_TYPES[type];
    if (!reward) return { xp: 0, money: 0 };

    return {
        xp: Math.floor(BASE_XP * reward.xpMultiplier),
        money: Math.floor(BASE_MONEY * reward.moneyMultiplier)
    };
};

export const calculateXpGain = (skill, daysDone) => {
    const target = skill.targetPerWeek || 3;
    const baseXP = skill.level * 100;

    let multiplier = 1;
    if (daysDone > 0) {
        // 1 check-in * roundup(days_done / days_need_to_be_done * 10)
        multiplier = Math.ceil((daysDone / target) * 10);
    }

    return {
        xpGained: baseXP * multiplier,
        multiplier
    };
};

export const calculateLevelUp = (currentXp, currentLevel) => {
    let newXp = currentXp;
    let newLevel = currentLevel;
    let leveledUp = false;

    while (newXp >= calculateXpToNextLevel(newLevel)) {
        newXp -= calculateXpToNextLevel(newLevel);
        newLevel++;
        leveledUp = true;
    }

    return { newXp, newLevel, leveledUp };
};

export const calculateXpToNextLevel = (lvl) => Math.floor(Math.pow(lvl * 1.2, 1.5) * 100);

export const calculateMoneyReward = (multiplier) => {
    return 10 * multiplier;
};
