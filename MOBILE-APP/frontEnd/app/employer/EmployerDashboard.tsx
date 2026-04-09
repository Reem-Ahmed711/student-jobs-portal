import React, { useState, useEffect, useRef, useCallback } from 'react';
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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { useFocusEffect } from '@react-navigation/native';
import { Ionicons, MaterialIcons, FontAwesome5 } from '@expo/vector-icons';

const { width, height } = Dimensions.get('window');
const DRAWER_WIDTH = 260;

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
    key: 'EmployerHiringHistory',
    label: 'Hiring History',
    icon: (color: string) => <FontAwesome5 name="history" size={18} color={color} />,
    route: '/employer/EmployerHiringHistory',
  },
  {
    key: 'EmployerPostJob',
    label: 'Post a Job',
    icon: (color: string) => <Ionicons name="add-circle-outline" size={20} color={color} />,
    route: '/employer/PostJob',
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

// ─── Component ────────────────────────────────────────────────────────────────
const EmployerDashboard: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading]     = useState<boolean>(true);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [activeKey, setActiveKey]  = useState('EmployerDashboard');

  const slideAnim   = useRef(new Animated.Value(-DRAWER_WIDTH)).current;
  const overlayAnim = useRef(new Animated.Value(0)).current;

  // ✅ كل ما الـ Dashboard يرجع يبقى active تاني
  useFocusEffect(
    useCallback(() => {
      setActiveKey('EmployerDashboard');
    }, [])
  );

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // ── Drawer Helpers ───────────────────────────────────────────────────────────
  const openDrawer = () => {
    setDrawerOpen(true);
    Animated.parallel([
      Animated.spring(slideAnim, {
        toValue: 0, useNativeDriver: true, tension: 60, friction: 10,
      }),
      Animated.timing(overlayAnim, {
        toValue: 1, duration: 250, useNativeDriver: true,
      }),
    ]).start();
  };

  const closeDrawer = (onDone?: () => void) => {
    Animated.parallel([
      Animated.spring(slideAnim, {
        toValue: -DRAWER_WIDTH, useNativeDriver: true, tension: 60, friction: 10,
      }),
      Animated.timing(overlayAnim, {
        toValue: 0, duration: 200, useNativeDriver: true,
      }),
    ]).start(() => {
      setDrawerOpen(false);
      if (onDone) onDone();
    });
  };

  // ✅ Navigation مضمونة لكل item
  const handleNavPress = (item: typeof NAV_ITEMS[0]) => {
    // لو نفس الـ Dashboard، بس اقفل الـ drawer
    if (item.key === 'EmployerDashboard') {
      closeDrawer();
      return;
    }

    // عيّن الـ active key فوراً
    setActiveKey(item.key);

    // اعمل الـ animation وبعدين navigate
    Animated.parallel([
      Animated.spring(slideAnim, {
        toValue: -DRAWER_WIDTH, useNativeDriver: true, tension: 60, friction: 10,
      }),
      Animated.timing(overlayAnim, {
        toValue: 0, duration: 200, useNativeDriver: true,
      }),
    ]).start(() => {
      setDrawerOpen(false);
      // ✅ push بدل replace عشان الـ back button يشتغل
      router.push(item.route as any);
    });
  };

  const handleLogout = () => {
    closeDrawer(() => {
      router.replace('/' as any);
    });
  };

  // ── Loading Screen ───────────────────────────────────────────────────────────
  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#1E3A5F" />
      </View>
    );
  }

  // ── Main Render ──────────────────────────────────────────────────────────────
  return (
    <SafeAreaView style={styles.container}>

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
        <TouchableOpacity style={styles.notifBtn}>
          <Ionicons name="notifications-outline" size={22} color="#1E3A5F" />
          <View style={styles.notifDot} />
        </TouchableOpacity>
      </View>

      {/* ── CONTENT ── */}
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.titleRow}>
            <Text style={styles.headerTitle}>Physics Department</Text>
            <View style={styles.verifiedBadge}>
              <Ionicons name="checkmark-circle" size={10} color="white" />
              <Text style={styles.verifiedText}>Verified</Text>
            </View>
          </View>
          <Text style={styles.welcomeText}>Welcome back, Dr. Sarah Mahmoud!</Text>
        </View>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          <TouchableOpacity
            style={styles.statCard}
            onPress={() => router.push('/employer/EmployerMyJobs' as any)}
          >
            <View style={styles.statIconBg}>
              <Ionicons name="briefcase" size={18} color="#1E3A5F" />
            </View>
            <Text style={styles.statNumber}>6</Text>
            <Text style={styles.statLabel}>Active Jobs</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.statCard}
            onPress={() => router.push('/employer/EmployerApplicants' as any)}
          >
            <View style={styles.statIconBg}>
              <Ionicons name="people" size={18} color="#1E3A5F" />
            </View>
            <Text style={styles.statNumber}>48</Text>
            <Text style={styles.statLabel}>Applicants</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.statCard}
            onPress={() => router.push('/employer/EmployerShortlisted' as any)}
          >
            <View style={styles.statIconBg}>
              <Ionicons name="bookmark" size={18} color="#1E3A5F" />
            </View>
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>Shortlisted</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.statCard}
            onPress={() => router.push('/employer/EmployerHiringHistory' as any)}
          >
            <View style={styles.statIconBg}>
              <FontAwesome5 name="history" size={16} color="#1E3A5F" />
            </View>
            <Text style={styles.statNumber}>5</Text>
            <Text style={styles.statLabel}>Hired</Text>
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
            onPress={() => router.push('/employer/PostJob' as any)}
          >
            <Text style={styles.ctaButtonText}>+ Post</Text>
          </TouchableOpacity>
        </View>

        {/* Recent Applicants */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Recent Applicants</Text>
          <TouchableOpacity onPress={() => router.push('/employer/EmployerApplicants' as any)}>
            <Text style={styles.seeAll}>See all</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.listContainer}>
          {[
            { name: 'Ahmed Ali',   role: 'Teaching Assistant'  },
            { name: 'Mona Salem',  role: 'Lab Manager'         },
            { name: 'Omar Khaled', role: 'Research Assistant'  },
          ].map((item, i) => (
            <View
              key={i}
              style={[styles.itemRow, i === 2 && { borderBottomWidth: 0 }]}
            >
              <View style={styles.avatarCircle}>
                <Text style={styles.avatarText}>{item.name[0]}</Text>
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.itemName}>{item.name}</Text>
                <Text style={styles.itemSub}>{item.role}</Text>
              </View>
              <Ionicons name="chevron-forward" size={16} color="#ccc" />
            </View>
          ))}
        </View>
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
            <Text style={styles.drawerAvatarText}>S</Text>
          </View>
          <Text style={styles.drawerName}>Dr. Sarah Mahmoud</Text>
          <Text style={styles.drawerRole}>Physics Department</Text>
          <TouchableOpacity
            onPress={() => closeDrawer()}
            style={styles.drawerCloseBtn}
          >
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
};

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },

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
  notifBtn: { position: 'relative', padding: 4 },
  notifDot: {
    position: 'absolute', top: 4, right: 4,
    width: 7, height: 7, borderRadius: 4, backgroundColor: '#ef4444',
    borderWidth: 1, borderColor: 'white',
  },

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

export default EmployerDashboard;
