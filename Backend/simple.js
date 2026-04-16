
MOBILE-APP\app-backend\src\auth\authService.js
const admin = require("firebase-admin");
require("../firebase");
const axios = require("axios");
const { validateRegisterInput, validateLoginInput } = require("./validation");
const { assignRole } = require("./roleService");

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@university.edu";

async function registerUser({
name = "",
email = "",
password = "",
role = "student",
department = "",
year = "",
gpa = "",
skills = [],
}) {
try {
// validation
validateRegisterInput({ name, email, password, role, year, gpa, skills });

// check existing user
try {
await admin.auth().getUserByEmail(email);
throw new Error("Email already registered");
} catch (err) {
if (err.message === "Email already registered") throw err;
}

const userRecord = await admin.auth().createUser({
email,
password,
displayName: name,
});

const finalRole = email === ADMIN_EMAIL ? "admin" : role;

const userData = {
uid: userRecord.uid,
name,
email,
role: finalRole,
department,
year: Number(year) || "",
gpa: Number(gpa) || "",
skills,
profileImage: "",
phone: "",
about: "",
createdAt: new Date().toISOString(),
};

await admin
.firestore()
.collection("users")
.doc(userRecord.uid)
.set(userData);

await assignRole(userRecord.uid, finalRole);

return userData;
} catch (err) {
throw new Error(err.message);
}
}

async function loginUser({ email, password }) {
validateLoginInput({ email, password });

const API_KEY = process.env.FIREBASE_API_KEY;

try {
const response = await axios.post(
`https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=${API_KEY}`,
{
email,
password,
returnSecureToken: true,
},
);

const { localId, idToken } = response.data;

const userDoc = await admin
.firestore()
.collection("users")
.doc(localId)
.get();

if (!userDoc.exists) throw new Error("User not found");

const userData = userDoc.data();

return {
uid: localId,
token: idToken,
...userData,
isAdmin: userData.email === ADMIN_EMAIL || userData.role === "admin",
};
} catch (err) {
throw new Error(
"Login failed: " + (err.response?.data?.error?.message || err.message),
);
}
}

module.exports = {
registerUser,
loginUser,
};

MOBILE-APP\app-backend\src\auth\roleGuard.js
const admin = require("firebase-admin");

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || "admin@university.edu";

const getUserRole = async (uid) => {
const docRef = admin.firestore().collection("users").doc(uid);
const docSnap = await docRef.get();

if (!docSnap.exists) {
throw new Error("User not found");
}

return docSnap.data().role;
};

const requireStudent = async (uid) => {
const role = await getUserRole(uid);
if (role !== "student") {
throw new Error("Access denied: student only");
}
};

const requireEmployer = async (uid) => {
const role = await getUserRole(uid);
if (role !== "employer") {
throw new Error("Access denied: employer only");
}
};

const requireAdmin = async (uid) => {
const docRef = admin.firestore().collection("users").doc(uid);
const docSnap = await docRef.get();

if (!docSnap.exists) {
throw new Error("User not found");
}

const userData = docSnap.data();

// Check if main admin (by email) OR has admin role
const isMainAdmin = userData.email === ADMIN_EMAIL;
const hasAdminRole = userData.role === "admin";

if (!isMainAdmin && !hasAdminRole) {
throw new Error("Access denied: admin only");
}
};

const isMainAdmin = async (uid) => {
const docRef = admin.firestore().collection("users").doc(uid);
const docSnap = await docRef.get();

if (!docSnap.exists) return false;

return docSnap.data().email === ADMIN_EMAIL;
};

const requireMainAdmin = async (uid) => {
const docRef = admin.firestore().collection("users").doc(uid);
const docSnap = await docRef.get();

if (!docSnap.exists) {
throw new Error("User not found");
}

if (docSnap.data().email !== ADMIN_EMAIL) {
throw new Error("Access denied: main admin only");
}
};

module.exports = {
getUserRole,
requireStudent,
requireEmployer,
requireAdmin,
isMainAdmin,
requireMainAdmin,
};

MOBILE-APP\app-backend\src\auth\roleService.js

const admin = require("firebase-admin");

async function assignRole(uid, role = "student") {
try {


await admin.auth().setCustomUserClaims(uid, { role });

const userRef = admin.firestore().collection("users").doc(uid);
await userRef.update({ role });

return { success: true, message: `Role '${role}' assigned to user ${uid}` };
} catch (err) {
throw new Error("Failed to assign role: " + err.message);
}
}


async function getUserRole(uid) {
try {
const user = await admin.auth().getUser(uid);
return user.customClaims?.role || "student";
} catch (err) {
throw new Error("Failed to get user role: " + err.message);
}
}


async function hasRole(uid, role) {
const userRole = await getUserRole(uid);
return userRole === role;
}


function authorizeRoles(...allowedRoles) {
return async (req, res, next) => {
try {
const idToken = req.headers.authorization?.split("Bearer ")[1];
if (!idToken) return res.status(401).json({ message: "No token provided" });

const decodedToken = await admin.auth().verifyIdToken(idToken);
const userRole = decodedToken.role || "student";

if (!allowedRoles.includes(userRole))
return res.status(403).json({ message: "Forbidden: insufficient role" });

req.user = { uid: decodedToken.uid, role: userRole };
next();
} catch (err) {
return res.status(401).json({ message: "Unauthorized: " + err.message });
}
};
}

module.exports = {
assignRole,
getUserRole,
hasRole,
authorizeRoles,
};
MOBILE-APP\app-backend\src\auth\validation.js
function validateRegisterInput({
name,
email,
password,
role,
year,
gpa,
skills,
}) {
if (!name || name.trim().length < 3) {
throw new Error("Name must be at least 3 characters");
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!email || !emailRegex.test(email)) {
throw new Error("Invalid email format");
}

if (!password || password.length < 6) {
throw new Error("Password must be at least 6 characters");
}

const roles = ["student", "employer", "admin"];
if (role && !roles.includes(role)) {
throw new Error("Invalid role");
}

if (year && isNaN(Number(year))) {
throw new Error("Year must be a number");
}

if (gpa && (isNaN(Number(gpa)) || Number(gpa) < 0 || Number(gpa) > 4)) {
throw new Error("GPA must be between 0 and 4");
}

if (skills && !Array.isArray(skills)) {
throw new Error("Skills must be an array");
}

return true;
}

function validateLoginInput({ email, password }) {
const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

if (!email || !emailRegex.test(email)) {
throw new Error("Invalid email");
}

if (!password) {
throw new Error("Password is required");
}

return true;
}

module.exports = {
validateRegisterInput,
validateLoginInput,
};

MOBILE-APP\app-backend\src\Controllers
MOBILE-APP\app-backend\src\Controllers\adminController.js
const {
getPlatformStats,
getAllUsers,
makeAdmin,
removeAdmin,
adminDeleteJob,
adminDeleteUser,
adminGetAllJobs,
adminUpdateJobStatus,
adminGetAllApplications,
adminUpdateApplicationStatus,
getAllAdmins,
getAdminLogs,
searchUsers,
} = require("../Service/adminService");

const { requireAdmin } = require("../auth/roleGuard");

// ================= Get Admin Dashboard Stats =================
const getDashboardStats = async (req, res) => {
try {
await requireAdmin(req.user.uid);
const stats = await getPlatformStats();
res.status(200).json({ success: true, data: stats });
} catch (err) {
const status = err.message.includes("Access denied") ? 403 : 500;
res.status(status).json({ success: false, message: err.message });
}
};

// ================= Get All Users =================
const getAllUsersController = async (req, res) => {
try {
await requireAdmin(req.user.uid);
const { role, page = 1, limit = 20 } = req.query;
const result = await getAllUsers(role, parseInt(page), parseInt(limit));
res.status(200).json({ success: true, data: result });
} catch (err) {
const status = err.message.includes("Access denied") ? 403 : 500;
res.status(status).json({ success: false, message: err.message });
}
};

// ================= Make User Admin =================
const makeAdminController = async (req, res) => {
try {
await requireAdmin(req.user.uid);
const { uid } = req.params;
const result = await makeAdmin(uid, req.user.uid);
res.status(200).json(result);
} catch (err) {
const status = err.message.includes("Access denied") ? 403 : 500;
res.status(status).json({ success: false, message: err.message });
}
};

// ================= Remove Admin Role =================
const removeAdminController = async (req, res) => {
try {
await requireAdmin(req.user.uid);
const { uid } = req.params;
const result = await removeAdmin(uid, req.user.uid);
res.status(200).json(result);
} catch (err) {
const status = err.message.includes("Access denied") ? 403 : 500;
res.status(status).json({ success: false, message: err.message });
}
};

// ================= Admin Delete Job =================
const adminDeleteJobController = async (req, res) => {
try {
await requireAdmin(req.user.uid);
const { jobId } = req.params;
const result = await adminDeleteJob(jobId, req.user.uid);
res.status(200).json(result);
} catch (err) {
const status = err.message.includes("Access denied") ? 403 : 500;
res.status(status).json({ success: false, message: err.message });
}
};

