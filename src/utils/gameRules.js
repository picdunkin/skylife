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
