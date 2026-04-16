// MOBILE-APP/frontEnd/app/admin/AdminDashboard.tsx
import React, { useState, useEffect, useRef } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Dimensions,
  Animated,
  StatusBar,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons, Feather, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAdminStats } from '../../src/api';

const { width } = Dimensions.get('window');
const SIDEBAR_WIDTH = width * 0.75;
const COLORS = {
  primary: '#1E3A5F',
  secondary: '#f8fafc',
  white: '#ffffff',
  textGray: '#666',
  accent: '#10b981',
  danger: '#ef4444',
  warning: '#f59e0b',
};

const AdminDashboard = () => {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [stats, setStats] = useState<any>(null);
  const [adminName, setAdminName] = useState('Admin');
  const slideAnim = useRef(new Animated.Value(-SIDEBAR_WIDTH)).current;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const stored = await AsyncStorage.getItem('userData');
        if (stored) {
          const parsed = JSON.parse(stored);
          setAdminName(parsed.name || 'Admin');
        }

        const res = await getAdminStats();
        if (res.success && res.data) {
          setStats(res.data);
        }
      } catch (err) {
        console.log('Failed to load stats:', err);
        Alert.alert('Error', 'Failed to load dashboard stats');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const toggleSidebar = () => {
    const toValue = isSidebarOpen ? -SIDEBAR_WIDTH : 0;
    Animated.timing(slideAnim, { toValue, duration: 300, useNativeDriver: true }).start();
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleLogout = async () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await AsyncStorage.removeItem('userToken');
          await AsyncStorage.removeItem('userData');
          router.replace('/login');
        },
      },
    ]);
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text style={{ marginTop: 10, color: '#666' }}>Loading dashboard...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.secondary }}>
      <StatusBar barStyle="dark-content" />

      {isSidebarOpen && (
        <TouchableOpacity style={styles.overlay} activeOpacity={1} onPress={toggleSidebar} />
      )}

      <Animated.View style={[styles.sidebar, { transform: [{ translateX: slideAnim }] }]}>
        <View style={styles.sidebarProfileSection}>
          <TouchableOpacity onPress={toggleSidebar} style={styles.closeBtn}>
            <Ionicons name="close" size={24} color={COLORS.white} />
          </TouchableOpacity>
          <View style={styles.avatarCircle}>
            <MaterialIcons name="admin-panel-settings" size={35} color={COLORS.white} />
          </View>
          <Text style={styles.profileName}>{adminName}</Text>
          <Text style={styles.profileDept}>System Management</Text>
        </View>

        <ScrollView style={styles.sidebarMenu}>
          <SidebarItem icon="grid-view" label="Dashboard" active onPress={toggleSidebar} />
          <SidebarItem
            icon="work-outline"
            label="Manage Jobs"
            onPress={() => {
              toggleSidebar();
              router.push('/admin/AdminManageJobs');
            }}
          />
          <SidebarItem
            icon="people-outline"
            label="Manage Users"
            onPress={() => {
              toggleSidebar();
              router.push('/admin/AdminManageUsers');
            }}
          />
          <SidebarItem
            icon="person-outline"
            label="Profile"
            onPress={() => {
              toggleSidebar();
              router.push('/admin/AdminProfile');
            }}
          />
        </ScrollView>

        <TouchableOpacity style={styles.logoutContainer} onPress={handleLogout}>
          <MaterialIcons name="logout" size={22} color={COLORS.danger} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </Animated.View>

      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.topHeader}>
          <View style={styles.headerRow}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TouchableOpacity onPress={toggleSidebar}>
                <Ionicons name="menu" size={32} color={COLORS.primary} />
              </TouchableOpacity>
              <Text style={styles.mainTitle}>Admin Dashboard</Text>
            </View>
          </View>
          <Text style={styles.subTitleText}>Monitor the faculty jobs portal</Text>
        </View>

        <View style={styles.body}>
          <View style={styles.statsGrid}>
            <StatBox label="Total Students" value={stats?.totalStudents || 0} icon="school" color="#3b82f6" />
            <StatBox label="Total Employers" value={stats?.totalEmployers || 0} icon="business-center" color={COLORS.accent} />
          </View>
          <View style={styles.statsGrid}>
            <StatBox label="Active Jobs" value={stats?.totalJobs || 0} icon="work" color="#8b5cf6" />
            <StatBox label="Applications" value={stats?.totalApplications || 0} icon="description" color={COLORS.warning} />
          </View>
          <View style={styles.statsGrid}>
            <StatBox label="Admins" value={stats?.totalAdmins || 0} icon="admin-panel-settings" color="#06b6d4" />
            <StatBox label="Recent Registrations" value={stats?.recentRegistrations || 0} icon="person-add" color="#f97316" />
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>🥧 Application Status</Text>
            <View style={styles.statusRow}>
              <Text style={styles.statusName}>Pending</Text>
              <View style={styles.progressBg}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${((stats?.applicationsByStatus?.pending || 0) / (stats?.totalApplications || 1)) * 100}%`,
                      backgroundColor: COLORS.warning,
                    },
                  ]}
                />
              </View>
              <Text style={styles.statusVal}>{stats?.applicationsByStatus?.pending || 0}</Text>
            </View>
            <View style={styles.statusRow}>
              <Text style={styles.statusName}>Accepted</Text>
              <View style={styles.progressBg}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${((stats?.applicationsByStatus?.accepted || 0) / (stats?.totalApplications || 1)) * 100}%`,
                      backgroundColor: COLORS.accent,
                    },
                  ]}
                />
              </View>
              <Text style={styles.statusVal}>{stats?.applicationsByStatus?.accepted || 0}</Text>
            </View>
            <View style={styles.statusRow}>
              <Text style={styles.statusName}>Rejected</Text>
              <View style={styles.progressBg}>
                <View
                  style={[
                    styles.progressFill,
                    {
                      width: `${((stats?.applicationsByStatus?.rejected || 0) / (stats?.totalApplications || 1)) * 100}%`,
                      backgroundColor: COLORS.danger,
                    },
                  ]}
                />
              </View>
              <Text style={styles.statusVal}>{stats?.applicationsByStatus?.rejected || 0}</Text>
            </View>
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>📊 Jobs by Department</Text>
            {stats?.jobsByDepartment && Object.keys(stats.jobsByDepartment).length > 0 ? (
              Object.entries(stats.jobsByDepartment).map(([dept, count]: [string, any], i) => (
                <View key={i} style={styles.listItem}>
                  <View>
                    <Text style={styles.itemName}>{dept}</Text>
                  </View>
                  <View style={styles.badge}>
                    <Text style={styles.badgeText}>{count} Jobs</Text>
                  </View>
                </View>
              ))
            ) : (
              <Text style={{ color: '#999', textAlign: 'center', padding: 10 }}>No data yet</Text>
            )}
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>👨‍🎓 Students by Department</Text>
            {stats?.studentsByDepartment && Object.keys(stats.studentsByDepartment).length > 0 ? (
              Object.entries(stats.studentsByDepartment).map(([dept, count]: [string, any], i) => (
                <View key={i} style={styles.listItem}>
                  <View>
                    <Text style={styles.itemName}>{dept}</Text>
                  </View>
                  <View style={[styles.badge, { backgroundColor: '#EFF6FF' }]}>
                    <Text style={[styles.badgeText, { color: '#1E3A5F' }]}>{count} Students</Text>
                  </View>
                </View>
              ))
            ) : (
              <Text style={{ color: '#999', textAlign: 'center', padding: 10 }}>No data yet</Text>
            )}
          </View>

          <View style={styles.card}>
            <Text style={styles.cardTitle}>🏢 Employers by Industry</Text>
            {stats?.employersByIndustry && Object.keys(stats.employersByIndustry).length > 0 ? (
              Object.entries(stats.employersByIndustry).map(([industry, count]: [string, any], i) => (
                <View key={i} style={styles.listItem}>
                  <View>
                    <Text style={styles.itemName}>{industry}</Text>
                  </View>
                  <View style={[styles.badge, { backgroundColor: '#F0FDF4' }]}>
                    <Text style={[styles.badgeText, { color: '#065F46' }]}>{count}</Text>
                  </View>
                </View>
              ))
            ) : (
              <Text style={{ color: '#999', textAlign: 'center', padding: 10 }}>No data yet</Text>
            )}
          </View>

          {/* Top Rated Students */}
          {stats?.topStudents && stats.topStudents.length > 0 && (
            <View style={styles.card}>
              <Text style={styles.cardTitle}>⭐ Top Rated Students</Text>
              {stats.topStudents.slice(0, 5).map((student: any, i: number) => (
                <View key={i} style={styles.listItem}>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <View style={styles.smallAvatar}>
                      <Text style={styles.smallAvatarText}>{(student.name || '?').charAt(0)}</Text>
                    </View>
                    <View style={{ marginLeft: 10 }}>
                      <Text style={styles.itemName}>{student.name}</Text>
                      <Text style={{ fontSize: 11, color: '#9CA3AF' }}>{student.department}</Text>
                    </View>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Ionicons name="star" size={14} color="#F59E0B" />
                    <Text style={{ fontSize: 13, fontWeight: '700', color: '#1E3A5F', marginLeft: 4 }}>
                      {student.averageRating}
                    </Text>
                    <Text style={{ fontSize: 11, color: '#9CA3AF', marginLeft: 4 }}>({student.totalRatings})</Text>
                  </View>
                </View>
              ))}
            </View>
          )}

          <View style={{ height: 30 }} />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

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

