import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons, Feather, FontAwesome5 } from '@expo/vector-icons';

// ─── Types ────────────────────────────────────────────────
type NotificationType = 'application' | 'job_match' | 'interview' | 'message' | 'deadline' | 'profile';

interface Notification {
  id: number;
  type: NotificationType;
  title: string;
  message: string;
  time: string;
  date: 'Today' | 'Yesterday' | 'This Week';
  read: boolean;
  urgent: boolean;
  action?: string;
}

// ─── Colors ───────────────────────────────────────────────
const primaryBlue = '#0B2A4A';
const backgroundGray = '#F8FAFC';

const NotificationsScreen: React.FC = () => {
  const [filter, setFilter] = useState<string>('all');

  const notifications: Notification[] = [
    { id: 1, type: 'application', title: 'Application Viewed', message: 'Your application for Teaching Assistant - Physics has been viewed by the department', time: '2 hours ago', date: 'Today', read: false, urgent: false, action: 'View Application' },
    { id: 2, type: 'job_match', title: 'New Job Match', message: 'New job posted: Research Assistant in Chemistry (95% match with your skills)', time: '5 hours ago', date: 'Today', read: false, urgent: false, action: 'View Job' },
    { id: 3, type: 'interview', title: 'Interview Invitation', message: 'Dr. Ahmed invited you for an interview for Lab Assistant position', time: '8 hours ago', date: 'Today', read: false, urgent: true, action: 'Respond' },
    { id: 4, type: 'message', title: 'New Message', message: 'You have a new message from Physics Department regarding your application', time: 'Yesterday', date: 'Yesterday', read: true, urgent: false, action: 'Read Message' },
    { id: 5, type: 'application', title: 'Application Accepted', message: 'Congratulations! Your application for Research Assistant has been accepted', time: '2 days ago', date: 'This Week', read: true, urgent: false, action: 'View Details' },
    { id: 6, type: 'deadline', title: 'Deadline Reminder', message: 'Application deadline for Teaching Assistant position is in 2 days', time: '3 days ago', date: 'This Week', read: true, urgent: false, action: 'Apply Now' },
    { id: 7, type: 'profile', title: 'Profile Viewed', message: 'Your profile was viewed by 3 employers this week', time: '4 days ago', date: 'This Week', read: true, urgent: false },
    { id: 8, type: 'profile', title: 'Complete Your Profile', message: 'Your profile is 85% complete. Add your skills to get better job recommendations', time: '1 week ago', date: 'This Week', read: true, urgent: false, action: 'Complete Profile' }
  ];

  const getTypeIcon = (type: NotificationType) => {
    switch (type) {
      case 'application': return { name: 'file-text', library: Feather };
      case 'job_match': return { name: 'bolt', library: FontAwesome5 };
      case 'interview': return { name: 'calendar-check', library: FontAwesome5 };
      case 'message': return { name: 'envelope', library: Feather };
      case 'deadline': return { name: 'clock', library: Feather };
      case 'profile': return { name: 'user', library: Feather };
      default: return { name: 'bell', library: Feather };
    }
  };

  const getTypeColor = (type: NotificationType) => {
    switch (type) {
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

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Notifications</Text>
          <Text style={styles.headerSubtitle}>You have {unreadCount} unread notifications</Text>
        </View>
        {unreadCount > 0 && (
          <TouchableOpacity style={styles.markReadBtn}>
            <Text style={styles.markReadText}>Mark all as read</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Filters (Horizontal Scroll) */}
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          {['all', 'unread', 'application', 'interview', 'message'].map((item) => (
            <TouchableOpacity
              key={item}
              onPress={() => setFilter(item)}
              style={[
                styles.filterTab,
                filter === item && styles.filterTabActive
              ]}
            >
              <Text style={[styles.filterTabText, filter === item && styles.filterTabTextActive]}>
                {item.charAt(0).toUpperCase() + item.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView style={styles.scrollArea} showsVerticalScrollIndicator={false}>
        {['Today', 'Yesterday', 'This Week'].map((dateGroup) => {
          const groupNotifications = filteredNotifications.filter(n => n.date === dateGroup);
          if (groupNotifications.length === 0) return null;

          return (
            <View key={dateGroup} style={styles.section}>
              <Text style={styles.sectionTitle}>{dateGroup}</Text>
              {groupNotifications.map((notif) => {
                const iconData = getTypeIcon(notif.type);
                const color = getTypeColor(notif.type);
                
                return (
                  <View key={notif.id} style={[
                    styles.notifCard,
                    !notif.read && styles.unreadCard,
                    notif.urgent && styles.urgentCard
                  ]}>
                    {!notif.read && <View style={styles.unreadDot} />}
                    
                    <View style={styles.cardContent}>
                      <View style={[styles.iconBox, { backgroundColor: `${color}15` }]}>
                        <iconData.library name={iconData.name as any} size={20} color={color} />
                      </View>

                      <View style={styles.textContent}>
                        <View style={styles.cardHeader}>
                          <Text style={styles.notifTitle}>{notif.title}</Text>
                          <Text style={styles.notifTime}>{notif.time}</Text>
                        </View>
                        
                        <Text style={styles.notifMessage}>{notif.message}</Text>
                        
                        {notif.action && (
                          <TouchableOpacity style={[
                            styles.actionBtn,
                            { backgroundColor: notif.urgent ? '#ff4444' : primaryBlue }
                          ]}>
                            <Text style={styles.actionBtnText}>{notif.action}</Text>
                          </TouchableOpacity>
                        )}
                      </View>
                    </View>
                  </View>
                );
              })}
            </View>
          );
        })}

        {/* Settings Link */}
        <TouchableOpacity style={styles.settingsCard}>
          <View>
            <Text style={styles.settingsTitle}>Customize notifications</Text>
            <Text style={styles.settingsSubtitle}>Choose what you receive</Text>
          </View>
          <Ionicons name="settings-outline" size={20} color={primaryBlue} />
        </TouchableOpacity>
        
        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default NotificationsScreen;

// ─── Styles ─────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: backgroundGray },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
  },
  headerTitle: { fontSize: 24, fontWeight: '700', color: primaryBlue },
  headerSubtitle: { fontSize: 13, color: '#666', marginTop: 2 },
  markReadBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: primaryBlue,
  },
  markReadText: { color: primaryBlue, fontSize: 12, fontWeight: '600' },
  filterContainer: { backgroundColor: '#fff', paddingBottom: 10 },
  filterScroll: { paddingHorizontal: 15, gap: 10 },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  filterTabActive: { backgroundColor: primaryBlue, borderColor: primaryBlue },
  filterTabText: { color: '#666', fontSize: 13, fontWeight: '500' },
  filterTabTextActive: { color: '#fff' },
  scrollArea: { flex: 1, padding: 15 },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 12, fontWeight: '700', color: '#999', textTransform: 'uppercase', marginBottom: 10, letterSpacing: 1 },
  notifCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 5,
    elevation: 2,
  },
  unreadCard: { backgroundColor: '#F0F7FF' },
  urgentCard: { borderWidth: 1, borderColor: '#ff4444' },
  unreadDot: {
    position: 'absolute',
    top: 15,
    right: 15,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: primaryBlue,
  },
  cardContent: { flexDirection: 'row', gap: 12 },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  textContent: { flex: 1 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 },
  notifTitle: { fontSize: 15, fontWeight: '700', color: primaryBlue, flex: 1, marginRight: 10 },
  notifTime: { fontSize: 11, color: '#999' },
  notifMessage: { fontSize: 13, color: '#666', lineHeight: 18, marginBottom: 10 },
  actionBtn: { alignSelf: 'flex-start', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 6 },
  actionBtnText: { color: '#fff', fontSize: 11, fontWeight: '600' },
  settingsCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  settingsTitle: { fontSize: 15, fontWeight: '600', color: primaryBlue },
  settingsSubtitle: { fontSize: 12, color: '#666', marginTop: 2 },
});