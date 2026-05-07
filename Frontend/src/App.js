// src/App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ThemeProvider } from './context/ThemeContext';
import Layout from './components/Layout';

// Import pages
import Login from './pages/login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import StudentDashboard from './pages/StudentDashboard';
import StudentApplications from './pages/StudentApplications';
import StudentSavedJobs from './pages/StudentSavedJobs';
import StudentSkillsCV from './pages/StudentSkillsCV';
import StudentSettings from './pages/StudentSettings';
import StudentNotifications from './pages/StudentNotifications';
import StudentProfile from './pages/StudentProfile';
import AvailableJobs from './pages/AvailableJobs';
import EmployerDashboard from './pages/employer/EmployerDashboard';
import EmployerPostJob from './pages/employer/EmployerPostJob';
import EmployerMyJobs from './pages/employer/EmployerMyJobs';
import EmployerApplicants from './pages/employer/EmployerApplicants';
import EmployerShortlisted from './pages/employer/EmployerShortlisted';
import EmployerAIMatching from './pages/employer/EmployerAIMatching';
import EmployerHiringHistory from './pages/employer/EmployerHiringHistory';
import EmployerSettings from './pages/employer/EmployerSettings';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminManageUsers from './pages/admin/AdminManageUsers';
import AdminManageJobs from './pages/admin/AdminManageJobs';
import AdminProfile from './pages/admin/AdminProfile';
import AdminReports from './pages/admin/AdminReports';
import NotFound from './pages/NotFound';

import './styles/main.css';

// Wrapper component to wrap pages with Layout
const PageWrapper = ({ children }) => <Layout>{children}</Layout>;

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <Router>
          <Routes>
            {/* Public routes (no layout) */}
            <Route path="/" element={<Login />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            
            {/* Student routes (with layout) */}
            <Route path="/student-dashboard" element={<PageWrapper><StudentDashboard /></PageWrapper>} />
            <Route path="/student-applications" element={<PageWrapper><StudentApplications /></PageWrapper>} />
            <Route path="/student-saved-jobs" element={<PageWrapper><StudentSavedJobs /></PageWrapper>} />
            <Route path="/student-skills-cv" element={<PageWrapper><StudentSkillsCV /></PageWrapper>} />
            <Route path="/student-settings" element={<PageWrapper><StudentSettings /></PageWrapper>} />
            <Route path="/student-notifications" element={<PageWrapper><StudentNotifications /></PageWrapper>} />
            <Route path="/student-profile" element={<PageWrapper><StudentProfile /></PageWrapper>} />
            <Route path="/available-jobs" element={<PageWrapper><AvailableJobs /></PageWrapper>} />
            
            {/* Employer routes (with layout) */}
            <Route path="/employer-dashboard" element={<PageWrapper><EmployerDashboard /></PageWrapper>} />
            <Route path="/employer-post-job" element={<PageWrapper><EmployerPostJob /></PageWrapper>} />
            <Route path="/employer-my-jobs" element={<PageWrapper><EmployerMyJobs /></PageWrapper>} />
            <Route path="/employer-applicants" element={<PageWrapper><EmployerApplicants /></PageWrapper>} />
            <Route path="/employer-shortlisted" element={<PageWrapper><EmployerShortlisted /></PageWrapper>} />
            <Route path="/employer-ai-matching" element={<PageWrapper><EmployerAIMatching /></PageWrapper>} />
            <Route path="/employer-hiring-history" element={<PageWrapper><EmployerHiringHistory /></PageWrapper>} />
            <Route path="/employer-settings" element={<PageWrapper><EmployerSettings /></PageWrapper>} />
            
            {/* Admin routes (with layout) */}
            <Route path="/admin-dashboard" element={<PageWrapper><AdminDashboard /></PageWrapper>} />
            <Route path="/admin-manage-users" element={<PageWrapper><AdminManageUsers /></PageWrapper>} />
            <Route path="/admin-manage-jobs" element={<PageWrapper><AdminManageJobs /></PageWrapper>} />
            <Route path="/admin-profile" element={<PageWrapper><AdminProfile /></PageWrapper>} />
            <Route path="/admin-reports" element={<PageWrapper><AdminReports /></PageWrapper>} />
            
            {/* 404 */}
            <Route path="*" element={<PageWrapper><NotFound /></PageWrapper>} />
          </Routes>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
