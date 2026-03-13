import React, { useState } from 'react';
import Navbar from '../../components/Navbar';

const AdminManageJobs = () => {
  const [jobs, setJobs] = useState([
    { id: 1, title: 'Teaching Assistant - Physics', department: 'Physics', postedBy: 'Dr. Ahmed', status: 'active', applicants: 24 },
    { id: 2, title: 'Research Assistant - Chemistry', department: 'Chemistry', postedBy: 'Dr. Sara', status: 'pending', applicants: 12 },
    { id: 3, title: 'Lab Assistant - Biology', department: 'Biology', postedBy: 'Dr. Mona', status: 'active', applicants: 18 }
  ]);

  return (
    <div style={{ display: 'flex', background: '#f8fafc', minHeight: '100vh' }}>
      <Navbar />
      <div style={{ marginLeft: '280px', padding: '30px', width: 'calc(100% - 280px)' }}>
        <h1 style={{ fontSize: '28px', color: '#1E3A5F', marginBottom: '20px' }}>Manage Jobs</h1>
        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Job Title</th>
                <th>Department</th>
                <th>Posted By</th>
                <th>Applicants</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {jobs.map(job => (
                <tr key={job.id}>
                  <td>{job.title}</td>
                  <td>{job.department}</td>
                  <td>{job.postedBy}</td>
                  <td>{job.applicants}</td>
                  <td>
                    <span className={`badge badge-${job.status === 'active' ? 'success' : 'warning'}`}>
                      {job.status}
                    </span>
                  </td>
                  <td>
                    <button className="btn btn-primary" style={{ padding: '6px 12px', marginRight: '8px' }}>
                      View
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

export default AdminManageJobs;