import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import { getAllUsers, updateUserRole, deleteUser } from '../../services/api';

const AdminManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await getAllUsers();
      setUsers(response.data || []);
      setFilteredUsers(response.data || []);
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let result = [...users];
    
    if (searchTerm) {
      result = result.filter(user => 
        user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (roleFilter !== 'all') {
      result = result.filter(user => user.role === roleFilter);
    }
    
    setFilteredUsers(result);
    setCurrentPage(1);
  }, [searchTerm, roleFilter, users]);

  const handleUpdateRole = async (userId, newRole) => {
    try {
      await updateUserRole(userId, newRole);
      setUsers(users.map(user => 
        user.id === userId ? { ...user, role: newRole } : user
      ));
      alert(` User role updated to ${newRole}`);
    } catch (error) {
      console.error('Error updating role:', error);
      alert(' Failed to update user role');
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    if (window.confirm(`Are you sure you want to delete ${userName}?`)) {
      try {
        await deleteUser(userId);
        setUsers(users.filter(user => user.id !== userId));
        alert(' User deleted successfully');
      } catch (error) {
        console.error('Error deleting user:', error);
        alert(' Failed to delete user');
      }
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const getRoleBadgeStyle = (role) => {
    switch(role) {
      case 'admin': return { background: '#ef4444', color: 'white' };
      case 'employer': return { background: '#3b82f6', color: 'white' };
      default: return { background: '#10b981', color: 'white' };
    }
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', background: '#f8fafc', minHeight: '100vh' }}>
        <Navbar />
        <div style={{ marginLeft: '280px', padding: '30px', width: 'calc(100% - 280px)' }}>
          <div className="spinner" style={{ margin: '100px auto' }}></div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', background: '#f8fafc', minHeight: '100vh' }}>
      <Navbar />
      <div style={{ marginLeft: '280px', padding: '30px', width: 'calc(100% - 280px)' }}>
        {/* Header */}
        <div style={{ marginBottom: '30px', animation: 'slideInUp 0.5s ease-out' }}>
          <h1 style={{ fontSize: '28px', color: '#1E3A5F', fontWeight: '600', marginBottom: '5px' }}>
            Manage Users
          </h1>
          <p style={{ color: '#666' }}>View, manage, and control user access</p>
        </div>

        {/* Search and Filter Bar */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '20px',
          display: 'flex',
          gap: '20px',
          alignItems: 'center',
          flexWrap: 'wrap',
          animation: 'slideInUp 0.6s ease-out'
        }}>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '10px', background: '#f5f5f5', padding: '8px 16px', borderRadius: '8px' }}>
            <i className="fas fa-search" style={{ color: '#999' }}></i>
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent' }}
            />
          </div>
          
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            style={{ padding: '8px 16px', border: '1px solid #ddd', borderRadius: '8px', background: 'white' }}
          >
            <option value="all">All Roles</option>
            <option value="student">Students</option>
            <option value="employer">Employers</option>
            <option value="admin">Admins</option>
          </select>
          
          <button
            onClick={fetchUsers}
            style={{ padding: '8px 16px', background: '#1E3A5F', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
          >
            <i className="fas fa-sync-alt"></i> Refresh
          </button>
        </div>

        {/* Users Table */}
        <div className="table-container" style={{ animation: 'slideInUp 0.7s ease-out' }}>
          <table className="table">
            <thead>
              <tr>
                <th>User</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentUsers.map(user => (
                <tr key={user.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <div style={{
                        width: '32px',
                        height: '32px',
                        background: '#E6F0FA',
                        borderRadius: '50%',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '14px',
                        color: '#1E3A5F'
                      }}>
                        {user.name?.charAt(0) || 'U'}
                      </div>
                      <span style={{ fontWeight: '500' }}>{user.name}</span>
                    </div>
                  </td>
                   <td style={{ color: '#666' }}>{user.email}</td>
                   <td>
                    <select
                      value={user.role}
                      onChange={(e) => handleUpdateRole(user.id, e.target.value)}
                      style={{
                        padding: '4px 8px',
                        borderRadius: '6px',
                        border: '1px solid #ddd',
                        background: getRoleBadgeStyle(user.role).background,
                        color: 'white',
                        fontWeight: '500',
                        cursor: 'pointer'
                      }}
                    >
                      <option value="student" style={{ background: 'white', color: '#333' }}>Student</option>
                      <option value="employer" style={{ background: 'white', color: '#333' }}>Employer</option>
                      <option value="admin" style={{ background: 'white', color: '#333' }}>Admin</option>
                    </select>
                   </td>
                   <td>
                    <span className={`badge badge-${user.status === 'active' ? 'success' : 'warning'}`}>
                      {user.status || 'active'}
                    </span>
                   </td>
                   <td>
                    <button
                      onClick={() => handleUpdateRole(user.id, user.role === 'admin' ? 'student' : 'admin')}
                      className="btn btn-primary"
                      style={{ padding: '6px 12px', fontSize: '12px', marginRight: '8px' }}
                    >
                      <i className="fas fa-exchange-alt"></i> Toggle Role
                    </button>
                    <button
                      onClick={() => handleDeleteUser(user.id, user.name)}
                      className="btn btn-danger"
                      style={{ padding: '6px 12px', fontSize: '12px' }}
                    >
                      <i className="fas fa-trash"></i> Delete
                    </button>
                   </td>
                 </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '20px' }}>
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p-1))}
              disabled={currentPage === 1}
              style={{ padding: '8px 12px', background: 'white', border: '1px solid #ddd', borderRadius: '6px', cursor: currentPage === 1 ? 'not-allowed' : 'pointer', opacity: currentPage === 1 ? 0.5 : 1 }}
            >
              Previous
            </button>
            <span style={{ padding: '8px 12px', background: '#1E3A5F', color: 'white', borderRadius: '6px' }}>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p+1))}
              disabled={currentPage === totalPages}
              style={{ padding: '8px 12px', background: 'white', border: '1px solid #ddd', borderRadius: '6px', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer', opacity: currentPage === totalPages ? 0.5 : 1 }}
            >
              Next
            </button>
          </div>
        )}

        {/* Summary */}
        <div style={{ marginTop: '20px', padding: '15px', background: 'white', borderRadius: '8px', textAlign: 'center' }}>
          <p style={{ color: '#666' }}>
            Total Users: <strong>{users.length}</strong> | 
            Students: <strong>{users.filter(u => u.role === 'student').length}</strong> |
            Employers: <strong>{users.filter(u => u.role === 'employer').length}</strong> |
            Admins: <strong>{users.filter(u => u.role === 'admin').length}</strong>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminManageUsers;