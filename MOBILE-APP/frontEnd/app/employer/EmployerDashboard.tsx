// MOBILE-APP/frontEnd/app/employer/EmployerDashboard.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getEmployerDashboard } from '../../src/api';
import { useFocusEffect } from 'expo-router';
import { useCallback } from 'react';
export default function EmployerDashboard() {
  const router = useRouter();
  const [stats, setStats] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("Employer");
  

useFocusEffect(
  useCallback(() => {
    const loadData = async () => {
      try {
        setLoading(true); // ✅ أهم سطر

        const stored = await AsyncStorage.getItem("userData");
        if (stored) {
          const parsed = JSON.parse(stored);
          setUserName(parsed.name || "Employer");
        }

        const data = await getEmployerDashboard();
        console.log("Dashboard Data:", data);
        if (data.success) {
          setStats(data.data);
        }
      } catch (err) {
        console.log('Error loading dashboard:', err);
      } finally {
        setLoading(false); // ✅ يوقف اللود
      }
    };

    loadData();
  }, [])
);
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
        <View>
          <Text style={styles.greeting}>Welcome Back,</Text>
          <Text style={styles.headerName}>{userName}</Text>
        </View>
        <TouchableOpacity 
          style={styles.profileBtn} 
          onPress={() => router.push('/employer/EmployerProfile')}
          activeOpacity={0.8}
        >
          <Ionicons name="business" size={26} color="#fff" />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        <View style={styles.statsGrid}>
          <View style={styles.statCard}>
            <View style={[styles.iconBox, { backgroundColor: '#EFF6FF' }]}>
              <MaterialCommunityIcons name="briefcase-outline" size={22} color="#2563EB" />
            </View>
            <Text style={styles.statNumber}>{stats?.stats?.totalJobs || 0}</Text>
            <Text style={styles.statLabel}>Posted Jobs</Text>
          </View>
          
          <View style={styles.statCard}>
            <View style={[styles.iconBox, { backgroundColor: '#F0FDF4' }]}>
              <Ionicons name="document-text-outline" size={22} color="#16A34A" />
            </View>
            <Text style={styles.statNumber}>{stats?.stats?.totalApplications || 0}</Text>
            <Text style={styles.statLabel}>Applications</Text>
          </View>
          
          <View style={styles.statCard}>
            <View style={[styles.iconBox, { backgroundColor: '#FEF3C7' }]}>
              <Feather name="clock" size={22} color="#D97706" />
            </View>
            <Text style={styles.statNumber}>{stats?.stats?.pendingApplications || 0}</Text>
            <Text style={styles.statLabel}>Pending</Text>
          </View>
        </View>

        <View style={styles.actionsContainer}>
          <TouchableOpacity 
            style={styles.actionBtn} 
            onPress={() => router.push('/employer/EmployerPostJob')}
            activeOpacity={0.8}
          >
            <MaterialCommunityIcons name="plus-circle" size={22} color="#fff" />
            <Text style={styles.actionText}>Post New Job</Text>
          </TouchableOpacity>
          
          <TouchableOpacity 
            style={[styles.actionBtn, styles.actionBtnOutline]} 
            onPress={() => router.push('/employer/EmployerMyJobs')}
            activeOpacity={0.8}
          >
            <Ionicons name="list-outline" size={22} color="#1E3A5F" />
            <Text style={[styles.actionText, styles.actionTextOutline]}>My Jobs</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Recent Applications</Text>
          {stats?.recentApplications?.length > 0 ? (
            stats.recentApplications.slice(0, 5).map((app: any, i: number) => (
              <View key={i} style={styles.appCard}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.appName}>{app.studentName || 'Unknown Student'}</Text>
                  <Text style={styles.appJob}>{app.jobTitle}</Text>
                </View>
                <View style={[
                  styles.badge, 
                  { 
                    backgroundColor: app.status === 'pending' ? '#FEF3C7' : 
                                   app.status === 'accepted' ? '#DCFCE7' : '#FEE2E2' 
                  }
                ]}>
                  <Text style={[
                    styles.badgeText, 
                    { 
                      color: app.status === 'pending' ? '#92400e' : 
                             app.status === 'accepted' ? '#065f46' : '#991b1b' 
                    }
                  ]}>
                    {app.status}
                  </Text>
                </View>
              </View>
            ))
          ) : (
            <Text style={styles.emptyText}>No applications yet.</Text>
          )}
        </View>
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
    padding: 20, 
    paddingBottom: 45, 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'flex-start' 
  },
  greeting: { color: 'rgba(255,255,255,0.8)', fontSize: 14 },
  headerName: { color: '#fff', fontSize: 24, fontWeight: '800', marginTop: 4 },
  profileBtn: { 
    backgroundColor: 'rgba(255,255,255,0.2)', 
    padding: 10, 
    borderRadius: 50 
  },
  scroll: { 
    flex: 1, 
    backgroundColor: '#F1F5F9', 
    borderTopLeftRadius: 25, 
    borderTopRightRadius: 25, 
    marginTop: -25, 
    padding: 20 
  },
  statsGrid: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 25 },
  statCard: { 
    backgroundColor: '#fff', 
    width: '31%', 
    padding: 15, 
    borderRadius: 14, 
    alignItems: 'center', 
    shadowColor: '#000', 
    shadowOpacity: 0.05, 
    elevation: 2 
  },
  iconBox: { width: 42, height: 42, borderRadius: 12, justifyContent: 'center', alignItems: 'center', marginBottom: 10 },
  statNumber: { fontSize: 22, fontWeight: '800', color: '#1E3A5F' },
  statLabel: { fontSize: 11, color: '#666', marginTop: 4, textAlign: 'center' },
  actionsContainer: { flexDirection: 'row', gap: 15, marginBottom: 30 },
  actionBtn: { 
    flex: 1, 
    backgroundColor: '#1E3A5F', 
    padding: 15, 
    borderRadius: 14, 
    flexDirection: 'row', 
    justifyContent: 'center', 
    alignItems: 'center', 
    gap: 10, 
    elevation: 3 
  },
  actionBtnOutline: {
    backgroundColor: '#fff',
    borderWidth: 1.5,
    borderColor: '#1E3A5F',
  },
  actionText: { color: '#fff', fontWeight: '700', fontSize: 14 },
  actionTextOutline: { color: '#1E3A5F' },
  section: { marginBottom: 20 },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#333', marginBottom: 15 },
  appCard: { 
    backgroundColor: '#fff', 
    padding: 15, 
    borderRadius: 12, 
    marginBottom: 10, 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    shadowColor: '#000', 
    shadowOpacity: 0.03, 
    elevation: 1 
  },
  appName: { fontSize: 14, fontWeight: '600', color: '#333' },
  appJob: { fontSize: 12, color: '#666', marginTop: 2 },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 20 },
  badgeText: { fontSize: 11, fontWeight: 'bold' },
  emptyText: { color: '#999', textAlign: 'center', marginTop: 20, fontSize: 14 }
});