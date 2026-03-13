import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  SafeAreaView,
  Image,
} from 'react-native';
import { Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { useLocalSearchParams , useRouter } from 'expo-router';
import { useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// ─── Types ─────────────────────────────────────────────────────────────────
interface Job {
  id: string;
  title: string;
  department: string;
  hours: string;
  deadline: string;
  match: number;
}

interface ActivityItem {
  id: string;
  title: string;
  department: string;
  appliedDate: string;
  status: 'Under Review' | 'Shortlisted' | 'Rejected' | 'Accepted';
}

type TabKey = 'home' | 'jobs' | 'applications' | 'profile' | 'more';

// ─── Data ──────────────────────────────────────────────────────────────────
const recommendedJobs: Job[] = [
  {
    id: '1',
    title: 'Research Assistant - Organic Chemistry',
    department: 'Chemistry Department',
    hours: '20 hrs/week',
    deadline: '3/15/2026',
    match: 95,
  },
  {
    id: '2',
    title: 'Teaching Assistant - Physics Lab',
    department: 'Physics Department',
    hours: '15 hrs/week',
    deadline: '3/10/2026',
    match: 88,
  },
  {
    id: '3',
    title: 'Lab Technician - Microbiology',
    department: 'Microbiology Department',
    hours: '30 hrs/week',
    deadline: '3/8/2026',
    match: 91,
  },
];

const recentActivity: ActivityItem[] = [
  {
    id: '1',
    title: 'Teaching Assistant - Physics Lab',
    department: 'Physics Department',
    appliedDate: '2/28/2026',
    status: 'Under Review',
  },
  {
    id: '2',
    title: 'Mathematics Tutor',
    department: 'Mathematics Department',
    appliedDate: '3/1/2026',
    status: 'Shortlisted',
  },
];

const statusConfig: Record<ActivityItem['status'], { color: string; bg: string }> = {
  'Under Review': { color: '#7C3AED', bg: '#EDE9FE' },
  Shortlisted:   { color: '#16A34A', bg: '#DCFCE7' },
  Rejected:      { color: '#DC2626', bg: '#FEE2E2' },
  Accepted:      { color: '#2563EB', bg: '#DBEAFE' },
};

// ─── Match Badge ───────────────────────────────────────────────────────────
const MatchBadge: React.FC<{ percent: number }> = ({ percent }) => {
  const color = percent >= 90 ? '#16A34A' : '#2563EB';
  const bg    = percent >= 90 ? '#DCFCE7' : '#DBEAFE';
  return (
    <View style={[styles.matchBadge, { backgroundColor: bg }]}>
      <Text style={[styles.matchText, { color }]}>{percent}% Match</Text>
    </View>
  );
};

// ─── Job Card ──────────────────────────────────────────────────────────────
const JobCard: React.FC<{ job: Job }> = ({ job }) => (
  <View style={styles.card}>
    <View style={styles.cardHeader}>
      <Text style={styles.cardTitle} numberOfLines={2}>{job.title}</Text>
      <MatchBadge percent={job.match} />
    </View>
    <Text style={styles.cardDept}>{job.department}</Text>
    <View style={styles.cardMeta}>
      <Feather name="clock" size={12} color="#9CA3AF" />
      <Text style={styles.metaText}> {job.hours}</Text>
      <Text style={styles.metaDot}> • </Text>
      <Text style={styles.metaText}>Deadline: {job.deadline}</Text>
    </View>
  </View>
);

// ─── Activity Card ─────────────────────────────────────────────────────────
const ActivityCard: React.FC<{ item: ActivityItem }> = ({ item }) => {
  const cfg = statusConfig[item.status];
  return (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={[styles.cardTitle, { flex: 1, marginRight: 8 }]} numberOfLines={2}>
          {item.title}
        </Text>
        <View style={[styles.statusBadge, { backgroundColor: cfg.bg }]}>
          <Text style={[styles.statusText, { color: cfg.color }]}>{item.status}</Text>
        </View>
      </View>
      <Text style={styles.cardDept}>{item.department}</Text>
      <Text style={styles.appliedDate}>Applied: {item.appliedDate}</Text>
    </View>
  );
};

// ─── Bottom Tab Bar ────────────────────────────────────────────────────────
const BottomTabBar: React.FC<{ active: TabKey; onPress: (k: TabKey) => void }> = ({ active, onPress }) => {
  const tabs: { key: TabKey; label: string }[] = [
    { key: 'home',         label: 'Home' },
    { key: 'jobs',         label: 'Jobs' },
    { key: 'applications', label: 'Applications' },
    { key: 'profile',      label: 'Profile' },
    { key: 'more',         label: 'More' },
  ];

  const getIcon = (key: TabKey, isActive: boolean) => {
    const color = isActive ? '#2563EB' : '#9CA3AF';
    switch (key) {
      case 'home':         return <Ionicons name={isActive ? 'home' : 'home-outline'} size={23} color={color} />;
      case 'jobs':         return <MaterialCommunityIcons name="briefcase-outline" size={23} color={color} />;
      case 'applications': return <Ionicons name={isActive ? 'document-text' : 'document-text-outline'} size={23} color={color} />;
      case 'profile':      return <Ionicons name={isActive ? 'person' : 'person-outline'} size={23} color={color} />;
      case 'more':         return <Feather name="more-horizontal" size={23} color={color} />;
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

// ─── Main Screen ───────────────────────────────────────────────────────────
const StudentDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('home');
  const router = useRouter();

  const { name, department, gpa, year, email } = useLocalSearchParams();

  const [user, setUser] = useState({
    name: (name as string) || "Student",
    department: (department as string) || "Department",
    gpa: (gpa as string) || "-",
    year: (year as string) || "-",
    email: (email as string) || "",
      photo: null as string | null,
  });

  useEffect(() => {
    const loadUser = async () => {
      try {
        const stored = await AsyncStorage.getItem("userData");
        if (stored) {
          const parsed = JSON.parse(stored);
          setUser(parsed);
        }
      } catch (e) {}
    };

    loadUser();
  }, []);

  const fullName = user.name;
  const dept = user.department;
  const gpaValue = user.gpa;
  const yearValue = user.year;
  const firstName = fullName.split(" ")[0];

  const handleTabPress = (key: TabKey) => {
    setActiveTab(key);
    if (key === "profile") {
      router.replace({
        pathname: "/ProfileScreen",
        params: {
          name: user.name,
          department: user.department,
          gpa: user.gpa,
          year: user.year,
          email: user.email,
        },
      });
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#2563EB" />

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false} bounces={true}>

        {/* ── Blue Header ── */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Good Morning,</Text>
            {/* ✅ اسم الـ user الحقيقي */}
            <Text style={styles.headerName}>{firstName}</Text>
          </View>
          <TouchableOpacity style={styles.bellWrap}>
            <Ionicons name="notifications-outline" size={26} color="#fff" />
            <View style={styles.bellBadge}>
              <Text style={styles.bellBadgeText}>2</Text>
            </View>
          </TouchableOpacity>
        </View>

        {/* ── Content ── */}
        <View style={styles.content}>

          {/* Profile Card */}
          <View style={styles.profileCard}>
            <View style={styles.avatarPlaceholder}>
              {/* ✅ أول حرف من اسم الـ user */}
              <Text style={styles.avatarInitial}>{firstName.charAt(0).toUpperCase()}</Text>
            </View>
            <View style={styles.profileInfo}>
              {/* ✅ الاسم الكامل */}
              <Text style={styles.profileName}>{fullName}</Text>
              {/* ✅ الـ department */}
              <Text style={styles.profileDept}>{dept}</Text>
              <View style={styles.profileMeta}>
                {/* ✅ السنة الدراسية */}
                <Text style={styles.profileMetaText}>{yearValue}</Text>
                <Text style={styles.profileMetaDot}> • </Text>
                {/* ✅ الـ GPA */}
                <Text style={styles.profileMetaText}>GPA: {gpaValue}</Text>
              </View>
            </View>
          </View>

          {/* ── Stats Row ── */}
          <View style={styles.statsRow}>
            <View style={styles.statCard}>
              <View style={[styles.statIconWrap, { backgroundColor: '#EFF6FF' }]}>
                <Ionicons name="document-text-outline" size={22} color="#2563EB" />
              </View>
              <Text style={styles.statNumber}>3</Text>
              <Text style={styles.statLabel}>Applied</Text>
            </View>
            <View style={styles.statCard}>
              <View style={[styles.statIconWrap, { backgroundColor: '#F0FDF4' }]}>
                <MaterialCommunityIcons name="briefcase-outline" size={22} color="#16A34A" />
              </View>
              <Text style={styles.statNumber}>2</Text>
              <Text style={styles.statLabel}>Saved Jobs</Text>
            </View>
          </View>

          {/* ── Recommended for You ── */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recommended for You</Text>
              <TouchableOpacity><Text style={styles.seeAll}>See All</Text></TouchableOpacity>
            </View>
            {recommendedJobs.map((job) => <JobCard key={job.id} job={job} />)}
          </View>

          {/* ── Recent Activity ── */}
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Activity</Text>
              <TouchableOpacity><Text style={styles.seeAll}>View All</Text></TouchableOpacity>
            </View>
            {recentActivity.map((item) => <ActivityCard key={item.id} item={item} />)}
          </View>

          <View style={{ height: 24 }} />
        </View>
      </ScrollView>

      <BottomTabBar active={activeTab} onPress={handleTabPress} />
    </SafeAreaView>
  );
};

export default StudentDashboard;

// ─── Styles ────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#2563EB' },
  scroll: { flex: 1 },

  // Header
  header: {
    backgroundColor: '#2563EB',
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
  bellBadge: {
    position: 'absolute', top: -5, right: -5,
    backgroundColor: '#EF4444',
    borderRadius: 10, width: 19, height: 19,
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 2, borderColor: '#2563EB',
  },
  bellBadgeText: { color: '#fff', fontSize: 10, fontWeight: '800' },

  // Content
  content: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 16,
    paddingTop: 0,
  },

  // Profile Card
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
    width: 64, height: 64, borderRadius: 32,
    backgroundColor: '#DBEAFE',
    justifyContent: 'center', alignItems: 'center',
    marginRight: 14,
    borderWidth: 2, borderColor: '#E5E7EB',
  },
  avatarInitial: { fontSize: 26, fontWeight: '800', color: '#2563EB' },
  profileInfo: { flex: 1 },
  profileName: { fontSize: 16, fontWeight: '700', color: '#111827' },
  profileDept: { fontSize: 13, color: '#6B7280', marginTop: 3 },
  profileMeta: { flexDirection: 'row', alignItems: 'center', marginTop: 5 },
  profileMetaText: { fontSize: 12, color: '#9CA3AF' },
  profileMetaDot: { fontSize: 12, color: '#9CA3AF' },

  // Stats
  statsRow: { flexDirection: 'row', gap: 12, marginBottom: 20 },
  statCard: {
    flex: 1, backgroundColor: '#fff', borderRadius: 14, padding: 16,
    shadowColor: '#000', shadowOpacity: 0.05,
    shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 2,
  },
  statIconWrap: {
    width: 42, height: 42, borderRadius: 11,
    justifyContent: 'center', alignItems: 'center',
    marginBottom: 12,
  },
  statNumber: { fontSize: 28, fontWeight: '800', color: '#111827' },
  statLabel: { fontSize: 13, color: '#6B7280', marginTop: 2 },

  // Section
  section: { marginBottom: 20 },
  sectionHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 12,
  },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: '#111827' },
  seeAll: { fontSize: 13, color: '#2563EB', fontWeight: '600' },

  // Card
  card: {
    backgroundColor: '#fff', borderRadius: 14, padding: 16, marginBottom: 10,
    shadowColor: '#000', shadowOpacity: 0.04,
    shadowRadius: 8, shadowOffset: { width: 0, height: 2 }, elevation: 2,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  cardTitle: { fontSize: 15, fontWeight: '700', color: '#111827', flex: 1, marginRight: 8 },
  cardDept: { fontSize: 13, color: '#6B7280', marginTop: 4 },
  cardMeta: { flexDirection: 'row', alignItems: 'center', marginTop: 8 },
  metaText: { fontSize: 12, color: '#9CA3AF' },
  metaDot: { fontSize: 12, color: '#D1D5DB' },

  // Badges
  matchBadge: { borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
  matchText: { fontSize: 12, fontWeight: '700' },
  statusBadge: { borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4 },
  statusText: { fontSize: 12, fontWeight: '600' },
  appliedDate: { fontSize: 12, color: '#9CA3AF', marginTop: 6 },

  // Tab Bar
  tabBar: {
    flexDirection: 'row', backgroundColor: '#fff',
    borderTopWidth: 1, borderTopColor: '#E5E7EB',
    paddingBottom: 8, paddingTop: 10,
    shadowColor: '#000', shadowOpacity: 0.06,
    shadowRadius: 8, shadowOffset: { width: 0, height: -2 }, elevation: 8,
  },
  tabItem: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  tabLabel: { fontSize: 10, color: '#9CA3AF', marginTop: 3 },
  tabLabelActive: { color: '#2563EB', fontWeight: '600' },
});
