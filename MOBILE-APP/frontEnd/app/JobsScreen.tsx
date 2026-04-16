import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  TextInput,
  Modal,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAvailableJobs, applyToJob } from '../src/api';

type TabKey = 'home' | 'jobs' | 'applications' | 'profile' | 'more';

interface Job {
  id: string;
  title: string;
  department: string;
  type?: string;
  salary?: string;
  status?: string;
  description?: string;
  requirements?: string;
  employerUid?: string;
}

const departments = [
  'All',
  'Computer Science',
  'Physics',
  'Chemistry',
  'Mathematics',
  'Biology',
  'Geology',
  'Administration',
];

// ─── Bottom Tab Bar ─────────────────────────────────────────────────────────
const BottomTabBar = ({
  active,
  onPress,
}: {
  active: TabKey;
  onPress: (k: TabKey) => void;
}) => {
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
      case 'home':
        return (
          <Ionicons
            name={isActive ? 'home' : 'home-outline'}
            size={23}
            color={color}
          />
        );
      case 'jobs':
        return (
          <MaterialCommunityIcons
            name="briefcase-outline"
            size={23}
            color={color}
          />
        );
      case 'applications':
        return (
          <Ionicons
            name={isActive ? 'document-text' : 'document-text-outline'}
            size={23}
            color={color}
          />
        );
      case 'profile':
        return (
          <Ionicons
            name={isActive ? 'person' : 'person-outline'}
            size={23}
            color={color}
          />
        );
      case 'more':
        return (
          <Feather name="more-horizontal" size={23} color={color} />
        );
    }
  };

  return (
    <View style={styles.tabBar}>
      {tabs.map((tab) => (
        <TouchableOpacity
          key={tab.key}
          style={styles.tabItem}
          onPress={() => onPress(tab.key)}
        >
          {getIcon(tab.key, active === tab.key)}
          <Text
            style={[
              styles.tabLabel,
              active === tab.key && styles.tabLabelActive,
            ]}
          >
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

// ─── Main JobsScreen ───────────────────────────────────────────────────────
const JobsScreen = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('jobs');
  const [search, setSearch] = useState('');
  const [allJobs, setAllJobs] = useState<Job[]>([]);
  const [filterVisible, setFilterVisible] = useState(false);
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [detailVisible, setDetailVisible] = useState(false);
  const [applying, setApplying] = useState(false);

  const router = useRouter();
  const params = useLocalSearchParams();

  const userData = {
    name: (params.name as string) || 'Student',
    department: (params.department as string) || 'Department',
    gpa: (params.gpa as string) || '-',
    year: (params.year as string) || '-',
    email: (params.email as string) || '',
  };

  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const res = await getAvailableJobs();
        setAllJobs(res.data || res || []);
      } catch (err) {
        console.error("Failed to fetch jobs", err);
        setAllJobs([]); // إظهار قائمة فاضية بدل الأحمر الأحمر
      }
    };
    fetchJobs();
  }, []);

  const filtered = allJobs.filter((j) => {
    const matchesSearch =
      j.title.toLowerCase().includes(search.toLowerCase()) ||
      j.department?.toLowerCase().includes(search.toLowerCase());
    const matchesDept =
      selectedDept === 'All' ||
      j.department?.toLowerCase().includes(selectedDept.toLowerCase());
    return matchesSearch && matchesDept;
  });

  const handleApply = async () => {
    if (!selectedJob) return;
    setApplying(true);
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) return Alert.alert('Error', 'Please login first');

      await applyToJob(selectedJob.id);
      Alert.alert('Success 🎉', 'Applied Successfully!');
      setDetailVisible(false);
    } catch (err: any) {
      Alert.alert('Error', err.response?.data?.message || 'Failed to apply');
    } finally {
      setApplying(false);
    }
  };

  const handleTabPress = (key: TabKey) => {
    setActiveTab(key);
    const pathMap: Record<string, string> = {
      home: '/StudentDashboard',
      applications: '/ApplicationsScreen',
      profile: '/ProfileScreen',
      more: '/MoreScreen',
    };
    if (pathMap[key]) {
      router.replace({
        pathname: pathMap[key] as any,
        params: userData as any,
      });
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* ── Header ── */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Job Opportunities</Text>
        <View style={styles.searchRow}>
          <View style={styles.searchBox}>
            <Ionicons
              name="search-outline"
              size={18}
              color="#9CA3AF"
            />
            <TextInput
              style={styles.searchInput}
              placeholder="Search jobs or departments..."
              placeholderTextColor="#9CA3AF"
              value={search}
              onChangeText={setSearch}
            />
            {search.length > 0 && (
              <TouchableOpacity onPress={() => setSearch('')}>
                <Ionicons
                  name="close-circle"
                  size={18}
                  color="#9CA3AF"
                />
              </TouchableOpacity>
            )}
          </View>
        </View>
        <TouchableOpacity
          style={styles.filterBtn}
          onPress={() => setFilterVisible(true)}
        >
          <Ionicons name="options-outline" size={16} color="#1E3A5F" />
          <Text style={styles.filterBtnText}>
            {selectedDept === 'All' ? 'Filters' : selectedDept}
          </Text>
          {selectedDept !== 'All' && <View style={styles.filterDot} />}
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {filtered.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons
                name="search-outline"
                size={48}
                color="#D1D5DB"
              />
              <Text style={styles.emptyTitle}>No jobs found</Text>
              <Text style={styles.emptySubtitle}>
                Try adjusting your search or filters
              </Text>
            </View>
          ) : (
            filtered.map((job) => (
              <TouchableOpacity
                key={job.id}
                style={styles.card}
                onPress={() => {
                  setSelectedJob(job);
                  setDetailVisible(true);
                }}
                activeOpacity={0.85}
              >
                {/* Top Row */}
                <View style={styles.cardTopRow}>
                  <Text style={styles.cardTitle} numberOfLines={2}>
                    {job.title}
                  </Text>
                  <View
                    style={[
                      styles.matchBadge,
                      { backgroundColor: '#DBEAFE' },
                    ]}
                  >
                    <Text
                      style={[styles.matchText, { color: '#1E3A5F' }]}
                    >
                      NEW
                    </Text>
                  </View>
                </View>

                {/* Department */}
                <Text style={styles.cardDept}>{job.department}</Text>

                {/* Salary & Meta */}
                <View style={styles.cardMeta}>
                  <Feather name="trending-up" size={12} color="#9CA3AF" />
                  <Text style={styles.metaText}>
                    {' ' + (job.salary || 'Competitive Salary')}
                  </Text>
                </View>
              </TouchableOpacity>
            ))
          )}
          <View style={{ height: 80 }} />
        </View>
      </ScrollView>

      {/* ── Filter Modal ── */}
      <Modal visible={filterVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filter by Department</Text>
              <TouchableOpacity
                onPress={() => setFilterVisible(false)}
              >
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>
            <ScrollView style={{ maxHeight: 400 }}>
              {departments.map((dept) => (
                <TouchableOpacity
                  key={dept}
                  style={styles.filterOption}
                  onPress={() => {
                    setSelectedDept(dept);
                    setFilterVisible(false);
                  }}
                >
                  <Text
                    style={[
                      styles.filterOptionText,
                      selectedDept === dept && styles.filterOptionActive,
                    ]}
                  >
                    {dept}
                  </Text>
                  {selectedDept === dept && (
                    <Ionicons
                      name="checkmark-circle"
                      size={20}
                      color="#1E3A5F"
                    />
                  )}
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        </View>
      </Modal>

      {/* ── Job Detail Modal ── */}
      <Modal visible={detailVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContainer, { maxHeight: '80%' }]}>
            <View style={styles.modalHeader}>
              <Text
                style={styles.modalTitle}
                numberOfLines={2}
              >
                {selectedJob?.title}
              </Text>
              <TouchableOpacity
                onPress={() => setDetailVisible(false)}
              >
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.detailDept}>{selectedJob?.department}</Text>

              {selectedJob?.description ? (
                <Text style={styles.detailBody}>
                  {selectedJob.description}
                </Text>
              ) : (
                <Text style={styles.detailBody}>
                  Contact the department for more details about this role.
                </Text>
              )}

              {selectedJob?.requirements ? (
                <>
                  <Text style={styles.detailSectionTitle}>
                    Requirements
                  </Text>
                  <Text style={styles.detailBody}>
                    {selectedJob.requirements}
                  </Text>
                </>
              ) : null}
            </ScrollView>

            {/* Apply Button */}
            <TouchableOpacity
              style={[styles.applyBtn, applying && { opacity: 0.6 }]}
              onPress={handleApply}
              disabled={applying}
            >
              <Text style={styles.applyBtnText}>
                {applying ? 'Applying...' : 'Apply Now'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      <BottomTabBar active={activeTab} onPress={handleTabPress} />
    </SafeAreaView>
  );
};

export default JobsScreen;

// ─── Styles ──────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F1F5F9' },
  scroll: { flex: 1 },
  header: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  headerTitle: {
    fontSize: 26,
    fontWeight: '800',
    color: '#1E3A5F',
    marginBottom: 12,
  },
  searchRow: { marginBottom: 10 },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFF',
    borderRadius: 12,
    paddingHorizontal: 12,
    height: 44,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    gap: 8,
  },
  searchInput: { flex: 1, fontSize: 14, color: '#111827' },
  filterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: 6,
    backgroundColor: '#EFF6FF',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
  },
  filterBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E3A5F',
  },
  filterDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
    marginLeft: 2,
  },
  content: { padding: 16 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    flex: 1,
    marginRight: 8,
  },
  cardDept: {
    fontSize: 14,
    color: '#6B7280',
    marginVertical: 6,
  },
  matchBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  matchText: {
    fontSize: 12,
    fontWeight: '600',
  },
  cardMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 4,
  },
  metaText: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  emptyState: {
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 60,
  },
  emptyTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#6B7280',
    marginTop: 12,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#9CA3AF',
    marginTop: 4,
  },
  tabBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    height: 64,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
  },
  tabItem: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  tabLabel: {
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 2,
  },
  tabLabelActive: {
    color: '#1E3A5F',
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    width: '90%',
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#111827',
    flex: 1,
    marginRight: 10,
  },
  filterOption: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  filterOptionText: {
    fontSize: 14,
    color: '#6B7280',
  },
  filterOptionActive: {
    color: '#1E3A5F',
    fontWeight: '600',
  },
  detailDept: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
  },
  detailBody: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
    marginBottom: 10,
  },
  detailSectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginVertical: 8,
  },
  applyBtn: {
    backgroundColor: '#1E3A5F',
    borderRadius: 14,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 12,
  },
  applyBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
});