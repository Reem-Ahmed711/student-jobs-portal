import React from 'react';

const ProfileCard = () => {
  return (
    <div className="card" style={{
      padding: '20px',
      background: 'white',
      borderRadius: '10px'
    }}>
      <h3 style={{ color: 'var(--navy)', marginBottom: '15px' }}>Student Information</h3>
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
        <div style={{
          width: '80px',
          height: '80px',
          background: 'var(--light-blue)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '40px'
        }}>
          <i className="fas fa-user-graduate"></i>
        </div>
        <div>
          <h4>Reem Ahmed</h4>
          <p>Computer Science - 3rd Year</p>
          <p>GPA: 3.7</p>
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;