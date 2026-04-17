import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  RefreshControl,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

// Use the same API_URL as in api.js
const API_URL = "http://192.168.1.8:3000";

interface Job {
  id: string;
  title: string;
  department: string;
  status: string;
  applicationsCount?: number;
  employer?: { name: string; company: string };
  createdAt?: any;
  salary?: string;
  description?: string;
}

const AdminManageJobs: React.FC = () => {
  const router = useRouter();
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [statusModal, setStatusModal] = useState(false);
  const [selectedJobId, setSelectedJobId] = useState('');

  const fetchJobs = async () => {
    try {
      setLoading(true);
      const token = await AsyncStorage.getItem('userToken');
      
      console.log('Fetching jobs with token:', token ? 'Token exists' : 'No token');
      
      const response = await axios.get(`${API_URL}/api/admin/jobs`, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      console.log('Jobs response status:', response.status);
      console.log('Jobs response data:', JSON.stringify(response.data, null, 2));
      
      if (response.data.success && response.data.data) {
        setJobs(response.data.data);
      } else {
        console.log('No jobs data in response');
        setJobs([]);
      }
    } catch (err: any) {
      console.log('Failed to fetch jobs - Error:', err.message);
      console.log('Error response:', err.response?.data);
      Alert.alert('Error', `Failed to load jobs: ${err.message}`);
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

  const handleDelete = async (jobId: string) => {
    Alert.alert('Delete Job', 'Are you sure you want to delete this job?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            const token = await AsyncStorage.getItem('userToken');
            const response = await axios.delete(`${API_URL}/api/admin/jobs/${jobId}`, {
              headers: { Authorization: `Bearer ${token}` },
            });
            
            if (response.data.success) {
              setJobs(jobs.filter((j) => j.id !== jobId));
              Alert.alert('Success', 'Job deleted successfully');
            } else {
              Alert.alert('Error', response.data.message || 'Failed to delete');
            }
          } catch (err: any) {
            console.log('Delete error:', err.message);
            Alert.alert('Error', err.message || 'Failed to delete job');
          }
        },
      },
    ]);
  };

  const openStatusModal = (jobId: string) => {
    setSelectedJobId(jobId);
    setStatusModal(true);
  };

  const handleStatusChange = async (newStatus: string) => {
    setStatusModal(false);
    try {
      const token = await AsyncStorage.getItem('userToken');
      const response = await axios.patch(
        `${API_URL}/api/admin/jobs/${selectedJobId}/status`,
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      
      if (response.data.success) {
        setJobs(jobs.map((j) => (j.id === selectedJobId ? { ...j, status: newStatus } : j)));
        Alert.alert('Success', `Job status updated to ${newStatus}`);
      } else {
        Alert.alert('Error', response.data.message || 'Failed to update status');
      }
    } catch (err: any) {
      console.log('Status update error:', err.message);
      Alert.alert('Error', err.message || 'Failed to update status');
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'active': return { bg: '#DCFCE7', text: '#065F46' };
      case 'closed': return { bg: '#FEE2E2', text: '#991B1B' };
      case 'paused': return { bg: '#FEF3C7', text: '#92400E' };
      case 'rejected': return { bg: '#F1F5F9', text: '#475569' };
      default: return { bg: '#F1F5F9', text: '#475569' };
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Manage Jobs</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <Text style={styles.subtitle}>{jobs.length} total jobs</Text>

        {loading ? (
          <ActivityIndicator style={{ marginTop: 50 }} size="large" color="#1E3A5F" />
        ) : jobs.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>💼</Text>
            <Text style={styles.emptyText}>No jobs found</Text>
          </View>
        ) : (
          jobs.map((job) => {
            const statusStyle = getStatusStyle(job.status || 'active');
            return (
              <View key={job.id} style={styles.card}>
                <View style={styles.cardHeader}>
                  <View style={styles.cardHeaderLeft}>
                    <Text style={styles.jobTitle}>{job.title}</Text>
                    <Text style={styles.jobDept}>{job.department || 'No department'}</Text>
                    {job.salary && (
                      <Text style={styles.jobSalary}>💰 {job.salary}</Text>
                    )}
                  </View>
                  <View style={[styles.badge, { backgroundColor: statusStyle.bg }]}>
                    <Text style={[styles.badgeText, { color: statusStyle.text }]}>
                      {(job.status || 'active').toUpperCase()}
                    </Text>
                  </View>
                </View>

                {job.description && (
                  <Text style={styles.jobDescription} numberOfLines={2}>
                    {job.description}
                  </Text>
                )}

                <View style={styles.metaRow}>
                  <View style={styles.metaItem}>
                    <Text style={styles.metaLabel}>Applicants</Text>
                    <Text style={styles.metaValue}>{job.applicationsCount || 0}</Text>
                  </View>
                </View>

                <View style={styles.cardActions}>
                  <TouchableOpacity style={styles.btnStatus} onPress={() => openStatusModal(job.id)}>
                    <MaterialIcons name="sync" size={16} color="#fff" />
                    <Text style={styles.btnStatusText}>Change Status</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.btnDelete} onPress={() => handleDelete(job.id)}>
                    <MaterialIcons name="delete-outline" size={16} color="#ef4444" />
                    <Text style={styles.btnDeleteText}>Delete</Text>
                  </TouchableOpacity>
                </View>
              </View>
            );
          })
        )}

        <View style={{ height: 30 }} />
      </ScrollView>

      <Modal visible={statusModal} transparent animationType="fade">
        <TouchableOpacity style={styles.modalOverlay} activeOpacity={1} onPress={() => setStatusModal(false)}>
          <View style={styles.modalContainer}>
            <Text style={styles.modalTitle}>Change Job Status</Text>
            {['active', 'paused', 'closed', 'rejected'].map((status) => {
              const sStyle = getStatusStyle(status);
              return (
                <TouchableOpacity
                  key={status}
                  style={[styles.modalOption, { backgroundColor: sStyle.bg }]}
                  onPress={() => handleStatusChange(status)}
                >
                  <Text style={[styles.modalOptionText, { color: sStyle.text }]}>{status.toUpperCase()}</Text>
                </TouchableOpacity>
              );
            })}
            <TouchableOpacity style={styles.modalCancel} onPress={() => setStatusModal(false)}>
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f8fafc' },
  header: { backgroundColor: '#1E3A5F', padding: 15, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  backBtn: { padding: 4 },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: '700' },
  subtitle: { fontSize: 13, color: '#999', marginBottom: 20, paddingHorizontal: 16, paddingTop: 16 },
  card: { backgroundColor: '#fff', borderRadius: 14, padding: 16, marginBottom: 14, marginHorizontal: 16, shadowColor: '#000', shadowOpacity: 0.06, shadowRadius: 6, elevation: 2 },
  cardHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 },
  cardHeaderLeft: { flex: 1, marginRight: 8 },
  jobTitle: { fontSize: 16, fontWeight: '700', color: '#1E3A5F', marginBottom: 4 },
  jobDept: { fontSize: 13, color: '#666', marginBottom: 2 },
  jobSalary: { fontSize: 12, color: '#10b981', fontWeight: '600' },
  jobDescription: { fontSize: 13, color: '#666', marginBottom: 10, lineHeight: 18 },
  badge: { borderRadius: 20, paddingHorizontal: 10, paddingVertical: 4, alignSelf: 'flex-start' },
  badgeText: { fontSize: 11, fontWeight: '700', letterSpacing: 0.5 },
  metaRow: { flexDirection: 'row', gap: 20, marginBottom: 14, paddingTop: 10, borderTopWidth: 1, borderTopColor: '#f0f0f0' },
  metaItem: {},
  metaLabel: { fontSize: 11, color: '#999', marginBottom: 2 },
  metaValue: { fontSize: 13, fontWeight: '600', color: '#333' },
  cardActions: { flexDirection: 'row', gap: 10 },
  btnStatus: { flex: 1, backgroundColor: '#1E3A5F', borderRadius: 8, paddingVertical: 9, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6 },
  btnStatusText: { color: '#fff', fontWeight: '600', fontSize: 13 },
  btnDelete: { flex: 1, borderWidth: 1, borderColor: '#ef4444', borderRadius: 8, paddingVertical: 9, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 6 },
  btnDeleteText: { color: '#ef4444', fontWeight: '600', fontSize: 13 },
  emptyState: { alignItems: 'center', marginTop: 60 },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyText: { fontSize: 16, color: '#999' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center' },
  modalContainer: { backgroundColor: '#fff', width: '80%', borderRadius: 16, padding: 20 },
  modalTitle: { fontSize: 18, fontWeight: '700', color: '#333', marginBottom: 16, textAlign: 'center' },
  modalOption: { paddingVertical: 14, borderRadius: 10, marginBottom: 8, alignItems: 'center' },
  modalOptionText: { fontSize: 15, fontWeight: '700' },
  modalCancel: { paddingVertical: 14, borderRadius: 10, borderWidth: 1, borderColor: '#E2E8F0', marginTop: 4, alignItems: 'center' },
  modalCancelText: { color: '#666', fontWeight: '600' },
});

export default AdminManageJobs;