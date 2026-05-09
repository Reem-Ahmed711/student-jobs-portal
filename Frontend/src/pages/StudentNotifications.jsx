// C:\Student-job-portal\Frontend\src\pages\StudentNotifications.jsx
import React, { useState, useEffect } from 'react';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { getNotifications, markNotificationAsRead, markAllNotificationsAsRead } from '../services/api';
import { useNavigate } from 'react-router-dom';

const StudentNotifications = () => {
  const { user } = useAuth();
  const { darkMode } = useTheme();
  const navigate = useNavigate();
  const [filter, setFilter] = useState('all');
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState({ show: false, message: '', type: 'success' });

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    setLoading(true);
    try {
      const response = await getNotifications();
      let data = response.data?.data || response.data || [];
      
      // ترتيب من الأحدث إلى الأقدم
      data = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setNotifications(data);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setNotifications([]);
    } finally {
      setLoading(false);
    }
  };

  const showToast = (message, type = 'success') => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: '', type: 'success' }), 3000);
  };

  const handleMarkAsRead = async (id) => {
    try {
      await markNotificationAsRead(id);
      setNotifications(prev =>
        prev.map(n => n.id === id ? { ...n, read: true } : n)
      );
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllNotificationsAsRead();
      setNotifications(prev =>
        prev.map(n => ({ ...n, read: true }))
      );
      showToast('✅ All notifications marked as read', 'success');
    } catch (error) {
      console.error('Error marking all as read:', error);
      showToast('❌ Failed to mark all as read', 'error');
    }
  };

  const handleNotificationClick = (notif) => {
    // تسجيل كـ مقروء
    if (!notif.read) {
      handleMarkAsRead(notif.id);
    }
    
    // التنقل حسب النوع
    if (notif.type === 'application' && notif.jobId) {
      navigate(`/student-applications`);
    } else if (notif.type === 'job_match' && notif.jobId) {
      navigate(`/job/${notif.jobId}`);
    } else if (notif.type === 'interview') {
      navigate(`/student-applications`);
    } else if (notif.type === 'profile') {
      navigate(`/student-profile`);
    }
  };

  const getTypeIcon = (type) => {
    switch(type) {
      case 'application': return 'fas fa-file-alt';
      case 'job_match': return 'fas fa-bolt';
      case 'interview': return 'fas fa-calendar-check';
      case 'message': return 'fas fa-envelope';
      case 'deadline': return 'fas fa-clock';
      case 'profile': return 'fas fa-user';
      default: return 'fas fa-bell';
    }
  };

  const getTypeColor = (type) => {
    switch(type) {
      case 'application': return '#1E3A5F';
      case 'job_match': return '#00C851';
      case 'interview': return '#f59e0b';
      case 'message': return '#0077B5';
      case 'deadline': return '#ef4444';
      case 'profile': return '#8b5cf6';
      default: return '#1E3A5F';
    }
  };

  const getTimeAgo = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    if (diffDays < 7) return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
    return date.toLocaleDateString();
  };

  const groupNotificationsByDate = (notifs) => {
    const today = [];
    const yesterday = [];
    const thisWeek = [];
    const older = [];

    const now = new Date();
    const todayDate = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterdayDate = new Date(todayDate);
    yesterdayDate.setDate(yesterdayDate.getDate() - 1);
    const weekAgo = new Date(todayDate);
    weekAgo.setDate(weekAgo.getDate() - 7);

    notifs.forEach(notif => {
      const notifDate = new Date(notif.createdAt);
      const notifDay = new Date(notifDate.getFullYear(), notifDate.getMonth(), notifDate.getDate());

      if (notifDay.getTime() === todayDate.getTime()) {
        today.push(notif);
      } else if (notifDay.getTime() === yesterdayDate.getTime()) {
        yesterday.push(notif);
      } else if (notifDate > weekAgo) {
        thisWeek.push(notif);
      } else {
        older.push(notif);
      }
    });

    return { today, yesterday, thisWeek, older };
  };

  const filteredNotifications = (() => {
    if (filter === 'all') return notifications;
    if (filter === 'unread') return notifications.filter(n => !n.read);
    return notifications.filter(n => n.type === filter);
  })();

  const grouped = groupNotificationsByDate(filteredNotifications);
  const unreadCount = notifications.filter(n => !n.read).length;

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
        .notification-item {
          transition: all 0.3s ease;
          animation: slideInUp 0.4s ease-out;
        }
        .notification-item:hover {
          transform: translateX(5px);
          box-shadow: 0 8px 25px rgba(0,0,0,0.1);
        }
      `}</style>

      <div style={{ maxWidth: '900px', margin: '0 auto' }}>
        {/* Header */}
        <div style={{ marginBottom: '30px', animation: 'slideInUp 0.4s ease-out' }}>
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
              <i className="fas fa-bell" style={{ fontSize: '24px', color: 'white' }}></i>
            </div>
            <div>
              <h1 style={{ fontSize: '28px', fontWeight: '700', color: darkMode ? '#f1f5f9' : '#1E3A5F' }}>
                Notifications
              </h1>
              <p style={{ color: darkMode ? '#94a3b8' : '#666', marginTop: '4px' }}>
                Stay updated with your application status and opportunities
              </p>
            </div>
          </div>
        </div>

        {/* Filters Bar */}
        <div style={{
          background: darkMode ? '#1e293b' : 'white',
          borderRadius: '16px',
          padding: '16px 20px',
          marginBottom: '25px',
          display: 'flex',
          gap: '12px',
          alignItems: 'center',
          flexWrap: 'wrap',
          justifyContent: 'space-between',
          animation: 'slideInUp 0.5s ease-out'
        }}>
          <div style={{ display: 'flex', gap: '10px', alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ fontWeight: '600', color: darkMode ? '#f1f5f9' : '#1E3A5F' }}>
              <i className="fas fa-filter" style={{ marginRight: '6px' }}></i>
              Filter:
            </span>
            {[
              { value: 'all', label: 'All', icon: 'fa-bell' },
              { value: 'unread', label: `Unread (${unreadCount})`, icon: 'fa-envelope' },
              { value: 'application', label: 'Applications', icon: 'fa-file-alt' },
              { value: 'interview', label: 'Interviews', icon: 'fa-calendar' },
              { value: 'job_match', label: 'Job Matches', icon: 'fa-bolt' }
            ].map(opt => (
              <button
                key={opt.value}
                onClick={() => setFilter(opt.value)}
                style={{
                  padding: '8px 18px',
                  background: filter === opt.value ? '#1E3A5F' : 'transparent',
                  color: filter === opt.value ? 'white' : (darkMode ? '#94a3b8' : '#666'),
                  border: filter === opt.value ? 'none' : `1px solid ${darkMode ? '#475569' : '#ddd'}`,
                  borderRadius: '30px',
                  cursor: 'pointer',
                  fontSize: '13px',
                  fontWeight: filter === opt.value ? '600' : '400',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  transition: 'all 0.2s ease'
                }}
              >
                <i className={`fas ${opt.icon}`} style={{ fontSize: '12px' }}></i>
                {opt.label}
              </button>
            ))}
          </div>
          
          {unreadCount > 0 && (
            <button
              onClick={handleMarkAllAsRead}
              style={{
                padding: '8px 16px',
                background: 'transparent',
                color: '#1E3A5F',
                border: `1px solid ${darkMode ? '#475569' : '#ddd'}`,
                borderRadius: '30px',
                cursor: 'pointer',
                fontSize: '13px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = '#1E3A5F';
                e.currentTarget.style.color = 'white';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = '#1E3A5F';
              }}
            >
              <i className="fas fa-check-double"></i> Mark all as read
            </button>
          )}
        </div>

        {/* Toast */}
        {toast.show && (
          <div style={{
            position: 'fixed',
            bottom: '30px',
            right: '30px',
            zIndex: 9999,
            background: toast.type === 'success' ? '#10b981' : '#ef4444',
            color: 'white',
            padding: '12px 24px',
            borderRadius: '12px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            animation: 'slideInUp 0.3s ease-out',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}>
            <i className={`fas ${toast.type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle'}`}></i>
            {toast.message}
          </div>
        )}

        {/* Notifications List */}
        {filteredNotifications.length === 0 ? (
          <div style={{
            background: darkMode ? '#1e293b' : 'white',
            borderRadius: '20px',
            padding: '60px',
            textAlign: 'center',
            animation: 'slideInUp 0.6s ease-out'
          }}>
            <i className="fas fa-bell-slash" style={{ fontSize: '64px', color: '#ccc', marginBottom: '20px' }}></i>
            <h3 style={{ fontSize: '20px', color: darkMode ? '#f1f5f9' : '#333', marginBottom: '10px' }}>
              No notifications
            </h3>
            <p style={{ color: darkMode ? '#94a3b8' : '#666', marginBottom: '20px' }}>
              {filter !== 'all' 
                ? `No ${filter} notifications found` 
                : "You're all caught up! New notifications will appear here"}
            </p>
            {filter !== 'all' && (
              <button
                onClick={() => setFilter('all')}
                style={{
                  padding: '10px 24px',
                  background: '#1E3A5F',
                  color: 'white',
                  border: 'none',
                  borderRadius: '30px',
                  cursor: 'pointer'
                }}
              >
                View all notifications
              </button>
            )}
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            {/* Today */}
            {grouped.today.length > 0 && (
              <div>
                <h3 style={{
                  fontSize: '13px',
                  fontWeight: '600',
                  color: darkMode ? '#94a3b8' : '#666',
                  marginBottom: '12px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  <i className="fas fa-sun" style={{ marginRight: '6px' }}></i>
                  Today
                </h3>
                {grouped.today.map(notif => (
                  <NotificationCard
                    key={notif.id}
                    notif={notif}
                    darkMode={darkMode}
                    getTypeIcon={getTypeIcon}
                    getTypeColor={getTypeColor}
                    getTimeAgo={getTimeAgo}
                    onClick={() => handleNotificationClick(notif)}
                  />
                ))}
              </div>
            )}

            {/* Yesterday */}
            {grouped.yesterday.length > 0 && (
              <div>
                <h3 style={{
                  fontSize: '13px',
                  fontWeight: '600',
                  color: darkMode ? '#94a3b8' : '#666',
                  marginBottom: '12px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  <i className="fas fa-cloud" style={{ marginRight: '6px' }}></i>
                  Yesterday
                </h3>
                {grouped.yesterday.map(notif => (
                  <NotificationCard
                    key={notif.id}
                    notif={notif}
                    darkMode={darkMode}
                    getTypeIcon={getTypeIcon}
                    getTypeColor={getTypeColor}
                    getTimeAgo={getTimeAgo}
                    onClick={() => handleNotificationClick(notif)}
                  />
                ))}
              </div>
            )}

            {/* This Week */}
            {grouped.thisWeek.length > 0 && (
              <div>
                <h3 style={{
                  fontSize: '13px',
                  fontWeight: '600',
                  color: darkMode ? '#94a3b8' : '#666',
                  marginBottom: '12px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  <i className="fas fa-calendar-week" style={{ marginRight: '6px' }}></i>
                  This Week
                </h3>
                {grouped.thisWeek.map(notif => (
                  <NotificationCard
                    key={notif.id}
                    notif={notif}
                    darkMode={darkMode}
                    getTypeIcon={getTypeIcon}
                    getTypeColor={getTypeColor}
                    getTimeAgo={getTimeAgo}
                    onClick={() => handleNotificationClick(notif)}
                  />
                ))}
              </div>
            )}

            {/* Older */}
            {grouped.older.length > 0 && (
              <div>
                <h3 style={{
                  fontSize: '13px',
                  fontWeight: '600',
                  color: darkMode ? '#94a3b8' : '#666',
                  marginBottom: '12px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  <i className="fas fa-history" style={{ marginRight: '6px' }}></i>
                  Older
                </h3>
                {grouped.older.map(notif => (
                  <NotificationCard
                    key={notif.id}
                    notif={notif}
                    darkMode={darkMode}
                    getTypeIcon={getTypeIcon}
                    getTypeColor={getTypeColor}
                    getTimeAgo={getTimeAgo}
                    onClick={() => handleNotificationClick(notif)}
                  />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Notification Preferences */}
        <div style={{
          marginTop: '30px',
          padding: '20px',
          background: darkMode ? '#1e293b' : 'white',
          borderRadius: '16px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: '15px',
          animation: 'slideInUp 0.8s ease-out'
        }}>
          <div>
            <h4 style={{ fontWeight: '600', marginBottom: '4px', color: darkMode ? '#f1f5f9' : '#1E3A5F' }}>
              <i className="fas fa-cog" style={{ marginRight: '8px' }}></i>
              Customize your notifications
            </h4>
            <p style={{ fontSize: '13px', color: darkMode ? '#94a3b8' : '#666' }}>
              Choose which notifications you receive and how
            </p>
          </div>
          <button
            onClick={() => navigate('/student-settings?tab=notifications')}
            style={{
              padding: '10px 24px',
              background: '#1E3A5F',
              color: 'white',
              border: 'none',
              borderRadius: '30px',
              cursor: 'pointer',
              fontSize: '13px',
              fontWeight: '500'
            }}
          >
            Notification Settings <i className="fas fa-arrow-right"></i>
          </button>
        </div>
      </div>
    </Layout>
  );
};

// Notification Card Component
const NotificationCard = ({ notif, darkMode, getTypeIcon, getTypeColor, getTimeAgo, onClick }) => {
  return (
    <div
      className="notification-item"
      onClick={onClick}
      style={{
        background: notif.read ? (darkMode ? '#1e293b' : 'white') : (darkMode ? '#2d2a6e' : '#f0f7ff'),
        borderRadius: '16px',
        padding: '18px',
        marginBottom: '10px',
        borderLeft: `4px solid ${getTypeColor(notif.type)}`,
        position: 'relative',
        cursor: 'pointer'
      }}
    >
      {!notif.read && (
        <div style={{
          position: 'absolute',
          top: '18px',
          right: '18px',
          width: '8px',
          height: '8px',
          background: '#1E3A5F',
          borderRadius: '50%'
        }} />
      )}
      
      <div style={{ display: 'flex', gap: '15px' }}>
        <div style={{
          width: '48px',
          height: '48px',
          background: `${getTypeColor(notif.type)}20`,
          borderRadius: '12px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: getTypeColor(notif.type),
          fontSize: '20px'
        }}>
          <i className={`fas ${getTypeIcon(notif.type)}`}></i>
        </div>
        
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', flexWrap: 'wrap', gap: '8px', marginBottom: '6px' }}>
            <h4 style={{ fontWeight: '600', color: darkMode ? '#f1f5f9' : '#1E3A5F' }}>
              {notif.title}
            </h4>
            <span style={{ fontSize: '12px', color: darkMode ? '#94a3b8' : '#999' }}>
              {getTimeAgo(notif.createdAt)}
            </span>
          </div>
          
          <p style={{ fontSize: '14px', color: darkMode ? '#94a3b8' : '#666', marginBottom: '12px', lineHeight: '1.5' }}>
            {notif.message}
          </p>
          
          {notif.action && (
            <button
              onClick={(e) => { e.stopPropagation(); onClick(); }}
              style={{
                padding: '6px 16px',
                background: notif.urgent ? '#ef4444' : '#1E3A5F',
                color: 'white',
                border: 'none',
                borderRadius: '20px',
                cursor: 'pointer',
                fontSize: '12px',
                fontWeight: '500'
              }}
            >
              {notif.action}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default StudentNotifications;
