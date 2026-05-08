
import React, { useState, useEffect, useCallback } from 'react';
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
  ActivityIndicator,
  RefreshControl,
  FlatList,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams, useFocusEffect } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getAvailableJobs, applyToJob, saveJob, unsaveJob, getSavedJobs, addComment, getComments, analyzeMatchWithAI,isJobSaved } from '../src/api';

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
  matchPercentage?: number;
  hoursPerWeek?: string;
  applicants?: number;
  deadline?: string | null;
  createdAt?: any;
  commentCount?: number;
}

interface Comment {
  id: string;
  jobId: string;
  userId: string;
  userName: string;
  comment: string;
  createdAt: string;
  updatedAt?: string;
}

interface AIMatchAnalysis {
  matchPercentage: number;
  strengths: string[];
  weaknesses: string[];
  recommendation: string;
  summary: string;
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
const BottomTabBar = React.memo(({ active, onPress }: { active: TabKey; onPress: (k: TabKey) => void }) => {
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
});

// ─── Component: AI Match Analysis Modal ─────────────────────────────────────
const AIMatchAnalysisModal = React.memo(({ 
  visible, 
  onClose, 
  jobTitle,
  matchData,
  loading 
}: { 
  visible: boolean; 
  onClose: () => void; 
  jobTitle: string;
  matchData: AIMatchAnalysis | null;
  loading: boolean;
}) => {
  if (!visible) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContainer, { maxHeight: '80%' }]}>
          <View style={styles.modalHeader}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8 }}>
              <Ionicons name="sparkles" size={24} color="#F59E0B" />
              <Text style={styles.modalTitle}>AI Match Analysis</Text>
            </View>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          {loading ? (
            <View style={styles.aiLoadingContainer}>
              <ActivityIndicator size="large" color="#1E3A5F" />
              <Text style={styles.aiLoadingText}>AI is analyzing your profile...</Text>
              <Text style={styles.aiLoadingSubtext}>Comparing your skills with {jobTitle}</Text>
            </View>
          ) : matchData ? (
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.aiMatchCard}>
                <Text style={styles.aiMatchTitle}>Match Score</Text>
                <View style={styles.aiMatchCircleContainer}>
                  <View style={styles.aiMatchCircle}>
                    <Text style={styles.aiMatchPercentage}>{matchData.matchPercentage}%</Text>
                    <Text style={styles.aiMatchLabel}>Compatibility</Text>
                  </View>
                </View>
                <View style={styles.aiMatchBarContainer}>
                  <View style={[styles.aiMatchBar, { width: `${matchData.matchPercentage}%`, backgroundColor: matchData.matchPercentage >= 70 ? '#16A34A' : matchData.matchPercentage >= 50 ? '#F59E0B' : '#EF4444' }]} />
                </View>
              </View>

              <View style={styles.aiSectionCard}>
                <Text style={styles.aiSectionTitle}>📊 Summary</Text>
                <Text style={styles.aiSectionText}>{matchData.summary}</Text>
              </View>

              <View style={styles.aiSectionCard}>
                <Text style={styles.aiSectionTitle}>✅ Strengths</Text>
                {Array.isArray(matchData.strengths) && matchData.strengths.map((item, index) => (
                  <View key={index} style={styles.aiBulletPoint}>
                    <Ionicons name="checkmark-circle" size={18} color="#16A34A" />
                    <Text style={styles.aiBulletText}>{item}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.aiSectionCard}>
                <Text style={styles.aiSectionTitle}>⚠️ Areas to Improve</Text>
                {Array.isArray(matchData.weaknesses) && matchData.weaknesses.map((item, index) => (
                  <View key={index} style={styles.aiBulletPoint}>
                    <Ionicons name="alert-circle" size={18} color="#F59E0B" />
                    <Text style={styles.aiBulletText}>{item}</Text>
                  </View>
                ))}
              </View>

              <View style={styles.aiSectionCard}>
                <Text style={styles.aiSectionTitle}>💡 Recommendation</Text>
                <Text style={styles.aiSectionText}>{matchData.recommendation}</Text>
              </View>
            </ScrollView>
          ) : (
            <View style={styles.aiErrorContainer}>
              <Ionicons name="sad-outline" size={48} color="#9CA3AF" />
              <Text style={styles.aiErrorText}>Could not analyze match</Text>
              <Text style={styles.aiErrorSubtext}>Please try again later</Text>
            </View>
          )}

          <TouchableOpacity style={styles.aiCloseBtn} onPress={onClose}>
            <Text style={styles.aiCloseBtnText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
});