// ================= Admin Delete User =================
const adminDeleteUserController = async (req, res) => {
try {
await requireAdmin(req.user.uid);
const { uid } = req.params;
const result = await adminDeleteUser(uid, req.user.uid);
res.status(200).json(result);
} catch (err) {
const status = err.message.includes("Access denied") ? 403 : 500;
res.status(status).json({ success: false, message: err.message });
}
};

// ================= Admin Get All Jobs =================
const adminGetAllJobsController = async (req, res) => {
try {
await requireAdmin(req.user.uid);
const { department, status } = req.query;
const result = await adminGetAllJobs({ department, status });
res.status(200).json({ success: true, data: result });
} catch (err) {
const status = err.message.includes("Access denied") ? 403 : 500;
res.status(status).json({ success: false, message: err.message });
}
};

// ================= Admin Update Job Status =================
const adminUpdateJobStatusController = async (req, res) => {
try {
await requireAdmin(req.user.uid);
const { jobId } = req.params;
const { status } = req.body;
const result = await adminUpdateJobStatus(jobId, status, req.user.uid);
res.status(200).json(result);
} catch (err) {
const status = err.message.includes("Access denied") ? 403 : 500;
res.status(status).json({ success: false, message: err.message });
}
};

// ================= Admin Get All Applications =================
const adminGetAllApplicationsController = async (req, res) => {
try {
await requireAdmin(req.user.uid);
const { status } = req.query;
const result = await adminGetAllApplications({ status });
res.status(200).json({ success: true, data: result });
} catch (err) {
const status = err.message.includes("Access denied") ? 403 : 500;
res.status(status).json({ success: false, message: err.message });
}
};

// ================= Admin Update Application Status =================
const adminUpdateApplicationStatusController = async (req, res) => {
try {
await requireAdmin(req.user.uid);
const { applicationId } = req.params;
const { status } = req.body;
const result = await adminUpdateApplicationStatus(
applicationId,
status,
req.user.uid,
);
res.status(200).json(result);
} catch (err) {
const status = err.message.includes("Access denied") ? 403 : 500;
res.status(status).json({ success: false, message: err.message });
}
};

// ================= Get All Admins =================
const getAllAdminsController = async (req, res) => {
try {
await requireAdmin(req.user.uid);
const result = await getAllAdmins();
res.status(200).json({ success: true, data: result });
} catch (err) {
const status = err.message.includes("Access denied") ? 403 : 500;
res.status(status).json({ success: false, message: err.message });
}
};

// ================= Get Admin Logs =================
const getAdminLogsController = async (req, res) => {
try {
await requireAdmin(req.user.uid);
const { limit = 50 } = req.query;
const result = await getAdminLogs(parseInt(limit));
res.status(200).json({ success: true, data: result });
} catch (err) {
const status = err.message.includes("Access denied") ? 403 : 500;
res.status(status).json({ success: false, message: err.message });
}
};

// ================= Search Users =================
const searchUsersController = async (req, res) => {
try {
await requireAdmin(req.user.uid);
const { q, role } = req.query;
if (!q) {
return res
.status(400)
.json({ success: false, message: "Search term is required" });
}
const result = await searchUsers(q, role);
res.status(200).json({ success: true, data: result });
} catch (err) {
const status = err.message.includes("Access denied") ? 403 : 500;
res.status(status).json({ success: false, message: err.message });
}
};

module.exports = {
getDashboardStats,
getAllUsersController,
makeAdminController,
removeAdminController,
adminDeleteJobController,
adminDeleteUserController,
adminGetAllJobsController,
adminUpdateJobStatusController,
adminGetAllApplicationsController,
adminUpdateApplicationStatusController,
getAllAdminsController,
getAdminLogsController,
searchUsersController,
};

MOBILE-APP\app-backend\src\Controllers\applicationController.js
const {
applyToJob,
getJobApplications,
getStudentApplications
} = require("../Service/applicationService");

const {
requireStudent,
requireEmployer
} = require("../auth/roleGuard");

const applyToJobController = async (req, res) => {
try {
await requireStudent(req.user.uid);
const result = await applyToJob(req.user.uid, req.body.jobId);
res.status(201).json(result);
} catch (err) {
res.status(403).json({ message: err.message });
}
};



const getJobApplicationsController = async (req, res) => {
try {
await requireEmployer(req.user.uid);
const { jobId } = req.params;
const result = await getJobApplications(req.user.uid, jobId);
res.status(200).json(result);
} catch (err) {
res.status(403).json({ message: err.message });
}
};


const getStudentApplicationsController = async (req, res) => {
try {
await requireStudent(req.user.uid);
const result = await getStudentApplications(req.user.uid);
res.status(200).json(result);
} catch (err) {
res.status(403).json({ message: err.message });
}
};

module.exports = { applyToJobController, getJobApplicationsController, getStudentApplicationsController };
MOBILE-APP\app-backend\src\Controllers\authController.js
const { admin, db } = require("./../firebase");

const registerController = async (req, res) => {
const { username, email, password } = req.body;

if (!username) {
return res.status(400).json({ valid: false, message: "Name is required" });
}

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
if (!email || !emailRegex.test(email)) {
return res.status(400).json({ valid: false, message: "Invalid email" });
}

if (!password || password.length < 6) {
return res.status(400).json({
valid: false,
message: "Password must be at least 6 characters",
});
}

try {
const userRecord = await admin.auth().createUser({
email,
password,
displayName: username,
});

await db.collection("users").doc(userRecord.uid).set({
uid: userRecord.uid,
username,
email,
password,
createdAt: new Date(),
});

res.status(201).json({
valid: true,
message: "User registered successfully",
});
} catch (error) {
res.status(500).json({
valid: false,
message: error.message,
});
}
};

const loginController = async (req, res) => {
const { email, password } = req.body;

if (!email || !password) {
return res.status(400).json({
valid: false,
message: "Email and password are required",
});
}

try {
const snapshot = await db
.collection("users")
.where("email", "==", email)
.get();

if (snapshot.empty) {
return res.status(404).json({
valid: false,
message: "User not found",
});
}

const userData = snapshot.docs[0].data();

if (userData.password !== password) {
return res.status(401).json({
valid: false,
message: "Invalid password",
});
}

res.status(200).json({
valid: true,
message: "Login successful",
user: {
uid: userData.uid,
username: userData.username,
email: userData.email,
},
});
} catch (error) {
res.status(500).json({
valid: false,
message: error.message,
});
}
};

module.exports = {
registerController,
loginController,
};
MOBILE-APP\app-backend\src\Controllers\dashboardController.js
const { db } = require("../firebase");

// 🟢 GET DASHBOARD
exports.getDashboard = async (req, res) => {
try {
const userId = req.params.userId;

const jobsSnapshot = await db.collection("jobs").get();

const jobs = jobsSnapshot.docs.map((doc) => ({
id: doc.id,
...doc.data(),
}));

res.status(200).json({
success: true,
data: jobs,
});
} catch (error) {
res.status(500).json({
success: false,
message: error.message,
});
}
};

// 🟡 APPLY JOB
exports.applyJob = async (req, res) => {
try {
const { userId, jobId } = req.body;

if (!userId || !jobId) {
return res.status(400).json({
success: false,
message: "userId & jobId required",
});
}

await db.collection("applications").add({
userId,
jobId,
status: "pending",
appliedAt: new Date(),
});

res.status(200).json({
success: true,
message: "Applied successfully",
});
} catch (error) {
res.status(500).json({
success: false,
message: error.message,
});
}
};

MOBILE-APP\app-backend\src\Controllers\employerController.js
const {
getEmployerProfile,
updateEmployerProfile,
getEmployerJobs,
getJobApplicationsWithDetails,
acceptApplication,
rejectApplication,
getEmployerStats,
getEmployerDashboard,
} = require("../Service/employerService");

const { requireEmployer } = require("../auth/roleGuard");

// ================= Get Employer Profile =================
const getEmployerProfileController = async (req, res) => {
try {
await requireEmployer(req.user.uid);
const result = await getEmployerProfile(req.user.uid);
res.status(200).json({ success: true, data: result });
} catch (err) {
const status = err.message.includes("Access denied") ? 403 : 500;
res.status(status).json({ success: false, message: err.message });
}
};

// ================= Update Employer Profile =================
const updateEmployerProfileController = async (req, res) => {
try {
await requireEmployer(req.user.uid);
const result = await updateEmployerProfile(req.user.uid, req.body);
res.status(200).json(result);
} catch (err) {
const status = err.message.includes("Access denied") ? 403 : 500;
res.status(status).json({ success: false, message: err.message });
}
};

// ================= Get Employer Jobs =================
const getEmployerJobsController = async (req, res) => {
try {
await requireEmployer(req.user.uid);
const { status } = req.query;
const result = await getEmployerJobs(req.user.uid, { status });
res.status(200).json({ success: true, data: result });
} catch (err) {
const status = err.message.includes("Access denied") ? 403 : 500;
res.status(status).json({ success: false, message: err.message });
}
};

