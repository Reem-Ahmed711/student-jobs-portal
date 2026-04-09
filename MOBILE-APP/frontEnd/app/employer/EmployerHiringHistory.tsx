import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';

// ─── Types ────────────────────────────────────────────────────────────────────
interface Hire {
  id: number; name: string; position: string; hiredDate: string;
  department: string; matchScore: number; timeToHire: number; status: string;
}

type TimeRange = '30days' | '90days' | 'year' | 'all';

// ─── Constants ────────────────────────────────────────────────────────────────
const TIME_RANGES: { key: TimeRange; label: string }[] = [
  { key: '30days', label: 'Last 30 Days' },
  { key: '90days', label: 'Last 90 Days' },
  { key: 'year',   label: 'This Year'    },
  { key: 'all',    label: 'All Time'     },
];

const STATS = [
  { number: '8',   label: 'Total Hires',      icon: 'people-outline'       },
  { number: '124', label: 'Total Applicants',  icon: 'document-text-outline'},
  { number: '18d', label: 'Avg Time to Hire',  icon: 'time-outline'         },
  { number: '76%', label: 'Avg Match Score',   icon: 'stats-chart-outline'  },
  { number: '75%', label: 'Offer Acceptance',  icon: 'checkmark-circle-outline' },
];

const HIRES: Hire[] = [
  {
    id: 1, name: 'Fatma Ahmed',
    position: 'Teaching Assistant - Physics',
    hiredDate: 'Feb 15, 2026', department: 'Physics',
    matchScore: 92, timeToHire: 14, status: 'Active',
  },
  {
    id: 2, name: 'Mohamed Ali',
    position: 'Research Assistant - Chemistry',
    hiredDate: 'Feb 10, 2026', department: 'Chemistry',
    matchScore: 88, timeToHire: 21, status: 'Active',
  },
  {
    id: 3, name: 'Layla Hassan',
    position: 'Lab Assistant - General Physics',
    hiredDate: 'Jan 28, 2026', department: 'Physics',
    matchScore: 81, timeToHire: 12, status: 'Active',
  },
  {
    id: 4, name: 'Omar Tarek',
    position: 'Research Assistant - Quantum',
    hiredDate: 'Jan 10, 2026', department: 'Physics',
    matchScore: 78, timeToHire: 25, status: 'Completed',
  },
];

// ─── Stat Card ────────────────────────────────────────────────────────────────
const StatCard = ({ number, label, icon }: { number: string; label: string; icon: string }) => (
  <View style={styles.statCard}>
    <View style={styles.statIconBg}>
      <Ionicons name={icon as any} size={18} color="#1E3A5F" />
    </View>
    <Text style={styles.statNumber}>{number}</Text>
    <Text style={styles.statLabel}>{label}</Text>
  </View>
);

// ─── Hire Row ─────────────────────────────────────────────────────────────────
const HireRow = ({ item, isLast }: { item: Hire; isLast: boolean }) => (
  <View style={[styles.hireRow, isLast && { borderBottomWidth: 0 }]}>
    {/* Avatar + Name */}
    <View style={styles.hireNameCell}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>{item.name[0]}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={styles.hireName}>{item.name}</Text>
        <Text style={styles.hireDept}>{item.department}</Text>
      </View>
    </View>

    {/* Position */}
    <Text style={styles.hirePosition} numberOfLines={2}>{item.position}</Text>

    {/* Meta Row */}
    <View style={styles.hireMetaRow}>
      <View style={styles.metaItem}>
        <Ionicons name="calendar-outline" size={12} color="#94a3b8" />
        <Text style={styles.metaText}>{item.hiredDate}</Text>
      </View>
      <View style={styles.metaItem}>
        <Ionicons name="time-outline" size={12} color="#94a3b8" />
        <Text style={styles.metaText}>{item.timeToHire} days</Text>
      </View>
    </View>

    {/* Badges */}
    <View style={styles.hireBadgesRow}>
      <View style={styles.matchBadge}>
        <Text style={styles.matchBadgeText}>{item.matchScore}%</Text>
      </View>
      <View style={[
        styles.statusBadge,
        { backgroundColor: item.status === 'Active' ? '#d4edda' : '#e2e3e5' },
      ]}>
        <Text style={[
          styles.statusText,
          { color: item.status === 'Active' ? '#155724' : '#383d41' },
        ]}>
          {item.status}
        </Text>
      </View>
    </View>
  </View>
);

