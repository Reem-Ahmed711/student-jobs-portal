import axios from "axios";


const API_URL = "http://10.17.158.249:3000";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

//////////////////// REGISTER ////////////////////

export const registerUser = async (userData) => {
  try {
    console.log("📤 REGISTER REQUEST:", userData);

    const response = await api.post("/api/register", userData);

    console.log("📥 REGISTER RESPONSE:", response.data);

    return { success: true, data: response.data };
  } catch (err) {
    console.log("❌ REGISTER ERROR:", err?.response?.data || err.message);

    const errorData = err.response?.data;

    if (errorData && errorData.message) {
      return { success: false, message: errorData.message };
    }

    return { success: false, message: "حدث خطأ، حاول مرة أخرى" };
  }
};

//////////////////// LOGIN ////////////////////

export const loginUser = async (email, password) => {
  try {
    const response = await api.post("/api/login", {
      email,
      password,
    });

    console.log("📥 LOGIN RESPONSE:", response.data);

    return { success: true, data: response.data };
  } catch (err) {
    console.log("❌ LOGIN ERROR:", err?.response?.data || err.message);

    const errorData = err.response?.data;

    if (errorData && errorData.message) {
      return { success: false, message: errorData.message };
    }

    return { success: false, message: "Error , try again" };
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