// ─── Component: Comments Section ─────────────────────────────────────
const CommentsSection = React.memo(({ 
  jobId, 
  userId, 
  userName,
  initialCommentCount = 0,
  onCommentCountChange
}: { 
  jobId: string; 
  userId: string; 
  userName: string;
  initialCommentCount?: number;
  onCommentCountChange?: (count: number) => void;
}) => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [loading, setLoading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [expanded, setExpanded] = useState(false);
  const [hasLoaded, setHasLoaded] = useState(false);
  const [commentCount, setCommentCount] = useState(initialCommentCount);

  const loadComments = useCallback(async () => {
    if (!jobId) return;
    setLoading(true);
    try {
      const response: any = await getComments(jobId);
      let commentsData: Comment[] = [];
      if (response?.success && response?.comments && Array.isArray(response.comments)) {
        commentsData = response.comments;
      } else if (response?.data?.comments && Array.isArray(response.data.comments)) {
        commentsData = response.data.comments;
      }
      setComments(commentsData);
      setCommentCount(commentsData.length);
      setHasLoaded(true);
      
      // ✅ إعلام المكون الأب بتغير العدد
      if (onCommentCountChange) {
        onCommentCountChange(commentsData.length);
      }
    } catch (err) {
      console.error('Failed to load comments:', err);
    } finally {
      setLoading(false);
    }
  }, [jobId, onCommentCountChange]);

  const handleAddComment = useCallback(async () => {
    if (!newComment.trim()) {
      Alert.alert('Info', 'Please enter a comment');
      return;
    }
    
    setSubmitting(true);
    try {
      const response = await addComment(jobId, newComment.trim());
      if (response && response.success) {
        // ✅ إعادة تحميل التعليقات
        await loadComments();
        setNewComment('');
      } else {
        Alert.alert('Error', response?.message || 'Failed to add comment');
      }
    } catch (err: any) {
      Alert.alert('Error', err?.message || 'Failed to add comment');
    } finally {
      setSubmitting(false);
    }
  }, [jobId, newComment, loadComments]);

  const formatDate = useCallback((dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  }, []);

  const handleToggleExpand = useCallback(() => {
    setExpanded(prev => !prev);
    if (!hasLoaded) {
      loadComments();
    }
  }, [hasLoaded, loadComments]);

  if (!expanded) {
    return (
      <TouchableOpacity 
        style={styles.showCommentsBtn}
        onPress={handleToggleExpand}
      >
        <Ionicons name="chatbubble-outline" size={16} color="#1E3A5F" />
        <Text style={styles.showCommentsText}>Comments ({commentCount})</Text>
        <Ionicons name="chevron-down" size={16} color="#1E3A5F" />
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.commentsContainer}>
      <View style={styles.commentsHeader}>
        <View style={styles.commentsHeaderLeft}>
          <Ionicons name="chatbubbles" size={18} color="#1E3A5F" />
          <Text style={styles.commentsTitle}>Comments ({commentCount})</Text>
        </View>
        <TouchableOpacity onPress={() => setExpanded(false)}>
          <Ionicons name="chevron-up" size={18} color="#9CA3AF" />
        </TouchableOpacity>
      </View>

      <View style={styles.addCommentContainer}>
        <View style={styles.addCommentInputWrapper}>
          <TextInput
            style={styles.addCommentInput}
            placeholder="Write a comment..."
            placeholderTextColor="#9CA3AF"
            value={newComment}
            onChangeText={setNewComment}
            multiline
          />
        </View>
        <TouchableOpacity
          style={[styles.addCommentBtn, submitting && styles.disabledBtn]}
          onPress={handleAddComment}
          disabled={submitting}
        >
          {submitting ? <ActivityIndicator size="small" color="#fff" /> : <Ionicons name="send" size={18} color="#fff" />}
        </TouchableOpacity>
      </View>

      {loading ? (
        <View style={styles.commentsLoading}>
          <ActivityIndicator size="small" color="#1E3A5F" />
          <Text style={styles.commentsLoadingText}>Loading comments...</Text>
        </View>
      ) : comments.length === 0 ? (
        <View style={styles.noComments}>
          <Ionicons name="chatbubble-ellipses-outline" size={32} color="#D1D5DB" />
          <Text style={styles.noCommentsText}>No comments yet</Text>
          <Text style={styles.noCommentsSubtext}>Be the first to comment!</Text>
        </View>
      ) : (
        <FlatList
          data={comments}
          keyExtractor={(item) => item.id}
          scrollEnabled={false}
          initialNumToRender={5}
          maxToRenderPerBatch={5}
          windowSize={5}
          renderItem={({ item }) => (
            <View style={styles.commentItem}>
              <View style={styles.commentAvatar}>
                <Text style={styles.commentAvatarText}>
                  {item.userName?.charAt(0)?.toUpperCase() || 'U'}
                </Text>
              </View>
              <View style={styles.commentContent}>
                <View style={styles.commentHeader}>
                  <Text style={styles.commentUserName}>{item.userName || 'Anonymous'}</Text>
                  <Text style={styles.commentTime}>{formatDate(item.createdAt)}</Text>
                </View>
                <Text style={styles.commentText}>{item.comment}</Text>
              </View>
            </View>
          )}
          ItemSeparatorComponent={() => <View style={styles.commentSeparator} />}
        />
      )}
    </View>
  );
});

