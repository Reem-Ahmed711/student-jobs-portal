import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  RefreshControl,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons, Feather, FontAwesome5 } from '@expo/vector-icons';
import { useFocusEffect } from 'expo-router';
import {
  getNotifications,
  markNotificationAsRead,
  markAllNotificationsAsRead,
  getUnreadNotificationsCount,
} from '../src/api';

type NotificationType = 'application' | 'job_match' | 'interview' | 'message' | 'deadline' | 'profile' | 'general';

interface Notification {
  id: string;
  title: string;
  body: string;
  type: NotificationType;
  read: boolean;
  createdAt: any;
  data?: any;
}

const primaryBlue = '#1E3A5F';
const backgroundGray = '#F8FAFC';

const NotificationsScreen: React.FC = () => {
  const [filter, setFilter] = useState<string>('all');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const [debugInfo, setDebugInfo] = useState<string>(''); // ✅ للـ debug مؤقتاً

  const loadNotifications = async () => {
    try {
      const response = await getNotifications(50);

      // ✅ Debug logs — شيلهم بعد ما تحل المشكلة
      console.log("📬 Full response:", JSON.stringify(response));
      console.log("📬 response.success:", response?.success);
      console.log("📬 response.notifications:", response?.notifications);
      console.log("📬 response.data:", response?.data);

      // ✅ جرب كل الأشكال الممكنة للـ response
      let notifsList: any[] = [];

      if (response?.success) {
        if (Array.isArray(response.notifications)) {
          // { success: true, notifications: [...] }
          notifsList = response.notifications;
        } else if (Array.isArray(response.data)) {
          // { success: true, data: [...] }
          notifsList = response.data;
        } else if (response.data?.notifications && Array.isArray(response.data.notifications)) {
          // { success: true, data: { notifications: [...] } }
          notifsList = response.data.notifications;
        } else if (response.data?.data && Array.isArray(response.data.data)) {
          // { success: true, data: { data: [...] } }
          notifsList = response.data.data;
        }
      } else if (Array.isArray(response)) {
        // الـ response نفسه array
        notifsList = response;
      }

      // ✅ Debug: اعرض إيه اللي اتعمل
      const debugMsg = `Response keys: ${Object.keys(response || {}).join(', ')} | Found: ${notifsList.length} notifications`;
      console.log("📬", debugMsg);
      setDebugInfo(debugMsg);

      const formattedNotifs: Notification[] = notifsList.map((notif: any) => ({
        id: notif.id || notif._id || String(Math.random()),
        title: notif.title || notif.subject || 'Notification',
        body: notif.body || notif.message || notif.description || notif.content || '',
        type: notif.type || 'general',
        read: notif.read ?? notif.isRead ?? notif.is_read ?? false,
        createdAt: notif.createdAt || notif.created_at || notif.timestamp || null,
        data: notif.data || {},
      }));

      setNotifications(formattedNotifs);
    } catch (err) {
      console.error('Error loading notifications:', err);
      setDebugInfo(`Error: ${String(err)}`);
      setNotifications([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const loadUnreadCount = async () => {
    try {
      const response = await getUnreadNotificationsCount();
      console.log("🔔 Unread count response:", JSON.stringify(response));
      if (response?.success) {
        // جرب كل الأشكال
        const count = response.count ?? response.data?.count ?? response.unreadCount ?? 0;
        setUnreadCount(count);
      }
    } catch (err) {
      console.error('Error loading unread count:', err);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadNotifications();
      loadUnreadCount();
    }, [])
  );

  const onRefresh = () => {
    setRefreshing(true);
    loadNotifications();
    loadUnreadCount();
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await markNotificationAsRead(notificationId);
      setNotifications(prev =>
        prev.map(notif =>
          notif.id === notificationId ? { ...notif, read: true } : notif
        )
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Error marking as read:', err);
    }
  };

  const handleMarkAllAsRead = async () => {
    Alert.alert('Mark all as read', 'Are you sure you want to mark all notifications as read?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Mark All',
        onPress: async () => {
          try {
            await markAllNotificationsAsRead();
            setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
            setUnreadCount(0);
            Alert.alert('Success', 'All notifications marked as read');
          } catch (err) {
            Alert.alert('Error', 'Failed to mark all as read');
          }
        },
      },
    ]);
  };

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
      case 'application': return '#1E3A5F';
      case 'job_match': return '#16A34A';
      case 'interview': return '#F59E0B';
      case 'message': return '#0077B5';
      case 'deadline': return '#EF4444';
      case 'profile': return '#8B5CF6';
      default: return '#1E3A5F';
    }
  };

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'Recently';
    try {
      let date: Date;
      if (timestamp._seconds) {
        date = new Date(timestamp._seconds * 1000);
      } else if (timestamp.seconds) {
        date = new Date(timestamp.seconds * 1000);
      } else if (typeof timestamp === 'number') {
        date = new Date(timestamp);
      } else if (typeof timestamp === 'string') {
        date = new Date(timestamp);
      } else {
        return 'Recently';
      }

      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffHours = Math.floor(diffMs / 3600000);
      const diffDays = Math.floor(diffMs / 86400000);

      if (diffHours < 1) return 'Just now';
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays < 7) return `${diffDays}d ago`;
      return date.toLocaleDateString();
    } catch {
      return 'Recently';
    }
  };

  const filteredNotifications = filter === 'all'
    ? notifications
    : filter === 'unread'
      ? notifications.filter(n => !n.read)
      : notifications.filter(n => n.type === filter);

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <StatusBar barStyle="dark-content" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color={primaryBlue} />
          <Text style={styles.loadingText}>Loading notifications...</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />

      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Notifications</Text>
          <Text style={styles.headerSubtitle}>
            You have {unreadCount} unread {unreadCount === 1 ? 'notification' : 'notifications'}
          </Text>
        </View>
        {unreadCount > 0 && (
          <TouchableOpacity style={styles.markReadBtn} onPress={handleMarkAllAsRead}>
            <Text style={styles.markReadText}>Mark all as read</Text>
          </TouchableOpacity>
        )}
      </View>

      {/* Filters */}
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          {['all', 'unread', 'application', 'interview', 'message'].map((item) => (
            <TouchableOpacity
              key={item}
              onPress={() => setFilter(item)}
              style={[styles.filterTab, filter === item && styles.filterTabActive]}
            >
              <Text style={[styles.filterTabText, filter === item && styles.filterTabTextActive]}>
                {item === 'all' ? 'All' : item === 'unread' ? 'Unread' : item.charAt(0).toUpperCase() + item.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <ScrollView
        style={styles.scrollArea}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={[primaryBlue]} />}
      >
        {/* ✅ Debug info — شيله بعد ما تحل المشكلة */}
        {__DEV__ && debugInfo ? (
          <View style={styles.debugBox}>
            <Text style={styles.debugText}>🔍 {debugInfo}</Text>
          </View>
        ) : null}

        {filteredNotifications.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="notifications-off-outline" size={64} color="#D1D5DB" />
            <Text style={styles.emptyTitle}>No notifications</Text>
            <Text style={styles.emptySubtitle}>
              When you receive notifications, they will appear here
            </Text>
          </View>
        ) : (
          filteredNotifications.map((notif) => {
            const iconData = getTypeIcon(notif.type);
            const color = getTypeColor(notif.type);

            return (
              <TouchableOpacity
                key={notif.id}
                style={[styles.notifCard, !notif.read && styles.unreadCard]}
                onPress={() => { if (!notif.read) handleMarkAsRead(notif.id); }}
                activeOpacity={0.7}
              >
                {!notif.read && <View style={styles.unreadDot} />}

                <View style={styles.cardContent}>
                  <View style={[styles.iconBox, { backgroundColor: `${color}15` }]}>
                    <iconData.library name={iconData.name as any} size={20} color={color} />
                  </View>

                  <View style={styles.textContent}>
                    <View style={styles.cardHeader}>
                      <Text style={styles.notifTitle}>{notif.title}</Text>
                      <Text style={styles.notifTime}>{formatDate(notif.createdAt)}</Text>
                    </View>
                    <Text style={styles.notifMessage}>{notif.body}</Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

export default NotificationsScreen;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: backgroundGray },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 12, color: '#6B7280', fontSize: 14 },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  headerTitle: { fontSize: 24, fontWeight: '700', color: primaryBlue },
  headerSubtitle: { fontSize: 13, color: '#6B7280', marginTop: 2 },
  markReadBtn: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: primaryBlue,
  },
  markReadText: { color: primaryBlue, fontSize: 12, fontWeight: '600' },
  filterContainer: {
    backgroundColor: '#fff',
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  filterScroll: { paddingHorizontal: 15, gap: 10 },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
  },
  filterTabActive: { backgroundColor: primaryBlue },
  filterTabText: { color: '#6B7280', fontSize: 13, fontWeight: '500' },
  filterTabTextActive: { color: '#fff' },
  scrollArea: { flex: 1, padding: 15 },
  debugBox: {
    backgroundColor: '#FEF3C7',
    borderRadius: 8,
    padding: 10,
    marginBottom: 12,
  },
  debugText: { fontSize: 11, color: '#92400E', fontFamily: 'monospace' },
  emptyState: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60 },
  emptyTitle: { fontSize: 18, fontWeight: '600', color: '#374151', marginTop: 16 },
  emptySubtitle: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 8,
    textAlign: 'center',
    paddingHorizontal: 40,
  },
  notifCard: {
    backgroundColor: '#fff',
    borderRadius: 15,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
    position: 'relative',
  },
  unreadCard: { backgroundColor: '#F0F7FF', borderLeftWidth: 3, borderLeftColor: primaryBlue },
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
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  notifTitle: { fontSize: 15, fontWeight: '700', color: primaryBlue, flex: 1, marginRight: 10 },
  notifTime: { fontSize: 11, color: '#9CA3AF' },
  notifMessage: { fontSize: 13, color: '#4B5563', lineHeight: 18 },
});
