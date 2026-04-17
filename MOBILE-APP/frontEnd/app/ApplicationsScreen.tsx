// MOBILE-APP/frontEnd/app/ApplicationsScreen.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getStudentApplications } from '../src/api';

type TabKey = 'home' | 'jobs' | 'applications' | 'profile' | 'more';

interface Application {
  id: string;
  jobId: string;
  studentUid: string;
  status: string;
  appliedAt?: any;
}

const statusConfig: Record<string, { color: string; bg: string; icon: string }> = {
  pending: { color: '#D97706', bg: '#FEF3C7', icon: 'time-outline' },
  under_review: { color: '#1E3A5F', bg: '#EDE9FE', icon: 'time-outline' },
  accepted: { color: '#16A34A', bg: '#DCFCE7', icon: 'checkmark-circle' },
  rejected: { color: '#DC2626', bg: '#FEE2E2', icon: 'close-circle-outline' },
  shortlisted: { color: '#16A34A', bg: '#DCFCE7', icon: 'ribbon-outline' },
  'Under Review': { color: '#1E3A5F', bg: '#EDE9FE', icon: 'time-outline' },
  Shortlisted: { color: '#16A34A', bg: '#DCFCE7', icon: 'ribbon-outline' },
  Rejected: { color: '#DC2626', bg: '#FEE2E2', icon: 'close-circle-outline' },
  Pending: { color: '#D97706', bg: '#FEF3C7', icon: 'time-outline' },
};

