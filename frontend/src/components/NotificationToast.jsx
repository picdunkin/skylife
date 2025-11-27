import React from 'react';

const NotificationToast = ({ message, type, onClose }) => {
    const styles = {
        position: 'fixed',
        top: '20px',
        right: '20px',
        background: 'rgba(0, 0, 0, 0.9)',
        border: '2px solid #cda869',
        padding: '15px 25px',
        color: '#fff',
        zIndex: 10000,
        boxShadow: '0 0 15px rgba(0,0,0,0.8)',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        animation: 'slideIn 0.3s ease-out',
        maxWidth: '300px'
    };

    const icon = type === 'error' ? '❌' : (type === 'success' ? '✅' : 'ℹ️');

    return (
        <div style={styles} onClick={onClose}>
            <span style={{ fontSize: '1.2rem' }}>{icon}</span>
            <span style={{ fontFamily: 'Trajan Pro, serif' }}>{message}</span>
            <style>{`
                @keyframes slideIn {
                    from { transform: translateX(100%); opacity: 0; }
                    to { transform: translateX(0); opacity: 1; }
                }
            `}</style>
        </div>
    );
};

export default NotificationToast;
