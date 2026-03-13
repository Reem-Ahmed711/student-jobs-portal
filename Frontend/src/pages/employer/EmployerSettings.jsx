import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import { useAuth } from '../../context/AuthContext';

const EmployerSettings = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const [profileData, setProfileData] = useState({
    companyName: user?.companyName || 'Physics Department',
    email: user?.email || 'physics@cu.edu.eg',
    phone: user?.phone || '+20 123 456 7890',
    website: user?.website || 'physics.cu.edu.eg',
    address: user?.address || 'Faculty of Science, Cairo University',
    description: user?.description || 'Leading physics department with cutting-edge research'
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    newApplications: true,
    interviewReminders: true,
    weeklyReports: false
  });

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handleNotificationChange = (key) => {
    setNotificationSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setMessage('Settings saved successfully!');
      setTimeout(() => setMessage(''), 3000);
    }, 1000);
  };

  return (
    <div style={{ display: 'flex', background: '#f8fafc', minHeight: '100vh' }}>
      <Navbar />
      
      <div style={{ marginLeft: '280px', padding: '30px', width: 'calc(100% - 280px)' }}>
        {/* Header */}
        <div style={{ marginBottom: '30px', animation: 'slideInUp 0.5s ease-out' }}>
          <h1 style={{ fontSize: '28px', color: '#1E3A5F', fontWeight: '600', marginBottom: '5px' }}>
            Settings
          </h1>
          <p style={{ color: '#666' }}>Manage your account and preferences</p>
        </div>

        {message && (
          <div style={{
            background: '#d4edda',
            color: '#155724',
            padding: '15px',
            borderRadius: '8px',
            marginBottom: '20px',
            animation: 'slideInUp 0.3s ease-out'
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
          paddingBottom: '10px',
          animation: 'slideInUp 0.6s ease-out'
        }}>
          {['profile', 'notifications', 'privacy', 'security'].map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`btn ${activeTab === tab ? 'btn-primary' : 'btn-outline'}`}
              style={{
                padding: '10px 20px',
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
          <div className="card" style={{ animation: 'slideInUp 0.7s ease-out' }}>
            <h3 style={{ color: '#1E3A5F', fontSize: '18px', fontWeight: '600', marginBottom: '20px' }}>
              Company Information
            </h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '30px' }}>
              <div className="input-group">
                <label className="input-label">Company Name</label>
                <input
                  type="text"
                  name="companyName"
                  value={profileData.companyName}
                  onChange={handleProfileChange}
                  className="input-field"
                  style={{ paddingLeft: '1rem' }}
                />
              </div>
              <div className="input-group">
                <label className="input-label">Email</label>
                <input
                  type="email"
                  name="email"
                  value={profileData.email}
                  onChange={handleProfileChange}
                  className="input-field"
                  style={{ paddingLeft: '1rem' }}
                />
              </div>
              <div className="input-group">
                <label className="input-label">Phone</label>
                <input
                  type="tel"
                  name="phone"
                  value={profileData.phone}
                  onChange={handleProfileChange}
                  className="input-field"
                  style={{ paddingLeft: '1rem' }}
                />
              </div>
              <div className="input-group">
                <label className="input-label">Website</label>
                <input
                  type="text"
                  name="website"
                  value={profileData.website}
                  onChange={handleProfileChange}
                  className="input-field"
                  style={{ paddingLeft: '1rem' }}
                />
              </div>
              <div className="input-group" style={{ gridColumn: 'span 2' }}>
                <label className="input-label">Address</label>
                <input
                  type="text"
                  name="address"
                  value={profileData.address}
                  onChange={handleProfileChange}
                  className="input-field"
                  style={{ paddingLeft: '1rem' }}
                />
              </div>
              <div className="input-group" style={{ gridColumn: 'span 2' }}>
                <label className="input-label">Description</label>
                <textarea
                  name="description"
                  value={profileData.description}
                  onChange={handleProfileChange}
                  rows="4"
                  className="input-field"
                  style={{ paddingLeft: '1rem', resize: 'vertical' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: '15px', justifyContent: 'flex-end' }}>
              <button
                onClick={() => setProfileData({
                  companyName: user?.companyName || 'Physics Department',
                  email: user?.email || 'physics@cu.edu.eg',
                  phone: user?.phone || '+20 123 456 7890',
                  website: user?.website || 'physics.cu.edu.eg',
                  address: user?.address || 'Faculty of Science, Cairo University',
                  description: user?.description || 'Leading physics department with cutting-edge research'
                })}
                className="btn btn-outline"
              >
                Reset
              </button>
              <button
                onClick={handleSave}
                disabled={loading}
                className="btn btn-primary"
              >
                {loading ? <><i className="fas fa-spinner fa-spin"></i> Saving...</> : 'Save Changes'}
              </button>
            </div>
          </div>
        )}

        {/* Notification Settings */}
        {activeTab === 'notifications' && (
          <div className="card" style={{ animation: 'slideInUp 0.7s ease-out' }}>
            <h3 style={{ color: '#1E3A5F', fontSize: '18px', fontWeight: '600', marginBottom: '20px' }}>
              Notification Preferences
            </h3>

            <div style={{ marginBottom: '30px' }}>
              <h4 style={{ color: '#1E3A5F', fontSize: '16px', marginBottom: '15px' }}>Email Notifications</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={notificationSettings.emailNotifications}
                    onChange={() => handleNotificationChange('emailNotifications')}
                  />
                  <span>Receive email notifications</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={notificationSettings.newApplications}
                    onChange={() => handleNotificationChange('newApplications')}
                  />
                  <span>New applications</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={notificationSettings.interviewReminders}
                    onChange={() => handleNotificationChange('interviewReminders')}
                  />
                  <span>Interview reminders</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                  <input
                    type="checkbox"
                    checked={notificationSettings.weeklyReports}
                    onChange={() => handleNotificationChange('weeklyReports')}
                  />
                  <span>Weekly reports</span>
                </label>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '15px', justifyContent: 'flex-end' }}>
              <button onClick={handleSave} className="btn btn-primary">
                Save Preferences
              </button>
            </div>
          </div>
        )}

        {/* Privacy Settings */}
        {activeTab === 'privacy' && (
          <div className="card" style={{ animation: 'slideInUp 0.7s ease-out' }}>
            <h3 style={{ color: '#1E3A5F', fontSize: '18px', fontWeight: '600', marginBottom: '20px' }}>
              Privacy Settings
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px', marginBottom: '30px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                <input type="checkbox" defaultChecked />
                <div>
                  <p style={{ fontWeight: '500', marginBottom: '2px' }}>Make profile visible to students</p>
                  <p style={{ color: '#666', fontSize: '13px' }}>Students can see your department information</p>
                </div>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                <input type="checkbox" defaultChecked />
                <div>
                  <p style={{ fontWeight: '500', marginBottom: '2px' }}>Show contact information</p>
                  <p style={{ color: '#666', fontSize: '13px' }}>Display email and phone to students</p>
                </div>
              </label>
            </div>

            <div style={{ display: 'flex', gap: '15px', justifyContent: 'flex-end' }}>
              <button onClick={handleSave} className="btn btn-primary">
                Save Privacy Settings
              </button>
            </div>
          </div>
        )}

        {/* Security Settings */}
        {activeTab === 'security' && (
          <div className="card" style={{ animation: 'slideInUp 0.7s ease-out' }}>
            <h3 style={{ color: '#1E3A5F', fontSize: '18px', fontWeight: '600', marginBottom: '20px' }}>
              Security Settings
            </h3>

            <div style={{ marginBottom: '30px' }}>
              <h4 style={{ color: '#1E3A5F', fontSize: '16px', marginBottom: '15px' }}>Change Password</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div className="input-group">
                  <label className="input-label">Current Password</label>
                  <input
                    type="password"
                    className="input-field"
                    style={{ paddingLeft: '1rem' }}
                  />
                </div>
                <div className="input-group">
                  <label className="input-label">New Password</label>
                  <input
                    type="password"
                    className="input-field"
                    style={{ paddingLeft: '1rem' }}
                  />
                </div>
                <div className="input-group">
                  <label className="input-label">Confirm New Password</label>
                  <input
                    type="password"
                    className="input-field"
                    style={{ paddingLeft: '1rem' }}
                  />
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '15px', justifyContent: 'flex-end' }}>
              <button onClick={handleSave} className="btn btn-primary">
                Update Password
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmployerSettings;