import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  TextInput,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';

// ─── Types ────────────────────────────────────────────────
type TabKey = 'home' | 'jobs' | 'applications' | 'profile' | 'more';

interface Job {
  id: string;
  title: string;
  department: string;
  hours: string;
  salary: string;
  applicants: number;
  deadline: string;
  match: number;
  saved: boolean;
  closingSoon?: boolean;
}

// ─── Colors ───────────────────────────────────────────────
const primaryBlue = '#1E3A5F';
const secondaryBlue = '#2A4A7A';

// ─── Combined Data ─────────────────────────────────────────
const allJobs: Job[] = [
  // وظائف مدمجة من كود الـ Web
  { id: '101', title: 'Teaching Assistant - Java Programming', department: 'Computer Science Department', hours: '10 hrs/week', salary: 'EGP 1,500/month', applicants: 15, deadline: 'May 01', match: 95, saved: false },
  { id: '102', title: 'Research Assistant - Organic Chemistry', department: 'Chemistry Department', hours: '15 hrs/week', salary: 'EGP 2,000/month', applicants: 12, deadline: 'Apr 20', match: 88, saved: false },
  { id: '103', title: 'Lab Assistant - Physics Mechanics', department: 'Physics Department', hours: '12 hrs/week', salary: 'EGP 1,800/month', applicants: 20, deadline: 'May 10', match: 82, saved: true },
  { id: '104', title: 'Mathematics Tutor - Calculus', department: 'Mathematics Department', hours: '8 hrs/week', salary: 'EGP 1,200/month', applicants: 8, deadline: 'Apr 30', match: 91, saved: false },
  { id: '105', title: 'Biology Lab Supervisor', department: 'Biology Department', hours: '20 hrs/week', salary: 'EGP 2,500/month', applicants: 5, deadline: 'May 15', match: 78, saved: false, closingSoon: true },
  { id: '106', title: 'Geology Field Assistant', department: 'Geology Department', hours: '25 hrs/week', salary: 'EGP 3,000/month', applicants: 10, deadline: 'May 05', match: 85, saved: false },
  
  // الوظائف الأصلية من كود الموبايل
  { id: '1', title: 'Advanced Research Assistant', department: 'Chemistry Department', hours: '20 hrs/week', salary: 'EGP 3,000/month', applicants: 24, deadline: 'Mar 15', match: 95, saved: false },
  { id: '2', title: 'Teaching Assistant - Physics Lab', department: 'Physics Department', hours: '15 hrs/week', salary: 'EGP 2,500/month', applicants: 31, deadline: 'Mar 10', match: 88, saved: true, closingSoon: true },
  { id: '3', title: 'Data Analysis Intern', department: 'Computer Science Department', hours: '25 hrs/week', salary: 'EGP 3,500/month', applicants: 18, deadline: 'Mar 20', match: 82, saved: false },
  { id: '6', title: 'Student Affairs Assistant', department: 'Administration', hours: '20 hrs/week', salary: 'EGP 2,200/month', applicants: 42, deadline: 'Mar 25', match: 74, saved: false },
];

const departments = ['All', 'Computer Science', 'Physics', 'Chemistry', 'Mathematics', 'Biology', 'Geology', 'Administration'];

