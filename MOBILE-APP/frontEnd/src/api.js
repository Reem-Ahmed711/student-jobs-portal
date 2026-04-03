import axios from "axios";

// حطي IP جهازك الحقيقي
const API_URL = "http://192.168.1.7:3000";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

//////////////////// REGISTER ////////////////////

export const registerUser = async (username, email, password) => {
  try {
    const response = await api.post("/register", {
      username,
      email,
      password,
    });

    return response.data;
  } catch (err) {
    console.error("Register error:", err.response?.data || err.message);
    throw err.response?.data || err;
  }
};

//////////////////// LOGIN ////////////////////

export const loginUser = async (email, password) => {
  try {
    const response = await api.post("/login", {
      email,
      password,
    });

    console.log("LOGIN RESPONSE:", response.data);

    return response.data;
  } catch (err) {
    console.error("Login error:", err.response?.data || err.message);
    throw err.response?.data || err;
  }
};

//////////////////// PROFILE ////////////////////

export const getProfile = async () => {
  return null;
};

//////////////////// LOGOUT ////////////////////

export const logoutUser = async () => {
  return true;
};