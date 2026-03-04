import React, { useState } from 'react';
import Navbar from '../components/Navbar';

const StudentNotifications = () => {
  const [filter, setFilter] = useState('all');

  const notifications = [
    {
      id: 1,
      type: 'application',
      title: 'Application Viewed',
      message: 'Your application for Teaching Assistant - Physics has been viewed by the department',
      time: '2 hours ago',
      date: 'Today',
      read: false,
      urgent: false,
      action: 'View Application'
    },
    {
      id: 2,
      type: 'job_match',
      title: 'New Job Match',
      message: 'New job posted: Research Assistant in Chemistry (95% match with your skills)',
      time: '5 hours ago',
      date: 'Today',
      read: false,
      urgent: false,
      action: 'View Job'
    },
    {
      id: 3,
      type: 'interview',
      title: 'Interview Invitation',
      message: 'Dr. Ahmed invited you for an interview for Lab Assistant position',
      time: '8 hours ago',
      date: 'Today',
      read: false,
      urgent: true,
      action: 'Respond'
    },
    {
      id: 4,
      type: 'message',
      title: 'New Message',
      message: 'You have a new message from Physics Department regarding your application',
      time: 'Yesterday',
      date: 'Yesterday',
      read: true,
      urgent: false,
      action: 'Read Message'
    },
    {
      id: 5,
      type: 'application',
      title: 'Application Accepted',
      message: 'Congratulations! Your application for Research Assistant has been accepted',
      time: '2 days ago',
      date: 'This Week',
      read: true,
      urgent: false,
      action: 'View Details'
    },
    {
      id: 6,
      type: 'deadline',
      title: 'Deadline Reminder',
      message: 'Application deadline for Teaching Assistant position is in 2 days',
      time: '3 days ago',
      date: 'This Week',
      read: true,
      urgent: false,
      action: 'Apply Now'
    },
    {
      id: 7,
      type: 'profile',
      title: 'Profile Viewed',
      message: 'Your profile was viewed by 3 employers this week',
      time: '4 days ago',
      date: 'This Week',
      read: true,
      urgent: false
    },
    {
      id: 8,
      type: 'profile',
      title: 'Complete Your Profile',
      message: 'Your profile is 85% complete. Add your skills to get better job recommendations',
      time: '1 week ago',
      date: 'This Week',
      read: true,
      urgent: false,
      action: 'Complete Profile'
    }
  ];

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
      case 'application': return '#0B2A4A';
      case 'job_match': return '#00C851';
      case 'interview': return '#ffbb33';
      case 'message': return '#0077B5';
      case 'deadline': return '#ff4444';
      case 'profile': return '#aa66cc';
      default: return '#0B2A4A';
    }
  };

  const filteredNotifications = filter === 'all' 
    ? notifications 
    : filter === 'unread' 
      ? notifications.filter(n => !n.read)
      : notifications.filter(n => n.type === filter);

  const unreadCount = notifications.filter(n => !n.read).length;

  const markAllAsRead = () => {
    console.log('Mark all as read');
  };

  return (
    <div style={{ display: 'flex', background: '#f8fafc', minHeight: '100vh' }}>
      <Navbar />
      
      <div style={{ marginLeft: '280px', padding: '30px', width: 'calc(100% - 280px)' }}>
        {/* Header */}
        <div style={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center',
          marginBottom: '30px'
        }}>
          <div>
            <h1 style={{ fontSize: '28px', color: '#0B2A4A', fontWeight: '600', marginBottom: '5px' }}>
              Notifications
            </h1>
            <p style={{ color: '#666' }}>You have {unreadCount} unread notifications</p>
          </div>
          {unreadCount > 0 && (
            <button
              onClick={markAllAsRead}
              style={{
                padding: '10px 20px',
                background: 'white',
                color: '#0B2A4A',
                border: '1px solid #0B2A4A',
                borderRadius: '8px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              Mark all as read
            </button>
          )}
        </div>

        {/* Filters */}
        <div style={{
          background: 'white',
          borderRadius: '12px',
          padding: '20px',
          marginBottom: '30px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
        }}>
          <div style={{ display: 'flex', gap: '15px', alignItems: 'center', flexWrap: 'wrap' }}>
            <span style={{ color: '#0B2A4A', fontWeight: '500' }}>Filter by:</span>
            <button
              onClick={() => setFilter('all')}
              style={{
                padding: '8px 16px',
                background: filter === 'all' ? '#0B2A4A' : 'white',
                color: filter === 'all' ? 'white' : '#666',
                border: filter === 'all' ? 'none' : '1px solid #ddd',
                borderRadius: '30px',
                cursor: 'pointer'
              }}
            >
              All
            </button>
            <button
              onClick={() => setFilter('unread')}
              style={{
                padding: '8px 16px',
                background: filter === 'unread' ? '#0B2A4A' : 'white',
                color: filter === 'unread' ? 'white' : '#666',
                border: filter === 'unread' ? 'none' : '1px solid #ddd',
                borderRadius: '30px',
                cursor: 'pointer'
              }}
            >
              Unread ({unreadCount})
            </button>
            <button
              onClick={() => setFilter('application')}
              style={{
                padding: '8px 16px',
                background: filter === 'application' ? '#0B2A4A' : 'white',
                color: filter === 'application' ? 'white' : '#666',
                border: filter === 'application' ? 'none' : '1px solid #ddd',
                borderRadius: '30px',
                cursor: 'pointer'
              }}
            >
              Applications
            </button>
            <button
              onClick={() => setFilter('interview')}
              style={{
                padding: '8px 16px',
                background: filter === 'interview' ? '#0B2A4A' : 'white',
                color: filter === 'interview' ? 'white' : '#666',
                border: filter === 'interview' ? 'none' : '1px solid #ddd',
                borderRadius: '30px',
                cursor: 'pointer'
              }}
            >
              Interviews
            </button>
            <button
              onClick={() => setFilter('message')}
              style={{
                padding: '8px 16px',
                background: filter === 'message' ? '#0B2A4A' : 'white',
                color: filter === 'message' ? 'white' : '#666',
                border: filter === 'message' ? 'none' : '1px solid #ddd',
                borderRadius: '30px',
                cursor: 'pointer'
              }}
            >
              Messages
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          {['Today', 'Yesterday', 'This Week'].map(dateGroup => {
            const groupNotifications = filteredNotifications.filter(n => n.date === dateGroup);
            if (groupNotifications.length === 0) return null;

            return (
              <div key={dateGroup}>
                <h3 style={{ 
                  color: '#666', 
                  fontSize: '14px', 
                  fontWeight: '600', 
                  marginBottom: '15px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  {dateGroup}
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {groupNotifications.map(notif => (
                    <div
                      key={notif.id}
                      style={{
                        background: notif.read ? 'white' : '#f0f7ff',
                        borderRadius: '12px',
                        padding: '20px',
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                        border: notif.urgent ? '2px solid #ff4444' : 'none',
                        position: 'relative'
                      }}
                    >
                      {!notif.read && (
                        <div style={{
                          position: 'absolute',
                          top: '20px',
                          right: '20px',
                          width: '10px',
                          height: '10px',
                          background: '#0B2A4A',
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
                          <i className={getTypeIcon(notif.type)}></i>
                        </div>
                        
                        <div style={{ flex: 1 }}>
                          <div style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'start',
                            marginBottom: '5px'
                          }}>
                            <h4 style={{ 
                              color: '#0B2A4A', 
                              fontSize: '16px', 
                              fontWeight: '600',
                              marginBottom: '4px'
                            }}>
                              {notif.title}
                            </h4>
                            <span style={{ color: '#999', fontSize: '13px' }}>{notif.time}</span>
                          </div>
                          
                          <p style={{ color: '#666', fontSize: '14px', marginBottom: '12px' }}>
                            {notif.message}
                          </p>
                          
                          {notif.action && (
                            <button style={{
                              padding: '6px 12px',
                              background: notif.urgent ? '#ff4444' : '#0B2A4A',
                              color: 'white',
                              border: 'none',
                              borderRadius: '6px',
                              cursor: 'pointer',
                              fontSize: '12px',
                              fontWeight: '500'
                            }}>
                              {notif.action}
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>

        {/* Notification Preferences Link */}
        <div style={{
          marginTop: '30px',
          padding: '20px',
          background: 'white',
          borderRadius: '12px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center'
        }}>
          <div>
            <h4 style={{ color: '#0B2A4A', fontSize: '16px', fontWeight: '600', marginBottom: '4px' }}>
              Customize your notifications
            </h4>
            <p style={{ color: '#666', fontSize: '14px' }}>
              Choose which notifications you receive and how
            </p>
          </div>
          <button
            onClick={() => window.location.href = '/student-settings?tab=notifications'}
            style={{
              padding: '10px 20px',
              background: '#0B2A4A',
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer'
            }}
          >
            Notification Settings
          </button>
        </div>
      </div>
    </div>
  );
};

export default StudentNotifications;