// ================= Get Job Applications With Details =================
const getJobApplicationsWithDetailsController = async (req, res) => {
try {
await requireEmployer(req.user.uid);
const { jobId } = req.params;
const result = await getJobApplicationsWithDetails(req.user.uid, jobId);
res.status(200).json({ success: true, data: result });
} catch (err) {
const status = err.message.includes("Access denied") ? 403 : 500;
res.status(status).json({ success: false, message: err.message });
}
};

// ================= Accept Application =================
const acceptApplicationController = async (req, res) => {
try {
await requireEmployer(req.user.uid);
const { applicationId } = req.params;
const result = await acceptApplication(req.user.uid, applicationId);
res.status(200).json(result);
} catch (err) {
const status = err.message.includes("Access denied") ? 403 : 500;
res.status(status).json({ success: false, message: err.message });
}
};

// ================= Reject Application =================
const rejectApplicationController = async (req, res) => {
try {
await requireEmployer(req.user.uid);
const { applicationId } = req.params;
const { reason } = req.body;
const result = await rejectApplication(req.user.uid, applicationId, reason);
res.status(200).json(result);
} catch (err) {
const status = err.message.includes("Access denied") ? 403 : 500;
res.status(status).json({ success: false, message: err.message });
}
};

// ================= Get Employer Stats =================
const getEmployerStatsController = async (req, res) => {
try {
await requireEmployer(req.user.uid);
const result = await getEmployerStats(req.user.uid);
res.status(200).json({ success: true, data: result });
} catch (err) {
const status = err.message.includes("Access denied") ? 403 : 500;
res.status(status).json({ success: false, message: err.message });
}
};

// ================= Get Employer Dashboard =================
const getEmployerDashboardController = async (req, res) => {
try {
await requireEmployer(req.user.uid);
const result = await getEmployerDashboard(req.user.uid);
res.status(200).json({ success: true, data: result });
} catch (err) {
const status = err.message.includes("Access denied") ? 403 : 500;
res.status(status).json({ success: false, message: err.message });
}
};

module.exports = {
getEmployerProfileController,
updateEmployerProfileController,
getEmployerJobsController,
getJobApplicationsWithDetailsController,
acceptApplicationController,
rejectApplicationController,
getEmployerStatsController,
getEmployerDashboardController,
};

MOBILE-APP\app-backend\src\Controllers\jobController.js
const {
createJob,
updateJob,
deleteJob,
getAllJobs,
getJobById
} = require("../Service/jobService");

const { requireEmployer } = require("../auth/roleGuard");

const createJobController = async (req, res) => {
try {
await requireEmployer(req.user.uid);
const result = await createJob(req.user.uid, req.body);
res.status(201).json(result);
} catch (err) {
res.status(403).json({ message: err.message });
}
};


const updateJobController = async (req, res) => {
try {
await requireEmployer(req.user.uid);
const { jobId } = req.params;
const result = await updateJob(req.user.uid, jobId, req.body);
res.status(result.success ? 200 : 400).json(result);
} catch (err) {
res.status(403).json({ message: err.message });
}
};


const deleteJobController = async (req, res) => {
try {
await requireEmployer(req.user.uid);
const { jobId } = req.params;
const result = await deleteJob(req.user.uid, jobId);
res.status(result.success ? 200 : 400).json(result);
} catch (err) {
res.status(403).json({ message: err.message });
}
};


const getAllJobsController = async (req, res) => {
try {
const jobs = await getAllJobs();
res.status(200).json(jobs);
} catch (err) {
res.status(500).json({ message: err.message });
}
};


const getJobByIdController = async (req, res) => {
try {
const { jobId } = req.params;
const result = await getJobById(jobId);
res.status(result.success ? 200 : 404).json(result);
} catch (err) {
res.status(500).json({ message: err.message });
}
};

module.exports = {
createJobController,
updateJobController,
deleteJobController,
getAllJobsController,
getJobByIdController
};
MOBILE-APP\app-backend\src\Controllers\profileController.js
const { db } = require("../firebase");

// 🟢 GET ALL USERS
exports.getAllProfiles = async (req, res) => {
try {
const snapshot = await db.collection("users").get();

const users = snapshot.docs.map((doc) => ({
id: doc.id,
...doc.data(),
}));

res.status(200).json({
success: true,
count: users.length,
data: users,
});
} catch (error) {
res.status(500).json({
success: false,
message: error.message,
});
}
};

// 🟢 GET ONE USER
exports.getProfile = async (req, res) => {
try {
const userId = req.params.id;

const doc = await db.collection("users").doc(userId).get();

if (!doc.exists) {
return res.status(404).json({
success: false,
message: "User not found",
});
}

res.status(200).json({
success: true,
data: { id: doc.id, ...doc.data() },
});
} catch (error) {
res.status(500).json({
success: false,
message: error.message,
});
}
};

// 🟡 CREATE USER
exports.createProfile = async (req, res) => {
try {
const { name, email, age } = req.body;

if (!name || !email) {
return res.status(400).json({
success: false,
message: "Name & email required",
});
}

const newUser = await db.collection("users").add({
name,
email,
age: age || null,
createdAt: new Date(),
});

res.status(201).json({
success: true,
message: "User created",
id: newUser.id,
});
} catch (error) {
res.status(500).json({
success: false,
message: error.message,
});
}
};

// 🔵 UPDATE USER
exports.updateProfile = async (req, res) => {
try {
const userId = req.params.id;
const data = req.body;

const userRef = db.collection("users").doc(userId);

const doc = await userRef.get();

if (!doc.exists) {
return res.status(404).json({
success: false,
message: "User not found",
});
}

await userRef.update({
...data,
updatedAt: new Date(),
});

res.status(200).json({
success: true,
message: "User updated",
});
} catch (error) {
res.status(500).json({
success: false,
message: error.message,
});
}
};

// 🔴 DELETE USER
exports.deleteProfile = async (req, res) => {
try {
const userId = req.params.id;

const userRef = db.collection("users").doc(userId);

const doc = await userRef.get();

if (!doc.exists) {
return res.status(404).json({
success: false,
message: "User not found",
});
}

await userRef.delete();

res.status(200).json({
success: true,
message: "User deleted",
});
} catch (error) {
res.status(500).json({
success: false,
message: error.message,
});
}
};

MOBILE-APP\app-backend\src\Controllers\ratingController.js
const {
rateStudent,
rateEmployer,
getUserRating,
getRatingsGiven,
deleteRating,
getStudentRatingByEmployer,
} = require("../Service/ratingService");

const {
requireEmployer,
requireAdmin,
requireStudent,
} = require("../auth/roleGuard");

// ================= Rate Student (Employer or Admin) =================
const rateStudentController = async (req, res) => {
try {
const { studentUid } = req.params;
const { rating, review, applicationId } = req.body;

// Allow both employers and admins to rate students
const userRole = req.user.role;
if (userRole !== "employer" && userRole !== "admin") {
throw new Error(
"Access denied: only employers and admins can rate students",
);
}

const result = await rateStudent(req.user.uid, studentUid, {
rating,
review,
applicationId,
});
res.status(201).json(result);
} catch (err) {
const status = err.message.includes("Access denied")
? 403
: err.message.includes("must be between")
? 400
: 500;
res.status(status).json({ success: false, message: err.message });
}
};

// ================= Rate Employer (Student or Admin) =================
const rateEmployerController = async (req, res) => {
try {
const { employerUid } = req.params;
const { rating, review } = req.body;

const userRole = req.user.role;
if (userRole !== "student" && userRole !== "admin") {
throw new Error(
"Access denied: only students and admins can rate employers",
);
}

const result = await rateEmployer(req.user.uid, employerUid, {
rating,
review,
});
res.status(201).json(result);
} catch (err) {
const status = err.message.includes("Access denied")
? 403
: err.message.includes("must be between")
? 400
: 500;
res.status(status).json({ success: false, message: err.message });
}
};

// ================= Get User Rating =================
const getUserRatingController = async (req, res) => {
try {
const { uid } = req.params;
const result = await getUserRating(uid);
res.status(200).json({ success: true, data: result });
} catch (err) {
res.status(500).json({ success: false, message: err.message });
}
};

// ================= Get My Rating =================
const getMyRatingController = async (req, res) => {
try {
const result = await getUserRating(req.user.uid);
res.status(200).json({ success: true, data: result });
} catch (err) {
res.status(500).json({ success: false, message: err.message });
}
};

// ================= Get Ratings I Gave =================
const getRatingsGivenController = async (req, res) => {
try {
const result = await getRatingsGiven(req.user.uid);
res.status(200).json({ success: true, data: result });
} catch (err) {
res.status(500).json({ success: false, message: err.message });
}
};

