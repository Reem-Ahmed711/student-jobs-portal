import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import Login from './pages/login';
import Register from './pages/Register';
import StudentProfile from './pages/StudentProfile';
import StudentDashboard from './pages/StudentDashboard';
import StudentApplications from './pages/StudentApplications';
import StudentSavedJobs from './pages/StudentSavedJobs';
import StudentSkillsCV from './pages/StudentSkillsCV';
import StudentSettings from './pages/StudentSettings';
import StudentNotifications from './pages/StudentNotifications';
import AvailableJobs from './pages/AvailableJobs';
import AdminProfile from './pages/admin/AdminProfile';
import './styles/main.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          {/* Student Routes */}
          <Route path="/student-profile" element={<StudentProfile />} />
          <Route path="/student-dashboard" element={<StudentDashboard />} />
          <Route path="/student-applications" element={<StudentApplications />} />
          <Route path="/student-saved-jobs" element={<StudentSavedJobs />} />
          <Route path="/student-skills-cv" element={<StudentSkillsCV />} />
          <Route path="/student-settings" element={<StudentSettings />} />
          <Route path="/student-notifications" element={<StudentNotifications />} />
          <Route path="/available-jobs" element={<AvailableJobs />} />
          
          {/* Admin Routes */}
          <Route path="/admin-profile" element={<AdminProfile />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;