// src/components/Navbar.jsx
import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();
  const { darkMode, toggleDarkMode } = useTheme();
  const [isOpen, setIsOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

  // Check screen size for responsive behavior
  useEffect(() => {
    const checkScreenSize = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      if (!mobile) {
        setIsOpen(true);
      } else {
        setIsOpen(false);
      }
    };
    
    checkScreenSize();
    window.addEventListener('resize', checkScreenSize);
    return () => window.removeEventListener('resize', checkScreenSize);
  }, []);

  const userType = user?.role || 'student';
  const userInitial = user?.name?.charAt(0)?.toUpperCase() || 'U';

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleNavbar = () => {
    setIsOpen(!isOpen);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  // Navigation links based on user role
  const getNavLinks = () => {
    const links = {
      student: [
        { path: '/student-dashboard', icon: 'fa-home', label: 'Dashboard' },
        { path: '/available-jobs', icon: 'fa-briefcase', label: 'Available Jobs' },
        { path: '/student-applications', icon: 'fa-file-alt', label: 'My Applications' },
        { path: '/student-profile', icon: 'fa-user', label: 'Profile' },
        { path: '/student-notifications', icon: 'fa-bell', label: 'Notifications', badge: '12' },
        { path: '/student-saved-jobs', icon: 'fa-bookmark', label: 'Saved Jobs' },
        { path: '/student-skills-cv', icon: 'fa-code', label: 'Skills & CV' },
        { path: '/student-settings', icon: 'fa-cog', label: 'Settings' }
      ],
      employer: [
        { path: '/employer-dashboard', icon: 'fa-home', label: 'Dashboard' },
        { path: '/employer-post-job', icon: 'fa-plus-circle', label: 'Post New Job' },
        { path: '/employer-my-jobs', icon: 'fa-list', label: 'My Job Postings' },
        { path: '/employer-applicants', icon: 'fa-users', label: 'Applicants Pool' },
        { path: '/employer-shortlisted', icon: 'fa-star', label: 'Shortlisted' },
        { path: '/employer-ai-matching', icon: 'fa-robot', label: 'AI Matching' },
        { path: '/employer-hiring-history', icon: 'fa-history', label: 'Hiring History' },
        { path: '/employer-settings', icon: 'fa-cog', label: 'Settings' }
      ],
      admin: [
        { path: '/admin-dashboard', icon: 'fa-home', label: 'Dashboard' },
        { path: '/admin-manage-users', icon: 'fa-users', label: 'Manage Users' },
        { path: '/admin-manage-jobs', icon: 'fa-briefcase', label: 'Manage Jobs' },
        { path: '/admin-reports', icon: 'fa-flag', label: 'Reports' },
        { path: '/admin-profile', icon: 'fa-user-shield', label: 'Profile' },
        { path: '/admin-settings', icon: 'fa-cog', label: 'Settings' }
      ]
    };
    
    return links[userType] || links.student;
  };

  const navLinks = getNavLinks();
  const navbarWidth = isOpen ? '280px' : '70px';
  const navbarPadding = isOpen ? '24px 16px' : '24px 8px';

  return (
    <>
      {/* Toggle Button */}
      <button
        onClick={toggleNavbar}
        style={{
          position: 'fixed',
          top: '20px',
          left: isOpen ? '270px' : '60px',
          zIndex: 1001,
          width: '32px',
          height: '32px',
          borderRadius: '8px',
          background: darkMode ? '#1e293b' : '#0B2A4A',
          color: 'white',
          border: `1px solid ${darkMode ? '#475569' : 'rgba(255,255,255,0.2)'}`,
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          transition: 'left 0.3s ease, background 0.3s ease',
          fontSize: '16px'
        }}
      >
        <i className={`fas fa-${isOpen ? 'chevron-left' : 'chevron-right'}`}></i>
      </button>

      {/* Navbar */}
      <nav style={{
        width: navbarWidth,
        background: darkMode ? '#0f172a' : '#0B2A4A',
        color: darkMode ? '#e2e8f0' : 'white',
        height: '100vh',
        position: 'fixed',
        top: 0,
        left: 0,
        padding: navbarPadding,
        display: 'flex',
        flexDirection: 'column',
        overflowY: 'auto',
        overflowX: 'hidden',
        boxShadow: '2px 0 10px rgba(0,0,0,0.1)',
        transition: 'all 0.3s ease',
        zIndex: 1000
      }}>
        {/* Logo Section */}
        <div style={{ 
          marginBottom: '32px', 
          padding: isOpen ? '0 12px' : '0',
          textAlign: isOpen ? 'left' : 'center'
        }}>
          {isOpen ? (
            <>
              <h2 style={{ fontSize: '22px', fontWeight: '700', marginBottom: '4px', whiteSpace: 'nowrap' }}>Student Jobs</h2>
              <p style={{ fontSize: '14px', opacity: '0.8', whiteSpace: 'nowrap' }}>Cairo University</p>
            </>
          ) : (
            <div style={{
              width: '40px',
              height: '40px',
              background: darkMode ? '#1e293b' : '#1E3A5F',
              borderRadius: '10px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              margin: '0 auto'
            }}>
              <i className="fas fa-graduation-cap" style={{ fontSize: '20px' }}></i>
            </div>
          )}
        </div>
        
        {/* Navigation Links */}
        <ul style={{ listStyle: 'none', padding: 0, margin: 0, flex: 1 }}>
          {navLinks.map((link) => (
            <li key={link.path} style={{ marginBottom: '4px' }}>
              <Link
                to={link.path}
                style={{
                  color: darkMode ? '#e2e8f0' : 'white',
                  textDecoration: 'none',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '12px',
                  padding: '12px 16px',
                  borderRadius: '8px',
                  backgroundColor: isActive(link.path) ? (darkMode ? '#334155' : 'rgba(255,255,255,0.15)') : 'transparent',
                  transition: 'all 0.3s ease',
                  position: 'relative'
                }}
                onMouseEnter={(e) => {
                  if (!isActive(link.path)) {
                    e.currentTarget.style.backgroundColor = darkMode ? '#1e293b' : 'rgba(255,255,255,0.08)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive(link.path)) {
                    e.currentTarget.style.backgroundColor = 'transparent';
                  }
                }}
              >
                <i className={`fas ${link.icon}`} style={{ width: '20px', fontSize: '18px' }}></i>
                {isOpen && <span>{link.label}</span>}
                {link.badge && isOpen && (
                  <span style={{
                    background: '#ef4444',
                    color: 'white',
                    borderRadius: '50%',
                    padding: '2px 6px',
                    fontSize: '11px',
                    marginLeft: 'auto'
                  }}>
                    {link.badge}
                  </span>
                )}
              </Link>
            </li>
          ))}
        </ul>

        {/* User Info & Actions Section */}
        <div style={{ 
          marginTop: 'auto', 
          borderTop: `1px solid ${darkMode ? '#334155' : 'rgba(255,255,255,0.2)'}`, 
          paddingTop: '20px' 
        }}>
          {/* User Info */}
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '12px', 
            marginBottom: '16px', 
            padding: isOpen ? '0 12px' : '0',
            justifyContent: isOpen ? 'flex-start' : 'center'
          }}>
            <div style={{
              width: '40px',
              height: '40px',
              background: user?.profileImage ? 'none' : (darkMode ? '#334155' : '#E6F0FA'),
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              overflow: 'hidden',
              color: darkMode ? '#e2e8f0' : '#0B2A4A',
              fontSize: '18px'
            }}>
              {user?.profileImage ? (
                <img src={user.profileImage} alt="profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <span>{userInitial}</span>
              )}
            </div>
            {isOpen && (
              <div style={{ overflow: 'hidden' }}>
                <p style={{ fontWeight: '600', marginBottom: '2px', whiteSpace: 'nowrap' }}>{user?.name || 'User'}</p>
                <p style={{ fontSize: '11px', opacity: '0.7', whiteSpace: 'nowrap' }}>{user?.email || ''}</p>
              </div>
            )}
          </div>
          
          {/* Action Buttons */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {/* Dark Mode Toggle */}
            <button
              onClick={toggleDarkMode}
              style={{
                width: '100%',
                padding: isOpen ? '12px' : '12px 0',
                background: darkMode ? '#334155' : 'rgba(255,255,255,0.1)',
                color: darkMode ? '#fbbf24' : '#fbbf24',
                border: `1px solid ${darkMode ? '#475569' : 'rgba(255,255,255,0.2)'}`,
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: isOpen ? 'center' : 'center',
                gap: isOpen ? '10px' : '0',
                fontSize: '14px',
                fontWeight: '500',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = darkMode ? '#475569' : 'rgba(255,255,255,0.2)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = darkMode ? '#334155' : 'rgba(255,255,255,0.1)';
              }}
            >
              <i className={`fas fa-${darkMode ? 'sun' : 'moon'}`} style={{ fontSize: '16px' }}></i>
              {isOpen && (darkMode ? 'Light Mode' : 'Dark Mode')}
            </button>

            {/* Logout Button */}
            <button
              onClick={handleLogout}
              style={{
                width: '100%',
                padding: isOpen ? '12px' : '12px 0',
                background: 'transparent',
                color: darkMode ? '#f87171' : '#ff6b6b',
                border: `1px solid ${darkMode ? '#7f1d1d' : 'rgba(255,255,255,0.2)'}`,
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: isOpen ? 'center' : 'center',
                gap: isOpen ? '10px' : '0',
                fontSize: '14px',
                fontWeight: '500',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = darkMode ? '#7f1d1d' : 'rgba(255,100,100,0.2)';
                e.currentTarget.style.borderColor = darkMode ? '#ef4444' : '#ff6b6b';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.borderColor = darkMode ? '#7f1d1d' : 'rgba(255,255,255,0.2)';
              }}
            >
              <i className="fas fa-sign-out-alt" style={{ fontSize: '16px' }}></i>
              {isOpen && 'Logout'}
            </button>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Navbar;
