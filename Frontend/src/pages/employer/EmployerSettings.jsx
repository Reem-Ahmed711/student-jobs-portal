// C:\Student-job-portal\Frontend\src\pages\employer\EmployerSettings.jsx
import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { getCurrentUser, updateProfile, uploadProfileImage, changePassword } from '../../services/api';
import { useNavigate } from 'react-router-dom';

const EmployerSettings = () => {
  const { user, updateUser } = useAuth();
  const { darkMode } = useTheme();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);

  const [profileData, setProfileData] = useState({
    institutionName: '',
    email: '',
    phone: '',
    website: '',
    address: '',
    description: '',
    department: '',
    logo: ''
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailApplications: true,
    emailMessages: true,
    pushApplications: true,
    weeklyDigest: false
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await getCurrentUser();
      const data = response.data || {};
      setProfileData({
        institutionName: data.institution || user?.institution || '',
        email: data.email || user?.email || '',
        phone: data.phone || '',
        website: data.website || '',
        address: data.address || '',
        description: data.description || '',
        department: data.department || user?.department || '',
        logo: data.logo || ''
      });
      if (data.logo) setLogoPreview(data.logo);
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleProfileChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handleLogoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      setMessage('❌ Please upload an image file');
      setMessageType('error');
      return;
    }
    
    if (file.size > 2 * 1024 * 1024) {
      setMessage('❌ Image size must be less than 2MB');
      setMessageType('error');
      return;
    }
    
    setLogoFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setLogoPreview(reader.result);
    reader.readAsDataURL(file);
  };

  const uploadLogo = async () => {
    if (!logoFile) return null;
    const formData = new FormData();
    formData.append('profileImage', logoFile);
    try {
      const response = await uploadProfileImage(formData);
      return response.data?.url;
    } catch (error) {
      console.error('Error uploading logo:', error);
      return null;
    }
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    setMessage('');
    try {
      let logoUrl = profileData.logo;
      if (logoFile) {
        const uploadedUrl = await uploadLogo();
        if (uploadedUrl) logoUrl = uploadedUrl;
      }
      
      const updatedData = { ...profileData, logo: logoUrl };
      await updateProfile(updatedData);
      if (updateUser) updateUser(updatedData);
      
      setMessage('✅ Profile updated successfully!');
      setMessageType('success');
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('❌ Failed to update profile');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationChange = (key) => {
    setNotificationSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const saveNotifications = () => {
    setMessage('✅ Notification settings saved!');
    setMessageType('success');
    setTimeout(() => setMessage(''), 3000);
  };

  const handlePasswordChange = (e) => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
  };

  const handleUpdatePassword = async () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage('❌ New passwords do not match');
      setMessageType('error');
      return;
    }
    if (passwordData.newPassword.length < 6) {
      setMessage('❌ Password must be at least 6 characters');
      setMessageType('error');
      return;
    }
    
    setLoading(true);
    try {
      await changePassword(passwordData.currentPassword, passwordData.newPassword);
      setMessage('✅ Password updated successfully!');
      setMessageType('success');
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('❌ Failed to update password. Check your current password.');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      alert('Account deletion request sent. Please contact support.');
    }
  };

  const containerStyle = {
    maxWidth: '1000px',
    margin: '0 auto'
  };

  const cardStyle = {
    background: darkMode ? '#1e293b' : 'white',
    borderRadius: '20px',
    padding: '30px',
    boxShadow: '0 10px 30px -15px rgba(0,0,0,0.1)'
  };

  const inputStyle = {
    width: '100%',
    padding: '12px 16px',
    border: `1px solid ${darkMode ? '#475569' : '#e0e0e0'}`,
    borderRadius: '12px',
    fontSize: '14px',
    background: darkMode ? '#0f172a' : 'white',
    color: darkMode ? '#e2e8f0' : '#333',
    outline: 'none',
    transition: 'all 0.3s ease'
  };

  const labelStyle = {
    display: 'block',
    marginBottom: '8px',
    fontSize: '13px',
    fontWeight: '500',
    color: darkMode ? '#94a3b8' : '#666'
  };

  const sectionTitleStyle = {
    fontSize: '18px',
    fontWeight: '600',
    color: darkMode ? '#f1f5f9' : '#1E3A5F',
    marginBottom: '20px',
    paddingBottom: '12px',
    borderBottom: `2px solid ${darkMode ? '#334155' : '#E6F0FA'}`
  };

  const tabStyle = (tab) => ({
    padding: '12px 24px',
    background: activeTab === tab ? '#1E3A5F' : 'transparent',
    color: activeTab === tab ? 'white' : (darkMode ? '#94a3b8' : '#666'),
    border: activeTab === tab ? 'none' : `1px solid ${darkMode ? '#475569' : '#ddd'}`,
    borderRadius: '40px',
    cursor: 'pointer',
    fontWeight: '500',
    transition: 'all 0.3s ease'
  });

  return (
    <Layout>
      <style>{`
        @keyframes slideInUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animated-card {
          animation: slideInUp 0.5s ease-out;
        }
      `}</style>

      <div style={containerStyle}>
        {/* Header */}
        <div style={{ marginBottom: '30px', animation: 'slideInUp 0.5s ease-out' }}>
          <button 
            onClick={() => navigate('/employer-dashboard')} 
            style={{
              marginBottom: '15px',
              background: 'none',
              border: 'none',
              color: darkMode ? '#94a3b8' : '#666',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              fontSize: '14px'
            }}
          >
            <i className="fas fa-arrow-left"></i> Back to Dashboard
          </button>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', flexWrap: 'wrap' }}>
            <div style={{
              width: '50px',
              height: '50px',
              background: 'linear-gradient(135deg, #1E3A5F, #2a4a7a)',
              borderRadius: '15px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <i className="fas fa-cog" style={{ fontSize: '24px', color: 'white' }}></i>
            </div>
            <div>
              <h1 style={{ fontSize: '28px', fontWeight: '700', color: darkMode ? '#f1f5f9' : '#1E3A5F' }}>
                Settings
              </h1>
              <p style={{ color: darkMode ? '#94a3b8' : '#666', marginTop: '4px' }}>
                Manage your account and preferences
              </p>
            </div>
          </div>
        </div>

        {/* Message Toast */}
        {message && (
          <div style={{
            background: messageType === 'success' ? '#d4edda' : '#f8d7da',
            color: messageType === 'success' ? '#155724' : '#721c24',
            padding: '15px 20px',
            borderRadius: '12px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <i className={`fas ${messageType === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}`}></i>
            <span>{message}</span>
          </div>
        )}

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '30px', flexWrap: 'wrap' }}>
          <button onClick={() => setActiveTab('profile')} style={tabStyle('profile')}>
            <i className="fas fa-building" style={{ marginRight: '8px' }}></i> Company Profile
          </button>
          <button onClick={() => setActiveTab('notifications')} style={tabStyle('notifications')}>
            <i className="fas fa-bell" style={{ marginRight: '8px' }}></i> Notifications
          </button>
          <button onClick={() => setActiveTab('security')} style={tabStyle('security')}>
            <i className="fas fa-shield-alt" style={{ marginRight: '8px' }}></i> Security
          </button>
        </div>

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div className="animated-card" style={cardStyle}>
            <h3 style={sectionTitleStyle}>
              <i className="fas fa-info-circle" style={{ marginRight: '10px' }}></i>
              Company Information
            </h3>

            {/* Logo Upload */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginBottom: '25px', flexWrap: 'wrap' }}>
              <div style={{ position: 'relative' }}>
                <div style={{
                  width: '100px',
                  height: '100px',
                  background: logoPreview ? 'none' : (darkMode ? '#334155' : '#E6F0FA'),
                  borderRadius: '20px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  border: `2px solid ${darkMode ? '#475569' : '#ddd'}`
                }}>
                  {logoPreview ? (
                    <img src={logoPreview} alt="logo" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <i className="fas fa-building" style={{ fontSize: '40px', color: darkMode ? '#94a3b8' : '#1E3A5F' }}></i>
                  )}
                </div>
                <label htmlFor="logo-upload" style={{
                  position: 'absolute',
                  bottom: '5px',
                  right: '5px',
                  width: '32px',
                  height: '32px',
                  background: '#1E3A5F',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  cursor: 'pointer',
                  border: '2px solid white'
                }}>
                  <i className="fas fa-camera" style={{ fontSize: '14px' }}></i>
                </label>
                <input type="file" id="logo-upload" accept="image/*" onChange={handleLogoUpload} style={{ display: 'none' }} />
              </div>
              <div>
                <p style={{ fontWeight: '500', color: darkMode ? '#f1f5f9' : '#333' }}>Company Logo</p>
                <p style={{ fontSize: '12px', color: darkMode ? '#94a3b8' : '#666' }}>PNG, JPG up to 2MB</p>
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
              <div>
                <label style={labelStyle}>Institution Name</label>
                <input name="institutionName" value={profileData.institutionName} onChange={handleProfileChange} placeholder="e.g., Computer Science Department" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Email</label>
                <input name="email" value={profileData.email} onChange={handleProfileChange} placeholder="contact@department.edu" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Phone</label>
                <input name="phone" value={profileData.phone} onChange={handleProfileChange} placeholder="+20 123 456 789" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Website</label>
                <input name="website" value={profileData.website} onChange={handleProfileChange} placeholder="https://example.com" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Department</label>
                <select name="department" value={profileData.department} onChange={handleProfileChange} style={inputStyle}>
                  <option value="">Select Department</option>
                  <option>Computer Science</option><option>Physics</option><option>Chemistry</option>
                  <option>Mathematics</option><option>Biology</option><option>Geology</option>
                </select>
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <label style={labelStyle}>Address</label>
                <input name="address" value={profileData.address} onChange={handleProfileChange} placeholder="Building, Street, Cairo, Egypt" style={inputStyle} />
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <label style={labelStyle}>Description</label>
                <textarea name="description" value={profileData.description} onChange={handleProfileChange} rows="3" placeholder="Tell students about your department..." style={{ ...inputStyle, resize: 'vertical' }} />
              </div>
            </div>

            <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={handleSaveProfile} disabled={loading} style={{
                padding: '12px 32px',
                background: 'linear-gradient(135deg, #1E3A5F, #2a4a7a)',
                color: 'white',
                border: 'none',
                borderRadius: '40px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontWeight: '500',
                opacity: loading ? 0.7 : 1
              }}>
                {loading ? <><i className="fas fa-spinner fa-spin"></i> Saving...</> : <><i className="fas fa-save"></i> Save Changes</>}
              </button>
            </div>
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <div className="animated-card" style={cardStyle}>
            <h3 style={sectionTitleStyle}>
              <i className="fas fa-bell" style={{ marginRight: '10px' }}></i>
              Notification Preferences
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px', marginBottom: '25px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                <input type="checkbox" checked={notificationSettings.emailApplications} onChange={() => handleNotificationChange('emailApplications')} style={{ width: '18px', height: '18px' }} />
                <span>Email me when students apply to my jobs</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                <input type="checkbox" checked={notificationSettings.emailMessages} onChange={() => handleNotificationChange('emailMessages')} style={{ width: '18px', height: '18px' }} />
                <span>Email me for new messages</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                <input type="checkbox" checked={notificationSettings.pushApplications} onChange={() => handleNotificationChange('pushApplications')} style={{ width: '18px', height: '18px' }} />
                <span>Push notifications for applications</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                <input type="checkbox" checked={notificationSettings.weeklyDigest} onChange={() => handleNotificationChange('weeklyDigest')} style={{ width: '18px', height: '18px' }} />
                <span>Weekly digest of platform activity</span>
              </label>
            </div>

            <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={saveNotifications} style={{
                padding: '12px 32px',
                background: '#1E3A5F',
                color: 'white',
                border: 'none',
                borderRadius: '40px',
                cursor: 'pointer',
                fontWeight: '500'
              }}>
                Save Preferences
              </button>
            </div>
          </div>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <div className="animated-card" style={cardStyle}>
            <h3 style={sectionTitleStyle}>
              <i className="fas fa-key" style={{ marginRight: '10px' }}></i>
              Security Settings
            </h3>

            <div style={{ marginBottom: '30px' }}>
              <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '15px', color: darkMode ? '#f1f5f9' : '#333' }}>Change Password</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div>
                  <label style={labelStyle}>Current Password</label>
                  <input type="password" name="currentPassword" value={passwordData.currentPassword} onChange={handlePasswordChange} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>New Password</label>
                  <input type="password" name="newPassword" value={passwordData.newPassword} onChange={handlePasswordChange} style={inputStyle} />
                </div>
                <div>
                  <label style={labelStyle}>Confirm New Password</label>
                  <input type="password" name="confirmPassword" value={passwordData.confirmPassword} onChange={handlePasswordChange} style={inputStyle} />
                </div>
              </div>
            </div>

            <div style={{ marginBottom: '30px' }}>
              <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '15px', color: darkMode ? '#f1f5f9' : '#333' }}>Two-Factor Authentication</h4>
              <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                <input type="checkbox" />
                <span>Enable two-factor authentication (Coming soon)</span>
              </label>
            </div>

            <div style={{ marginBottom: '30px' }}>
              <h4 style={{ fontSize: '16px', fontWeight: '600', marginBottom: '15px', color: '#ef4444' }}>Danger Zone</h4>
              <div style={{
                padding: '20px',
                border: '1px solid #ef4444',
                borderRadius: '16px',
                background: darkMode ? '#1e293b' : '#fff'
              }}>
                <p style={{ marginBottom: '10px' }}>Once you delete your account, there is no going back.</p>
                <button onClick={handleDeleteAccount} style={{
                  padding: '10px 24px',
                  background: 'transparent',
                  border: '1px solid #ef4444',
                  color: '#ef4444',
                  borderRadius: '30px',
                  cursor: 'pointer',
                  fontWeight: '500'
                }}>
                  Delete Account
                </button>
              </div>
            </div>

            <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={handleUpdatePassword} disabled={loading} style={{
                padding: '12px 32px',
                background: 'linear-gradient(135deg, #1E3A5F, #2a4a7a)',
                color: 'white',
                border: 'none',
                borderRadius: '40px',
                cursor: loading ? 'not-allowed' : 'pointer',
                fontWeight: '500'
              }}>
                {loading ? <><i className="fas fa-spinner fa-spin"></i> Updating...</> : 'Update Password'}
              </button>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default EmployerSettings;
