import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';

// ─── Types ─────────────────────────────────────────────────────────────────
type TabKey = 'home' | 'jobs' | 'applications' | 'profile' | 'more';
type AppStatus = 'Under Review' | 'Shortlisted' | 'Rejected' | 'Pending';

interface Application {
  id: string;
  title: string;
  department: string;
  appliedDate: string;
  updatedDate: string;
  status: AppStatus;
  hasInterview?: boolean;
  interviewDate?: string;
  interviewLocation?: string;
}

// ─── Data ───────────────────────────────────────────────────────────────────
const applications: Application[] = [
  {
    id: '1',
    title: 'Teaching Assistant - Physics Lab',
    department: 'Physics Department',
    appliedDate: 'Feb 28, 2026',
    updatedDate: 'Mar 2',
    status: 'Under Review',
  },
  {
    id: '2',
    title: 'Mathematics Tutor',
    department: 'Mathematics Department',
    appliedDate: 'Mar 1, 2026',
    updatedDate: 'Mar 4',
    status: 'Shortlisted',
    hasInterview: true,
    interviewDate: 'Mar 10, 2026 at 10:00 AM',
    interviewLocation: 'Mathematics Building, Room 205',
  },
  {
    id: '3',
    title: 'Research Assistant - Organic Chemistry',
    department: 'Chemistry Department',
    appliedDate: 'Feb 25, 2026',
    updatedDate: 'Feb 25',
    status: 'Pending',
  },
];

const statusConfig: Record<AppStatus, { color: string; bg: string; icon: string }> = {
  'Under Review': { color: '#7C3AED', bg: '#EDE9FE', icon: 'time-outline' },
  Shortlisted:   { color: '#16A34A', bg: '#DCFCE7', icon: 'ribbon-outline' },
  Rejected:      { color: '#DC2626', bg: '#FEE2E2', icon: 'close-circle-outline' },
  Pending:       { color: '#D97706', bg: '#FEF3C7', icon: 'ellipsis-horizontal-circle-outline' },
};

