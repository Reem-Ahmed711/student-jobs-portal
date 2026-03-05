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
      if (token) {
        try {
          const { data } = await apiGetProfile();
          setUser(data);
        } catch (err) {
          localStorage.removeItem('token');
        }
      }
      setLoading(false);
    };
    loadUser();
  }, []);

  const login = async (formData) => {
    try {
      setError(null);
      const { data } = await apiLogin(formData);
      localStorage.setItem('token', data.token);
      setUser(data);
      return { success: true, user: data };
    } catch (err) {
      setError(err.response?.data?.error || 'Login failed');
      return { success: false, error: err.response?.data?.error };
    }
  };

  const register = async (formData) => {
    try {
      setError(null);
      const { data } = await apiRegister(formData);
      localStorage.setItem('token', data.token);
      setUser(data);
      return { success: true, user: data };
    } catch (err) {
      setError(err.response?.data?.error || 'Registration failed');
      return { success: false, error: err.response?.data?.error };
    }
  };

  const forgotPassword = async (email) => {
    try {
      setError(null);
      const { data } = await apiForgotPassword(email);
      return { success: true, message: data.message, link: data.link };
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to send reset email');
      return { success: false, error: err.response?.data?.error };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    forgotPassword,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};