// ─── Main JobsScreen (المعدل بالكامل) ─────────────────────────────────────────────────
const JobsScreen = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('jobs');
  const [search, setSearch] = useState('');
  const [allJobs, setAllJobs] = useState<Job[]>([]);
  const [selectedDept, setSelectedDept] = useState('All');
  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [detailVisible, setDetailVisible] = useState(false);
  const [applying, setApplying] = useState(false);
  const [savedJobs, setSavedJobs] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [userId, setUserId] = useState<string>('');
  const [userName, setUserName] = useState<string>('');

  // AI States
  const [aiModalVisible, setAiModalVisible] = useState(false);
  const [aiMatchData, setAiMatchData] = useState<AIMatchAnalysis | null>(null);
  const [aiLoading, setAiLoading] = useState(false);
  const [aiJobTitle, setAiJobTitle] = useState<string>('');

  const router = useRouter();
  const params = useLocalSearchParams();
  
   useEffect(() => {
    const clearOldCache = async () => {
      const cachedJobs = await AsyncStorage.getItem('cachedJobs');
      if (cachedJobs) {
        const jobs = JSON.parse(cachedJobs);
        const hasOldFormat = jobs.some((job: any) => job.commentCount === undefined);
        if (hasOldFormat) {
          await AsyncStorage.removeItem('cachedJobs');
          console.log('✅ Old cache cleared');
        }
      }
    };
    clearOldCache();
  }, []);

  const userData = {
    name: (params.name as string) || 'Student',
    department: (params.department as string) || 'Department',
    gpa: (params.gpa as string) || '-',
    year: (params.year as string) || '-',
    email: (params.email as string) || '',
  };

  const loadUserInfo = useCallback(async () => {
    try {
      const [storedUserId, storedUserName] = await Promise.all([
        AsyncStorage.getItem('userId'),
        AsyncStorage.getItem('userName')
      ]);
      if (storedUserId) setUserId(storedUserId);
      if (storedUserName) setUserName(storedUserName);
    } catch (err) {
      console.error('Failed to load user info:', err);
    }
  }, []);

  // دالة fetchJobs المعدلة بالكامل - آمنة 100%
  const fetchJobs = useCallback(async () => {
    try {
      const response: any = await getAvailableJobs();
      
      let jobsArray: any[] = [];
      
      // محاولة استخراج الـ jobs بأمان
      if (response && typeof response === 'object') {
        if (response?.data?.data && Array.isArray(response.data.data)) {
          jobsArray = response.data.data;
        } else if (response?.data && Array.isArray(response.data)) {
          jobsArray = response.data;
        } else if (Array.isArray(response)) {
          jobsArray = response;
        } else if (response?.jobs && Array.isArray(response.jobs)) {
          jobsArray = response.jobs;
        } else if (response?.success && response?.data) {
          if (Array.isArray(response.data)) {
            jobsArray = response.data;
          } else if (response.data?.data && Array.isArray(response.data.data)) {
            jobsArray = response.data.data;
          }
        }
      }
      
      const formattedJobs: Job[] = jobsArray.map((job: any) => ({
        id: job?.id || job?._id || Math.random().toString(),
        title: job?.title || 'Untitled Job',
        department: job?.department || 'Not specified',
        salary: job?.salary || 'Competitive Salary',
        description: job?.description || '',
        requirements: job?.requirements || '',
        hoursPerWeek: job?.hoursPerWeek || '',
        applicants: job?.applicantsCount || job?.applicants?.length || 0,
        deadline: job?.deadline ? new Date(job.deadline).toLocaleDateString() : null,
        matchPercentage: job?.matchPercentage || Math.floor(Math.random() * 30) + 70,
        employerUid: job?.employerUid,
        createdAt: job?.createdAt,
          commentCount: job.commentCount || 0,
      }));
      
      setAllJobs(formattedJobs);
      
    } catch (err) {
      console.error("Failed to fetch jobs:", err);
      setAllJobs([]);
    }
  }, []);

  const fetchSavedJobs = useCallback(async () => {
    try {
      const response: any = await getSavedJobs();
      let savedIds: string[] = [];
      
      if (response && typeof response === 'object') {
        if (response?.success && response?.data) {
          const saved = response.data?.data || response.data || [];
          if (Array.isArray(saved)) {
            savedIds = saved.map((job: any) => job?.id || job?._id).filter(Boolean);
          }
        }
      }
      setSavedJobs(savedIds);
    } catch (err) {
      console.error("Failed to fetch saved jobs:", err);
      setSavedJobs([]);
    }
  }, []);

  const handleAIAnalyze = useCallback(async (jobId: string, jobTitle: string) => {
    setAiJobTitle(jobTitle);
    setAiModalVisible(true);
    setAiLoading(true);
    setAiMatchData(null);
    
    try {
      const response: any = await analyzeMatchWithAI(jobId);
      if (response?.success && response?.data) {
        setAiMatchData(response.data);
      }
    } catch (err) {
      console.error("AI analysis error:", err);
    } finally {
      setAiLoading(false);
    }
  }, []);

  const loadData = useCallback(async () => {
    setLoading(true);
    await Promise.all([fetchJobs(), fetchSavedJobs(), loadUserInfo()]);
    setLoading(false);
  }, [fetchJobs, fetchSavedJobs, loadUserInfo]);

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await Promise.all([fetchJobs(), fetchSavedJobs(), loadUserInfo()]);
    setRefreshing(false);
  }, [fetchJobs, fetchSavedJobs, loadUserInfo]);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

 const handleSaveJob = useCallback(async (jobId: string) => {
  setSavingId(jobId);
  try {
    // ✅ نتحقق من الحالة الحقيقية من السيرفر
    const checkResult = await isJobSaved(jobId);
    const currentlySaved = checkResult.data?.saved === true;
    
    if (currentlySaved) {
      // ✅ إلغاء حفظ
      const result = await unsaveJob(jobId);
      if (result.success) {
        setSavedJobs(prev => prev.filter(id => id !== jobId));
        Alert.alert('Success', 'Job removed from saved');
      } else {
        Alert.alert('Error', result.message || 'Failed to unsave job');
      }
    } else {
      // ✅ حفظ جديد
      const result = await saveJob(jobId);
      if (result.success) {
        setSavedJobs(prev => [...prev, jobId]);
        Alert.alert('Success', 'Job saved successfully');
      } else {
        Alert.alert('Error', result.message || 'Failed to save job');
      }
    }
  } catch (err: any) {
    console.error("Save/Unsave error:", err);
    Alert.alert('Error', err?.message || 'Something went wrong');
  } finally {
    setSavingId(null);
  }
}, []);

  const handleApply = useCallback(async () => {
    if (!selectedJob) return;
    setApplying(true);
    try {
      await applyToJob(selectedJob.id);
      Alert.alert('Success 🎉', 'Applied Successfully!');
      setDetailVisible(false);
    } catch (err: any) {
      Alert.alert('Error', err?.response?.data?.message || 'Failed to apply');
    } finally {
      setApplying(false);
    }
  }, [selectedJob]);

  const handleTabPress = useCallback((key: TabKey) => {
    setActiveTab(key);
    const pathMap: Record<string, string> = {
      home: '/StudentDashboard',
      applications: '/ApplicationsScreen',
      profile: '/ProfileScreen',
      more: '/MoreScreen',
    };
    if (pathMap[key]) {
      router.replace({ pathname: pathMap[key] as any, params: userData as any });
    }
  }, [router, userData]);

  // filtered المعدلة - آمنة 100%
  const filtered = React.useMemo(() => {
    if (!Array.isArray(allJobs)) return [];
    return allJobs.filter((job) => {
      if (!job) return false;
      const matchesSearch = search === '' || 
        (job.title && job.title.toLowerCase().includes(search.toLowerCase())) ||
        (job.department && job.department.toLowerCase().includes(search.toLowerCase()));
      const matchesDept = selectedDept === 'All' || job.department === selectedDept;
      return matchesSearch && matchesDept;
    });
  }, [allJobs, search, selectedDept]);

  const getMatchColor = useCallback((percentage: number = 0) => {
    if (percentage >= 90) return '#16A34A';
    if (percentage >= 70) return '#F59E0B';
    return '#EF4444';
  }, []);

  const getMatchBgColor = useCallback((percentage: number = 0) => {
    if (percentage >= 90) return '#DCFCE7';
    if (percentage >= 70) return '#FEF3C7';
    return '#FEE2E2';
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={styles.safe}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#1E3A5F" />
          <Text style={styles.loadingText}>Loading jobs...</Text>
        </View>
      </SafeAreaView>
    );
  }

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
              placeholder="Search jobs..."
              placeholderTextColor="#9CA3AF"
              value={search}
              onChangeText={setSearch}
            />
          </View>
        </View>
        
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filtersScroll}>
          <TouchableOpacity
            style={[styles.filterChip, selectedDept === 'All' && styles.filterChipActive]}
            onPress={() => setSelectedDept('All')}
          >
            <Text style={[styles.filterChipText, selectedDept === 'All' && styles.filterChipTextActive]}>All</Text>
          </TouchableOpacity>
          {departments.filter(d => d !== 'All').map((dept) => (
            <TouchableOpacity
              key={dept}
              style={[styles.filterChip, selectedDept === dept && styles.filterChipActive]}
              onPress={() => setSelectedDept(dept)}
            >
              <Text style={[styles.filterChipText, selectedDept === dept && styles.filterChipTextActive]}>{dept}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item?.id || Math.random().toString()}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#1E3A5F']} />}
        renderItem={({ item: job }) => {
          if (!job || !job.id) return null;
          return (
            <View key={job.id}>
              <TouchableOpacity
                style={styles.card}
                onPress={() => {
                  setSelectedJob(job);
                  setDetailVisible(true);
                }}
                activeOpacity={0.85}
              >
                <View style={styles.cardHeader}>
                  <Text style={styles.cardTitle} numberOfLines={2}>{job.title}</Text>
                  <TouchableOpacity onPress={() => handleSaveJob(job.id)} disabled={savingId === job.id} style={styles.saveButton}>
                    {savingId === job.id ? (
                      <ActivityIndicator size="small" color="#1E3A5F" />
                    ) : (
                      <Ionicons name={savedJobs.includes(job.id) ? 'bookmark' : 'bookmark-outline'} size={22} color={savedJobs.includes(job.id) ? '#1E3A5F' : '#9CA3AF'} />
                    )}
                  </TouchableOpacity>
                </View>

                <Text style={styles.cardDept}>{job.department}</Text>

                {job.matchPercentage && (
                  <View style={[styles.matchBadge, { backgroundColor: getMatchBgColor(job.matchPercentage) }]}>
                    <Text style={[styles.matchText, { color: getMatchColor(job.matchPercentage) }]}>{job.matchPercentage}% Match</Text>
                  </View>
                )}

                <View style={styles.detailsRow}>
                  {job.hoursPerWeek && (
                    <View style={styles.detailItem}>
                      <Ionicons name="time-outline" size={14} color="#6B7280" />
                      <Text style={styles.detailText}>{job.hoursPerWeek}</Text>
                    </View>
                  )}
                  {job.salary && (
                    <View style={styles.detailItem}>
                      <Ionicons name="cash-outline" size={14} color="#6B7280" />
                      <Text style={styles.detailText}>{job.salary}</Text>
                    </View>
                  )}
                </View>

                <View style={styles.footerRow}>
                  {job.applicants !== undefined && (
                    <View style={styles.detailItem}>
                      <Ionicons name="people-outline" size={14} color="#9CA3AF" />
                      <Text style={styles.footerText}>{job.applicants} applicants</Text>
                    </View>
                  )}
                  {job.deadline && (
                    <View style={styles.detailItem}>
                      <Ionicons name="calendar-outline" size={14} color="#EF4444" />
                      <Text style={[styles.footerText, { color: '#EF4444' }]}>Deadline: {job.deadline}</Text>
                    </View>
                  )}
                  <TouchableOpacity 
                    style={styles.aiAnalyzeBtn}
                    onPress={() => handleAIAnalyze(job.id, job.title)}
                  >
                    <Ionicons name="sparkles" size={14} color="#D97706" />
                    <Text style={styles.aiAnalyzeText}>AI Match</Text>
                  </TouchableOpacity>
                </View>
              </TouchableOpacity>

              <CommentsSection jobId={job.id} userId={userId} userName={userName} />
            </View>
          );
        }}
        ListEmptyComponent={() => (
          <View style={styles.emptyState}>
            <Ionicons name="briefcase-outline" size={64} color="#D1D5DB" />
            <Text style={styles.emptyTitle}>No jobs available</Text>
            <Text style={styles.emptySubtitle}>Try adjusting your search or filters</Text>
          </View>
        )}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
        initialNumToRender={5}
        maxToRenderPerBatch={5}
        windowSize={5}
      />

      {/* Job Detail Modal */}
      <Modal visible={detailVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContainer, { maxHeight: '85%' }]}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle} numberOfLines={2}>{selectedJob?.title}</Text>
              <TouchableOpacity onPress={() => setDetailVisible(false)}><Ionicons name="close" size={24} color="#6B7280" /></TouchableOpacity>
            </View>
            <ScrollView showsVerticalScrollIndicator={false}>
              <Text style={styles.detailDept}>{selectedJob?.department}</Text>
              
              {selectedJob && (
                <TouchableOpacity 
                  style={styles.modalAiButton}
                  onPress={() => {
                    setDetailVisible(false);
                    handleAIAnalyze(selectedJob.id, selectedJob.title);
                  }}
                >
                  <Ionicons name="sparkles" size={18} color="#D97706" />
                  <Text style={styles.modalAiButtonText}>Analyze my match with AI</Text>
                  <Ionicons name="arrow-forward" size={16} color="#D97706" />
                </TouchableOpacity>
              )}
              
              <View style={styles.detailInfoGrid}>
                {selectedJob?.hoursPerWeek && (
                  <View style={styles.detailInfoItem}>
                    <Ionicons name="time-outline" size={18} color="#1E3A5F" />
                    <Text style={styles.detailInfoLabel}>Hours</Text>
                    <Text style={styles.detailInfoValue}>{selectedJob.hoursPerWeek}</Text>
                  </View>
                )}
                {selectedJob?.salary && (
                  <View style={styles.detailInfoItem}>
                    <Ionicons name="cash-outline" size={18} color="#1E3A5F" />
                    <Text style={styles.detailInfoLabel}>Salary</Text>
                    <Text style={styles.detailInfoValue}>{selectedJob.salary}</Text>
                  </View>
                )}
              </View>
              {selectedJob?.description && <Text style={styles.detailBody}>{selectedJob.description}</Text>}
            </ScrollView>
            <View style={styles.modalActions}>
              <TouchableOpacity style={[styles.saveModalBtn, savedJobs.includes(selectedJob?.id || '') && styles.savedModalBtn]} onPress={() => selectedJob && handleSaveJob(selectedJob.id)}>
                <Ionicons name={savedJobs.includes(selectedJob?.id || '') ? 'bookmark' : 'bookmark-outline'} size={20} color={savedJobs.includes(selectedJob?.id || '') ? '#fff' : '#1E3A5F'} />
                <Text style={[styles.saveModalBtnText, savedJobs.includes(selectedJob?.id || '') && styles.savedModalBtnText]}>{savedJobs.includes(selectedJob?.id || '') ? 'Saved' : 'Save'}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.applyBtn, applying && { opacity: 0.6 }]} onPress={handleApply} disabled={applying}>
                <Text style={styles.applyBtnText}>{applying ? 'Applying...' : 'Apply Now'}</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* AI Match Analysis Modal */}
      <AIMatchAnalysisModal
        visible={aiModalVisible}
        onClose={() => setAiModalVisible(false)}
        jobTitle={aiJobTitle}
        matchData={aiMatchData}
        loading={aiLoading}
      />

      <BottomTabBar active={activeTab} onPress={handleTabPress} />
    </SafeAreaView>
  );
};

