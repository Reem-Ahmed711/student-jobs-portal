// MOBILE-APP/frontEnd/app/StudentDashboard.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAvailableJobs, getStudentApplications, getUserRating } from '../src/api';

type TabKey = 'home' | 'jobs' | 'applications' | 'profile' | 'more';

interface Job {
  id: string;
  title: string;
  department: string;
  type?: string;
  salary?: string;
  status?: string;
}

interface Application {
  id: string;
  jobId: string;
  status: string;
  appliedAt?: any;
}

const statusConfig: Record<string, { color: string; bg: string }> = {
  pending: { color: '#D97706', bg: '#FEF3C7' },
  under_review: { color: '#7C3AED', bg: '#EDE9FE' },
  accepted: { color: '#16A34A', bg: '#DCFCE7' },
  rejected: { color: '#DC2626', bg: '#FEE2E2' },
  shortlisted: { color: '#16A34A', bg: '#DCFCE7' },
  'Under Review': { color: '#7C3AED', bg: '#EDE9FE' },
  Shortlisted: { color: '#16A34A', bg: '#DCFCE7' },
  Rejected: { color: '#DC2626', bg: '#FEE2E2' },
  Accepted: { color: '#2563EB', bg: '#DBEAFE' },
};

const BottomTabBar: React.FC<{ active: TabKey; onPress: (k: TabKey) => void }> = ({ active, onPress }) => {
  const tabs: { key: TabKey; label: string }[] = [
    { key: 'home', label: 'Home' },
    { key: 'jobs', label: 'Jobs' },
    { key: 'applications', label: 'Apps' },
    { key: 'profile', label: 'Profile' },
    { key: 'more', label: 'More' },
  ];

  const getIcon = (key: TabKey, isActive: boolean) => {
    const color = isActive ? '#1E3A5F' : '#9CA3AF';
    switch (key) {
      case 'home': return <Ionicons name={isActive ? 'home' : 'home-outline'} size={23} color={color} />;
      case 'jobs': return <MaterialCommunityIcons name="briefcase-outline" size={23} color={color} />;
      case 'applications': return <Ionicons name={isActive ? 'document-text' : 'document-text-outline'} size={23} color={color} />;
      case 'profile': return <Ionicons name={isActive ? 'person' : 'person-outline'} size={23} color={color} />;
      case 'more': return <Feather name="more-horizontal" size={23} color={color} />;
    }
  };

  return (
    <View style={styles.tabBar}>
      {tabs.map((tab) => (
        <TouchableOpacity key={tab.key} style={styles.tabItem} onPress={() => onPress(tab.key)}>
          {getIcon(tab.key, active === tab.key)}
          <Text style={[styles.tabLabel, active === tab.key && styles.tabLabelActive]}>
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const StudentDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('home');
  const router = useRouter();
  const params = useLocalSearchParams();
  const [loading, setLoading] = useState(true);

  const [user, setUser] = useState({
    uid: '',
    name: 'Student',
    department: 'Department',
    gpa: '-',
    year: '-',
    email: '',
    photo: null as string | null,
  });

  const [jobs, setJobs] = useState<Job[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [rating, setRating] = useState<any>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      const stored = await AsyncStorage.getItem('userData');
      if (stored) {
        const parsed = JSON.parse(stored);
        setUser({
          uid: parsed.uid || '',
          name: parsed.name || parsed.username || 'Student',
          department: parsed.department || 'Department',
          gpa: parsed.gpa || '-',
          year: parsed.year || '-',
          email: parsed.email || '',
          photo: parsed.photo || null,
        });

        // Load rating
        if (parsed.uid) {
          const ratingRes = await getUserRating(parsed.uid);
          if (ratingRes.success && ratingRes.data) {
            setRating(ratingRes.data);
          }
        }
      }

      // Load jobs and applications in parallel
      const [jobsRes, appsRes] = await Promise.all([
        getAvailableJobs(),
        getStudentApplications(),
      ]);

      if (jobsRes.success) {
        const allJobs = Array.isArray(jobsRes.data) ? jobsRes.data : jobsRes.data?.data || [];
        setJobs(allJobs.slice(0, 3)); // Show only 3 recommended
      }

      if (appsRes.success) {
        const allApps = Array.isArray(appsRes.data) ? appsRes.data : [];
        setApplications(allApps.slice(0, 3)); // Show only 3 recent
      }
    } catch (err) {
      console.log('Failed to load data:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleTabPress = (key: TabKey) => {
    setActiveTab(key);
    const userData = { name: user.name, email: user.email, department: user.department, gpa: user.gpa, year: user.year };
    const pathMap: Record<string, string> = {
      profile: '/ProfileScreen',
      jobs: '/JobsScreen',
      applications: '/ApplicationsScreen',
      more: '/MoreScreen',
    };
    if (pathMap[key]) {
      router.replace({ pathname: pathMap[key] as any, params: userData as any });
    }
  };

  if (loading) {
    return (
      <View style={[styles.safe, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#1E3A5F" />
      </View>
    );
  }

  const firstName = user.name.split(' ')[0];
  const initial = firstName.charAt(0).toUpperCase();

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#1E3A5F" />

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false} bounces={true}>
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good Morning,</Text>
            <Text style={styles.headerName}>{firstName}</Text>
          </View>
          <TouchableOpacity
            style={styles.bellWrap}
            onPress={() => router.push({ pathname: '/notifications', params: { name: user.name } as any })}
          >
            <Ionicons name="notifications-outline" size={26} color="#fff" />
          </TouchableOpacity>
        </View>

        <View style={styles.content}>
          {/* Profile Card */}
          <TouchableOpacity style={styles.profileCard} onPress={() => handleTabPress('profile')}>
            <View style={styles.avatarPlaceholder}>
              <Text style={styles.avatarInitial}>{initial}</Text>
            </View>
            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{user.name}</Text>
              <Text style={styles.profileDept}>{user.department}</Text>
              <View style={styles.profileMeta}>
                <Text style={styles.profileMetaText}>{user.year}</Text>
                <Text style={styles.profileMetaDot}> • </Text>
                <Text style={styles.profileMetaText}>GPA: {user.gpa}</Text>
                {rating && (
                  <>
                    <Text style={styles.profileMetaDot}> • </Text>
                    <Ionicons name="star" size={12} color="#F59E0B" />
                    <Text style={[styles.profileMetaText, { color: '#D97706' }]}>{rating.average || 0}</Text>
                  </>
                )}
              </View>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
          </TouchableOpacity>

          {/* Stats Row */}
          <View style={styles.statsRow}>
            <TouchableOpacity style={styles.statCard} onPress={() => handleTabPress('applications')}>
              <View style={[styles.statIconWrap, { backgroundColor: '#EFF6FF' }]}>
                <Ionicons name="document-text-outline" size={22} color="#2563EB" />
              </View>
              <Text style={styles.statNumber}>{applications.length}</Text>
              <Text style={styles.statLabel}>Applied</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.statCard} onPress={() => handleTabPress('jobs')}>
              <View style={[styles.statIconWrap, { backgroundColor: '#F0FDF4' }]}>
                <MaterialCommunityIcons name="briefcase-outline" size={22} color="#16A34A" />
              </View>
              <Text style={styles.statNumber}>{jobs.length > 3 ? '3+' : jobs.length}</Text>
              <Text style={styles.statLabel}>New Jobs</Text>
            </TouchableOpacity>
          </View>

          {/* Recent Jobs */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recommended for You</Text>
              <TouchableOpacity onPress={() => handleTabPress('jobs')}>
                <Text style={styles.seeAll}>See All</Text>
              </TouchableOpacity>
            </View>
            {jobs.length > 0 ? (
              jobs.map((job) => (
                <TouchableOpacity
                  key={job.id}
                  style={styles.card}
                  onPress={() => {
                    // Could navigate to job detail
                  }}
                  activeOpacity={0.85}
                >
                  <View style={styles.cardHeader}>
                    <Text style={styles.cardTitle} numberOfLines={2}>{job.title}</Text>
                    <View style={[styles.matchBadge, { backgroundColor: '#DBEAFE' }]}>
                      <Text style={[styles.matchText, { color: '#1E3A5F' }]}>NEW</Text>
                    </View>
                  </View>
                  <Text style={styles.cardDept}>{job.department}</Text>
                  <View style={styles.cardMeta}>
                    <Feather name="trending-up" size={12} color="#9CA3AF" />
                    <Text style={styles.metaText}> {job.salary || 'Competitive Salary'}</Text>
                  </View>
                </TouchableOpacity>
              ))
            ) : (
              <Text style={styles.emptyText}>No jobs available yet</Text>
            )}
          </View>

          {/* Recent Applications */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Applications</Text>
              <TouchableOpacity onPress={() => handleTabPress('applications')}>
                <Text style={styles.seeAll}>View All</Text>
              </TouchableOpacity>
            </View>
            {applications.length > 0 ? (
              applications.map((app) => {
                const cfg = statusConfig[app.status] || statusConfig.pending;
                return (
                  <View key={app.id} style={styles.card}>
                    <View style={styles.cardHeader}>
                      <Text style={styles.cardTitle}>Application #{app.id.slice(0, 8)}</Text>
                      <View style={[styles.statusBadge, { backgroundColor: cfg.bg }]}>
                        <Text style={[styles.statusText, { color: cfg.color }]}>{app.status}</Text>
                      </View>
                    </View>
                    <Text style={styles.cardDept}>Job ID: {app.jobId.slice(0, 8)}...</Text>
                    {app.appliedAt && (
                      <Text style={styles.appliedDate}>
                        Applied: {app.appliedAt?.toDate?.()?.toLocaleDateString() || new Date(app.appliedAt).toLocaleDateString()}
                      </Text>
                    )}
                  </View>
                );
              })
            ) : (
              <Text style={styles.emptyText}>No applications yet</Text>
            )}
          </View>

          <View style={{ height: 24 }} />
        </View>
      </ScrollView>

      <BottomTabBar active={activeTab} onPress={handleTabPress} />
    </SafeAreaView>
  );
};

export default StudentDashboard;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#1E3A5F' },
  scroll: { flex: 1 },
  header: {
    backgroundColor: '#1E3A5F',
    paddingHorizontal: 22,
    paddingTop: 22,
    paddingBottom: 50,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  greeting: { color: 'rgba(255,255,255,0.85)', fontSize: 14 },
  headerName: { color: '#fff', fontSize: 30, fontWeight: '800', marginTop: 2 },
  bellWrap: { position: 'relative', marginTop: 2 },
  content: { backgroundColor: '#F1F5F9', paddingHorizontal: 16, paddingTop: 0 },
  profileCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: -36,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.10,
    shadowRadius: 16,
    shadowOffset: { width: 0, height: 4 },
    elevation: 6,
  },
  avatarPlaceholder: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#2A4A7A',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
    borderWidth: 2,
    borderColor: '#E5E7EB',
  },
  avatarInitial: { fontSize: 26, fontWeight: '800', color: '#1E3A5F' },
  profileInfo: { flex: 1 },
  profileName: { fontSize: 16, fontWeight: '700', color: '#111827' },
  profileDept: { fontSize: 13, color: '#6B7280', marginTop: 3 },
  profileMeta: { flexDirection: 'row', alignItems: 'center', marginTop: 5 },
  profileMetaText: { fontSize: 12, color: '#9CA3AF' },
  profileMetaDot: { fontSize: 12, color: '#9CA3AF' },
  statsRow: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  statIconWrap: { width: 42, height: 42, borderRadius: 11, justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  statNumber: { fontSize: 28, fontWeight: '800', color: '#111827' },
  statLabel: { fontSize: 13, color: '#6B7280', marginTop: 2 },
  section: { marginBottom: 20 },
  sectionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: '#111827' },
  seeAll: { fontSize: 13, color: '#1E3A5F', fontWeight: '600' },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
    elevation: 2,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  cardTitle: { fontSize: 15, fontWeight: '700', color: '#111827', flex: 1, marginRight: 8 },
  cardDept: { fontSize: 13, color: '#6B7280', marginTop: 4 },
  cardMeta: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  metaText: { fontSize: 12, color: '#9CA3AF' },
  matchBadge: { borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
  matchText: { fontSize: 12, fontWeight: '700' },
  statusBadge: { borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
  statusText: { fontSize: 12, fontWeight: '600' },
  appliedDate: { fontSize: 12, color: '#9CA3AF', marginTop: 6 },
  emptyText: { color: '#9CA3AF', textAlign: 'center', marginTop: 20, fontSize: 14 },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingBottom: 8,
    paddingTop: 10,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: -2 },
    elevation: 8,
  },
  tabItem: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  tabLabel: { fontSize: 10, color: '#9CA3AF', marginTop: 3 },
  tabLabelActive: { color: '#1E3A5F', fontWeight: '600' },
});