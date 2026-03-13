import axios from 'axios';


const API_URL = "http://localhost:3000/";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});


export const registerUser = async (username, email, password) => {
  try {
    const response = await api.post('/register', { username, email, password });
    return response.data;
  } catch (err) {
    console.error(err.response?.data, err.message);
    throw err;
  }
};


export const loginUser = async (email, password) => {
  try {
    const response = await api.post('/login', { email, password });
    
    // if (response.data.valid) {
    //   localStorage.setItem('token', response.data.token);
    //   
    // }
    return response.data;
  } catch (err) {
    console.error(err.response?.data, err.message);
    throw err;
  }
};


export const getProfile = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await api.get('/profile', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (err) {
    console.error(err.response?.data || err.message);
    throw err;
  }
};