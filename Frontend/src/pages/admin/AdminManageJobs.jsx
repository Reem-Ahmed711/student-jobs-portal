// D:\student-jobs-portal\Frontend\src\pages\admin\AdminManageJobs.jsx
import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import { adminGetAllJobs, adminDeleteJob, adminUpdateJobStatus } from '../../services/api';

const AdminManageJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [updatingJobId, setUpdatingJobId] = useState(null);
  const itemsPerPage = 5;

  // جلب الوظائف من الباكند
  const fetchJobs = async () => {
    setLoading(true);
    try {
      const response = await adminGetAllJobs();
      console.log('Jobs response:', response);
      
      // استخراج البيانات بشكل صحيح
      let jobsData = [];
      if (response.data?.data) {
        jobsData = response.data.data;
      } else if (response.data) {
        jobsData = Array.isArray(response.data) ? response.data : [];
      }
      
      setJobs(jobsData);
      setFilteredJobs(jobsData);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      alert('❌ Failed to fetch jobs: ' + (error.response?.data?.message || error.message));
    } finally {
      setLoading(false);
    }
  };

  // تحديث حالة الوظيفة (Approve/Reject)
  const handleUpdateJobStatus = async (jobId, newStatus) => {
    setUpdatingJobId(jobId);
    try {
      const response = await adminUpdateJobStatus(jobId, newStatus);
      console.log('Status update response:', response);
      
      if (response.data?.success || response.status === 200) {
        alert(`✅ Job ${newStatus === 'active' ? 'approved' : 'closed'} successfully`);
        await fetchJobs(); // إعادة تحميل البيانات
      } else {
        throw new Error(response.data?.message || 'Update failed');
      }
    } catch (error) {
      console.error('Error updating job status:', error);
      alert('❌ Failed to update job status: ' + (error.response?.data?.message || error.message));
    } finally {
      setUpdatingJobId(null);
    }
  };

  // حذف وظيفة
  const handleDeleteJob = async (jobId, jobTitle) => {
    if (!window.confirm(`⚠️ Are you sure you want to delete "${jobTitle}"? This action cannot be undone!`)) {
      return;
    }
    
    try {
      const response = await adminDeleteJob(jobId);
      console.log('Delete response:', response);
      
      if (response.data?.success || response.status === 200) {
        alert('✅ Job deleted successfully');
        await fetchJobs(); // إعادة تحميل البيانات
      } else {
        throw new Error(response.data?.message || 'Deletion failed');
      }
    } catch (error) {
      console.error('Error deleting job:', error);
      alert('❌ Failed to delete job: ' + (error.response?.data?.message || error.message));
    }
  };

  // دوال مختصرة للـ approve و reject
  const handleApproveJob = (jobId) => handleUpdateJobStatus(jobId, 'active');
  const handleRejectJob = (jobId) => handleUpdateJobStatus(jobId, 'closed');

  // تحميل البيانات عند بدء التشغيل
  useEffect(() => {
    fetchJobs();
  }, []);

  // فلترة الوظائف
  useEffect(() => {
    let result = [...jobs];
    
    // فلترة حسب البحث
    if (searchTerm) {
      result = result.filter(job => 
        job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.company?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    // فلترة حسب الحالة
    if (statusFilter !== 'all') {
      if (statusFilter === 'active') {
        result = result.filter(job => job.status === 'active' || job.approved === true);
      } else if (statusFilter === 'pending') {
        result = result.filter(job => job.status === 'pending' || (job.approved === false && job.status !== 'active' && job.status !== 'closed'));
      } else if (statusFilter === 'closed') {
        result = result.filter(job => job.status === 'closed');
      } else if (statusFilter === 'expired') {
        // لو عندك deadline
        result = result.filter(job => job.deadline && new Date(job.deadline) < new Date());
      }
    }
    
    setFilteredJobs(result);
    setCurrentPage(1);
  }, [searchTerm, statusFilter, jobs]);

  // دالة لتحديد لون وشكل الحالة
  const getJobStatus = (job) => {
    if (job.status === 'active' || job.approved === true) {
      return { text: 'Active', color: '#10b981', bg: '#d1fae5' };
    }
    if (job.status === 'closed') {
      return { text: 'Closed', color: '#6b7280', bg: '#e5e7eb' };
    }
    if (job.deadline && new Date(job.deadline) < new Date()) {
      return { text: 'Expired', color: '#ef4444', bg: '#fee2e2' };
    }
    return { text: 'Pending', color: '#f59e0b', bg: '#fed7aa' };
  };

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);

  if (loading) {
    return (
      <div style={{ display: 'flex', background: '#f8fafc', minHeight: '100vh' }}>
        <Navbar />
        <div style={{ flex: 1, padding: '30px' }}>
          <div style={{ margin: '100px auto', textAlign: 'center' }}>
            <div className="spinner"></div>
            <p>Loading jobs...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', background: '#f8fafc', minHeight: '100vh' }}>
      <Navbar />
      <div style={{ marginLeft: '280px', padding: '30px', width: 'calc(100% - 280px)' }}>
        {/* Header */}
        <div style={{ marginBottom: '30px' }}>
          <h1 style={{ fontSize: '28px', color: '#1E3A5F', fontWeight: '600', marginBottom: '5px' }}>
            Manage Jobs
          </h1>
          <p style={{ color: '#666' }}>Review, approve, and manage all job postings</p>
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
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
        }}>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '10px', background: '#f5f5f5', padding: '8px 16px', borderRadius: '8px' }}>
            <i className="fas fa-search" style={{ color: '#999' }}></i>
            <input
              type="text"
              placeholder="Search by title, department, or company..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent' }}
            />
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ padding: '8px 16px', border: '1px solid #ddd', borderRadius: '8px', background: 'white', cursor: 'pointer' }}
          >
            <option value="all">All Jobs</option>
            <option value="active">Active Jobs</option>
            <option value="pending">Pending Approval</option>
            <option value="closed">Closed Jobs</option>
          </select>
          
          <button
            onClick={fetchJobs}
            style={{ padding: '8px 16px', background: '#1E3A5F', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
          >
            <i className="fas fa-sync-alt"></i> Refresh
          </button>
        </div>

        {/* Jobs Table */}
        <div style={{ background: 'white', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse' }}>
            <thead style={{ background: '#f9fafb', borderBottom: '1px solid #e5e7eb' }}>
              <tr>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Job Title</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Department</th>
                <th style={{ padding: '12px 16px', textAlign: 'left', fontWeight: '600', color: '#374151' }}>Posted By</th>
                <th style={{ padding: '12px 16px', textAlign: 'center', fontWeight: '600', color: '#374151' }}>Status</th>
                <th style={{ padding: '12px 16px', textAlign: 'right', fontWeight: '600', color: '#374151' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentJobs.length === 0 ? (
                <tr>
                  <td colSpan="5" style={{ padding: '40px', textAlign: 'center', color: '#666' }}>
                    No jobs found
                  </td>
                </tr>
              ) : (
                currentJobs.map(job => {
                  const jobStatus = getJobStatus(job);
                  const isUpdating = updatingJobId === job.id;
                  const isActive = jobStatus.text === 'Active';
                  const isPending = jobStatus.text === 'Pending';
                  
                  return (
                    <tr key={job.id} style={{ borderBottom: '1px solid #e5e7eb' }}>
                      <td style={{ padding: '16px', fontWeight: '500' }}>{job.title}</td>
                      <td style={{ padding: '16px', color: '#666' }}>{job.department || job.category || 'N/A'}</td>
                      <td style={{ padding: '16px', color: '#666' }}>{job.postedBy || job.employerName || 'Unknown'}</td>
                      <td style={{ padding: '16px', textAlign: 'center' }}>
                        <span style={{
                          display: 'inline-block',
                          padding: '4px 12px',
                          borderRadius: '20px',
                          fontSize: '12px',
                          fontWeight: '600',
                          backgroundColor: jobStatus.bg,
                          color: jobStatus.color
                        }}>
                          {jobStatus.text}
                        </span>
                      </td>
                      <td style={{ padding: '16px', textAlign: 'right' }}>
                        <button
                          onClick={() => handleApproveJob(job.id)}
                          disabled={isUpdating || isActive}
                          style={{
                            padding: '6px 12px',
                            marginRight: '8px',
                            backgroundColor: '#10b981',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: (isUpdating || isActive) ? 'not-allowed' : 'pointer',
                            opacity: (isUpdating || isActive) ? 0.5 : 1
                          }}
                        >
                          <i className="fas fa-check"></i> Approve
                        </button>
                        <button
                          onClick={() => handleRejectJob(job.id)}
                          disabled={isUpdating || jobStatus.text === 'Closed'}
                          style={{
                            padding: '6px 12px',
                            marginRight: '8px',
                            backgroundColor: '#f59e0b',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: (isUpdating || jobStatus.text === 'Closed') ? 'not-allowed' : 'pointer',
                            opacity: (isUpdating || jobStatus.text === 'Closed') ? 0.5 : 1
                          }}
                        >
                          <i className="fas fa-times"></i> Close
                        </button>
                        <button
                          onClick={() => handleDeleteJob(job.id, job.title)}
                          disabled={isUpdating}
                          style={{
                            padding: '6px 12px',
                            backgroundColor: '#ef4444',
                            color: 'white',
                            border: 'none',
                            borderRadius: '6px',
                            cursor: isUpdating ? 'not-allowed' : 'pointer',
                            opacity: isUpdating ? 0.5 : 1
                          }}
                        >
                          <i className="fas fa-trash"></i> Delete
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div style={{ display: 'flex', justifyContent: 'center', gap: '8px', marginTop: '20px' }}>
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p-1))}
              disabled={currentPage === 1}
              style={{ padding: '8px 12px', background: 'white', border: '1px solid #ddd', borderRadius: '6px', cursor: currentPage === 1 ? 'not-allowed' : 'pointer' }}
            >
              Previous
            </button>
            <span style={{ padding: '8px 12px', background: '#1E3A5F', color: 'white', borderRadius: '6px' }}>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p+1))}
              disabled={currentPage === totalPages}
              style={{ padding: '8px 12px', background: 'white', border: '1px solid #ddd', borderRadius: '6px', cursor: currentPage === totalPages ? 'not-allowed' : 'pointer' }}
            >
              Next
            </button>
          </div>
        )}

        {/* Summary */}
        <div style={{ marginTop: '20px', padding: '15px', background: 'white', borderRadius: '8px', textAlign: 'center', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <p style={{ color: '#666' }}>
            Total Jobs: <strong>{jobs.length}</strong> | 
            Active: <strong>{jobs.filter(j => j.status === 'active' || j.approved === true).length}</strong> |
            Pending: <strong>{jobs.filter(j => j.status === 'pending' || (j.approved === false && j.status !== 'active')).length}</strong> |
            Closed: <strong>{jobs.filter(j => j.status === 'closed').length}</strong>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminManageJobs;