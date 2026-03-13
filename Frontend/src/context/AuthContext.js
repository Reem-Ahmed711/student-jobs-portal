// client/my-app/src/context/AuthContext.js
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
          console.log('✅ User loaded from token:', data);
          setUser(data);
        } catch (err) {
          console.error('❌ Failed to load user:', err);
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
      console.log('✅ Login successful:', data);
      localStorage.setItem('token', data.token);
      setUser(data);
      return { success: true, user: data };
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
      
      // تأكد من أن البيانات بتتناسب مع الـ backend
      const payload = {
        name: formData.fullName || formData.name,
        email: formData.email || formData.officialEmail,
        password: formData.password || formData.empPassword,
        role: formData.role || (formData.institutionName ? 'employer' : 'student'),
        department: formData.department || formData.empDepartment,
        year: formData.academicYear,
        gpa: formData.gpa,
        skills: formData.skills || [],
        phone: formData.phone || '',
        institution: formData.institutionName,
        position: formData.position
      };

      const { data } = await apiRegister(payload);
      console.log('✅ Registration successful:', data);
      localStorage.setItem('token', data.token);
      setUser(data);
      return { success: true, user: data };
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
      const { data } = await apiForgotPassword(email);
      return { success: true, message: data.message, link: data.link };
    } catch (err) {
      const errorMessage = err.response?.data?.error || 
                          err.response?.data?.message || 
                          'Failed to send reset email';
      setError(errorMessage);
      return { success: false, error: errorMessage };
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