// ─── Bottom Tab Bar ─────────────────────────────────────────────────────────
const BottomTabBar: React.FC<{ active: TabKey; onPress: (k: TabKey) => void }> = ({ active, onPress }) => {
  const tabs: { key: TabKey; label: string }[] = [
    { key: 'home', label: 'Home' },
    { key: 'jobs', label: 'Jobs' },
    { key: 'applications', label: 'Applications' },
    { key: 'profile', label: 'Profile' },
    { key: 'more', label: 'More' },
  ];

  const getIcon = (key: TabKey, isActive: boolean) => {
    const color = isActive ? '#2563EB' : '#9CA3AF';
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

// ─── Interview Modal ─────────────────────────────────────────────────────────
const InterviewModal: React.FC<{
  visible: boolean;
  app: Application | null;
  onClose: () => void;
}> = ({ visible, app, onClose }) => {
  if (!app) return null;
  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Interview Details</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <View style={styles.interviewCard}>
            <View style={styles.interviewIconWrap}>
              <Ionicons name="calendar" size={32} color="#2563EB" />
            </View>
            <Text style={styles.interviewJobTitle}>{app.title}</Text>
            <Text style={styles.interviewDept}>{app.department}</Text>
          </View>

          <View style={styles.interviewInfoRow}>
            <View style={[styles.interviewInfoIcon, { backgroundColor: '#EFF6FF' }]}>
              <Ionicons name="time-outline" size={18} color="#2563EB" />
            </View>
            <View>
              <Text style={styles.interviewInfoLabel}>Date & Time</Text>
              <Text style={styles.interviewInfoValue}>{app.interviewDate}</Text>
            </View>
          </View>

          <View style={styles.interviewInfoRow}>
            <View style={[styles.interviewInfoIcon, { backgroundColor: '#F0FDF4' }]}>
              <Ionicons name="location-outline" size={18} color="#16A34A" />
            </View>
            <View>
              <Text style={styles.interviewInfoLabel}>Location</Text>
              <Text style={styles.interviewInfoValue}>{app.interviewLocation}</Text>
            </View>
          </View>

          <View style={styles.interviewTips}>
            <Text style={styles.interviewTipsTitle}>Preparation Tips</Text>
            {[
              'Review your resume and cover letter',
              'Research the department and role',
              'Arrive 10 minutes early',
              'Bring printed copies of your documents',
            ].map((tip, i) => (
              <View key={i} style={styles.tipItem}>
                <View style={styles.tipDot} />
                <Text style={styles.tipText}>{tip}</Text>
              </View>
            ))}
          </View>

          <TouchableOpacity style={styles.closeBtn} onPress={onClose} activeOpacity={0.85}>
            <Text style={styles.closeBtnText}>Got it!</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

// ─── Application Card ────────────────────────────────────────────────────────
const AppCard: React.FC<{ app: Application; onViewInterview: () => void }> = ({ app, onViewInterview }) => {
  const cfg = statusConfig[app.status];
  return (
    <View style={styles.card}>
      <View style={styles.cardTopRow}>
        <Text style={styles.cardTitle} numberOfLines={2}>{app.title}</Text>
        <View style={[styles.statusIconWrap, { backgroundColor: cfg.bg }]}>
          <Ionicons name={cfg.icon as any} size={18} color={cfg.color} />
        </View>
      </View>

      <Text style={styles.cardDept}>{app.department}</Text>

      <View style={[styles.statusBadge, { backgroundColor: cfg.bg, alignSelf: 'flex-start', marginBottom: 12 }]}>
        <Text style={[styles.statusText, { color: cfg.color }]}>{app.status}</Text>
      </View>

      <View style={styles.cardFooter}>
        <Text style={styles.dateText}>Applied: {app.appliedDate}</Text>
        <Text style={styles.dateText}>Updated: {app.updatedDate}</Text>
      </View>

      {app.hasInterview && (
        <TouchableOpacity style={styles.interviewBtn} onPress={onViewInterview} activeOpacity={0.85}>
          <Text style={styles.interviewBtnText}>View Interview Details</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

// ─── Main Screen ─────────────────────────────────────────────────────────────
const ApplicationsScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('applications');
  const [interviewApp, setInterviewApp] = useState<Application | null>(null);
  const [interviewVisible, setInterviewVisible] = useState(false);

  const router = useRouter();
  const params = useLocalSearchParams();

  const userData = {
    name: (params.name as string) || 'Student',
    department: (params.department as string) || 'Department',
    gpa: (params.gpa as string) || '-',
    year: (params.year as string) || '-',
    email: (params.email as string) || '',
  };

  const total = applications.length;
  const pending = applications.filter((a) => a.status === 'Pending' || a.status === 'Under Review').length;
  const shortlisted = applications.filter((a) => a.status === 'Shortlisted').length;

  const handleTabPress = (key: TabKey) => {
    setActiveTab(key);
    switch (key) {
      case 'home':
        router.replace({ pathname: '/StudentDashboard', params: userData });
        break;
      case 'jobs':
        router.replace({ pathname: '/JobsScreen', params: userData });
        break;
      case 'profile':
        router.replace({ pathname: '/ProfileScreen', params: userData });
        break;
      case 'more':
        router.replace({ pathname: '/MoreScreen', params: userData });
        break;
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#2563EB" />

      {/* Header */}
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
            <Text style={styles.statNumber}>{shortlisted}</Text>
            <Text style={styles.statLabel}>Shortlisted</Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {applications.map((app) => (
            <AppCard
              key={app.id}
              app={app}
              onViewInterview={() => {
                setInterviewApp(app);
                setInterviewVisible(true);
              }}
            />
          ))}
          <View style={{ height: 16 }} />
        </View>
      </ScrollView>

      <InterviewModal
        visible={interviewVisible}
        app={interviewApp}
        onClose={() => setInterviewVisible(false)}
      />

      <BottomTabBar active={activeTab} onPress={handleTabPress} />
    </SafeAreaView>
  );
};

export default ApplicationsScreen;

// ─── Styles ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F1F5F9' },
  scroll: { flex: 1 },

  header: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 22,
    paddingTop: 22,
    paddingBottom: 28,
  },
  headerTitle: { color: '#fff', fontSize: 28, fontWeight: '800', marginBottom: 20 },

  statsRow: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 16,
    padding: 16,
  },
  statItem: { flex: 1, alignItems: 'center' },
  statNumber: { color: '#fff', fontSize: 24, fontWeight: '800' },
  statLabel: { color: 'rgba(255,255,255,0.8)', fontSize: 12, marginTop: 2 },
  statDivider: { width: 1, backgroundColor: 'rgba(255,255,255,0.3)', marginVertical: 4 },

  content: { padding: 16, paddingTop: 20 },

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
    width: 34, height: 34, borderRadius: 10,
    justifyContent: 'center', alignItems: 'center',
  },
  cardDept: { fontSize: 13, color: '#6B7280', marginBottom: 10 },
  statusBadge: { borderRadius: 20, paddingHorizontal: 12, paddingVertical: 5 },
  statusText: { fontSize: 12, fontWeight: '600' },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between' },
  dateText: { fontSize: 12, color: '#9CA3AF' },

  interviewBtn: {
    backgroundColor: '#2563EB',
    borderRadius: 12,
    height: 46,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  interviewBtnText: { color: '#fff', fontSize: 14, fontWeight: '700' },

  // Tab Bar
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
  tabLabelActive: { color: '#2563EB', fontWeight: '600' },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: { fontSize: 18, fontWeight: '800', color: '#111827' },

  interviewCard: {
    backgroundColor: '#EFF6FF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 20,
  },
  interviewIconWrap: {
    width: 60, height: 60, borderRadius: 30,
    backgroundColor: '#DBEAFE',
    justifyContent: 'center', alignItems: 'center',
    marginBottom: 12,
  },
  interviewJobTitle: { fontSize: 16, fontWeight: '700', color: '#111827', textAlign: 'center' },
  interviewDept: { fontSize: 13, color: '#6B7280', marginTop: 4, textAlign: 'center' },

  interviewInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
    marginBottom: 16,
  },
  interviewInfoIcon: {
    width: 42, height: 42, borderRadius: 12,
    justifyContent: 'center', alignItems: 'center',
  },
  interviewInfoLabel: { fontSize: 11, color: '#9CA3AF', fontWeight: '600', marginBottom: 2 },
  interviewInfoValue: { fontSize: 14, fontWeight: '600', color: '#111827' },

  interviewTips: {
    backgroundColor: '#F8FAFF',
    borderRadius: 14,
    padding: 16,
    marginBottom: 20,
  },
  interviewTipsTitle: { fontSize: 14, fontWeight: '700', color: '#111827', marginBottom: 10 },
  tipItem: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 8 },
  tipDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: '#2563EB' },
  tipText: { fontSize: 13, color: '#374151' },

  closeBtn: {
    backgroundColor: '#2563EB',
    borderRadius: 14,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
  },
  closeBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
