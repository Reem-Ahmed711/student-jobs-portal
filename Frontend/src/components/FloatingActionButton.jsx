import React, { useState } from 'react';

const FloatingActionButton = ({ actions }) => {
  const [open, setOpen] = useState(false);

  return (
    <div style={{ position: 'fixed', bottom: '30px', right: '30px', zIndex: 1000 }}>
      {open && actions.map((action, index) => (
        <button
          key={index}
          onClick={action.onClick}
          style={{
            position: 'absolute',
            bottom: '70px',
            right: `${index * 60}px`,
            width: '50px',
            height: '50px',
            borderRadius: '50%',
            background: action.color || '#1E3A5F',
            color: 'white',
            border: 'none',
            cursor: 'pointer',
            animation: 'fadeIn 0.2s ease-out',
            transform: `translateX(${index * -60}px)`,
            boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
          }}
        >
          <i className={`fas ${action.icon}`}></i>
        </button>
      ))}
      
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #1E3A5F 0%, #2a4a7a 100%)',
          color: 'white',
          border: 'none',
          cursor: 'pointer',
          boxShadow: '0 4px 15px rgba(30,58,95,0.4)',
          transition: 'transform 0.3s ease'
        }}
      >
        <i className={`fas fa-${open ? 'times' : 'plus'}`} style={{ fontSize: '24px' }}></i>
      </button>
    </div>
  );
};

export default FloatingActionButton;
