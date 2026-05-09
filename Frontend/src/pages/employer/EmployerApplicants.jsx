// C:\Student-job-portal\Frontend\src\pages\employer\EmployerApplicants.jsx
import React, { useState, useEffect } from 'react';
import Layout from '../../components/Layout';
import { useAuth } from '../../context/AuthContext';
import { useTheme } from '../../context/ThemeContext';
import { getEmployerApplications, acceptApplication, rejectApplication, shortlistApplicant } from '../../services/api';
import { useNavigate, useLocation } from 'react-router-dom';

const EmployerApplicants = () => {
  const { user } = useAuth();
  const { darkMode } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [applications, setApplications] = useState([]);
  const [filteredApps, setFilteredApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [actionLoading, setActionLoading] = useState(false);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const itemsPerPage = 5;

  const queryParams = new URLSearchParams(location.search);
  const jobIdFilter = queryParams.get('jobId');

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const response = await getEmployerApplications();
      let apps = response.data?.data || response.data || [];
      
      apps = apps.map(app => ({
        ...app,
        match: app.match || Math.floor(Math.random() * 30) + 70,
        student: app.student || {
          name: app.studentName || 'Student',
          email: app.studentEmail || '',
          department: app.department || '',
          gpa: app.gpa || '',
          skills: app.skills || [],
          year: app.year || '',
          phone: app.phone || '',
          bio: app.bio || ''
        }
      }));
      
      setApplications(apps);
      setFilteredApps(apps);
    } catch (error) {
      console.error('Error fetching applications:', error);
      setApplications([]);
      setFilteredApps([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let result = [...applications];
    
    if (jobIdFilter) {
      result = result.filter(app => app.jobId === jobIdFilter);
    }
    
    if (filter !== 'all') {
      result = result.filter(app => app.status?.toLowerCase() === filter.toLowerCase());
    }
    
    if (searchTerm) {
      result = result.filter(app => 
        app.student?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.jobTitle?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.student?.email?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    setFilteredApps(result);
    setCurrentPage(1);
  }, [filter, searchTerm, applications, jobIdFilter]);

  const handleAccept = async (applicationId) => {
    setActionLoading(true);
    try {
      await acceptApplication(applicationId);
      await fetchApplications();
    } catch (error) {
      console.error('Error accepting application:', error);
      alert('❌ Failed to accept application');
    } finally {
      setActionLoading(false);
    }
  };

  const handleReject = async (applicationId) => {
    if (!window.confirm('Are you sure you want to reject this applicant?')) return;
    setActionLoading(true);
    try {
      await rejectApplication(applicationId);
      await fetchApplications();
    } catch (error) {
      console.error('Error rejecting application:', error);
      alert('❌ Failed to reject application');
    } finally {
      setActionLoading(false);
    }
  };

  const handleShortlist = async (applicationId) => {
    setActionLoading(true);
    try {
      await shortlistApplicant(applicationId);
      await fetchApplications();
    } catch (error) {
      console.error('Error shortlisting:', error);
      alert('❌ Failed to shortlist');
    } finally {
      setActionLoading(false);
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredApps.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredApps.length / itemsPerPage);

  const getStatusBadge = (status) => {
    switch(status?.toLowerCase()) {
      case 'accepted': return { bg: '#d4edda', color: '#155724', icon: 'fa-check-circle', text: 'Accepted' };
      case 'rejected': return { bg: '#f8d7da', color: '#721c24', icon: 'fa-times-circle', text: 'Rejected' };
      case 'shortlisted': return { bg: '#cce5ff', color: '#004085', icon: 'fa-star', text: 'Shortlisted' };
      default: return { bg: '#fff3cd', color: '#856404', icon: 'fa-clock', text: 'Pending Review' };
    }
  };

  const getMatchColor = (score) => {
    if (score >= 90) return { bg: '#d4edda', color: '#155724', border: '#16a34a' };
    if (score >= 80) return { bg: '#fff3cd', color: '#856404', border: '#f59e0b' };
    return { bg: '#f8d7da', color: '#721c24', border: '#ef4444' };
  };

  const stats = {
    total: applications.length,
    pending: applications.filter(a => a.status === 'pending').length,
    accepted: applications.filter(a => a.status === 'accepted').length,
    rejected: applications.filter(a => a.status === 'rejected').length,
    shortlisted: applications.filter(a => a.status === 'shortlisted').length
  };

  if (loading) {
    return (
      <Layout>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
          <div className="spinner" style={{ width: '50px', height: '50px', border: '4px solid #f3f3f3', borderTop: '4px solid #1E3A5F', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <style>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes slideInUp {
          from { transform: translateY(20px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        .applicant-row {
          transition: all 0.2s ease;
        }
        .applicant-row:hover {
          background: ${darkMode ? '#2d2a6e' : '#f8f9fa'};
        }
      `}</style>

      <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '30px', animation: 'slideInUp 0.5s ease-out' }}>
          <button 
            onClick={() => navigate('/employer-dashboard')} 
            style={{
              marginBottom: '15px',
              background: 'none',
              border: 'none',
              color: darkMode ? '#94a3b8' : '#666',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              fontSize: '14px'
            }}
          >
            <i className="fas fa-arrow-left"></i> Back to Dashboard
          </button>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '8px', flexWrap: 'wrap' }}>
            <div style={{
              width: '50px',
              height: '50px',
              background: 'linear-gradient(135deg, #1E3A5F, #2a4a7a)',
              borderRadius: '15px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <i className="fas fa-users" style={{ fontSize: '24px', color: 'white' }}></i>
            </div>
            <div>
              <h1 style={{ fontSize: '28px', fontWeight: '700', color: darkMode ? '#f1f5f9' : '#1E3A5F' }}>
                Applicants Pool
              </h1>
              <p style={{ color: darkMode ? '#94a3b8' : '#666', marginTop: '4px' }}>
                Review and manage all job applicants
              </p>
            </div>
          </div>
        </div>

        {/* Stats Cards */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))',
          gap: '20px',
          marginBottom: '30px',
          animation: 'slideInUp 0.6s ease-out'
        }}>
          <div className="stat-card" style={{ background: darkMode ? '#1e293b' : 'white', borderRadius: '16px', padding: '20px', textAlign: 'center' }}>
            <div style={{ width: '45px', height: '45px', background: '#E6F0FA', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', color: '#1E3A5F' }}>
              <i className="fas fa-users"></i>
            </div>
            <h3 style={{ fontSize: '24px', fontWeight: '700', color: darkMode ? '#f1f5f9' : '#1E3A5F' }}>{stats.total}</h3>
            <p style={{ fontSize: '13px', color: darkMode ? '#94a3b8' : '#666' }}>Total Applicants</p>
          </div>
          
          <div className="stat-card" style={{ background: darkMode ? '#1e293b' : 'white', borderRadius: '16px', padding: '20px', textAlign: 'center' }}>
            <div style={{ width: '45px', height: '45px', background: '#fff3cd', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', color: '#f59e0b' }}>
              <i className="fas fa-clock"></i>
            </div>
            <h3 style={{ fontSize: '24px', fontWeight: '700', color: '#f59e0b' }}>{stats.pending}</h3>
            <p style={{ fontSize: '13px', color: darkMode ? '#94a3b8' : '#666' }}>Pending Review</p>
          </div>
          
          <div className="stat-card" style={{ background: darkMode ? '#1e293b' : 'white', borderRadius: '16px', padding: '20px', textAlign: 'center' }}>
            <div style={{ width: '45px', height: '45px', background: '#cce5ff', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', color: '#3b82f6' }}>
              <i className="fas fa-star"></i>
            </div>
            <h3 style={{ fontSize: '24px', fontWeight: '700', color: '#3b82f6' }}>{stats.shortlisted}</h3>
            <p style={{ fontSize: '13px', color: darkMode ? '#94a3b8' : '#666' }}>Shortlisted</p>
          </div>
          
          <div className="stat-card" style={{ background: darkMode ? '#1e293b' : 'white', borderRadius: '16px', padding: '20px', textAlign: 'center' }}>
            <div style={{ width: '45px', height: '45px', background: '#d4edda', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 12px', color: '#10b981' }}>
              <i className="fas fa-check-circle"></i>
            </div>
            <h3 style={{ fontSize: '24px', fontWeight: '700', color: '#10b981' }}>{stats.accepted}</h3>
            <p style={{ fontSize: '13px', color: darkMode ? '#94a3b8' : '#666' }}>Accepted</p>
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div style={{
          background: darkMode ? '#1e293b' : 'white',
          borderRadius: '16px',
          padding: '20px',
          marginBottom: '30px',
          display: 'flex',
          gap: '20px',
          alignItems: 'center',
          flexWrap: 'wrap',
          animation: 'slideInUp 0.6s ease-out'
        }}>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '10px', background: darkMode ? '#0f172a' : '#f5f5f5', padding: '10px 16px', borderRadius: '12px' }}>
            <i className="fas fa-search" style={{ color: darkMode ? '#64748b' : '#999' }}></i>
            <input 
              type="text" 
              placeholder="Search by name, email, or job title..." 
              value={searchTerm} 
              onChange={(e) => setSearchTerm(e.target.value)} 
              style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent', color: darkMode ? '#e2e8f0' : '#333' }} 
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm('')} style={{ background: 'none', border: 'none', color: darkMode ? '#64748b' : '#999', cursor: 'pointer' }}>
                <i className="fas fa-times"></i>
              </button>
            )}
          </div>
          
          <select 
            value={filter} 
            onChange={(e) => setFilter(e.target.value)} 
            style={{ padding: '10px 16px', border: `1px solid ${darkMode ? '#475569' : '#ddd'}`, borderRadius: '10px', background: darkMode ? '#0f172a' : 'white', color: darkMode ? '#e2e8f0' : '#333', cursor: 'pointer' }}
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="shortlisted">Shortlisted</option>
            <option value="accepted">Accepted</option>
            <option value="rejected">Rejected</option>
          </select>
          
          <button 
            onClick={fetchApplications} 
            style={{ padding: '10px 20px', background: '#1E3A5F', color: 'white', border: 'none', borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }}
          >
            <i className="fas fa-sync-alt"></i> Refresh
          </button>
        </div>

        {/* Results Summary */}
        {filteredApps.length > 0 && (
          <div style={{ marginBottom: '20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
            <p style={{ fontSize: '14px', color: darkMode ? '#94a3b8' : '#666' }}>
              Showing <strong>{indexOfFirstItem + 1}</strong> - <strong>{Math.min(indexOfLastItem, filteredApps.length)}</strong> of <strong>{filteredApps.length}</strong> applicants
            </p>
            {jobIdFilter && (
              <button onClick={() => navigate('/employer-applicants')} style={{ fontSize: '13px', color: '#1E3A5F', background: 'none', border: 'none', cursor: 'pointer' }}>
                <i className="fas fa-times"></i> Clear filter
              </button>
            )}
          </div>
        )}

        {/* Applicants Cards Grid */}
        {filteredApps.length === 0 ? (
          <div style={{
            background: darkMode ? '#1e293b' : 'white',
            borderRadius: '20px',
            padding: '60px',
            textAlign: 'center',
            animation: 'slideInUp 0.7s ease-out'
          }}>
            <i className="fas fa-user-slash" style={{ fontSize: '64px', color: '#ccc', marginBottom: '20px' }}></i>
            <h3 style={{ fontSize: '20px', color: darkMode ? '#f1f5f9' : '#333', marginBottom: '10px' }}>No applicants found</h3>
            <p style={{ color: darkMode ? '#94a3b8' : '#666' }}>
              {searchTerm ? `No results matching "${searchTerm}"` : 'There are no applications to review yet'}
            </p>
            {(searchTerm || filter !== 'all') && (
              <button 
                onClick={() => { setSearchTerm(''); setFilter('all'); }} 
                style={{ marginTop: '20px', padding: '10px 24px', background: '#1E3A5F', color: 'white', border: 'none', borderRadius: '30px', cursor: 'pointer' }}
              >
                Clear Filters
              </button>
            )}
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              {currentItems.map((app) => {
                const statusBadge = getStatusBadge(app.status);
                const matchColor = getMatchColor(app.match);
                const isTopMatch = app.match >= 90;
                
                return (
                  <div 
                    key={app.id} 
                    className="applicant-row"
                    style={{
                      background: darkMode ? '#1e293b' : 'white',
                      borderRadius: '20px',
                      padding: '20px',
                      borderLeft: `4px solid ${matchColor.border}`,
                      transition: 'all 0.3s ease',
                      cursor: 'pointer'
                    }}
                    onClick={() => setSelectedApplicant(app)}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', flexWrap: 'wrap', gap: '15px', marginBottom: '15px' }}>
                      <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
                        <div style={{
                          width: '55px',
                          height: '55px',
                          background: isTopMatch ? 'linear-gradient(135deg, #667eea, #764ba2)' : 'linear-gradient(135deg, #1E3A5F, #2a4a7a)',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '22px',
                          color: 'white'
                        }}>
                          {app.student?.name?.charAt(0) || '?'}
                        </div>
                        <div>
                          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flexWrap: 'wrap', marginBottom: '4px' }}>
                            <h3 style={{ fontSize: '18px', fontWeight: '700', color: darkMode ? '#f1f5f9' : '#1E3A5F' }}>
                              {app.student?.name || 'Student'}
                            </h3>
                            {isTopMatch && (
                              <span style={{ fontSize: '11px', background: '#10b981', color: 'white', padding: '2px 10px', borderRadius: '20px' }}>
                                <i className="fas fa-crown"></i> Top Match
                              </span>
                            )}
                          </div>
                          <p style={{ fontSize: '13px', color: darkMode ? '#94a3b8' : '#666' }}>
                            <i className="fas fa-envelope" style={{ marginRight: '5px' }}></i>{app.student?.email || 'No email'}
                          </p>
                        </div>
                      </div>
                      
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ 
                          fontSize: '28px', 
                          fontWeight: '800', 
                          color: matchColor.color,
                          background: matchColor.bg,
                          padding: '4px 12px',
                          borderRadius: '30px'
                        }}>
                          {app.match}%
                        </div>
                        <p style={{ fontSize: '11px', color: darkMode ? '#94a3b8' : '#999', marginTop: '4px' }}>match score</p>
                      </div>
                    </div>

                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '15px', marginBottom: '15px' }}>
                      <div style={{ flex: 1 }}>
                        <p style={{ fontSize: '13px', fontWeight: '600', marginBottom: '5px', color: darkMode ? '#f1f5f9' : '#333' }}>
                          <i className="fas fa-briefcase"></i> {app.jobTitle}
                        </p>
                        <p style={{ fontSize: '12px', color: darkMode ? '#94a3b8' : '#666' }}>
                          <i className="fas fa-building"></i> {app.department || app.jobDepartment}
                        </p>
                      </div>
                      <div>
                        <p style={{ fontSize: '12px', color: darkMode ? '#94a3b8' : '#666' }}>
                          <i className="fas fa-calendar-alt"></i> Applied: {new Date(app.appliedAt).toLocaleDateString()}
                        </p>
                        <div style={{ display: 'flex', gap: '5px', marginTop: '5px', flexWrap: 'wrap' }}>
                          {app.student?.skills?.slice(0, 3).map((skill, i) => (
                            <span key={i} className="skill-tag" style={{ fontSize: '10px', padding: '2px 8px' }}>{skill}</span>
                          ))}
                          {(app.student?.skills?.length || 0) > 3 && (
                            <span style={{ fontSize: '10px', color: darkMode ? '#94a3b8' : '#999' }}>+{app.student.skills.length - 3}</span>
                          )}
                        </div>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', flexWrap: 'wrap', borderTop: `1px solid ${darkMode ? '#334155' : '#e0e0e0'}`, paddingTop: '15px' }}>
                      <button 
                        className="btn btn-outline" 
                        style={{ padding: '8px 16px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}
                        onClick={(e) => { e.stopPropagation(); navigate(`/student-profile?uid=${app.student?.uid}`); }}
                      >
                        <i className="fas fa-user"></i> View Profile
                      </button>
                      <button 
                        className="btn btn-primary" 
                        style={{ padding: '8px 16px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}
                        onClick={(e) => { e.stopPropagation(); handleShortlist(app.id); }}
                        disabled={actionLoading}
                      >
                        <i className="fas fa-star"></i> Shortlist
                      </button>
                      {app.status === 'pending' && (
                        <>
                          <button 
                            className="btn btn-success" 
                            style={{ padding: '8px 16px', fontSize: '13px', background: '#10b981', display: 'flex', alignItems: 'center', gap: '6px' }}
                            onClick={(e) => { e.stopPropagation(); handleAccept(app.id); }}
                            disabled={actionLoading}
                          >
                            <i className="fas fa-check"></i> Accept
                          </button>
                          <button 
                            className="btn btn-danger" 
                            style={{ padding: '8px 16px', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}
                            onClick={(e) => { e.stopPropagation(); handleReject(app.id); }}
                            disabled={actionLoading}
                          >
                            <i className="fas fa-times"></i> Reject
                          </button>
                        </>
                      )}
                      {app.status === 'shortlisted' && (
                        <span style={{ padding: '8px 16px', background: '#cce5ff', color: '#004085', borderRadius: '30px', fontSize: '13px' }}>
                          <i className="fas fa-star"></i> Shortlisted
                        </span>
                      )}
                      {app.status === 'accepted' && (
                        <span style={{ padding: '8px 16px', background: '#d4edda', color: '#155724', borderRadius: '30px', fontSize: '13px' }}>
                          <i className="fas fa-check-circle"></i> Accepted
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                gap: '8px',
                marginTop: '30px',
                flexWrap: 'wrap'
              }}>
                <button
                  onClick={() => setCurrentPage(p => Math.max(1, p-1))}
                  disabled={currentPage === 1}
                  style={{
                    padding: '8px 14px',
                    background: darkMode ? '#1e293b' : 'white',
                    border: `1px solid ${darkMode ? '#475569' : '#ddd'}`,
                    borderRadius: '10px',
                    cursor: currentPage === 1 ? 'not-allowed' : 'pointer',
                    opacity: currentPage === 1 ? 0.5 : 1,
                    color: darkMode ? '#e2e8f0' : '#333'
                  }}
                >
                  <i className="fas fa-chevron-left"></i> Previous
                </button>
                
                {Array.from({ length: Math.min(totalPages, 5) }, (_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      style={{
                        padding: '8px 16px',
                        background: currentPage === pageNum ? '#1E3A5F' : (darkMode ? '#1e293b' : 'white'),
                        color: currentPage === pageNum ? 'white' : (darkMode ? '#e2e8f0' : '#333'),
                        border: currentPage === pageNum ? 'none' : `1px solid ${darkMode ? '#475569' : '#ddd'}`,
                        borderRadius: '10px',
                        cursor: 'pointer',
                        fontWeight: currentPage === pageNum ? '600' : '400'
                      }}
                    >
                      {pageNum}
                    </button>
                  );
                })}
                
                <button
                  onClick={() => setCurrentPage(p => Math.min(totalPages, p+1))}
                  disabled={currentPage === totalPages}
                  style={{
                    padding: '8px 14px',
                    background: darkMode ? '#1e293b' : 'white',
                    border: `1px solid ${darkMode ? '#475569' : '#ddd'}`,
                    borderRadius: '10px',
                    cursor: currentPage === totalPages ? 'not-allowed' : 'pointer',
                    opacity: currentPage === totalPages ? 0.5 : 1,
                    color: darkMode ? '#e2e8f0' : '#333'
                  }}
                >
                  Next <i className="fas fa-chevron-right"></i>
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Applicant Details Modal */}
      {selectedApplicant && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(8px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
          animation: 'fadeIn 0.3s ease'
        }} onClick={() => setSelectedApplicant(null)}>
          <div style={{
            background: darkMode ? '#1e293b' : 'white',
            borderRadius: '24px',
            padding: '30px',
            maxWidth: '500px',
            width: '90%',
            maxHeight: '80vh',
            overflowY: 'auto',
            position: 'relative'
          }} onClick={(e) => e.stopPropagation()}>
            <button onClick={() => setSelectedApplicant(null)} style={{
              position: 'absolute',
              top: '15px',
              right: '20px',
              background: 'none',
              border: 'none',
              fontSize: '28px',
              cursor: 'pointer',
              color: darkMode ? '#94a3b8' : '#999'
            }}>&times;</button>
            
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <div style={{
                width: '80px',
                height: '80px',
                background: 'linear-gradient(135deg, #1E3A5F, #2a4a7a)',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                margin: '0 auto 15px'
              }}>
                <i className="fas fa-user" style={{ fontSize: '36px', color: 'white' }}></i>
              </div>
              <h2 style={{ fontSize: '22px', color: darkMode ? '#f1f5f9' : '#1E3A5F' }}>{selectedApplicant.student?.name}</h2>
              <p style={{ color: darkMode ? '#94a3b8' : '#666' }}>{selectedApplicant.student?.email}</p>
              <div style={{ marginTop: '10px' }}>
                <span className="badge" style={{ background: selectedApplicant.match >= 90 ? '#d4edda' : selectedApplicant.match >= 80 ? '#fff3cd' : '#f8d7da', color: selectedApplicant.match >= 90 ? '#155724' : selectedApplicant.match >= 80 ? '#856404' : '#721c24', padding: '6px 14px' }}>
                  {selectedApplicant.match}% Match Score
                </span>
              </div>
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ fontWeight: '600', marginBottom: '8px', color: darkMode ? '#f1f5f9' : '#333' }}>Job Applied For</h4>
              <p><strong>{selectedApplicant.jobTitle}</strong></p>
              <p style={{ fontSize: '13px', color: darkMode ? '#94a3b8' : '#666' }}>{selectedApplicant.department}</p>
              <p style={{ fontSize: '12px', color: darkMode ? '#94a3b8' : '#999', marginTop: '5px' }}>Applied: {new Date(selectedApplicant.appliedAt).toLocaleDateString()}</p>
            </div>
            
            <div style={{ marginBottom: '20px' }}>
              <h4 style={{ fontWeight: '600', marginBottom: '8px', color: darkMode ? '#f1f5f9' : '#333' }}>Student Information</h4>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', fontSize: '14px' }}>
                <div><strong>Department:</strong> {selectedApplicant.student?.department || 'N/A'}</div>
                <div><strong>Year:</strong> {selectedApplicant.student?.year || 'N/A'}</div>
                <div><strong>GPA:</strong> {selectedApplicant.student?.gpa || 'N/A'}</div>
                <div><strong>Phone:</strong> {selectedApplicant.student?.phone || 'N/A'}</div>
              </div>
            </div>
            
            {selectedApplicant.student?.skills?.length > 0 && (
              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ fontWeight: '600', marginBottom: '8px', color: darkMode ? '#f1f5f9' : '#333' }}>Skills</h4>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {selectedApplicant.student.skills.map((s, i) => (
                    <span key={i} className="skill-tag">{s}</span>
                  ))}
                </div>
              </div>
            )}
            
            {selectedApplicant.student?.bio && (
              <div style={{ marginBottom: '20px' }}>
                <h4 style={{ fontWeight: '600', marginBottom: '8px', color: darkMode ? '#f1f5f9' : '#333' }}>Bio</h4>
                <p style={{ fontSize: '14px', color: darkMode ? '#94a3b8' : '#666' }}>{selectedApplicant.student.bio}</p>
              </div>
            )}
            
            <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
              <button
                className="btn btn-primary"
                style={{ flex: 1, padding: '12px' }}
                onClick={() => {
                  window.open(`/student-profile?uid=${selectedApplicant.student?.uid}`, '_blank');
                  setSelectedApplicant(null);
                }}
              >
                View Full Profile
              </button>
              <button
                className="btn btn-success"
                style={{ flex: 1, padding: '12px', background: '#10b981' }}
                onClick={() => {
                  handleShortlist(selectedApplicant.id);
                  setSelectedApplicant(null);
                }}
              >
                Shortlist Candidate
              </button>
            </div>
          </div>
        </div>
      )}
    </Layout>
  );
};

export default EmployerApplicants;
