// MOBILE-APP/frontEnd/src/api.js
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// ================= BASE URL =================
// Emulator Android
// const API_URL = "http://localhost:3000";
// لو موبايل حقيقي غيّره لـ IP جهازك:
const API_URL = "http://192.168.1.8:3000";

const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 60000,
});

// ================= TOKEN INTERCEPTOR =================
api.interceptors.request.use(async (config) => {
  try {
    const token = await AsyncStorage.getItem("userToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  } catch (e) {
    console.log("Token error:", e.message);
  }
  return config;
});

// ================= AUTH =================
export const loginUser = async (email, password) => {
  try {
    const res = await api.post("/api/login", { email, password });
    return res.data;
  } catch (err) {
    return {
      success: false,
      message: err?.response?.data?.message || err.message || "Login failed",
    };
  }
};

export const registerUser = async (userData) => {
  try {
    const res = await api.post("/api/register", userData);
    return res.data;
  } catch (err) {
    return {
      success: false,
      message: err?.response?.data?.message || err.message || "Register failed",
    };
  }
};

// ================= PROFILE =================
export const getUserProfile = async (uid) => {
  try {
    const res = await api.get(`/api/profile/${uid}`);
    return res.data;
  } catch (err) {
    return {
      success: false,
      message: err?.response?.data?.message || err.message,
    };
  }
};

export const updateUserProfile = async (uid, data) => {
  try {
    const res = await api.put(`/api/profile/${uid}`, data);
    return res.data;
  } catch (err) {
    return {
      success: false,
      message: err?.response?.data?.message || err.message,
    };
  }
};

// ================= JOBS =================
export const getAvailableJobs = async () => {
  try {
    const res = await api.get("/api/jobs");
    return { success: true, data: res.data };
  } catch (err) {
    return { success: false, data: [] };
  }
};

export const createNewJob = async (jobData) => {
  try {
    const res = await api.post("/api/jobs", jobData);
    return { success: true, data: res.data };
  } catch (err) {
    return {
      success: false,
      message: err?.response?.data?.message || err.message,
    };
  }
};

export const deleteJob = async (jobId) => {
  try {
    const res = await api.delete(`/api/jobs/${jobId}`);
    return { success: true, data: res.data };
  } catch (err) {
    return {
      success: false,
      message: err?.response?.data?.message || err.message,
    };
  }
};

// ================= APPLICATIONS =================
export const applyToJob = async (jobId) => {
  try {
    const res = await api.post("/api/applications", { jobId });
    return { success: true, data: res.data };
  } catch (err) {
    return {
      success: false,
      message: err?.response?.data?.message || err.message,
    };
  }
};

export const getStudentApplications = async () => {
  try {
    const res = await api.get("/api/applications/student");
    return { success: true, data: res.data };
  } catch (err) {
    return { success: false, data: [] };
  }
};

export const getJobApplicants = async (jobId) => {
  try {
    const res = await api.get(`/api/applications/job/${jobId}`);
    return { success: true, data: res.data };
  } catch (err) {
    // عشان تشوفي الخطأ الحقيقي
    console.log("🔴 getJobApplicants ERROR:", err.response?.status, err.response?.data);
    return { 
      success: false, 
      data: [],
      status: err.response?.status,
      message: err.response?.data?.message || err.message
    };
  }
};

// ================= EMPLOYER =================
export const getEmployerDashboard = async () => {
  try {
    const res = await api.get("/api/employer/dashboard");
    console.log("RAW RESPONSE:", JSON.stringify(res.data));
    return { success: true, data: res.data.data };
  } catch (err) {
    console.log("DASHBOARD ERROR STATUS:", err.response?.status);
    console.log("DASHBOARD ERROR DATA:", JSON.stringify(err.response?.data));
    console.log("DASHBOARD ERROR MSG:", err.message);
    return { success: false, data: null };
  }
};

export const getEmployerProfile = async () => {
  try {
    const res = await api.get("/api/employer/profile");
    return { success: true, data: res.data.data };
  } catch (err) {
    return { success: false, data: null };
  }
};

export const updateEmployerProfile = async (data) => {
  try {
    const res = await api.put("/api/employer/profile", data);
    return { success: true, data: res.data };
  } catch (err) {
    return {
      success: false,
      message: err?.response?.data?.message || err.message,
    };
  }
};

export const getEmployerJobs = async () => {
  try {
    const res = await api.get("/api/employer/jobs");
    return { success: true, data: res.data.data };
  } catch (err) {
    return { success: false, data: [] };
  }
};

export const acceptApplication = async (applicationId) => {
  try {
    const res = await api.post(
      `/api/employer/applications/${applicationId}/accept`,
    );
    return res.data;
  } catch (err) {
    return {
      success: false,
      message: err?.response?.data?.message || err.message,
    };
  }
};

export const rejectApplication = async (applicationId, reason = "") => {
  try {
    const res = await api.post(
      `/api/employer/applications/${applicationId}/reject`,
      { reason },
    );
    return res.data;
  } catch (err) {
    return {
      success: false,
      message: err?.response?.data?.message || err.message,
    };
  }
};

// ================= RATINGS =================
export const getUserRating = async (uid) => {
  try {
    const res = await api.get(`/api/ratings/user/${uid}`);
    return res.data;
  } catch (err) {
    return { success: false, data: null };
  }
};

export const rateStudent = async (studentUid, ratingData) => {
  try {
    const res = await api.post(
      `/api/ratings/student/${studentUid}`,
      ratingData,
    );
    return res.data;
  } catch (err) {
    return {
      success: false,
      message: err?.response?.data?.message || err.message,
    };
  }
};

// ================= ADMIN APIs =================
export const getAdminStats = async () => {
  try {
    const res = await api.get("/api/admin/stats");
    return res.data;
  } catch (err) {
    return {
      success: false,
      message: err?.response?.data?.message || err.message,
    };
  }
};

export const adminGetAllJobs = async () => {
  try {
    const res = await api.get("/api/admin/jobs");
    return res.data;
  } catch (err) {
    return {
      success: false,
      message: err?.response?.data?.message || err.message,
      data: [],
    };
  }
};

export const adminDeleteJob = async (jobId) => {
  try {
    const res = await api.delete(`/api/admin/jobs/${jobId}`);
    return res.data;
  } catch (err) {
    return {
      success: false,
      message: err?.response?.data?.message || err.message,
    };
  }
};

export const adminUpdateJobStatus = async (jobId, status) => {
  try {
    const res = await api.patch(`/api/admin/jobs/${jobId}/status`, { status });
    return res.data;
  } catch (err) {
    return {
      success: false,
      message: err?.response?.data?.message || err.message,
    };
  }
};

export const getAllUsers = async (role = null, page = 1, limit = 20) => {
  try {
    let url = `/api/admin/users?page=${page}&limit=${limit}`;
    if (role) url += `&role=${role}`;
    const res = await api.get(url);
    return res.data;
  } catch (err) {
    return {
      success: false,
      message: err?.response?.data?.message || err.message,
      data: { users: [] },
    };
  }
};

export const adminDeleteUser = async (uid) => {
  try {
    const res = await api.delete(`/api/admin/users/${uid}`);
    return res.data;
  } catch (err) {
    return {
      success: false,
      message: err?.response?.data?.message || err.message,
    };
  }
};

export const makeAdmin = async (uid) => {
  try {
    const res = await api.post(`/api/admin/users/${uid}/make-admin`);
    return res.data;
  } catch (err) {
    return {
      success: false,
      message: err?.response?.data?.message || err.message,
    };
  }
};

export const removeAdmin = async (uid) => {
  try {
    const res = await api.post(`/api/admin/users/${uid}/remove-admin`);
    return res.data;
  } catch (err) {
    return {
      success: false,
      message: err?.response?.data?.message || err.message,
    };
  }
};

// ================= EXPORT DEFAULT =================
export default api;
