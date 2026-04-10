// src/pages/StudentProfile.jsx
import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { getProfile, updateProfile } from '../services/api';

const StudentProfile = () => {
  const { user, setUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    department: user?.department || '',
    year: user?.year || '',
    gpa: user?.gpa || '',
    bio: user?.bio || '',
    linkedin: user?.linkedin || '',
    github: user?.github || ''
  });

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getProfile();
        if (response.data) {
          setProfileData({
            name: response.data.name || user?.name,
            email: response.data.email || user?.email,
            phone: response.data.phone || '',
            department: response.data.department || '',
            year: response.data.year || '',
            gpa: response.data.gpa || '',
            bio: response.data.bio || '',
            linkedin: response.data.linkedin || '',
            github: response.data.github || ''
          });
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
      }
    };
    fetchProfile();
  }, [user]);

  const handleChange = (e) => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateProfile(profileData);
      if (setUser) {
        setUser({ ...user, ...profileData });
      }
      setMessage('✅ Profile updated successfully!');
      setIsEditing(false);
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      setMessage('❌ Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const stats = [
    { label: 'Applications', value: '12', icon: 'fa-file-alt', color: '#1E3A5F' },
    { label: 'Interviews', value: '3', icon: 'fa-calendar-check', color: '#16a34a' },
    { label: 'Saved Jobs', value: '7', icon: 'fa-bookmark', color: '#f59e0b' },
    { label: 'Profile Views', value: '45', icon: 'fa-eye', color: '#3b82f6' }
  ];

  return (
    <div style={{ display: 'flex', background: '#f8fafc', minHeight: '100vh' }}>
      <Navbar />
      <div style={{ marginLeft: '280px', padding: '30px', width: 'calc(100% - 280px)' }}>
        {/* Header */}
        <div style={{ marginBottom: '30px', animation: 'slideInUp 0.5s ease-out' }}>
          <h1 style={{ fontSize: '28px', color: '#1E3A5F', fontWeight: '600', marginBottom: '5px' }}>
            My Profile
          </h1>
          <p style={{ color: '#666' }}>View and manage your personal information</p>
        </div>

        {message && (
          <div style={{
            background: message.includes('✅') ? '#d4edda' : '#f8d7da',
            color: message.includes('✅') ? '#155724' : '#721c24',
            padding: '12px 20px',
            borderRadius: '8px',
            marginBottom: '20px',
            animation: 'slideInUp 0.3s ease-out'
          }}>
            {message}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '30px' }}>
          {/* Left Column - Profile Card */}
          <div style={{ animation: 'slideInUp 0.6s ease-out' }}>
            <div style={{
              background: 'white',
              borderRadius: '16px',
              padding: '30px',
              textAlign: 'center',
              boxShadow: '0 2px 12px rgba(0,0,0,0.08)'
            }}>
              <div style={{ position: 'relative', width: '120px', margin: '0 auto 20px' }}>
                <div style={{
                  width: '120px',
                  height: '120px',
                  background: 'linear-gradient(135deg, #1E3A5F 0%, #2a4a7a 100%)',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '48px',
                  color: 'white'
                }}>
                  <i className="fas fa-user-graduate"></i>
                </div>
                <label htmlFor="profile-upload" style={{
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
                <input type="file" id="profile-upload" accept="image/*" onChange={(e) => setProfileImage(e.target.files[0])} style={{ display: 'none' }} />
              </div>
              <h2 style={{ color: '#1E3A5F', marginBottom: '5px' }}>{profileData.name || user?.name}</h2>
              <p style={{ color: '#666', marginBottom: '5px' }}>{profileData.email || user?.email}</p>
              <span style={{
                display: 'inline-block',
                background: '#1E3A5F',
                color: 'white',
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '12px'
              }}>
                Student
              </span>
            </div>

            {/* Stats Cards */}
            <div style={{ marginTop: '20px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              {stats.map((stat, index) => (
                <div key={index} style={{
                  background: 'white',
                  borderRadius: '12px',
                  padding: '15px',
                  textAlign: 'center'
                }}>
                  <div style={{
                    width: '40px',
                    height: '40px',
                    background: `${stat.color}20`,
                    borderRadius: '10px',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    margin: '0 auto 10px',
                    color: stat.color
                  }}>
                    <i className={`fas ${stat.icon}`}></i>
                  </div>
                  <h3 style={{ fontSize: '20px', color: '#1E3A5F' }}>{stat.value}</h3>
                  <p style={{ fontSize: '12px', color: '#666' }}>{stat.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Right Column - Edit Form */}
          <div style={{ animation: 'slideInUp 0.7s ease-out' }}>
            <div style={{
              background: 'white',
              borderRadius: '16px',
              padding: '30px',
              boxShadow: '0 2px 12px rgba(0,0,0,0.08)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ color: '#1E3A5F', fontSize: '18px', fontWeight: '600' }}>
                  <i className="fas fa-edit" style={{ marginRight: '10px' }}></i>
                  Personal Information
                </h3>
                {!isEditing && (
                  <button
                    onClick={() => setIsEditing(true)}
                    style={{
                      padding: '8px 16px',
                      background: '#1E3A5F',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: 'pointer'
                    }}
                  >
                    <i className="fas fa-pen"></i> Edit
                  </button>
                )}
              </div>

              {isEditing ? (
                <form onSubmit={handleSubmit}>
                  <div className="input-group">
                    <label className="input-label">Full Name</label>
                    <input type="text" name="name" value={profileData.name} onChange={handleChange} className="input-field" style={{ paddingLeft: '1rem' }} required />
                  </div>
                  <div className="input-group">
                    <label className="input-label">Email</label>
                    <input type="email" name="email" value={profileData.email} onChange={handleChange} className="input-field" style={{ paddingLeft: '1rem' }} required />
                  </div>
                  <div className="input-group">
                    <label className="input-label">Phone</label>
                    <input type="tel" name="phone" value={profileData.phone} onChange={handleChange} className="input-field" style={{ paddingLeft: '1rem' }} />
                  </div>
                  <div className="input-group">
                    <label className="input-label">Department</label>
                    <select name="department" value={profileData.department} onChange={handleChange} className="input-field" style={{ paddingLeft: '1rem' }}>
                      <option value="">Select Department</option>
                      <option>Computer Science</option>
                      <option>Physics</option>
                      <option>Chemistry</option>
                      <option>Mathematics</option>
                      <option>Biology</option>
                    </select>
                  </div>
                  <div className="input-group">
                    <label className="input-label">Academic Year</label>
                    <select name="year" value={profileData.year} onChange={handleChange} className="input-field" style={{ paddingLeft: '1rem' }}>
                      <option value="">Select Year</option>
                      <option>1st Year</option>
                      <option>2nd Year</option>
                      <option>3rd Year</option>
                      <option>4th Year</option>
                    </select>
                  </div>
                  <div className="input-group">
                    <label className="input-label">GPA (out of 5.0)</label>
                    <input type="number" name="gpa" value={profileData.gpa} onChange={handleChange} step="0.1" min="0" max="5" className="input-field" style={{ paddingLeft: '1rem' }} />
                  </div>
                  <div className="input-group">
                    <label className="input-label">Bio</label>
                    <textarea name="bio" value={profileData.bio} onChange={handleChange} rows="3" className="input-field" style={{ paddingLeft: '1rem' }} placeholder="Tell us about yourself..." />
                  </div>
                  <div className="input-group">
                    <label className="input-label">LinkedIn</label>
                    <input type="text" name="linkedin" value={profileData.linkedin} onChange={handleChange} className="input-field" style={{ paddingLeft: '1rem' }} placeholder="linkedin.com/in/username" />
                  </div>
                  <div className="input-group">
                    <label className="input-label">GitHub</label>
                    <input type="text" name="github" value={profileData.github} onChange={handleChange} className="input-field" style={{ paddingLeft: '1rem' }} placeholder="github.com/username" />
                  </div>
                  <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                    <button type="button" onClick={() => setIsEditing(false)} className="btn btn-outline" style={{ flex: 1 }}>Cancel</button>
                    <button type="submit" disabled={loading} className="btn btn-primary" style={{ flex: 1 }}>{loading ? 'Saving...' : 'Save Changes'}</button>
                  </div>
                </form>
              ) : (
                <div>
                  <div style={{ padding: '10px 0', borderBottom: '1px solid #eee' }}><p style={{ color: '#999', fontSize: '12px' }}>Full Name</p><p style={{ fontWeight: '500' }}>{profileData.name || 'Not provided'}</p></div>
                  <div style={{ padding: '10px 0', borderBottom: '1px solid #eee' }}><p style={{ color: '#999', fontSize: '12px' }}>Email</p><p style={{ fontWeight: '500' }}>{profileData.email}</p></div>
                  <div style={{ padding: '10px 0', borderBottom: '1px solid #eee' }}><p style={{ color: '#999', fontSize: '12px' }}>Phone</p><p>{profileData.phone || 'Not provided'}</p></div>
                  <div style={{ padding: '10px 0', borderBottom: '1px solid #eee' }}><p style={{ color: '#999', fontSize: '12px' }}>Department</p><p>{profileData.department || 'Not provided'}</p></div>
                  <div style={{ padding: '10px 0', borderBottom: '1px solid #eee' }}><p style={{ color: '#999', fontSize: '12px' }}>Academic Year</p><p>{profileData.year || 'Not provided'}</p></div>
                  <div style={{ padding: '10px 0', borderBottom: '1px solid #eee' }}><p style={{ color: '#999', fontSize: '12px' }}>GPA</p><p>{profileData.gpa || 'Not provided'}</p></div>
                  <div style={{ padding: '10px 0', borderBottom: '1px solid #eee' }}><p style={{ color: '#999', fontSize: '12px' }}>Bio</p><p>{profileData.bio || 'No bio added'}</p></div>
                  {profileData.linkedin && <div style={{ padding: '10px 0', borderBottom: '1px solid #eee' }}><p style={{ color: '#999', fontSize: '12px' }}>LinkedIn</p><p><a href={`https://${profileData.linkedin}`} target="_blank" rel="noopener noreferrer" style={{ color: '#1E3A5F' }}>{profileData.linkedin}</a></p></div>}
                  {profileData.github && <div style={{ padding: '10px 0' }}><p style={{ color: '#999', fontSize: '12px' }}>GitHub</p><p><a href={`https://${profileData.github}`} target="_blank" rel="noopener noreferrer" style={{ color: '#1E3A5F' }}>{profileData.github}</a></p></div>}
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;