import React, { useState } from 'react';
import Navbar from '../../components/Navbar';
import { useAuth } from '../../context/AuthContext';
import { updateProfile } from '../../services/api';

const AdminProfile = () => {
  const { user, setUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || 'Admin User',
    email: user?.email || 'admin@cu.edu.eg',
    phone: user?.phone || '+20 123 456 789',
    department: user?.department || 'Administration'
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await updateProfile(formData);
      if (setUser) {
        setUser({ ...user, ...formData });
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
    { label: 'Total Users', value: '1,245', icon: 'fa-users', color: '#1E3A5F' },
    { label: 'Active Jobs', value: '82', icon: 'fa-briefcase', color: '#2a4a7a' },
    { label: 'Applications', value: '892', icon: 'fa-file-alt', color: '#3a6a9f' },
    { label: 'Placement Rate', value: '67%', icon: 'fa-chart-line', color: '#4a8ac4' }
  ];

  return (
    <div style={{ display: 'flex', background: '#f8fafc', minHeight: '100vh' }}>
      <Navbar />
      
      <div style={{ marginLeft: '280px', padding: '30px', width: 'calc(100% - 280px)' }}>
        {/* Header */}
        <div style={{ marginBottom: '30px', animation: 'slideInUp 0.5s ease-out' }}>
          <h1 style={{ fontSize: '28px', color: '#1E3A5F', fontWeight: '600', marginBottom: '5px' }}>
            Admin Profile
          </h1>
          <p style={{ color: '#666' }}>Manage your account and platform settings</p>
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
                  <div className="input-group">
                    <label className="input-label">Full Name</label>
                    <input
                      type="text"
                      name="name"
                      value={formData.name}
                      onChange={handleChange}
                      className="input-field"
                      style={{ paddingLeft: '1rem' }}
                      required
                    />
                  </div>
                  <div className="input-group">
                    <label className="input-label">Email</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleChange}
                      className="input-field"
                      style={{ paddingLeft: '1rem' }}
                      required
                    />
                  </div>
                  <div className="input-group">
                    <label className="input-label">Phone</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleChange}
                      className="input-field"
                      style={{ paddingLeft: '1rem' }}
                    />
                  </div>
                  <div className="input-group">
                    <label className="input-label">Department</label>
                    <input
                      type="text"
                      name="department"
                      value={formData.department}
                      onChange={handleChange}
                      className="input-field"
                      style={{ paddingLeft: '1rem' }}
                    />
                  </div>
                  <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="btn btn-outline"
                      style={{ flex: 1 }}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={loading}
                      className="btn btn-primary"
                      style={{ flex: 1 }}
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
        <div style={{ marginTop: '30px', animation: 'slideInUp 0.8s ease-out' }}>
          <h3 style={{ color: '#1E3A5F', marginBottom: '20px' }}>Platform Overview</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px' }}>
            {stats.map((stat, index) => (
              <div key={index} style={{
                background: 'white',
                borderRadius: '12px',
                padding: '20px',
                textAlign: 'center',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
              }}>
                <div style={{
                  width: '50px',
                  height: '50px',
                  background: `${stat.color}20`,
                  borderRadius: '12px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 15px',
                  color: stat.color,
                  fontSize: '24px'
                }}>
                  <i className={`fas ${stat.icon}`}></i>
                </div>
                <h3 style={{ fontSize: '24px', color: '#1E3A5F', marginBottom: '5px' }}>{stat.value}</h3>
                <p style={{ color: '#666', fontSize: '13px' }}>{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminProfile;