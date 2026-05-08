// MOBILE-APP/frontEnd/app/SavedJobsScreen.tsx
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Modal,
  Alert,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams, useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getSavedJobs, unsaveJob, applyToJob } from '../src/api';

type TabKey = 'home' | 'jobs' | 'applications' | 'profile' | 'more';

interface Job {
  id: string;
  title: string;
  department: string;
  departmentCode?: string;
  hours?: string;
  hoursPerWeek?: string;
  deadline?: string;
  salary?: string;
  savedDate?: string;
  match?: number;
  matchPercentage?: number;
  skills?: string[];
  description?: string;
  requirements?: string;
  applicants?: number;
}

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
    { key: 'applications', label: 'Apps' },
    { key: 'profile', label: 'Profile' },
    { key: 'more', label: 'More' },
  ];

  const getIcon = (key: TabKey, isActive: boolean) => {
    const color = isActive ? '#1E3A5F' : '#9CA3AF';
    switch (key) {
      case 'home':
        return <Ionicons name={isActive ? 'home' : 'home-outline'} size={23} color={color} />;
      case 'jobs':
        return <MaterialCommunityIcons name="briefcase-outline" size={23} color={color} />;
      case 'applications':
        return <Ionicons name={isActive ? 'document-text' : 'document-text-outline'} size={23} color={color} />;
      case 'profile':
        return <Ionicons name={isActive ? 'person' : 'person-outline'} size={23} color={color} />;
      case 'more':
        return <Feather name="more-horizontal" size={23} color={color} />;
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

// ─── Stat Card Component ────────────────────────────────────────────────────
interface StatCardProps {
  number: number;
  label: string;
  icon: string;
  color: string;
}

const StatCard: React.FC<StatCardProps> = ({ number, label, icon, color }) => {
  const getIconName = (iconName: string): any => {
    switch (iconName) {
      case 'bookmark': return 'bookmark-outline';
      case 'star': return 'star-outline';
      case 'paper-plane': return 'paper-plane-outline';
      case 'clock': return 'time-outline';
      default: return 'document-text-outline';
    }
  };

  return (
    <View style={[styles.statCard, { borderLeftColor: color, borderLeftWidth: 4 }]}>
      <View style={[styles.statIconContainer, { backgroundColor: `${color}15` }]}>
        <Ionicons name={getIconName(icon)} size={24} color={color} />
      </View>
      <View style={styles.statInfo}>
        <Text style={styles.statNumber}>{number}</Text>
        <Text style={styles.statLabel}>{label}</Text>
      </View>
    </View>
  );
};

// ─── Main SavedJobsScreen ───────────────────────────────────────────────────
const SavedJobsScreen = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('jobs');
  const [savedJobs, setSavedJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [applying, setApplying] = useState(false);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [detailVisible, setDetailVisible] = useState(false);
  const [userDepartment, setUserDepartment] = useState('');

  const router = useRouter();
  const params = useLocalSearchParams();

  const userData = {
    name: (params.name as string) || 'Student',
    department: (params.department as string) || 'Department',
    gpa: (params.gpa as string) || '-',
    year: (params.year as string) || '-',
    email: (params.email as string) || '',
  };

  // تحميل الوظائف المحفوظة
 // تحميل الوظائف المحفوظة
const loadSavedJobs = async () => {
  try {
    const response = await getSavedJobs();
    console.log("Saved jobs response:", response); // للتأكد
    
    if (response.success && response.data) {
      // ✅ التعديل المهم هنا: استخراج job.job من response.data
      const formattedJobs = response.data.map((item: any) => {
        const jobData = item.job || item; // لو فيه job جوه، خدها
        return {
          id: jobData.id || jobData._id,
          title: jobData.title,
          department: jobData.department,
          departmentCode: jobData.departmentCode || jobData.department?.substring(0, 8),
          hours: jobData.hoursPerWeek || jobData.hours,
          deadline: jobData.deadline ? new Date(jobData.deadline).toLocaleDateString() : 'No deadline',
          salary: jobData.salary,
          savedDate: item.savedAt ? new Date(item.savedAt.toDate()).toLocaleDateString() : new Date().toLocaleDateString(),
          match: jobData.matchPercentage || Math.floor(Math.random() * 30) + 70,
          skills: jobData.skills || ['Communication', 'Teamwork'],
          description: jobData.description,
          requirements: jobData.requirements,
          applicants: jobData.applicantsCount,
        };
      });
      setSavedJobs(formattedJobs);
    } else {
      setSavedJobs([]);
    }
  } catch (err) {
    console.error("Error fetching saved jobs:", err);
    setSavedJobs([]);
  } finally {
    setLoading(false);
    setRefreshing(false);
  }
};

  // تحميل بيانات المستخدم
  const loadUserData = async () => {
    try {
      const stored = await AsyncStorage.getItem('userData');
      if (stored) {
        const parsed = JSON.parse(stored);
        setUserDepartment(parsed.department || '');
      }
    } catch (err) {
      console.log('Error loading user data:', err);
    }
  };

  useFocusEffect(
    useCallback(() => {
      loadSavedJobs();
      loadUserData();
    }, [])
  );

  useEffect(() => {
    loadSavedJobs();
    loadUserData();
  }, []);

  // إزالة وظيفة من المحفوظات
  const handleRemoveSaved = async (jobId: string) => {
    Alert.alert(
      'Remove Job',
      'Are you sure you want to remove this job from saved?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: async () => {
            setRemovingId(jobId);
            try {
              await unsaveJob(jobId);
              setSavedJobs(savedJobs.filter(job => job.id !== jobId));
              Alert.alert('Success', 'Job removed from saved');
            } catch (err: any) {
              Alert.alert('Error', err.message || 'Failed to remove job');
            } finally {
              setRemovingId(null);
            }
          },
        },
      ]
    );
  };

  
  const handleApply = async () => {
    if (!selectedJob) return;
    setApplying(true);
    try {
      const token = await AsyncStorage.getItem('userToken');
      if (!token) {
        Alert.alert('Error', 'Please login first');
        return;
      }

      await applyToJob(selectedJob.id);
      Alert.alert('Success 🎉', 'Application submitted successfully!');
      setDetailVisible(false);
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to apply');
    } finally {
      setApplying(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadSavedJobs();
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

  // حساب لون نسبة المطابقة
  const getMatchColor = (percentage: number = 0) => {
    if (percentage >= 90) return '#16A34A';
    if (percentage >= 80) return '#F59E0B';
    return '#EF4444';
  };

  const getMatchBgColor = (percentage: number = 0) => {
    if (percentage >= 90) return '#DCFCE7';
    if (percentage >= 80) return '#FEF3C7';
    return '#FEE2E2';
  };

  // حساب الإحصائيات
  const highMatchCount = savedJobs.filter(job => (job.match || 0) >= 90).length;
  const activeJobsCount = savedJobs.filter(job => job.deadline && !job.deadline.includes('passed')).length;

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <StatusBar barStyle="dark-content" backgroundColor="#fff" />
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1E3A5F" />
          <Text style={styles.loadingText}>Loading saved jobs...</Text>
        </View>
        <BottomTabBar active={activeTab} onPress={handleTabPress} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Saved Jobs</Text>
        <Text style={styles.headerSubtitle}>
          {userDepartment || 'All Departments'} • {savedJobs.length} saved jobs
        </Text>
      </View>

      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#1E3A5F']} />}
      >
        <View style={styles.content}>
          {/* Statistics Cards */}
          <View style={styles.statsGrid}>
            <StatCard number={savedJobs.length} label="Total Saved" icon="bookmark" color="#1E3A5F" />
            <StatCard number={highMatchCount} label="High Match (>90%)" icon="star" color="#16A34A" />
            <StatCard number={savedJobs.length} label="Ready to Apply" icon="paper-plane" color="#0077B5" />
            <StatCard number={activeJobsCount} label="Active" icon="clock" color="#F59E0B" />
          </View>

          {savedJobs.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="bookmark-outline" size={64} color="#D1D5DB" />
              <Text style={styles.emptyTitle}>No saved jobs yet</Text>
              <Text style={styles.emptySubtitle}>
                Start exploring and save jobs you're interested in
              </Text>
              <TouchableOpacity
                style={styles.browseBtn}
                onPress={() => {
                  router.replace({
                    pathname: '/JobsScreen',
                    params: userData as any,
                  });
                }}
              >
                <Ionicons name="search-outline" size={20} color="#fff" />
                <Text style={styles.browseBtnText}>Browse Available Jobs</Text>
              </TouchableOpacity>
            </View>
          ) : (
            savedJobs.map((job) => {
              const matchPercentage = job.match || job.matchPercentage || 0;
              const isHighMatch = matchPercentage >= 90;
              
              return (
                <View
                  key={job.id}
                  style={[styles.card, isHighMatch && styles.highMatchCard]}
                >
                  {/* Remove Button */}
                  <TouchableOpacity
                    style={styles.removeButton}
                    onPress={() => handleRemoveSaved(job.id)}
                    disabled={removingId === job.id}
                  >
                    {removingId === job.id ? (
                      <ActivityIndicator size="small" color="#EF4444" />
                    ) : (
                      <>
                        <Ionicons name="close-outline" size={16} color="#fff" />
                        <Text style={styles.removeButtonText}>Remove</Text>
                      </>
                    )}
                  </TouchableOpacity>

                  {/* Job Title and Badges */}
                  <View style={styles.cardHeader}>
                    <Text style={styles.cardTitle}>{job.title}</Text>
                    <View style={styles.badgesContainer}>
                      <View style={[styles.matchBadge, { backgroundColor: getMatchBgColor(matchPercentage) }]}>
                        <Ionicons name="stats-chart" size={12} color={getMatchColor(matchPercentage)} />
                        <Text style={[styles.matchText, { color: getMatchColor(matchPercentage) }]}>
                          {matchPercentage}% Match
                        </Text>
                      </View>
                      <View style={styles.departmentBadge}>
                        <Ionicons name="business-outline" size={12} color="#1E3A5F" />
                        <Text style={styles.departmentBadgeText}>
                          {job.departmentCode || job.department?.substring(0, 8)}
                        </Text>
                      </View>
                      {isHighMatch && (
                        <View style={styles.topMatchBadge}>
                          <Ionicons name="star" size={12} color="#fff" />
                          <Text style={styles.topMatchBadgeText}>Top Match</Text>
                        </View>
                      )}
                    </View>
                  </View>

                  {/* Department */}
                  <Text style={styles.cardDept}>
                    <Ionicons name="business-outline" size={14} color="#1E3A5F" />
                    {' '}{job.department}
                  </Text>

                  {/* Skills Tags */}
                  {job.skills && job.skills.length > 0 && (
                    <View style={styles.skillsContainer}>
                      {job.skills.slice(0, 3).map((skill, index) => (
                        <View key={index} style={styles.skillTag}>
                          <Ionicons name="code-outline" size={10} color="#1E3A5F" />
                          <Text style={styles.skillTagText}>{skill}</Text>
                        </View>
                      ))}
                      {job.skills.length > 3 && (
                        <Text style={styles.moreSkills}>+{job.skills.length - 3}</Text>
                      )}
                    </View>
                  )}

                  {/* Job Details */}
                  <View style={styles.detailsGrid}>
                    <View style={styles.detailItem}>
                      <Ionicons name="time-outline" size={14} color="#6B7280" />
                      <Text style={styles.detailText}>{job.hours || job.hoursPerWeek || 'Not specified'}</Text>
                    </View>
                    <View style={styles.detailItem}>
                      <Ionicons name="calendar-outline" size={14} color="#6B7280" />
                      <Text style={styles.detailText}>{job.deadline || 'No deadline'}</Text>
                    </View>
                    <View style={styles.detailItem}>
                      <Ionicons name="cash-outline" size={14} color="#6B7280" />
                      <Text style={styles.detailText}>{job.salary || 'Competitive'}</Text>
                    </View>
                    <View style={styles.detailItem}>
                      <Ionicons name="bookmark-outline" size={14} color="#6B7280" />
                      <Text style={styles.detailText}>Saved: {job.savedDate || 'Recently'}</Text>
                    </View>
                  </View>

                  {/* Action Buttons */}
                  <View style={styles.actionButtons}>
                    <TouchableOpacity
                      style={styles.applyButton}
                      onPress={() => {
                        setSelectedJob(job);
                        setDetailVisible(true);
                      }}
                    >
                      <Ionicons name="paper-plane-outline" size={18} color="#fff" />
                      <Text style={styles.applyButtonText}>View Details</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })
          )}
          <View style={{ height: 80 }} />
        </View>
      </ScrollView>

      {/* Job Detail Modal */}
      <Modal visible={detailVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContainer, { maxHeight: '85%' }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle} numberOfLines={2}>
                {selectedJob?.title}
              </Text>
              <TouchableOpacity onPress={() => setDetailVisible(false)}>
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.detailDept}>{selectedJob?.department}</Text>

              {/* Match Badge in Modal */}
              {selectedJob?.match && (
                <View style={[styles.detailMatchBadge, { backgroundColor: getMatchBgColor(selectedJob.match) }]}>
                  <Ionicons name="stats-chart" size={14} color={getMatchColor(selectedJob.match)} />
                  <Text style={[styles.detailMatchText, { color: getMatchColor(selectedJob.match) }]}>
                    {selectedJob.match}% Match with your profile
                  </Text>
                </View>
              )}

              {/* Job Details Grid */}
              <View style={styles.detailInfoGrid}>
                {selectedJob?.hours && (
                  <View style={styles.detailInfoItem}>
                    <Ionicons name="time-outline" size={18} color="#1E3A5F" />
                    <Text style={styles.detailInfoLabel}>Hours</Text>
                    <Text style={styles.detailInfoValue}>{selectedJob.hours}</Text>
                  </View>
                )}
                {selectedJob?.salary && (
                  <View style={styles.detailInfoItem}>
                    <Ionicons name="cash-outline" size={18} color="#1E3A5F" />
                    <Text style={styles.detailInfoLabel}>Salary</Text>
                    <Text style={styles.detailInfoValue}>{selectedJob.salary}</Text>
                  </View>
                )}
                {selectedJob?.deadline && (
                  <View style={styles.detailInfoItem}>
                    <Ionicons name="calendar-outline" size={18} color="#EF4444" />
                    <Text style={styles.detailInfoLabel}>Deadline</Text>
                    <Text style={[styles.detailInfoValue, { color: '#EF4444' }]}>{selectedJob.deadline}</Text>
                  </View>
                )}
                {selectedJob?.applicants !== undefined && (
                  <View style={styles.detailInfoItem}>
                    <Ionicons name="people-outline" size={18} color="#1E3A5F" />
                    <Text style={styles.detailInfoLabel}>Applicants</Text>
                    <Text style={styles.detailInfoValue}>{selectedJob.applicants}</Text>
                  </View>
                )}
              </View>

              {/* Skills in Modal */}
              {selectedJob?.skills && selectedJob.skills.length > 0 && (
                <>
                  <Text style={styles.detailSectionTitle}>Required Skills</Text>
                  <View style={styles.modalSkillsContainer}>
                    {selectedJob.skills.map((skill, index) => (
                      <View key={index} style={styles.modalSkillTag}>
                        <Text style={styles.modalSkillText}>{skill}</Text>
                      </View>
                    ))}
                  </View>
                </>
              )}

              {selectedJob?.description ? (
                <>
                  <Text style={styles.detailSectionTitle}>Description</Text>
                  <Text style={styles.detailBody}>{selectedJob.description}</Text>
                </>
              ) : null}

              {selectedJob?.requirements ? (
                <>
                  <Text style={styles.detailSectionTitle}>Requirements</Text>
                  <Text style={styles.detailBody}>{selectedJob.requirements}</Text>
                </>
              ) : null}
            </ScrollView>

            {/* Action Buttons in Modal */}
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.removeModalBtn}
                onPress={() => {
                  if (selectedJob) {
                    handleRemoveSaved(selectedJob.id);
                    setDetailVisible(false);
                  }
                }}
              >
                <Ionicons name="trash-outline" size={20} color="#EF4444" />
                <Text style={styles.removeModalBtnText}>Remove</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.applyModalBtn, applying && { opacity: 0.6 }]}
                onPress={handleApply}
                disabled={applying}
              >
                <Ionicons name="paper-plane-outline" size={20} color="#fff" />
                <Text style={styles.applyModalBtnText}>
                  {applying ? 'Applying...' : 'Apply Now'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      <BottomTabBar active={activeTab} onPress={handleTabPress} />
    </SafeAreaView>
  );
};