// ================= Delete Rating (Admin Only) =================
const deleteRatingController = async (req, res) => {
try {
await requireAdmin(req.user.uid);
const { ratingId } = req.params;
const result = await deleteRating(ratingId, req.user.uid);
res.status(200).json(result);
} catch (err) {
const status = err.message.includes("Access denied") ? 403 : 500;
res.status(status).json({ success: false, message: err.message });
}
};

// ================= Get Student Rating by Employer =================
const getStudentRatingByEmployerController = async (req, res) => {
try {
await requireEmployer(req.user.uid);
const { studentUid } = req.params;
const result = await getStudentRatingByEmployer(req.user.uid, studentUid);
res.status(200).json({ success: true, data: result });
} catch (err) {
const status = err.message.includes("Access denied") ? 403 : 500;
res.status(status).json({ success: false, message: err.message });
}
};

module.exports = {
rateStudentController,
rateEmployerController,
getUserRatingController,
getMyRatingController,
getRatingsGivenController,
deleteRatingController,
getStudentRatingByEmployerController,
};

MOBILE-APP\app-backend\src\middleware
MOBILE-APP\app-backend\src\middleware\verifyToken.js
const admin = require("firebase-admin");

const verifyToken = async (req, res, next) => {
try {
const authHeader = req.headers.authorization;

if (!authHeader || !authHeader.startsWith("Bearer ")) {
return res.status(401).json({ message: "No token provided" });
}

const token = authHeader.split("Bearer ")[1];

const decodedToken = await admin.auth().verifyIdToken(token);

req.user = {
uid: decodedToken.uid,
email: decodedToken.email,
};

next();
} catch (error) {
return res
.status(401)
.json({ message: "Invalid token", error: error.message });
}
};

module.exports = verifyToken;

MOBILE-APP\app-backend\src\Routes
MOBILE-APP\app-backend\src\Routes\adminRoute.js
const express = require("express");
const router = express.Router();
const { registerUser, loginUser } = require("../auth/authService");

router.post("/register", async (req, res) => {
try {
let userData = req.body;

// تحويل حقل username اللي بيرسله الموبايل إلى name اللي بيتوقعها الباك إند
if (userData.username && !userData.name) {
userData.name = userData.username;
delete userData.username;
}

const result = await registerUser(userData);
res.status(201).json({ success: true, ...result });
} catch (err) {
res.status(400).json({ success: false, message: err.message });
}
});

router.post("/login", async (req, res) => {
try {
const result = await loginUser(req.body);
res.status(200).json({ success: true, ...result });
} catch (err) {
res.status(401).json({ success: false, message: err.message });
}
});

module.exports = router;

MOBILE-APP\app-backend\src\Routes\applicationRoute.js

const express = require("express");
const router = express.Router();

const verifyToken = require("../middleware/verifyToken");

const {
applyToJobController,
getJobApplicationsController,
getStudentApplicationsController
} = require("../Controllers/applicationController");

router.post("/", verifyToken, applyToJobController);
router.get("/job/:jobId", verifyToken, getJobApplicationsController);
router.get("/student", verifyToken, getStudentApplicationsController);

module.exports = router;
MOBILE-APP\app-backend\src\Routes\authRoute.js
const express = require("express");
const router = express.Router();
const { registerUser, loginUser } = require("../auth/authService");

router.post("/register", async (req, res) => {
try {
let userData = req.body;

if (userData.username) {
userData.name = userData.username;
delete userData.username;
}

const result = await registerUser(userData);

res.status(201).json({
success: true,
data: result,
});
} catch (err) {
res.status(400).json({
success: false,
message: err.message,
});
}
});

router.post("/login", async (req, res) => {
try {
const result = await loginUser(req.body);

res.status(200).json({
success: true,
data: result,
});
} catch (err) {
res.status(401).json({
success: false,
message: err.message,
});
}
});

module.exports = router;

MOBILE-APP\app-backend\src\Routes\dashboard.js
const express = require("express");
const router = express.Router();

const {
getDashboard,
applyJob,
} = require("../Controllers/dashboardController");

// 🟢 GET dashboard
router.get("/dashboard/:userId", getDashboard);

// 🟡 APPLY job
router.post("/dashboard/apply", applyJob);

module.exports = router;

MOBILE-APP\app-backend\src\Routes\employerRoute.js
const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");

const {
getEmployerProfileController,
updateEmployerProfileController,
getEmployerJobsController,
getJobApplicationsWithDetailsController,
acceptApplicationController,
rejectApplicationController,
getEmployerStatsController,
getEmployerDashboardController,
} = require("../Controllers/employerController");

// ================= Employer Profile =================
router.get("/employer/profile", verifyToken, getEmployerProfileController);
router.put("/employer/profile", verifyToken, updateEmployerProfileController);

// ================= Employer Jobs =================
router.get("/employer/jobs", verifyToken, getEmployerJobsController);

// ================= Employer Applications =================
router.get(
"/employer/jobs/:jobId/applications",
verifyToken,
getJobApplicationsWithDetailsController,
);
router.post(
"/employer/applications/:applicationId/accept",
verifyToken,
acceptApplicationController,
);
router.post(
"/employer/applications/:applicationId/reject",
verifyToken,
rejectApplicationController,
);

// ================= Employer Stats & Dashboard =================
router.get("/employer/stats", verifyToken, getEmployerStatsController);
router.get("/employer/dashboard", verifyToken, getEmployerDashboardController);

module.exports = router;

MOBILE-APP\app-backend\src\Routes\jobRoute.js
const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");

const {
createJobController,
updateJobController,
deleteJobController,
getAllJobsController,
getJobByIdController
} = require("../Controllers/jobController");

router.get("/", verifyToken, getAllJobsController);
router.get("/:jobId", verifyToken, getJobByIdController);
router.post("/", verifyToken, createJobController);
router.put("/:jobId", verifyToken, updateJobController);
router.delete("/:jobId", verifyToken, deleteJobController);

module.exports = router;
MOBILE-APP\app-backend\src\Routes\profile.js
const express = require("express");
const router = express.Router();

const {
getProfile,
getAllProfiles,
createProfile,
updateProfile,
deleteProfile,
} = require("../Controllers/profileController");

// 🟢 GET all users
router.get("/profiles", getAllProfiles);

// 🟢 GET single profile
router.get("/profile/:id", getProfile);

// 🟡 POST create profile
router.post("/profile", createProfile);

// 🔵 PUT update profile
router.put("/profile/:id", updateProfile);

// 🔴 DELETE profile
router.delete("/profile/:id", deleteProfile);

module.exports = router;

MOBILE-APP\app-backend\src\Routes\ratingRoute.js
const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");

const {
rateStudentController,
rateEmployerController,
getUserRatingController,
getMyRatingController,
getRatingsGivenController,
deleteRatingController,
getStudentRatingByEmployerController,
} = require("../Controllers/ratingController");

// ================= Rate Users =================
router.post("/ratings/student/:studentUid", verifyToken, rateStudentController);
router.post(
"/ratings/employer/:employerUid",
verifyToken,
rateEmployerController,
);

// ================= Get Ratings =================
router.get("/ratings/user/:uid", verifyToken, getUserRatingController);
router.get("/ratings/me", verifyToken, getMyRatingController);
router.get("/ratings/given", verifyToken, getRatingsGivenController);
router.get(
"/ratings/student/:studentUid/by-me",
verifyToken,
getStudentRatingByEmployerController,
);

// ================= Admin: Delete Rating =================
router.delete("/ratings/:ratingId", verifyToken, deleteRatingController);

module.exports = router;

MOBILE-APP\app-backend\src\Service
MOBILE-APP\app-backend\src\Service\adminService.js
const admin = require("firebase-admin");
const db = admin.firestore();

