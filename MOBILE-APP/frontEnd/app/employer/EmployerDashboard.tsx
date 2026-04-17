// MOBILE-APP/frontEnd/app/employer/EmployerDashboard.tsx
import React, { useState, useRef, useCallback } from 'react';
import {
  StyleSheet,
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  Animated,
  TouchableWithoutFeedback,
  StatusBar,
    RefreshControl,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useFocusEffect } from 'expo-router';
import { Ionicons, MaterialCommunityIcons, MaterialIcons, FontAwesome5, Feather } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getEmployerDashboard } from '../../src/api';
import axios from 'axios';

const { width, height } = Dimensions.get('window');
const DRAWER_WIDTH = 260;
const API_URL = 'http://10.17.158.249:3000';

// ─── Nav Items ────────────────────────────────────────────────────────────────
const NAV_ITEMS = [
  {
    key: 'EmployerDashboard',
    label: 'Dashboard',
    icon: (color: string) => <Ionicons name="grid-outline" size={20} color={color} />,
    route: '/employer/EmployerDashboard',
  },
  {
    key: 'EmployerMyJobs',
    label: 'My Jobs',
    icon: (color: string) => <Ionicons name="briefcase-outline" size={20} color={color} />,
    route: '/employer/EmployerMyJobs',
  },
  {
    key: 'EmployerApplicants',
    label: 'Applicants',
    icon: (color: string) => <Ionicons name="people-outline" size={20} color={color} />,
    route: '/employer/EmployerApplicants',
  },
  {
    key: 'EmployerShortlisted',
    label: 'Shortlisted',
    icon: (color: string) => <Ionicons name="bookmark-outline" size={20} color={color} />,
    route: '/employer/EmployerShortlisted',
  },
  {
    key: 'EmployerPostJob',
    label: 'Post a Job',
    icon: (color: string) => <Ionicons name="add-circle-outline" size={20} color={color} />,
    route: '/employer/EmployerPostJob',
  },
  {
    key: 'EmployerAIMatching',
    label: 'AI Matching',
    icon: (color: string) => <MaterialIcons name="auto-awesome" size={20} color={color} />,
    route: '/employer/EmployerAIMatching',
  },
  {
    key: 'EmployerSettings',
    label: 'Settings',
    icon: (color: string) => <Ionicons name="settings-outline" size={20} color={color} />,
    route: '/employer/EmployerSettings',
  },
];

