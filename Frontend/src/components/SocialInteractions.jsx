// C:\Student-job-portal\Frontend\src\components\SocialInteractions.jsx
import React, { useState, useEffect } from 'react';
import { likeJob, unlikeJob, getLikes, addComment, getComments } from '../services/api';
import { useAuth } from '../context/AuthContext';

const SocialInteractions = ({ jobId, onInteraction }) => {
  const { user } = useAuth();
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (jobId) {
      fetchLikes();
      fetchComments();
    }
  }, [jobId]);

  const fetchLikes = async () => {
    try {
      const response = await getLikes(jobId);
      setLikesCount(response.data?.count || 0);
      setLiked(response.data?.userLiked || false);
    } catch (error) {
      console.error('Error fetching likes:', error);
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
      alert('Please login to like');
      return;
    }
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
    }
  };

  const handleAddComment = async () => {
    if (!user) {
      alert('Please login to comment');
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

  if (!jobId) return null;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '20px', marginTop: '15px' }}>
      {/* Like Button */}
      <button
        onClick={handleLike}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '6px 12px',
          borderRadius: '20px',
          backgroundColor: liked ? '#fee2e2' : 'transparent'
        }}
      >
        <i className="fas fa-heart" style={{ color: liked ? '#ef4444' : '#9ca3af' }}></i>
        <span style={{ color: liked ? '#ef4444' : '#6b7280' }}>{likesCount}</span>
      </button>

      {/* Comments Button */}
      <button
        onClick={() => setShowComments(!showComments)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '6px',
          background: 'none',
          border: 'none',
          cursor: 'pointer',
          padding: '6px 12px',
          borderRadius: '20px'
        }}
      >
        <i className="fas fa-comment" style={{ color: '#6b7280' }}></i>
        <span style={{ color: '#6b7280' }}>{comments.length}</span>
      </button>

      {/* Comments Section Popup */}
      {showComments && (
        <div style={{
          position: 'absolute',
          background: 'white',
          borderRadius: '12px',
          padding: '15px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
          zIndex: 10,
          width: '300px',
          maxHeight: '250px',
          overflowY: 'auto',
          marginTop: '35px'
        }}>
          <h4 style={{ fontSize: '14px', fontWeight: '600', marginBottom: '12px' }}>Comments ({comments.length})</h4>
          
          <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Write a comment..."
              style={{ flex: 1, padding: '8px 12px', border: '1px solid #ddd', borderRadius: '20px', fontSize: '13px', outline: 'none' }}
              onKeyPress={(e) => e.key === 'Enter' && handleAddComment()}
            />
            <button
              onClick={handleAddComment}
              disabled={loading || !newComment.trim()}
              style={{ padding: '6px 12px', background: '#1E3A5F', color: 'white', border: 'none', borderRadius: '20px', cursor: 'pointer' }}
            >
              Post
            </button>
          </div>

          {comments.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#999', fontSize: '13px', padding: '20px' }}>No comments yet</p>
          ) : (
            comments.map(comment => (
              <div key={comment.id} style={{ padding: '8px 0', borderBottom: '1px solid #eee' }}>
                <strong style={{ fontSize: '12px', color: '#1E3A5F' }}>{comment.userName || 'Anonymous'}</strong>
                <p style={{ margin: '4px 0 0', fontSize: '13px', color: '#555' }}>{comment.comment}</p>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );
};

export default SocialInteractions;
