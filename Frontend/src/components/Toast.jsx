import React, { useEffect } from 'react';

const Toast = ({ message, type = 'success', onClose, duration = 3000 }) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, duration);
    return () => clearTimeout(timer);
  }, [duration, onClose]);

  const getIcon = () => {
    switch(type) {
      case 'success': return 'fa-check-circle';
      case 'error': return 'fa-exclamation-circle';
      case 'warning': return 'fa-exclamation-triangle';
      case 'info': return 'fa-info-circle';
      default: return 'fa-bell';
    }
  };

  const getColors = () => {
    switch(type) {
      case 'success': return { bg: '#d4edda', border: '#c3e6cb', color: '#155724', icon: '#28a745' };
      case 'error': return { bg: '#f8d7da', border: '#f5c6cb', color: '#721c24', icon: '#dc3545' };
      case 'warning': return { bg: '#fff3cd', border: '#ffeeba', color: '#856404', icon: '#ffc107' };
      default: return { bg: '#d1ecf1', border: '#bee5eb', color: '#0c5460', icon: '#17a2b8' };
    }
  };

  const colors = getColors();

  return (
    <div style={{
      position: 'fixed',
      top: '20px',
      right: '20px',
      zIndex: 9999,
      animation: 'slideInRight 0.3s ease-out'
    }}>
      <div style={{
        background: colors.bg,
        borderLeft: `4px solid ${colors.icon}`,
        borderRadius: '8px',
        padding: '16px 24px',
        minWidth: '300px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <i className={`fas ${getIcon()}`} style={{ color: colors.icon, fontSize: '20px' }}></i>
        <div style={{ flex: 1 }}>
          <p style={{ margin: 0, color: colors.color, fontSize: '14px' }}>{message}</p>
        </div>
        <button
          onClick={onClose}
          style={{
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            color: colors.color,
            fontSize: '16px'
          }}
        >
          <i className="fas fa-times"></i>
        </button>
      </div>
    </div>
  );
};

export default Toast;
