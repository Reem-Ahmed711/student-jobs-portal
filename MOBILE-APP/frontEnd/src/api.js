import axios from "axios";

const API_URL = "http://10.238.2.249:3000";

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

    return { success: true, data: response.data };
  } catch (err) {
    const errorData = err.response?.data;

    // validation error من الـ server زي "Email already in use"
    if (errorData && errorData.message) {
      return { success: false, message: errorData.message };
    }

    return { success: false, message: "حدث خطأ، حاول مرة أخرى" };
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

    return { success: true, data: response.data };
  } catch (err) {
    const errorData = err.response?.data;

    if (errorData && errorData.message) {
      return { success: false, message: errorData.message };
    }

    return { success: false, message: "حدث خطأ، حاول مرة أخرى" };
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