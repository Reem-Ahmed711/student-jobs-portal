// C:\Student-job-portal\Frontend\src\components\SocialInteractions.jsx
import React, { useState, useEffect, useRef } from 'react';
import { likeJob, unlikeJob, getLikes, addComment, getComments, deleteComment } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { useNavigate } from 'react-router-dom';

const SocialInteractions = ({ jobId, onInteraction, showShare = true, showCounts = true, compact = false }) => {
  const { user } = useAuth();
  const { darkMode } = useTheme();
  const navigate = useNavigate();
  const commentsRef = useRef(null);
  
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [likesLoading, setLikesLoading] = useState(false);
  const [commentToDelete, setCommentToDelete] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (jobId) {
      fetchLikes();
      fetchComments();
    }
  }, [jobId]);

  // Close comments when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showComments && commentsRef.current && !commentsRef.current.contains(event.target)) {
        setShowComments(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showComments]);

  const fetchLikes = async () => {
    setLikesLoading(true);
    try {
      const response = await getLikes(jobId);
      setLikesCount(response.data?.count || 0);
      setLiked(response.data?.userLiked || false);
    } catch (error) {
      console.error('Error fetching likes:', error);
    } finally {
      setLikesLoading(false);
    }
  };

  const fetchComments = async () => {
    try {
      const response = await getComments(jobId);
      const commentsData = response.data?.data || response.data || [];
      setComments(commentsData);
    } catch (error) {
      console.error('Error fetching comments:', error);
      setComments([]);
    }
  };

  const handleLike = async () => {
    if (!user) {
      alert('Please login to like jobs');
      navigate('/login');
      return;
    }
    
    setLikesLoading(true);
    try {
      if (liked) {
        await unlikeJob(jobId);
        setLikesCount(prev => prev - 1);
        setLiked(false);
      } else {
        await likeJob(jobId);
        setLikesCount(prev => prev + 1);
        setLiked(true);
      }
      if (onInteraction) onInteraction();
    } catch (error) {
      console.error('Error toggling like:', error);
      alert('Failed to update like. Please try again.');
    } finally {
      setLikesLoading(false);
    }
  };

  const handleAddComment = async () => {
    if (!user) {
      alert('Please login to comment');
      navigate('/login');
      return;
    }
    
    if (!newComment.trim()) return;
    
    setLoading(true);
    try {
      await addComment(jobId, newComment);
      setNewComment('');
      await fetchComments();
      if (onInteraction) onInteraction();
    } catch (error) {
      console.error('Error adding comment:', error);
      alert('Failed to add comment');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (!window.confirm('Are you sure you want to delete this comment?')) return;
    
    try {
      await deleteComment(commentId);
      await fetchComments();
      setCommentToDelete(null);
    } catch (error) {
      console.error('Error deleting comment:', error);
      alert('Failed to delete comment');
    }
  };

  const handleShare = async () => {
    const url = `${window.location.origin}/job/${jobId}`;
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      alert('Failed to copy link');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays < 7) return `${diffDays}d`;
    return date.toLocaleDateString();
  };

  if (!jobId) return null;

  if (compact) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        <button
          onClick={handleLike}
          disabled={likesLoading}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '4px 8px',
            borderRadius: '20px',
            backgroundColor: liked ? '#fee2e2' : 'transparent',
            opacity: likesLoading ? 0.6 : 1
          }}
        >
          <i className="fas fa-heart" style={{ color: liked ? '#ef4444' : '#9ca3af', fontSize: '12px' }}></i>
          {showCounts && <span style={{ fontSize: '11px', color: liked ? '#ef4444' : '#6b7280' }}>{likesCount}</span>}
        </button>
        
        <button
          onClick={() => setShowComments(!showComments)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '5px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '4px 8px',
            borderRadius: '20px'
          }}
        >
          <i className="fas fa-comment" style={{ color: '#6b7280', fontSize: '12px' }}></i>
          {showCounts && <span style={{ fontSize: '11px', color: '#6b7280' }}>{comments.length}</span>}
        </button>
        
        {showShare && (
          <button
            onClick={handleShare}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '4px 8px',
              borderRadius: '20px'
            }}
          >
            <i className="fas fa-share-alt" style={{ color: '#6b7280', fontSize: '12px' }}></i>
          </button>
        )}
      </div>
    );
  }

  return (
    <div style={{ position: 'relative' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginTop: '15px' }}>
        {/* Like Button */}
        <button
          onClick={handleLike}
          disabled={likesLoading}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '8px 16px',
            borderRadius: '30px',
            transition: 'all 0.2s ease',
            backgroundColor: liked ? (darkMode ? '#2d2a6e' : '#fee2e2') : 'transparent',
            opacity: likesLoading ? 0.6 : 1
          }}
          onMouseEnter={(e) => {
            if (!liked && !likesLoading) {
              e.currentTarget.style.backgroundColor = darkMode ? '#334155' : '#f3f4f6';
            }
          }}
          onMouseLeave={(e) => {
            if (!liked && !likesLoading) {
              e.currentTarget.style.backgroundColor = 'transparent';
            }
          }}
        >
          <i className={`fas fa-heart`} style={{ 
            color: liked ? '#ef4444' : (darkMode ? '#94a3b8' : '#9ca3af'),
            fontSize: '16px'
          }}></i>
          {showCounts && (
            <span style={{ 
              color: liked ? '#ef4444' : (darkMode ? '#94a3b8' : '#6b7280'),
              fontSize: '14px',
              fontWeight: '500'
            }}>
              {likesCount}
            </span>
          )}
        </button>

        {/* Comments Button */}
        <button
          onClick={() => setShowComments(!showComments)}
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            background: 'none',
            border: 'none',
            cursor: 'pointer',
            padding: '8px 16px',
            borderRadius: '30px',
            transition: 'background 0.2s ease'
          }}
          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = darkMode ? '#334155' : '#f3f4f6'}
          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
        >
          <i className="fas fa-comment" style={{ color: darkMode ? '#94a3b8' : '#6b7280', fontSize: '16px' }}></i>
          {showCounts && (
            <span style={{ color: darkMode ? '#94a3b8' : '#6b7280', fontSize: '14px' }}>
              {comments.length}
            </span>
          )}
        </button>

        {/* Share Button */}
        {showShare && (
          <button
            onClick={handleShare}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '8px 16px',
              borderRadius: '30px',
              position: 'relative',
              transition: 'background 0.2s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = darkMode ? '#334155' : '#f3f4f6'}
            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
          >
            <i className="fas fa-share-alt" style={{ color: darkMode ? '#94a3b8' : '#6b7280', fontSize: '16px' }}></i>
            {copied && (
              <span style={{
                position: 'absolute',
                top: '-30px',
                left: '50%',
                transform: 'translateX(-50%)',
                background: '#10b981',
                color: 'white',
                padding: '4px 8px',
                borderRadius: '20px',
                fontSize: '11px',
                whiteSpace: 'nowrap',
                animation: 'fadeInOut 2s ease'
              }}>
                Copied!
              </span>
            )}
          </button>
        )}
      </div>

      {/* Comments Section Popup */}
      {showComments && (
        <div 
          ref={commentsRef}
          style={{
            position: 'absolute',
            top: '100%',
            left: 0,
            background: darkMode ? '#1e293b' : 'white',
            borderRadius: '16px',
            padding: '16px',
            boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
            zIndex: 100,
            width: '320px',
            maxHeight: '350px',
            overflowY: 'auto',
            marginTop: '10px',
            border: `1px solid ${darkMode ? '#334155' : '#e0e0e0'}`
          }}
        >
          <h4 style={{ 
            fontSize: '14px', 
            fontWeight: '600', 
            marginBottom: '15px',
            color: darkMode ? '#f1f5f9' : '#1E3A5F',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <i className="fas fa-comments"></i>
            Comments ({comments.length})
          </h4>
          
          {/* Add Comment Input */}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '16px' }}>
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              style={{
                flex: 1,
                padding: '10px 14px',
                border: `1px solid ${darkMode ? '#475569' : '#ddd'}`,
                borderRadius: '30px',
                fontSize: '13px',
                outline: 'none',
                background: darkMode ? '#0f172a' : 'white',
                color: darkMode ? '#e2e8f0' : '#333'
              }}
              onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
            />
            <button
              onClick={handleAddComment}
              disabled={loading || !newComment.trim()}
              style={{
                padding: '10px 20px',
                background: '#1E3A5F',
                color: 'white',
                border: 'none',
                borderRadius: '30px',
                cursor: 'pointer',
                fontSize: '13px',
                fontWeight: '500',
                opacity: loading || !newComment.trim() ? 0.6 : 1,
                transition: 'opacity 0.2s ease'
              }}
            >
              {loading ? '...' : 'Post'}
            </button>
          </div>

          {/* Comments List */}
          {comments.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '30px 20px' }}>
              <i className="fas fa-comment-slash" style={{ fontSize: '32px', color: '#ccc', marginBottom: '10px', display: 'block' }}></i>
              <p style={{ fontSize: '13px', color: darkMode ? '#94a3b8' : '#999' }}>No comments yet</p>
              <p style={{ fontSize: '11px', color: '#ccc' }}>Be the first to comment!</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {comments.map(comment => (
                <div key={comment.id} style={{
                  padding: '10px 0',
                  borderBottom: `1px solid ${darkMode ? '#334155' : '#f0f0f0'}`,
                  position: 'relative'
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <strong style={{ fontSize: '12px', color: darkMode ? '#f1f5f9' : '#1E3A5F' }}>
                        <i className="fas fa-user-circle" style={{ marginRight: '4px' }}></i>
                        {comment.userName || comment.user?.name || 'Anonymous'}
                      </strong>
                      <span style={{ fontSize: '10px', color: darkMode ? '#94a3b8' : '#999' }}>
                        {formatDate(comment.createdAt)}
                      </span>
                    </div>
                    
                    {/* Delete button (only for own comments) */}
                    {(comment.userId === user?.uid || user?.role === 'admin') && (
                      <button
                        onClick={() => handleDeleteComment(comment.id)}
                        style={{
                          background: 'none',
                          border: 'none',
                          color: darkMode ? '#94a3b8' : '#999',
                          cursor: 'pointer',
                          fontSize: '12px',
                          padding: '4px',
                          borderRadius: '4px',
                          transition: 'color 0.2s ease'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.color = '#ef4444'}
                        onMouseLeave={(e) => e.currentTarget.style.color = darkMode ? '#94a3b8' : '#999'}
                      >
                        <i className="fas fa-trash-alt"></i>
                      </button>
                    )}
                  </div>
                  <p style={{ 
                    margin: 0, 
                    fontSize: '13px', 
                    color: darkMode ? '#e2e8f0' : '#555',
                    lineHeight: '1.4',
                    wordBreak: 'break-word'
                  }}>
                    {comment.text || comment.comment}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      <style>{`
        @keyframes fadeInOut {
          0% { opacity: 0; transform: translateX(-50%) translateY(5px); }
          15% { opacity: 1; transform: translateX(-50%) translateY(0); }
          85% { opacity: 1; transform: translateX(-50%) translateY(0); }
          100% { opacity: 0; transform: translateX(-50%) translateY(-5px); }
        }
      `}</style>
    </div>
  );
};

export default SocialInteractions;
