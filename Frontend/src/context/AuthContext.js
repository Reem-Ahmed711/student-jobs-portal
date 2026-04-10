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
          const { data } = await apiGetProfile();
          // Use saved role if available, otherwise from API
          const role = savedRole || data.role || 'student';
          setUser({ ...data, role });
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
      const { data } = await apiLogin(formData);
      console.log('✅ Login API response:', data);
      
      // Determine role based on email
      let userRole = data.role;
      if (data.email?.includes('admin')) {
        userRole = 'admin';
      } else if (data.email?.includes('@cu.edu.eg')) {
        userRole = 'employer';
      } else if (!userRole || userRole === 'student') {
        userRole = 'student';
      }
      
      const userData = { ...data, role: userRole };
      console.log('👤 User role set to:', userRole);
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('userRole', userRole);
      setUser(userData);
      
      return { success: true, user: userData };
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
      
      let userRole = data.role;
      if (data.email?.includes('admin')) userRole = 'admin';
      else if (data.email?.includes('@cu.edu.eg')) userRole = 'employer';
      
      const userData = { ...data, role: userRole };
      
      localStorage.setItem('token', data.token);
      localStorage.setItem('userRole', userRole);
      setUser(userData);
      
      return { success: true, user: userData };
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
    localStorage.removeItem('userRole');
    setUser(null);
  };

  const value = {
    user,
    setUser,
    loading,
    error,
    login,
    register,
    forgotPassword,
    logout
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};