// ================= Get Platform Statistics =================
const getPlatformStats = async () => {
// Total students
const studentsSnap = await db
.collection("users")
.where("role", "==", "student")
.get();
const totalStudents = studentsSnap.size;

// Total employers
const employersSnap = await db
.collection("users")
.where("role", "==", "employer")
.get();
const totalEmployers = employersSnap.size;

// Total admins
const adminsSnap = await db
.collection("users")
.where("role", "==", "admin")
.get();
const totalAdmins = adminsSnap.size;

// Total jobs
const jobsSnap = await db.collection("jobs").get();
const totalJobs = jobsSnap.size;

// Total applications
const appsSnap = await db.collection("applications").get();
const totalApplications = appsSnap.size;

// Jobs per department
const jobsByDepartment = {};
jobsSnap.forEach((doc) => {
const data = doc.data();
const dept = data.department || "غير محدد";
jobsByDepartment[dept] = (jobsByDepartment[dept] || 0) + 1;
});

// Students per department
const studentsByDepartment = {};
studentsSnap.forEach((doc) => {
const data = doc.data();
const dept = data.department || "غير محدد";
studentsByDepartment[dept] = (studentsByDepartment[dept] || 0) + 1;
});

// Employers per industry
const employersByIndustry = {};
employersSnap.forEach((doc) => {
const data = doc.data();
const industry = data.industry || "غير محدد";
employersByIndustry[industry] = (employersByIndustry[industry] || 0) + 1;
});

// Applications by status
const applicationsByStatus = { pending: 0, accepted: 0, rejected: 0 };
appsSnap.forEach((doc) => {
const data = doc.data();
const status = data.status || "pending";
applicationsByStatus[status] = (applicationsByStatus[status] || 0) + 1;
});

// Recent registrations (last 7 days)
const sevenDaysAgo = new Date();
sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
let recentRegistrations = 0;

studentsSnap.forEach((doc) => {
const createdAt = doc.data().createdAt;
if (createdAt && new Date(createdAt) >= sevenDaysAgo) recentRegistrations++;
});

employersSnap.forEach((doc) => {
const createdAt = doc.data().createdAt;
if (createdAt && new Date(createdAt) >= sevenDaysAgo) recentRegistrations++;
});

// Top rated students
const topStudents = [];
for (const doc of studentsSnap.docs) {
const ratingsSnap = await db
.collection("ratings")
.where("ratedUid", "==", doc.id)
.get();

if (!ratingsSnap.empty) {
const ratings = ratingsSnap.docs.map((d) => d.data().rating);
const avgRating = ratings.reduce((a, b) => a + b, 0) / ratings.length;
topStudents.push({
uid: doc.id,
name: doc.data().name,
department: doc.data().department,
averageRating: parseFloat(avgRating.toFixed(1)),
totalRatings: ratings.length,
});
}
}
topStudents.sort((a, b) => b.averageRating - a.averageRating);

// Top employers (by number of jobs)
const topEmployers = [];
for (const doc of employersSnap.docs) {
const jobsCountSnap = await db
.collection("jobs")
.where("employerUid", "==", doc.id)
.get();

topEmployers.push({
uid: doc.id,
name: doc.data().name || doc.data().companyName,
company: doc.data().companyName,
totalJobs: jobsCountSnap.size,
});
}
topEmployers.sort((a, b) => b.totalJobs - a.totalJobs);

return {
totalStudents,
totalEmployers,
totalAdmins,
totalJobs,
totalApplications,
jobsByDepartment,
studentsByDepartment,
employersByIndustry,
applicationsByStatus,
recentRegistrations,
topStudents: topStudents.slice(0, 10),
topEmployers: topEmployers.slice(0, 10),
};
};

// ================= Get All Users =================
const getAllUsers = async (role = null, page = 1, limit = 20) => {
let query = db.collection("users");
if (role) {
query = query.where("role", "==", role);
}

const snapshot = await query.get();
const allUsers = snapshot.docs.map((doc) => ({
id: doc.id,
...doc.data(),
}));

// Pagination
const start = (page - 1) * limit;
const end = start + limit;
const paginatedUsers = allUsers.slice(start, end);

return {
users: paginatedUsers,
total: allUsers.length,
page,
totalPages: Math.ceil(allUsers.length / limit),
};
};

// ================= Make User Admin =================
const makeAdmin = async (targetUid, adminUid) => {
// Verify the target user exists
const targetDoc = await db.collection("users").doc(targetUid).get();
if (!targetDoc.exists) {
throw new Error("User not found");
}

// Update Auth claims
await admin.auth().setCustomUserClaims(targetUid, { role: "admin" });

// Update Firestore
await db.collection("users").doc(targetUid).update({
role: "admin",
madeAdminAt: admin.firestore.FieldValue.serverTimestamp(),
madeAdminBy: adminUid,
});

// Log the action
await db.collection("adminLogs").add({
action: "make_admin",
targetUid,
performedBy: adminUid,
timestamp: admin.firestore.FieldValue.serverTimestamp(),
});

return { success: true, message: "User promoted to admin successfully" };
};

// ================= Remove Admin Role =================
const removeAdmin = async (targetUid, adminUid) => {
const targetDoc = await db.collection("users").doc(targetUid).get();
if (!targetDoc.exists) {
throw new Error("User not found");
}

const targetData = targetDoc.data();

// Check if it's the main admin (cannot remove)
if (targetData.email === process.env.ADMIN_EMAIL) {
throw new Error("Cannot remove the main admin");
}

await admin.auth().setCustomUserClaims(targetUid, { role: "student" });
await db.collection("users").doc(targetUid).update({
role: "student",
removedAdminAt: admin.firestore.FieldValue.serverTimestamp(),
removedAdminBy: adminUid,
});

await db.collection("adminLogs").add({
action: "remove_admin",
targetUid,
performedBy: adminUid,
timestamp: admin.firestore.FieldValue.serverTimestamp(),
});

return { success: true, message: "Admin role removed successfully" };
};

// ================= Admin Delete Job =================
const adminDeleteJob = async (jobId, adminUid) => {
const jobDoc = await db.collection("jobs").doc(jobId).get();
if (!jobDoc.exists) {
throw new Error("Job not found");
}

const jobData = jobDoc.data();

// Delete related applications
const appsSnap = await db
.collection("applications")
.where("jobId", "==", jobId)
.get();
const batch = db.batch();
appsSnap.forEach((doc) => {
batch.delete(doc.ref);
});
batch.delete(db.collection("jobs").doc(jobId));
await batch.commit();

// Log the action
await db.collection("adminLogs").add({
action: "delete_job",
jobId,
jobTitle: jobData.title,
performedBy: adminUid,
timestamp: admin.firestore.FieldValue.serverTimestamp(),
});

return { success: true, message: "Job and related applications deleted" };
};

// ================= Admin Delete User =================
const adminDeleteUser = async (targetUid, adminUid) => {
const targetDoc = await db.collection("users").doc(targetUid).get();
if (!targetDoc.exists) {
throw new Error("User not found");
}

const targetData = targetDoc.data();

// Cannot delete main admin
if (targetData.email === process.env.ADMIN_EMAIL) {
throw new Error("Cannot delete the main admin");
}

// Delete user's applications
const appsSnap = await db
.collection("applications")
.where("studentUid", "==", targetUid)
.get();
const batch1 = db.batch();
appsSnap.forEach((doc) => batch1.delete(doc.ref));

// Delete ratings received
const ratingsReceivedSnap = await db
.collection("ratings")
.where("ratedUid", "==", targetUid)
.get();
ratingsReceivedSnap.forEach((doc) => batch1.delete(doc.ref));

// Delete ratings given
const ratingsGivenSnap = await db
.collection("ratings")
.where("ratedBy", "==", targetUid)
.get();
ratingsGivenSnap.forEach((doc) => batch1.delete(doc.ref));

if (
!appsSnap.empty ||
!ratingsReceivedSnap.empty ||
!ratingsGivenSnap.empty
) {
await batch1.commit();
}

// Delete user's jobs (if employer)
const jobsSnap = await db
.collection("jobs")
.where("employerUid", "==", targetUid)
.get();
const batch2 = db.batch();
jobsSnap.forEach((jobDoc) => {
batch2.delete(jobDoc.ref);
// Note: Related applications should be deleted separately if needed
});
if (!jobsSnap.empty) {
await batch2.commit();
}

// Delete from Firestore
await db.collection("users").doc(targetUid).delete();

// Delete from Firebase Auth
try {
await admin.auth().deleteUser(targetUid);
} catch (err) {
// User might not exist in Auth
}

// Log the action
await db.collection("adminLogs").add({
action: "delete_user",
targetUid,
targetName: targetData.name,
targetRole: targetData.role,
performedBy: adminUid,
timestamp: admin.firestore.FieldValue.serverTimestamp(),
});

return { success: true, message: "User deleted completely" };
};

// ================= Admin Get All Jobs =================
const adminGetAllJobs = async (filters = {}) => {
let query = db.collection("jobs");

if (filters.department) {
query = query.where("department", "==", filters.department);
}

if (filters.status) {
query = query.where("status", "==", filters.status);
}

const snapshot = await query.get();

const jobs = [];
for (const doc of snapshot.docs) {
const jobData = { id: doc.id, ...doc.data() };

// Get employer info
const employerDoc = await db
.collection("users")
.doc(jobData.employerUid)
.get();
if (employerDoc.exists) {
jobData.employer = {
name: employerDoc.data().name,
company: employerDoc.data().companyName,
};
}

// Get applications count
const appsCount = await db
.collection("applications")
.where("jobId", "==", doc.id)
.get();
jobData.applicationsCount = appsCount.size;

jobs.push(jobData);
}

return jobs;
};

// ================= Admin Update Job Status =================
const adminUpdateJobStatus = async (jobId, status, adminUid) => {
const validStatuses = ["active", "closed", "paused", "rejected"];
if (!validStatuses.includes(status)) {
throw new Error(
"Invalid status. Must be: active, closed, paused, rejected",
);
}

await db.collection("jobs").doc(jobId).update({
status,
updatedAt: admin.firestore.FieldValue.serverTimestamp(),
statusUpdatedBy: adminUid,
});

await db.collection("adminLogs").add({
action: "update_job_status",
jobId,
newStatus: status,
performedBy: adminUid,
timestamp: admin.firestore.FieldValue.serverTimestamp(),
});

return { success: true, message: `Job status updated to ${status}` };
};

