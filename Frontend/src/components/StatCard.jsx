import React, { useState, useEffect } from 'react';

const StatCard = ({ number, label, icon, change, subtext, color = '#1E3A5F' }) => {
  const [animatedNumber, setAnimatedNumber] = useState(0);

  useEffect(() => {
    const duration = 1000;
    const steps = 60;
    const increment = number / steps;
    let current = 0;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= number) {
        setAnimatedNumber(number);
        clearInterval(timer);
      } else {
        setAnimatedNumber(Math.round(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  }, [number]);

  return (
    <div className="stat-card" style={{
      background: 'white',
      borderRadius: '12px',
      padding: '1.5rem',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      display: 'flex',
      alignItems: 'center',
      gap: '1rem',
      transition: 'all 0.3s ease',
      animation: 'slideInUp 0.5s ease-out'
    }}>
      <div style={{
        width: '50px',
        height: '50px',
        background: `${color}20`,
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: color,
        fontSize: '1.5rem'
      }}>
        <i className={`fas ${icon}`}></i>
      </div>
      <div>
        <h3 style={{ fontSize: '1.8rem', color: '#1E3A5F', marginBottom: '0.25rem' }}>{animatedNumber}</h3>
        <p style={{ color: '#666', fontSize: '0.9rem', marginBottom: '0.25rem' }}>{label}</p>
        {change && (
          <small style={{ color: change > 0 ? '#16a34a' : '#ef4444', fontSize: '0.8rem' }}>
            <i className={`fas fa-arrow-${change > 0 ? 'up' : 'down'}`} style={{ marginRight: '4px', fontSize: '10px' }}></i>
            {change > 0 ? '+' : ''}{change}% this month
          </small>
        )}
        {subtext && (
          <small style={{ color: '#6b7280', fontSize: '0.8rem', display: 'block' }}>
            <i className="fas fa-clock" style={{ marginRight: '4px', fontSize: '10px' }}></i>
            {subtext}
          </small>
        )}
      </div>
    </div>
  );
};

export default StatCard;