export default SavedJobsScreen;

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
    fontSize: 28,
    fontWeight: '800',
    color: '#1E3A5F',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  content: { padding: 16 },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
  },
  loadingText: {
    marginTop: 12,
    color: '#6B7280',
    fontSize: 14,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 20,
    gap: 12,
  },
  statCard: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  statIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  statInfo: {
    flex: 1,
  },
  statNumber: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
  },
  statLabel: {
    fontSize: 11,
    color: '#6B7280',
    marginTop: 2,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
    position: 'relative',
  },
  highMatchCard: {
    borderWidth: 2,
    borderColor: '#16A34A20',
  },
  removeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#EF4444',
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    zIndex: 10,
  },
  removeButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  cardHeader: {
    marginRight: 70,
    marginBottom: 10,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 8,
  },
  badgesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  matchBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  matchText: {
    fontSize: 12,
    fontWeight: '600',
  },
  departmentBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#E6F0FA',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  departmentBadgeText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#1E3A5F',
  },
  topMatchBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#16A34A',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  topMatchBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#fff',
  },
  cardDept: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  skillTag: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#E6F0FA',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 16,
  },
  skillTagText: {
    fontSize: 11,
    color: '#1E3A5F',
  },
  moreSkills: {
    fontSize: 11,
    color: '#6B7280',
    alignSelf: 'center',
  },
  detailsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 16,
    marginBottom: 16,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  detailText: {
    fontSize: 12,
    color: '#6B7280',
  },
  actionButtons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
  },
  applyButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#1E3A5F',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 12,
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginTop: 16,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#6B7280',
    marginTop: 8,
    textAlign: 'center',
  },
  browseBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: '#1E3A5F',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 24,
  },
  browseBtnText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  tabBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingBottom: 8,
    paddingTop: 10,
    elevation: 8,
  },
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabel: {
    fontSize: 10,
    color: '#9CA3AF',
    marginTop: 3,
  },
  tabLabelActive: {
    color: '#1E3A5F',
    fontWeight: '600',
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.35)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
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
  detailDept: {
    fontSize: 14,
    color: '#6B7280',
    marginBottom: 12,
  },
  detailMatchBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    alignSelf: 'flex-start',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginBottom: 16,
  },
  detailMatchText: {
    fontSize: 13,
    fontWeight: '600',
  },
  detailInfoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
    marginBottom: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  detailInfoItem: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 12,
    alignItems: 'center',
  },
  detailInfoLabel: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 4,
  },
  detailInfoValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#111827',
    marginTop: 2,
  },
  detailSectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginTop: 8,
    marginBottom: 8,
  },
  detailBody: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
    marginBottom: 16,
  },
  modalSkillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  modalSkillTag: {
    backgroundColor: '#E6F0FA',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  modalSkillText: {
    fontSize: 12,
    color: '#1E3A5F',
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
  },
  removeModalBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    borderWidth: 1.5,
    borderColor: '#EF4444',
    borderRadius: 14,
    paddingVertical: 14,
  },
  removeModalBtnText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#EF4444',
  },
  applyModalBtn: {
    flex: 2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#1E3A5F',
    borderRadius: 14,
    paddingVertical: 14,
  },
  applyModalBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '700',
  },
});