// ================= Admin Get All Applications =================
const adminGetAllApplications = async (filters = {}) => {
let query = db.collection("applications");

if (filters.status) {
query = query.where("status", "==", filters.status);
}

const snapshot = await query.get();

const applications = [];
for (const doc of snapshot.docs) {
const appData = { id: doc.id, ...doc.data() };

// Get student info
const studentDoc = await db
.collection("users")
.doc(appData.studentUid)
.get();
if (studentDoc.exists) {
appData.student = {
uid: studentDoc.id,
name: studentDoc.data().name,
email: studentDoc.data().email,
department: studentDoc.data().department,
year: studentDoc.data().year,
gpa: studentDoc.data().gpa,
};
}

// Get job info
const jobDoc = await db.collection("jobs").doc(appData.jobId).get();
if (jobDoc.exists) {
const jobData = jobDoc.data();
appData.job = {
id: jobDoc.id,
title: jobData.title,
department: jobData.department,
};

// Get employer info
if (jobData.employerUid) {
const employerDoc = await db
.collection("users")
.doc(jobData.employerUid)
.get();
if (employerDoc.exists) {
appData.job.employer =
employerDoc.data().name || employerDoc.data().companyName;
}
}
}

applications.push(appData);
}

return applications;
};

// ================= Admin Update Application Status =================
const adminUpdateApplicationStatus = async (
applicationId,
status,
adminUid,
) => {
const validStatuses = ["pending", "accepted", "rejected", "under_review"];
if (!validStatuses.includes(status)) {
throw new Error("Invalid status");
}

await db.collection("applications").doc(applicationId).update({
status,
reviewedAt: admin.firestore.FieldValue.serverTimestamp(),
reviewedBy: adminUid,
});

await db.collection("adminLogs").add({
action: "update_application_status",
applicationId,
newStatus: status,
performedBy: adminUid,
timestamp: admin.firestore.FieldValue.serverTimestamp(),
});

return { success: true, message: `Application status updated to ${status}` };
};

// ================= Get All Admins =================
const getAllAdmins = async () => {
const snapshot = await db
.collection("users")
.where("role", "==", "admin")
.get();

return snapshot.docs.map((doc) => ({
id: doc.id,
...doc.data(),
}));
};

// ================= Get Admin Logs =================
const getAdminLogs = async (limit = 50) => {
const snapshot = await db
.collection("adminLogs")
.orderBy("timestamp", "desc")
.limit(limit)
.get();

return snapshot.docs.map((doc) => ({
id: doc.id,
...doc.data(),
}));
};

// ================= Search Users =================
const searchUsers = async (searchTerm, role = null) => {
let query = db.collection("users");
if (role) {
query = query.where("role", "==", role);
}

const snapshot = await query.get();

return snapshot.docs
.map((doc) => ({ id: doc.id, ...doc.data() }))
.filter((user) => {
const name = (user.name || "").toLowerCase();
const email = (user.email || "").toLowerCase();
const search = searchTerm.toLowerCase();
return name.includes(search) || email.includes(search);
});
};

module.exports = {
getPlatformStats,
getAllUsers,
makeAdmin,
removeAdmin,
adminDeleteJob,
adminDeleteUser,
adminGetAllJobs,
adminUpdateJobStatus,
adminGetAllApplications,
adminUpdateApplicationStatus,
getAllAdmins,
getAdminLogs,
searchUsers,
};

MOBILE-APP\app-backend\src\Service\applicationService.js
const admin = require("firebase-admin");

const db = admin.firestore();

// ================= Apply to Job =================
const applyToJob = async (studentUid, jobId) => {
const appRef = db.collection("applications").doc();

await appRef.set({
studentUid,
jobId,
status: "pending",
appliedAt: admin.firestore.FieldValue.serverTimestamp(),
});

return { success: true, applicationId: appRef.id };
};

// ================= Get Job Applications =================
const getJobApplications = async (employerUid, jobId) => {
const snapshot = await db
.collection("applications")
.where("jobId", "==", jobId)
.get();

return snapshot.docs.map((doc) => ({
id: doc.id,
...doc.data(),
}));
};

// ================= Get Student Applications =================
const getStudentApplications = async (studentUid) => {
const snapshot = await db
.collection("applications")
.where("studentUid", "==", studentUid)
.get();

return snapshot.docs.map((doc) => ({
id: doc.id,
...doc.data(),
}));
};

module.exports = {
applyToJob,
getJobApplications,
getStudentApplications,
};

MOBILE-APP\app-backend\src\Service\employerService.js
const admin = require("firebase-admin");
const db = admin.firestore();

// ================= Get Employer Profile =================
const getEmployerProfile = async (employerUid) => {
const doc = await db.collection("users").doc(employerUid).get();

if (!doc.exists) {
throw new Error("Employer not found");
}

const data = doc.data();
if (data.role !== "employer") {
throw new Error("User is not an employer");
}

return { id: doc.id, ...data };
};

// ================= Update Employer Profile =================
const updateEmployerProfile = async (employerUid, profileData) => {
const allowedFields = [
"name",
"companyName",
"companyLogo",
"companyDescription",
"industry",
"website",
"phone",
"about",
"linkedin",
"location",
"employeesCount",
"foundedYear",
];

const updateData = {};
allowedFields.forEach((field) => {
if (profileData[field] !== undefined) {
updateData[field] = profileData[field];
}
});

updateData.updatedAt = admin.firestore.FieldValue.serverTimestamp();

await db.collection("users").doc(employerUid).update(updateData);

const updatedDoc = await db.collection("users").doc(employerUid).get();
return { success: true, data: { id: updatedDoc.id, ...updatedDoc.data() } };
};

// ================= Get Employer Jobs =================
const getEmployerJobs = async (employerUid, filters = {}) => {
let query = db.collection("jobs").where("employerUid", "==", employerUid);

if (filters.status) {
query = query.where("status", "==", filters.status);
}

const snapshot = await query.get();

const jobs = [];
for (const doc of snapshot.docs) {
const jobData = { id: doc.id, ...doc.data() };

// Get applications count for each job
const appsSnap = await db
.collection("applications")
.where("jobId", "==", doc.id)
.get();

jobData.applicationsCount = appsSnap.size;

// Count by status
jobData.pendingCount = 0;
jobData.acceptedCount = 0;
jobData.rejectedCount = 0;

appsSnap.forEach((appDoc) => {
const status = appDoc.data().status;
if (status === "pending") jobData.pendingCount++;
if (status === "accepted") jobData.acceptedCount++;
if (status === "rejected") jobData.rejectedCount++;
});

jobs.push(jobData);
}

return jobs;
};

// ================= Get Job Applications With Student Details =================
const getJobApplicationsWithDetails = async (employerUid, jobId) => {
// Verify job belongs to employer
const jobDoc = await db.collection("jobs").doc(jobId).get();
if (!jobDoc.exists) {
throw new Error("Job not found");
}

const jobData = jobDoc.data();
if (jobData.employerUid !== employerUid) {
throw new Error("You don't have access to this job");
}

const snapshot = await db
.collection("applications")
.where("jobId", "==", jobId)
.get();

const applications = [];
for (const doc of snapshot.docs) {
const appData = { id: doc.id, ...doc.data() };

// Get student info
const studentDoc = await db
.collection("users")
.doc(appData.studentUid)
.get();
if (studentDoc.exists) {
const studentData = studentDoc.data();
appData.student = {
uid: studentDoc.id,
name: studentData.name,
email: studentData.email,
department: studentData.department,
year: studentData.year,
gpa: studentData.gpa,
skills: studentData.skills,
profileImage: studentData.profileImage,
phone: studentData.phone,
linkedin: studentData.linkedin,
github: studentData.github,
about: studentData.about,
};
}

// Get student rating
const ratingSnap = await db
.collection("ratings")
.where("ratedUid", "==", appData.studentUid)
.get();

if (!ratingSnap.empty) {
const ratings = ratingSnap.docs.map((d) => d.data().rating);
appData.student.averageRating = parseFloat(
(ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1),
);
appData.student.totalRatings = ratings.length;
} else {
appData.student.averageRating = 0;
appData.student.totalRatings = 0;
}

applications.push(appData);
}

return applications;
};

// ================= Accept Application =================
const acceptApplication = async (employerUid, applicationId) => {
const appDoc = await db.collection("applications").doc(applicationId).get();
if (!appDoc.exists) {
throw new Error("Application not found");
}

const appData = appDoc.data();

// Verify job belongs to employer
const jobDoc = await db.collection("jobs").doc(appData.jobId).get();
if (!jobDoc.exists || jobDoc.data().employerUid !== employerUid) {
throw new Error("You don't have access to this application");
}

await db.collection("applications").doc(applicationId).update({
status: "accepted",
reviewedAt: admin.firestore.FieldValue.serverTimestamp(),
reviewedBy: employerUid,
});

return { success: true, message: "Application accepted successfully" };
};