// ─── Main Component ───────────────────────────────────────────────────────────
const EmployerHiringHistory = () => {
  const router = useRouter();
  const [timeRange, setTimeRange] = useState<TimeRange>('30days');

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color="#1E3A5F" />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>Hiring History</Text>
        <View style={{ width: 36 }} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Page Header */}
        <View style={styles.pageHeader}>
          <Text style={styles.pageTitle}>Hiring History</Text>
          <Text style={styles.pageSubtitle}>Track your hiring performance and analytics</Text>
        </View>

        {/* Time Range Filter */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.filterScroll}
          contentContainerStyle={styles.filterContent}
        >
          {TIME_RANGES.map((r) => {
            const active = timeRange === r.key;
            return (
              <TouchableOpacity
                key={r.key}
                style={[styles.filterTab, active && styles.filterTabActive]}
                onPress={() => setTimeRange(r.key)}
              >
                <Text style={[styles.filterTabText, active && styles.filterTabTextActive]}>
                  {r.label}
                </Text>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Stats Grid */}
        <View style={styles.statsGrid}>
          {STATS.map((s, i) => (
            <StatCard key={i} number={s.number} label={s.label} icon={s.icon} />
          ))}
        </View>

        {/* Performance Summary Bar */}
        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>Hiring Funnel</Text>
          <View style={styles.funnelRow}>
            <Text style={styles.funnelLabel}>Applications</Text>
            <View style={styles.funnelTrack}>
              <View style={[styles.funnelFill, { width: '100%', backgroundColor: '#CBD5E1' }]} />
            </View>
            <Text style={styles.funnelNum}>124</Text>
          </View>
          <View style={styles.funnelRow}>
            <Text style={styles.funnelLabel}>Shortlisted</Text>
            <View style={styles.funnelTrack}>
              <View style={[styles.funnelFill, { width: '40%', backgroundColor: '#93C5FD' }]} />
            </View>
            <Text style={styles.funnelNum}>48</Text>
          </View>
          <View style={styles.funnelRow}>
            <Text style={styles.funnelLabel}>Interviewed</Text>
            <View style={styles.funnelTrack}>
              <View style={[styles.funnelFill, { width: '20%', backgroundColor: '#60A5FA' }]} />
            </View>
            <Text style={styles.funnelNum}>24</Text>
          </View>
          <View style={styles.funnelRow}>
            <Text style={styles.funnelLabel}>Hired</Text>
            <View style={styles.funnelTrack}>
              <View style={[styles.funnelFill, { width: '7%', backgroundColor: '#1E3A5F' }]} />
            </View>
            <Text style={styles.funnelNum}>8</Text>
          </View>
        </View>

        {/* Recent Hires */}
        <Text style={styles.sectionTitle}>Recent Hires</Text>
        <View style={styles.hiresCard}>
          {/* Table Header */}
          <View style={styles.tableHeader}>
            <Text style={styles.tableHeaderText}>Candidate</Text>
            <Text style={[styles.tableHeaderText, { textAlign: 'right' }]}>Score / Status</Text>
          </View>

          {HIRES.map((hire, i) => (
            <HireRow key={hire.id} item={hire} isLast={i === HIRES.length - 1} />
          ))}
        </View>

        {/* Export Button */}
        <TouchableOpacity style={styles.exportBtn}>
          <Ionicons name="download-outline" size={18} color="#1E3A5F" />
          <Text style={styles.exportBtnText}>Export Report</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f8fafc' },

  // Top Bar
  topBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingVertical: 14, backgroundColor: '#fff',
    borderBottomWidth: 1, borderBottomColor: '#f1f5f9',
    elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06,
  },
  backBtn: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: '#EBF0F9', justifyContent: 'center', alignItems: 'center',
  },
  topBarTitle: { fontSize: 17, fontWeight: '700', color: '#1E3A5F' },

  scroll: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 40 },

  // Page Header
  pageHeader: { marginBottom: 20 },
  pageTitle: { fontSize: 22, fontWeight: '700', color: '#1E3A5F' },
  pageSubtitle: { fontSize: 13, color: '#94a3b8', marginTop: 4 },

  // Time Range
  filterScroll: { flexGrow: 0, marginBottom: 20 },
  filterContent: { gap: 10 },
  filterTab: {
    paddingHorizontal: 16, paddingVertical: 9,
    borderRadius: 20, borderWidth: 1.5, borderColor: '#E2E8F0', backgroundColor: '#fff',
  },
  filterTabActive: { backgroundColor: '#1E3A5F', borderColor: '#1E3A5F' },
  filterTabText: { fontSize: 13, fontWeight: '600', color: '#64748b' },
  filterTabTextActive: { color: '#fff' },

  // Stats Grid — 3 cols then 2
  statsGrid: {
    flexDirection: 'row', flexWrap: 'wrap',
    gap: 12, marginBottom: 20,
  },
  statCard: {
    width: '30.5%', backgroundColor: '#fff', padding: 14,
    borderRadius: 14, alignItems: 'flex-start',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 6, elevation: 3,
  },
  statIconBg: {
    width: 34, height: 34, borderRadius: 10, backgroundColor: '#EBF0F9',
    justifyContent: 'center', alignItems: 'center', marginBottom: 8,
  },
  statNumber: { fontSize: 20, fontWeight: '800', color: '#1E3A5F' },
  statLabel: { fontSize: 11, color: '#94a3b8', marginTop: 2 },

  // Funnel Summary
  summaryCard: {
    backgroundColor: '#fff', borderRadius: 14, padding: 16, marginBottom: 20,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 6, elevation: 3,
  },
  summaryTitle: { fontSize: 15, fontWeight: '700', color: '#1E3A5F', marginBottom: 14 },
  funnelRow: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 10 },
  funnelLabel: { fontSize: 12, color: '#64748b', fontWeight: '500', width: 75 },
  funnelTrack: {
    flex: 1, height: 8, backgroundColor: '#f1f5f9',
    borderRadius: 4, overflow: 'hidden',
  },
  funnelFill: { height: '100%', borderRadius: 4 },
  funnelNum: { fontSize: 12, fontWeight: '700', color: '#1E3A5F', width: 30, textAlign: 'right' },

  // Section Title
  sectionTitle: { fontSize: 17, fontWeight: '700', color: '#1E3A5F', marginBottom: 12 },

  // Hires List
  hiresCard: {
    backgroundColor: '#fff', borderRadius: 14, overflow: 'hidden',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 6, elevation: 3,
    marginBottom: 20,
  },
  tableHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    backgroundColor: '#f8fafc', paddingHorizontal: 16, paddingVertical: 12,
    borderBottomWidth: 1.5, borderBottomColor: '#E2E8F0',
  },
  tableHeaderText: { fontSize: 12, fontWeight: '700', color: '#1E3A5F', textTransform: 'uppercase', letterSpacing: 0.5 },

  // Hire Row
  hireRow: {
    padding: 16,
    borderBottomWidth: 1, borderBottomColor: '#f1f5f9',
  },
  hireNameCell: { flexDirection: 'row', alignItems: 'center', gap: 10, marginBottom: 6 },
  avatar: {
    width: 36, height: 36, borderRadius: 18, backgroundColor: '#EBF0F9',
    justifyContent: 'center', alignItems: 'center',
  },
  avatarText: { fontSize: 15, fontWeight: '800', color: '#1E3A5F' },
  hireName: { fontSize: 14, fontWeight: '700', color: '#1e293b' },
  hireDept: { fontSize: 11, color: '#94a3b8' },
  hirePosition: { fontSize: 13, color: '#64748b', marginBottom: 8, lineHeight: 18 },
  hireMetaRow: { flexDirection: 'row', gap: 16, marginBottom: 10 },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  metaText: { fontSize: 11, color: '#94a3b8' },
  hireBadgesRow: { flexDirection: 'row', gap: 8 },
  matchBadge: {
    backgroundColor: '#EBF0F9', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10,
  },
  matchBadgeText: { fontSize: 12, fontWeight: '700', color: '#1E3A5F' },
  statusBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  statusText: { fontSize: 12, fontWeight: '700' },

  // Export Button
  exportBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, paddingVertical: 14, borderRadius: 12,
    borderWidth: 1.5, borderColor: '#1E3A5F', backgroundColor: '#fff',
  },
  exportBtnText: { fontSize: 14, fontWeight: '700', color: '#1E3A5F' },
});

export default EmployerHiringHistory;
