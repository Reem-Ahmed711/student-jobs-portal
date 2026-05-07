// C:\Student-job-portal\Frontend\src\context\ThemeContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => useContext(ThemeContext);

export const ThemeProvider = ({ children }) => {
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    return saved === 'true';
  });

  useEffect(() => {
    localStorage.setItem('darkMode', darkMode);
    
    // Apply dark mode to body
    if (darkMode) {
      document.body.style.backgroundColor = '#0f172a';
      document.body.style.color = '#e2e8f0';
      document.documentElement.classList.add('dark-mode');
    } else {
      document.body.style.backgroundColor = '#f8fafc';
      document.body.style.color = '#334155';
      document.documentElement.classList.remove('dark-mode');
    }
    
    // Force re-render of all components
    window.dispatchEvent(new Event('themechange'));
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode(prev => !prev);

  return (
    <ThemeContext.Provider value={{ darkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
};
