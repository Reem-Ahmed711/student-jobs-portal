import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = ({ userType }) => {
  const navigate = useNavigate();

  const handleLogout = () => {
    navigate('/');
  };

  return (
    <div style={{
      width: '250px',
      background: '#0B2A4A',
      color: 'white',
      height: '100vh',
      position: 'fixed',
      padding: '20px',
      display: 'flex',
      flexDirection: 'column'
    }}>
      <h2 style={{ marginBottom: '30px', fontSize: '20px' }}>Student Jobs Portal</h2>
      
      {userType === 'student' && (
        <ul style={{ listStyle: 'none', padding: 0, flex: 1 }}>
          <li style={{ marginBottom: '20px' }}>
            <Link to="/student-profile" style={{ color: 'white', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <i className="fas fa-home"></i> Dashboard
            </Link>
          </li>
          <li style={{ marginBottom: '20px' }}>
            <Link to="/student-available-jobs" style={{ color: 'white', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <i className="fas fa-briefcase"></i> Available Jobs
            </Link>
          </li>
          <li style={{ marginBottom: '20px' }}>
            <Link to="/student-applications" style={{ color: 'white', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <i className="fas fa-file-alt"></i> My Applications
            </Link>
          </li>
          <li style={{ marginBottom: '20px' }}>
            <Link to="/student-profile" style={{ color: 'white', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <i className="fas fa-user"></i> Profile
            </Link>
          </li>
        </ul>
      )}

      {userType === 'admin' && (
        <ul style={{ listStyle: 'none', padding: 0, flex: 1 }}>
          <li style={{ marginBottom: '20px' }}>
            <Link to="/admin-profile" style={{ color: 'white', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <i className="fas fa-home"></i> Dashboard
            </Link>
          </li>
          <li style={{ marginBottom: '20px' }}>
            <Link to="/admin-manage-users" style={{ color: 'white', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <i className="fas fa-users"></i> Manage Users
            </Link>
          </li>
          <li style={{ marginBottom: '20px' }}>
            <Link to="/admin-manage-jobs" style={{ color: 'white', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <i className="fas fa-briefcase"></i> Manage Jobs
            </Link>
          </li>
        </ul>
      )}

      {/* Logout Button */}
      <button
        onClick={handleLogout}
        style={{
          width: '100%',
          padding: '12px',
          background: 'transparent',
          color: 'white',
          border: '1px solid white',
          borderRadius: '6px',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '10px',
          marginTop: 'auto'
        }}
      >
        <i className="fas fa-sign-out-alt"></i> Logout
      </button>
    </div>
  );
};

export default Navbar;