// D:\student-jobs-portal\Frontend\src\pages\admin\AdminProfile.jsx
import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import { useAuth } from '../../context/AuthContext';
import { updateProfile, getProfile, getPlatformStats } from '../../services/api';

const AdminProfile = () => {
  const { user, setUser, loading: authLoading } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [stats, setStats] = useState({
    totalUsers: 0,
    activeJobs: 0,
    totalApplications: 0,
    placementRate: 0
  });
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    department: '',
    university: '',
    faculty: ''
  });

  // تحميل بيانات المستخدم من الباكند
  const fetchUserProfile = async () => {
    try {
      const response = await getProfile();
      console.log('Profile response:', response);
      
      let userData = response.data?.data || response.data || {};
      
      setFormData({
        name: userData.name || userData.displayName || 'Admin User',
        email: userData.email || '',
        phone: userData.phone || '',
        department: userData.department || 'Administration',
        university: userData.university || '',
        faculty: userData.faculty || ''
      });
      
      // تحديث user context لو موجود
      if (setUser && userData) {
        setUser(prev => ({ ...prev, ...userData }));
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
      // استخدام البيانات من context لو فشل الجلب
      if (user) {
        setFormData({
          name: user.name || user.displayName || 'Admin User',
          email: user.email || '',
          phone: user.phone || '',
          department: user.department || 'Administration',
          university: user.university || '',
          faculty: user.faculty || ''
        });
      }
    }
  };

  // تحميل إحصائيات المنصة
  const fetchStats = async () => {
    try {
      const response = await getPlatformStats();
      const statsData = response.data?.data || response.data || {};
      setStats({
        totalUsers: statsData.totalEmployers + statsData.totalStudents || 0,
        activeJobs: statsData.activeJobs || 0,
        totalApplications: statsData.totalApplications || 0,
        placementRate: statsData.placementRate || 0
      });
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  useEffect(() => {
    if (!authLoading) {
      fetchUserProfile();
      fetchStats();
    }
  }, [authLoading]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage('');
    
    try {
      // إرسال البيانات للتحديث - بدون uid لأنها بتاعة المستخدم الحالي
      const response = await updateProfile(formData);
      console.log('Update response:', response);
      
      if (response.data?.success || response.status === 200) {
        // تحديث user context
        if (setUser) {
          setUser(prev => ({ ...prev, ...formData }));
        }
        
        setMessage('✅ Profile updated successfully!');
        setIsEditing(false);
        
        // إعادة تحميل البيانات
        await fetchUserProfile();
        
        setTimeout(() => setMessage(''), 3000);
      } else {
        throw new Error(response.data?.message || 'Update failed');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      setMessage('❌ Failed to update profile: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  if (authLoading) {
    return (
      <div style={{ display: 'flex', background: '#f8fafc', minHeight: '100vh' }}>
        <Navbar />
        <div style={{ flex: 1, padding: '30px' }}>
          <div style={{ margin: '100px auto', textAlign: 'center' }}>
            <div className="spinner"></div>
            <p>Loading profile...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', background: '#f8fafc', minHeight: '100vh' }}>
      <Navbar />
      
      <div style={{ flex: 1, padding: '30px', minWidth: 0, overflowX: 'hidden' }}>
        {/* Header */}
        <div style={{ marginBottom: '30px' }}>
          <h1 style={{ fontSize: '28px', color: '#1E3A5F', fontWeight: '600', marginBottom: '5px' }}>
            Admin Profile
          </h1>
          <p style={{ color: '#666' }}>Manage your account and platform settings</p>
        </div>

        {/* Message Alert */}
        {message && (
          <div style={{
            background: message.includes('✅') ? '#d4edda' : '#f8d7da',
            color: message.includes('✅') ? '#155724' : '#721c24',
            padding: '12px 20px',
            borderRadius: '8px',
            marginBottom: '20px'
          }}>
            {message}
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '30px' }}>
          {/* Left Column - Profile Card */}
          <div>
            <div style={{
              background: 'white',
              borderRadius: '16px',
              padding: '30px',
              textAlign: 'center',
              boxShadow: '0 2px 12px rgba(0,0,0,0.08)'
            }}>
              <div style={{
                width: '120px',
                height: '120px',
                background: 'linear-gradient(135deg, #1E3A5F 0%, #2a4a7a 100%)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 20px',
                fontSize: '48px',
                color: 'white'
              }}>
                <i className="fas fa-user-shield"></i>
              </div>
              <h2 style={{ color: '#1E3A5F', marginBottom: '5px' }}>{formData.name}</h2>
              <p style={{ color: '#666', marginBottom: '5px' }}>{formData.email}</p>
              <span style={{
                display: 'inline-block',
                background: '#1E3A5F',
                color: 'white',
                padding: '4px 12px',
                borderRadius: '20px',
                fontSize: '12px',
                fontWeight: '600'
              }}>
                Administrator
              </span>
            </div>
          </div>

          {/* Right Column - Edit Form */}
          <div>
            <div style={{
              background: 'white',
              borderRadius: '16px',
              padding: '30px',
              boxShadow: '0 2px 12px rgba(0,0,0,0.08)'
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                <h3 style={{ color: '#1E3A5F', fontSize: '18px', fontWeight: '600' }}>
                  <i className="fas fa-edit" style={{ marginRight: '10px' }}></i>
                  Profile Information
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
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', color: '#333', fontSize: '14px', fontWeight: '500' }}>
                      Full Name
                    </label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '1px solid #ddd',
                        borderRadius: '8px',
                        fontSize: '14px'
                      }}
                      required
                    />
                  </div>
                  
                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', color: '#333', fontSize: '14px', fontWeight: '500' }}>
                      Email
                    </label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '1px solid #ddd',
                        borderRadius: '8px',
                        fontSize: '14px',
                        background: '#f5f5f5'
                      }}
                      disabled
                    />
                    <small style={{ color: '#999', fontSize: '12px' }}>Email cannot be changed</small>
                  </div>

                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', color: '#333', fontSize: '14px', fontWeight: '500' }}>
                      Phone
                    </label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '1px solid #ddd',
                        borderRadius: '8px',
                        fontSize: '14px'
                      }}
                      placeholder="+20 XXX XXX XXX"
                    />
                  </div>

                  <div style={{ marginBottom: '20px' }}>
                    <label style={{ display: 'block', marginBottom: '8px', color: '#333', fontSize: '14px', fontWeight: '500' }}>
                      Department
                    </label>
                    <input
                      type="text"
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      style={{
                        width: '100%',
                        padding: '10px 12px',
                        border: '1px solid #ddd',
                        borderRadius: '8px',
                        fontSize: '14px'
                      }}
                    />
                  </div>

                  <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      style={{
                        flex: 1,
                        padding: '10px',
                        background: '#f5f5f5',
                        border: '1px solid #ddd',
                        borderRadius: '8px',
                        cursor: 'pointer'
                      }}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      style={{
                        flex: 1,
                        padding: '10px',
                        background: '#1E3A5F',
                        color: 'white',
                        border: 'none',
                        borderRadius: '8px',
                        cursor: loading ? 'not-allowed' : 'pointer',
                        opacity: loading ? 0.7 : 1
                      }}
                    >
                      {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                  </div>
                </form>
              ) : (
                <div>
                  <div style={{ marginBottom: '15px', padding: '10px 0', borderBottom: '1px solid #eee' }}>
                    <p style={{ color: '#999', fontSize: '12px', marginBottom: '5px' }}>Full Name</p>
                    <p style={{ color: '#333', fontWeight: '500' }}>{formData.name}</p>
                  </div>
                  <div style={{ marginBottom: '15px', padding: '10px 0', borderBottom: '1px solid #eee' }}>
                    <p style={{ color: '#999', fontSize: '12px', marginBottom: '5px' }}>Email</p>
                    <p style={{ color: '#333', fontWeight: '500' }}>{formData.email}</p>
                  </div>
                  <div style={{ marginBottom: '15px', padding: '10px 0', borderBottom: '1px solid #eee' }}>
                    <p style={{ color: '#999', fontSize: '12px', marginBottom: '5px' }}>Phone</p>
                    <p style={{ color: '#333', fontWeight: '500' }}>{formData.phone || 'Not provided'}</p>
                  </div>
                  <div style={{ marginBottom: '15px', padding: '10px 0', borderBottom: '1px solid #eee' }}>
                    <p style={{ color: '#999', fontSize: '12px', marginBottom: '5px' }}>Department</p>
                    <p style={{ color: '#333', fontWeight: '500' }}>{formData.department}</p>
                  </div>
                  <div style={{ marginBottom: '15px', padding: '10px 0', borderBottom: '1px solid #eee' }}>
                    <p style={{ color: '#999', fontSize: '12px', marginBottom: '5px' }}>Role</p>
                    <p style={{ color: '#1E3A5F', fontWeight: '600' }}>Administrator</p>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div style={{ marginTop: '30px' }}>
          <h3 style={{ color: '#1E3A5F', marginBottom: '20px' }}>Platform Overview</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
            <div style={{
              background: 'white',
              borderRadius: '12px',
              padding: '20px',
              textAlign: 'center',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
            }}>
              <div style={{
                width: '50px',
                height: '50px',
                background: '#1E3A5F20',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 15px',
                color: '#1E3A5F',
                fontSize: '24px'
              }}>
                <i className="fas fa-users"></i>
              </div>
              <h3 style={{ fontSize: '24px', color: '#1E3A5F', marginBottom: '5px' }}>{stats.totalUsers}</h3>
              <p style={{ color: '#666', fontSize: '13px' }}>Total Users</p>
            </div>
            
            <div style={{
              background: 'white',
              borderRadius: '12px',
              padding: '20px',
              textAlign: 'center',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
            }}>
              <div style={{
                width: '50px',
                height: '50px',
                background: '#2a4a7a20',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 15px',
                color: '#2a4a7a',
                fontSize: '24px'
              }}>
                <i className="fas fa-briefcase"></i>
              </div>
              <h3 style={{ fontSize: '24px', color: '#1E3A5F', marginBottom: '5px' }}>{stats.activeJobs}</h3>
              <p style={{ color: '#666', fontSize: '13px' }}>Active Jobs</p>
            </div>
            
            <div style={{
              background: 'white',
              borderRadius: '12px',
              padding: '20px',
              textAlign: 'center',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
            }}>
              <div style={{
                width: '50px',
                height: '50px',
                background: '#3a6a9f20',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 15px',
                color: '#3a6a9f',
                fontSize: '24px'
              }}>
                <i className="fas fa-file-alt"></i>
              </div>
              <h3 style={{ fontSize: '24px', color: '#1E3A5F', marginBottom: '5px' }}>{stats.totalApplications}</h3>
              <p style={{ color: '#666', fontSize: '13px' }}>Applications</p>
            </div>
            
            <div style={{
              background: 'white',
              borderRadius: '12px',
              padding: '20px',
              textAlign: 'center',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
            }}>
              <div style={{
                width: '50px',
                height: '50px',
                background: '#4a8ac420',
                borderRadius: '12px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 15px',
                color: '#4a8ac4',
                fontSize: '24px'
              }}>
                <i className="fas fa-chart-line"></i>
              </div>
              <h3 style={{ fontSize: '24px', color: '#1E3A5F', marginBottom: '5px' }}>{stats.placementRate}%</h3>
              <p style={{ color: '#666', fontSize: '13px' }}>Placement Rate</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;