// ================= Reject Application =================
const rejectApplication = async (employerUid, applicationId, reason = "") => {
const appDoc = await db.collection("applications").doc(applicationId).get();
if (!appDoc.exists) {
throw new Error("Application not found");
}

const appData = appDoc.data();

// Verify job belongs to employer
const jobDoc = await db.collection("jobs").doc(appData.jobId).get();
if (!jobDoc.exists || jobDoc.data().employerUid !== employerUid) {
throw new Error("You don't have access to this application");
}

const updateData = {
status: "rejected",
reviewedAt: admin.firestore.FieldValue.serverTimestamp(),
reviewedBy: employerUid,
};

if (reason) {
updateData.rejectionReason = reason;
}

await db.collection("applications").doc(applicationId).update(updateData);

return { success: true, message: "Application rejected" };
};

// ================= Get Employer Stats =================
const getEmployerStats = async (employerUid) => {
const jobsSnap = await db
.collection("jobs")
.where("employerUid", "==", employerUid)
.get();

const totalJobs = jobsSnap.size;

let totalApplications = 0;
let pendingApplications = 0;
let acceptedApplications = 0;
let rejectedApplications = 0;

for (const jobDoc of jobsSnap.docs) {
const appsSnap = await db
.collection("applications")
.where("jobId", "==", jobDoc.id)
.get();

totalApplications += appsSnap.size;

appsSnap.forEach((appDoc) => {
const status = appDoc.data().status;
if (status === "pending") pendingApplications++;
if (status === "accepted") acceptedApplications++;
if (status === "rejected") rejectedApplications++;
});
}

// Get employer rating
const ratingSnap = await db
.collection("ratings")
.where("ratedUid", "==", employerUid)
.get();

let averageRating = 0;
let totalRatings = 0;
if (!ratingSnap.empty) {
const ratings = ratingSnap.docs.map((d) => d.data().rating);
averageRating = parseFloat(
(ratings.reduce((a, b) => a + b, 0) / ratings.length).toFixed(1),
);
totalRatings = ratings.length;
}

return {
totalJobs,
totalApplications,
pendingApplications,
acceptedApplications,
rejectedApplications,
averageRating,
totalRatings,
};
};

// ================= Get Employer Dashboard =================
const getEmployerDashboard = async (employerUid) => {
const stats = await getEmployerStats(employerUid);

// Get recent applications (last 10)
const jobsSnap = await db
.collection("jobs")
.where("employerUid", "==", employerUid)
.get();

const allApplications = [];
for (const jobDoc of jobsSnap.docs) {
const appsSnap = await db
.collection("applications")
.where("jobId", "==", jobDoc.id)
.orderBy("appliedAt", "desc")
.limit(5)
.get();

for (const appDoc of appsSnap.docs) {
const appData = { id: appDoc.id, ...appDoc.data() };
appData.jobTitle = jobDoc.data().title;
appData.jobId = jobDoc.id;

// Get student name
const studentDoc = await db
.collection("users")
.doc(appData.studentUid)
.get();
if (studentDoc.exists) {
appData.studentName = studentDoc.data().name;
}

allApplications.push(appData);
}
}

// Sort by date and get top 10
allApplications.sort((a, b) => {
const dateA = a.appliedAt?.toDate?.() || new Date(a.appliedAt);
const dateB = b.appliedAt?.toDate?.() || new Date(b.appliedAt);
return dateB - dateA;
});

return {
stats,
recentApplications: allApplications.slice(0, 10),
};
};

module.exports = {
getEmployerProfile,
updateEmployerProfile,
getEmployerJobs,
getJobApplicationsWithDetails,
acceptApplication,
rejectApplication,
getEmployerStats,
getEmployerDashboard,
};

MOBILE-APP\app-backend\src\Service\jobService.js
const admin = require("firebase-admin");
const db = admin.firestore();

const createJob = async (employerUid, jobData) => {
const jobRef = db.collection("jobs").doc();

await jobRef.set({
...jobData,
employerUid,
status: "active",
createdAt: admin.firestore.FieldValue.serverTimestamp(),
applicantsCount: 0,
});

return {
success: true,
jobId: jobRef.id,
message: "Job created successfully",
};
};

const updateJob = async (employerUid, jobId, updateData) => {
const jobDoc = await db.collection("jobs").doc(jobId).get();
if (!jobDoc.exists) return { success: false, message: "Job not found" };

if (jobDoc.data().employerUid !== employerUid) {
return {
success: false,
message: "You don't have permission to edit this job",
};
}

await db
.collection("jobs")
.doc(jobId)
.update({
...updateData,
updatedAt: admin.firestore.FieldValue.serverTimestamp(),
});

return { success: true, message: "Job updated successfully" };
};

const deleteJob = async (employerUid, jobId) => {
const jobDoc = await db.collection("jobs").doc(jobId).get();
if (!jobDoc.exists) return { success: false, message: "Job not found" };

if (jobDoc.data().employerUid !== employerUid) {
return {
success: false,
message: "You don't have permission to delete this job",
};
}

// Delete related applications
const appsSnap = await db
.collection("applications")
.where("jobId", "==", jobId)
.get();
const batch = db.batch();
appsSnap.forEach((doc) => batch.delete(doc.ref));
batch.delete(db.collection("jobs").doc(jobId));
await batch.commit();

return { success: true, message: "Job and related applications deleted" };
};

const getAllJobs = async () => {
const snapshot = await db.collection("jobs").get();

const jobs = [];
snapshot.forEach((doc) => {
jobs.push({
id: doc.id,
...doc.data(),
});
});

return jobs;
};

const getJobById = async (jobId) => {
const doc = await db.collection("jobs").doc(jobId).get();
if (!doc.exists) return { success: false, message: "Job not found" };

return { success: true, data: { id: doc.id, ...doc.data() } };
};

module.exports = {
createJob,
updateJob,
deleteJob,
getAllJobs,
getJobById,
};

MOBILE-APP\app-backend\src\Service\ratingService.js
const admin = require("firebase-admin");
const db = admin.firestore();

// ================= Rate Student =================
const rateStudent = async (
ratedByUid,
studentUid,
{ rating, review, applicationId },
) => {
// Validate rating
if (!rating || rating < 1 || rating > 5) {
throw new Error("Rating must be between 1 and 5");
}

// Verify student exists
const studentDoc = await db.collection("users").doc(studentUid).get();
if (!studentDoc.exists) {
throw new Error("Student not found");
}

if (studentDoc.data().role !== "student") {
throw new Error("Target user is not a student");
}

// Check if already rated (same rater for same student)
let existingQuery = db
.collection("ratings")
.where("ratedBy", "==", ratedByUid)
.where("ratedUid", "==", studentUid);

if (applicationId) {
existingQuery = existingQuery.where("applicationId", "==", applicationId);
}

const existingRating = await existingQuery.get();

if (!existingRating.empty) {
// Update existing rating
const ratingId = existingRating.docs[0].id;
await db
.collection("ratings")
.doc(ratingId)
.update({
rating,
review: review || "",
updatedAt: admin.firestore.FieldValue.serverTimestamp(),
});

return { success: true, message: "Rating updated", ratingId };
}

// Create new rating
const ratingData = {
ratedBy: ratedByUid,
ratedUid: studentUid,
rating,
review: review || "",
type: "student",
createdAt: admin.firestore.FieldValue.serverTimestamp(),
};

if (applicationId) {
ratingData.applicationId = applicationId;
}

const ratingRef = await db.collection("ratings").add(ratingData);

return { success: true, message: "Rating added", ratingId: ratingRef.id };
};

// ================= Rate Employer =================
const rateEmployer = async (ratedByUid, employerUid, { rating, review }) => {
if (!rating || rating < 1 || rating > 5) {
throw new Error("Rating must be between 1 and 5");
}

// Verify employer exists
const employerDoc = await db.collection("users").doc(employerUid).get();
if (!employerDoc.exists) {
throw new Error("Employer not found");
}

if (employerDoc.data().role !== "employer") {
throw new Error("Target user is not an employer");
}

// Check if already rated
const existingRating = await db
.collection("ratings")
.where("ratedBy", "==", ratedByUid)
.where("ratedUid", "==", employerUid)
.get();

if (!existingRating.empty) {
const ratingId = existingRating.docs[0].id;
await db
.collection("ratings")
.doc(ratingId)
.update({
rating,
review: review || "",
updatedAt: admin.firestore.FieldValue.serverTimestamp(),
});

return { success: true, message: "Rating updated", ratingId };
}

const ratingRef = await db.collection("ratings").add({
ratedBy: ratedByUid,
ratedUid: employerUid,
rating,
review: review || "",
type: "employer",
createdAt: admin.firestore.FieldValue.serverTimestamp(),
});

return { success: true, message: "Rating added", ratingId: ratingRef.id };
};

