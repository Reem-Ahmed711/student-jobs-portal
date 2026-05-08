import React, { useState } from 'react';
import Navbar from '../../components/Navbar';

const AdminReports = () => {
  const [reports, setReports] = useState([
    {
      id: 1,
      type: 'Inappropriate Job Description',
      reportedBy: 'Student',
      targetId: 'Job #123',
      reason: 'Contains offensive language',
      date: '2026-05-01',
      status: 'pending'
    },
    {
      id: 2,
      type: 'Fake Job Posting',
      reportedBy: 'Student',
      targetId: 'Job #456',
      reason: 'Suspicious requirements',
      date: '2026-05-02',
      status: 'pending'
    },
    {
      id: 3,
      type: 'Spam Application',
      reportedBy: 'Employer',
      targetId: 'User #789',
      reason: 'Irrelevant applications',
      date: '2026-05-03',
      status: 'resolved'
    }
  ]);

  const handleResolve = (reportId) => {
    setReports(reports.map(r => 
      r.id === reportId ? { ...r, status: 'resolved' } : r
    ));
  };

  const handleDismiss = (reportId) => {
    setReports(reports.filter(r => r.id !== reportId));
  };

  return (
    <div style={{ display: 'flex', background: '#f8fafc', minHeight: '100vh' }}>
      <Navbar />
    <div
  style={{
    flex: 1,
    padding: '30px',
    minWidth: 0,
    overflowX: 'hidden'
  }}
>
        <div style={{ marginBottom: '30px' }}>
          <h1 style={{ fontSize: '28px', color: '#1E3A5F', fontWeight: '600' }}>Reported Content</h1>
          <p style={{ color: '#666' }}>Review and manage user reports</p>
        </div>

        <div className="table-container">
          <table className="table">
            <thead>
              <tr>
                <th>Type</th>
                <th>Reported By</th>
                <th>Target</th>
                <th>Reason</th>
                <th>Date</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {reports.map(report => (
                <tr key={report.id}>
                  <td>{report.type}</td>
                  <td>{report.reportedBy}</td>
                  <td>{report.targetId}</td>
                  <td>{report.reason}</td>
                  <td>{report.date}</td>
                  <td>
                    <span className={`badge badge-${report.status === 'pending' ? 'warning' : 'success'}`}>
                      {report.status}
                    </span>
                  </td>
                  <td>
                    <button
                      onClick={() => handleResolve(report.id)}
                      className="btn btn-success"
                      style={{ padding: '6px 12px', fontSize: '12px', marginRight: '8px' }}
                      disabled={report.status === 'resolved'}
                    >
                      Resolve
                    </button>
                    <button
                      onClick={() => handleDismiss(report.id)}
                      className="btn btn-danger"
                      style={{ padding: '6px 12px', fontSize: '12px' }}
                    >
                      Dismiss
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

export default AdminReports;
