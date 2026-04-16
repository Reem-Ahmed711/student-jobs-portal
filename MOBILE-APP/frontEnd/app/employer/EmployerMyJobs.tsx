// MOBILE-APP/frontEnd/app/employer/EmployerMyJobs.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
  RefreshControl, 
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { getEmployerJobs } from '../../src/api';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';

const API_URL = "http://10.0.2.2:3000";

export default function EmployerMyJobs() {
  const router = useRouter();
  const [jobs, setJobs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

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

  const handleDelete = (jobId: string) => {
    Alert.alert("Delete Job", "Are you sure you want to delete this job?", [
      { text: "Cancel", style: "cancel" },
      { 
        text: "Delete", 
        style: "destructive",
        onPress: async () => {
          try {
            const token = await AsyncStorage.getItem("userToken");
            await axios.delete(`${API_URL}/api/jobs/${jobId}`, {
              headers: { Authorization: `Bearer ${token}` }
            });
            setJobs(jobs.filter(j => j.id !== jobId));
            Alert.alert("Success", "Job deleted");
          } catch (err) {
            Alert.alert("Error", "Failed to delete job");
          }
        }
      }
    ]);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#1E3A5F" />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#1E3A5F" />
      
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>My Posted Jobs</Text>
        <View style={{ width: 24 }} />
      </View>
      
      <ScrollView 
        style={styles.body} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {jobs.length === 0 ? (
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons name="briefcase-outline" size={64} color="#CBD5E1" />
            <Text style={styles.emptyText}>You haven't posted any jobs yet.</Text>
            <TouchableOpacity 
              style={styles.postBtn}
              onPress={() => router.push('/employer/EmployerPostJob')}
              activeOpacity={0.8}
            >
              <Text style={styles.postBtnText}>+ Post Your First Job</Text>
            </TouchableOpacity>
          </View>
        ) : (
          jobs.map(job => (
            <View key={job.id} style={styles.card}>
              <View style={styles.cardHeader}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.title}>{job.title}</Text>
                  <Text style={styles.dept}>{job.department}</Text>
                </View>
                <View style={[styles.statusBadge, { 
                  backgroundColor: job.status === 'active' ? '#DCFCE7' : '#FEE2E2' 
                }]}>
                  <Text style={[styles.statusText, {
                    color: job.status === 'active' ? '#065f46' : '#991b1b'
                  }]}>
                    {job.status || 'active'}
                  </Text>
                </View>
              </View>
              
              <View style={styles.footer}>
                <View style={styles.metaItem}>
                  <Ionicons name="people-outline" size={16} color="#666" />
                  <Text style={styles.metaText}>{job.applicationsCount || 0} Applicants</Text>
                </View>
                
                <View style={styles.actions}>
                  <TouchableOpacity 
                    style={styles.viewBtn} 
                    onPress={() => router.push({ 
                      pathname: '/employer/EmployerViewApps', 
                      params: { jobId: job.id, jobTitle: job.title } 
                    })}
                    activeOpacity={0.8}
                  >
                    <Text style={styles.viewTxt}>View Apps</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    style={styles.delBtn} 
                    onPress={() => handleDelete(job.id)}
                    activeOpacity={0.8}
                  >
                    <MaterialCommunityIcons name="delete-outline" size={20} color="#ef4444" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))
        )}
        <View style={{ height: 30 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F1F5F9' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#F1F5F9' },
  header: { 
    backgroundColor: '#1E3A5F', 
    padding: 16, 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center' 
  },
  backBtn: {
    padding: 4,
  },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: '700' },
  body: { padding: 16 },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 60,
  },
  emptyText: { 
    textAlign: 'center', 
    color: '#94A3B8', 
    marginTop: 16, 
    fontSize: 15,
    marginBottom: 20,
  },
  postBtn: {
    backgroundColor: '#1E3A5F',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    marginTop: 10,
  },
  postBtnText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
  card: { 
    backgroundColor: '#fff', 
    padding: 16, 
    borderRadius: 14, 
    marginBottom: 15, 
    shadowColor: '#000', 
    shadowOpacity: 0.04, 
    elevation: 2 
  },
  cardHeader: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  title: { fontSize: 16, fontWeight: '700', color: '#1E3A5F', marginBottom: 4 },
  dept: { fontSize: 13, color: '#666' },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    fontSize: 11,
    fontWeight: '600',
  },
  footer: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginTop: 15, 
    paddingTop: 12, 
    borderTopWidth: 1, 
    borderColor: '#F3F4F6' 
  },
  metaItem: { flexDirection: 'row', alignItems: 'center', gap: 5 },
  metaText: { fontSize: 13, color: '#666' },
  actions: { flexDirection: 'row', gap: 10 },
  viewBtn: { 
    backgroundColor: '#1E3A5F', 
    paddingHorizontal: 14, 
    paddingVertical: 8, 
    borderRadius: 8 
  },
  viewTxt: { color: '#fff', fontSize: 12, fontWeight: '600' },
  delBtn: { padding: 8 }
});