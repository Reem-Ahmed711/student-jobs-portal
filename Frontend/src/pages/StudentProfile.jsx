// src/pages/StudentProfile.jsx
import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { getProfile, updateProfile, uploadCV, uploadProfileImage, deleteProfileImage } from '../services/api';
import LoadingSpinner from '../components/LoadingSpinner';
import { useTheme } from '../context/ThemeContext';

const StudentProfile = () => {
  const { user, setUser, updateUser } = useAuth();
  const { darkMode } = useTheme();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [formData, setFormData] = useState({
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

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        const response = await getProfile();
        console.log('📦 Profile response:', response.data);
        
        let data = response.data;
        if (response.data?.data) data = response.data.data;
        if (response.data?.user) data = response.data.user;
        
        if (data && typeof data === 'object') {
          setProfileData(data);
          setFormData({
            name: data.name || '',
            email: data.email || '',
            phone: data.phone || '',
            bio: data.bio || '',
            department: data.department || '',
            year: data.year || '',
            gpa: data.gpa || '',
            skills: data.skills || []
          });
        }
      } catch (error) {
        console.error('Error fetching profile:', error);
        if (user) {
          setProfileData(user);
          setFormData({
            name: user.name || '',
            email: user.email || '',
            phone: user.phone || '',
            bio: user.bio || '',
            department: user.department || '',
            year: user.year || '',
            gpa: user.gpa || '',
            skills: user.skills || []
          });
        }
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const addSkill = () => {
    if (newSkill && !formData.skills.includes(newSkill)) {
      setFormData(prev => ({ ...prev, skills: [...prev.skills, newSkill] }));
      setNewSkill('');
    }
  };

  const removeSkill = (skill) => {
    setFormData(prev => ({ ...prev, skills: prev.skills.filter(s => s !== skill) }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await updateProfile(formData);
      if (response.data?.success) {
        setProfileData(formData);
        if (setUser) {
          setUser({ ...user, ...formData });
        }
        if (updateUser) {
          updateUser(formData);
        }
        setIsEditing(false);
        alert('✅ Profile updated successfully!');
      } else {
        alert('❌ Failed to update profile');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('❌ Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file (jpg, png, gif)');
      return;
    }
    
    if (file.size > 5 * 1024 * 1024) {
      alert('Image size must be less than 5MB');
      return;
    }
    
    setUploadingImage(true);
    try {
      const response = await uploadProfileImage(file);
      console.log('Image upload response:', response.data);
      
      if (response.data?.success) {
        const imageUrl = response.data.url;
        
        // Update local state
        setProfileData(prev => ({ ...prev, profileImage: imageUrl }));
        
        // Update user context
        if (setUser) {
          setUser({ ...user, profileImage: imageUrl });
        }
        
        alert('✅ Profile image updated successfully!');
      } else {
        alert('❌ Failed to upload image');
      }
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('❌ Failed to upload image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleRemoveImage = async () => {
    if (!window.confirm('Are you sure you want to remove your profile image?')) return;
    
    setUploadingImage(true);
    try {
      const response = await deleteProfileImage();
      if (response.data?.success) {
        setProfileData(prev => ({ ...prev, profileImage: '' }));
        if (setUser) {
          setUser({ ...user, profileImage: '' });
        }
        alert('✅ Profile image removed');
      } else {
        alert('❌ Failed to remove image');
      }
    } catch (error) {
      console.error('Error removing image:', error);
      alert('❌ Failed to remove image');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleCVUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || file.type !== 'application/pdf') {
      alert('Please upload a PDF file');
      return;
    }
    
    setUploading(true);
    try {
      const response = await uploadCV(file);
      console.log('CV Upload response:', response.data);
      
      let cvData = response.data;
      if (response.data?.data) cvData = response.data.data;
      
      if (cvData) {
        const updatedFormData = { ...formData };
        
        if (cvData.name && !updatedFormData.name) updatedFormData.name = cvData.name;
        if (cvData.email && !updatedFormData.email) updatedFormData.email = cvData.email;
        if (cvData.phone && !updatedFormData.phone) updatedFormData.phone = cvData.phone;
        if (cvData.skills && cvData.skills.length > 0) {
          updatedFormData.skills = [...new Set([...updatedFormData.skills, ...cvData.skills])];
        }
        if (cvData.gpa && !updatedFormData.gpa) updatedFormData.gpa = cvData.gpa;
        if (cvData.university && !updatedFormData.department) updatedFormData.department = cvData.university;
        
        setFormData(updatedFormData);
        alert('✅ CV data extracted! Review and save your changes.');
      }
    } catch (error) {
      console.error('Error uploading CV:', error);
      alert('❌ Failed to extract CV data');
    } finally {
      setUploading(false);
    }
  };

  const safeData = profileData || user || {};
  const departments = ['Computer Science', 'Physics', 'Chemistry', 'Mathematics', 'Biology', 'Geology'];
  const years = ['1st Year', '2nd Year', '3rd Year', '4th Year', 'Graduate'];

  if (loading && !profileData) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '400px' }}>
        <LoadingSpinner size="large" />
      </div>
    );
  }

  return (
    <div>
      {/* Header with CV Upload Button */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        marginBottom: '30px', 
        flexWrap: 'wrap', 
        gap: '15px' 
      }}>
        <div>
          <h1 style={{ fontSize: '28px', color: darkMode ? '#f1f5f9' : '#1E3A5F', fontWeight: '600', marginBottom: '5px' }}>
            My Profile
          </h1>
          <p style={{ color: darkMode ? '#94a3b8' : '#666' }}>View and manage your personal information</p>
        </div>
        
        <div style={{ display: 'flex', gap: '10px' }}>
          <label style={{
            padding: '10px 20px',
            background: '#1E3A5F',
            color: 'white',
            borderRadius: '8px',
            cursor: uploading ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            opacity: uploading ? 0.7 : 1
          }}>
            <i className="fas fa-cloud-upload-alt"></i>
            {uploading ? 'Processing...' : 'Upload CV'}
            <input 
              type="file" 
              accept=".pdf" 
              onChange={handleCVUpload} 
              style={{ display: 'none' }} 
              disabled={uploading}
            />
          </label>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '30px' }}>
        {/* Left Column - Profile Image Card */}
        <div>
          <div style={{ 
            background: darkMode ? '#1e293b' : 'white', 
            borderRadius: '16px', 
            padding: '30px', 
            textAlign: 'center', 
            boxShadow: '0 2px 12px rgba(0,0,0,0.08)' 
          }}>
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <div style={{
                width: '150px',
                height: '150px',
                background: safeData.profileImage ? 'none' : 'linear-gradient(135deg, #1E3A5F 0%, #2a4a7a 100%)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
                fontSize: '48px',
                color: 'white',
                overflow: 'hidden',
                border: `4px solid ${darkMode ? '#334155' : '#E6F0FA'}`
              }}>
                {safeData.profileImage ? (
                  <img 
                    src={safeData.profileImage} 
                    alt="profile" 
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
                  />
                ) : (
                  <i className="fas fa-user-graduate"></i>
                )}
              </div>
              
              {/* Image upload buttons */}
              <label style={{
                position: 'absolute',
                bottom: '10px',
                right: '10px',
                width: '36px',
                height: '36px',
                background: '#1E3A5F',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                cursor: 'pointer',
                border: '2px solid white'
              }}>
                <i className="fas fa-camera"></i>
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handleImageUpload} 
                  style={{ display: 'none' }} 
                  disabled={uploadingImage}
                />
              </label>
              
              {safeData.profileImage && (
                <button
                  onClick={handleRemoveImage}
                  style={{
                    position: 'absolute',
                    bottom: '10px',
                    left: '10px',
                    width: '36px',
                    height: '36px',
                    background: '#ef4444',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    cursor: 'pointer',
                    border: '2px solid white'
                  }}
                >
                  <i className="fas fa-trash"></i>
                </button>
              )}
            </div>
            
            <h2 style={{ color: darkMode ? '#f1f5f9' : '#1E3A5F' }}>{safeData.name || 'Student'}</h2>
            <p style={{ color: darkMode ? '#94a3b8' : '#666', marginBottom: '5px' }}>{safeData.email || ''}</p>
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
            <div style={{ 
              background: darkMode ? '#1e293b' : 'white', 
              borderRadius: '12px', 
              padding: '15px', 
              textAlign: 'center' 
            }}>
              <div style={{ width: '40px', height: '40px', background: '#E6F0FA', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px', color: '#1E3A5F' }}>
                <i className="fas fa-file-alt"></i>
              </div>
              <h3 style={{ fontSize: '20px', color: darkMode ? '#f1f5f9' : '#1E3A5F' }}>{safeData.totalApplications || '0'}</h3>
              <p style={{ fontSize: '12px', color: darkMode ? '#94a3b8' : '#666' }}>Applications</p>
            </div>
            <div style={{ 
              background: darkMode ? '#1e293b' : 'white', 
              borderRadius: '12px', 
              padding: '15px', 
              textAlign: 'center' 
            }}>
              <div style={{ width: '40px', height: '40px', background: '#E6F0FA', borderRadius: '10px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px', color: '#1E3A5F' }}>
                <i className="fas fa-calendar-check"></i>
              </div>
              <h3 style={{ fontSize: '20px', color: darkMode ? '#f1f5f9' : '#1E3A5F' }}>{safeData.interviews || '0'}</h3>
              <p style={{ fontSize: '12px', color: darkMode ? '#94a3b8' : '#666' }}>Interviews</p>
            </div>
          </div>
        </div>

        {/* Right Column - Edit Form */}
        <div style={{ 
          background: darkMode ? '#1e293b' : 'white', 
          borderRadius: '16px', 
          padding: '30px', 
          boxShadow: '0 2px 12px rgba(0,0,0,0.08)' 
        }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', flexWrap: 'wrap', gap: '10px' }}>
            <h3 style={{ color: darkMode ? '#f1f5f9' : '#1E3A5F', fontSize: '18px', fontWeight: '600' }}>
              <i className="fas fa-address-card" style={{ marginRight: '10px' }}></i>
              Personal Information
            </h3>
            {!isEditing && (
              <button onClick={() => setIsEditing(true)} className="btn btn-outline" style={{ padding: '8px 16px' }}>
                <i className="fas fa-edit"></i> Edit Profile
              </button>
            )}
          </div>

          {isEditing ? (
            // Edit Mode
            <div>
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', color: darkMode ? '#94a3b8' : '#666', fontSize: '13px' }}>Full Name</label>
                <input 
                  type="text" 
                  name="name" 
                  value={formData.name} 
                  onChange={handleChange} 
                  style={{ 
                    width: '100%', 
                    padding: '10px', 
                    border: `1px solid ${darkMode ? '#475569' : '#ddd'}`, 
                    borderRadius: '8px',
                    background: darkMode ? '#0f172a' : 'white',
                    color: darkMode ? '#e2e8f0' : '#333'
                  }} 
                />
              </div>
              
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', color: darkMode ? '#94a3b8' : '#666', fontSize: '13px' }}>Email</label>
                <input 
                  type="email" 
                  name="email" 
                  value={formData.email} 
                  onChange={handleChange} 
                  disabled
                  style={{ 
                    width: '100%', 
                    padding: '10px', 
                    border: `1px solid ${darkMode ? '#475569' : '#ddd'}`, 
                    borderRadius: '8px',
                    background: darkMode ? '#1e293b' : '#f5f5f5',
                    color: darkMode ? '#94a3b8' : '#999',
                    cursor: 'not-allowed'
                  }} 
                />
              </div>
              
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', color: darkMode ? '#94a3b8' : '#666', fontSize: '13px' }}>Phone</label>
                <input 
                  type="tel" 
                  name="phone" 
                  value={formData.phone} 
                  onChange={handleChange} 
                  placeholder="+20 123 456 7890"
                  style={{ 
                    width: '100%', 
                    padding: '10px', 
                    border: `1px solid ${darkMode ? '#475569' : '#ddd'}`, 
                    borderRadius: '8px',
                    background: darkMode ? '#0f172a' : 'white',
                    color: darkMode ? '#e2e8f0' : '#333'
                  }} 
                />
              </div>
              
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', color: darkMode ? '#94a3b8' : '#666', fontSize: '13px' }}>Department</label>
                <select 
                  name="department" 
                  value={formData.department} 
                  onChange={handleChange}
                  style={{ 
                    width: '100%', 
                    padding: '10px', 
                    border: `1px solid ${darkMode ? '#475569' : '#ddd'}`, 
                    borderRadius: '8px',
                    background: darkMode ? '#0f172a' : 'white',
                    color: darkMode ? '#e2e8f0' : '#333'
                  }}
                >
                  <option value="">Select Department</option>
                  {departments.map(dept => (
                    <option key={dept} value={dept}>{dept}</option>
                  ))}
                </select>
              </div>
              
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', color: darkMode ? '#94a3b8' : '#666', fontSize: '13px' }}>Academic Year</label>
                <select 
                  name="year" 
                  value={formData.year} 
                  onChange={handleChange}
                  style={{ 
                    width: '100%', 
                    padding: '10px', 
                    border: `1px solid ${darkMode ? '#475569' : '#ddd'}`, 
                    borderRadius: '8px',
                    background: darkMode ? '#0f172a' : 'white',
                    color: darkMode ? '#e2e8f0' : '#333'
                  }}
                >
                  <option value="">Select Year</option>
                  {years.map(year => (
                    <option key={year} value={year}>{year}</option>
                  ))}
                </select>
              </div>
              
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', color: darkMode ? '#94a3b8' : '#666', fontSize: '13px' }}>GPA (out of 5.0)</label>
                <input 
                  type="number" 
                  name="gpa" 
                  value={formData.gpa} 
                  onChange={handleChange} 
                  step="0.01" 
                  min="0" 
                  max="5"
                  style={{ 
                    width: '100%', 
                    padding: '10px', 
                    border: `1px solid ${darkMode ? '#475569' : '#ddd'}`, 
                    borderRadius: '8px',
                    background: darkMode ? '#0f172a' : 'white',
                    color: darkMode ? '#e2e8f0' : '#333'
                  }} 
                />
              </div>
              
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', color: darkMode ? '#94a3b8' : '#666', fontSize: '13px' }}>Bio</label>
                <textarea 
                  name="bio" 
                  value={formData.bio} 
                  onChange={handleChange} 
                  rows="3" 
                  placeholder="Tell us about yourself..."
                  style={{ 
                    width: '100%', 
                    padding: '10px', 
                    border: `1px solid ${darkMode ? '#475569' : '#ddd'}`, 
                    borderRadius: '8px',
                    resize: 'vertical',
                    background: darkMode ? '#0f172a' : 'white',
                    color: darkMode ? '#e2e8f0' : '#333'
                  }} 
                />
              </div>
              
              <div style={{ marginBottom: '15px' }}>
                <label style={{ display: 'block', marginBottom: '5px', color: darkMode ? '#94a3b8' : '#666', fontSize: '13px' }}>Skills</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '10px' }}>
                  {formData.skills.map((skill, i) => (
                    <span key={i} style={{ background: '#E6F0FA', padding: '4px 12px', borderRadius: '20px', display: 'flex', alignItems: 'center', gap: '6px', color: '#1E3A5F' }}>
                      {skill}
                      <button onClick={() => removeSkill(skill)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#1E3A5F', fontSize: '16px' }}>×</button>
                    </span>
                  ))}
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  <input 
                    type="text" 
                    value={newSkill} 
                    onChange={(e) => setNewSkill(e.target.value)} 
                    placeholder="Add skill..." 
                    style={{ 
                      flex: 1, 
                      padding: '10px', 
                      border: `1px solid ${darkMode ? '#475569' : '#ddd'}`, 
                      borderRadius: '8px',
                      background: darkMode ? '#0f172a' : 'white',
                      color: darkMode ? '#e2e8f0' : '#333'
                    }} 
                  />
                  <button onClick={addSkill} className="btn btn-outline" style={{ padding: '10px 20px' }}>Add</button>
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <button onClick={() => setIsEditing(false)} className="btn btn-outline" style={{ flex: 1, padding: '12px' }}>Cancel</button>
                <button onClick={handleSave} disabled={loading} className="btn btn-primary" style={{ flex: 1, padding: '12px' }}>
                  {loading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </div>
          ) : (
            // View Mode
            <div>
              <div><p style={{ color: darkMode ? '#94a3b8' : '#999', fontSize: '12px', marginBottom: '4px' }}>Full Name</p><p style={{ marginBottom: '16px', fontWeight: '500', color: darkMode ? '#e2e8f0' : '#333' }}>{safeData.name || 'Not provided'}</p></div>
              <div><p style={{ color: darkMode ? '#94a3b8' : '#999', fontSize: '12px', marginBottom: '4px' }}>Email</p><p style={{ marginBottom: '16px', color: darkMode ? '#e2e8f0' : '#333' }}>{safeData.email || 'Not provided'}</p></div>
              <div><p style={{ color: darkMode ? '#94a3b8' : '#999', fontSize: '12px', marginBottom: '4px' }}>Phone</p><p style={{ marginBottom: '16px', color: darkMode ? '#e2e8f0' : '#333' }}>{safeData.phone || 'Not provided'}</p></div>
              <div><p style={{ color: darkMode ? '#94a3b8' : '#999', fontSize: '12px', marginBottom: '4px' }}>Department</p><p style={{ marginBottom: '16px', color: darkMode ? '#e2e8f0' : '#333' }}>{safeData.department || 'Not provided'}</p></div>
              <div><p style={{ color: darkMode ? '#94a3b8' : '#999', fontSize: '12px', marginBottom: '4px' }}>Academic Year</p><p style={{ marginBottom: '16px', color: darkMode ? '#e2e8f0' : '#333' }}>{safeData.year || 'Not provided'}</p></div>
              <div><p style={{ color: darkMode ? '#94a3b8' : '#999', fontSize: '12px', marginBottom: '4px' }}>GPA</p><p style={{ marginBottom: '16px', color: darkMode ? '#e2e8f0' : '#333' }}>{safeData.gpa || 'Not provided'}</p></div>
              <div><p style={{ color: darkMode ? '#94a3b8' : '#999', fontSize: '12px', marginBottom: '4px' }}>Bio</p><p style={{ marginBottom: '16px', color: darkMode ? '#e2e8f0' : '#333' }}>{safeData.bio || 'No bio added'}</p></div>
              {safeData.skills && safeData.skills.length > 0 && (
                <div>
                  <p style={{ color: darkMode ? '#94a3b8' : '#999', fontSize: '12px', marginBottom: '8px' }}>Skills</p>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                    {safeData.skills.map((s, i) => (
                      <span key={i} className="skill-tag" style={{ background: '#E6F0FA', padding: '6px 14px', borderRadius: '20px', fontSize: '13px', color: '#1E3A5F' }}>{s}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentProfile;
