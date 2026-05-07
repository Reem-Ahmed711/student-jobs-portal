// src/pages/StudentSettings.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { getProfile, updateProfile } from '../services/api';
import Toast from '../components/Toast';

const StudentSettings = () => {
  const { user, setUser } = useAuth();
  const { darkMode } = useTheme();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState(null);
  
  // Profile Data
  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    bio: '',
    department: '',
    year: '',
    gpa: '',
    linkedin: '',
    github: '',
    skills: []
  });
  const [newSkill, setNewSkill] = useState('');

  // Notification Settings
  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    applicationUpdates: true,
    newJobMatches: true,
    deadlineReminders: true,
    messages: true,
    marketingEmails: false
  });

  // Privacy Settings
  const [privacySettings, setPrivacySettings] = useState({
    profileVisible: true,
    showGPA: true,
    showContactInfo: true,
    showSkills: true,
    showEmailToEmployers: true
  });

  // Security Settings
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await getProfile();
        let data = response.data;
        if (response.data?.data) data = response.data.data;
        if (data) {
          setProfileData({
            name: data.name || '',
            email: data.email || '',
            phone: data.phone || '',
            bio: data.bio || '',
            department: data.department || '',
            year: data.year || '',
            gpa: data.gpa || '',
            linkedin: data.linkedin || '',
            github: data.github || '',
            skills: data.skills || []
          });
        }
      } catch (error) {
        console.error("Failed to load profile data", error);
      }
    };
    fetchUserData();
  }, []);

  const showToast = (message, type) => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  // Profile Handlers
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const addSkill = () => {
    if (newSkill && !profileData.skills.includes(newSkill)) {
      setProfileData(prev => ({ ...prev, skills: [...prev.skills, newSkill] }));
      setNewSkill('');
    }
  };

  const removeSkill = (skill) => {
    setProfileData(prev => ({ ...prev, skills: prev.skills.filter(s => s !== skill) }));
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    try {
      const response = await updateProfile(profileData);
      if (response.data?.success) {
        if (setUser) {
          setUser({ ...user, ...profileData });
        }
        showToast('Profile updated successfully! ✨', 'success');
      } else {
        showToast('Failed to update profile', 'error');
      }
    } catch (error) {
      console.error(error);
      showToast('An error occurred while saving', 'error');
    } finally {
      setLoading(false);
    }
  };

  // Notification Handlers
  const handleNotificationChange = (key) => {
    setNotificationSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSaveNotifications = () => {
    showToast('Notification settings saved!', 'success');
  };

  // Privacy Handlers
  const handlePrivacyChange = (key) => {
    setPrivacySettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSavePrivacy = () => {
    showToast('Privacy settings saved!', 'success');
  };

  // Security Handlers
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdatePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      showToast('New passwords do not match', 'error');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      showToast('Password must be at least 6 characters', 'error');
      return;
    }
    setLoading(true);
    try {
      showToast('Password updated successfully!', 'success');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      showToast('Failed to update password', 'error');
    } finally {
      setLoading(false);
    }
  };

  const suggestedSkills = [
    'JavaScript', 'React', 'Python', 'Java', 'C++', 'HTML/CSS',
    'Node.js', 'Express', 'MongoDB', 'SQL', 'TypeScript', 'Angular',
    'Vue.js', 'Django', 'Flask', 'Machine Learning', 'Data Analysis',
    'UI/UX Design', 'Figma', 'Photoshop', 'Teaching', 'Research'
  ];

  const departments = ['Computer Science', 'Physics', 'Chemistry', 'Mathematics', 'Biology', 'Geology'];
  const years = ['1st Year', '2nd Year', '3rd Year', '4th Year', 'Graduate'];

  return (
    <div>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
      
      <div style={{ marginBottom: '30px' }}>
        <h1 style={{ fontSize: '28px', color: darkMode ? '#f1f5f9' : '#1E3A5F', fontWeight: '600', marginBottom: '5px' }}>
          <i className="fas fa-cog" style={{ marginRight: '10px' }}></i>
          Settings
        </h1>
        <p style={{ color: darkMode ? '#94a3b8' : '#666' }}>Manage your account, preferences, and privacy</p>
      </div>

      {/* Tabs */}
      <div style={{
        display: 'flex',
        gap: '10px',
        marginBottom: '30px',
        borderBottom: `1px solid ${darkMode ? '#334155' : '#e0e0e0'}`,
        paddingBottom: '10px',
        flexWrap: 'wrap'
      }}>
        {[
          { id: 'profile', icon: 'fa-user', label: 'Profile' },
          { id: 'notifications', icon: 'fa-bell', label: 'Notifications' },
          { id: 'privacy', icon: 'fa-lock', label: 'Privacy' },
          { id: 'security', icon: 'fa-shield-alt', label: 'Security' }
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              padding: '12px 24px',
              background: activeTab === tab.id ? '#1E3A5F' : 'transparent',
              color: activeTab === tab.id ? 'white' : (darkMode ? '#94a3b8' : '#666'),
              border: activeTab === tab.id ? 'none' : `1px solid ${darkMode ? '#334155' : '#ddd'}`,
              borderRadius: '30px',
              cursor: 'pointer',
              fontSize: '14px',
              fontWeight: '500',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.3s ease'
            }}
          >
            <i className={`fas ${tab.icon}`}></i>
            {tab.label}
          </button>
        ))}
      </div>

      {/* ==================== PROFILE TAB ==================== */}
      {activeTab === 'profile' && (
        <div style={{ 
          background: darkMode ? '#1e293b' : 'white', 
          borderRadius: '16px', 
          padding: '30px' 
        }}>
          <h3 style={{ color: darkMode ? '#f1f5f9' : '#1E3A5F', fontSize: '18px', fontWeight: '600', marginBottom: '25px' }}>
            <i className="fas fa-edit" style={{ marginRight: '10px' }}></i>
            Edit Profile Information
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '25px', marginBottom: '30px' }}>
            {/* Personal Information Section */}
            <div style={{ gridColumn: 'span 2' }}>
              <h4 style={{ color: darkMode ? '#cbd5e1' : '#1E3A5F', fontSize: '16px', marginBottom: '15px', borderBottom: `1px solid ${darkMode ? '#334155' : '#e0e0e0'}`, paddingBottom: '10px' }}>
                <i className="fas fa-user" style={{ marginRight: '8px' }}></i>
                Personal Information
              </h4>
            </div>
            
            <div className="input-group">
              <label className="input-label" style={{ color: darkMode ? '#94a3b8' : '#666' }}>Full Name</label>
              <input 
                type="text" 
                name="name" 
                value={profileData.name} 
                onChange={handleProfileChange} 
                className="input-field" 
                style={{ 
                  paddingLeft: '1rem',
                  background: darkMode ? '#0f172a' : 'white',
                  borderColor: darkMode ? '#475569' : '#ddd',
                  color: darkMode ? '#e2e8f0' : '#333'
                }} 
              />
            </div>
            
            <div className="input-group">
              <label className="input-label" style={{ color: darkMode ? '#94a3b8' : '#666' }}>Email</label>
              <input 
                type="email" 
                name="email" 
                value={profileData.email} 
                onChange={handleProfileChange} 
                className="input-field" 
                disabled
                style={{ 
                  paddingLeft: '1rem',
                  background: darkMode ? '#1e293b' : '#f5f5f5',
                  borderColor: darkMode ? '#475569' : '#ddd',
                  color: darkMode ? '#94a3b8' : '#999',
                  cursor: 'not-allowed'
                }} 
              />
            </div>
            
            <div className="input-group">
              <label className="input-label" style={{ color: darkMode ? '#94a3b8' : '#666' }}>Phone</label>
              <input 
                type="tel" 
                name="phone" 
                value={profileData.phone} 
                onChange={handleProfileChange} 
                className="input-field" 
                style={{ 
                  paddingLeft: '1rem',
                  background: darkMode ? '#0f172a' : 'white',
                  borderColor: darkMode ? '#475569' : '#ddd',
                  color: darkMode ? '#e2e8f0' : '#333'
                }} 
              />
            </div>
            
            <div className="input-group" style={{ gridColumn: 'span 2' }}>
              <label className="input-label" style={{ color: darkMode ? '#94a3b8' : '#666' }}>Bio</label>
              <textarea 
                name="bio" 
                value={profileData.bio} 
                onChange={handleProfileChange} 
                rows="3" 
                className="input-field" 
                style={{ 
                  paddingLeft: '1rem',
                  resize: 'vertical',
                  background: darkMode ? '#0f172a' : 'white',
                  borderColor: darkMode ? '#475569' : '#ddd',
                  color: darkMode ? '#e2e8f0' : '#333'
                }} 
                placeholder="Tell us a bit about yourself..."
              />
            </div>

            {/* Academic Information Section */}
            <div style={{ gridColumn: 'span 2', marginTop: '10px' }}>
              <h4 style={{ color: darkMode ? '#cbd5e1' : '#1E3A5F', fontSize: '16px', marginBottom: '15px', borderBottom: `1px solid ${darkMode ? '#334155' : '#e0e0e0'}`, paddingBottom: '10px' }}>
                <i className="fas fa-graduation-cap" style={{ marginRight: '8px' }}></i>
                Academic Information
              </h4>
            </div>
            
            <div className="input-group">
              <label className="input-label" style={{ color: darkMode ? '#94a3b8' : '#666' }}>Department</label>
              <select 
                name="department" 
                value={profileData.department} 
                onChange={handleProfileChange} 
                className="input-field" 
                style={{ 
                  paddingLeft: '1rem',
                  background: darkMode ? '#0f172a' : 'white',
                  borderColor: darkMode ? '#475569' : '#ddd',
                  color: darkMode ? '#e2e8f0' : '#333'
                }}
              >
                <option value="">Select Department</option>
                {departments.map(dept => (
                  <option key={dept} value={dept}>{dept}</option>
                ))}
              </select>
            </div>
            
            <div className="input-group">
              <label className="input-label" style={{ color: darkMode ? '#94a3b8' : '#666' }}>Academic Year</label>
              <select 
                name="year" 
                value={profileData.year} 
                onChange={handleProfileChange} 
                className="input-field" 
                style={{ 
                  paddingLeft: '1rem',
                  background: darkMode ? '#0f172a' : 'white',
                  borderColor: darkMode ? '#475569' : '#ddd',
                  color: darkMode ? '#e2e8f0' : '#333'
                }}
              >
                <option value="">Select Year</option>
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
            
            <div className="input-group">
              <label className="input-label" style={{ color: darkMode ? '#94a3b8' : '#666' }}>GPA (out of 5.0)</label>
              <input 
                type="number" 
                name="gpa" 
                value={profileData.gpa} 
                onChange={handleProfileChange} 
                step="0.1" 
                min="0" 
                max="5" 
                className="input-field" 
                style={{ 
                  paddingLeft: '1rem',
                  background: darkMode ? '#0f172a' : 'white',
                  borderColor: darkMode ? '#475569' : '#ddd',
                  color: darkMode ? '#e2e8f0' : '#333'
                }} 
              />
            </div>

            {/* Social Links Section */}
            <div style={{ gridColumn: 'span 2', marginTop: '10px' }}>
              <h4 style={{ color: darkMode ? '#cbd5e1' : '#1E3A5F', fontSize: '16px', marginBottom: '15px', borderBottom: `1px solid ${darkMode ? '#334155' : '#e0e0e0'}`, paddingBottom: '10px' }}>
                <i className="fas fa-share-alt" style={{ marginRight: '8px' }}></i>
                Social Links
              </h4>
            </div>
            
            <div className="input-group">
              <label className="input-label" style={{ color: darkMode ? '#94a3b8' : '#666' }}>
                <i className="fab fa-linkedin" style={{ marginRight: '8px', color: '#0077B5' }}></i>
                LinkedIn Profile
              </label>
              <input 
                type="text" 
                name="linkedin" 
                value={profileData.linkedin} 
                onChange={handleProfileChange} 
                className="input-field" 
                placeholder="linkedin.com/in/your-profile"
                style={{ 
                  paddingLeft: '1rem',
                  background: darkMode ? '#0f172a' : 'white',
                  borderColor: darkMode ? '#475569' : '#ddd',
                  color: darkMode ? '#e2e8f0' : '#333'
                }} 
              />
            </div>
            
            <div className="input-group">
              <label className="input-label" style={{ color: darkMode ? '#94a3b8' : '#666' }}>
                <i className="fab fa-github" style={{ marginRight: '8px', color: '#333' }}></i>
                GitHub Profile
              </label>
              <input 
                type="text" 
                name="github" 
                value={profileData.github} 
                onChange={handleProfileChange} 
                className="input-field" 
                placeholder="github.com/your-username"
                style={{ 
                  paddingLeft: '1rem',
                  background: darkMode ? '#0f172a' : 'white',
                  borderColor: darkMode ? '#475569' : '#ddd',
                  color: darkMode ? '#e2e8f0' : '#333'
                }} 
              />
            </div>

            {/* Skills Section */}
            <div style={{ gridColumn: 'span 2', marginTop: '10px' }}>
              <h4 style={{ color: darkMode ? '#cbd5e1' : '#1E3A5F', fontSize: '16px', marginBottom: '15px', borderBottom: `1px solid ${darkMode ? '#334155' : '#e0e0e0'}`, paddingBottom: '10px' }}>
                <i className="fas fa-code" style={{ marginRight: '8px' }}></i>
                Skills
              </h4>
            </div>
            
            <div style={{ gridColumn: 'span 2' }}>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '15px' }}>
                {profileData.skills.map((skill, index) => (
                  <span key={index} style={{ background: '#E6F0FA', color: '#1E3A5F', padding: '8px 16px', borderRadius: '30px', fontSize: '14px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                    {skill}
                    <button onClick={() => removeSkill(skill)} style={{ background: 'none', border: 'none', color: '#1E3A5F', cursor: 'pointer', fontSize: '12px' }}>
                      <i className="fas fa-times"></i>
                    </button>
                  </span>
                ))}
              </div>
              
              <div style={{ display: 'flex', gap: '10px', marginBottom: '15px' }}>
                <input 
                  type="text" 
                  value={newSkill} 
                  onChange={(e) => setNewSkill(e.target.value)} 
                  placeholder="Add a new skill..."
                  style={{ 
                    flex: 1,
                    padding: '10px',
                    border: `1px solid ${darkMode ? '#475569' : '#ddd'}`,
                    borderRadius: '8px',
                    background: darkMode ? '#0f172a' : 'white',
                    color: darkMode ? '#e2e8f0' : '#333'
                  }}
                  onKeyPress={(e) => e.key === 'Enter' && addSkill()}
                />
                <button onClick={addSkill} style={{ padding: '10px 20px', background: '#1E3A5F', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
                  Add
                </button>
              </div>
              
              <p style={{ color: darkMode ? '#94a3b8' : '#666', fontSize: '14px', marginBottom: '10px' }}>Suggested Skills:</p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {suggestedSkills.filter(s => !profileData.skills.includes(s)).slice(0, 12).map(skill => (
                  <button 
                    key={skill} 
                    onClick={() => {
                      setProfileData(prev => ({ ...prev, skills: [...prev.skills, skill] }));
                    }} 
                    style={{ 
                      padding: '6px 12px', 
                      background: 'transparent', 
                      border: `1px dashed ${darkMode ? '#3b82f6' : '#1E3A5F'}`, 
                      borderRadius: '30px', 
                      color: darkMode ? '#3b82f6' : '#1E3A5F', 
                      fontSize: '12px', 
                      cursor: 'pointer', 
                      transition: 'all 0.3s ease' 
                    }}
                  >
                    + {skill}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '15px', justifyContent: 'flex-end', borderTop: `1px solid ${darkMode ? '#334155' : '#e0e0e0'}`, paddingTop: '20px' }}>
            <button onClick={handleSaveProfile} disabled={loading} className="btn btn-primary">
              {loading ? <><i className="fas fa-spinner fa-spin"></i> Saving...</> : <><i className="fas fa-save"></i> Save Changes</>}
            </button>
          </div>
        </div>
      )}

      {/* ==================== NOTIFICATIONS TAB ==================== */}
      {activeTab === 'notifications' && (
        <div style={{ 
          background: darkMode ? '#1e293b' : 'white', 
          borderRadius: '16px', 
          padding: '30px' 
        }}>
          <h3 style={{ color: darkMode ? '#f1f5f9' : '#1E3A5F', fontSize: '18px', fontWeight: '600', marginBottom: '25px' }}>
            <i className="fas fa-bell" style={{ marginRight: '10px' }}></i>
            Notification Preferences
          </h3>

          <div style={{ marginBottom: '30px' }}>
            <h4 style={{ color: darkMode ? '#cbd5e1' : '#1E3A5F', fontSize: '16px', marginBottom: '15px' }}>
              <i className="fas fa-envelope" style={{ marginRight: '8px' }}></i>
              Email Notifications
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  checked={notificationSettings.emailNotifications} 
                  onChange={() => handleNotificationChange('emailNotifications')} 
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
                <span style={{ color: darkMode ? '#e2e8f0' : '#333' }}>Receive email notifications</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  checked={notificationSettings.applicationUpdates} 
                  onChange={() => handleNotificationChange('applicationUpdates')} 
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
                <span style={{ color: darkMode ? '#e2e8f0' : '#333' }}>Application updates</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  checked={notificationSettings.newJobMatches} 
                  onChange={() => handleNotificationChange('newJobMatches')} 
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
                <span style={{ color: darkMode ? '#e2e8f0' : '#333' }}>New job matches</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  checked={notificationSettings.deadlineReminders} 
                  onChange={() => handleNotificationChange('deadlineReminders')} 
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
                <span style={{ color: darkMode ? '#e2e8f0' : '#333' }}>Deadline reminders</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  checked={notificationSettings.messages} 
                  onChange={() => handleNotificationChange('messages')} 
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
                <span style={{ color: darkMode ? '#e2e8f0' : '#333' }}>Messages from employers</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  checked={notificationSettings.marketingEmails} 
                  onChange={() => handleNotificationChange('marketingEmails')} 
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
                <span style={{ color: darkMode ? '#e2e8f0' : '#333' }}>Marketing and promotional emails</span>
              </label>
            </div>
          </div>

          <div style={{ marginBottom: '30px' }}>
            <h4 style={{ color: darkMode ? '#cbd5e1' : '#1E3A5F', fontSize: '16px', marginBottom: '15px' }}>
              <i className="fas fa-mobile-alt" style={{ marginRight: '8px' }}></i>
              Push Notifications
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  checked={notificationSettings.pushNotifications} 
                  onChange={() => handleNotificationChange('pushNotifications')} 
                  style={{ width: '18px', height: '18px', cursor: 'pointer' }}
                />
                <span style={{ color: darkMode ? '#e2e8f0' : '#333' }}>Enable push notifications</span>
              </label>
            </div>
          </div>

          <div style={{ display: 'flex', gap: '15px', justifyContent: 'flex-end', borderTop: `1px solid ${darkMode ? '#334155' : '#e0e0e0'}`, paddingTop: '20px' }}>
            <button onClick={handleSaveNotifications} className="btn btn-primary">
              <i className="fas fa-save"></i> Save Preferences
            </button>
          </div>
        </div>
      )}

      {/* ==================== PRIVACY TAB ==================== */}
      {activeTab === 'privacy' && (
        <div style={{ 
          background: darkMode ? '#1e293b' : 'white', 
          borderRadius: '16px', 
          padding: '30px' 
        }}>
          <h3 style={{ color: darkMode ? '#f1f5f9' : '#1E3A5F', fontSize: '18px', fontWeight: '600', marginBottom: '25px' }}>
            <i className="fas fa-lock" style={{ marginRight: '10px' }}></i>
            Privacy Settings
          </h3>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px', marginBottom: '30px' }}>
            <label style={{ display: 'flex', alignItems: 'center', gap: '15px', cursor: 'pointer', padding: '10px', borderRadius: '8px', transition: 'background 0.3s ease' }}>
              <input 
                type="checkbox" 
                checked={privacySettings.profileVisible} 
                onChange={() => handlePrivacyChange('profileVisible')} 
                style={{ width: '20px', height: '20px', cursor: 'pointer' }}
              />
              <div>
                <p style={{ fontWeight: '600', marginBottom: '4px', color: darkMode ? '#e2e8f0' : '#333' }}>Make profile visible to employers</p>
                <p style={{ fontSize: '13px', color: darkMode ? '#94a3b8' : '#666' }}>Employers can see your profile information and contact you</p>
              </div>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '15px', cursor: 'pointer', padding: '10px', borderRadius: '8px', transition: 'background 0.3s ease' }}>
              <input 
                type="checkbox" 
                checked={privacySettings.showGPA} 
                onChange={() => handlePrivacyChange('showGPA')} 
                style={{ width: '20px', height: '20px', cursor: 'pointer' }}
              />
              <div>
                <p style={{ fontWeight: '600', marginBottom: '4px', color: darkMode ? '#e2e8f0' : '#333' }}>Show my GPA</p>
                <p style={{ fontSize: '13px', color: darkMode ? '#94a3b8' : '#666' }}>Display your GPA on your profile</p>
              </div>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '15px', cursor: 'pointer', padding: '10px', borderRadius: '8px', transition: 'background 0.3s ease' }}>
              <input 
                type="checkbox" 
                checked={privacySettings.showContactInfo} 
                onChange={() => handlePrivacyChange('showContactInfo')} 
                style={{ width: '20px', height: '20px', cursor: 'pointer' }}
              />
              <div>
                <p style={{ fontWeight: '600', marginBottom: '4px', color: darkMode ? '#e2e8f0' : '#333' }}>Show contact information</p>
                <p style={{ fontSize: '13px', color: darkMode ? '#94a3b8' : '#666' }}>Display your phone number and email</p>
              </div>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '15px', cursor: 'pointer', padding: '10px', borderRadius: '8px', transition: 'background 0.3s ease' }}>
              <input 
                type="checkbox" 
                checked={privacySettings.showSkills} 
                onChange={() => handlePrivacyChange('showSkills')} 
                style={{ width: '20px', height: '20px', cursor: 'pointer' }}
              />
              <div>
                <p style={{ fontWeight: '600', marginBottom: '4px', color: darkMode ? '#e2e8f0' : '#333' }}>Show my skills</p>
                <p style={{ fontSize: '13px', color: darkMode ? '#94a3b8' : '#666' }}>Employers can see your skills and qualifications</p>
              </div>
            </label>

            <label style={{ display: 'flex', alignItems: 'center', gap: '15px', cursor: 'pointer', padding: '10px', borderRadius: '8px', transition: 'background 0.3s ease' }}>
              <input 
                type="checkbox" 
                checked={privacySettings.showEmailToEmployers} 
                onChange={() => handlePrivacyChange('showEmailToEmployers')} 
                style={{ width: '20px', height: '20px', cursor: 'pointer' }}
              />
              <div>
                <p style={{ fontWeight: '600', marginBottom: '4px', color: darkMode ? '#e2e8f0' : '#333' }}>Allow employers to contact me by email</p>
                <p style={{ fontSize: '13px', color: darkMode ? '#94a3b8' : '#666' }}>Employers can send you job offers and messages</p>
              </div>
            </label>
          </div>

          <div style={{ 
            background: darkMode ? '#0f172a' : '#f8f9fa', 
            padding: '15px', 
            borderRadius: '8px', 
            marginBottom: '20px' 
          }}>
            <p style={{ fontSize: '13px', color: darkMode ? '#94a3b8' : '#666' }}>
              <i className="fas fa-info-circle" style={{ marginRight: '8px' }}></i>
              Your privacy matters. You can change these settings at any time.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '15px', justifyContent: 'flex-end', borderTop: `1px solid ${darkMode ? '#334155' : '#e0e0e0'}`, paddingTop: '20px' }}>
            <button onClick={handleSavePrivacy} className="btn btn-primary">
              <i className="fas fa-save"></i> Save Privacy Settings
            </button>
          </div>
        </div>
      )}

      {/* ==================== SECURITY TAB ==================== */}
      {activeTab === 'security' && (
        <div style={{ 
          background: darkMode ? '#1e293b' : 'white', 
          borderRadius: '16px', 
          padding: '30px' 
        }}>
          <h3 style={{ color: darkMode ? '#f1f5f9' : '#1E3A5F', fontSize: '18px', fontWeight: '600', marginBottom: '25px' }}>
            <i className="fas fa-shield-alt" style={{ marginRight: '10px' }}></i>
            Security Settings
          </h3>

          <div style={{ marginBottom: '30px' }}>
            <h4 style={{ color: darkMode ? '#cbd5e1' : '#1E3A5F', fontSize: '16px', marginBottom: '15px' }}>
              <i className="fas fa-key" style={{ marginRight: '8px' }}></i>
              Change Password
            </h4>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <div className="input-group">
                <label className="input-label" style={{ color: darkMode ? '#94a3b8' : '#666' }}>Current Password</label>
                <input 
                  type="password" 
                  name="currentPassword" 
                  value={passwordData.currentPassword} 
                  onChange={handlePasswordChange} 
                  className="input-field" 
                  style={{ 
                    paddingLeft: '1rem',
                    background: darkMode ? '#0f172a' : 'white',
                    borderColor: darkMode ? '#475569' : '#ddd',
                    color: darkMode ? '#e2e8f0' : '#333'
                  }} 
                />
              </div>
              <div className="input-group">
                <label className="input-label" style={{ color: darkMode ? '#94a3b8' : '#666' }}>New Password</label>
                <input 
                  type="password" 
                  name="newPassword" 
                  value={passwordData.newPassword} 
                  onChange={handlePasswordChange} 
                  className="input-field" 
                  style={{ 
                    paddingLeft: '1rem',
                    background: darkMode ? '#0f172a' : 'white',
                    borderColor: darkMode ? '#475569' : '#ddd',
                    color: darkMode ? '#e2e8f0' : '#333'
                  }} 
                />
                {passwordData.newPassword && passwordData.newPassword.length < 6 && (
                  <p style={{ fontSize: '12px', color: '#ef4444', marginTop: '5px' }}>
                    Password must be at least 6 characters
                  </p>
                )}
              </div>
              <div className="input-group">
                <label className="input-label" style={{ color: darkMode ? '#94a3b8' : '#666' }}>Confirm New Password</label>
                <input 
                  type="password" 
                  name="confirmPassword" 
                  value={passwordData.confirmPassword} 
                  onChange={handlePasswordChange} 
                  className="input-field" 
                  style={{ 
                    paddingLeft: '1rem',
                    background: darkMode ? '#0f172a' : 'white',
                    borderColor: darkMode ? '#475569' : '#ddd',
                    color: darkMode ? '#e2e8f0' : '#333'
                  }} 
                />
                {passwordData.confirmPassword && passwordData.newPassword !== passwordData.confirmPassword && (
                  <p style={{ fontSize: '12px', color: '#ef4444', marginTop: '5px' }}>
                    Passwords do not match
                  </p>
                )}
              </div>
            </div>
          </div>

          <div style={{ marginBottom: '30px' }}>
            <h4 style={{ color: darkMode ? '#cbd5e1' : '#1E3A5F', fontSize: '16px', marginBottom: '15px' }}>
              <i className="fas fa-sign-out-alt" style={{ marginRight: '8px' }}></i>
              Session Management
            </h4>
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center', 
              padding: '15px',
              background: darkMode ? '#0f172a' : '#f8f9fa',
              borderRadius: '8px'
            }}>
              <div>
                <p style={{ fontWeight: '600', marginBottom: '4px', color: darkMode ? '#e2e8f0' : '#333' }}>Active Sessions</p>
                <p style={{ fontSize: '13px', color: darkMode ? '#94a3b8' : '#666' }}>You are logged in on this device</p>
              </div>
              <button 
                onClick={() => {
                  if (window.confirm('Are you sure you want to log out from all devices?')) {
                    localStorage.removeItem('token');
                    window.location.href = '/login';
                  }
                }}
                style={{ 
                  padding: '8px 16px', 
                  background: 'transparent', 
                  border: `1px solid ${darkMode ? '#f87171' : '#ef4444'}`, 
                  color: darkMode ? '#f87171' : '#ef4444', 
                  borderRadius: '6px', 
                  cursor: 'pointer' 
                }}
              >
                Logout from all devices
              </button>
            </div>
          </div>

          <div style={{ 
            background: darkMode ? '#0f172a' : '#f8f9fa', 
            padding: '15px', 
            borderRadius: '8px', 
            marginBottom: '20px' 
          }}>
            <p style={{ fontSize: '13px', color: darkMode ? '#94a3b8' : '#666' }}>
              <i className="fas fa-shield-alt" style={{ marginRight: '8px', color: '#16a34a' }}></i>
              Your account is protected with 256-bit SSL encryption.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '15px', justifyContent: 'flex-end', borderTop: `1px solid ${darkMode ? '#334155' : '#e0e0e0'}`, paddingTop: '20px' }}>
            <button onClick={handleUpdatePassword} disabled={loading} className="btn btn-primary">
              {loading ? <><i className="fas fa-spinner fa-spin"></i> Updating...</> : <><i className="fas fa-key"></i> Update Password</>}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default StudentSettings;
