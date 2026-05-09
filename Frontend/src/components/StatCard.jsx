// C:\Student-job-portal\Frontend\src\components\StatCard.jsx
import React, { useState, useEffect } from 'react';
import { useTheme } from '../context/ThemeContext';

const StatCard = ({ 
  number, 
  label, 
  icon, 
  change, 
  subtext, 
  color = '#1E3A5F',
  trend = null,
  isLoading = false,
  onClick = null,
  size = 'medium',
  showIcon = true,
  target = null
}) => {
  const { darkMode } = useTheme();
  const [animatedNumber, setAnimatedNumber] = useState(0);
  const [showDetail, setShowDetail] = useState(false);

  useEffect(() => {
    if (!isLoading && number !== undefined && number !== null) {
      animateNumber();
    }
  }, [number, isLoading]);

  const animateNumber = () => {
    const duration = 1000;
    const steps = 60;
    const numericValue = parseFloat(number) || 0;
    const increment = numericValue / steps;
    let current = 0;
    let step = 0;
    
    const timer = setInterval(() => {
      step++;
      current += increment;
      if (step >= steps) {
        setAnimatedNumber(numericValue);
        clearInterval(timer);
      } else {
        setAnimatedNumber(Math.round(current));
      }
    }, duration / steps);

    return () => clearInterval(timer);
  };

  const getTrendColor = () => {
    if (trend === 'up') return '#10b981';
    if (trend === 'down') return '#ef4444';
    return color;
  };

  const getTrendIcon = () => {
    if (trend === 'up') return 'fa-arrow-up';
    if (trend === 'down') return 'fa-arrow-down';
    return 'fa-chart-line';
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num;
  };

  const sizeStyles = {
    small: { padding: '12px', iconSize: '30px', fontSize: '20px', gap: '12px' },
    medium: { padding: '20px', iconSize: '50px', fontSize: '28px', gap: '15px' },
    large: { padding: '28px', iconSize: '65px', fontSize: '36px', gap: '20px' }
  };

  const currentSize = sizeStyles[size] || sizeStyles.medium;

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="stat-card" style={{
        background: darkMode ? '#1e293b' : 'white',
        borderRadius: '16px',
        padding: currentSize.padding,
        boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
        animation: 'pulse 1.5s infinite'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: currentSize.gap }}>
          <div style={{
            width: currentSize.iconSize,
            height: currentSize.iconSize,
            background: darkMode ? '#334155' : '#e0e0e0',
            borderRadius: '12px'
          }} />
          <div style={{ flex: 1 }}>
            <div style={{ width: '70%', height: '24px', background: darkMode ? '#334155' : '#e0e0e0', borderRadius: '4px', marginBottom: '8px' }} />
            <div style={{ width: '50%', height: '14px', background: darkMode ? '#334155' : '#e0e0e0', borderRadius: '4px' }} />
          </div>
        </div>
      </div>
    );
  }

  const displayNumber = typeof number === 'string' && number.includes('%') 
    ? `${animatedNumber}%` 
    : formatNumber(animatedNumber);

  return (
    <div 
      className="stat-card"
      onClick={() => {
        if (onClick) onClick();
        setShowDetail(!showDetail);
      }}
      style={{
        background: darkMode ? '#1e293b' : 'white',
        borderRadius: '20px',
        padding: currentSize.padding,
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.08)',
        display: 'flex',
        flexDirection: 'column',
        transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
        cursor: onClick ? 'pointer' : 'default',
        position: 'relative',
        overflow: 'hidden',
        border: `1px solid ${darkMode ? '#334155' : 'transparent'}`
      }}
      onMouseEnter={(e) => {
        if (onClick) {
          e.currentTarget.style.transform = 'translateY(-4px)';
          e.currentTarget.style.boxShadow = '0 20px 25px -12px rgba(0,0,0,0.15)';
        }
      }}
      onMouseLeave={(e) => {
        if (onClick) {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
        }
      }}
    >
      {/* Animated gradient background on hover */}
      {onClick && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: `linear-gradient(135deg, ${color}10, transparent)`,
          opacity: 0,
          transition: 'opacity 0.3s ease',
          pointerEvents: 'none'
        }}
        onMouseEnter={(e) => e.currentTarget.style.opacity = '1'}
        onMouseLeave={(e) => e.currentTarget.style.opacity = '0'} />
      )}

      {/* Top Row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' }}>
        {showIcon && (
          <div style={{
            width: currentSize.iconSize,
            height: currentSize.iconSize,
            background: `${color}15`,
            borderRadius: '16px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: color,
            transition: 'transform 0.3s ease'
          }}>
            <i className={`fas ${icon}`} style={{ fontSize: `calc(${currentSize.fontSize} * 0.8)` }}></i>
          </div>
        )}
        
        {trend && (
          <div style={{
            background: `${getTrendColor()}15`,
            color: getTrendColor(),
            padding: '4px 10px',
            borderRadius: '30px',
            fontSize: '11px',
            fontWeight: '600',
            display: 'flex',
            alignItems: 'center',
            gap: '4px'
          }}>
            <i className={`fas ${getTrendIcon()}`} style={{ fontSize: '10px' }}></i>
            {trend === 'up' ? '上升' : trend === 'down' ? '下降' : '稳定'}
          </div>
        )}
      </div>

      {/* Number and Label */}
      <div>
        <h3 style={{ 
          fontSize: currentSize.fontSize, 
          fontWeight: '700', 
          color: darkMode ? '#f1f5f9' : '#1E3A5F', 
          marginBottom: '8px',
          fontFamily: "'Inter', 'Segoe UI', sans-serif"
        }}>
          {displayNumber}
        </h3>
        <p style={{ 
          color: darkMode ? '#94a3b8' : '#666', 
          fontSize: '14px', 
          fontWeight: '500',
          marginBottom: change || subtext ? '8px' : '0'
        }}>
          {label}
        </p>
        
        {/* Change Indicator */}
        {change && (
          <small style={{ 
            color: change > 0 ? '#10b981' : '#ef4444', 
            fontSize: '12px',
            fontWeight: '500',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '4px',
            background: `${change > 0 ? '#10b981' : '#ef4444'}10`,
            padding: '2px 8px',
            borderRadius: '30px'
          }}>
            <i className={`fas fa-arrow-${change > 0 ? 'up' : 'down'}`} style={{ fontSize: '10px' }}></i>
            {change > 0 ? '+' : ''}{change}%
          </small>
        )}

        {/* Subtext */}
        {subtext && (
          <small style={{ 
            color: darkMode ? '#94a3b8' : '#6b7280', 
            fontSize: '11px', 
            display: 'block',
            marginTop: '8px'
          }}>
            <i className="fas fa-clock" style={{ marginRight: '4px', fontSize: '10px' }}></i>
            {subtext}
          </small>
        )}
      </div>

      {/* Detail Popup (on click) */}
      {showDetail && onClick && (
        <div style={{
          position: 'absolute',
          bottom: '100%',
          left: '50%',
          transform: 'translateX(-50%)',
          marginBottom: '10px',
          background: darkMode ? '#1e293b' : 'white',
          borderRadius: '12px',
          padding: '12px 16px',
          boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
          zIndex: 100,
          minWidth: '180px',
          whiteSpace: 'nowrap',
          border: `1px solid ${darkMode ? '#475569' : '#e0e0e0'}`
        }}
        onMouseLeave={() => setShowDetail(false)}>
          <p style={{ fontSize: '13px', fontWeight: '600', marginBottom: '5px', color: darkMode ? '#f1f5f9' : '#1E3A5F' }}>
            <i className={`fas ${icon}`} style={{ marginRight: '6px' }}></i>
            {label} Details
          </p>
          <p style={{ fontSize: '12px', color: darkMode ? '#94a3b8' : '#666' }}>
            Current: {displayNumber}<br/>
            {target && `Target: ${target}`}
          </p>
          <div style={{ 
            position: 'absolute',
            bottom: '-6px',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '12px',
            height: '12px',
            background: darkMode ? '#1e293b' : 'white',
            borderRight: `1px solid ${darkMode ? '#475569' : '#e0e0e0'}`,
            borderBottom: `1px solid ${darkMode ? '#475569' : '#e0e0e0'}`,
            transform: 'translateX(-50%) rotate(45deg)'
          }} />
        </div>
      )}

      <style>{`
        @keyframes slideInUp {
          from {
            transform: translateY(20px);
            opacity: 0;
          }
          to {
            transform: translateY(0);
            opacity: 1;
          }
        }
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.5; }
          100% { opacity: 1; }
        }
        .stat-card {
          animation: slideInUp 0.5s ease-out;
        }
      `}</style>
    </div>
  );
};

export default StatCard;
