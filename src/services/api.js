import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',  // تأكدي إن الرقم 5000 مش 50000
  timeout: 10000
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem('token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  console.log('Making request to:', req.url);  
  return req;
});

export const login = (formData) => API.post('/auth/login', formData);
export const register = (formData) => API.post('/auth/register', formData);
export const forgotPassword = (email) => API.post('/auth/forgot-password', { email });
export const getProfile = () => API.get('/auth/profile');

export default API;