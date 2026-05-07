import React, { useEffect } from 'react';

const Skeleton = ({ type = 'card', count = 1 }) => {
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes shimmer {
        0% { background-position: -200% 0; }
        100% { background-position: 200% 0; }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  const getSkeletonStyle = () => {
    switch(type) {
      case 'card':
        return {
          background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
          backgroundSize: '200% 100%',
          animation: 'shimmer 1.5s infinite',
          borderRadius: '12px',
          padding: '20px',
          height: '200px'
        };
      case 'text':
        return {
          background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
          backgroundSize: '200% 100%',
          animation: 'shimmer 1.5s infinite',
          borderRadius: '4px',
          height: '16px',
          marginBottom: '8px'
        };
      case 'avatar':
        return {
          background: 'linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%)',
          backgroundSize: '200% 100%',
          animation: 'shimmer 1.5s infinite',
          borderRadius: '50%',
          width: '50px',
          height: '50px'
        };
      default:
        return {};
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
      {Array(count).fill().map((_, i) => (
        <div key={i} style={getSkeletonStyle()} />
      ))}
    </div>
  );
};

export default Skeleton;
