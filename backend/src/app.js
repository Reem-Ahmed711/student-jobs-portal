import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import StudentProfile from './pages/StudentProfile';
import StudentDashboard from './pages/StudentDashboard';
import StudentApplications from './pages/StudentApplications';
import StudentSavedJobs from './pages/StudentSavedJobs';
import StudentSkillsCV from './pages/StudentSkillsCV';
import StudentSettings from './pages/StudentSettings';
import StudentNotifications from './pages/StudentNotifications';
import AvailableJobs from './pages/AvailableJobs';
import EmployerDashboard from './pages/employer/EmployerDashboard';
import EmployerPostJob from './pages/employer/EmployerPostJob';
import EmployerMyJobs from './pages/employer/EmployerMyJobs';
import EmployerApplicants from './pages/employer/EmployerApplicants';
import EmployerShortlisted from './pages/employer/EmployerShortlisted';
import EmployerAIMatching from './pages/employer/EmployerAIMatching';
import EmployerHiringHistory from './pages/employer/EmployerHiringHistory';
import EmployerSettings from './pages/employer/EmployerSettings';
import AdminProfile from './pages/admin/AdminProfile';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminManageUsers from './pages/admin/AdminManageUsers';
import AdminManageJobs from './pages/admin/AdminManageJobs';
import './styles/main.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          
          {/* Student Routes */}
          <Route path="/student-profile" element={<StudentProfile />} />
          <Route path="/student-dashboard" element={<StudentDashboard />} />
          <Route path="/student-applications" element={<StudentApplications />} />
          <Route path="/student-saved-jobs" element={<StudentSavedJobs />} />
          <Route path="/student-skills-cv" element={<StudentSkillsCV />} />
          <Route path="/student-settings" element={<StudentSettings />} />
          <Route path="/student-notifications" element={<StudentNotifications />} />
          <Route path="/available-jobs" element={<AvailableJobs />} />
          
          {/* Employer Routes */}
          <Route path="/employer-dashboard" element={<EmployerDashboard />} />
          <Route path="/employer-post-job" element={<EmployerPostJob />} />
          <Route path="/employer-my-jobs" element={<EmployerMyJobs />} />
          <Route path="/employer-applicants" element={<EmployerApplicants />} />
          <Route path="/employer-shortlisted" element={<EmployerShortlisted />} />
          <Route path="/employer-ai-matching" element={<EmployerAIMatching />} />
          <Route path="/employer-hiring-history" element={<EmployerHiringHistory />} />
          <Route path="/employer-settings" element={<EmployerSettings />} />
          
          {/* Admin Routes */}
          <Route path="/admin-profile" element={<AdminProfile />} />
          <Route path="/admin-dashboard" element={<AdminDashboard />} />
          <Route path="/admin-manage-users" element={<AdminManageUsers />} />
          <Route path="/admin-manage-users" element={<AdminManageUsers />} />
          <Route path="/admin-manage-jobs" element={<AdminManageJobs />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
