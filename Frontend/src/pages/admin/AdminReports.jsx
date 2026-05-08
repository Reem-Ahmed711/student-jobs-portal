import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';

const AdminReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  // جلب التقارير من الباك إند
  const fetchReports = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:5000/api/admin/reports', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      const data = await response.json();
      
      if (data.success) {
        setReports(data.data || []);
      } else {
        setReports([]);
      }
    } catch (error) {
      console.error('Error fetching reports:', error);
      setReports([]);
    } finally {
      setLoading(false);
    }
  };

  // تحديث حالة التقرير (حل/رفض)
  const updateReportStatus = async (reportId, newStatus) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/admin/reports/${reportId}/status`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });
      
      const data = await response.json();
      if (data.success) {
        // تحديث الحالة محلياً
        setReports(reports.map(r => 
          r.id === reportId ? { ...r, status: newStatus, updatedAt: new Date().toISOString() } : r
        ));
      }
    } catch (error) {
      console.error('Error updating report:', error);
    }
  };

  // حل التقرير
  const handleResolve = (reportId) => {
    updateReportStatus(reportId, 'resolved');
  };

  // رفض التقرير (حذفه)
  const handleDismiss = async (reportId) => {
    if (!window.confirm('Are you sure you want to dismiss this report?')) return;
    
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:5000/api/admin/reports/${reportId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      const data = await response.json();
      if (data.success) {
        setReports(reports.filter(r => r.id !== reportId));
      }
    } catch (error) {
      console.error('Error deleting report:', error);
    }
  };

  // تحميل البيانات عند فتح الصفحة
  useEffect(() => {
    fetchReports();
  }, []);

  // فلترة التقارير حسب البحث والحالة
  const filteredReports = reports.filter(report => {
    const matchesSearch = searchTerm === '' || 
      report.type?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.reportedBy?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      report.targetId?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesFilter = filter === 'all' || report.status === filter;
    
    return matchesSearch && matchesFilter;
  });

  // إحصائيات
  const stats = {
    total: reports.length,
    pending: reports.filter(r => r.status === 'pending').length,
    resolved: reports.filter(r => r.status === 'resolved').length,
    dismissed: reports.filter(r => r.status === 'dismissed').length
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', background: '#f8fafc', minHeight: '100vh' }}>
        <Navbar />
        <div style={{ flex: 1, padding: '30px', minWidth: 0, overflowX: 'hidden' }}>
          <div className="spinner" style={{ margin: '100px auto' }}></div>
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
          <h1 style={{ fontSize: '28px', color: '#1E3A5F', fontWeight: '600' }}>Reported Content</h1>
          <p style={{ color: '#666' }}>Review and manage user reports</p>
        </div>

        {/* Stats Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '20px',
          marginBottom: '25px'
        }}>
          <div style={{ background: 'white', borderRadius: '12px', padding: '20px', textAlign: 'center' }}>
            <h3 style={{ fontSize: '28px', color: '#1E3A5F', marginBottom: '5px' }}>{stats.total}</h3>
            <p style={{ color: '#666' }}>Total Reports</p>
          </div>
          <div style={{ background: '#FEF3C7', borderRadius: '12px', padding: '20px', textAlign: 'center' }}>
            <h3 style={{ fontSize: '28px', color: '#D97706', marginBottom: '5px' }}>{stats.pending}</h3>
            <p style={{ color: '#92400E' }}>Pending</p>
          </div>
          <div style={{ background: '#DCFCE7', borderRadius: '12px', padding: '20px', textAlign: 'center' }}>
            <h3 style={{ fontSize: '28px', color: '#16A34A', marginBottom: '5px' }}>{stats.resolved}</h3>
            <p style={{ color: '#065F46' }}>Resolved</p>
          </div>
          <div style={{ background: '#FEE2E2', borderRadius: '12px', padding: '20px', textAlign: 'center' }}>
            <h3 style={{ fontSize: '28px', color: '#DC2626', marginBottom: '5px' }}>{stats.dismissed}</h3>
            <p style={{ color: '#991B1B' }}>Dismissed</p>
          </div>
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
          flexWrap: 'wrap'
        }}>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '10px', background: '#f5f5f5', padding: '8px 16px', borderRadius: '8px' }}>
            <i className="fas fa-search" style={{ color: '#999' }}></i>
            <input
              type="text"
              placeholder="Search by type, reporter, or target..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent' }}
            />
          </div>
          
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            style={{ padding: '8px 16px', border: '1px solid #ddd', borderRadius: '8px', background: 'white' }}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="resolved">Resolved</option>
            <option value="dismissed">Dismissed</option>
          </select>
          
          <button
            onClick={fetchReports}
            style={{ padding: '8px 16px', background: '#1E3A5F', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
          >
            <i className="fas fa-sync-alt"></i> Refresh
          </button>
        </div>

        {/* Reports Table */}
        <div className="table-container" style={{ overflowX: 'auto' }}>
          <table className="table" style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead>
              <tr style={{ background: '#f8fafc', borderBottom: '2px solid #e2e8f0' }}>
                <th style={{ padding: '12px', textAlign: 'left' }}>Type</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Reported By</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Target</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Reason</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Date</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Status</th>
                <th style={{ padding: '12px', textAlign: 'left' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredReports.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '40px', color: '#999' }}>
                    <i className="fas fa-inbox" style={{ fontSize: '48px', marginBottom: '10px', display: 'block' }}></i>
                    No reports found
                  </td>
                </tr>
              ) : (
                filteredReports.map(report => (
                  <tr key={report.id} style={{ borderBottom: '1px solid #e2e8f0' }}>
                    <td style={{ padding: '12px' }}>
                      <span style={{ 
                        background: report.type === 'Inappropriate Job Description' ? '#FEF3C7' : 
                                   report.type === 'Fake Job Posting' ? '#FEE2E2' : '#DBEAFE',
                        padding: '4px 8px',
                        borderRadius: '6px',
                        fontSize: '12px',
                        fontWeight: '500'
                      }}>
                        {report.type}
                      </span>
                    </td>
                    <td style={{ padding: '12px' }}>{report.reportedBy}</td>
                    <td style={{ padding: '12px' }}>{report.targetId}</td>
                    <td style={{ padding: '12px' }}>{report.reason}</td>
                    <td style={{ padding: '12px' }}>
                      {new Date(report.date).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '12px' }}>
                      <span className={`badge badge-${report.status === 'pending' ? 'warning' : report.status === 'resolved' ? 'success' : 'danger'}`}
                        style={{
                          padding: '4px 8px',
                          borderRadius: '20px',
                          fontSize: '11px',
                          fontWeight: '600',
                          background: report.status === 'pending' ? '#FEF3C7' : 
                                     report.status === 'resolved' ? '#DCFCE7' : '#FEE2E2',
                          color: report.status === 'pending' ? '#92400E' : 
                                 report.status === 'resolved' ? '#065F46' : '#991B1B'
                        }}>
                        {report.status}
                      </span>
                    </td>
                    <td style={{ padding: '12px' }}>
                      <button
                        onClick={() => handleResolve(report.id)}
                        style={{
                          padding: '6px 12px',
                          fontSize: '12px',
                          marginRight: '8px',
                          background: '#10B981',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: report.status === 'resolved' ? 'not-allowed' : 'pointer',
                          opacity: report.status === 'resolved' ? 0.5 : 1
                        }}
                        disabled={report.status === 'resolved'}
                      >
                        <i className="fas fa-check"></i> Resolve
                      </button>
                      <button
                        onClick={() => handleDismiss(report.id)}
                        style={{
                          padding: '6px 12px',
                          fontSize: '12px',
                          background: '#EF4444',
                          color: 'white',
                          border: 'none',
                          borderRadius: '6px',
                          cursor: 'pointer'
                        }}
                      >
                        <i className="fas fa-trash"></i> Dismiss
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Summary */}
        <div style={{ marginTop: '20px', padding: '15px', background: 'white', borderRadius: '8px', textAlign: 'center' }}>
          <p style={{ color: '#666' }}>
            Showing <strong>{filteredReports.length}</strong> of <strong>{reports.length}</strong> reports
            {searchTerm && ` (filtered by "${searchTerm}")`}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminReports;