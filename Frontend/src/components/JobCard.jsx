// C:\Student-job-portal\Frontend\src\components\JobCard.jsx
import React, { useState } from 'react';
import { saveJob, unsaveJob, applyForJob } from '../services/api';
import { useNavigate } from 'react-router-dom';

const JobCard = ({ job, onApply, onSave, isSaved: initialSaved = false }) => {
  const [isSaved, setIsSaved] = useState(initialSaved);
  const [isHovered, setIsHovered] = useState(false);
  const [loading, setLoading] = useState(false);
  const [applyLoading, setApplyLoading] = useState(false);
  const navigate = useNavigate();

  const getMatchClass = (match) => {
    if (match >= 90) return 'high-match';
    if (match >= 80) return 'medium-match';
    return 'low-match';
  };

  const getMatchColor = (match) => {
    if (match >= 90) return '#16a34a';
    if (match >= 80) return '#f59e0b';
    return '#ef4444';
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      if (isSaved) {
        await unsaveJob(job.id);
        setIsSaved(false);
      } else {
        await saveJob(job.id);
        setIsSaved(true);
      }
      if (onSave) {
        onSave(job.id, !isSaved);
      }
    } catch (error) {
      console.error('Failed to save/unsave job:', error);
      alert('Failed to save job. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async () => {
    setApplyLoading(true);
    try {
      await applyForJob({ jobId: job.id });
      alert('Application submitted successfully!');
      
      if (onApply) {
        onApply(job.id);
      }

    } catch (error) {
      console.error('Failed to apply for job:', error);
      alert('Failed to apply. Please try again.');
    } finally {
      setApplyLoading(false);
    }
  };

  const handleViewDetails = () => {
    navigate(`/job/${job.id}`);
  };

  return (
    <div 
      className={`job-card ${getMatchClass(job.match)}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        transform: isHovered ? 'translateY(-4px)' : 'none',
        boxShadow: isHovered ? '0 20px 25px -5px rgba(0,0,0,0.1)' : '0 4px 6px -1px rgba(0,0,0,0.1)',
        transition: 'all 0.3s ease',
        background: 'white',
        borderRadius: '12px',
        padding: '1.5rem',
        position: 'relative',
        border: job.urgent ? '2px solid #ef4444' : 'none'
      }}
    >
      {job.urgent && (
        <span style={{
          position: 'absolute',
          top: '-10px',
          right: '20px',
          background: '#ef4444',
          color: 'white',
          padding: '4px 12px',
          borderRadius: '20px',
          fontSize: '12px',
          fontWeight: '600'
        }}>
          URGENT
        </span>
      )}

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '1rem' }}>
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
            <h3 style={{ color: '#1E3A5F', fontSize: '1.2rem', fontWeight: '600' }}>{job.title}</h3>
            <span style={{
              background: `${getMatchColor(job.match)}20`,
              color: getMatchColor(job.match),
              padding: '0.25rem 0.75rem',
              borderRadius: '20px',
              fontSize: '0.85rem',
              fontWeight: '600'
            }}>
              {job.match}% Match
            </span>
            {job.type && (
              <span style={{
                background: '#E6F0FA',
                color: '#1E3A5F',
                padding: '0.25rem 0.75rem',
                borderRadius: '20px',
                fontSize: '0.85rem'
              }}>
                {job.type}
              </span>
            )}
          </div>
          <p style={{ color: '#666', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
            <i className="fas fa-building" style={{ marginRight: '0.5rem', color: '#1E3A5F' }}></i>
            {job.department}
          </p>
          <p style={{ color: '#999', fontSize: '0.9rem', marginBottom: '0.75rem' }}>
            <i className="fas fa-map-marker-alt" style={{ marginRight: '0.5rem', color: '#1E3A5F' }}></i>
            {job.location || 'Cairo University'}
          </p>
          <div style={{ display: 'flex', gap: '1rem', marginBottom: '0.75rem', flexWrap: 'wrap' }}>
            {job.skills?.slice(0, 3).map((skill, index) => (
              <span key={index} className="skill-tag" style={{
                background: '#f0f0f0',
                padding: '4px 10px',
                borderRadius: '20px',
                fontSize: '12px',
                color: '#555'
              }}>
                {skill}
              </span>
            ))}
            {job.skills?.length > 3 && (
              <span className="skill-tag" style={{
                background: '#f0f0f0',
                padding: '4px 10px',
                borderRadius: '20px',
                fontSize: '12px',
                color: '#555'
              }}>
                +{job.skills.length - 3}
              </span>
            )}
          </div>
        </div>
      </div>

      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        flexWrap: 'wrap',
        gap: '1rem',
        marginTop: '1rem'
      }}>
        <div style={{ display: 'flex', gap: '1.5rem', color: '#666', fontSize: '0.9rem', flexWrap: 'wrap' }}>
          <span>
            <i className="far fa-clock" style={{ marginRight: '0.5rem', color: '#1E3A5F' }}></i>
            {job.hours}
          </span>
          <span>
            <i className="far fa-calendar-alt" style={{ marginRight: '0.5rem', color: '#1E3A5F' }}></i>
            {job.deadline}
          </span>
          <span>
            <i className="fas fa-money-bill-alt" style={{ marginRight: '0.5rem', color: '#1E3A5F' }}></i>
            {job.salary}
          </span>
        </div>

        <div style={{ display: 'flex', gap: '0.75rem' }}>
          <button
            onClick={handleSave}
            disabled={loading}
            className="btn btn-outline"
            style={{
              padding: '0.5rem 1rem',
              fontSize: '0.9rem',
              opacity: loading ? 0.7 : 1,
              cursor: loading ? 'not-allowed' : 'pointer',
              background: 'white',
              color: '#1E3A5F',
              border: '1px solid #1E3A5F',
              borderRadius: '6px',
              display: 'flex',
              alignItems: 'center',
              gap: '0.5rem'
            }}
          >
            <i className={`fa${isSaved ? 's' : 'r'} fa-bookmark`}></i>
            {loading ? 'Saving...' : (isSaved ? 'Saved' : 'Save')}
          </button>
          <button
            onClick={handleApply}
            disabled={applyLoading}
            className="btn btn-primary"
            style={{
              padding: '0.5rem 1.5rem',
              fontSize: '0.9rem',
              background: '#1E3A5F',
              color: 'white',
              border: 'none',
              borderRadius: '6px',
              cursor: applyLoading ? 'not-allowed' : 'pointer',
              opacity: applyLoading ? 0.7 : 1
            }}
          >
            {applyLoading ? 'Applying...' : 'Quick Apply'}
          </button>
          <button
            onClick={handleViewDetails}
            className="btn btn-outline"
            style={{
              padding: '0.5rem 1rem',
              fontSize: '0.9rem',
              background: 'white',
              color: '#1E3A5F',
              border: '1px solid #1E3A5F',
              borderRadius: '6px'
            }}
          >
            <i className="fas fa-eye"></i>
          </button>
        </div>
      </div>

      {job.description && (
        <p style={{
          marginTop: '1rem',
          paddingTop: '1rem',
          borderTop: '1px solid #e5e7eb',
          color: '#666',
          fontSize: '0.9rem',
          lineHeight: '1.5'
        }}>
          {job.description}
        </p>
      )}
    </div>
  );
};

export default JobCard;