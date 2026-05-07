// src/context/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import { 
  login as apiLogin, 
  register as apiRegister,
  forgotPassword as apiForgotPassword,
  getProfile as apiGetProfile
} from '../services/api';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('token');
      const savedRole = localStorage.getItem('userRole');
      
      if (token) {
        try {
          const response = await apiGetProfile();
          // Handle different response structures
          let userData = response.data;
          if (response.data?.data) userData = response.data.data;
          if (response.data?.user) userData = response.data.user;
          
          const role = savedRole || userData.role || 'student';
          setUser({ ...userData, role });
          console.log('✅ User loaded, role:', role);
        } catch (err) {
          console.error('❌ Failed to load user:', err);
          localStorage.removeItem('token');
          localStorage.removeItem('userRole');
        }
      }
      setLoading(false);
    };
    loadUser();
  }, []);

  const login = async (formData) => {
    try {
      setError(null);
      const response = await apiLogin(formData);
      let userData = response.data;
      if (response.data?.data) userData = response.data.data;
      
      let userRole = userData.role;
      if (!userRole) {
        if (userData.email?.includes('admin')) {
          userRole = 'admin';
        } else if (userData.email?.includes('@cu.edu.eg')) {
          userRole = 'employer';
        } else {
          userRole = 'student';
        }
      }
      
      const finalUserData = { ...userData, role: userRole };
      console.log('👤 User role set to:', userRole);
      
      localStorage.setItem('token', userData.token || response.data.token);
      localStorage.setItem('userRole', userRole);
      setUser(finalUserData);
      
      return { success: true, user: finalUserData };
    } catch (err) {
      console.error('❌ Login failed:', err);
      const errorMessage = err.response?.data?.error || 
                          err.response?.data?.message || 
                          'Login failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const register = async (formData) => {
    try {
      setError(null);
      console.log('📝 Sending registration data:', formData);
      
      const response = await apiRegister(formData);
      let userData = response.data;
      if (response.data?.data) userData = response.data.data;
      
      const finalUserData = { ...userData, role: userData.role || 'student' };
      
      localStorage.setItem('token', userData.token || response.data.token);
      localStorage.setItem('userRole', finalUserData.role);
      setUser(finalUserData);
      
      return { success: true, user: finalUserData };
    } catch (err) {
      console.error('❌ Registration failed:', err);
      const errorMessage = err.response?.data?.error || 
                          err.response?.data?.message || 
                          'Registration failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const forgotPassword = async (email) => {
    try {
      setError(null);
      const response = await apiForgotPassword(email);
      return { success: true, message: response.data.message, link: response.data.link };
    } catch (err) {
      const errorMessage = err.response?.data?.error || 
                          err.response?.data?.message || 
                          'Failed to send reset email';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const updateUser = async (updatedData) => {
    try {
      setUser(prev => ({ ...prev, ...updatedData }));
      localStorage.setItem('user', JSON.stringify({ ...user, ...updatedData }));
      return { success: true };
    } catch (error) {
      console.error('Error updating user:', error);
      return { success: false, error: error.message };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userRole');
    localStorage.removeItem('user');
    setUser(null);
  };

  const value = {
    user,
    setUser,
    updateUser,
    loading,
    error,
    login,
    register,
    forgotPassword,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