// ─── Components (BottomTabBar, JobCard, FilterModal, JobDetailModal) ───
const BottomTabBar: React.FC<{ active: TabKey; onPress: (k: TabKey) => void }> = ({ active, onPress }) => {
  const tabs: { key: TabKey; label: string }[] = [
    { key: 'home', label: 'Home' },
    { key: 'jobs', label: 'Jobs' },
    { key: 'applications', label: 'Applications' },
    { key: 'profile', label: 'Profile' },
    { key: 'more', label: 'More' },
  ];

  const getIcon = (key: TabKey, isActive: boolean) => {
    const color = isActive ? primaryBlue : '#9CA3AF';
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
          <Text style={[styles.tabLabel, active === tab.key && styles.tabLabelActive]}>{tab.label}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const JobCard: React.FC<{ job: Job; onSaveToggle: (id: string) => void; onPress: () => void }> = ({ job, onSaveToggle, onPress }) => {
  const matchColor = job.match >= 90 ? '#16A34A' : job.match >= 80 ? primaryBlue : secondaryBlue;
  const matchBg = job.match >= 90 ? '#DCFCE7' : job.match >= 80 ? '#DBEAFE' : '#EDE9FE';

  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <View style={styles.cardTopRow}>
        <Text style={styles.cardTitle} numberOfLines={2}>{job.title}</Text>
        <TouchableOpacity onPress={() => onSaveToggle(job.id)} style={styles.saveBtn}>
          <Ionicons name={job.saved ? 'bookmark' : 'bookmark-outline'} size={20} color={job.saved ? primaryBlue : '#9CA3AF'} />
        </TouchableOpacity>
      </View>

      <Text style={styles.cardDept}>{job.department}</Text>

      <View style={styles.badgeRow}>
        <View style={[styles.matchBadge, { backgroundColor: matchBg }]}>
          <Text style={[styles.matchText, { color: matchColor }]}>{job.match}% Match</Text>
        </View>
        {job.closingSoon && (
          <View style={styles.closingBadge}>
            <Text style={styles.closingText}>Closing Soon</Text>
          </View>
        )}
      </View>

      <View style={styles.cardMeta}>
        <View style={styles.metaItem}>
          <Feather name="clock" size={12} color="#9CA3AF" />
          <Text style={styles.metaText}> {job.hours}</Text>
        </View>
        <Text style={styles.metaDot}>•</Text>
        <View style={styles.metaItem}>
          <Feather name="trending-up" size={12} color="#9CA3AF" />
          <Text style={styles.metaText}> {job.salary}</Text>
        </View>
      </View>

      <View style={styles.cardFooter}>
        <View style={styles.metaItem}>
          <Ionicons name="people-outline" size={13} color="#9CA3AF" />
          <Text style={styles.metaText}> {job.applicants} applicants</Text>
        </View>
        <Text style={styles.deadlineText}>Deadline: {job.deadline}</Text>
      </View>
    </TouchableOpacity>
  );
};

const FilterModal: React.FC<{
  visible: boolean;
  onClose: () => void;
  selectedDept: string;
  onSelectDept: (d: string) => void;
}> = ({ visible, onClose, selectedDept, onSelectDept }) => (
  <Modal visible={visible} animationType="slide" transparent>
    <View style={styles.modalOverlay}>
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle}>Filter by Department</Text>
          <TouchableOpacity onPress={onClose}>
            <Ionicons name="close" size={24} color="#6B7280" />
          </TouchableOpacity>
        </View>
        <ScrollView style={{maxHeight: 400}}>
          {departments.map((dept) => (
            <TouchableOpacity
              key={dept}
              style={styles.filterOption}
              onPress={() => { onSelectDept(dept); onClose(); }}
            >
              <Text style={[styles.filterOptionText, selectedDept === dept && styles.filterOptionActive]}>
                {dept}
              </Text>
              {selectedDept === dept && <Ionicons name="checkmark-circle" size={20} color={primaryBlue} />}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>
    </View>
  </Modal>
);

const JobDetailModal: React.FC<{ visible: boolean; job: Job | null; onClose: () => void; onApply: () => void; }> = ({ visible, job, onClose, onApply }) => {
  if (!job) return null;
  const matchColor = job.match >= 90 ? '#16A34A' : primaryBlue;
  const matchBg = job.match >= 90 ? '#DCFCE7' : '#DBEAFE';

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContainer, { maxHeight: '85%' }]}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle} numberOfLines={2}>{job.title}</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            <Text style={styles.detailDept}>{job.department}</Text>
            <View style={[styles.matchBadge, { backgroundColor: matchBg, alignSelf: 'flex-start', marginBottom: 16 }]}>
              <Text style={[styles.matchText, { color: matchColor }]}>{job.match}% Match</Text>
            </View>

            <View style={styles.detailGrid}>
              <View style={styles.detailItem}><Feather name="clock" size={16} color={primaryBlue} /><Text style={styles.detailLabel}>Hours</Text><Text style={styles.detailValue}>{job.hours}</Text></View>
              <View style={styles.detailItem}><Feather name="trending-up" size={16} color={primaryBlue} /><Text style={styles.detailLabel}>Salary</Text><Text style={styles.detailValue}>{job.salary}</Text></View>
              <View style={styles.detailItem}><Ionicons name="people-outline" size={16} color={primaryBlue} /><Text style={styles.detailLabel}>Applicants</Text><Text style={styles.detailValue}>{job.applicants}</Text></View>
              <View style={styles.detailItem}><Ionicons name="calendar-outline" size={16} color={primaryBlue} /><Text style={styles.detailLabel}>Deadline</Text><Text style={styles.detailValue}>{job.deadline}</Text></View>
            </View>

            <Text style={styles.detailSectionTitle}>About This Role</Text>
            <Text style={styles.detailBody}>
              This position is a great opportunity for students to gain hands-on experience in {job.department.replace(' Department','')}.
              You'll be working closely with faculty members and contributing to real academic projects.
              {'\n\n'}Flexible hours are available to accommodate your academic schedule.
            </Text>

            <Text style={styles.detailSectionTitle}>Requirements</Text>
            {['Currently enrolled student','Relevant coursework in the field','Strong attention to detail','Good communication skills'].map((req,i) => (
              <View key={i} style={styles.requirementItem}>
                <View style={styles.requirementDot} />
                <Text style={styles.requirementText}>{req}</Text>
              </View>
            ))}
          </ScrollView>

          <TouchableOpacity style={styles.applyBtn} onPress={onApply} activeOpacity={0.85}>
            <Text style={styles.applyBtnText}>Apply Now</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

// ─── Main JobsScreen ─────────────────────────────────────────────
const JobsScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('jobs');
  const [search, setSearch] = useState('');
  const [jobs, setJobs] = useState<Job[]>(allJobs);
  const [filterVisible, setFilterVisible] = useState(false);
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [detailVisible, setDetailVisible] = useState(false);

  const router = useRouter();
  const params = useLocalSearchParams();
  const userData = {
    name: (params.name as string) || 'Student',
    department: (params.department as string) || 'Department',
    gpa: (params.gpa as string) || '-',
    year: (params.year as string) || '-',
    email: (params.email as string) || '',
  };

  const filtered = jobs.filter(j => {
    const matchesSearch = j.title.toLowerCase().includes(search.toLowerCase()) || 
                          j.department.toLowerCase().includes(search.toLowerCase());
    const matchesDept = selectedDept === 'All' || j.department.toLowerCase().includes(selectedDept.toLowerCase());
    return matchesSearch && matchesDept;
  });

  const toggleSave = (id: string) => setJobs(prev => prev.map(j => j.id === id ? {...j, saved: !j.saved} : j));
  
  const handleApply = () => { 
    if(selectedJob){ 
        alert(`Successfully applied for: ${selectedJob.title}`);
        setDetailVisible(false); 
    } 
  };

  const handleTabPress = (key: TabKey) => {
    setActiveTab(key);
    switch(key){
      case 'home': router.replace({ pathname: '/StudentDashboard', params: userData }); break;
      case 'applications': router.replace({ pathname: '/ApplicationsScreen', params: userData }); break;
      case 'profile': router.replace({ pathname: '/ProfileScreen', params: userData }); break;
      case 'more': router.replace({ pathname: '/MoreScreen', params: userData }); break;
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />
      
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Job Opportunities</Text>
        <View style={styles.searchRow}>
          <View style={styles.searchBox}>
            <Ionicons name="search-outline" size={18} color="#9CA3AF" />
            <TextInput 
                style={styles.searchInput} 
                placeholder="Search jobs or departments..." 
                placeholderTextColor="#9CA3AF" 
                value={search} 
                onChangeText={setSearch} 
            />
            {search.length > 0 && (
                <TouchableOpacity onPress={() => setSearch('')}>
                    <Ionicons name="close-circle" size={18} color="#9CA3AF" />
                </TouchableOpacity>
            )}
          </View>
        </View>
        <TouchableOpacity style={styles.filterBtn} onPress={() => setFilterVisible(true)}>
          <Ionicons name="options-outline" size={16} color={primaryBlue} />
          <Text style={styles.filterBtnText}>{selectedDept === 'All' ? 'Filters' : selectedDept}</Text>
          {selectedDept !== 'All' && <View style={styles.filterDot}/>}
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {filtered.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="search-outline" size={48} color="#D1D5DB"/>
              <Text style={styles.emptyTitle}>No jobs found</Text>
              <Text style={styles.emptySubtitle}>Try adjusting your search or filters</Text>
            </View>
          ) : (
            filtered.map(job => (
              <JobCard 
                key={job.id} 
                job={job} 
                onSaveToggle={toggleSave} 
                onPress={() => { setSelectedJob(job); setDetailVisible(true); }}
              />
            ))
          )}
          <View style={{height: 80}}/>
        </View>
      </ScrollView>

      <FilterModal 
        visible={filterVisible} 
        onClose={() => setFilterVisible(false)} 
        selectedDept={selectedDept} 
        onSelectDept={setSelectedDept} 
      />
      
      <JobDetailModal 
        visible={detailVisible} 
        job={selectedJob} 
        onClose={() => setDetailVisible(false)} 
        onApply={handleApply} 
      />

      <BottomTabBar active={activeTab} onPress={handleTabPress} />
    </SafeAreaView>
  );
};

