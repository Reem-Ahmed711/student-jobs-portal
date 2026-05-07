// src/components/Layout.jsx
import React from 'react';
import Navbar from './Navbar';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import LoadingSpinner from './LoadingSpinner';

const Layout = ({ children }) => {
  const { loading } = useAuth();
  const { darkMode } = useTheme();

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

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Navbar />
      <main style={{
        flex: 1,
        marginLeft: '280px', // Fixed margin for navbar
        padding: '30px',
        background: darkMode ? '#0f172a' : '#f8fafc',
        minHeight: '100vh',
        transition: 'all 0.3s ease'
      }}>
        {children}
      </main>
    </div>
  );
};

export default Layout;
