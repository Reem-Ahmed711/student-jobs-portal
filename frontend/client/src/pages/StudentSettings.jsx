import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';

const StudentSettings = () => {
  const { user, updateProfile } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const [profileData, setProfileData] = useState({
    name: user?.name || 'Marium Ahmed',
    email: user?.email || 'marium.ahmed@science.cu.edu.eg',
    phone: user?.phone || '+20 123 456 7890',
    linkedin: user?.linkedin || 'linkedin.com/in/marium-ahmed',
    github: user?.github || 'github.com/marium-ahmed',
    department: user?.department || 'Physics',
    year: user?.year || '3rd Year',
    gpa: user?.gpa || '3.7'
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    smsUrgentOnly: false,
    applicationUpdates: true,
    newJobMatches: true,
    deadlineReminders: true,
    messages: true
  });

  const [privacySettings, setPrivacySettings] = useState({
    profileVisible: true,
    showGPA: true,
    showContactInfo: true,
    showSkills: true
  });

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleNotificationChange = (key) => {
    setNotificationSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handlePrivacyChange = (key) => {
    setPrivacySettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    const result = await updateProfile(profileData);
    setLoading(false);
    if (result.success) {
      setMessage('Profile updated successfully!');
      setTimeout(() => setMessage(''), 3000);
    }
  };

  return (
    <div style={{ display: 'flex', background: '#f8fafc', minHeight: '100vh' }}>
      <Navbar />
      
      <div style={{ marginLeft: '280px', padding: '30px', width: 'calc(100% - 280px)' }}>
        {/* Header */}
        <div style={{ marginBottom: '30px' }}>
          <h1 style={{ fontSize: '28px', color: '#0B2A4A', fontWeight: '600', marginBottom: '5px' }}>
            Settings
          </h1>
          <p style={{ color: '#666' }}>Manage your account preferences and settings</p>
        </div>

        {message && (
          <div style={{
            background: '#d4edda',
            color: '#155724',
            padding: '15px',
            borderRadius: '8px',
            marginBottom: '20px'
          }}>
            <i className="fas fa-check-circle" style={{ marginRight: '8px' }}></i>
            {message}
          </div>
        )}

        {/* Settings Tabs */}
        <div style={{
          display: 'flex',
          gap: '10px',
          marginBottom: '30px',
          borderBottom: '1px solid #e0e0e0',
          paddingBottom: '10px'
        }}>
          {['profile', 'notifications', 'privacy', 'security'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              style={{
                padding: '10px 20px',
                background: activeTab === tab ? '#0B2A4A' : 'white',
                color: activeTab === tab ? 'white' : '#666',
                border: activeTab === tab ? 'none' : '1px solid #ddd',
                borderRadius: '30px',
                cursor: 'pointer',
                fontSize: '14px',
                textTransform: 'capitalize'
              }}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Profile Settings */}
        {activeTab === 'profile' && (
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '30px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ color: '#0B2A4A', fontSize: '18px', fontWeight: '600', marginBottom: '20px' }}>
              Profile Information
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: '#0B2A4A', fontWeight: '500' }}>
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={profileData.name}
                  onChange={handleProfileChange}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: '#0B2A4A', fontWeight: '500' }}>
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={profileData.email}
                  onChange={handleProfileChange}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: '#0B2A4A', fontWeight: '500' }}>
                  Phone Number
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={profileData.phone}
                  onChange={handleProfileChange}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: '#0B2A4A', fontWeight: '500' }}>
                  LinkedIn Profile
                </label>
                <input
                  type="text"
                  name="linkedin"
                  value={profileData.linkedin}
                  onChange={handleProfileChange}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: '#0B2A4A', fontWeight: '500' }}>
                  GitHub Profile
                </label>
                <input
                  type="text"
                  name="github"
                  value={profileData.github}
                  onChange={handleProfileChange}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: '#0B2A4A', fontWeight: '500' }}>
                  Department
                </label>
                <select
                  name="department"
                  value={profileData.department}
                  onChange={handleProfileChange}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                >
                  <option>Physics</option>
                  <option>Chemistry</option>
                  <option>Mathematics</option>
                  <option>Biology</option>
                  <option>Geology</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: '#0B2A4A', fontWeight: '500' }}>
                  Academic Year
                </label>
                <select
                  name="year"
                  value={profileData.year}
                  onChange={handleProfileChange}
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                >
                  <option>1st Year</option>
                  <option>2nd Year</option>
                  <option>3rd Year</option>
                  <option>4th Year</option>
                  <option>Graduate</option>
                </select>
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', color: '#0B2A4A', fontWeight: '500' }}>
                  GPA
                </label>
                <input
                  type="number"
                  name="gpa"
                  value={profileData.gpa}
                  onChange={handleProfileChange}
                  step="0.1"
                  min="0"
                  max="5"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '15px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setProfileData({
                  name: user?.name || 'Marium Ahmed',
                  email: user?.email || '',
                  phone: user?.phone || '',
                  linkedin: user?.linkedin || '',
                  github: user?.github || '',
                  department: user?.department || 'Physics',
                  year: user?.year || '3rd Year',
                  gpa: user?.gpa || '3.7'
                })}
                style={{
                  padding: '12px 24px',
                  background: 'white',
                  color: '#666',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                Reset
              </button>
              <button
                onClick={handleSaveProfile}
                disabled={loading}
                style={{
                  padding: '12px 24px',
                  background: '#0B2A4A',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontSize: '14px',
                  opacity: loading ? 0.7 : 1
                }}
              >
                {loading ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </div>
        )}

        {/* Notification Settings */}
        {activeTab === 'notifications' && (
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '30px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ color: '#0B2A4A', fontSize: '18px', fontWeight: '600', marginBottom: '20px' }}>
              Notification Preferences
            </h3>

            <div style={{ marginBottom: '30px' }}>
              <h4 style={{ color: '#0B2A4A', fontSize: '16px', marginBottom: '15px' }}>Delivery Methods</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={notificationSettings.emailNotifications}
                    onChange={() => handleNotificationChange('emailNotifications')}
                  />
                  <span>Email Notifications</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={notificationSettings.pushNotifications}
                    onChange={() => handleNotificationChange('pushNotifications')}
                  />
                  <span>Push Notifications</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={notificationSettings.smsUrgentOnly}
                    onChange={() => handleNotificationChange('smsUrgentOnly')}
                  />
                  <span>SMS (Urgent only)</span>
                </label>
              </div>
            </div>

            <div>
              <h4 style={{ color: '#0B2A4A', fontSize: '16px', marginBottom: '15px' }}>Notify me about</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={notificationSettings.applicationUpdates}
                    onChange={() => handleNotificationChange('applicationUpdates')}
                  />
                  <span>Application Updates</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={notificationSettings.newJobMatches}
                    onChange={() => handleNotificationChange('newJobMatches')}
                  />
                  <span>New Job Matches</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={notificationSettings.deadlineReminders}
                    onChange={() => handleNotificationChange('deadlineReminders')}
                  />
                  <span>Deadline Reminders</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={notificationSettings.messages}
                    onChange={() => handleNotificationChange('messages')}
                  />
                  <span>Messages</span>
                </label>
              </div>
            </div>

            <div style={{ marginTop: '30px', display: 'flex', gap: '15px', justifyContent: 'flex-end' }}>
              <button style={{
                padding: '12px 24px',
                background: '#0B2A4A',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px'
              }}>
                Save Preferences
              </button>
            </div>
          </div>
        )}

        {/* Privacy Settings */}
        {activeTab === 'privacy' && (
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '30px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ color: '#0B2A4A', fontSize: '18px', fontWeight: '600', marginBottom: '20px' }}>
              Privacy Settings
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={privacySettings.profileVisible}
                  onChange={() => handlePrivacyChange('profileVisible')}
                />
                <div>
                  <p style={{ fontWeight: '500', marginBottom: '2px' }}>Make profile visible to employers</p>
                  <p style={{ color: '#666', fontSize: '13px' }}>Employers can find you in searches</p>
                </div>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={privacySettings.showGPA}
                  onChange={() => handlePrivacyChange('showGPA')}
                />
                <div>
                  <p style={{ fontWeight: '500', marginBottom: '2px' }}>Show GPA on profile</p>
                  <p style={{ color: '#666', fontSize: '13px' }}>Display your GPA to employers</p>
                </div>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={privacySettings.showContactInfo}
                  onChange={() => handlePrivacyChange('showContactInfo')}
                />
                <div>
                  <p style={{ fontWeight: '500', marginBottom: '2px' }}>Show contact information</p>
                  <p style={{ color: '#666', fontSize: '13px' }}>Email and phone visible to employers</p>
                </div>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={privacySettings.showSkills}
                  onChange={() => handlePrivacyChange('showSkills')}
                />
                <div>
                  <p style={{ fontWeight: '500', marginBottom: '2px' }}>Show skills on profile</p>
                  <p style={{ color: '#666', fontSize: '13px' }}>Display your skills to employers</p>
                </div>
              </label>
            </div>

            <div style={{ marginTop: '30px', display: 'flex', gap: '15px', justifyContent: 'flex-end' }}>
              <button style={{
                padding: '12px 24px',
                background: '#0B2A4A',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px'
              }}>
                Save Privacy Settings
              </button>
            </div>
          </div>
        )}

        {/* Security Settings */}
        {activeTab === 'security' && (
          <div style={{
            background: 'white',
            borderRadius: '12px',
            padding: '30px',
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
          }}>
            <h3 style={{ color: '#0B2A4A', fontSize: '18px', fontWeight: '600', marginBottom: '20px' }}>
              Security Settings
            </h3>

            <div style={{ marginBottom: '30px' }}>
              <h4 style={{ color: '#0B2A4A', fontSize: '16px', marginBottom: '15px' }}>Change Password</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <input
                  type="password"
                  placeholder="Current Password"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                />
                <input
                  type="password"
                  placeholder="New Password"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                />
                <input
                  type="password"
                  placeholder="Confirm New Password"
                  style={{
                    width: '100%',
                    padding: '12px',
                    border: '1px solid #ddd',
                    borderRadius: '8px',
                    fontSize: '14px'
                  }}
                />
              </div>
            </div>

            <div style={{ marginBottom: '30px' }}>
              <h4 style={{ color: '#0B2A4A', fontSize: '16px', marginBottom: '15px' }}>Two-Factor Authentication</h4>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                <input type="checkbox" />
                <span>Enable two-factor authentication</span>
              </label>
            </div>

            <div>
              <h4 style={{ color: '#0B2A4A', fontSize: '16px', marginBottom: '15px' }}>Active Sessions</h4>
              <div style={{
                padding: '15px',
                background: '#f8f9fa',
                borderRadius: '8px',
                marginBottom: '10px'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <p style={{ fontWeight: '500', marginBottom: '2px' }}>Current Session</p>
                    <p style={{ color: '#666', fontSize: '13px' }}>Chrome on Windows • Last active now</p>
                  </div>
                  <span style={{ color: '#00C851', fontSize: '13px' }}>Active</span>
                </div>
              </div>
            </div>

            <div style={{ marginTop: '30px', display: 'flex', gap: '15px', justifyContent: 'flex-end' }}>
              <button style={{
                padding: '12px 24px',
                background: '#0B2A4A',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px'
              }}>
                Update Password
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentSettings;