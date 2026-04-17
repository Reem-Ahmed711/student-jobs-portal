// MOBILE-APP/frontEnd/app/employer/EmployerMyJobs.tsx

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
  Alert
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { getEmployerJobs, deleteJob } from '../../src/api'; // ✅ استخدمي deleteJob من api.js
import AsyncStorage from '@react-native-async-storage/async-storage';

const EmployerMyJobs = () => {
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [filter, setFilter] = useState('all');

  const router = useRouter();

  const fetchJobs = async () => {
    try {
      const res = await getEmployerJobs();
      if (res.success) {
        setJobs(res.data || []);
      } else {
        setJobs([]);
      }
    } catch (err) {
      console.log('Fetch jobs error:', err);
      setJobs([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchJobs();
  };

  // ✅ دالة الحذف باستخدام الـ API الموجودة
  const handleDelete = (jobId: string) => {
    Alert.alert("Delete Job", "Are you sure you want to delete this job?", [
      { text: "Cancel", style: "cancel" },
      { 
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            const res = await deleteJob(jobId); // ✅ استخدام الدالة الموجودة
            if (res.success) {
              Alert.alert("Success", "Job deleted successfully");
              fetchJobs(); // ✅ إعادة تحميل القائمة
            } else {
              Alert.alert("Error", res.message || "Failed to delete");
            }
          } catch (err) {
            Alert.alert("Error", "Failed to delete job");
          }
        }
      }
    ]);
  };

  // فلترة
  const filteredJobs = jobs.filter(job => {
    if (filter === 'all') return true;
    return job.status?.toLowerCase() === filter;
  });

  const renderJobCard = ({ item }: any) => {
    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={{ flex: 1 }}>
            <Text style={styles.jobTitle}>{item.title}</Text>
            <Text style={styles.departmentText}>{item.department}</Text>

            <View style={styles.infoRow}>
              <View style={styles.iconText}>
                <Ionicons name="people-outline" size={14} color="#999" />
                <Text style={styles.infoText}>
                  {item.applicantsCount || 0} Applicants
                </Text>
              </View>
            </View>
          </View>

          <View style={styles.statsContainer}>
            <View style={styles.applicantsBadge}>
              <Text style={styles.applicantsCount}>
                {item.applicantsCount || 0}
              </Text>
              <Text style={styles.applicantsLabel}>apps</Text>
            </View>
          </View>
        </View>

        {/* Progress */}
        <View style={styles.progressContainer}>
          <View 
            style={[
              styles.progressFill, 
              { width: `${Math.min(((item.applicantsCount || 0) / 40) * 100, 100)}%` }
            ]} 
          />
        </View>

        {/* Actions */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity 
            style={styles.outlineButton}
            onPress={() => handleDelete(item.id)}
          >
            <MaterialCommunityIcons name="delete-outline" size={16} color="#ef4444" />
            <Text style={styles.outlineButtonText}>Delete</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.primaryButton}
            onPress={() => router.push({ 
              pathname: '/employer/EmployerViewApps', 
              params: { jobId: item.id, jobTitle: item.title } 
            })}
          >
            <Ionicons name="people" size={16} color="#FFF" />
            <Text style={styles.primaryButtonText}>Applicants</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#0B2A4A" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={filteredJobs}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderJobCard}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListHeaderComponent={() => (
          <View style={styles.header}>
            <Text style={styles.title}>My Job Postings</Text>
            <Text style={styles.subtitle}>Manage your jobs</Text>

            <TouchableOpacity 
              style={styles.postButton}
              onPress={() => router.push('/employer/EmployerPostJob')}
            >
              <Ionicons name="add" size={24} color="#FFF" />
              <Text style={styles.postButtonText}>New Job</Text>
            </TouchableOpacity>

            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {['all', 'active', 'closed'].map((s) => (
                <TouchableOpacity 
                  key={s}
                  onPress={() => setFilter(s)}
                  style={[
                    styles.filterTab,
                    filter === s && styles.filterTabActive
                  ]}
                >
                  <Text style={[
                    styles.filterText,
                    filter === s && styles.filterTextActive
                  ]}>
                    {s}
                  </Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}
        ListEmptyComponent={() => (
          <View style={{ alignItems: 'center', marginTop: 50 }}>
            <Text>No jobs found</Text>
          </View>
        )}
      />
    </View>
  );
};

export default EmployerMyJobs;

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },

  header: { padding: 20, paddingTop: 40 },
  title: { fontSize: 24, fontWeight: '700', color: '#0B2A4A' },
  subtitle: { color: '#666', marginTop: 4 },

  postButton: {
    backgroundColor: '#0B2A4A',
    flexDirection: 'row',
    padding: 12,
    borderRadius: 10,
    marginTop: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  postButtonText: { color: '#FFF', marginLeft: 8 },

  filterTab: {
    padding: 10,
    borderRadius: 20,
    backgroundColor: '#FFF',
    marginRight: 10,
    marginTop: 15
  },
  filterTabActive: { backgroundColor: '#0B2A4A' },
  filterText: { color: '#666' },
  filterTextActive: { color: '#FFF' },

  card: {
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    marginBottom: 15,
    borderRadius: 15,
    padding: 16,
    elevation: 3,
  },

  cardHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  jobTitle: { fontSize: 18, fontWeight: '700', color: '#0B2A4A' },
  departmentText: { color: '#666', marginVertical: 4 },

  infoRow: { flexDirection: 'row', marginTop: 8 },
  iconText: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  infoText: { color: '#999', fontSize: 12 },

  statsContainer: { alignItems: 'flex-end' },
  applicantsBadge: {
    backgroundColor: '#E6F0FA',
    padding: 8,
    borderRadius: 10,
    alignItems: 'center'
  },
  applicantsCount: { fontSize: 18, fontWeight: '800', color: '#0B2A4A' },
  applicantsLabel: { fontSize: 10, color: '#666' },

  progressContainer: {
    height: 6,
    backgroundColor: '#F1F5F9',
    borderRadius: 3,
    marginVertical: 15,
    overflow: 'hidden',
  },
  progressFill: { height: '100%', backgroundColor: '#3B82F6' },

  actionsContainer: { flexDirection: 'row', justifyContent: 'flex-end', gap: 10 },

  outlineButton: {
    flexDirection: 'row',
    padding: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    alignItems: 'center',
    gap: 5
  },
  outlineButtonText: { color: '#0B2A4A' },

  primaryButton: {
    flexDirection: 'row',
    padding: 8,
    borderRadius: 8,
    backgroundColor: '#0B2A4A',
    alignItems: 'center',
    gap: 5
  },
  primaryButtonText: { color: '#FFF' },
});