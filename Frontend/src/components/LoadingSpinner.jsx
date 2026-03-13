import React from 'react';

const LoadingSpinner = ({ size = 'medium', color = '#1E3A5F' }) => {
  const sizes = {
    small: '20px',
    medium: '40px',
    large: '60px'
  };

  const spinnerSize = sizes[size] || sizes.medium;

  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '2rem',
      animation: 'fadeIn 0.3s ease'
    }}>
      <div style={{
        width: spinnerSize,
        height: spinnerSize,
        border: `4px solid ${color}20`,
        borderTopColor: color,
        borderRadius: '50%',
        animation: 'spin 1s linear infinite'
      }} />
    </div>
  );
};

export default LoadingSpinner;