// ✅ دالة تحديث حالة الطلب
const updateApplicationStatus = async (applicationId: string, newStatus: string, onRefresh: () => void) => {
  try {
    const token = await AsyncStorage.getItem('userToken');
    const response = await axios.put(
      `${API_URL}/api/applications/${applicationId}/status`,
      { status: newStatus },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    
    if (response.data.success) {
      Alert.alert('Success', `Application ${newStatus}`);
      onRefresh();
    } else {
      Alert.alert('Error', response.data.message || 'Failed to update');
    }
  } catch (error: any) {
    console.log('Error updating status:', error);
    Alert.alert('Error', error.response?.data?.message || 'Failed to update status');
  }
};

// ─── Component ────────────────────────────────────────────────────────────────
export default function EmployerDashboard() {
  const router = useRouter();
  const [stats, setStats]         = useState<any>(null);
  const [loading, setLoading]     = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [userName, setUserName]   = useState('Employer');
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeKey, setActiveKey]  = useState('EmployerDashboard');

  const slideAnim   = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const overlayAnim = useRef(new Animated.Value(0)).current;

  // ── Load Data from Backend ────────────────────────────────────────────────
  const loadData = async () => {
    try {
      setRefreshing(true);
      const stored = await AsyncStorage.getItem('userData');
      if (stored) {
        const parsed = JSON.parse(stored);
        setUserName(parsed.name || 'Employer');
      }

      const data = await getEmployerDashboard();
      console.log('Dashboard Data:', data);
      if (data.success) {
        setStats(data.data);
      }
    } catch (err) {
      console.log('Error loading dashboard:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      setActiveKey('EmployerDashboard');
      loadData();
    }, [])
  );

  // ── Drawer Helpers ────────────────────────────────────────────────────────
  const openDrawer = () => {
    setDrawerOpen(true);
    Animated.parallel([
      Animated.spring(slideAnim, { toValue: 0, useNativeDriver: true, tension: 60, friction: 10 }),
      Animated.timing(overlayAnim, { toValue: 1, duration: 250, useNativeDriver: true }),
    ]).start();
  };

  const closeDrawer = (onDone?: () => void) => {
    Animated.parallel([
      Animated.spring(slideAnim, { toValue: -DRAWER_WIDTH, useNativeDriver: true, tension: 60, friction: 10 }),
      Animated.timing(overlayAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
    ]).start(() => {
      setDrawerOpen(false);
      if (onDone) onDone();
    });
  };

  const handleNavPress = (item: typeof NAV_ITEMS[0]) => {
    if (item.key === 'EmployerDashboard') {
      closeDrawer();
      return;
    }
    setActiveKey(item.key);
    Animated.parallel([
      Animated.spring(slideAnim, { toValue: -DRAWER_WIDTH, useNativeDriver: true, tension: 60, friction: 10 }),
      Animated.timing(overlayAnim, { toValue: 0, duration: 200, useNativeDriver: true }),
    ]).start(() => {
      setDrawerOpen(false);
      router.push(item.route as any);
    });
  };

  const handleLogout = () => {
    closeDrawer(() => {
      router.replace('/' as any);
    });
  };

  // ── Loading ───────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1E3A5F" />
      </View>
    );
  }

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#ffffff" />

      {/* ── TOP BAR ── */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={openDrawer} style={styles.menuBtn}>
          <View style={styles.hamburger}>
            <View style={styles.hLine} />
            <View style={[styles.hLine, { width: 16 }]} />
            <View style={styles.hLine} />
          </View>
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>Dashboard</Text>
      </View>

      {/* ── CONTENT ── */}
     <ScrollView 
  showsVerticalScrollIndicator={false} 
  contentContainerStyle={styles.scrollContent}
  refreshControl={
    <RefreshControl
      refreshing={refreshing}
      onRefresh={loadData}
      colors={["#1E3A5F"]}
      tintColor="#1E3A5F"
    />
  }
>

        {/* Header */}
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <Text style={styles.headerTitle}>{userName}</Text>
            <View style={styles.verifiedBadge}>
              <Ionicons name="checkmark-circle" size={10} color="white" />
              <Text style={styles.verifiedText}>Verified</Text>
            </View>
          </View>
          <Text style={styles.welcomeText}>Welcome back!</Text>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <TouchableOpacity
            style={styles.statCard}
            onPress={() => router.push('/employer/EmployerMyJobs' as any)}
          >
            <View style={styles.statIconBg}>
              <MaterialCommunityIcons name="briefcase-outline" size={18} color="#1E3A5F" />
            </View>
            <Text style={styles.statNumber}>{stats?.stats?.totalJobs || 0}</Text>
            <Text style={styles.statLabel}>Posted Jobs</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.statCard}
            onPress={() => router.push('/employer/EmployerApplicants' as any)}
          >
            <View style={styles.statIconBg}>
              <Ionicons name="document-text-outline" size={18} color="#1E3A5F" />
            </View>
            <Text style={styles.statNumber}>{stats?.stats?.totalApplications || 0}</Text>
            <Text style={styles.statLabel}>Applications</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.statCard}
            onPress={() => router.push('/employer/EmployerShortlisted' as any)}
          >
            <View style={styles.statIconBg}>
              <Ionicons name="bookmark-outline" size={18} color="#1E3A5F" />
            </View>
            <Text style={styles.statNumber}>{stats?.stats?.pendingApplications || 0}</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </TouchableOpacity>
        </View>

        {/* CTA */}
        <View style={styles.ctaCard}>
          <View>
            <Text style={styles.ctaTitle}>Need to hire someone?</Text>
            <Text style={styles.ctaSubtitle}>Create a job posting in minutes</Text>
          </View>
          <TouchableOpacity
            style={styles.ctaButton}
            onPress={() => router.push('/employer/EmployerPostJob' as any)}
          >
            <Text style={styles.ctaButtonText}>+ Post</Text>
          </TouchableOpacity>
        </View>

        {/* Recent Applications مع أزرار Accept/Reject */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Applicants</Text>
          <TouchableOpacity onPress={() => router.push('/employer/EmployerApplicants' as any)}>
            <Text style={styles.seeAll}>See all</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.listContainer}>
          {stats?.recentApplications?.length > 0 ? (
            stats.recentApplications.slice(0, 5).map((app: any, i: number) => (
              <View
                key={app.id || i}
                style={[
                  styles.itemRow,
                  i === Math.min(stats.recentApplications.length, 5) - 1 && { borderBottomWidth: 0 },
                ]}
              >
                <View style={styles.avatarCircle}>
                  <Text style={styles.avatarText}>
                    {(app.studentName || 'U')[0].toUpperCase()}
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.itemName}>{app.studentName || 'Unknown Student'}</Text>
                  <Text style={styles.itemSub}>{app.jobTitle || 'Job Title'}</Text>
                  <View style={[
                    styles.badge,
                    {
                      backgroundColor:
                        app.status === 'pending'  ? '#FEF3C7' :
                        app.status === 'accepted' ? '#DCFCE7' : '#FEE2E2',
                      alignSelf: 'flex-start',
                      marginTop: 4,
                    },
                  ]}>
                    <Text style={[
                      styles.badgeText,
                      {
                        color:
                          app.status === 'pending'  ? '#92400e' :
                          app.status === 'accepted' ? '#065f46' : '#991b1b',
                      },
                    ]}>
                      {app.status}
                    </Text>
                  </View>
                </View>
                
                {/* ✅ أزرار Accept و Reject */}
                {app.status === 'pending' && (
                  <View style={styles.actionButtons}>
                    <TouchableOpacity 
                      style={[styles.actionBtn, styles.acceptBtn]} 
                      onPress={() => updateApplicationStatus(app.id, 'accepted', loadData)}
                    >
                      <Ionicons name="checkmark" size={14} color="#fff" />
                      <Text style={styles.actionBtnText}>Accept</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity 
                      style={[styles.actionBtn, styles.rejectBtn]} 
                      onPress={() => updateApplicationStatus(app.id, 'rejected', loadData)}
                    >
                      <Ionicons name="close" size={14} color="#fff" />
                      <Text style={styles.actionBtnText}>Reject</Text>
                    </TouchableOpacity>
                  </View>
                )}
                
                {app.status === 'accepted' && (
                  <View style={[styles.statusBadge, { backgroundColor: '#DCFCE7' }]}>
                    <Text style={[styles.statusBadgeText, { color: '#16A34A' }]}>✓ Accepted</Text>
                  </View>
                )}
                
                {app.status === 'rejected' && (
                  <View style={[styles.statusBadge, { backgroundColor: '#FEE2E2' }]}>
                    <Text style={[styles.statusBadgeText, { color: '#DC2626' }]}>✗ Rejected</Text>
                  </View>
                )}
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>No applications yet.</Text>
          )}
        </View>

        <View style={{ height: 30 }} />
      </ScrollView>

      {/* ── OVERLAY ── */}
      {drawerOpen && (
        <TouchableWithoutFeedback onPress={() => closeDrawer()}>
          <Animated.View style={[styles.overlay, { opacity: overlayAnim }]} />
        </TouchableWithoutFeedback>
      )}

      {/* ── SIDE DRAWER ── */}
      <Animated.View style={[styles.drawer, { transform: [{ translateX: slideAnim }] }]}>

        {/* Drawer Header */}
        <View style={styles.drawerHeader}>
          <View style={styles.drawerAvatar}>
            <Text style={styles.drawerAvatarText}>{userName[0]?.toUpperCase() || 'E'}</Text>
          </View>
          <Text style={styles.drawerName}>{userName}</Text>
          <Text style={styles.drawerRole}>Employer</Text>
          <TouchableOpacity onPress={() => closeDrawer()} style={styles.drawerCloseBtn}>
            <Ionicons name="close" size={20} color="rgba(255,255,255,0.7)" />
          </TouchableOpacity>
        </View>

        {/* Nav Items */}
        <ScrollView style={styles.drawerNav} showsVerticalScrollIndicator={false}>
          {NAV_ITEMS.map((item) => {
            const isActive = activeKey === item.key;
            return (
              <TouchableOpacity
                key={item.key}
                style={[styles.navItem, isActive && styles.navItemActive]}
                onPress={() => handleNavPress(item)}
                activeOpacity={0.7}
              >
                <View style={[styles.navIcon, isActive && styles.navIconActive]}>
                  {item.icon(isActive ? '#1E3A5F' : '#64748b')}
                </View>
                <Text style={[styles.navLabel, isActive && styles.navLabelActive]}>
                  {item.label}
                </Text>
                {isActive && <View style={styles.navActiveBar} />}
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Logout */}
        <TouchableOpacity style={styles.drawerLogout} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={20} color="#ef4444" />
          <Text style={styles.drawerLogoutText}>Logout</Text>
        </TouchableOpacity>

      </Animated.View>
    </SafeAreaView>
  );
}

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8fafc' },

  // Top Bar
  topBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingVertical: 12, backgroundColor: 'white',
    borderBottomWidth: 1, borderBottomColor: '#f1f5f9',
    elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06,
  },
  menuBtn: { padding: 4 },
  hamburger: { gap: 4 },
  hLine: { width: 22, height: 2, backgroundColor: '#1E3A5F', borderRadius: 2 },
  topBarTitle: { fontSize: 16, fontWeight: '700', color: '#1E3A5F' },

  // Scroll
  scrollContent: { padding: 20, paddingBottom: 40 },

  // Header
  header: { marginBottom: 20 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  headerTitle: { fontSize: 22, color: '#1E3A5F', fontWeight: '700' },
  verifiedBadge: {
    backgroundColor: '#00C851', paddingHorizontal: 8, paddingVertical: 3,
    borderRadius: 12, flexDirection: 'row', alignItems: 'center', gap: 3,
  },
  verifiedText: { color: 'white', fontSize: 10, fontWeight: '600' },
  welcomeText: { color: '#666', marginTop: 4, fontSize: 14 },

  // Stats
  statsGrid: {
    flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 20,
  },
  statCard: {
    width: '48%', backgroundColor: 'white', padding: 15, borderRadius: 14, marginBottom: 14,
    elevation: 3, shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08,
  },
  statIconBg: {
    width: 34, height: 34, borderRadius: 10, backgroundColor: '#EBF0F9',
    justifyContent: 'center', alignItems: 'center', marginBottom: 8,
  },
  statNumber: { fontSize: 22, fontWeight: '800', color: '#1E3A5F' },
  statLabel: { color: '#94a3b8', fontSize: 12, marginTop: 2 },

  // CTA
  ctaCard: {
    backgroundColor: '#1E3A5F', borderRadius: 14, padding: 20,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 25,
  },
  ctaTitle: { color: 'white', fontSize: 16, fontWeight: '700' },
  ctaSubtitle: { color: 'rgba(255,255,255,0.7)', fontSize: 12, marginTop: 3 },
  ctaButton: {
    backgroundColor: 'white', paddingHorizontal: 18, paddingVertical: 10, borderRadius: 10,
  },
  ctaButtonText: { color: '#1E3A5F', fontWeight: '700', fontSize: 14 },

  // Recent Applicants
  sectionHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12,
  },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: '#1E3A5F' },
  seeAll: { fontSize: 13, color: '#1E3A5F', fontWeight: '600' },
  listContainer: {
    backgroundColor: 'white', borderRadius: 14, paddingHorizontal: 15,
    elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06,
  },
  itemRow: {
    flexDirection: 'row', alignItems: 'center', paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: '#f1f5f9', gap: 12,
  },
  avatarCircle: {
    width: 38, height: 38, borderRadius: 19, backgroundColor: '#EBF0F9',
    justifyContent: 'center', alignItems: 'center',
  },
  avatarText: { fontSize: 15, fontWeight: '700', color: '#1E3A5F' },
  itemName: { fontWeight: '600', color: '#1e293b', fontSize: 14 },
  itemSub: { fontSize: 12, color: '#94a3b8', marginTop: 1 },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  badgeText: { fontSize: 11, fontWeight: 'bold' },
  emptyText: { color: '#999', textAlign: 'center', marginTop: 20, marginBottom: 20, fontSize: 14 },

  // ✅ Styles جديدة للأزرار
  actionButtons: {
    flexDirection: 'row',
    gap: 6,
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    gap: 4,
  },
  acceptBtn: {
    backgroundColor: '#16A34A',
  },
  rejectBtn: {
    backgroundColor: '#DC2626',
  },
  actionBtnText: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
  },
  statusBadgeText: {
    fontSize: 11,
    fontWeight: '600',
  },

  // Overlay
  overlay: {
    position: 'absolute', top: 0, left: 0, width, height,
    backgroundColor: 'rgba(0,0,0,0.45)', zIndex: 10,
  },

  // Drawer
  drawer: {
    position: 'absolute', top: 0, left: 0, width: DRAWER_WIDTH, height,
    backgroundColor: 'white', zIndex: 20, elevation: 20,
    shadowColor: '#000', shadowOffset: { width: 4, height: 0 }, shadowOpacity: 0.18, shadowRadius: 12,
  },
  drawerHeader: {
    backgroundColor: '#1E3A5F', paddingTop: 50, paddingBottom: 24, paddingHorizontal: 20,
  },
  drawerAvatar: {
    width: 52, height: 52, borderRadius: 26, backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center', alignItems: 'center', marginBottom: 10,
    borderWidth: 2, borderColor: 'rgba(255,255,255,0.4)',
  },
  drawerAvatarText: { fontSize: 22, fontWeight: '800', color: 'white' },
  drawerName: { color: 'white', fontWeight: '700', fontSize: 15 },
  drawerRole: { color: 'rgba(255,255,255,0.65)', fontSize: 12, marginTop: 2 },
  drawerCloseBtn: { position: 'absolute', top: 50, right: 16, padding: 4 },

  drawerNav: { flex: 1, paddingTop: 10 },
  navItem: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 13, paddingHorizontal: 20, gap: 14, position: 'relative',
  },
  navItemActive: { backgroundColor: '#EBF0F9' },
  navIcon: {
    width: 36, height: 36, borderRadius: 10, backgroundColor: '#f1f5f9',
    justifyContent: 'center', alignItems: 'center',
  },
  navIconActive: { backgroundColor: '#D1DCF0' },
  navLabel: { fontSize: 14, fontWeight: '500', color: '#64748b', flex: 1 },
  navLabelActive: { color: '#1E3A5F', fontWeight: '700' },
  navActiveBar: {
    position: 'absolute', right: 0, top: 8, bottom: 8,
    width: 3.5, backgroundColor: '#1E3A5F', borderRadius: 4,
  },

  drawerLogout: {
    flexDirection: 'row', alignItems: 'center', gap: 12,
    padding: 20, borderTopWidth: 1, borderTopColor: '#f1f5f9',
  },
  drawerLogoutText: { fontSize: 14, fontWeight: '600', color: '#ef4444' },
});