export default JobsScreen;

// ─── Styles ─────────────────────────────────────────────────
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F1F5F9' },
  scroll: { flex: 1 },
  header: { backgroundColor: '#fff', paddingHorizontal: 20, paddingTop: 20, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  headerTitle: { fontSize: 26, fontWeight: '800', color: primaryBlue, marginBottom: 12 },
  searchRow: { marginBottom: 10 },
  searchBox: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#F8FAFF', borderRadius: 12, paddingHorizontal: 12, height: 44, borderWidth: 1.5, borderColor: '#E2E8F0', gap: 8 },
  searchInput: { flex: 1, fontSize: 14, color: '#111827' },
  filterBtn: { flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', gap: 6, backgroundColor: '#EFF6FF', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 8 },
  filterBtnText: { fontSize: 14, fontWeight: '600', color: primaryBlue },
  filterDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#EF4444', marginLeft: 2 },
  content: { padding: 16 },
  card: { backgroundColor: '#fff', borderRadius: 14, padding: 16, marginBottom: 16, shadowColor: '#000', shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
  cardTopRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTitle: { fontSize: 16, fontWeight: '700', color: '#111827', flex: 1, marginRight: 8 },
  cardDept: { fontSize: 14, color: '#6B7280', marginVertical: 6 },
  badgeRow: { flexDirection: 'row', gap: 8, marginBottom: 6 },
  matchBadge: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  matchText: { fontSize: 12, fontWeight: '600' },
  closingBadge: { backgroundColor: '#FEE2E2', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 6 },
  closingText: { fontSize: 12, fontWeight: '600', color: '#B91C1C' },
  cardMeta: { flexDirection: 'row', alignItems: 'center', marginVertical: 4 },
  metaItem: { flexDirection: 'row', alignItems: 'center' },
  metaText: { fontSize: 12, color: '#9CA3AF' },
  metaDot: { marginHorizontal: 4, fontSize: 12, color: '#9CA3AF' },
  cardFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 8 },
  deadlineText: { fontSize: 12, color: '#9CA3AF' },
  saveBtn: { padding: 6 },
  tabBar: { position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', height: 64, backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#E5E7EB' },
  tabItem: { justifyContent: 'center', alignItems: 'center' },
  tabLabel: { fontSize: 12, color: '#9CA3AF', marginTop: 2 },
  tabLabelActive: { color: primaryBlue, fontWeight: '600' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.35)', justifyContent: 'center', alignItems: 'center' },
  modalContainer: { backgroundColor: '#fff', borderRadius: 16, width: '90%', padding: 16 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  modalTitle: { fontSize: 18, fontWeight: '700', color: '#111827' },
  filterOption: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  filterOptionText: { fontSize: 14, color: '#6B7280' },
  filterOptionActive: { color: primaryBlue, fontWeight: '600' },
  detailDept: { fontSize: 14, color: '#6B7280', marginBottom: 8 },
  detailGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 16 },
  detailItem: { width: '47%', backgroundColor: '#EFF6FF', borderRadius: 10, padding: 8, marginBottom: 8 },
  detailLabel: { fontSize: 12, color: '#6B7280' },
  detailValue: { fontSize: 14, fontWeight: '600', color: '#111827' },
  detailSectionTitle: { fontSize: 16, fontWeight: '700', color: '#111827', marginVertical: 8 },
  detailBody: { fontSize: 14, color: '#4B5563', lineHeight: 20 },
  requirementItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 6 },
  requirementDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: primaryBlue, marginRight: 8 },
  requirementText: { fontSize: 14, color: '#4B5563' },
  applyBtn: { backgroundColor: primaryBlue, borderRadius: 14, height: 52, alignItems: 'center', justifyContent: 'center', marginTop: 12 },
  applyBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
  emptyState: { justifyContent: 'center', alignItems: 'center', marginTop: 60 },
  emptyTitle: { fontSize: 16, fontWeight: '600', color: '#6B7280', marginTop: 12 },
  emptySubtitle: { fontSize: 14, color: '#9CA3AF', marginTop: 4 }
});