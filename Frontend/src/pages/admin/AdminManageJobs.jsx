import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import { getAllJobs, deleteJob, updateJob } from '../../services/api';

const AdminManageJobs = () => {
  const [jobs, setJobs] = useState([]);
  const [filteredJobs, setFilteredJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const response = await getAllJobs();
      setJobs(response.data || []);
      setFilteredJobs(response.data || []);
    } catch (error) {
      console.error('Error fetching jobs:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let result = [...jobs];
    
    if (searchTerm) {
      result = result.filter(job => 
        job.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        job.department?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (statusFilter !== 'all') {
      const isActive = statusFilter === 'active';
      result = result.filter(job => {
        const isJobActive = new Date(job.deadline) > new Date();
        return isJobActive === isActive;
      });
    }
    
    setFilteredJobs(result);
    setCurrentPage(1);
  }, [searchTerm, statusFilter, jobs]);

  const handleApproveJob = async (jobId) => {
    try {
      await updateJob(jobId, { status: 'active', approved: true });
      alert('Job approved successfully');
      fetchJobs();
    } catch (error) {
      console.error('Error approving job:', error);
      alert('Failed to approve job');
    }
  };

  const handleRejectJob = async (jobId) => {
    if (window.confirm('Are you sure you want to reject this job?')) {
      try {
        await updateJob(jobId, { status: 'rejected', approved: false });
        alert('Job rejected');
        fetchJobs();
      } catch (error) {
        console.error('Error rejecting job:', error);
        alert('Failed to reject job');
      }
    }
  };

  const handleDeleteJob = async (jobId, jobTitle) => {
    if (window.confirm(`Are you sure you want to delete "${jobTitle}"?`)) {
      try {
        await deleteJob(jobId);
        alert('Job deleted successfully');
        fetchJobs();
      } catch (error) {
        console.error('Error deleting job:', error);
        alert('Failed to delete job');
      }
    }
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredJobs.length / itemsPerPage);

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
          animation: 'slideInUp 0.6s ease-out'
        }}>
          <div style={{ flex: 1, display: 'flex', alignItems: 'center', gap: '10px', background: '#f5f5f5', padding: '8px 16px', borderRadius: '8px' }}>
            <i className="fas fa-search" style={{ color: '#999' }}></i>
            <input
              type="text"
              placeholder="Search by title or department..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ flex: 1, border: 'none', outline: 'none', background: 'transparent' }}
            />
          </div>
          
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ padding: '8px 16px', border: '1px solid #ddd', borderRadius: '8px', background: 'white' }}
          >
            <option value="all">All Jobs</option>
            <option value="active">Active Jobs</option>
            <option value="expired">Expired Jobs</option>
          </select>
          
          <button
            onClick={fetchJobs}
            style={{ padding: '8px 16px', background: '#1E3A5F', color: 'white', border: 'none', borderRadius: '8px', cursor: 'pointer' }}
          >
            <i className="fas fa-sync-alt"></i> Refresh
          </button>
        </div>

        {/* Jobs Table */}
        <div className="table-container" style={{ animation: 'slideInUp 0.7s ease-out' }}>
          <table className="table">
            <thead>
              <tr>
                <th>Job Title</th>
                <th>Department</th>
                <th>Posted By</th>
                <th>Applicants</th>
                <th>Deadline</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentJobs.map(job => {
                const isExpired = new Date(job.deadline) < new Date();
                const status = isExpired ? 'expired' : 'active';
                return (
                  <tr key={job.id}>
                    <td style={{ fontWeight: '500' }}>{job.title}</td>
                    <td>{job.department}</td>
                    <td>{job.postedBy || 'Admin'}</td>
                    <td>{job.applicants || 0}</td>
                    <td>{new Date(job.deadline).toLocaleDateString()}</td>
                    <td>
                      <span className={`badge badge-${status === 'active' ? 'success' : 'danger'}`}>
                        {status}
                      </span>
                    </td>
                    <td>
                      <button
                        onClick={() => handleApproveJob(job.id)}
                        className="btn btn-success"
                        style={{ padding: '6px 12px', fontSize: '12px', marginRight: '8px', background: '#10b981' }}
                        disabled={status === 'expired'}
                      >
                        <i className="fas fa-check"></i> Approve
                      </button>
                      <button
                        onClick={() => handleRejectJob(job.id)}
                        className="btn btn-warning"
                        style={{ padding: '6px 12px', fontSize: '12px', marginRight: '8px', background: '#f59e0b', color: 'white' }}
                      >
                        <i className="fas fa-times"></i> Reject
                      </button>
                      <button
                        onClick={() => handleDeleteJob(job.id, job.title)}
                        className="btn btn-danger"
                        style={{ padding: '6px 12px', fontSize: '12px' }}
                      >
                        <i className="fas fa-trash"></i> Delete
                      </button>
                    </td>
                  </tr>
                );
              })}
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
            Total Jobs: <strong>{jobs.length}</strong> | 
            Active: <strong>{jobs.filter(j => new Date(j.deadline) > new Date()).length}</strong> |
            Expired: <strong>{jobs.filter(j => new Date(j.deadline) < new Date()).length}</strong>
          </p>
        </div>
      </div>
    </div>
  );
};

export default AdminManageJobs;