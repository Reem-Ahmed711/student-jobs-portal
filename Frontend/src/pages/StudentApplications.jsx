// client/my-app/src/pages/StudentApplications.jsx
import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import LoadingSpinner from '../components/LoadingSpinner';
import { useAuth } from '../context/AuthContext';
import { getUserApplications, withdrawApplication } from '../services/api';

const StudentApplications = () => {
  const { user } = useAuth();
  const [filter, setFilter] = useState('all');
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [withdrawing, setWithdrawing] = useState(false);
  const itemsPerPage = 3;

  useEffect(() => {
    const fetchApplications = async () => {
      setLoading(true);
      try {
        const response = await getUserApplications();
        setApplications(response.data || []);
      } catch (error) {
        console.error('Error fetching applications:', error);
        // بيانات وهمية في حالة الخطأ
        setApplications([
          {
            id: 1,
            jobId: 1,
            jobTitle: 'Teaching Assistant - Physics 101',
            company: 'Physics Department',
            departmentCode: 'Physics',
            location: 'Physics Building',
            appliedDate: 'Feb 20, 2026',
            status: 'Pending',
            match: 92,
            type: 'Part-Time',
            salary: '2000 EGP/mo',
            interviewDate: null
          },
          {
            id: 2,
            jobId: 2,
            jobTitle: 'Research Assistant - Quantum',
            company: 'Physics Department',
            departmentCode: 'Physics',
            location: 'Research Center',
            appliedDate: 'Feb 18, 2026',
            status: 'Interview',
            match: 88,
            type: 'Part-Time',
            salary: '2500 EGP/mo',
            interviewDate: 'Mar 5, 2026 - 2:00 PM'
          },
          {
            id: 3,
            jobId: 3,
            jobTitle: 'Lab Assistant - General Physics',
            company: 'Physics Department',
            departmentCode: 'Physics',
            location: 'Physics Building',
            appliedDate: 'Feb 15, 2026',
            status: 'Accepted',
            match: 85,
            type: 'Part-Time',
            salary: '1800 EGP/mo',
            interviewDate: 'Feb 28, 2026'
          }
        ]);
      } finally {
        setLoading(false);
      }
    };

    fetchApplications();
  }, []);

  const filteredApplications = filter === 'all' 
    ? applications 
    : applications.filter(app => app.status?.toLowerCase() === filter.toLowerCase());

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredApplications.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredApplications.length / itemsPerPage);

  const handleWithdraw = async (appId) => {
    if (!window.confirm('Are you sure you want to withdraw this application?')) {
      return;
    }

    setWithdrawing(true);
    try {
      await withdrawApplication(appId);
      setApplications(applications.filter(app => app.id !== appId));
      alert('Application withdrawn successfully');
    } catch (error) {
      console.error('Error withdrawing application:', error);
      alert('Failed to withdraw application. Please try again.');
    } finally {
      setWithdrawing(false);
    }
  };

  const getStatusColor = (status) => {
    switch(status?.toLowerCase()) {
      case 'pending': return { bg: '#fff3cd', color: '#856404' };
      case 'interview': return { bg: '#d4edda', color: '#155724' };
      case 'accepted': return { bg: '#cce5ff', color: '#004085' };
      case 'rejected': return { bg: '#f8d7da', color: '#721c24' };
      case 'under review': return { bg: '#e2d5f1', color: '#4a1b6d' };
      default: return { bg: '#e2e3e5', color: '#383d41' };
    }
  };

  const getStatusBadge = (status) => {
    switch(status?.toLowerCase()) {
      case 'pending': return 'badge-warning';
      case 'interview': return 'badge-success';
      case 'accepted': return 'badge-success';
      case 'under review': return 'badge-info';
      case 'rejected': return 'badge-danger';
      default: return 'badge-info';
    }
  };

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const stats = {
    total: applications.length,
    pending: applications.filter(a => a.status?.toLowerCase() === 'pending').length,
    interview: applications.filter(a => a.status?.toLowerCase() === 'interview').length,
    accepted: applications.filter(a => a.status?.toLowerCase() === 'accepted').length
  };

  const StatCard = ({ number, label, icon, color }) => (
    <div className="stat-card" style={{
      background: 'white',
      borderRadius: '12px',
      padding: '1.5rem',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
      display: 'flex',
      alignItems: 'center',
      gap: '1rem'
    }}>
      <div style={{
        width: '50px',
        height: '50px',
        background: `${color}20`,
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: color,
        fontSize: '1.5rem'
      }}>
        <i className={`fas ${icon}`}></i>
      </div>
      <div>
        <h3 style={{ fontSize: '1.8rem', color: '#1E3A5F', marginBottom: '0.25rem' }}>{number}</h3>
        <p style={{ color: '#666', fontSize: '0.9rem' }}>{label}</p>
      </div>
    </div>
  );

  if (loading) {
    return (
      <div style={{ display: 'flex', background: '#f8fafc', minHeight: '100vh' }}>
        <Navbar />
        <div style={{ marginLeft: '280px', padding: '30px', width: 'calc(100% - 280px)' }}>
          <LoadingSpinner size="large" />
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', background: '#f8fafc', minHeight: '100vh' }}>
      <Navbar />
      
      <div style={{ marginLeft: '280px', padding: '30px', width: 'calc(100% - 280px)' }}>
        <div style={{ marginBottom: '30px', animation: 'slideInUp 0.5s ease-out' }}>
          <h1 style={{ fontSize: '28px', color: '#1E3A5F', fontWeight: '600', marginBottom: '5px' }}>
            <i className="fas fa-file-alt" style={{ marginRight: '10px' }}></i>
            My Applications
          </h1>
          <p style={{ color: '#666' }}>
            <i className="fas fa-graduation-cap" style={{ marginRight: '5px', color: '#1E3A5F' }}></i>
            {user?.department || 'All Departments'} • {applications.length} total applications
          </p>
        </div>

        <div className="stats-grid" style={{ animation: 'slideInUp 0.6s ease-out' }}>
          <StatCard number={stats.total} label="Total Applications" icon="fa-file-alt" color="#1E3A5F" />
          <StatCard number={stats.pending} label="Pending" icon="fa-clock" color="#f59e0b" />
          <StatCard number={stats.interview} label="Interview" icon="fa-calendar-check" color="#16a34a" />
          <StatCard number={stats.accepted} label="Accepted" icon="fa-check-circle" color="#0077B5" />
        </div>

        <div className="card" style={{ marginBottom: '30px', animation: 'slideInUp 0.7s ease-out' }}>
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ color: '#1E3A5F', fontWeight: '500' }}>
              <i className="fas fa-filter" style={{ marginRight: '5px' }}></i>
              Filter by:
            </span>
            {['all', 'pending', 'interview', 'accepted', 'rejected'].map(status => (
              <button
                key={status}
                onClick={() => {
                  setFilter(status);
                  setCurrentPage(1);
                }}
                className={`btn ${filter === status ? 'btn-primary' : 'btn-outline'}`}
                style={{
                  padding: '8px 16px',
                  fontSize: '14px',
                  textTransform: 'capitalize'
                }}
              >
                {status === 'all' && <i className="fas fa-list" style={{ marginRight: '5px' }}></i>}
                {status === 'pending' && <i className="fas fa-hourglass-half" style={{ marginRight: '5px' }}></i>}
                {status === 'interview' && <i className="fas fa-handshake" style={{ marginRight: '5px' }}></i>}
                {status === 'accepted' && <i className="fas fa-check-circle" style={{ marginRight: '5px' }}></i>}
                {status === 'rejected' && <i className="fas fa-times-circle" style={{ marginRight: '5px' }}></i>}
                {status}
              </button>
            ))}
          </div>
        </div>

        {filteredApplications.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '60px', animation: 'slideInUp 0.8s ease-out' }}>
            <i className="fas fa-inbox" style={{ fontSize: '48px', color: '#ccc', marginBottom: '20px' }}></i>
            <h3 style={{ color: '#666', marginBottom: '10px' }}>No applications found</h3>
            <p style={{ color: '#999', marginBottom: '20px' }}>
              {filter === 'all' 
                ? "You haven't applied to any jobs yet" 
                : `No ${filter} applications found`}
            </p>
            <button 
              onClick={() => window.location.href = '/available-jobs'}
              className="btn btn-primary"
              style={{ padding: '12px 24px' }}
            >
              <i className="fas fa-search" style={{ marginRight: '8px' }}></i>
              Browse Jobs
            </button>
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
              {currentItems.map(app => {
                const statusColors = getStatusColor(app.status);
                return (
                  <div key={app.id} className="card" style={{ 
                    animation: 'slideInUp 0.8s ease-out',
                    border: app.status?.toLowerCase() === 'interview' ? '2px solid #16a34a20' : 'none'
                  }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '15px' }}>
                      <div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '5px', flexWrap: 'wrap' }}>
                          <h3 style={{ color: '#1E3A5F', fontSize: '18px', fontWeight: '600' }}>{app.jobTitle}</h3>
                          <span className="badge" style={{ background: '#E6F0FA', color: '#1E3A5F' }}>
                            <i className="fas fa-percent" style={{ marginRight: '5px', fontSize: '11px' }}></i>
                            {app.match}% Match
                          </span>
                          <span className="badge" style={{ background: '#E6F0FA', color: '#1E3A5F' }}>
                            <i className="fas fa-building" style={{ marginRight: '5px' }}></i>
                            {app.departmentCode}
                          </span>
                        </div>
                        <p style={{ color: '#666', fontSize: '14px', marginBottom: '5px' }}>
                          <i className="fas fa-building" style={{ marginRight: '5px', color: '#1E3A5F' }}></i>
                          {app.company} • <i className="fas fa-map-marker-alt" style={{ marginRight: '5px', color: '#1E3A5F' }}></i>{app.location}
                        </p>
                      </div>
                      
                      <span className={`badge ${getStatusBadge(app.status)}`} style={{ padding: '6px 12px', fontSize: '13px' }}>
                        <i className="fas fa-circle" style={{ fontSize: '8px', marginRight: '5px' }}></i>
                        {app.status}
                      </span>
                    </div>

                    <div style={{
                      display: 'flex',
                      gap: '20px',
                      marginBottom: '15px',
                      color: '#666',
                      fontSize: '14px',
                      flexWrap: 'wrap'
                    }}>
                      <span><i className="far fa-clock" style={{ marginRight: '5px', color: '#1E3A5F' }}></i> {app.type}</span>
                      <span><i className="far fa-calendar-alt" style={{ marginRight: '5px', color: '#1E3A5F' }}></i> Applied: {app.appliedDate}</span>
                      <span><i className="fas fa-money-bill-alt" style={{ marginRight: '5px', color: '#1E3A5F' }}></i> {app.salary}</span>
                    </div>

                    {app.status?.toLowerCase() === 'interview' && app.interviewDate && (
                      <div style={{
                        background: '#d4edda',
                        padding: '12px',
                        borderRadius: '8px',
                        marginBottom: '15px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center'
                      }}>
                        <div>
                          <i className="fas fa-calendar-check" style={{ color: '#155724', marginRight: '8px' }}></i>
                          <strong>Interview Scheduled:</strong> {app.interviewDate}
                        </div>
                        <span style={{ color: '#155724', fontSize: '13px' }}>
                          <i className="fas fa-map-marker-alt" style={{ marginRight: '5px' }}></i>
                          {app.location}
                        </span>
                      </div>
                    )}

                    {app.status?.toLowerCase() === 'accepted' && (
                      <div style={{
                        background: '#cce5ff',
                        padding: '12px',
                        borderRadius: '8px',
                        marginBottom: '15px'
                      }}>
                        <i className="fas fa-check-circle" style={{ color: '#004085', marginRight: '8px' }}></i>
                        <strong>Congratulations!</strong> Your application has been accepted.
                      </div>
                    )}

                    {app.status?.toLowerCase() === 'rejected' && (
                      <div style={{
                        background: '#f8d7da',
                        padding: '12px',
                        borderRadius: '8px',
                        marginBottom: '15px'
                      }}>
                        <i className="fas fa-times-circle" style={{ color: '#721c24', marginRight: '8px' }}></i>
                        <strong>Application rejected.</strong> Don't give up! Keep applying.
                      </div>
                    )}

                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end' }}>
                      <button className="btn btn-outline" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                        <i className="fas fa-eye"></i>
                        View Details
                      </button>
                      {app.status?.toLowerCase() === 'pending' && (
                        <button 
                          onClick={() => handleWithdraw(app.id)}
                          disabled={withdrawing}
                          className="btn btn-danger" 
                          style={{ display: 'flex', alignItems: 'center', gap: '5px' }}
                        >
                          <i className="fas fa-times"></i>
                          {withdrawing ? 'Withdrawing...' : 'Withdraw'}
                        </button>
                      )}
                      {app.status?.toLowerCase() === 'interview' && (
                        <button className="btn btn-success" style={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
                          <i className="fas fa-check"></i>
                          Confirm Interview
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {totalPages > 1 && (
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '10px',
                marginTop: '30px',
                animation: 'slideInUp 0.9s ease-out'
              }}>
                <button
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="btn btn-outline"
                  style={{
                    width: '40px',
                    height: '40px',
                    padding: '0',
                    opacity: currentPage === 1 ? 0.5 : 1,
                    cursor: currentPage === 1 ? 'not-allowed' : 'pointer'
                  }}
                >
                  <i className="fas fa-chevron-left"></i>
                </button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                  <button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    className={`btn ${currentPage === page ? 'btn-primary' : 'btn-outline'}`}
                    style={{
                      width: '40px',
                      height: '40px',
                      padding: '0',
                      fontWeight: currentPage === page ? '600' : '400'
                    }}
                  >
                    {page}
                  </button>
                ))}
                
                <button
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="btn btn-outline"
                  style={{
                    width: '40px',
                    height: '40px',
                    padding: '0',
                    opacity: currentPage === totalPages ? 0.5 : 1,
                    cursor: currentPage === totalPages ? 'not-allowed' : 'pointer'
                  }}
                >
                  <i className="fas fa-chevron-right"></i>
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default StudentApplications;