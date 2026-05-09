// C:\Student-job-portal\Frontend\src\components\ProfileCard.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { getProfile, uploadProfileImage } from '../services/api';
import { useNavigate } from 'react-router-dom';

const ProfileCard = ({ showFullInfo = false, compact = false }) => {
  const { user, updateUser } = useAuth();
  const { darkMode } = useTheme();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [stats, setStats] = useState({
    applications: 0,
    savedJobs: 0,
    interviews: 0
  });

  useEffect(() => {
    fetchProfile();
  }, [user]);

  const fetchProfile = async () => {
    setLoading(true);
    try {
      const response = await getProfile();
      const data = response.data || {};
      setProfile({
        name: data.name || user?.name || 'Student',
        email: data.email || user?.email || '',
        department: data.department || user?.department || 'Computer Science',
        year: data.year || user?.year || '3rd Year',
        gpa: data.gpa || user?.gpa || '3.5',
        profileImage: data.profileImage || user?.profileImage || '',
        bio: data.bio || '',
        skills: data.skills || user?.skills || []
      });
      setStats({
        applications: data.totalApplications || 0,
        savedJobs: data.savedJobs || 0,
        interviews: data.interviews || 0
      });
    } catch (error) {
      console.error('Error fetching profile:', error);
      if (user) {
        setProfile({
          name: user.name || 'Student',
          email: user.email || '',
          department: user.department || 'Computer Science',
          year: user.year || '3rd Year',
          gpa: user.gpa || '3.5',
          profileImage: user.profileImage || '',
          bio: user.bio || '',
          skills: user.skills || []
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }
    if (file.size > 2 * 1024 * 1024) {
      alert('Image size must be less than 2MB');
      return;
    }
    
    setUploadingImage(true);
    try {
      const formData = new FormData();
      formData.append('profileImage', file);
      const response = await uploadProfileImage(formData);
      
      if (response.data?.url) {
        setProfile(prev => ({ ...prev, profileImage: response.data.url }));
        if (updateUser) updateUser({ ...user, profileImage: response.data.url });
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    } finally {
      setUploadingImage(false);
    }
  };

  const handleNavigateToProfile = () => {
    navigate('/student-profile');
  };

  const getInitials = (name) => {
    return name?.charAt(0)?.toUpperCase() || 'S';
  };

  if (loading && !profile) {
    return (
      <div className="card" style={{
        padding: '20px',
        background: darkMode ? '#1e293b' : 'white',
        borderRadius: '16px',
        animation: 'pulse 1.5s infinite'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
          <div style={{ width: '60px', height: '60px', background: darkMode ? '#334155' : '#e0e0e0', borderRadius: '50%' }}></div>
          <div style={{ flex: 1 }}>
            <div style={{ width: '60%', height: '16px', background: darkMode ? '#334155' : '#e0e0e0', borderRadius: '4px', marginBottom: '8px' }}></div>
            <div style={{ width: '40%', height: '12px', background: darkMode ? '#334155' : '#e0e0e0', borderRadius: '4px' }}></div>
          </div>
        </div>
      </div>
    );
  }

  if (compact) {
    return (
      <div 
        onClick={handleNavigateToProfile}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '10px 15px',
          background: darkMode ? '#1e293b' : 'white',
          borderRadius: '12px',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          border: `1px solid ${darkMode ? '#334155' : '#e0e0e0'}`
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateX(5px)';
          e.currentTarget.style.boxShadow = '0 4px 12px rgba(0,0,0,0.1)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateX(0)';
          e.currentTarget.style.boxShadow = 'none';
        }}
      >
        <div style={{
          width: '45px',
          height: '45px',
          background: profile?.profileImage ? 'none' : 'linear-gradient(135deg, #1E3A5F, #2a4a7a)',
          borderRadius: '50%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'hidden',
          fontSize: '20px',
          color: 'white'
        }}>
          {profile?.profileImage ? (
            <img src={profile.profileImage} alt="profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          ) : (
            <span>{getInitials(profile?.name)}</span>
          )}
        </div>
        <div>
          <p style={{ fontWeight: '600', fontSize: '14px', marginBottom: '2px', color: darkMode ? '#f1f5f9' : '#1E3A5F' }}>
            {profile?.name}
          </p>
          <p style={{ fontSize: '11px', color: darkMode ? '#94a3b8' : '#666' }}>
            {profile?.department} • {profile?.year}
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="card" style={{
      padding: '25px',
      background: darkMode ? '#1e293b' : 'white',
      borderRadius: '20px',
      boxShadow: '0 10px 30px -15px rgba(0,0,0,0.1)',
      transition: 'transform 0.3s ease',
      cursor: 'pointer'
    }}
    onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
    onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
    onClick={handleNavigateToProfile}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', flexWrap: 'wrap' }}>
        {/* Avatar */}
        <div style={{ position: 'relative' }}>
          <div style={{
            width: '85px',
            height: '85px',
            background: profile?.profileImage ? 'none' : 'linear-gradient(135deg, #1E3A5F, #2a4a7a)',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
            fontSize: '38px',
            color: 'white',
            boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
          }}>
            {profile?.profileImage ? (
              <img src={profile.profileImage} alt="profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <i className="fas fa-user-graduate"></i>
            )}
          </div>
          <label htmlFor="profile-card-upload" style={{
            position: 'absolute',
            bottom: '2px',
            right: '2px',
            width: '28px',
            height: '28px',
            background: '#1E3A5F',
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: 'white',
            cursor: uploadingImage ? 'not-allowed' : 'pointer',
            border: '2px solid white',
            opacity: uploadingImage ? 0.5 : 1
          }}>
            <i className="fas fa-camera" style={{ fontSize: '12px' }}></i>
          </label>
          <input type="file" id="profile-card-upload" accept="image/*" onChange={handleImageUpload} style={{ display: 'none' }} disabled={uploadingImage} />
        </div>
        
        <div style={{ flex: 1 }}>
          <h3 style={{ 
            fontSize: '20px', 
            fontWeight: '700', 
            color: darkMode ? '#f1f5f9' : '#1E3A5F',
            marginBottom: '5px'
          }}>
            {profile?.name}
          </h3>
          <p style={{ color: darkMode ? '#94a3b8' : '#666', fontSize: '14px', marginBottom: '5px' }}>
            <i className="fas fa-graduation-cap" style={{ marginRight: '8px', color: '#1E3A5F' }}></i>
            {profile?.department} - {profile?.year}
          </p>
          {profile?.gpa && (
            <p style={{ color: darkMode ? '#94a3b8' : '#666', fontSize: '13px' }}>
              <i className="fas fa-star" style={{ marginRight: '8px', color: '#f59e0b' }}></i>
              GPA: {profile.gpa}
            </p>
          )}
        </div>
      </div>

      {showFullInfo && (
        <>
          {/* Stats Row */}
          <div style={{
            display: 'flex',
            justifyContent: 'space-around',
            marginTop: '20px',
            paddingTop: '15px',
            borderTop: `1px solid ${darkMode ? '#334155' : '#e0e0e0'}`
          }}>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '20px', fontWeight: '700', color: darkMode ? '#f1f5f9' : '#1E3A5F' }}>{stats.applications}</p>
              <p style={{ fontSize: '11px', color: darkMode ? '#94a3b8' : '#666' }}>Applications</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '20px', fontWeight: '700', color: darkMode ? '#f1f5f9' : '#1E3A5F' }}>{stats.savedJobs}</p>
              <p style={{ fontSize: '11px', color: darkMode ? '#94a3b8' : '#666' }}>Saved Jobs</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <p style={{ fontSize: '20px', fontWeight: '700', color: darkMode ? '#f1f5f9' : '#1E3A5F' }}>{stats.interviews}</p>
              <p style={{ fontSize: '11px', color: darkMode ? '#94a3b8' : '#666' }}>Interviews</p>
            </div>
          </div>

          {/* Skills Preview */}
          {profile?.skills?.length > 0 && (
            <div style={{ marginTop: '15px' }}>
              <p style={{ fontSize: '12px', fontWeight: '500', marginBottom: '8px', color: darkMode ? '#94a3b8' : '#666' }}>
                <i className="fas fa-code" style={{ marginRight: '6px' }}></i>
                Top Skills:
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                {profile.skills.slice(0, 4).map((skill, i) => (
                  <span key={i} style={{
                    background: darkMode ? '#334155' : '#E6F0FA',
                    color: darkMode ? '#e2e8f0' : '#1E3A5F',
                    padding: '4px 10px',
                    borderRadius: '20px',
                    fontSize: '11px'
                  }}>
                    {skill}
                  </span>
                ))}
                {profile.skills.length > 4 && (
                  <span style={{ fontSize: '11px', color: darkMode ? '#94a3b8' : '#999' }}>
                    +{profile.skills.length - 4}
                  </span>
                )}
              </div>
            </div>
          )}

          {/* View Profile Button */}
          <button
            onClick={(e) => { e.stopPropagation(); handleNavigateToProfile(); }}
            style={{
              width: '100%',
              marginTop: '15px',
              padding: '8px',
              background: 'transparent',
              border: `1px solid ${darkMode ? '#475569' : '#1E3A5F'}`,
              borderRadius: '30px',
              color: darkMode ? '#e2e8f0' : '#1E3A5F',
              cursor: 'pointer',
              fontSize: '12px',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#1E3A5F';
              e.currentTarget.style.color = 'white';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'transparent';
              e.currentTarget.style.color = darkMode ? '#e2e8f0' : '#1E3A5F';
            }}
          >
            View Full Profile <i className="fas fa-arrow-right"></i>
          </button>
        </>
      )}
    </div>
  );
};

export default ProfileCard;
