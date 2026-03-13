import React from 'react';
import Navbar from '../../components/Navbar';
import { useAuth } from '../../context/AuthContext';

const AdminProfile = () => {
  const { user } = useAuth();

  return (
    <div style={{ display: 'flex', background: '#f8fafc', minHeight: '100vh' }}>
      <Navbar />
      
      <div style={{ marginLeft: '280px', padding: '30px', width: 'calc(100% - 280px)' }}>
        <h1 style={{ fontSize: '28px', color: '#0B2A4A', marginBottom: '20px' }}>
          Admin Profile
        </h1>
        <p>Welcome, {user?.name || 'Admin'}!</p>
      </div>
    </div>
  );
};

export default AdminProfile;
