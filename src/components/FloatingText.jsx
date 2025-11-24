import React, { useEffect, useState } from 'react';

const FloatingText = ({ x, y, text, color = '#cda869', onComplete }) => {
    const [visible, setVisible] = useState(true);
    const [position, setPosition] = useState({ x, y });

    useEffect(() => {
        const timer = setTimeout(() => {
            setVisible(false);
            if (onComplete) onComplete();
        }, 1500); // Duration of animation

        const interval = setInterval(() => {
            setPosition(prev => ({ ...prev, y: prev.y - 1 })); // Move up
        }, 16);

        return () => {
            clearTimeout(timer);
            clearInterval(interval);
        };
    }, [onComplete]);

    if (!visible) return null;

    return (
        <div style={{
            position: 'fixed',
            left: position.x,
            top: position.y,
            color: color,
            fontWeight: 'bold',
            fontSize: '1.2rem',
            pointerEvents: 'none',
            textShadow: '1px 1px 2px black',
            zIndex: 9999,
            opacity: visible ? 1 : 0,
            transition: 'opacity 0.5s ease-out',
            transform: 'translate(-50%, -50%)' // Center on coordinates
        }}>
            {text}
        </div>
    );
};

export default FloatingText;
