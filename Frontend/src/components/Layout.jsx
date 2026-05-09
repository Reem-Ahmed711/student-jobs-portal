// C:\Student-job-portal\Frontend\src\components\Layout.jsx
import React, { useState, useEffect } from 'react';
import Navbar from './Navbar';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import LoadingSpinner from './LoadingSpinner';

const Layout = ({ children }) => {
  const { loading } = useAuth();
  const { darkMode } = useTheme();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [navbarWidth, setNavbarWidth] = useState(280);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    const handleNavbarChange = (event) => {
      if (event.detail?.width) {
        setNavbarWidth(event.detail.width);
      }
    };
    
    window.addEventListener('resize', handleResize);
    window.addEventListener('navbarChange', handleNavbarChange);
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('navbarChange', handleNavbarChange);
    };
  }, []);

  if (loading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        background: darkMode ? '#0f172a' : '#f8fafc'
      }}>
        <LoadingSpinner size="large" />
      </div>
    );
  }

  const marginLeft = isMobile ? 0 : navbarWidth;

  return (
    <div style={{ minHeight: '100vh', background: darkMode ? '#0f172a' : '#f8fafc' }}>
      <Navbar />
      <main style={{
        marginLeft: `${marginLeft}px`,
        padding: '30px',
        transition: 'margin-left 0.3s ease',
        minHeight: '100vh',
        width: `calc(100% - ${marginLeft}px)`,
        background: darkMode ? '#0f172a' : '#f8fafc'
      }}>
        {children}
      </main>
    </div>
  );
};

export default Layout;
