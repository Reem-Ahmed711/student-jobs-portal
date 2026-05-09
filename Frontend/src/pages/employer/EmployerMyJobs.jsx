// C:\Student-job-portal\Frontend\src\pages\employer\EmployerMyJobs.jsx
import React, { useState, useEffect } from 'react';
import Navbar from '../../components/Navbar';
import LoadingSpinner from '../../components/LoadingSpinner';
import { useAuth } from '../../context/AuthContext';
import { getEmployerJobs, deleteJob, updateJob } from '../../services/api';

const EmployerMyJobs = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingJob, setEditingJob] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('success');

  // Form data for editing
  const [editForm, setEditForm] = useState({
    title: '',
    department: '',
    type: '',
    location: '',
    description: '',
    requirements: [],
    salary: '',
    hours: '',
    deadline: ''
  });

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const response = await getEmployerJobs();
      setJobs(response.data || []);
    } catch (error) {
      console.error('Error fetching jobs:', error);
      setMessage('Failed to load jobs');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (job) => {
    setEditingJob(job);
    setEditForm({
      title: job.title || '',
      department: job.department || '',
      type: job.type || 'Part-Time',
      location: job.location || '',
      description: job.description || '',
      requirements: job.requirements || [],
      salary: job.salary || '',
      hours: job.hours || '',
      deadline: job.deadline || ''
    });
    setShowEditModal(true);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({ ...prev, [name]: value }));
  };

  const handleAddRequirement = () => {
    const input = document.getElementById('newRequirement');
    if (input.value.trim()) {
      setEditForm(prev => ({
        ...prev,
        requirements: [...prev.requirements, input.value.trim()]
      }));
      input.value = '';
    }
  };

  const handleRemoveRequirement = (index) => {
    setEditForm(prev => ({
      ...prev,
      requirements: prev.requirements.filter((_, i) => i !== index)
    }));
  };

  const handleUpdateJob = async () => {
    try {
      await updateJob(editingJob.id, editForm);
      setMessage('Job updated successfully!');
      setMessageType('success');
      setShowEditModal(false);
      fetchJobs(); // Refresh list
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error updating job:', error);
      setMessage('Failed to update job');
      setMessageType('error');
    }
  };

  const handleDeleteJob = async (jobId) => {
    try {
      await deleteJob(jobId);
      setMessage('Job deleted successfully!');
      setMessageType('success');
      setShowDeleteConfirm(null);
      fetchJobs(); // Refresh list
      setTimeout(() => setMessage(''), 3000);
    } catch (error) {
      console.error('Error deleting job:', error);
      setMessage('Failed to delete job');
      setMessageType('error');
    }
  };

  const getStatusBadge = (status) => {
    if (status === 'active') {
      return { bg: '#d4edda', color: '#155724', text: 'Active' };
    } else if (status === 'pending') {
      return { bg: '#fff3cd', color: '#856404', text: 'Pending' };
    } else if (status === 'closed') {
      return { bg: '#f8d7da', color: '#721c24', text: 'Closed' };
    }
    return { bg: '#e5e7eb', color: '#374151', text: status || 'Draft' };
  };

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
        {/* Header */}
        <div style={{ marginBottom: '30px', animation: 'slideInUp 0.5s ease-out' }}>
          <h1 style={{ fontSize: '28px', color: '#1E3A5F', fontWeight: '600', marginBottom: '5px' }}>
            <i className="fas fa-briefcase" style={{ marginRight: '10px' }}></i>
            My Jobs
          </h1>
          <p style={{ color: '#666' }}>Manage your posted jobs - edit, update, or remove listings</p>
        </div>

        {/* Message */}
        {message && (
          <div style={{
            background: messageType === 'success' ? '#d4edda' : '#f8d7da',
            color: messageType === 'success' ? '#155724' : '#721c24',
            padding: '15px 20px',
            borderRadius: '12px',
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            animation: 'slideInUp 0.3s ease-out'
          }}>
            <i className={`fas ${messageType === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}`}></i>
            <span>{message}</span>
          </div>
        )}

        {/* Stats Summary */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(4, 1fr)',
          gap: '20px',
          marginBottom: '30px'
        }}>
          <div className="stat-card" style={{ background: 'white', borderRadius: '16px', padding: '20px', textAlign: 'center' }}>
            <h3 style={{ fontSize: '28px', color: '#1E3A5F' }}>{jobs.length}</h3>
            <p style={{ color: '#666' }}>Total Jobs</p>
          </div>
          <div className="stat-card" style={{ background: 'white', borderRadius: '16px', padding: '20px', textAlign: 'center' }}>
            <h3 style={{ fontSize: '28px', color: '#16a34a' }}>{jobs.filter(j => j.status === 'active').length}</h3>
            <p style={{ color: '#666' }}>Active</p>
          </div>
          <div className="stat-card" style={{ background: 'white', borderRadius: '16px', padding: '20px', textAlign: 'center' }}>
            <h3 style={{ fontSize: '28px', color: '#f59e0b' }}>{jobs.filter(j => j.status === 'pending').length}</h3>
            <p style={{ color: '#666' }}>Pending</p>
          </div>
          <div className="stat-card" style={{ background: 'white', borderRadius: '16px', padding: '20px', textAlign: 'center' }}>
            <h3 style={{ fontSize: '28px', color: '#ef4444' }}>{jobs.reduce((sum, j) => sum + (j.applicantsCount || 0), 0)}</h3>
            <p style={{ color: '#666' }}>Total Applicants</p>
          </div>
        </div>

        {/* Jobs List */}
        {jobs.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '60px', animation: 'slideInUp 0.6s ease-out' }}>
            <i className="fas fa-briefcase" style={{ fontSize: '64px', color: '#ccc', marginBottom: '20px' }}></i>
            <h3 style={{ color: '#666', marginBottom: '10px' }}>No jobs posted yet</h3>
            <p style={{ color: '#999', marginBottom: '20px' }}>Click "Post a Job" to create your first job listing</p>
            <button 
              onClick={() => window.location.href = '/employer-post-job'}
              className="btn btn-primary"
              style={{ padding: '12px 24px' }}
            >
              <i className="fas fa-plus" style={{ marginRight: '8px' }}></i>
              Post a Job
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {jobs.map((job, index) => {
              const status = getStatusBadge(job.status);
              return (
                <div key={job.id} className="card" style={{
                  background: 'white',
                  borderRadius: '16px',
                  padding: '24px',
                  transition: 'transform 0.2s ease, box-shadow 0.2s ease',
                  animation: `slideInUp ${0.6 + index * 0.1}s ease-out`
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = 'translateY(-2px)';
                  e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.12)';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = 'translateY(0)';
                  e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.08)';
                }}>
                  {/* Job Header */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '16px', flexWrap: 'wrap', gap: '10px' }}>
                    <div>
                      <h3 style={{ fontSize: '20px', fontWeight: '600', color: '#1E3A5F', marginBottom: '4px' }}>
                        {job.title}
                      </h3>
                      <p style={{ color: '#666', fontSize: '14px' }}>
                        <i className="fas fa-building" style={{ marginRight: '6px' }}></i>
                        {job.department || 'Department'}
                      </p>
                    </div>
                    <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                      <span className="badge" style={{
                        background: status.bg,
                        color: status.color,
                        padding: '6px 14px',
                        borderRadius: '20px',
                        fontSize: '12px',
                        fontWeight: '600'
                      }}>
                        {status.text}
                      </span>
                      <button
                        onClick={() => setShowDeleteConfirm(job.id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: '#ef4444',
                          cursor: 'pointer',
                          padding: '8px',
                          borderRadius: '8px',
                          transition: 'background 0.2s ease'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = '#fee2e2'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                      >
                        <i className="fas fa-trash" style={{ fontSize: '18px' }}></i>
                      </button>
                    </div>
                  </div>

                  {/* Job Details */}
                  <div style={{ display: 'flex', gap: '20px', marginBottom: '16px', flexWrap: 'wrap' }}>
                    {job.type && (
                      <span style={{ fontSize: '13px', color: '#666' }}>
                        <i className="fas fa-clock" style={{ marginRight: '4px' }}></i>
                        {job.type}
                      </span>
                    )}
                    {job.hours && (
                      <span style={{ fontSize: '13px', color: '#666' }}>
                        <i className="fas fa-hourglass-half" style={{ marginRight: '4px' }}></i>
                        {job.hours}
                      </span>
                    )}
                    {job.salary && (
                      <span style={{ fontSize: '13px', color: '#666' }}>
                        <i className="fas fa-money-bill-alt" style={{ marginRight: '4px' }}></i>
                        {job.salary}
                      </span>
                    )}
                    {job.location && (
                      <span style={{ fontSize: '13px', color: '#666' }}>
                        <i className="fas fa-map-marker-alt" style={{ marginRight: '4px' }}></i>
                        {job.location}
                      </span>
                    )}
                    {job.applicantsCount !== undefined && (
                      <span style={{ fontSize: '13px', color: '#1E3A5F' }}>
                        <i className="fas fa-users" style={{ marginRight: '4px' }}></i>
                        {job.applicantsCount} applicants
                      </span>
                    )}
                  </div>

                  {/* Description Preview */}
                  {job.description && (
                    <p style={{ color: '#666', fontSize: '14px', marginBottom: '16px', lineHeight: '1.5' }}>
                      {job.description.length > 150 ? job.description.substring(0, 150) + '...' : job.description}
                    </p>
                  )}

                  {/* Skills */}
                  {job.skills && job.skills.length > 0 && (
                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
                      {job.skills.slice(0, 5).map((skill, idx) => (
                        <span key={idx} className="skill-tag" style={{
                          background: '#E8F0FE',
                          color: '#1E3A5F',
                          padding: '4px 12px',
                          borderRadius: '20px',
                          fontSize: '12px'
                        }}>
                          {skill}
                        </span>
                      ))}
                      {job.skills.length > 5 && (
                        <span style={{ fontSize: '12px', color: '#666' }}>+{job.skills.length - 5} more</span>
                      )}
                    </div>
                  )}

                  {/* Action Buttons */}
                  <div style={{ display: 'flex', gap: '12px', justifyContent: 'flex-end', borderTop: '1px solid #e5e7eb', paddingTop: '16px', marginTop: '8px' }}>
                    <button
                      onClick={() => handleEditClick(job)}
                      className="btn btn-outline"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '8px 20px'
                      }}
                    >
                      <i className="fas fa-edit"></i>
                      Edit Job
                    </button>
                    <button
                      onClick={() => window.location.href = `/employer-applicants?jobId=${job.id}`}
                      className="btn btn-primary"
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '6px',
                        padding: '8px 20px'
                      }}
                    >
                      <i className="fas fa-users"></i>
                      View Applicants
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* Edit Modal */}
      {showEditModal && editingJob && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          backdropFilter: 'blur(4px)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          animation: 'fadeIn 0.3s ease-out'
        }} onClick={() => setShowEditModal(false)}>
          <div style={{
            background: 'white',
            borderRadius: '20px',
            width: '90%',
            maxWidth: '700px',
            maxHeight: '90vh',
            overflow: 'auto',
            padding: '30px',
            animation: 'slideInUp 0.3s ease-out'
          }} onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
              <h2 style={{ fontSize: '24px', color: '#1E3A5F' }}>
                <i className="fas fa-edit" style={{ marginRight: '10px' }}></i>
                Edit Job
              </h2>
              <button
                onClick={() => setShowEditModal(false)}
                style={{
                  background: 'none',
                  border: 'none',
                  fontSize: '24px',
                  cursor: 'pointer',
                  color: '#666'
                }}
              >
                ×
              </button>
            </div>

            <div style={{ display: 'grid', gap: '20px' }}>
              <div>
                <label className="input-label">Job Title</label>
                <input
                  type="text"
                  name="title"
                  value={editForm.title}
                  onChange={handleEditChange}
                  className="input-field"
                  style={{ paddingLeft: '1rem' }}
                />
              </div>

              <div>
                <label className="input-label">Department</label>
                <select
                  name="department"
                  value={editForm.department}
                  onChange={handleEditChange}
                  className="input-field"
                  style={{ paddingLeft: '1rem' }}
                >
                  <option value="">Select Department</option>
                  <option>Computer Science</option>
                  <option>Physics</option>
                  <option>Chemistry</option>
                  <option>Mathematics</option>
                  <option>Biology</option>
                  <option>Geology</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                  <label className="input-label">Job Type</label>
                  <select
                    name="type"
                    value={editForm.type}
                    onChange={handleEditChange}
                    className="input-field"
                    style={{ paddingLeft: '1rem' }}
                  >
                    <option>Part-Time</option>
                    <option>Full-Time</option>
                    <option>Internship</option>
                    <option>Research Assistant</option>
                    <option>Teaching Assistant</option>
                    <option>Lab Assistant</option>
                  </select>
                </div>

                <div>
                  <label className="input-label">Location</label>
                  <input
                    type="text"
                    name="location"
                    value={editForm.location}
                    onChange={handleEditChange}
                    className="input-field"
                    style={{ paddingLeft: '1rem' }}
                    placeholder="Building, Room number"
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                  <label className="input-label">Salary</label>
                  <input
                    type="text"
                    name="salary"
                    value={editForm.salary}
                    onChange={handleEditChange}
                    className="input-field"
                    style={{ paddingLeft: '1rem' }}
                    placeholder="2000 EGP/mo"
                  />
                </div>

                <div>
                  <label className="input-label">Hours</label>
                  <input
                    type="text"
                    name="hours"
                    value={editForm.hours}
                    onChange={handleEditChange}
                    className="input-field"
                    style={{ paddingLeft: '1rem' }}
                    placeholder="15 hrs/week"
                  />
                </div>
              </div>

              <div>
                <label className="input-label">Job Description</label>
                <textarea
                  name="description"
                  value={editForm.description}
                  onChange={handleEditChange}
                  rows="4"
                  className="input-field"
                  style={{ paddingLeft: '1rem', resize: 'vertical' }}
                  placeholder="Describe the job responsibilities and expectations..."
                />
              </div>

              <div>
                <label className="input-label">Requirements</label>
                <div style={{ display: 'flex', gap: '10px', marginBottom: '10px' }}>
                  <input
                    type="text"
                    id="newRequirement"
                    placeholder="e.g., GPA > 3.0, Python experience..."
                    style={{
                      flex: 1,
                      padding: '10px',
                      border: '1px solid #ddd',
                      borderRadius: '8px',
                      fontSize: '14px'
                    }}
                    onKeyPress={(e) => e.key === 'Enter' && handleAddRequirement()}
                  />
                  <button
                    type="button"
                    onClick={handleAddRequirement}
                    className="btn btn-primary"
                    style={{ padding: '10px 20px' }}
                  >
                    Add
                  </button>
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {editForm.requirements.map((req, idx) => (
                    <span key={idx} style={{
                      background: '#E6F0FA',
                      color: '#1E3A5F',
                      padding: '6px 12px',
                      borderRadius: '20px',
                      fontSize: '13px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}>
                      {req}
                      <button
                        type="button"
                        onClick={() => handleRemoveRequirement(idx)}
                        style={{ background: 'none', border: 'none', color: '#1E3A5F', cursor: 'pointer' }}
                      >
                        ×
                      </button>
                    </span>
                  ))}
                </div>
              </div>

              <div style={{ display: 'flex', gap: '15px', justifyContent: 'flex-end', marginTop: '20px' }}>
                <button
                  onClick={() => setShowEditModal(false)}
                  className="btn btn-outline"
                  style={{ padding: '12px 24px' }}
                >
                  Cancel
                </button>
                <button
                  onClick={handleUpdateJob}
                  className="btn btn-primary"
                  style={{ padding: '12px 24px' }}
                >
                  <i className="fas fa-save" style={{ marginRight: '8px' }}></i>
                  Save Changes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.5)',
          backdropFilter: 'blur(4px)',
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }} onClick={() => setShowDeleteConfirm(null)}>
          <div style={{
            background: 'white',
            borderRadius: '16px',
            padding: '30px',
            width: '400px',
            textAlign: 'center',
            animation: 'slideInUp 0.3s ease-out'
          }} onClick={(e) => e.stopPropagation()}>
            <i className="fas fa-exclamation-triangle" style={{ fontSize: '48px', color: '#ef4444', marginBottom: '20px' }}></i>
            <h3 style={{ fontSize: '20px', color: '#1E3A5F', marginBottom: '10px' }}>Delete Job?</h3>
            <p style={{ color: '#666', marginBottom: '25px' }}>This action cannot be undone. All applicants will be notified.</p>
            <div style={{ display: 'flex', gap: '15px', justifyContent: 'center' }}>
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="btn btn-outline"
                style={{ padding: '10px 24px' }}
              >
                Cancel
              </button>
              <button
                onClick={() => handleDeleteJob(showDeleteConfirm)}
                className="btn btn-danger"
                style={{ padding: '10px 24px' }}
              >
                <i className="fas fa-trash" style={{ marginRight: '8px' }}></i>
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EmployerMyJobs;
