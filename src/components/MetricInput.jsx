import React, { useState } from 'react';

const MetricInput = ({ metric, currentValue, onUpdate, disabled = false }) => {
    const [inputValue, setInputValue] = useState('1');

    const handleAdd = () => {
        if (disabled) return;
        const val = parseInt(inputValue, 10);
        if (!isNaN(val)) {
            onUpdate(currentValue + val);
            setInputValue('1');
        }
    };

    const handleSet = () => {
        if (disabled) return;
        const val = parseInt(inputValue, 10);
        if (!isNaN(val)) {
            onUpdate(val);
            setInputValue('1');
        }
    };

    const isLimited = metric.type === 'limited';
    const progress = isLimited ? Math.min((currentValue / metric.target) * 100, 100) : 0;

    return (
        <div style={{ marginBottom: '15px', background: 'rgba(0,0,0,0.3)', padding: '10px', borderRadius: '4px', opacity: disabled ? 0.4 : 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
                <span style={{ color: disabled ? '#666' : '#ddd' }}>{metric.label}</span>
                <span style={{ color: disabled ? '#666' : '#cda869' }}>
                    {currentValue} {isLimited ? `/ ${metric.target} ` : ''}
                </span>
            </div>

            {isLimited && (
                <div style={{ width: '100%', height: '4px', background: '#333', marginBottom: '10px' }}>
                    <div style={{ width: `${progress}% `, height: '100%', background: disabled ? '#555' : '#cda869', transition: 'width 0.3s' }} />
                </div>
            )}

            <div style={{ display: 'flex', gap: '5px' }}>
                <input
                    type="number"
                    value={inputValue}
                    onChange={(e) => !disabled && setInputValue(e.target.value)}
                    placeholder="#"
                    style={{ width: '60px' }}
                    disabled={disabled}
                />
                <button onClick={handleAdd} style={{ fontSize: '0.8rem', padding: '4px 8px' }} disabled={disabled}>+ ДОБАВИТЬ</button>
                <button onClick={handleSet} style={{ fontSize: '0.8rem', padding: '4px 8px' }} disabled={disabled}>УСТАНОВИТЬ</button>
            </div>
        </div>
    );
};

export default MetricInput;
