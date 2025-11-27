// Sound utility for playing game sounds
const sounds = {
    checkbox: new Audio('/assets/sounds/checkbox.mp3'),
    metricsChange: new Audio('/assets/sounds/metics-change.mp3'),
    questDone: new Audio('/assets/sounds/quest-done.mp3')
};

// Preload sounds
Object.values(sounds).forEach(sound => {
    sound.preload = 'auto';
});

export const playSound = (soundName) => {
    const sound = sounds[soundName];
    if (sound) {
        sound.currentTime = 0; // Reset to start
        sound.play().catch(err => {
            console.log('Sound play failed:', err);
        });
    }
};

export default { playSound };
