import React, { useState, useEffect } from 'react';
import { likeJob, unlikeJob, getComments, addComment, getLikes } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';

const JobCard = ({ job, onSave, onApply, isSaved = false, onShare, showFullDetails = false }) => {
  const { user } = useAuth();
  const { darkMode } = useTheme();
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loadingComments, setLoadingComments] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [showShare, setShowShare] = useState(false);

  useEffect(() => {
    if (job?.id) {
      fetchLikes();
      fetchComments();
    }
  }, [job?.id]);

  const fetchLikes = async () => {
    try {
      const response = await getLikes(job.id);
      if (response?.data) {
        setLikesCount(response.data.count || 0);
        setLiked(response.data.userLiked || false);
      }
    } catch (error) {
      console.error('Error fetching likes:', error);
      setLikesCount(0);
      setLiked(false);
    }
  };

  const fetchComments = async () => {
    setLoadingComments(true);
    try {
      const response = await getComments(job.id);
      const commentsData = response.data?.data || response.data;
      setComments(Array.isArray(commentsData) ? commentsData : []);
    } catch (error) {
      console.error('Error fetching comments:', error);
      setComments([]);
    } finally {
      setLoadingComments(false);
    }
  };

  const handleLike = async () => {
    if (!user) {
      alert('Please login to like jobs');
      return;
    }
    
    try {
      if (liked) {
        await unlikeJob(job.id);
        setLikesCount(prev => prev - 1);
        setLiked(false);
      } else {
        await likeJob(job.id);
        setLikesCount(prev => prev + 1);
        setLiked(true);
      }
    } catch (error) {
      console.error('Error toggling like:', error);
      alert('Failed to update like');
    }
  };

  const handleAddComment = async () => {
    if (!user) {
      alert('Please login to comment');
      return;
    }
    
    if (!newComment.trim()) return;
    
    setSubmitting(true);
    try {
      await addComment(job.id, newComment);
      setNewComment('');
      await fetchComments();
    } catch (error) {
      console.error('Error adding comment:', error);
      alert('Failed to add comment');
    } finally {
      setSubmitting(false);
    }
  };

  const handleShare = (platform) => {
    const url = `${window.location.origin}/job/${job.id}`;
    const text = `Check out this job: ${job.title} at ${job.department}`;
    
    switch(platform) {
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'whatsapp':
        window.open(`https://wa.me/?text=${encodeURIComponent(text + ' ' + url)}`, '_blank');
        break;
      case 'copy':
        navigator.clipboard.writeText(url);
        alert('Link copied to clipboard!');
        break;
      default:
        break;
    }
    setShowShare(false);
    if (onShare) onShare(job.id);
  };

  const getMatchColor = (match) => {
    if (match >= 90) return { bg: '#d4edda', color: '#155724' };
    if (match >= 80) return { bg: '#fff3cd', color: '#856404' };
    return { bg: '#f8d7da', color: '#721c24' };
  };

  return (
    <div className="job-card" style={{
      background: darkMode ? '#1e293b' : 'white',
      borderRadius: '16px',
      padding: '20px',
      marginBottom: '16px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
      transition: 'transform 0.2s ease, box-shadow 0.2s ease',
      borderLeft: job.matchScore ? `4px solid ${getMatchColor(job.matchScore).color}` : 'none',
      position: 'relative'
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
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px', flexWrap: 'wrap', gap: '10px' }}>
        <h3 style={{ fontSize: '18px', fontWeight: '600', color: darkMode ? '#f1f5f9' : '#1E3A5F', marginBottom: '4px' }}>
          {job.title}
        </h3>
        {job.matchScore && (
          <span className="badge" style={{
            background: getMatchColor(job.matchScore).bg,
            color: getMatchColor(job.matchScore).color,
            padding: '4px 12px',
            borderRadius: '20px',
            fontSize: '12px',
            fontWeight: '600'
          }}>
            <i className="fas fa-percent" style={{ marginRight: '4px', fontSize: '10px' }}></i>
            {job.matchScore}% Match
          </span>
        )}
      </div>

      {/* Company/Department */}
      <p style={{ color: darkMode ? '#94a3b8' : '#666', fontSize: '14px', marginBottom: '8px' }}>
        <i className="fas fa-building" style={{ marginRight: '8px', color: darkMode ? '#818cf8' : '#1E3A5F' }}></i>
        {job.department || 'Department of Science'}
      </p>

      {/* Job Details */}
      <div style={{ display: 'flex', gap: '16px', marginBottom: '12px', flexWrap: 'wrap' }}>
        {job.hours && (
          <span style={{ fontSize: '13px', color: darkMode ? '#94a3b8' : '#666' }}>
            <i className="far fa-clock" style={{ marginRight: '4px' }}></i>
            {job.hours}
          </span>
        )}
        {job.salary && (
          <span style={{ fontSize: '13px', color: darkMode ? '#94a3b8' : '#666' }}>
            <i className="fas fa-money-bill-alt" style={{ marginRight: '4px' }}></i>
            {job.salary}
          </span>
        )}
        {job.location && (
          <span style={{ fontSize: '13px', color: darkMode ? '#94a3b8' : '#666' }}>
            <i className="fas fa-map-marker-alt" style={{ marginRight: '4px' }}></i>
            {job.location}
          </span>
        )}
        {job.deadline && (
          <span style={{ fontSize: '13px', color: '#ef4444' }}>
            <i className="far fa-calendar-alt" style={{ marginRight: '4px' }}></i>
            Deadline: {new Date(job.deadline).toLocaleDateString()}
          </span>
        )}
      </div>

      {/* Skills */}
      {job.skills && job.skills.length > 0 && (
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '16px' }}>
          {(showFullDetails ? job.skills : job.skills.slice(0, 4)).map((skill, idx) => (
            <span key={idx} className="skill-tag" style={{
              background: darkMode ? '#334155' : '#E8F0FE',
              color: darkMode ? '#e2e8f0' : '#1E3A5F',
              padding: '4px 12px',
              borderRadius: '20px',
              fontSize: '12px'
            }}>
              {skill}
            </span>
          ))}
          {job.skills.length > 4 && !showFullDetails && (
            <span style={{ fontSize: '12px', color: darkMode ? '#94a3b8' : '#666' }}>
              +{job.skills.length - 4} more
            </span>
          )}
        </div>
      )}

      {/* Description Preview */}
      {job.description && !showFullDetails && (
        <p style={{ color: darkMode ? '#94a3b8' : '#666', fontSize: '13px', marginBottom: '16px', lineHeight: '1.5' }}>
          {job.description.length > 120 ? job.description.substring(0, 120) + '...' : job.description}
        </p>
      )}

      {/* Action Buttons */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px' }}>
        {/* Left side: Like, Comment, Share */}
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={handleLike}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '13px',
              padding: '6px 12px',
              borderRadius: '20px',
              transition: 'all 0.2s ease',
              backgroundColor: liked ? '#fee2e2' : 'transparent',
              color: liked ? '#ef4444' : darkMode ? '#94a3b8' : '#666'
            }}
            onMouseEnter={(e) => {
              if (!liked) e.currentTarget.style.backgroundColor = darkMode ? '#334155' : '#f3f4f6';
            }}
            onMouseLeave={(e) => {
              if (!liked) e.currentTarget.style.backgroundColor = 'transparent';
            }}
          >
            <i className={`fas fa-heart`} style={{ color: liked ? '#ef4444' : (darkMode ? '#94a3b8' : '#666') }}></i>
            <span>{likesCount}</span>
          </button>
          
          <button
            onClick={() => setShowComments(!showComments)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              fontSize: '13px',
              padding: '6px 12px',
              borderRadius: '20px',
              transition: 'all 0.2s ease',
              color: darkMode ? '#94a3b8' : '#666'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = darkMode ? '#334155' : '#f3f4f6'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <i className="fas fa-comment"></i>
            <span>{comments.length}</span>
          </button>

          {/* Share Button */}
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setShowShare(!showShare)}
              style={{
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '13px',
                padding: '6px 12px',
                borderRadius: '20px',
                transition: 'all 0.2s ease',
                color: darkMode ? '#94a3b8' : '#666'
              }}
              onMouseEnter={(e) => e.currentTarget.style.backgroundColor = darkMode ? '#334155' : '#f3f4f6'}
              onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
            >
              <i className="fas fa-share-alt"></i>
              <span>Share</span>
            </button>
            
            {showShare && (
              <div style={{
                position: 'absolute',
                bottom: '100%',
                left: '0',
                marginBottom: '8px',
                background: darkMode ? '#1e293b' : 'white',
                borderRadius: '12px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
                padding: '8px',
                zIndex: 100,
                minWidth: '160px',
                border: `1px solid ${darkMode ? '#475569' : '#e0e0e0'}`
              }}>
                <button onClick={() => handleShare('linkedin')} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', width: '100%', background: 'none', border: 'none', cursor: 'pointer', color: darkMode ? '#e2e8f0' : '#333' }}>
                  <i className="fab fa-linkedin" style={{ color: '#0077B5' }}></i> LinkedIn
                </button>
                <button onClick={() => handleShare('twitter')} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', width: '100%', background: 'none', border: 'none', cursor: 'pointer', color: darkMode ? '#e2e8f0' : '#333' }}>
                  <i className="fab fa-twitter" style={{ color: '#1DA1F2' }}></i> Twitter
                </button>
                <button onClick={() => handleShare('facebook')} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', width: '100%', background: 'none', border: 'none', cursor: 'pointer', color: darkMode ? '#e2e8f0' : '#333' }}>
                  <i className="fab fa-facebook" style={{ color: '#4267B2' }}></i> Facebook
                </button>
                <button onClick={() => handleShare('whatsapp')} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', width: '100%', background: 'none', border: 'none', cursor: 'pointer', color: darkMode ? '#e2e8f0' : '#333' }}>
                  <i className="fab fa-whatsapp" style={{ color: '#25D366' }}></i> WhatsApp
                </button>
                <button onClick={() => handleShare('copy')} style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', width: '100%', background: 'none', border: 'none', cursor: 'pointer', color: darkMode ? '#e2e8f0' : '#333' }}>
                  <i className="fas fa-link"></i> Copy Link
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Right side: Save and Apply */}
        <div style={{ display: 'flex', gap: '10px' }}>
          {onSave && (
            <button
              onClick={() => onSave(job.id, isSaved)}
              style={{
                background: isSaved ? '#ef4444' : 'transparent',
                border: isSaved ? 'none' : `1px solid ${darkMode ? '#818cf8' : '#1E3A5F'}`,
                padding: '8px 16px',
                borderRadius: '8px',
                cursor: 'pointer',
                color: isSaved ? 'white' : (darkMode ? '#818cf8' : '#1E3A5F'),
                fontSize: '13px',
                fontWeight: '500',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
              onMouseEnter={(e) => {
                if (!isSaved) {
                  e.currentTarget.style.backgroundColor = darkMode ? '#818cf8' : '#1E3A5F';
                  e.currentTarget.style.color = 'white';
                }
              }}
              onMouseLeave={(e) => {
                if (!isSaved) {
                  e.currentTarget.style.backgroundColor = 'transparent';
                  e.currentTarget.style.color = darkMode ? '#818cf8' : '#1E3A5F';
                }
              }}
            >
              <i className={`fas ${isSaved ? 'fa-bookmark' : 'fa-bookmark'}`}></i>
              {isSaved ? 'Saved' : 'Save'}
            </button>
          )}
          
          <button
            onClick={() => onApply?.(job.id)}
            style={{ 
              padding: '8px 20px', 
              fontSize: '13px',
              background: 'linear-gradient(135deg, #1E3A5F, #2a4a7a)',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              transition: 'transform 0.2s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'scale(1.02)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'scale(1)'}
          >
            <i className="fas fa-paper-plane"></i>
            Apply Now
          </button>
        </div>
      </div>

      {/* Comments Section */}
      {showComments && (
        <div style={{ marginTop: '20px', paddingTop: '16px', borderTop: `1px solid ${darkMode ? '#334155' : '#e5e7eb'}` }}>
          <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px', color: darkMode ? '#f1f5f9' : '#1E3A5F' }}>
            <i className="fas fa-comments" style={{ marginRight: '6px' }}></i>
            Comments ({comments.length})
          </h4>
          
          <div style={{ marginBottom: '12px', display: 'flex', gap: '8px' }}>
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              style={{
                flex: 1,
                padding: '10px 14px',
                border: `1px solid ${darkMode ? '#475569' : '#e5e7eb'}`,
                borderRadius: '24px',
                fontSize: '13px',
                outline: 'none',
                background: darkMode ? '#0f172a' : 'white',
                color: darkMode ? '#e2e8f0' : '#333',
                transition: 'border-color 0.2s ease'
              }}
              onFocus={(e) => e.target.style.borderColor = '#1E3A5F'}
              onBlur={(e) => e.target.style.borderColor = darkMode ? '#475569' : '#e5e7eb'}
              onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
            />
            <button
              onClick={handleAddComment}
              disabled={submitting || !newComment.trim()}
              style={{
                padding: '10px 20px',
                background: '#1E3A5F',
                color: 'white',
                border: 'none',
                borderRadius: '24px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: '500',
                opacity: submitting || !newComment.trim() ? 0.6 : 1,
                transition: 'opacity 0.2s ease'
              }}
            >
              {submitting ? 'Posting...' : 'Post'}
            </button>
          </div>

          {loadingComments ? (
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <div className="spinner" style={{ width: '24px', height: '24px', margin: '0 auto', border: '2px solid #f3f3f3', borderTop: '2px solid #1E3A5F', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
              <p style={{ fontSize: '12px', color: darkMode ? '#94a3b8' : '#999', marginTop: '8px' }}>Loading comments...</p>
            </div>
          ) : comments.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '20px' }}>
              <i className="fas fa-comment-slash" style={{ fontSize: '24px', color: darkMode ? '#475569' : '#ccc', marginBottom: '8px' }}></i>
              <p style={{ fontSize: '13px', color: darkMode ? '#94a3b8' : '#999' }}>No comments yet. Be the first to comment!</p>
            </div>
          ) : (
            <div style={{ maxHeight: '250px', overflowY: 'auto' }}>
              {comments.map((comment) => (
                <div key={comment.id} style={{
                  padding: '10px 0',
                  borderBottom: `1px solid ${darkMode ? '#334155' : '#f0f0f0'}`
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                    <strong style={{ color: darkMode ? '#f1f5f9' : '#1E3A5F', fontSize: '13px' }}>
                      <i className="fas fa-user-circle" style={{ marginRight: '4px' }}></i>
                      {comment.studentName || 'Anonymous'}
                    </strong>
                    <span style={{ fontSize: '10px', color: darkMode ? '#64748b' : '#999' }}>
                      {comment.createdAt ? new Date(comment.createdAt).toLocaleDateString() : 'Just now'}
                    </span>
                  </div>
                  <p style={{ margin: 0, fontSize: '13px', color: darkMode ? '#94a3b8' : '#666', lineHeight: '1.4' }}>
                    {comment.comment}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default JobCard;