const styles = StyleSheet.create({
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f8fafc' },
  overlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.4)', zIndex: 99 },
  sidebar: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: SIDEBAR_WIDTH,
    backgroundColor: COLORS.white,
    zIndex: 100,
    elevation: 10,
  },
  sidebarProfileSection: { backgroundColor: COLORS.primary, padding: 20, paddingTop: 50 },
  closeBtn: { alignSelf: 'flex-end', marginBottom: -10 },
  avatarCircle: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
    borderWidth: 1,
    borderColor: COLORS.white,
  },
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
  subTitleText: { fontSize: 14, color: COLORS.textGray, marginLeft: 45, marginTop: -5, marginBottom: 15 },
  body: { paddingHorizontal: 20 },
  statsGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  statBox: { backgroundColor: COLORS.white, width: '48%', padding: 15, borderRadius: 15, elevation: 2 },
  iconCircle: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  statValue: { fontSize: 24, fontWeight: 'bold', color: COLORS.primary },
  statLabel: { fontSize: 13, color: COLORS.textGray },
  card: { backgroundColor: COLORS.white, borderRadius: 15, padding: 15, marginBottom: 15, elevation: 2 },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: COLORS.primary, marginBottom: 15 },
  statusRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  statusName: { width: 70, fontSize: 13, fontWeight: '600' },
  progressBg: { flex: 1, height: 8, backgroundColor: '#eee', borderRadius: 4, marginHorizontal: 10 },
  progressFill: { height: 8, borderRadius: 4 },
  statusVal: { fontSize: 13, fontWeight: 'bold', width: 40, textAlign: 'right' },
  listItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f8fafc',
  },
  itemName: { fontSize: 14, fontWeight: '600', color: '#333' },
  smallAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: COLORS.primary,
    justifyContent: 'center',
    alignItems: 'center',
  },
  smallAvatarText: { color: '#fff', fontSize: 13, fontWeight: '700' },
  badge: { backgroundColor: '#f1f5f9', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 6 },
  badgeText: { fontSize: 12, fontWeight: 'bold', color: COLORS.primary },
});

export default AdminDashboard;