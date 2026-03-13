import React, { useState } from 'react';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { useLocation } from 'react-router-dom';


const StudentSettings = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const tabFromUrl = queryParams.get('tab');
  const [profileData, setProfileData] = useState({
    name: user?.name || 'Reem Ahmed',
    email: user?.email || 'reem.ahmed@science.cu.edu.eg',
    phone: user?.phone || '+20 123 456 7890',
    bio: user?.bio || 'Computer Science student passionate about web development and AI. Looking for opportunities to grow and learn.',
    address: user?.address || 'Cairo, Egypt',
    department: user?.department || 'Computer Science',
    year: user?.year || '3rd Year',
    gpa: user?.gpa || '3.7',
    linkedin: user?.linkedin || '',
    github: user?.github || '',
    website: user?.website || '',
    skills: user?.skills || ['JavaScript', 'React', 'Python', 'UI/UX Design']
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    smsUrgentOnly: false,
    applicationUpdates: true,
    newJobMatches: true,
    deadlineReminders: true,
    messages: true,
    marketingEmails: false
  });

  const [privacySettings, setPrivacySettings] = useState({
    profileVisible: true,
    showGPA: true,
    showContactInfo: true,
    showSkills: true,
    showEmailToEmployers: true
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileData(prev => ({ ...prev, [name]: value }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData(prev => ({ ...prev, [name]: value }));
  };

  const handleNotificationChange = (key) => {
    setNotificationSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handlePrivacyChange = (key) => {
    setPrivacySettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileImage(imageUrl);
    }
  };

  const addSkill = (skill) => {
    if (!profileData.skills.includes(skill)) {
      setProfileData(prev => ({
        ...prev,
        skills: [...prev.skills, skill]
      }));
    }
  };

  const removeSkill = (skill) => {
    setProfileData(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill)
    }));
  };

  const handleSaveProfile = async () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setMessage('Profile updated successfully! ✨');
      setTimeout(() => setMessage(''), 3000);
    }, 1000);
  };

  const suggestedSkills = [
    'JavaScript', 'React', 'Python', 'Java', 'C++', 'HTML/CSS',
    'Node.js', 'Express', 'MongoDB', 'SQL', 'TypeScript', 'Angular',
    'Vue.js', 'Django', 'Flask', 'Machine Learning', 'Data Analysis',
    'UI/UX Design', 'Figma', 'Photoshop', 'Teaching', 'Research'
  ];

  return (
    <div style={{ display: 'flex', background: '#f8fafc', minHeight: '100vh' }}>
      <Navbar />
      
      <div style={{ marginLeft: '280px', padding: '30px', width: 'calc(100% - 280px)' }}>
        {/* Header */}
        <div style={{ 
          marginBottom: '30px', 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          animation: 'slideInUp 0.5s ease-out'
        }}>
          <div>
            <h1 style={{ fontSize: '28px', color: '#1E3A5F', fontWeight: '600', marginBottom: '5px' }}>
              <i className="fas fa-cog" style={{ marginRight: '10px' }}></i>
              Settings
            </h1>
            <p style={{ color: '#666' }}>Manage your account, preferences, and privacy</p>
          </div>
          <div style={{
            background: '#E6F0FA',
            padding: '8px 16px',
            borderRadius: '30px',
            fontSize: '14px',
            color: '#1E3A5F',
            fontWeight: '500'
          }}>
            <i className="fas fa-user-circle" style={{ marginRight: '5px' }}></i>
            {profileData.name.split(' ')[0]}'s Account
          </div>
        </div>

        {message && (
          <div style={{
            background: '#d4edda',
            color: '#155724',
            padding: '15px 20px',
            borderRadius: '12px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            animation: 'slideInUp 0.3s ease-out',
            border: '1px solid #c3e6cb'
          }}>
            <i className="fas fa-check-circle" style={{ fontSize: '20px' }}></i>
            <span>{message}</span>
          </div>
        )}

        {/* Settings Tabs */}
        <div style={{
          display: 'flex',
          gap: '10px',
          marginBottom: '30px',
          borderBottom: '1px solid #e0e0e0',
          paddingBottom: '10px',
          flexWrap: 'wrap',
          animation: 'slideInUp 0.6s ease-out'
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
                background: activeTab === tab.id ? '#1E3A5F' : 'white',
                color: activeTab === tab.id ? 'white' : '#666',
                border: activeTab === tab.id ? 'none' : '1px solid #ddd',
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

        {/* Profile Tab */}
        {activeTab === 'profile' && (
          <div style={{ animation: 'slideInUp 0.7s ease-out' }}>
            {/* Profile Picture Card */}
            <div style={{
              background: 'white',
              borderRadius: '16px',
              padding: '30px',
              marginBottom: '30px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
              display: 'flex',
              alignItems: 'center',
              gap: '30px',
              flexWrap: 'wrap'
            }}>
              <div style={{ position: 'relative' }}>
                <div style={{
                  width: '120px',
                  height: '120px',
                  background: profileImage ? 'none' : 'linear-gradient(135deg, #E6F0FA 0%, #c4d9f0 100%)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '48px',
                  color: '#1E3A5F',
                  overflow: 'hidden',
                  border: '4px solid white',
                  boxShadow: '0 4px 10px rgba(0,0,0,0.1)'
                }}>
                  {profileImage ? (
                    <img src={profileImage} alt="profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <i className="fas fa-user-graduate"></i>
                  )}
                </div>
                <label htmlFor="profile-upload" style={{
                  position: 'absolute',
                  bottom: '5px',
                  right: '5px',
                  width: '36px',
                  height: '36px',
                  background: '#1E3A5F',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: 'white',
                  cursor: 'pointer',
                  border: '3px solid white',
                  boxShadow: '0 2px 5px rgba(0,0,0,0.2)'
                }}>
                  <i className="fas fa-camera"></i>
                </label>
                <input
                  type="file"
                  id="profile-upload"
                  accept="image/*"
                  onChange={handleImageUpload}
                  style={{ display: 'none' }}
                />
              </div>
              <div>
                <h2 style={{ fontSize: '24px', color: '#1E3A5F', marginBottom: '5px' }}>{profileData.name}</h2>
                <p style={{ color: '#666', marginBottom: '10px' }}>
                  <i className="fas fa-envelope" style={{ marginRight: '8px', color: '#1E3A5F' }}></i>
                  {profileData.email}
                </p>
                <p style={{ color: '#666' }}>
                  <i className="fas fa-graduation-cap" style={{ marginRight: '8px', color: '#1E3A5F' }}></i>
                  {profileData.department} • {profileData.year} • GPA: {profileData.gpa}
                </p>
              </div>
            </div>

            {/* Profile Form */}
            <div style={{
              background: 'white',
              borderRadius: '16px',
              padding: '30px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
            }}>
              <h3 style={{ color: '#1E3A5F', fontSize: '18px', fontWeight: '600', marginBottom: '25px' }}>
                <i className="fas fa-edit" style={{ marginRight: '10px' }}></i>
                Edit Profile Information
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '25px', marginBottom: '30px' }}>
                {/* Personal Info */}
                <div style={{ gridColumn: 'span 2' }}>
                  <h4 style={{ color: '#1E3A5F', fontSize: '16px', marginBottom: '15px', borderBottom: '1px solid #e0e0e0', paddingBottom: '10px' }}>
                    <i className="fas fa-user" style={{ marginRight: '8px' }}></i>
                    Personal Information
                  </h4>
                </div>

                <div className="input-group">
                  <label className="input-label">Full Name</label>
                  <input
                    type="text"
                    name="name"
                    value={profileData.name}
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
                  <label className="input-label">Address</label>
                  <input
                    type="text"
                    name="address"
                    value={profileData.address}
                    onChange={handleProfileChange}
                    className="input-field"
                    style={{ paddingLeft: '1rem' }}
                    placeholder="Cairo, Egypt"
                  />
                </div>

                <div style={{ gridColumn: 'span 2' }}>
                  <div className="input-group">
                    <label className="input-label">Bio</label>
                    <textarea
                      name="bio"
                      value={profileData.bio}
                      onChange={handleProfileChange}
                      rows="3"
                      className="input-field"
                      style={{ paddingLeft: '1rem', resize: 'vertical' }}
                      placeholder="Tell us a bit about yourself..."
                    />
                  </div>
                </div>

                {/* Academic Info */}
                <div style={{ gridColumn: 'span 2', marginTop: '10px' }}>
                  <h4 style={{ color: '#1E3A5F', fontSize: '16px', marginBottom: '15px', borderBottom: '1px solid #e0e0e0', paddingBottom: '10px' }}>
                    <i className="fas fa-graduation-cap" style={{ marginRight: '8px' }}></i>
                    Academic Information
                  </h4>
                </div>

                <div className="input-group">
                  <label className="input-label">Department</label>
                  <select
                    name="department"
                    value={profileData.department}
                    onChange={handleProfileChange}
                    className="input-field"
                    style={{ paddingLeft: '1rem' }}
                  >
                    <option>Computer Science</option>
                    <option>Physics</option>
                    <option>Chemistry</option>
                    <option>Mathematics</option>
                    <option>Biology</option>
                    <option>Geology</option>
                  </select>
                </div>

                <div className="input-group">
                  <label className="input-label">Academic Year</label>
                  <select
                    name="year"
                    value={profileData.year}
                    onChange={handleProfileChange}
                    className="input-field"
                    style={{ paddingLeft: '1rem' }}
                  >
                    <option>1st Year</option>
                    <option>2nd Year</option>
                    <option>3rd Year</option>
                    <option>4th Year</option>
                    <option>Graduate</option>
                  </select>
                </div>

                <div className="input-group">
                  <label className="input-label">GPA (out of 5.0)</label>
                  <input
                    type="number"
                    name="gpa"
                    value={profileData.gpa}
                    onChange={handleProfileChange}
                    step="0.1"
                    min="0"
                    max="5"
                    className="input-field"
                    style={{ paddingLeft: '1rem' }}
                  />
                </div>

                {/* Social Links - Optional */}
                <div style={{ gridColumn: 'span 2', marginTop: '10px' }}>
                  <h4 style={{ color: '#1E3A5F', fontSize: '16px', marginBottom: '15px', borderBottom: '1px solid #e0e0e0', paddingBottom: '10px' }}>
                    <i className="fas fa-share-alt" style={{ marginRight: '8px' }}></i>
                    Social Links (Optional)
                  </h4>
                  <p style={{ color: '#999', fontSize: '13px', marginBottom: '15px' }}>
                    Add your professional profiles to help employers know more about you
                  </p>
                </div>

                <div className="input-group">
                  <label className="input-label">
                    <i className="fab fa-linkedin" style={{ marginRight: '8px', color: '#0077B5' }}></i>
                    LinkedIn Profile
                  </label>
                  <input
                    type="text"
                    name="linkedin"
                    value={profileData.linkedin}
                    onChange={handleProfileChange}
                    className="input-field"
                    style={{ paddingLeft: '1rem' }}
                    placeholder="linkedin.com/in/your-profile"
                  />
                </div>

                <div className="input-group">
                  <label className="input-label">
                    <i className="fab fa-github" style={{ marginRight: '8px', color: '#333' }}></i>
                    GitHub Profile
                  </label>
                  <input
                    type="text"
                    name="github"
                    value={profileData.github}
                    onChange={handleProfileChange}
                    className="input-field"
                    style={{ paddingLeft: '1rem' }}
                    placeholder="github.com/your-username"
                  />
                </div>

                <div className="input-group">
                  <label className="input-label">
                    <i className="fas fa-globe" style={{ marginRight: '8px', color: '#1E3A5F' }}></i>
                    Personal Website
                  </label>
                  <input
                    type="text"
                    name="website"
                    value={profileData.website}
                    onChange={handleProfileChange}
                    className="input-field"
                    style={{ paddingLeft: '1rem' }}
                    placeholder="yourportfolio.com"
                  />
                </div>

                {/* Skills Section */}
                <div style={{ gridColumn: 'span 2', marginTop: '10px' }}>
                  <h4 style={{ color: '#1E3A5F', fontSize: '16px', marginBottom: '15px', borderBottom: '1px solid #e0e0e0', paddingBottom: '10px' }}>
                    <i className="fas fa-code" style={{ marginRight: '8px' }}></i>
                    Skills
                  </h4>
                </div>

                <div style={{ gridColumn: 'span 2' }}>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginBottom: '15px' }}>
                    {profileData.skills.map((skill, index) => (
                      <span
                        key={index}
                        style={{
                          background: '#E6F0FA',
                          color: '#1E3A5F',
                          padding: '8px 16px',
                          borderRadius: '30px',
                          fontSize: '14px',
                          display: 'flex',
                          alignItems: 'center',
                          gap: '8px'
                        }}
                      >
                        {skill}
                        <button
                          onClick={() => removeSkill(skill)}
                          style={{ background: 'none', border: 'none', color: '#1E3A5F', cursor: 'pointer', fontSize: '12px' }}
                        >
                          <i className="fas fa-times"></i>
                        </button>
                      </span>
                    ))}
                  </div>

                  <p style={{ color: '#666', fontSize: '14px', marginBottom: '10px' }}>Suggested Skills:</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {suggestedSkills.filter(s => !profileData.skills.includes(s)).slice(0, 8).map(skill => (
                      <button
                        key={skill}
                        onClick={() => addSkill(skill)}
                        style={{
                          padding: '6px 12px',
                          background: 'white',
                          border: '1px dashed #1E3A5F',
                          borderRadius: '30px',
                          color: '#1E3A5F',
                          fontSize: '12px',
                          cursor: 'pointer',
                          transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = '#E6F0FA'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                      >
                        + {skill}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '15px', justifyContent: 'flex-end', borderTop: '1px solid #e0e0e0', paddingTop: '20px' }}>
                <button
                  onClick={() => setProfileData({
                    name: user?.name || 'Reem Ahmed',
                    email: user?.email || '',
                    phone: user?.phone || '',
                    bio: user?.bio || '',
                    address: user?.address || '',
                    department: user?.department || 'Computer Science',
                    year: user?.year || '3rd Year',
                    gpa: user?.gpa || '3.7',
                    linkedin: '',
                    github: '',
                    website: '',
                    skills: user?.skills || ['JavaScript', 'React', 'Python']
                  })}
                  className="btn btn-outline"
                >
                  <i className="fas fa-undo-alt" style={{ marginRight: '5px' }}></i>
                  Reset
                </button>
                <button
                  onClick={handleSaveProfile}
                  disabled={loading}
                  className="btn btn-primary"
                >
                  {loading ? (
                    <><i className="fas fa-spinner fa-spin"></i> Saving...</>
                  ) : (
                    <><i className="fas fa-save"></i> Save Changes</>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Notifications Tab */}
        {activeTab === 'notifications' && (
          <div className="card" style={{ animation: 'slideInUp 0.7s ease-out' }}>
            <h3 style={{ color: '#1E3A5F', fontSize: '20px', fontWeight: '600', marginBottom: '25px' }}>
              <i className="fas fa-bell" style={{ marginRight: '10px' }}></i>
              Notification Preferences
            </h3>

            <div style={{ marginBottom: '30px' }}>
              <h4 style={{ color: '#1E3A5F', fontSize: '16px', marginBottom: '15px' }}>Delivery Methods</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                  <input type="checkbox" checked={notificationSettings.emailNotifications} onChange={() => handleNotificationChange('emailNotifications')} />
                  <span>Email Notifications</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                  <input type="checkbox" checked={notificationSettings.pushNotifications} onChange={() => handleNotificationChange('pushNotifications')} />
                  <span>Push Notifications</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                  <input type="checkbox" checked={notificationSettings.smsUrgentOnly} onChange={() => handleNotificationChange('smsUrgentOnly')} />
                  <span>SMS (Urgent only)</span>
                </label>
              </div>
            </div>

            <div>
              <h4 style={{ color: '#1E3A5F', fontSize: '16px', marginBottom: '15px' }}>Notify me about</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                  <input type="checkbox" checked={notificationSettings.applicationUpdates} onChange={() => handleNotificationChange('applicationUpdates')} />
                  <span>Application Updates</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                  <input type="checkbox" checked={notificationSettings.newJobMatches} onChange={() => handleNotificationChange('newJobMatches')} />
                  <span>New Job Matches</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                  <input type="checkbox" checked={notificationSettings.deadlineReminders} onChange={() => handleNotificationChange('deadlineReminders')} />
                  <span>Deadline Reminders</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                  <input type="checkbox" checked={notificationSettings.messages} onChange={() => handleNotificationChange('messages')} />
                  <span>Messages</span>
                </label>
                <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                  <input type="checkbox" checked={notificationSettings.marketingEmails} onChange={() => handleNotificationChange('marketingEmails')} />
                  <span>Marketing Emails</span>
                </label>
              </div>
            </div>

            <div style={{ marginTop: '30px', display: 'flex', gap: '15px', justifyContent: 'flex-end' }}>
              <button onClick={handleSaveProfile} className="btn btn-primary">
                <i className="fas fa-save" style={{ marginRight: '5px' }}></i>
                Save Preferences
              </button>
            </div>
          </div>
        )}

        {/* Privacy Tab */}
        {activeTab === 'privacy' && (
          <div className="card" style={{ animation: 'slideInUp 0.7s ease-out' }}>
            <h3 style={{ color: '#1E3A5F', fontSize: '20px', fontWeight: '600', marginBottom: '25px' }}>
              <i className="fas fa-lock" style={{ marginRight: '10px' }}></i>
              Privacy Settings
            </h3>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                <input type="checkbox" checked={privacySettings.profileVisible} onChange={() => handlePrivacyChange('profileVisible')} />
                <div>
                  <p style={{ fontWeight: '500', marginBottom: '2px' }}>Make profile visible to employers</p>
                  <p style={{ color: '#666', fontSize: '13px' }}>Employers can find you in searches</p>
                </div>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                <input type="checkbox" checked={privacySettings.showGPA} onChange={() => handlePrivacyChange('showGPA')} />
                <div>
                  <p style={{ fontWeight: '500', marginBottom: '2px' }}>Show GPA on profile</p>
                  <p style={{ color: '#666', fontSize: '13px' }}>Display your GPA to employers</p>
                </div>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                <input type="checkbox" checked={privacySettings.showContactInfo} onChange={() => handlePrivacyChange('showContactInfo')} />
                <div>
                  <p style={{ fontWeight: '500', marginBottom: '2px' }}>Show contact information</p>
                  <p style={{ color: '#666', fontSize: '13px' }}>Email and phone visible to employers</p>
                </div>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                <input type="checkbox" checked={privacySettings.showSkills} onChange={() => handlePrivacyChange('showSkills')} />
                <div>
                  <p style={{ fontWeight: '500', marginBottom: '2px' }}>Show skills on profile</p>
                  <p style={{ color: '#666', fontSize: '13px' }}>Display your skills to employers</p>
                </div>
              </label>

              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                <input type="checkbox" checked={privacySettings.showEmailToEmployers} onChange={() => handlePrivacyChange('showEmailToEmployers')} />
                <div>
                  <p style={{ fontWeight: '500', marginBottom: '2px' }}>Show email to employers</p>
                  <p style={{ color: '#666', fontSize: '13px' }}>Allow employers to contact you via email</p>
                </div>
              </label>
            </div>

            <div style={{ marginTop: '30px', display: 'flex', gap: '15px', justifyContent: 'flex-end' }}>
              <button onClick={handleSaveProfile} className="btn btn-primary">
                <i className="fas fa-save" style={{ marginRight: '5px' }}></i>
                Save Privacy Settings
              </button>
            </div>
          </div>
        )}

        {/* Security Tab */}
        {activeTab === 'security' && (
          <div className="card" style={{ animation: 'slideInUp 0.7s ease-out' }}>
            <h3 style={{ color: '#1E3A5F', fontSize: '20px', fontWeight: '600', marginBottom: '25px' }}>
              <i className="fas fa-shield-alt" style={{ marginRight: '10px' }}></i>
              Security Settings
            </h3>

            <div style={{ marginBottom: '30px' }}>
              <h4 style={{ color: '#1E3A5F', fontSize: '16px', marginBottom: '15px' }}>Change Password</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
                <div className="input-group">
                  <label className="input-label">Current Password</label>
                  <input
                    type="password"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    className="input-field"
                    style={{ paddingLeft: '1rem' }}
                  />
                </div>
                <div className="input-group">
                  <label className="input-label">New Password</label>
                  <input
                    type="password"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    className="input-field"
                    style={{ paddingLeft: '1rem' }}
                  />
                </div>
                <div className="input-group">
                  <label className="input-label">Confirm New Password</label>
                  <input
                    type="password"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    className="input-field"
                    style={{ paddingLeft: '1rem' }}
                  />
                </div>
              </div>
            </div>

            <div style={{ marginBottom: '30px' }}>
              <h4 style={{ color: '#1E3A5F', fontSize: '16px', marginBottom: '15px' }}>Two-Factor Authentication</h4>
              <label style={{ display: 'flex', alignItems: 'center', gap: '10px', cursor: 'pointer' }}>
                <input type="checkbox" />
                <span>Enable two-factor authentication</span>
              </label>
            </div>

            <div>
              <h4 style={{ color: '#1E3A5F', fontSize: '16px', marginBottom: '15px' }}>Active Sessions</h4>
              <div style={{
                padding: '15px',
                background: '#f8f9fa',
                borderRadius: '8px',
                marginBottom: '10px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <p style={{ fontWeight: '500', marginBottom: '2px' }}>
                    <i className="fas fa-laptop" style={{ marginRight: '8px', color: '#1E3A5F' }}></i>
                    Current Session
                  </p>
                  <p style={{ color: '#666', fontSize: '13px' }}>Chrome on Windows • Last active now</p>
                </div>
                <span style={{ color: '#16a34a', fontSize: '13px' }}>Active</span>
              </div>
            </div>

            <div style={{ marginTop: '30px', display: 'flex', gap: '15px', justifyContent: 'flex-end' }}>
              <button onClick={handleSaveProfile} className="btn btn-primary">
                <i className="fas fa-key" style={{ marginRight: '5px' }}></i>
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