import React, { useState } from 'react';
import Navbar from '../../components/Navbar';

const AdminManageUsers = () => {
  const [users, setUsers] = useState([
    { id: 1, name: 'Ahmed Mohamed', email: 'ahmed@cu.edu.eg', role: 'student', status: 'active' },
    { id: 2, name: 'Dr. Sara Ali', email: 'sara@cu.edu.eg', role: 'employer', status: 'pending' },
    { id: 3, name: 'Mariam Hassan', email: 'mariam@cu.edu.eg', role: 'student', status: 'active' },
    { id: 4, name: 'Prof. Mahmoud', email: 'mahmoud@cu.edu.eg', role: 'employer', status: 'active' }
  ]);

  return (
    <div style={{ display: 'flex', background: '#f8fafc', minHeight: '100vh' }}>
      <Navbar />
      <div style={{ marginLeft: '280px', padding: '30px', width: 'calc(100% - 280px)' }}>
        <h1 style={{ fontSize: '28px', color: '#1E3A5F', marginBottom: '20px' }}>Manage Users</h1>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map(user => (
                <tr key={user.id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>
                    <span className={`badge badge-${user.role === 'student' ? 'info' : 'success'}`}>
                      {user.role}
                    </span>
                  </td>
                  <td>
                    <span className={`badge badge-${user.status === 'active' ? 'success' : 'warning'}`}>
                      {user.status}
                    </span>
                  </td>
                  <td>
                    <button className="btn btn-primary" style={{ padding: '6px 12px', marginRight: '8px' }}>
                      Edit
                    </button>
                    <button className="btn btn-danger" style={{ padding: '6px 12px' }}>
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};


export default AdminManageUsers;