// C:\Student-job-portal\Frontend\src\pages\StudentSettings.jsx
import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { 
  getProfile, 
  updateProfile, 
  changePassword,
  uploadProfileImage,
  deleteProfileImage
} from '../services/api';
import { useNavigate } from 'react-router-dom';

const StudentSettings = () => {
  const { user, updateUser } = useAuth();
  const { darkMode } = useTheme();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');
  const [profileImage, setProfileImage] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState(null);

  const [profileData, setProfileData] = useState({
    name: '',
    email: '',
    phone: '',
    bio: '',
    department: '',
    year: '',
    gpa: '',
    skills: []
  });
  const [newSkill, setNewSkill] = useState('');

  // Notification settings (from backend or local)
  const [notifications, setNotifications] = useState({
    email: true,
    push: true,
    applicationUpdates: true,
    jobMatches: true
  });

  // Privacy settings
  const [privacy, setPrivacy] = useState({
    showProfile: true,
    showGPA: true,
    showEmail: true
  });

  // Password change
  const [passwordData, setPasswordData] = useState({
    current: '',
    new: '',
    confirm: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await getProfile();
      if (response.data) {
        const data = response.data;
        setProfileData({
          name: data.name || '',
          email: data.email || '',
          phone: data.phone || '',
          bio: data.bio || '',
          department: data.department || '',
          year: data.year || '',
          gpa: data.gpa || '',
          skills: data.skills || []
        });
        if (data.profileImage) setProfileImagePreview(data.profileImage);
        
        // Load saved preferences if exist
        if (data.notifications) setNotifications(data.notifications);
        if (data.privacy) setPrivacy(data.privacy);
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      showMessage('Please upload an image file', 'error');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      showMessage('Image size must be less than 2MB', 'error');
      return;
    }
    
    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('profileImage', file);
      const response = await uploadProfileImage(formData);
      
      if (response.data?.url) {
        setProfileImagePreview(response.data.url);
        const updatedProfile = { ...profileData, profileImage: response.data.url };
        await updateProfile(updatedProfile);
        if (updateUser) updateUser(updatedProfile);
        showMessage('✅ Profile image updated!', 'success');
      }
    } catch (error) {
      showMessage('❌ Failed to upload image', 'error');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleRemoveImage = async () => {
    if (!window.confirm('Remove your profile image?')) return;
    setUploadingImage(true);
    try {
      await deleteProfileImage();
      setProfileImagePreview(null);
      showMessage('✅ Profile image removed', 'success');
    } catch (error) {
      showMessage('❌ Failed to remove image', 'error');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
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

  const handleSave = async () => {
    setLoading(true);
    try {
      await updateProfile({
        ...profileData,
        notifications,
        privacy
      });
      if (updateUser) updateUser(profileData);
      showMessage('✅ Settings saved successfully!', 'success');
    } catch (error) {
      showMessage('❌ Failed to save settings', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdatePassword = async () => {
    if (passwordData.new !== passwordData.confirm) {
      showMessage('❌ New passwords do not match', 'error');
      return;
    }
    if (passwordData.new.length < 6) {
      showMessage('❌ Password must be at least 6 characters', 'error');
      return;
    }
    
    setLoading(true);
    try {
      await changePassword(passwordData.current, passwordData.new);
      showMessage('✅ Password updated successfully!', 'success');
      setPasswordData({ current: '', new: '', confirm: '' });
    } catch (error) {
      showMessage('❌ Failed to update password. Check your current password.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationChange = (key) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handlePrivacyChange = (key) => {
    setPrivacy(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const showMessage = (msg, type) => {
    setMessage(msg);
    setMessageType(type);
    setTimeout(() => setMessage(''), 3000);
  };

  // Styles
  const containerStyle = {
    maxWidth: '1000px',
    margin: '0 auto',
    background: darkMode ? '#1e293b' : 'white',
    borderRadius: '24px',
    padding: '30px',
    boxShadow: '0 10px 30px -15px rgba(0,0,0,0.1)'
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

  return (
    <Layout>
      <style>{`
        @keyframes slideInUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .settings-card {
          animation: slideInUp 0.5s ease-out;
        }
      `}</style>

      <div style={containerStyle}>
        {/* Header */}
        <div style={{ marginBottom: '30px' }}>
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
              <h1 style={{ fontSize: '28px', fontWeight: '700', color: darkMode ? '#f1f5f9' : '#1E3A5F', marginBottom: '8px' }}>
                Settings
              </h1>
              <p style={{ color: darkMode ? '#94a3b8' : '#666' }}>Customize your account preferences</p>
            </div>
          </div>
        </div>

        {/* Message */}
        {message && (
          <div style={{
            padding: '14px 20px',
            borderRadius: '12px',
            marginBottom: '20px',
            background: messageType === 'success' ? '#d4edda' : '#f8d7da',
            color: messageType === 'success' ? '#155724' : '#721c24',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            animation: 'slideInUp 0.3s ease-out'
          }}>
            <i className={`fas ${messageType === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}`}></i>
            <span>{message}</span>
          </div>
        )}

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '12px', marginBottom: '30px', flexWrap: 'wrap' }}>
          <button onClick={() => setActiveTab('profile')} style={tabStyle('profile')}>
            <i className="fas fa-user" style={{ marginRight: '8px' }}></i> Profile
          </button>
          <button onClick={() => setActiveTab('notifications')} style={tabStyle('notifications')}>
            <i className="fas fa-bell" style={{ marginRight: '8px' }}></i> Notifications
          </button>
          <button onClick={() => setActiveTab('privacy')} style={tabStyle('privacy')}>
            <i className="fas fa-lock" style={{ marginRight: '8px' }}></i> Privacy
          </button>
          <button onClick={() => setActiveTab('security')} style={tabStyle('security')}>
            <i className="fas fa-shield-alt" style={{ marginRight: '8px' }}></i> Security
          </button>
        </div>

        {/* ==================== PROFILE TAB ==================== */}
        {activeTab === 'profile' && (
          <div className="settings-card">
            {/* Avatar Section */}
            <div style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '25px', 
              marginBottom: '30px',
              padding: '20px',
              background: darkMode ? '#0f172a' : '#f8f9fa',
              borderRadius: '20px',
              flexWrap: 'wrap'
            }}>
              <div style={{ position: 'relative' }}>
                <div style={{
                  width: '100px',
                  height: '100px',
                  background: profileImagePreview ? 'none' : 'linear-gradient(135deg, #E6F0FA, #c4d9f0)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  overflow: 'hidden',
                  fontSize: '40px',
                  color: '#1E3A5F',
                  border: `3px solid ${darkMode ? '#475569' : '#fff'}`
                }}>
                  {profileImagePreview ? (
                    <img src={profileImagePreview} alt="profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <i className="fas fa-user-graduate"></i>
                  )}
                </div>
                <label htmlFor="avatar-upload" style={{
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
                <input type="file" id="avatar-upload" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} disabled={uploadingImage} />
              </div>
              <div>
                <h3 style={{ fontSize: '18px', fontWeight: '600', marginBottom: '5px' }}>Profile Picture</h3>
                <p style={{ fontSize: '13px', color: darkMode ? '#94a3b8' : '#666' }}>JPG, PNG or GIF. Max 2MB.</p>
                {profileImagePreview && (
                  <button
                    onClick={handleRemoveImage}
                    style={{ marginTop: '10px', padding: '6px 16px', background: '#ef4444', color: 'white', border: 'none', borderRadius: '20px', cursor: 'pointer', fontSize: '12px' }}
                  >
                    Remove Image
                  </button>
                )}
              </div>
            </div>

            <h3 style={sectionTitleStyle}>
              <i className="fas fa-edit" style={{ marginRight: '10px' }}></i>
              Personal Information
            </h3>
            
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px' }}>
              <div>
                <label style={labelStyle}>Full Name</label>
                <input type="text" name="name" value={profileData.name} onChange={handleChange} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Email</label>
                <input type="email" name="email" value={profileData.email} onChange={handleChange} style={inputStyle} disabled />
              </div>
              <div>
                <label style={labelStyle}>Phone</label>
                <input type="tel" name="phone" value={profileData.phone} onChange={handleChange} style={inputStyle} placeholder="+20 123 456 789" />
              </div>
              <div>
                <label style={labelStyle}>Department</label>
                <select name="department" value={profileData.department} onChange={handleChange} style={inputStyle}>
                  <option value="">Select Department</option>
                  <option>Computer Science</option><option>Physics</option><option>Chemistry</option>
                  <option>Mathematics</option><option>Biology</option><option>Geology</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>Academic Year</label>
                <select name="year" value={profileData.year} onChange={handleChange} style={inputStyle}>
                  <option value="">Select Year</option>
                  <option>1st Year</option><option>2nd Year</option><option>3rd Year</option><option>4th Year</option><option>Graduate</option>
                </select>
              </div>
              <div>
                <label style={labelStyle}>GPA (out of 5.0)</label>
                <input type="number" name="gpa" value={profileData.gpa} onChange={handleChange} step="0.1" min="0" max="5" style={inputStyle} />
              </div>
              <div style={{ gridColumn: 'span 2' }}>
                <label style={labelStyle}>Bio</label>
                <textarea name="bio" value={profileData.bio} onChange={handleChange} rows="3" style={inputStyle} placeholder="Tell us about yourself..." />
              </div>
            </div>

            <h3 style={{ ...sectionTitleStyle, marginTop: '30px' }}>
              <i className="fas fa-code" style={{ marginRight: '10px' }}></i>
              Skills
            </h3>
            
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '15px' }}>
              {profileData.skills.map((s, i) => (
                <span key={i} style={{ background: '#E6F0FA', color: '#1E3A5F', padding: '6px 14px', borderRadius: '30px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  {s}
                  <button onClick={() => removeSkill(s)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#1E3A5F' }}>×</button>
                </span>
              ))}
            </div>
            
            <div style={{ display: 'flex', gap: '10px' }}>
              <input type="text" value={newSkill} onChange={(e) => setNewSkill(e.target.value)} placeholder="Add skill..." style={{ flex: 1, ...inputStyle }} onKeyPress={(e) => e.key === 'Enter' && addSkill()} />
              <button onClick={addSkill} style={{ padding: '12px 24px', background: '#1E3A5F', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer' }}>Add</button>
            </div>

            <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={handleSave} disabled={loading} style={{ padding: '12px 32px', background: 'linear-gradient(135deg, #1E3A5F, #2a4a7a)', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: '500' }}>
                {loading ? <><i className="fas fa-spinner fa-spin"></i> Saving...</> : <><i className="fas fa-save"></i> Save Changes</>}
              </button>
            </div>
          </div>
        )}

        {/* ==================== NOTIFICATIONS TAB ==================== */}
        {activeTab === 'notifications' && (
          <div className="settings-card">
            <h3 style={sectionTitleStyle}>
              <i className="fas fa-bell" style={{ marginRight: '10px' }}></i>
              Notification Preferences
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                <input type="checkbox" checked={notifications.email} onChange={() => handleNotificationChange('email')} style={{ width: '18px', height: '18px' }} />
                <span>Email Notifications</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                <input type="checkbox" checked={notifications.push} onChange={() => handleNotificationChange('push')} style={{ width: '18px', height: '18px' }} />
                <span>Push Notifications</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                <input type="checkbox" checked={notifications.applicationUpdates} onChange={() => handleNotificationChange('applicationUpdates')} style={{ width: '18px', height: '18px' }} />
                <span>Application Updates</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                <input type="checkbox" checked={notifications.jobMatches} onChange={() => handleNotificationChange('jobMatches')} style={{ width: '18px', height: '18px' }} />
                <span>New Job Matches</span>
              </label>
            </div>

            <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={handleSave} disabled={loading} style={{ padding: '12px 32px', background: '#1E3A5F', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: '500' }}>
                Save Preferences
              </button>
            </div>
          </div>
        )}

        {/* ==================== PRIVACY TAB ==================== */}
        {activeTab === 'privacy' && (
          <div className="settings-card">
            <h3 style={sectionTitleStyle}>
              <i className="fas fa-lock" style={{ marginRight: '10px' }}></i>
              Privacy Settings
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                <input type="checkbox" checked={privacy.showProfile} onChange={() => handlePrivacyChange('showProfile')} style={{ width: '18px', height: '18px' }} />
                <span>Make profile visible to employers</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                <input type="checkbox" checked={privacy.showGPA} onChange={() => handlePrivacyChange('showGPA')} style={{ width: '18px', height: '18px' }} />
                <span>Show my GPA</span>
              </label>
              <label style={{ display: 'flex', alignItems: 'center', gap: '12px', cursor: 'pointer' }}>
                <input type="checkbox" checked={privacy.showEmail} onChange={() => handlePrivacyChange('showEmail')} style={{ width: '18px', height: '18px' }} />
                <span>Allow employers to contact me by email</span>
              </label>
            </div>

            <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={handleSave} disabled={loading} style={{ padding: '12px 32px', background: '#1E3A5F', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: '500' }}>
                Save Privacy Settings
              </button>
            </div>
          </div>
        )}

        {/* ==================== SECURITY TAB ==================== */}
        {activeTab === 'security' && (
          <div className="settings-card">
            <h3 style={sectionTitleStyle}>
              <i className="fas fa-key" style={{ marginRight: '10px' }}></i>
              Change Password
            </h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={labelStyle}>Current Password</label>
                <input type="password" name="current" value={passwordData.current} onChange={(e) => setPasswordData({ ...passwordData, current: e.target.value })} style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>New Password</label>
                <input type="password" name="new" value={passwordData.new} onChange={(e) => setPasswordData({ ...passwordData, new: e.target.value })} style={inputStyle} />
                {passwordData.new && passwordData.new.length < 6 && (
                  <p style={{ fontSize: '11px', color: '#ef4444', marginTop: '5px' }}>Password must be at least 6 characters</p>
                )}
              </div>
              <div>
                <label style={labelStyle}>Confirm New Password</label>
                <input type="password" name="confirm" value={passwordData.confirm} onChange={(e) => setPasswordData({ ...passwordData, confirm: e.target.value })} style={inputStyle} />
                {passwordData.confirm && passwordData.new !== passwordData.confirm && (
                  <p style={{ fontSize: '11px', color: '#ef4444', marginTop: '5px' }}>Passwords do not match</p>
                )}
              </div>
            </div>

            <div style={{ marginTop: '30px', display: 'flex', justifyContent: 'flex-end' }}>
              <button onClick={handleUpdatePassword} disabled={loading} style={{ padding: '12px 32px', background: '#1E3A5F', color: 'white', border: 'none', borderRadius: '12px', cursor: 'pointer', fontWeight: '500' }}>
                {loading ? <><i className="fas fa-spinner fa-spin"></i> Updating...</> : <><i className="fas fa-key"></i> Update Password</>}
              </button>
            </div>

            {/* Delete Account Section */}
            <div style={{ marginTop: '30px' }}>
              <h3 style={{ ...sectionTitleStyle, color: '#ef4444', borderColor: '#ef4444' }}>
                <i className="fas fa-exclamation-triangle" style={{ marginRight: '10px' }}></i>
                Danger Zone
              </h3>
              <div style={{
                padding: '20px',
                border: `1px solid ${darkMode ? '#7f1d1d' : '#ef4444'}`,
                borderRadius: '16px',
                background: darkMode ? '#1e293b' : '#fff'
              }}>
                <p style={{ marginBottom: '10px' }}>Once you delete your account, there is no going back.</p>
                <button
                  onClick={() => {
                    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
                      alert('Account deletion request sent. Please contact support.');
                    }
                  }}
                  style={{
                    padding: '10px 24px',
                    background: 'transparent',
                    border: `1px solid ${darkMode ? '#f87171' : '#ef4444'}`,
                    color: darkMode ? '#f87171' : '#ef4444',
                    borderRadius: '30px',
                    cursor: 'pointer',
                    fontWeight: '500'
                  }}
                >
                  Delete Account
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </Layout>
  );
};

export default StudentSettings;
