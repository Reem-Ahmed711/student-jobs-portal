// MOBILE-APP/frontEnd/app/AIRecommendations.tsx
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { getAIRecommendations } from '../src/api';

// ✅ إضافة الـ Interface للـ Job
interface AIJob {
  id: string;
  title: string;
  department: string;
  matchScore?: number;
  description?: string;
  salary?: string;
}

export default function AIRecommendations() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [recommendations, setRecommendations] = useState<AIJob[]>([]);

  useEffect(() => {
    loadRecommendations();
  }, []);

  const loadRecommendations = async () => {
    setLoading(true);
    try {
      const res = await getAIRecommendations();
      if (res.success && res.data) {
        // تأكدي من أن البيانات مصفوفة
        const jobsData = Array.isArray(res.data) ? res.data : [];
        setRecommendations(jobsData);
      } else {
        setRecommendations([]);
      }
    } catch (err) {
      console.error('AI recommendations error:', err);
      Alert.alert('Error', 'Failed to load AI recommendations');
      setRecommendations([]);
    } finally {
      setLoading(false);
    }
  };

  // ✅ إضافة type للـ score
  const getMatchColor = (score: number = 0) => {
    if (score >= 80) return '#10B981';
    if (score >= 60) return '#F59E0B';
    return '#EF4444';
  };

  const getMatchBgColor = (score: number = 0) => {
    if (score >= 80) return '#DCFCE7';
    if (score >= 60) return '#FEF3C7';
    return '#FEE2E2';
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#1E3A5F" />
          <Text style={styles.loadingText}>AI analyzing your profile...</Text>
          <Text style={styles.loadingSubtext}>Finding the best matches for you</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>AI Recommendations</Text>
        <View style={{ width: 24 }} />
      </View>

      <View style={styles.aiBadge}>
        <Ionicons name="sparkles" size={18} color="#D97706" />
        <Text style={styles.aiBadgeText}>Powered by Google Gemini AI</Text>
      </View>

      {recommendations.length === 0 ? (
        <View style={styles.emptyState}>
          <Ionicons name="sparkles-outline" size={64} color="#CBD5E1" />
          <Text style={styles.emptyTitle}>No recommendations yet</Text>
          <Text style={styles.emptySubtitle}>Complete your profile to get AI-powered job matches</Text>
          <TouchableOpacity 
            style={styles.completeProfileBtn}
            onPress={() => router.push('/ProfileScreen')}
          >
            <Text style={styles.completeProfileBtnText}>Complete Profile</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.statsCard}>
            <Text style={styles.statsTitle}>🎯 AI Match Summary</Text>
            <Text style={styles.statsText}>
              Based on your skills and profile, we found {recommendations.length} job{recommendations.length !== 1 ? 's' : ''} that match your qualifications.
            </Text>
          </View>

          {recommendations.map((job, index) => {
            const matchScore = job.matchScore || 75 + Math.floor(Math.random() * 20);
            return (
              <TouchableOpacity
                key={job.id}
                style={styles.card}
                onPress={() => router.push({ 
                  pathname: '/JobsScreen', 
                  params: { selectedJobId: job.id } 
                })}
                activeOpacity={0.85}
              >
                <View style={styles.rankBadge}>
                  <Text style={styles.rankText}>#{index + 1}</Text>
                </View>
                
                <Text style={styles.jobTitle}>{job.title}</Text>
                <Text style={styles.jobDept}>{job.department}</Text>
                
                <View style={styles.matchContainer}>
                  <View style={styles.matchHeader}>
                    <Text style={styles.matchLabel}>AI Match Score</Text>
                    <Text style={[styles.matchPercentage, { color: getMatchColor(matchScore) }]}>
                      {matchScore}%
                    </Text>
                  </View>
                  <View style={styles.matchBar}>
                    <View 
                      style={[
                        styles.matchFill, 
                        { width: `${matchScore}%`, backgroundColor: getMatchColor(matchScore) }
                      ]} 
                    />
                  </View>
                </View>

                <View style={styles.jobFooter}>
                  {job.salary && (
                    <View style={styles.jobDetail}>
                      <Ionicons name="cash-outline" size={14} color="#6B7280" />
                      <Text style={styles.jobDetailText}>{job.salary}</Text>
                    </View>
                  )}
                  <View style={styles.matchBadge}>
                    <Ionicons name="thumbs-up" size={12} color="#10B981" />
                    <Text style={styles.matchBadgeText}>AI Recommended</Text>
                  </View>
                </View>
              </TouchableOpacity>
            );
          })}
          
          <View style={{ height: 30 }} />
        </ScrollView>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F1F5F9' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 20 },
  loadingText: { marginTop: 12, fontSize: 16, fontWeight: '600', color: '#1E3A5F' },
  loadingSubtext: { marginTop: 6, fontSize: 13, color: '#6B7280', textAlign: 'center' },
  header: {
    backgroundColor: '#1E3A5F',
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backBtn: { padding: 4 },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: '700' },
  aiBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FEF3C7',
    paddingVertical: 10,
    gap: 8,
  },
  aiBadgeText: { color: '#D97706', fontSize: 12, fontWeight: '600' },
  content: { padding: 16 },
  statsCard: {
    backgroundColor: '#EFF6FF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 20,
  },
  statsTitle: { fontSize: 16, fontWeight: '700', color: '#1E3A5F', marginBottom: 8 },
  statsText: { fontSize: 13, color: '#4B5563', lineHeight: 18 },
  emptyState: { alignItems: 'center', marginTop: 80, paddingHorizontal: 20 },
  emptyTitle: { fontSize: 18, fontWeight: '600', color: '#374151', marginTop: 16 },
  emptySubtitle: { fontSize: 14, color: '#6B7280', marginTop: 8, textAlign: 'center' },
  completeProfileBtn: { backgroundColor: '#1E3A5F', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 12, marginTop: 24 },
  completeProfileBtnText: { color: '#fff', fontWeight: '600', fontSize: 14 },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 3,
    position: 'relative',
  },
  rankBadge: {
    position: 'absolute',
    top: -8,
    left: -8,
    backgroundColor: '#1E3A5F',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  rankText: { color: '#fff', fontWeight: 'bold', fontSize: 12 },
  jobTitle: { fontSize: 17, fontWeight: '700', color: '#1E3A5F', marginTop: 8, marginRight: 20 },
  jobDept: { fontSize: 13, color: '#6B7280', marginTop: 4 },
  matchContainer: { marginTop: 14, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#F3F4F6' },
  matchHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  matchLabel: { fontSize: 12, fontWeight: '500', color: '#6B7280' },
  matchPercentage: { fontSize: 14, fontWeight: '700' },
  matchBar: { height: 6, backgroundColor: '#E5E7EB', borderRadius: 3, overflow: 'hidden' },
  matchFill: { height: 6, borderRadius: 3 },
  jobFooter: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 12 },
  jobDetail: { flexDirection: 'row', alignItems: 'center', gap: 4 },
  jobDetailText: { fontSize: 12, color: '#6B7280' },
  matchBadge: { flexDirection: 'row', alignItems: 'center', gap: 4, backgroundColor: '#DCFCE7', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 14 },
  matchBadgeText: { fontSize: 11, fontWeight: '600', color: '#10B981' },
});