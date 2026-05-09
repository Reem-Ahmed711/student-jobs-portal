// C:\Student-job-portal\Frontend\src\context\AuthContext.jsx
import React, { createContext, useState, useContext, useEffect, useCallback } from 'react';
import { login as apiLogin, register as apiRegister, getCurrentUser } from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within AuthProvider');
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      if (!token) {
        setLoading(false);
        return;
      }

      try {
        const response = await getCurrentUser();
        const userData = response.data?.user || response.data;
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
      } catch (err) {
        console.error('Failed to load user:', err);
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    loadUser();
  }, []);

 const login = useCallback(async (formData) => {
  setError(null);
  try {
    const response = await apiLogin(formData);
    console.log('📥 Login response FULL:', response.data);
    
    const { token, uid, name, email, role, ...rest } = response.data;
    
    console.log('🔑 Token to save:', token.substring(0, 100) + '...');
    console.log('👤 User data:', { uid, name, email, role });
    
    if (!token) {
      throw new Error('No token received from server');
    }
    
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify({ uid, name, email, role, ...rest }));
    
    setUser({ uid, name, email, role, ...rest });
    
    return { success: true, user: { uid, name, email, role } };
  } catch (err) {
    console.error('Login error:', err);
    setError(err.response?.data?.message || err.message);
    return { success: false, error: err.message };
  }
}, []);

  const register = useCallback(async (formData) => {
    setError(null);
    try {
      const response = await apiRegister(formData);
      console.log('📥 Register response:', response.data);
      
      const { token, user: userData } = response.data;
      
      if (!token || !userData) {
        throw new Error('Invalid response from server');
      }

      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      
      return { success: true, user: userData };
    } catch (err) {
      console.error('Registration error:', err);
      const errorMessage = err.response?.data?.error || err.message || 'Registration failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  }, []);

  const logout = useCallback(async () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
  }, []);

  const updateUser = useCallback((updatedData) => {
    setUser(prev => {
      const newUser = { ...prev, ...updatedData };
      localStorage.setItem('user', JSON.stringify(newUser));
      return newUser;
    });
  }, []);

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    updateUser,
    isAuthenticated: !!user,
    role: user?.role || null
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};


export default AuthContext;