export default JobsScreen;

// ─── Styles ──────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F1F5F9' },
  header: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  headerTitle: { fontSize: 26, fontWeight: '800', color: '#1E3A5F', marginBottom: 12 },
  searchRow: { marginBottom: 12 },
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
  filtersScroll: { flexDirection: 'row', marginTop: 4 },
  filterChip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#F1F5F9', marginRight: 8 },
  filterChipActive: { backgroundColor: '#1E3A5F' },
  filterChipText: { fontSize: 13, color: '#6B7280', fontWeight: '500' },
  filterChipTextActive: { color: '#fff' },
  content: { padding: 16, paddingBottom: 80 },
  loadingContainer: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  loadingText: { marginTop: 12, color: '#6B7280', fontSize: 14 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  cardTitle: { fontSize: 16, fontWeight: '700', color: '#111827', flex: 1, marginRight: 12 },
  saveButton: { padding: 4 },
  cardDept: { fontSize: 14, color: '#6B7280', marginTop: 4, marginBottom: 8 },
  matchBadge: { alignSelf: 'flex-start', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, marginBottom: 10 },
  matchText: { fontSize: 12, fontWeight: '600' },
  detailsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 8 },
  detailItem: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  detailText: { fontSize: 12, color: '#6B7280' },
  footerRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, alignItems: 'center', marginTop: 8, paddingTop: 8, borderTopWidth: 1, borderTopColor: '#F3F4F6' },
  footerText: { fontSize: 12, color: '#9CA3AF' },
  aiAnalyzeBtn: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#FEF3C7', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 14 },
  aiAnalyzeText: { fontSize: 11, fontWeight: '600', color: '#D97706' },
  emptyState: { alignItems: 'center', marginTop: 60, paddingHorizontal: 20 },
  emptyTitle: { fontSize: 18, fontWeight: '600', color: '#374151', marginTop: 16 },
  emptySubtitle: { fontSize: 14, color: '#6B7280', marginTop: 8, textAlign: 'center' },
  tabBar: { flexDirection: 'row', backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#E5E7EB', paddingBottom: 8, paddingTop: 10 },
  tabItem: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  tabLabel: { fontSize: 10, color: '#9CA3AF', marginTop: 3 },
  tabLabelActive: { color: '#1E3A5F', fontWeight: '600' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.35)', justifyContent: 'flex-end' },
  modalContainer: { backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24, padding: 20 },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 },
  modalTitle: { fontSize: 18, fontWeight: '700', color: '#111827', flex: 1, marginRight: 10 },
  detailDept: { fontSize: 14, color: '#6B7280', marginBottom: 16 },
  modalAiButton: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#FEF3C7', borderRadius: 12, padding: 12, marginBottom: 16 },
  modalAiButtonText: { fontSize: 13, fontWeight: '600', color: '#D97706' },
  detailInfoGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12, marginBottom: 20, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: '#F3F4F6' },
  detailInfoItem: { flex: 1, minWidth: '45%', backgroundColor: '#F8FAFC', borderRadius: 12, padding: 12, alignItems: 'center' },
  detailInfoLabel: { fontSize: 11, color: '#9CA3AF', marginTop: 4 },
  detailInfoValue: { fontSize: 13, fontWeight: '600', color: '#111827', marginTop: 2 },
  detailBody: { fontSize: 14, color: '#4B5563', lineHeight: 20, marginBottom: 16 },
  modalActions: { flexDirection: 'row', gap: 12, marginTop: 16 },
  saveModalBtn: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, borderWidth: 1.5, borderColor: '#1E3A5F', borderRadius: 14, paddingVertical: 14 },
  savedModalBtn: { backgroundColor: '#1E3A5F' },
  saveModalBtnText: { fontSize: 15, fontWeight: '600', color: '#1E3A5F' },
  savedModalBtnText: { color: '#fff' },
  applyBtn: { flex: 2, backgroundColor: '#1E3A5F', borderRadius: 14, paddingVertical: 14, alignItems: 'center', justifyContent: 'center' },
  applyBtnText: { color: '#fff', fontSize: 15, fontWeight: '700' },
  
  commentsContainer: { backgroundColor: '#fff', borderRadius: 14, padding: 12, marginHorizontal: 16, marginBottom: 16 },
  commentsHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 },
  commentsHeaderLeft: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  commentsTitle: { fontSize: 14, fontWeight: '600', color: '#1E3A5F' },
  showCommentsBtn: { flexDirection: 'row', alignItems: 'center', gap: 6, paddingVertical: 8, paddingHorizontal: 12, marginHorizontal: 16, marginBottom: 16, backgroundColor: '#F8FAFF', borderRadius: 20, alignSelf: 'flex-start' },
  showCommentsText: { fontSize: 13, color: '#1E3A5F', fontWeight: '500' },
  addCommentContainer: { flexDirection: 'row', alignItems: 'flex-end', gap: 8, marginBottom: 16 },
  addCommentInputWrapper: { flex: 1, backgroundColor: '#F8FAFC', borderRadius: 20, borderWidth: 1, borderColor: '#E2E8F0', paddingHorizontal: 12 },
  addCommentInput: { fontSize: 13, color: '#111827', paddingVertical: 10, maxHeight: 80 },
  addCommentBtn: { width: 40, height: 40, borderRadius: 20, backgroundColor: '#1E3A5F', alignItems: 'center', justifyContent: 'center' },
  disabledBtn: { opacity: 0.6 },
  commentsLoading: { alignItems: 'center', justifyContent: 'center', paddingVertical: 20, flexDirection: 'row', gap: 8 },
  commentsLoadingText: { fontSize: 12, color: '#6B7280' },
  noComments: { alignItems: 'center', justifyContent: 'center', paddingVertical: 24 },
  noCommentsText: { fontSize: 14, fontWeight: '500', color: '#9CA3AF', marginTop: 8 },
  noCommentsSubtext: { fontSize: 12, color: '#B0BEC5', marginTop: 4 },
  commentItem: { flexDirection: 'row', gap: 10, paddingVertical: 10 },
  commentSeparator: { height: 1, backgroundColor: '#F3F4F6', marginVertical: 4 },
  commentAvatar: { width: 32, height: 32, borderRadius: 16, backgroundColor: '#1E3A5F', alignItems: 'center', justifyContent: 'center' },
  commentAvatarText: { fontSize: 14, fontWeight: '600', color: '#fff' },
  commentContent: { flex: 1 },
  commentHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 4 },
  commentUserName: { fontSize: 13, fontWeight: '600', color: '#111827' },
  commentTime: { fontSize: 10, color: '#9CA3AF' },
  commentText: { fontSize: 13, color: '#4B5563', lineHeight: 18 },
  
  aiLoadingContainer: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60 },
  aiLoadingText: { fontSize: 16, fontWeight: '600', color: '#1E3A5F', marginTop: 16 },
  aiLoadingSubtext: { fontSize: 13, color: '#6B7280', marginTop: 8 },
  aiMatchCard: { backgroundColor: '#F8FAFC', borderRadius: 16, padding: 20, marginBottom: 16, alignItems: 'center' },
  aiMatchTitle: { fontSize: 14, fontWeight: '600', color: '#6B7280', marginBottom: 16 },
  aiMatchCircleContainer: { alignItems: 'center', marginBottom: 16 },
  aiMatchCircle: { width: 120, height: 120, borderRadius: 60, backgroundColor: '#1E3A5F', alignItems: 'center', justifyContent: 'center' },
  aiMatchPercentage: { fontSize: 32, fontWeight: '800', color: '#fff' },
  aiMatchLabel: { fontSize: 12, color: 'rgba(255,255,255,0.8)', marginTop: 4 },
  aiMatchBarContainer: { width: '100%', height: 8, backgroundColor: '#E5E7EB', borderRadius: 4, overflow: 'hidden' },
  aiMatchBar: { height: 8, borderRadius: 4 },
  aiSectionCard: { backgroundColor: '#fff', borderRadius: 12, padding: 16, marginBottom: 12, borderWidth: 1, borderColor: '#F3F4F6' },
  aiSectionTitle: { fontSize: 16, fontWeight: '700', color: '#1E3A5F', marginBottom: 12 },
  aiSectionText: { fontSize: 14, color: '#4B5563', lineHeight: 20 },
  aiBulletPoint: { flexDirection: 'row', alignItems: 'flex-start', gap: 10, marginBottom: 10 },
  aiBulletText: { flex: 1, fontSize: 14, color: '#4B5563', lineHeight: 20 },
  aiErrorContainer: { alignItems: 'center', justifyContent: 'center', paddingVertical: 60 },
  aiErrorText: { fontSize: 16, fontWeight: '600', color: '#6B7280', marginTop: 16 },
  aiErrorSubtext: { fontSize: 13, color: '#9CA3AF', marginTop: 8 },
  aiCloseBtn: { backgroundColor: '#1E3A5F', borderRadius: 14, paddingVertical: 14, alignItems: 'center', justifyContent: 'center', marginTop: 16 },
  aiCloseBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});