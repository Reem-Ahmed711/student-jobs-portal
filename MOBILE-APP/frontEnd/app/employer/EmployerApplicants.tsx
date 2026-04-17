// MOBILE-APP/frontEnd/app/employer/EmployerApplicants.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { getEmployerJobs, getJobApplicants } from '../../src/api';

interface Applicant {
  id: string;
  studentUid: string;
  studentName: string;
  studentEmail: string;
  status: string;
  appliedAt: any;
}

interface Job {
  id: string;
  title: string;
  department: string;
  status: string;
  applicantsCount: number;
}

const EmployerApplicants = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [expandedJob, setExpandedJob] = useState<string | null>(null);
  const [applicants, setApplicants] = useState<Record<string, Applicant[]>>({});
  const [loadingApplicants, setLoadingApplicants] = useState<Record<string, boolean>>({});

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const res = await getEmployerJobs();
      if (res.success && res.data) {
        setJobs(res.data);
      }
    } catch (error) {
      console.log('Error fetching jobs:', error);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchJobs();
  };

  const fetchApplicants = async (jobId: string) => {
  console.log("🔍 Fetching applicants for job:", jobId);
  
  setLoadingApplicants(prev => ({ ...prev, [jobId]: true }));
  try {
    const res = await getJobApplicants(jobId);
    console.log("📦 API Response:", JSON.stringify(res));
    
    if (res.success && res.data) {
      console.log("✅ Found applicants:", res.data.length);
      setApplicants(prev => ({ ...prev, [jobId]: res.data }));
    } else {
      console.log("❌ No data or failed");
    }
  } catch (error) {
    console.log("🔥 Error:", error);
  } finally {
    setLoadingApplicants(prev => ({ ...prev, [jobId]: false }));
  }
};

  const toggleJob = (jobId: string) => {
    if (expandedJob === jobId) {
      setExpandedJob(null);
    } else {
      setExpandedJob(jobId);
      fetchApplicants(jobId);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'accepted': return '#16A34A';
      case 'rejected': return '#DC2626';
      case 'pending': return '#D97706';
      default: return '#1E3A5F';
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.center}>
        <ActivityIndicator size="large" color="#1E3A5F" />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={jobs}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <TouchableOpacity onPress={() => toggleJob(item.id)} activeOpacity={0.7}>
              <View style={styles.cardHeader}>
                <Text style={styles.jobTitle}>{item.title}</Text>
                <View style={[styles.statusBadge, { backgroundColor: '#EFF6FF' }]}>
                  <Text style={styles.statusText}>{item.status || 'Active'}</Text>
                </View>
              </View>
              <Text style={styles.departmentText}>{item.department}</Text>
              <View style={styles.applicantsRow}>
                <Ionicons name="people-outline" size={16} color="#1E3A5F" />
                <Text style={styles.applicantsCount}>
                  {applicants[item.id]?.length || item.applicantsCount || 0} applicants
                </Text>
                <Ionicons 
                  name={expandedJob === item.id ? "chevron-up" : "chevron-down"} 
                  size={18} 
                  color="#9CA3AF" 
                  style={{ marginLeft: 'auto' }}
                />
              </View>
            </TouchableOpacity>

            {expandedJob === item.id && (
              <View style={styles.applicantsList}>
                <Text style={styles.sectionTitle}>Applicants</Text>
                {loadingApplicants[item.id] ? (
                  <ActivityIndicator size="small" color="#1E3A5F" style={{ marginTop: 10 }} />
                ) : applicants[item.id]?.length === 0 ? (
                  <Text style={styles.emptyText}>No applicants yet</Text>
                ) : (
                  applicants[item.id]?.map((applicant) => (
                    <View key={applicant.id} style={styles.applicantCard}>
                      <View style={styles.applicantInfo}>
                        <View style={styles.applicantAvatar}>
                          <Text style={styles.avatarText}>
                            {applicant.studentName?.charAt(0) || 'S'}
                          </Text>
                        </View>
                        <View>
                          <Text style={styles.applicantName}>{applicant.studentName || 'Student'}</Text>
                          <Text style={styles.applicantEmail}>{applicant.studentEmail || ''}</Text>
                        </View>
                      </View>
                      <View style={[styles.statusBadgeSmall, { backgroundColor: '#F0FDF4' }]}>
                        <Text style={[styles.statusTextSmall, { color: getStatusColor(applicant.status) }]}>
                          {applicant.status || 'Pending'}
                        </Text>
                      </View>
                    </View>
                  ))
                )}
              </View>
            )}
          </View>
        )}
        ListHeaderComponent={() => (
          <View style={styles.header}>
            <Text style={styles.title}>My Job Postings</Text>
            <Text style={styles.subtitle}>Tap on a job to see applicants</Text>
          </View>
        )}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={() => (
          <View style={styles.emptyState}>
            <Ionicons name="briefcase-outline" size={48} color="#D1D5DB" />
            <Text style={styles.emptyTitle}>No jobs posted yet</Text>
            <Text style={styles.emptySubtitle}>Create your first job posting</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F5F9',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
  },
  header: {
    padding: 20,
    paddingTop: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1E3A5F',
  },
  subtitle: {
    color: '#6B7280',
    marginTop: 4,
    fontSize: 14,
  },
  listContent: {
    paddingBottom: 30,
  },
  card: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginBottom: 12,
    borderRadius: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  jobTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    flex: 1,
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
    color: '#1E3A5F',
  },
  departmentText: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 10,
  },
  applicantsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  applicantsCount: {
    fontSize: 13,
    color: '#1E3A5F',
    fontWeight: '500',
  },
  applicantsList: {
    marginTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#F3F4F6',
    paddingTop: 12,
  },
  sectionTitle: {
    fontSize: 13,
    fontWeight: '700',
    color: '#1E3A5F',
    marginBottom: 10,
  },
  applicantCard: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  applicantInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  applicantAvatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E3A5F',
  },
  applicantName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },
  applicantEmail: {
    fontSize: 11,
    color: '#9CA3AF',
  },
  statusBadgeSmall: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusTextSmall: {
    fontSize: 10,
    fontWeight: '600',
  },
  emptyState: {
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
  emptyText: {
    textAlign: 'center',
    color: '#9CA3AF',
    paddingVertical: 20,
  },
});

export default EmployerApplicants;