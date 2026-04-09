import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  Animated,

  StatusBar,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons, Feather, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

const { width } = Dimensions.get('window');
const SIDEBAR_WIDTH = width * 0.75;

// ─── Colors ───
const COLORS = {
  primary: '#1E3A5F',
  secondary: '#f8fafc',
  white: '#ffffff',
  textGray: '#666',
  accent: '#10b981',
  danger: '#ef4444',
  warning: '#f59e0b',
};

const AdminDashboard: React.FC = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const slideAnim = useRef(new Animated.Value(-SIDEBAR_WIDTH)).current;

  // ─── Data States ───
  const [stats, setStats] = useState({
    totalUsers: 1245,
    activeJobs: 82,
    totalApplications: 892,
    placementRate: 67,
  });

  const weeklyData = [
    { name: 'Sun', apps: 45, jobs: 12 },
    { name: 'Mon', apps: 52, jobs: 15 },
    { name: 'Tue', apps: 38, jobs: 10 },
    { name: 'Wed', apps: 65, jobs: 18 },
    { name: 'Thu', apps: 58, jobs: 14 },
    { name: 'Fri', apps: 42, jobs: 11 },
    { name: 'Sat', apps: 37, jobs: 9 },
  ];

  const appStatus = [
    { name: 'Pending', val: 35, color: COLORS.warning },
    { name: 'Interview', val: 20, color: '#8b5cf6' },
    { name: 'Accepted', val: 15, color: COLORS.accent },
  ];

  useEffect(() => {
    setTimeout(() => setLoading(false), 800);
  }, []);

  const toggleSidebar = () => {
    const toValue = isSidebarOpen ? -SIDEBAR_WIDTH : 0;
    Animated.timing(slideAnim, { toValue, duration: 300, useNativeDriver: true }).start();
    setIsSidebarOpen(!isSidebarOpen);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.secondary }}>
      <StatusBar barStyle="dark-content" />
      
      {isSidebarOpen && <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={toggleSidebar} />}

      {/* ── Side Nav Bar ── */}
      <Animated.View style={[styles.sidebar, { transform: [{ translateX: slideAnim }] }]}>
        <View style={styles.sidebarProfileSection}>
          <TouchableOpacity onPress={toggleSidebar} style={styles.closeBtn}>
            <Ionicons name="close" size={24} color={COLORS.white} />
          </TouchableOpacity>
          <View style={styles.avatarCircle}>
            <MaterialIcons name="admin-panel-settings" size={35} color={COLORS.white} />
          </View>
          <Text style={styles.profileName}>Admin</Text>
          <Text style={styles.profileDept}>System Management</Text>
        </View>

        <ScrollView style={styles.sidebarMenu}>
          <SidebarItem icon="grid-view" label="Dashboard" active onPress={toggleSidebar} />
          <SidebarItem icon="work-outline" label="Manage Jobs" onPress={() => router.push('/admin/AdminManageJobs')} />
          <SidebarItem icon="people-outline" label="Manage Users" onPress={() => router.push('/admin/AdminManageUsers')} />
          <SidebarItem icon="report-problem" label="Reports" />
          <SidebarItem icon="settings" label="Settings" />
        </ScrollView>

        <TouchableOpacity style={styles.logoutContainer} onPress={() => router.replace('/')}>
          <MaterialIcons name="logout" size={22} color={COLORS.danger} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </Animated.View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* ── Header ── */}
        <View style={styles.topHeader}>
          <View style={styles.headerRow}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TouchableOpacity onPress={toggleSidebar}>
                <Ionicons name="menu" size={32} color={COLORS.primary} />
              </TouchableOpacity>
              <Text style={styles.mainTitle}>Admin Dashboard</Text>
            </View>
            <TouchableOpacity style={styles.exportButton}>
              <Text style={styles.exportText}>Export</Text>
            </TouchableOpacity>
          </View>
          <Text style={styles.subTitleText}>Manage and monitor the faculty jobs portal</Text>
        </View>

        {/* ── Search ── */}
        <View style={styles.searchSection}>
          <View style={styles.searchContainer}>
            <Ionicons name="search" size={20} color="#999" />
            <TextInput placeholder="Search anything..." style={styles.searchInput} />
          </View>
        </View>

        <View style={styles.body}>
          {/* ── Stats Grid ── */}
          <View style={styles.statsGrid}>
            <StatBox label="Total Users" value={stats.totalUsers} icon="people" color="#3b82f6" />
            <StatBox label="Active Jobs" value={stats.activeJobs} icon="business-center" color={COLORS.accent} />
          </View>

          {/* ── System Health (التي كانت محذوفة) ── */}
          <View style={styles.systemHealthCard}>
             <Text style={styles.healthTitle}>🛡️ System Health</Text>
             <View style={styles.healthRow}>
                <View style={styles.healthItem}><Text style={styles.healthLabel}>DB Backup</Text><Text style={styles.healthVal}>Done</Text></View>
                <View style={styles.healthItem}><Text style={styles.healthLabel}>Server</Text><Text style={styles.healthVal}>Stable</Text></View>
                <View style={styles.healthItem}><Text style={styles.healthLabel}>API</Text><Text style={styles.healthVal}>99.9%</Text></View>
             </View>
          </View>

          {/* ── Weekly Activity Chart ── */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>📊 Weekly Activity</Text>
            <View style={styles.barChart}>
              {weeklyData.map((d, i) => (
                <View key={i} style={styles.barContainer}>
                  <View style={[styles.bar, { height: d.apps, backgroundColor: COLORS.primary }]} />
                  <Text style={styles.barLabel}>{d.name}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* ── Application Status ── */}
          <View style={styles.card}>
            <Text style={styles.cardTitle}>🥧 Application Status</Text>
            {appStatus.map((item, i) => (
              <View key={i} style={styles.statusRow}>
                <Text style={styles.statusName}>{item.name}</Text>
                <View style={styles.progressBg}><View style={[styles.progressFill, { width: `${item.val}%`, backgroundColor: item.color }]} /></View>
                <Text style={styles.statusVal}>{item.val}%</Text>
              </View>
            ))}
          </View>

          {/* ── Pending Verifications ── */}
          <View style={styles.card}>
            <View style={styles.cardHeaderRow}>
              <Text style={styles.cardTitle}>👤 Pending Verifications</Text>
              <TouchableOpacity><Text style={styles.seeAll}>See All</Text></TouchableOpacity>
            </View>
            <ListItem name="Dr. Ahmed Hassan" sub="Chemistry Dept" status="Review" />
            <ListItem name="Dr. Sara Mahmoud" sub="Physics Dept" status="Review" />
          </View>

          {/* ── Flagged Content (التي كانت محذوفة) ── */}
          <View style={[styles.card, { marginBottom: 30 }]}>
            <Text style={styles.cardTitle}>🚩 Flagged Content</Text>
            <ListItem name="Inappropriate Job Post" sub="Reported by Student" status="High" danger />
            <ListItem name="Spam Profile" sub="Reported by Admin" status="Low" />
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// ─── Helper Components ───
const SidebarItem = ({ icon, label, active, onPress }: any) => (
  <TouchableOpacity style={[styles.menuItem, active && styles.activeMenuItem]} onPress={onPress}>
    <MaterialIcons name={icon} size={24} color={COLORS.primary} style={{ opacity: active ? 1 : 0.7 }} />
    <Text style={[styles.menuLabel, active && styles.activeMenuLabel]}>{label}</Text>
  </TouchableOpacity>
);

const StatBox = ({ label, value, icon, color }: any) => (
  <View style={styles.statBox}>
    <View style={[styles.iconCircle, { backgroundColor: color + '20' }]}>
      <MaterialIcons name={icon} size={24} color={color} />
    </View>
    <Text style={styles.statValue}>{value}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

const ListItem = ({ name, sub, status, danger }: any) => (
  <View style={styles.listItem}>
    <View>
      <Text style={styles.itemName}>{name}</Text>
      <Text style={styles.itemSub}>{sub}</Text>
    </View>
    <View style={[styles.badge, danger && { backgroundColor: '#fee2e2' }]}>
      <Text style={[styles.badgeText, danger && { color: COLORS.danger }]}>{status}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.4)', zIndex: 99 },
  sidebar: { position: 'absolute', left: 0, top: 0, bottom: 0, width: SIDEBAR_WIDTH, backgroundColor: COLORS.white, zIndex: 100, elevation: 10 },
  sidebarProfileSection: { backgroundColor: COLORS.primary, padding: 20, paddingTop: 50 },
  closeBtn: { alignSelf: 'flex-end', marginBottom: -10 },
  avatarCircle: { width: 60, height: 60, borderRadius: 30, backgroundColor: 'rgba(255,255,255,0.2)', justifyContent: 'center', alignItems: 'center', marginBottom: 10, borderWidth: 1, borderColor: COLORS.white },
  profileName: { color: COLORS.white, fontSize: 20, fontWeight: 'bold' },
  profileDept: { color: 'rgba(255,255,255,0.7)', fontSize: 13 },
  sidebarMenu: { padding: 15 },
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: 15, borderRadius: 10, marginBottom: 5 },
  activeMenuItem: { backgroundColor: '#eef2ff' },
  menuLabel: { marginLeft: 15, fontSize: 16, color: COLORS.primary, fontWeight: '500' },
  activeMenuLabel: { fontWeight: 'bold' },
  logoutContainer: { flexDirection: 'row', alignItems: 'center', padding: 20, borderTopWidth: 1, borderTopColor: '#eee' },
  logoutText: { marginLeft: 15, color: COLORS.danger, fontWeight: 'bold', fontSize: 16 },
  topHeader: { paddingHorizontal: 20, paddingTop: 20, backgroundColor: COLORS.secondary },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  mainTitle: { fontSize: 22, fontWeight: 'bold', color: COLORS.primary, marginLeft: 10 },
  exportButton: { borderWidth: 1.5, borderColor: COLORS.primary, borderRadius: 8, paddingHorizontal: 15, paddingVertical: 5 },
  exportText: { color: COLORS.primary, fontWeight: 'bold' },
  subTitleText: { fontSize: 14, color: COLORS.textGray, marginLeft: 45, marginTop: -5 },
  searchSection: { paddingHorizontal: 20, paddingVertical: 15 },
  searchContainer: { flexDirection: 'row', alignItems: 'center', backgroundColor: COLORS.white, borderRadius: 12, paddingHorizontal: 15, height: 45, elevation: 2 },
  searchInput: { flex: 1, marginLeft: 10 },
  body: { paddingHorizontal: 20 },
  statsGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  statBox: { backgroundColor: COLORS.white, width: '48%', padding: 15, borderRadius: 15, elevation: 2 },
  iconCircle: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  statValue: { fontSize: 20, fontWeight: 'bold', color: COLORS.primary },
  statLabel: { fontSize: 13, color: COLORS.textGray },
  systemHealthCard: { backgroundColor: COLORS.primary, borderRadius: 15, padding: 15, marginBottom: 20 },
  healthTitle: { color: COLORS.white, fontWeight: 'bold', marginBottom: 10 },
  healthRow: { flexDirection: 'row', justifyContent: 'space-between' },
  healthItem: { alignItems: 'center' },
  healthLabel: { color: 'rgba(255,255,255,0.6)', fontSize: 11 },
  healthVal: { color: COLORS.white, fontWeight: 'bold', fontSize: 13 },
  card: { backgroundColor: COLORS.white, borderRadius: 15, padding: 15, marginBottom: 15, elevation: 2 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: COLORS.primary, marginBottom: 15 },
  barChart: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-end', height: 80 },
  barContainer: { alignItems: 'center' },
  bar: { width: 12, borderRadius: 4 },
  barLabel: { fontSize: 10, marginTop: 5, color: '#999' },
  statusRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  statusName: { width: 70, fontSize: 12 },
  progressBg: { flex: 1, height: 6, backgroundColor: '#eee', borderRadius: 3, marginHorizontal: 10 },
  progressFill: { height: 6, borderRadius: 3 },
  statusVal: { fontSize: 12, fontWeight: 'bold' },
  cardHeaderRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  seeAll: { color: COLORS.primary, fontWeight: 'bold', fontSize: 12 },
  listItem: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#f8fafc' },
  itemName: { fontSize: 14, fontWeight: '600' },
  itemSub: { fontSize: 12, color: '#999' },
  badge: { backgroundColor: '#f1f5f9', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 6 },
  badgeText: { fontSize: 11, fontWeight: 'bold', color: COLORS.primary },
});

export default AdminDashboard;