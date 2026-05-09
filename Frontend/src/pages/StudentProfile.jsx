// C:\Student-job-portal\Frontend\src\pages\StudentProfile.jsx
import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { getProfile, updateProfile, uploadProfileImage, deleteProfileImage } from '../services/api';
import { useNavigate } from 'react-router-dom';

const StudentProfile = () => {
  const { user, updateUser } = useAuth();
  const { darkMode } = useTheme();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');
  const [profileImage, setProfileImage] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [stats, setStats] = useState({
    totalApplications: 0,
    savedJobs: 0,
    interviews: 0,
    profileCompletion: 0
  });
  
  const [profile, setProfile] = useState({
    name: '',
    email: '',
    phone: '',
    department: '',
    year: '',
    gpa: '',
    bio: '',
    skills: [],
    linkedin: '',
    github: '',
    website: '',
    profileImage: ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        // First from user context
        if (user) {
          setProfile({
            name: user.name || '',
            email: user.email || '',
            phone: user.phone || '',
            department: user.department || '',
            year: user.year || '',
            gpa: user.gpa || '',
            bio: user.bio || '',
            skills: user.skills || [],
            linkedin: user.linkedin || '',
            github: user.github || '',
            website: user.website || '',
            profileImage: user.profileImage || ''
          });
          if (user.profileImage) setProfileImagePreview(user.profileImage);
          
          setStats({
            totalApplications: user.totalApplications || 0,
            savedJobs: user.savedJobs || 0,
            interviews: user.interviews || 0,
            profileCompletion: user.profileCompletion || 70
          });
        }
        
        // Then fetch fresh from API
        try {
          const response = await getProfile();
          if (response.data) {
            setProfile(prev => ({
              ...prev,
              ...response.data,
              skills: response.data.skills || prev.skills
            }));
            if (response.data.profileImage) setProfileImagePreview(response.data.profileImage);
            setStats({
              totalApplications: response.data.totalApplications || 0,
              savedJobs: response.data.savedJobs || 0,
              interviews: response.data.interviews || 0,
              profileCompletion: response.data.profileCompletion || 70
            });
          }
        } catch (err) {
          console.log('Could not fetch fresh profile');
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchProfile();
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      setMessage('Please upload an image file');
      setMessageType('error');
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      setMessage('Image size must be less than 5MB');
      setMessageType('error');
      return;
    }
    
    setUploadingImage(true);
    const reader = new FileReader();
    reader.onloadend = () => {
      setProfileImagePreview(reader.result);
    };
    reader.readAsDataURL(file);
    setProfileImage(file);
    setUploadingImage(false);
  };

  const handleRemoveImage = async () => {
    if (!window.confirm('Are you sure you want to remove your profile image?')) return;
    
    setUploadingImage(true);
    try {
      await deleteProfileImage();
      setProfileImagePreview(null);
      setProfileImage(null);
      setProfile(prev => ({ ...prev, profileImage: '' }));
      setMessage('✅ Profile image removed', 'success');
    } catch (error) {
      setMessage('❌ Failed to remove image', 'error');
    } finally {
      setUploadingImage(false);
    }
  };

  const uploadImage = async () => {
    if (!profileImage) return null;
    const formData = new FormData();
    formData.append('profileImage', profileImage);
    try {
      const response = await uploadProfileImage(formData);
      return response.data?.url;
    } catch (error) {
      console.error('Error uploading image:', error);
      return null;
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setMessage('');
    
    try {
      let imageUrl = profile.profileImage;
      if (profileImage) {
        const uploadedUrl = await uploadImage();
        if (uploadedUrl) imageUrl = uploadedUrl;
      }
      
      const updatedProfile = { ...profile, profileImage: imageUrl };
      await updateProfile(updatedProfile);
      if (updateUser) updateUser(updatedProfile);
      
      setMessage('✅ Profile updated successfully!', 'success');
      setIsEditing(false);
      
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage(error.response?.data?.message || 'Failed to update profile', 'error');
    } finally {
      setSaving(false);
    }
  };

  const addSkill = (skill) => {
    if (skill && !profile.skills.includes(skill)) {
      setProfile(prev => ({
        ...prev,
        skills: [...prev.skills, skill]
      }));
    }
  };

  const removeSkill = (skill) => {
    setProfile(prev => ({
      ...prev,
      skills: prev.skills.filter(s => s !== skill)
    }));
  };

  const popularSkills = [
    'JavaScript', 'React', 'Python', 'Java', 'C++', 'HTML/CSS', 'Node.js',
    'Machine Learning', 'Data Analysis', 'Teaching', 'Research', 'Communication',
    'Leadership', 'Problem Solving', 'Team Work', 'Git', 'SQL', 'TypeScript',
    'Django', 'Flask', 'MongoDB', 'Express'
  ];

  if (loading) {
    return (
      <Layout>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <LoadingSpinner size="large" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <style>{`
        @keyframes slideInUp {
          from { transform: translateY(30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.02); }
          100% { transform: scale(1); }
        }
        .profile-card {
          animation: slideInUp 0.5s ease-out;
        }
        .info-item {
          transition: all 0.3s ease;
        }
        .stat-card {
          transition: all 0.3s ease;
          animation: slideInUp 0.6s ease-out;
        }
        .stat-card:hover {
          transform: translateY(-5px);
        }
      `}</style>

      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '30px', animation: 'slideInUp 0.4s ease-out' }}>
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
              <i className="fas fa-user-circle" style={{ fontSize: '24px', color: 'white' }}></i>
            </div>
            <div>
              <h1 style={{ fontSize: '28px', fontWeight: '700', color: darkMode ? '#f1f5f9' : '#1E3A5F' }}>
                My Profile
              </h1>
              <p style={{ color: darkMode ? '#94a3b8' : '#666', marginTop: '4px' }}>
                View and manage your personal information
              </p>
            </div>
          </div>
        </div>

        {/* Message Toast */}
        {message && (
          <div style={{
            background: message.includes('✅') ? '#d4edda' : '#f8d7da',
            color: message.includes('✅') ? '#155724' : '#721c24',
            padding: '15px 20px',
            borderRadius: '12px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            animation: 'fadeIn 0.3s ease-out'
          }}>
            <i className={`fas ${message.includes('✅') ? 'fa-check-circle' : 'fa-exclamation-circle'}`}></i>
            <span>{message}</span>
          </div>
        )}

        {/* Stats Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
          marginBottom: '30px'
        }}>
          <div className="stat-card" style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
            borderRadius: '20px',
            padding: '22px',
            color: 'white',
            textAlign: 'center'
          }}>
            <i className="fas fa-file-alt" style={{ fontSize: '28px', marginBottom: '12px' }}></i>
            <h3 style={{ fontSize: '28px', fontWeight: '700' }}>{stats.totalApplications}</h3>
            <p style={{ fontSize: '13px', opacity: 0.9 }}>Total Applications</p>
          </div>
          <div className="stat-card" style={{
            background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
            borderRadius: '20px',
            padding: '22px',
            color: 'white',
            textAlign: 'center'
          }}>
            <i className="fas fa-bookmark" style={{ fontSize: '28px', marginBottom: '12px' }}></i>
            <h3 style={{ fontSize: '28px', fontWeight: '700' }}>{stats.savedJobs}</h3>
            <p style={{ fontSize: '13px', opacity: 0.9 }}>Saved Jobs</p>
          </div>
          <div className="stat-card" style={{
            background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
            borderRadius: '20px',
            padding: '22px',
            color: 'white',
            textAlign: 'center'
          }}>
            <i className="fas fa-calendar-check" style={{ fontSize: '28px', marginBottom: '12px' }}></i>
            <h3 style={{ fontSize: '28px', fontWeight: '700' }}>{stats.interviews}</h3>
            <p style={{ fontSize: '13px', opacity: 0.9 }}>Interviews</p>
          </div>
          <div className="stat-card" style={{
            background: 'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
            borderRadius: '20px',
            padding: '22px',
            color: 'white',
            textAlign: 'center'
          }}>
            <i className="fas fa-chart-line" style={{ fontSize: '28px', marginBottom: '12px' }}></i>
            <h3 style={{ fontSize: '28px', fontWeight: '700' }}>{stats.profileCompletion}%</h3>
            <p style={{ fontSize: '13px', opacity: 0.9 }}>Profile Complete</p>
          </div>
        </div>

        {/* Main Profile Card */}
        <div className="profile-card" style={{
          background: darkMode ? '#1e293b' : 'white',
          borderRadius: '24px',
          overflow: 'hidden',
          boxShadow: '0 20px 35px -10px rgba(0,0,0,0.1)',
          marginBottom: '30px'
        }}>
          {/* Cover Image */}
          <div style={{
            height: '120px',
            background: 'linear-gradient(135deg, #1E3A5F 0%, #2a4a7a 100%)',
            position: 'relative'
          }} />
          
          {/* Profile Info */}
          <div style={{ padding: '0 40px 40px 40px', position: 'relative' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', flexWrap: 'wrap', gap: '20px', marginTop: '-60px' }}>
              <div style={{ display: 'flex', alignItems: 'flex-end', gap: '25px', flexWrap: 'wrap' }}>
                {/* Avatar */}
                <div style={{ position: 'relative' }}>
                  <div style={{
                    width: '130px',
                    height: '130px',
                    background: profileImagePreview ? 'none' : 'linear-gradient(135deg, #E6F0FA 0%, #c4d9f0 100%)',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '50px',
                    color: '#1E3A5F',
                    overflow: 'hidden',
                    border: '4px solid white',
                    boxShadow: '0 8px 20px rgba(0,0,0,0.15)'
                  }}>
                    {profileImagePreview ? (
                      <img src={profileImagePreview} alt="profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                    ) : (
                      <i className="fas fa-user-graduate"></i>
                    )}
                  </div>
                  {isEditing && (
                    <>
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
                        transition: 'transform 0.2s ease'
                      }}>
                        <i className="fas fa-camera" style={{ fontSize: '16px' }}></i>
                      </label>
                      <input type="file" id="profile-upload" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} />
                      {profileImagePreview && (
                        <button
                          onClick={handleRemoveImage}
                          style={{
                            position: 'absolute',
                            bottom: '5px',
                            left: '5px',
                            width: '36px',
                            height: '36px',
                            background: '#ef4444',
                            borderRadius: '50%',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            color: 'white',
                            cursor: 'pointer',
                            border: '3px solid white'
                          }}
                        >
                          <i className="fas fa-trash" style={{ fontSize: '16px' }}></i>
                        </button>
                      )}
                    </>
                  )}
                </div>
                
                <div>
                  <h2 style={{ fontSize: '26px', color: darkMode ? '#f1f5f9' : '#1E3A5F', marginBottom: '8px', fontWeight: '700' }}>
                    {profile.name || 'Student Name'}
                  </h2>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', marginBottom: '5px' }}>
                    <span style={{ color: darkMode ? '#94a3b8' : '#666', fontSize: '14px' }}>
                      <i className="fas fa-envelope" style={{ marginRight: '8px', color: '#1E3A5F' }}></i>
                      {profile.email || 'Not provided'}
                    </span>
                    {profile.phone && (
                      <span style={{ color: darkMode ? '#94a3b8' : '#666', fontSize: '14px' }}>
                        <i className="fas fa-phone" style={{ marginRight: '8px', color: '#1E3A5F' }}></i>
                        {profile.phone}
                      </span>
                    )}
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px' }}>
                    <span style={{ background: '#E6F0FA', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', color: '#1E3A5F' }}>
                      <i className="fas fa-graduation-cap" style={{ marginRight: '5px' }}></i>
                      {profile.department || 'Not set'}
                    </span>
                    {profile.year && (
                      <span style={{ background: '#E6F0FA', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', color: '#1E3A5F' }}>
                        <i className="fas fa-calendar-alt" style={{ marginRight: '5px' }}></i>
                        {profile.year}
                      </span>
                    )}
                    {profile.gpa && (
                      <span style={{ background: '#E6F0FA', padding: '4px 12px', borderRadius: '20px', fontSize: '12px', color: '#1E3A5F' }}>
                        <i className="fas fa-star" style={{ marginRight: '5px' }}></i>
                        GPA: {profile.gpa}
                      </span>
                    )}
                  </div>
                </div>
              </div>
              
              {!isEditing ? (
                <button
                  onClick={() => setIsEditing(true)}
                  style={{
                    padding: '12px 28px',
                    background: 'linear-gradient(135deg, #1E3A5F 0%, #2a4a7a 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '40px',
                    cursor: 'pointer',
                    fontWeight: '600',
                    fontSize: '14px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                    boxShadow: '0 4px 15px rgba(30,58,95,0.2)'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px)';
                    e.currentTarget.style.boxShadow = '0 8px 25px rgba(30,58,95,0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0)';
                    e.currentTarget.style.boxShadow = '0 4px 15px rgba(30,58,95,0.2)';
                  }}
                >
                  <i className="fas fa-edit"></i>
                  Edit Profile
                </button>
              ) : (
                <div style={{ display: 'flex', gap: '12px' }}>
                  <button
                    onClick={() => setIsEditing(false)}
                    style={{
                      padding: '12px 28px',
                      background: 'transparent',
                      color: '#1E3A5F',
                      border: '2px solid #1E3A5F',
                      borderRadius: '40px',
                      cursor: 'pointer',
                      fontWeight: '600',
                      transition: 'all 0.2s ease'
                    }}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmit}
                    disabled={saving}
                    style={{
                      padding: '12px 28px',
                      background: 'linear-gradient(135deg, #1E3A5F 0%, #2a4a7a 100%)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '40px',
                      cursor: saving ? 'not-allowed' : 'pointer',
                      fontWeight: '600',
                      opacity: saving ? 0.7 : 1,
                      transition: 'all 0.2s ease'
                    }}
                  >
                    {saving ? <><i className="fas fa-spinner fa-spin"></i> Saving...</> : <><i className="fas fa-save"></i> Save Changes</>}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Personal Information Section */}
        <div style={{
          background: darkMode ? '#1e293b' : 'white',
          borderRadius: '24px',
          padding: '35px',
          marginBottom: '30px',
          boxShadow: '0 10px 30px -15px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ color: darkMode ? '#f1f5f9' : '#1E3A5F', fontSize: '20px', fontWeight: '600', marginBottom: '25px', borderBottom: `2px solid ${darkMode ? '#334155' : '#E6F0FA'}`, paddingBottom: '15px' }}>
            <i className="fas fa-user" style={{ marginRight: '12px' }}></i>
            Personal Information
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '25px' }}>
            <div className="info-item" style={{ padding: '12px 0', borderBottom: `1px solid ${darkMode ? '#334155' : '#f0f0f0'}` }}>
              <p style={{ color: '#999', fontSize: '12px', marginBottom: '5px', letterSpacing: '0.5px' }}>FULL NAME</p>
              {isEditing ? (
                <input type="text" name="name" value={profile.name} onChange={handleInputChange} style={{ width: '100%', padding: '8px 0', border: 'none', borderBottom: '2px solid #1E3A5F', outline: 'none', fontSize: '15px', background: 'transparent', color: darkMode ? '#e2e8f0' : '#333' }} />
              ) : (
                <p style={{ fontSize: '16px', fontWeight: '500', color: darkMode ? '#e2e8f0' : '#333' }}>{profile.name || 'Not provided'}</p>
              )}
            </div>

            <div className="info-item" style={{ padding: '12px 0', borderBottom: `1px solid ${darkMode ? '#334155' : '#f0f0f0'}` }}>
              <p style={{ color: '#999', fontSize: '12px', marginBottom: '5px', letterSpacing: '0.5px' }}>EMAIL ADDRESS</p>
              <p style={{ fontSize: '16px', fontWeight: '500', color: darkMode ? '#e2e8f0' : '#333' }}>{profile.email || 'Not provided'}</p>
            </div>

            <div className="info-item" style={{ padding: '12px 0', borderBottom: `1px solid ${darkMode ? '#334155' : '#f0f0f0'}` }}>
              <p style={{ color: '#999', fontSize: '12px', marginBottom: '5px', letterSpacing: '0.5px' }}>PHONE NUMBER</p>
              {isEditing ? (
                <input type="tel" name="phone" value={profile.phone} onChange={handleInputChange} placeholder="+20 123 456 789" style={{ width: '100%', padding: '8px 0', border: 'none', borderBottom: '2px solid #1E3A5F', outline: 'none', fontSize: '15px', background: 'transparent', color: darkMode ? '#e2e8f0' : '#333' }} />
              ) : (
                <p style={{ fontSize: '16px', fontWeight: '500', color: darkMode ? '#e2e8f0' : '#333' }}>{profile.phone || 'Not provided'}</p>
              )}
            </div>

            <div className="info-item" style={{ padding: '12px 0', borderBottom: `1px solid ${darkMode ? '#334155' : '#f0f0f0'}` }}>
              <p style={{ color: '#999', fontSize: '12px', marginBottom: '5px', letterSpacing: '0.5px' }}>DEPARTMENT</p>
              {isEditing ? (
                <select name="department" value={profile.department} onChange={handleInputChange} style={{ width: '100%', padding: '8px 0', border: 'none', borderBottom: '2px solid #1E3A5F', outline: 'none', fontSize: '15px', background: 'transparent', color: darkMode ? '#e2e8f0' : '#333' }}>
                  <option value="">Select Department</option>
                  <option>Computer Science</option><option>Physics</option><option>Chemistry</option>
                  <option>Mathematics</option><option>Biology</option><option>Geology</option>
                </select>
              ) : (
                <p style={{ fontSize: '16px', fontWeight: '500', color: darkMode ? '#e2e8f0' : '#333' }}>{profile.department || 'Not provided'}</p>
              )}
            </div>

            <div className="info-item" style={{ padding: '12px 0', borderBottom: `1px solid ${darkMode ? '#334155' : '#f0f0f0'}` }}>
              <p style={{ color: '#999', fontSize: '12px', marginBottom: '5px', letterSpacing: '0.5px' }}>ACADEMIC YEAR</p>
              {isEditing ? (
                <select name="year" value={profile.year} onChange={handleInputChange} style={{ width: '100%', padding: '8px 0', border: 'none', borderBottom: '2px solid #1E3A5F', outline: 'none', fontSize: '15px', background: 'transparent', color: darkMode ? '#e2e8f0' : '#333' }}>
                  <option value="">Select Year</option>
                  <option>1st Year</option><option>2nd Year</option><option>3rd Year</option><option>4th Year</option><option>Graduate</option>
                </select>
              ) : (
                <p style={{ fontSize: '16px', fontWeight: '500', color: darkMode ? '#e2e8f0' : '#333' }}>{profile.year || 'Not provided'}</p>
              )}
            </div>

            <div className="info-item" style={{ padding: '12px 0', borderBottom: `1px solid ${darkMode ? '#334155' : '#f0f0f0'}` }}>
              <p style={{ color: '#999', fontSize: '12px', marginBottom: '5px', letterSpacing: '0.5px' }}>GPA (out of 5.0)</p>
              {isEditing ? (
                <input type="number" name="gpa" value={profile.gpa} onChange={handleInputChange} step="0.1" min="0" max="5" style={{ width: '100%', padding: '8px 0', border: 'none', borderBottom: '2px solid #1E3A5F', outline: 'none', fontSize: '15px', background: 'transparent', color: darkMode ? '#e2e8f0' : '#333' }} />
              ) : (
                <p style={{ fontSize: '16px', fontWeight: '500', color: darkMode ? '#e2e8f0' : '#333' }}>{profile.gpa || 'Not provided'}</p>
              )}
            </div>
          </div>

          <div className="info-item" style={{ marginTop: '20px', padding: '12px 0', borderTop: `1px solid ${darkMode ? '#334155' : '#f0f0f0'}` }}>
            <p style={{ color: '#999', fontSize: '12px', marginBottom: '5px', letterSpacing: '0.5px' }}>BIO</p>
            {isEditing ? (
              <textarea name="bio" value={profile.bio} onChange={handleInputChange} rows="3" style={{ width: '100%', padding: '10px', border: `1px solid ${darkMode ? '#475569' : '#ddd'}`, borderRadius: '8px', outline: 'none', fontSize: '14px', resize: 'vertical', background: 'transparent', color: darkMode ? '#e2e8f0' : '#333' }} placeholder="Tell us about yourself..." />
            ) : (
              <p style={{ fontSize: '15px', color: darkMode ? '#94a3b8' : '#666', lineHeight: '1.6' }}>{profile.bio || 'No bio added yet. Click edit to add a bio.'}</p>
            )}
          </div>
        </div>

        {/* Skills Section */}
        <div style={{
          background: darkMode ? '#1e293b' : 'white',
          borderRadius: '24px',
          padding: '35px',
          marginBottom: '30px',
          boxShadow: '0 10px 30px -15px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ color: darkMode ? '#f1f5f9' : '#1E3A5F', fontSize: '20px', fontWeight: '600', marginBottom: '25px', borderBottom: `2px solid ${darkMode ? '#334155' : '#E6F0FA'}`, paddingBottom: '15px' }}>
            <i className="fas fa-code" style={{ marginRight: '12px' }}></i>
            Skills & Expertise
          </h3>

          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginBottom: '25px' }}>
            {profile.skills.length === 0 ? (
              <p style={{ color: '#999', fontStyle: 'italic' }}>No skills added yet. Add skills to get better job matches!</p>
            ) : (
              profile.skills.map((skill, index) => (
                <span key={index} style={{
                  background: 'linear-gradient(135deg, #E6F0FA 0%, #d4e4f5 100%)',
                  color: '#1E3A5F',
                  padding: '8px 18px',
                  borderRadius: '30px',
                  fontSize: '14px',
                  fontWeight: '500',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <i className="fas fa-check-circle" style={{ fontSize: '12px' }}></i>
                  {skill}
                  {isEditing && (
                    <button type="button" onClick={() => removeSkill(skill)} style={{ background: 'none', border: 'none', color: '#1E3A5F', cursor: 'pointer', fontSize: '14px', opacity: 0.6 }}>
                      <i className="fas fa-times-circle"></i>
                    </button>
                  )}
                </span>
              ))
            )}
          </div>

          {isEditing && (
            <>
              <div style={{ display: 'flex', gap: '12px', marginBottom: '20px' }}>
                <input
                  type="text"
                  id="newSkillInput"
                  placeholder="Add a new skill (e.g., React, Python, Teaching...)"
                  style={{ flex: 1, padding: '12px 16px', border: `1px solid ${darkMode ? '#475569' : '#e0e0e0'}`, borderRadius: '30px', fontSize: '14px', outline: 'none', background: 'transparent', color: darkMode ? '#e2e8f0' : '#333' }}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter') {
                      addSkill(e.target.value);
                      e.target.value = '';
                    }
                  }}
                />
                <button
                  type="button"
                  onClick={() => {
                    const input = document.getElementById('newSkillInput');
                    addSkill(input.value);
                    input.value = '';
                  }}
                  style={{ padding: '12px 28px', background: '#1E3A5F', color: 'white', border: 'none', borderRadius: '30px', cursor: 'pointer', fontWeight: '500' }}
                >
                  Add Skill
                </button>
              </div>

              <div>
                <p style={{ color: '#666', marginBottom: '12px', fontSize: '13px', fontWeight: '500' }}>Suggested Skills:</p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px' }}>
                  {popularSkills.filter(s => !profile.skills.includes(s)).slice(0, 15).map(skill => (
                    <button
                      key={skill}
                      type="button"
                      onClick={() => addSkill(skill)}
                      style={{
                        padding: '6px 14px',
                        background: 'transparent',
                        border: `1px dashed ${darkMode ? '#818cf8' : '#1E3A5F'}`,
                        borderRadius: '30px',
                        color: darkMode ? '#818cf8' : '#1E3A5F',
                        fontSize: '12px',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease'
                      }}
                      onMouseEnter={(e) => {
                        e.currentTarget.style.background = '#1E3A5F';
                        e.currentTarget.style.color = 'white';
                      }}
                      onMouseLeave={(e) => {
                        e.currentTarget.style.background = 'transparent';
                        e.currentTarget.style.color = darkMode ? '#818cf8' : '#1E3A5F';
                      }}
                    >
                      + {skill}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        {/* Social Links Section */}
        <div style={{
          background: darkMode ? '#1e293b' : 'white',
          borderRadius: '24px',
          padding: '35px',
          boxShadow: '0 10px 30px -15px rgba(0,0,0,0.1)'
        }}>
          <h3 style={{ color: darkMode ? '#f1f5f9' : '#1E3A5F', fontSize: '20px', fontWeight: '600', marginBottom: '25px', borderBottom: `2px solid ${darkMode ? '#334155' : '#E6F0FA'}`, paddingBottom: '15px' }}>
            <i className="fas fa-share-alt" style={{ marginRight: '12px' }}></i>
            Social & Professional Links
          </h3>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '25px' }}>
            <div>
              <p style={{ color: '#999', fontSize: '12px', marginBottom: '5px' }}>
                <i className="fab fa-linkedin" style={{ marginRight: '8px', color: '#0077B5' }}></i>
                LINKEDIN
              </p>
              {isEditing ? (
                <input type="text" name="linkedin" value={profile.linkedin} onChange={handleInputChange} placeholder="linkedin.com/in/username" style={{ width: '100%', padding: '10px', border: `1px solid ${darkMode ? '#475569' : '#e0e0e0'}`, borderRadius: '8px', fontSize: '14px', background: 'transparent', color: darkMode ? '#e2e8f0' : '#333' }} />
              ) : (
                <p style={{ fontSize: '14px', color: profile.linkedin ? '#0077B5' : '#999' }}>{profile.linkedin || 'Not provided'}</p>
              )}
            </div>

            <div>
              <p style={{ color: '#999', fontSize: '12px', marginBottom: '5px' }}>
                <i className="fab fa-github" style={{ marginRight: '8px', color: '#333' }}></i>
                GITHUB
              </p>
              {isEditing ? (
                <input type="text" name="github" value={profile.github} onChange={handleInputChange} placeholder="github.com/username" style={{ width: '100%', padding: '10px', border: `1px solid ${darkMode ? '#475569' : '#e0e0e0'}`, borderRadius: '8px', fontSize: '14px', background: 'transparent', color: darkMode ? '#e2e8f0' : '#333' }} />
              ) : (
                <p style={{ fontSize: '14px', color: profile.github ? '#333' : '#999' }}>{profile.github || 'Not provided'}</p>
              )}
            </div>

            <div style={{ gridColumn: 'span 2' }}>
              <p style={{ color: '#999', fontSize: '12px', marginBottom: '5px' }}>
                <i className="fas fa-globe" style={{ marginRight: '8px', color: '#1E3A5F' }}></i>
                WEBSITE / PORTFOLIO
              </p>
              {isEditing ? (
                <input type="text" name="website" value={profile.website} onChange={handleInputChange} placeholder="yourportfolio.com" style={{ width: '100%', padding: '10px', border: `1px solid ${darkMode ? '#475569' : '#e0e0e0'}`, borderRadius: '8px', fontSize: '14px', background: 'transparent', color: darkMode ? '#e2e8f0' : '#333' }} />
              ) : (
                <p style={{ fontSize: '14px', color: profile.website ? '#1E3A5F' : '#999' }}>{profile.website || 'Not provided'}</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default StudentProfile;
