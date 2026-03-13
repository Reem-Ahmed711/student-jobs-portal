import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  
  const userType = user?.role || 'student';

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const linkStyle = (path) => ({
    color: 'white',
    textDecoration: 'none',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    padding: '12px 16px',
    borderRadius: '8px',
    backgroundColor: isActive(path) ? 'rgba(255,255,255,0.15)' : 'transparent',
    transition: 'all 0.3s'
  });

  return (
    <div style={{
      width: '280px',
      background: '#0B2A4A',
      color: 'white',
      height: '100vh',
      position: 'fixed',
      padding: '24px 16px',
      display: 'flex',
      flexDirection: 'column',
      overflowY: 'auto',
      boxShadow: '2px 0 10px rgba(0,0,0,0.1)'
    }}>
      <div style={{ marginBottom: '32px', padding: '0 12px' }}>
        <h2 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '4px' }}>Student Jobs</h2>
        <p style={{ fontSize: '14px', opacity: '0.8' }}>Cairo University</p>
      </div>
      
      {/* Student Navigation */}
      {userType === 'student' && (
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, flex: 1 }}>
          <li style={{ marginBottom: '4px' }}>
            <Link to="/student-dashboard" style={linkStyle('/student-dashboard')}>
              <i className="fas fa-home" style={{ width: '20px' }}></i> Dashboard
            </Link>
          </li>
          <li style={{ marginBottom: '4px' }}>
            <Link to="/available-jobs" style={linkStyle('/available-jobs')}>
              <i className="fas fa-briefcase" style={{ width: '20px' }}></i> Available Jobs
            </Link>
          </li>
          <li style={{ marginBottom: '4px' }}>
            <Link to="/student-applications" style={linkStyle('/student-applications')}>
              <i className="fas fa-file-alt" style={{ width: '20px' }}></i> My Applications
            </Link>
          </li>
          <li style={{ marginBottom: '4px' }}>
            <Link to="/student-dashboard" style={linkStyle('/student-dashboard')}>
              <i className="fas fa-user" style={{ width: '20px' }}></i> Profile
            </Link>
          </li>
          <li style={{ marginBottom: '4px' }}>
            <Link to="/student-notifications" style={linkStyle('/student-notifications')}>
              <i className="fas fa-bell" style={{ width: '20px' }}></i> Notifications
              <span style={{
                background: '#ff4444',
                color: 'white',
                borderRadius: '50%',
                padding: '2px 6px',
                fontSize: '12px',
                marginLeft: 'auto'
              }}>12</span>
            </Link>
          </li>
          <li style={{ marginBottom: '4px' }}>
            <Link to="/student-saved-jobs" style={linkStyle('/student-saved-jobs')}>
              <i className="fas fa-bookmark" style={{ width: '20px' }}></i> Saved Jobs
            </Link>
          </li>
          <li style={{ marginBottom: '4px' }}>
            <Link to="/student-settings" style={linkStyle('/student-settings')}>
              <i className="fas fa-cog" style={{ width: '20px' }}></i> Settings
            </Link>
          </li>
        </ul>
      )}

      {/* Employer Navigation */}
      {userType === 'employer' && (
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, flex: 1 }}>
          <li style={{ marginBottom: '4px' }}>
            <Link to="/employer-dashboard" style={linkStyle('/employer-dashboard')}>
              <i className="fas fa-home" style={{ width: '20px' }}></i> Dashboard
            </Link>
          </li>
          <li style={{ marginBottom: '4px' }}>
            <Link to="/employer-post-job" style={linkStyle('/employer-post-job')}>
              <i className="fas fa-plus-circle" style={{ width: '20px' }}></i> Post New Job
            </Link>
          </li>
          <li style={{ marginBottom: '4px' }}>
            <Link to="/employer-my-jobs" style={linkStyle('/employer-my-jobs')}>
              <i className="fas fa-list" style={{ width: '20px' }}></i> My Job Postings
            </Link>
          </li>
          <li style={{ marginBottom: '4px' }}>
            <Link to="/employer-applicants" style={linkStyle('/employer-applicants')}>
              <i className="fas fa-users" style={{ width: '20px' }}></i> Applicants Pool
            </Link>
          </li>
          <li style={{ marginBottom: '4px' }}>
            <Link to="/employer-shortlisted" style={linkStyle('/employer-shortlisted')}>
              <i className="fas fa-star" style={{ width: '20px' }}></i> Shortlisted
            </Link>
          </li>
          <li style={{ marginBottom: '4px' }}>
            <Link to="/employer-ai-matching" style={linkStyle('/employer-ai-matching')}>
              <i className="fas fa-robot" style={{ width: '20px' }}></i> AI Matching
            </Link>
          </li>
          <li style={{ marginBottom: '4px' }}>
            <Link to="/employer-hiring-history" style={linkStyle('/employer-hiring-history')}>
              <i className="fas fa-history" style={{ width: '20px' }}></i> Hiring History
            </Link>
          </li>
          <li style={{ marginBottom: '4px' }}>
            <Link to="/employer-settings" style={linkStyle('/employer-settings')}>
              <i className="fas fa-cog" style={{ width: '20px' }}></i> Settings
            </Link>
          </li>
        </ul>
      )}

      {/* Admin Navigation */}
      {userType === 'admin' && (
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, flex: 1 }}>
          <li style={{ marginBottom: '4px' }}>
            <Link to="/admin-dashboard" style={linkStyle('/admin-dashboard')}>
              <i className="fas fa-home" style={{ width: '20px' }}></i> Dashboard
            </Link>
          </li>
          <li style={{ marginBottom: '4px' }}>
            <Link to="/admin-manage-users" style={linkStyle('/admin-manage-users')}>
              <i className="fas fa-users" style={{ width: '20px' }}></i> Manage Users
            </Link>
          </li>
          <li style={{ marginBottom: '4px' }}>
            <Link to="/admin-manage-jobs" style={linkStyle('/admin-manage-jobs')}>
              <i className="fas fa-briefcase" style={{ width: '20px' }}></i> Manage Jobs
            </Link>
          </li>
        </ul>
      )}

      {/* User Info & Logout */}
      <div style={{ marginTop: 'auto', borderTop: '1px solid rgba(255,255,255,0.2)', paddingTop: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '16px', padding: '0 12px' }}>
          <div style={{
            width: '40px',
            height: '40px',
            background: '#E6F0FA',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#0B2A4A',
            fontSize: '18px'
          }}>
            <i className="fas fa-user"></i>
          </div>
          <div>
            <p style={{ fontWeight: '600', marginBottom: '2px' }}>{user?.name || 'User'}</p>
            <p style={{ fontSize: '12px', opacity: '0.7' }}>{user?.email || ''}</p>
          </div>
        </div>
        <button
          onClick={handleLogout}
          style={{
            width: '100%',
            padding: '12px',
            background: 'transparent',
            color: 'white',
            border: '1px solid rgba(255,255,255,0.3)',
            borderRadius: '8px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            fontSize: '15px',
            transition: 'all 0.3s'
          }}
          onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.1)'}
          onMouseLeave={(e) => e.target.style.background = 'transparent'}
        >
          <i className="fas fa-sign-out-alt"></i> Logout
        </button>
      </div>
    </div>
  );
};

export default Navbar;