// ================= Get User Rating =================
const getUserRating = async (uid) => {
const snapshot = await db
.collection("ratings")
.where("ratedUid", "==", uid)
.get();

if (snapshot.empty) {
return {
average: 0,
total: 0,
ratings: [],
distribution: { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 },
};
}

const ratings = [];
const distribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
let totalRating = 0;

for (const doc of snapshot.docs) {
const data = doc.data();
ratings.push({ id: doc.id, ...data });
totalRating += data.rating;
distribution[data.rating] = (distribution[data.rating] || 0) + 1;
}

const average = parseFloat((totalRating / ratings.length).toFixed(1));

// Get rater names
for (const rating of ratings) {
const raterDoc = await db.collection("users").doc(rating.ratedBy).get();
if (raterDoc.exists) {
rating.raterName = raterDoc.data().name;
rating.raterRole = raterDoc.data().role;
}
}

return {
average,
total: ratings.length,
ratings,
distribution,
};
};

// ================= Get Ratings Given By User =================
const getRatingsGiven = async (uid) => {
const snapshot = await db
.collection("ratings")
.where("ratedBy", "==", uid)
.get();

const ratings = [];
for (const doc of snapshot.docs) {
const data = { id: doc.id, ...doc.data() };

// Get rated user info
const ratedDoc = await db.collection("users").doc(data.ratedUid).get();
if (ratedDoc.exists) {
data.ratedUser = {
name: ratedDoc.data().name,
role: ratedDoc.data().role,
};
}

ratings.push(data);
}

return ratings;
};

// ================= Delete Rating (Admin Only) =================
const deleteRating = async (ratingId, adminUid) => {
await db.collection("ratings").doc(ratingId).delete();

await db.collection("adminLogs").add({
action: "delete_rating",
ratingId,
performedBy: adminUid,
timestamp: admin.firestore.FieldValue.serverTimestamp(),
});

return { success: true, message: "Rating deleted" };
};

// ================= Get Student Rating by Employer =================
const getStudentRatingByEmployer = async (employerUid, studentUid) => {
const snapshot = await db
.collection("ratings")
.where("ratedBy", "==", employerUid)
.where("ratedUid", "==", studentUid)
.get();

if (snapshot.empty) {
return null;
}

return { id: snapshot.docs[0].id, ...snapshot.docs[0].data() };
};

module.exports = {
rateStudent,
rateEmployer,
getUserRating,
getRatingsGiven,
deleteRating,
getStudentRatingByEmployer,
};

MOBILE-APP\app-backend\src\firebase.js
const admin = require("firebase-admin");

// ضع محتوى ملف الـ JSON اللي نزلته من فاير بيز هنا بالكامل
// (افتح ملف الـ JSON اللي نزلته، وانسخ كل اللي جوه، واحطه مكان القوسين {})
const serviceAccount = {
type: "service_account",
project_id: "student-jobs-portal",
private_key_id: "44ee42c1ff8f718f7a64cb47b88db13e8ad2dc7c",
private_key:
"-----BEGIN PRIVATE KEY-----\nMIIEuwIBADANBgkqhkiG9w0BAQEFAASCBKUwggShAgEAAoIBAQDfRjbNgllP/L4l\nOXQcAF+jBoZiWUwnrhdIatIxxs2BpCZshWiK54D4BWSkzTnyLQ8GetiU9pIvTykV\nkv4dc5WC4UIIlkxPyprjeghPieiiGSr8+2rXEGHmXpw5qczciLqnOtUBuHAC3p8W\nNmdYOtejfD2A6fC30gfHsA+Tm+lQ50+LxZlwYAaMeV3UWhsQ3VRRM7G/eu6OGhZR\nOFJiT6POevO5A1zXBAPtE1bPOqd0Rub2Qrf5HdWYMXpvpmD0HxYOBnwuuiFe5pqT\nwLn27QUlS2fJ0QBWTX0JsjLiFKuZ6jIT2YYPQgR9PlgXPfa9SbRjZbbbjqgD612g\nYbN6z2R5AgMBAAECgf9nxiHWMR+DmIcPPwTtt767tUIAl7JYW3kopNLp1usmYQUz\nx7+9lw3sOSO1LkpZXh8aIFtJ4UJtJWFoaS06GG0FVhflpdlLEhyPCKywoKUKJC+a\nXqRbn34aH1gSn7k/DlwIHf5Ng73E7QInqbb0MkjHt0HQl1zVaJP1IziL9KfHX/mX\nXIiMj+Js3r0x3ud9sCBPYq+xlZwYEFm/D1I4MdrGb8USFi/HzAEgMDjg2R5Aaj2y\nbbkVCeYePTEr4FOgwcm566fVCfJr0H+1+/vFYVPvxNndU3s36OG9/hqrdskGesCz\nxaBsDUQ6AYLc+e97myqrVPqb/gBgjwCD2xfAz2ECgYEA74D/XMIYiIwnetcMjhch\nJV+p4tvGOfA62jUV2h0xllWUtk8DNYIrVDVUzw/alPFaZvI3Y6fyAdtLA19rZmfE\nAs1IWnarL5r4W30Ael1hANozuvLaO8nKKY8Nevfc4gOb+npt3Jv+KrtSAABwmdik\n0wHfoD7t36xXamgHF1k1ZpkCgYEA7qcNFpgj9LhiRGKTh9Wl8CKrUFFbx+zV4aWT\nbaiPiOuWgeNkRdumcHlxlRS3fCtMQhkiexxYLtb9SPf/k8ZL5YoaVUom6Ctq7++7\nMtQj52cuuRK0pD2ACFuB8ANKrha1AtMwcfXDwjWEzI1mu47Sow1Rp7I8MzZtz72x\n5wzc+OECgYBp5z2Dk6PrhSXT8JFxpxKWBxYE5S9i4TH02PJfrvcFRbRrZMbDe1qT\ncr2cjaMWpx5VVRde7p1ZatFhnWjNMGcA4irzLXQGqdzV/5EdinrhOJsVOFt9gn3t\nIH9Sd5VpLzVibY50tVmPJaNdstQXgy9mynZK0mi2tes1duhjz6OISQKBgAC9Pboj\nMIFSjONfVsul6sSqptMx3VHqNuNjCujdC8zFxgqS9L2Op55Tkfl/Pe5BiBPwVf4B\noXhLrC8srXr8s0F7wwcemq4/bC5gFLlclNvjou5p02tq0Vm1RtrCd9nAMkFW/CBu\nPXP9jHLBwV61W4urv+QAFlWmRoLNOJ7ZmFmhAoGBAOX0kDmLFJbQJ2YYJTrhzM3G\naV5bFhAT/t1bu70W+G2+J8LFkOQda3Uk4cOKO1odL/eccfKLQegPs2I0aCdw8WDi\nHxJ8A1MMGKMn7Zm6zbwlJGERO+LCZuENOJPBOyhBQGR/EHdP3ktNxrbVx8mbXjs5\nLUVwFAGPaefaAy+5+w/S\n-----END PRIVATE KEY-----\n",
client_email:
"firebase-adminsdk-fbsvc@student-jobs-portal.iam.gserviceaccount.com",
client_id: "113378618219587619138",
auth_uri: "https://accounts.google.com/o/oauth2/auth",
token_uri: "https://oauth2.googleapis.com/token",
auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
client_x509_cert_url:
"https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40student-jobs-portal.iam.gserviceaccount.com",
universe_domain: "googleapis.com",
};

admin.initializeApp({
credential: admin.credential.cert(serviceAccount),
});

const db = admin.firestore();

module.exports = { admin, db };

MOBILE-APP\app-backend\src\index.js
const express = require("express");
const cors = require("cors");

const app = express(); // 👈 ده السطر الناقص

app.use(
cors({
origin: ["*"],
methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
credentials: true,
}),
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const authRoute = require("./Routes/authRoute");
const profileRoutes = require("./Routes/profile");
const dashboardRoutes = require("./Routes/dashboard");
const jobRoutes = require("./Routes/jobRoute");
const applicationRoutes = require("./Routes/applicationRoute");
const adminRoutes = require("./Routes/adminRoute");
const employerRoutes = require("./Routes/employerRoute");
const ratingRoutes = require("./Routes/ratingRoute");

app.use("/api", authRoute);
app.use("/api", profileRoutes);
app.use("/api", dashboardRoutes);
app.use("/api", jobRoutes);
app.use("/api", applicationRoutes);
app.use("/api", adminRoutes);
app.use("/api", employerRoutes);
app.use("/api", ratingRoutes);

app.get("/", (req, res) => {
res.send("API is running 🚀");
});

app.get("/api/docs", (req, res) => {
res.json({
message: "Student Job Portal API",
version: "2.0.0",
});
});

app.use((err, req, res, next) => {
console.error("Error:", err);
res.status(500).json({
success: false,
message: err.message || "Server Error",
});
});

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
console.log(`Server running on port ${PORT}`);
});