const BottomTabBar: React.FC<{ active: TabKey; onPress: (k: TabKey) => void }> = ({ active, onPress }) => {
  const tabs: { key: TabKey; label: string }[] = [
    { key: 'home', label: 'Home' },
    { key: 'jobs', label: 'Jobs' },
    { key: 'applications', label: 'Applications' },
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

const ApplicationsScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('applications');
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState<string>('all');

  const router = useRouter();
  const params = useLocalSearchParams();

  const userData = {
    name: (params.name as string) || 'Student',
    department: (params.department as string) || 'Department',
    gpa: (params.gpa as string) || '-',
    year: (params.year as string) || '-',
    email: (params.email as string) || '',
  };

  const fetchApplications = async () => {
    try {
      const res = await getStudentApplications();
      if (res.success) {
        const apps = Array.isArray(res.data) ? res.data : [];
        setApplications(apps);
      }
    } catch (err) {
      console.log('Failed to fetch applications:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchApplications();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchApplications();
  };

  const filteredApps = filter === 'all' ? applications : applications.filter((a) => a.status === filter);

  const total = applications.length;
  const pending = applications.filter((a) => a.status === 'pending' || a.status === 'under_review').length;
  const accepted = applications.filter((a) => a.status === 'accepted' || a.status === 'shortlisted').length;
  const rejected = applications.filter((a) => a.status === 'rejected').length;

  const handleTabPress = (key: TabKey) => {
    setActiveTab(key);
    const pathMap: Record<string, string> = {
      home: '/StudentDashboard',
      jobs: '/JobsScreen',
      profile: '/ProfileScreen',
      more: '/MoreScreen',
    };
    if (pathMap[key]) {
      router.replace({ pathname: pathMap[key] as any, params: userData as any });
    }
  };

  const formatDate = (date: any) => {
    if (!date) return 'N/A';
    try {
      const d = date?.toDate?.() || new Date(date);
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return 'N/A';
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#1E3A5F" />

      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Applications</Text>
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{total}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{pending}</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{accepted}</Text>
            <Text style={styles.statLabel}>Accepted</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{rejected}</Text>
            <Text style={styles.statLabel}>Rejected</Text>
          </View>
        </View>
      </View>

      {/* Filter Tabs */}
      <View style={styles.filterRow}>
        {['all', 'pending', 'accepted', 'rejected'].map((f) => (
          <TouchableOpacity
            key={f}
            style={[styles.filterTab, filter === f && styles.filterTabActive]}
            onPress={() => setFilter(f)}
          >
            <Text style={[styles.filterTabText, filter === f && styles.filterTabTextActive]}>
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View style={styles.content}>
          {loading ? (
            <ActivityIndicator style={{ marginTop: 50 }} size="large" color="#1E3A5F" />
          ) : filteredApps.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="document-text-outline" size={48} color="#D1D5DB" />
              <Text style={styles.emptyTitle}>No applications found</Text>
              <Text style={styles.emptySubtitle}>
                {filter === 'all' ? "You haven't applied to any jobs yet" : `No ${filter} applications`}
              </Text>
              <TouchableOpacity
                style={styles.browseBtn}
                onPress={() => handleTabPress('jobs')}
              >
                <Text style={styles.browseBtnText}>Browse Jobs</Text>
              </TouchableOpacity>
            </View>
          ) : (
            filteredApps.map((app) => {
              const cfg = statusConfig[app.status] || statusConfig.pending;
              return (
                <View key={app.id} style={styles.card}>
                  <View style={styles.cardTopRow}>
                    <Text style={styles.cardTitle} numberOfLines={2}>
                      Application #{app.id.slice(0, 10)}...
                    </Text>
                    <View style={[styles.statusIconWrap, { backgroundColor: cfg.bg }]}>
                      <Ionicons name={cfg.icon as any} size={18} color={cfg.color} />
                    </View>
                  </View>

                  <Text style={styles.cardDept}>Job ID: {app.jobId.slice(0, 10)}...</Text>

                  <View style={[styles.statusBadge, { backgroundColor: cfg.bg, alignSelf: 'flex-start', marginBottom: 12 }]}>
                    <Text style={[styles.statusText, { color: cfg.color }]}>{app.status.toUpperCase()}</Text>
                  </View>

                  <View style={styles.cardFooter}>
                    <Text style={styles.dateText}>Applied: {formatDate(app.appliedAt)}</Text>
                  </View>
                </View>
              );
            })
          )}
          <View style={{ height: 80 }} />
        </View>
      </ScrollView>

      <BottomTabBar active={activeTab} onPress={handleTabPress} />
    </SafeAreaView>
  );
};

export default ApplicationsScreen;

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F1F5F9' },
  scroll: { flex: 1 },
  header: {
    backgroundColor: '#1E3A5F',
    paddingHorizontal: 22,
    paddingTop: 22,
    paddingBottom: 20,
  },
  headerTitle: { color: '#fff', fontSize: 28, fontWeight: '800', marginBottom: 20 },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 16,
    padding: 16,
  },
  statItem: { flex: 1, alignItems: 'center' },
  statNumber: { color: '#fff', fontSize: 22, fontWeight: '800' },
  statLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 11, marginTop: 2 },
  statDivider: { width: 1, backgroundColor: 'rgba(255,255,255,0.3)', marginVertical: 4 },
  filterRow: {
    flexDirection: 'row',
    backgroundColor: '#e5e7eb',
    borderRadius: 10,
    padding: 4,
    margin: 16,
    marginBottom: 0,
  },
  filterTab: { flex: 1, paddingVertical: 8, alignItems: 'center', borderRadius: 8 },
  filterTabActive: { backgroundColor: '#fff', elevation: 2, shadowColor: '#000', shadowOpacity: 0.08, shadowRadius: 4 },
  filterTabText: { fontSize: 12, color: '#666', fontWeight: '500' },
  filterTabTextActive: { color: '#1E3A5F', fontWeight: '700' },
  content: { padding: 16 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    shadowOffset: { width: 0, height: 3 },
    elevation: 3,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 4,
  },
  cardTitle: { fontSize: 15, fontWeight: '700', color: '#111827', flex: 1, marginRight: 8 },
  statusIconWrap: {
    width: 34,
    height: 34,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cardDept: { fontSize: 13, color: '#6B7280', marginBottom: 10 },
  statusBadge: { borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5 },
  statusText: { fontSize: 12, fontWeight: '600' },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between' },
  dateText: { fontSize: 12, color: '#9CA3AF' },
  emptyState: { alignItems: 'center', marginTop: 60 },
  emptyTitle: { fontSize: 16, fontWeight: '600', color: '#6B7280', marginTop: 12 },
  emptySubtitle: { fontSize: 14, color: '#9CA3AF', marginTop: 4 },
  browseBtn: {
    backgroundColor: '#1E3A5F',
    borderRadius: 12,
    height: 46,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 20,
    paddingHorizontal: 30,
  },
  browseBtnText: { color: '#fff', fontSize: 14, fontWeight: '700' },
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingBottom: 8,
    paddingTop: 10,
    elevation: 8,
  },
  tabItem: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  tabLabel: { fontSize: 10, color: '#9CA3AF', marginTop: 3 },
  tabLabelActive: { color: '#1E3A5F', fontWeight: '600' },
});