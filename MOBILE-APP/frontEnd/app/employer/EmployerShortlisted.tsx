import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity, FlatList, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons, FontAwesome5 } from '@expo/vector-icons';

interface Candidate {
  id: number; name: string; email: string; year: string;
  department: string; job: string; matchScore: number;
  skills: string[]; stage: string; gpa: string;
  interviewDate?: string; feedback?: string;
}

const STAGES = [
  { id: 'all',       name: 'All Stages',   count: 8 },
  { id: 'interview', name: 'Interview',    count: 3 },
  { id: 'review',    name: 'Under Review', count: 3 },
  { id: 'offered',   name: 'Offer Sent',   count: 2 },
];

const SHORTLISTED: Candidate[] = [
  {
    id: 1, name: 'Nour Ahmed', email: 'nour.ahmed@science.cu.edu.eg',
    year: '4th Year', department: 'Mathematics',
    job: 'Teaching Assistant - Calculus', matchScore: 94,
    skills: ['Teaching', 'Mathematics', 'Tutoring'], stage: 'Interview',
    interviewDate: 'Mar 3, 2026 – 2:00 PM',
    feedback: 'Strong candidate, excellent communication', gpa: '3.8',
  },
  {
    id: 2, name: 'Sara Ibrahim', email: 'sara.ibrahim@science.cu.edu.eg',
    year: '4th Year', department: 'Chemistry',
    job: 'Research Assistant - Chemistry', matchScore: 88,
    skills: ['Research', 'Lab Work', 'Data Analysis'], stage: 'Under Review',
    feedback: 'Good technical skills, pending committee review', gpa: '3.9',
  },
  {
    id: 3, name: 'Khaled Samir', email: 'khaled.s@science.cu.edu.eg',
    year: '3rd Year', department: 'Physics',
    job: 'Lab Assistant - General Physics', matchScore: 80,
    skills: ['Lab Work', 'Physics', 'Communication'], stage: 'Offer Sent',
    gpa: '3.5',
  },
];

const stageColor = (stage: string) => {
  switch (stage) {
    case 'Interview':    return { bg: '#d4edda', color: '#155724' };
    case 'Under Review': return { bg: '#fff3cd', color: '#856404' };
    case 'Offer Sent':   return { bg: '#cce5ff', color: '#004085' };
    default:             return { bg: '#e2e3e5', color: '#383d41' };
  }
};

const EmployerShortlisted = () => {
  const router = useRouter();
  const [selectedStage, setSelectedStage] = useState('all');

  const filtered = selectedStage === 'all'
    ? SHORTLISTED
    : SHORTLISTED.filter((c) => c.stage.toLowerCase().replace(' ', '') ===
        selectedStage.toLowerCase().replace(' ', ''));

  const renderCard = ({ item }: { item: Candidate }) => {
    const sc = stageColor(item.stage);
    return (
      <View style={styles.card}>
        {/* Header */}
        <View style={styles.cardHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{item.name[0]}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.candidateName}>{item.name}</Text>
            <Text style={styles.candidateEmail}>{item.email}</Text>
            <Text style={styles.candidateMeta}>{item.job} · GPA {item.gpa}</Text>
          </View>
          <View style={styles.scoreWrap}>
            <View style={styles.scoreBadge}>
              <Text style={styles.scoreNum}>{item.matchScore}%</Text>
            </View>
            <View style={[styles.stageBadge, { backgroundColor: sc.bg }]}>
              <Text style={[styles.stageText, { color: sc.color }]}>{item.stage}</Text>
            </View>
          </View>
        </View>

        {/* Skills */}
        <View style={styles.skillsRow}>
          {item.skills.map((s) => (
            <View key={s} style={styles.skillChip}>
              <Text style={styles.skillChipText}>{s}</Text>
            </View>
          ))}
        </View>

        {/* Feedback / Interview */}
        <View style={styles.infoBox}>
          <Text style={styles.infoBoxLabel}>Feedback</Text>
          <Text style={styles.infoBoxValue}>{item.feedback || 'No feedback yet'}</Text>
          {item.interviewDate && (
            <View style={styles.interviewRow}>
              <Ionicons name="calendar-outline" size={13} color="#00C851" />
              <Text style={styles.interviewText}>{item.interviewDate}</Text>
            </View>
          )}
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <TouchableOpacity style={styles.outlineBtn}
            onPress={() => Alert.alert('Schedule Interview', `Scheduling for ${item.name}`)}>
            <Ionicons name="calendar-outline" size={15} color="#0B2A4A" />
            <Text style={styles.outlineBtnText}>Schedule</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.primaryBtn}
            onPress={() => Alert.alert('Send Offer', `Sending offer to ${item.name}`)}>
            <Ionicons name="paper-plane-outline" size={15} color="#fff" />
            <Text style={styles.primaryBtnText}>Send Offer</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color="#0B2A4A" />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>Shortlisted</Text>
        <View style={{ width: 36 }} />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderCard}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={() => (
          <View style={styles.listHeader}>
            <Text style={styles.pageTitle}>Shortlisted Candidates</Text>
            <Text style={styles.pageSubtitle}>Track candidates in your hiring pipeline</Text>

            {/* Stage Filters */}
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}
              contentContainerStyle={styles.filterContent}>
              {STAGES.map((s) => {
                const active = selectedStage === s.id;
                return (
                  <TouchableOpacity key={s.id} style={[styles.filterTab, active && styles.filterTabActive]}
                    onPress={() => setSelectedStage(s.id)}>
                    <Text style={[styles.filterTabText, active && styles.filterTabTextActive]}>{s.name}</Text>
                    <View style={[styles.filterBadge, active && styles.filterBadgeActive]}>
                      <Text style={[styles.filterBadgeText, active && styles.filterBadgeTextActive]}>
                        {s.count}
                      </Text>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        )}
        ListEmptyComponent={() => (
          <View style={styles.empty}>
            <Ionicons name="bookmark-outline" size={48} color="#CBD5E1" />
            <Text style={styles.emptyText}>No candidates in this stage</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f8fafc' },

  topBar: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 20, paddingVertical: 14, backgroundColor: '#fff',
    borderBottomWidth: 1, borderBottomColor: '#f1f5f9',
    elevation: 2, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.06,
  },
  backBtn: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: '#EBF0F9', justifyContent: 'center', alignItems: 'center',
  },
  topBarTitle: { fontSize: 17, fontWeight: '700', color: '#0B2A4A' },

  listContent: { paddingBottom: 40 },
  listHeader: { padding: 20 },
  pageTitle: { fontSize: 22, fontWeight: '700', color: '#0B2A4A' },
  pageSubtitle: { fontSize: 13, color: '#94a3b8', marginTop: 4, marginBottom: 20 },

  filterScroll: { flexGrow: 0 },
  filterContent: { gap: 10 },
  filterTab: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 14, paddingVertical: 9,
    borderRadius: 20, borderWidth: 1.5, borderColor: '#E2E8F0', backgroundColor: '#fff',
  },
  filterTabActive: { backgroundColor: '#0B2A4A', borderColor: '#0B2A4A' },
  filterTabText: { fontSize: 13, fontWeight: '600', color: '#64748b' },
  filterTabTextActive: { color: '#fff' },
  filterBadge: {
    backgroundColor: '#EBF0F9', paddingHorizontal: 7, paddingVertical: 2, borderRadius: 10,
  },
  filterBadgeActive: { backgroundColor: 'rgba(255,255,255,0.2)' },
  filterBadgeText: { fontSize: 11, fontWeight: '700', color: '#0B2A4A' },
  filterBadgeTextActive: { color: '#fff' },

  card: {
    backgroundColor: '#fff', marginHorizontal: 20, marginBottom: 15, borderRadius: 16, padding: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.07, shadowRadius: 6, elevation: 3,
  },
  cardHeader: { flexDirection: 'row', gap: 12, marginBottom: 12 },
  avatar: {
    width: 46, height: 46, borderRadius: 23, backgroundColor: '#EBF0F9',
    justifyContent: 'center', alignItems: 'center',
  },
  avatarText: { fontSize: 18, fontWeight: '800', color: '#0B2A4A' },
  candidateName: { fontSize: 15, fontWeight: '700', color: '#0B2A4A' },
  candidateEmail: { fontSize: 12, color: '#64748b', marginTop: 1 },
  candidateMeta: { fontSize: 11, color: '#94a3b8', marginTop: 2 },
  scoreWrap: { alignItems: 'flex-end', gap: 6 },
  scoreBadge: {
    backgroundColor: '#EBF0F9', paddingHorizontal: 12, paddingVertical: 6, borderRadius: 10,
  },
  scoreNum: { fontSize: 17, fontWeight: '800', color: '#0B2A4A' },
  stageBadge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10 },
  stageText: { fontSize: 11, fontWeight: '700' },

  skillsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 12 },
  skillChip: {
    backgroundColor: '#EBF0F9', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10,
  },
  skillChipText: { fontSize: 11, fontWeight: '600', color: '#0B2A4A' },

  infoBox: {
    backgroundColor: '#f8fafc', borderRadius: 10, padding: 12, marginBottom: 14,
    borderWidth: 1, borderColor: '#f1f5f9',
  },
  infoBoxLabel: { fontSize: 11, fontWeight: '700', color: '#94a3b8', marginBottom: 4, textTransform: 'uppercase' },
  infoBoxValue: { fontSize: 13, color: '#1e293b' },
  interviewRow: { flexDirection: 'row', alignItems: 'center', gap: 5, marginTop: 6 },
  interviewText: { fontSize: 12, color: '#00C851', fontWeight: '600' },

  actions: { flexDirection: 'row', gap: 10 },
  outlineBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 6, paddingVertical: 10, borderRadius: 10,
    borderWidth: 1.5, borderColor: '#CBD5E1',
  },
  outlineBtnText: { fontSize: 13, fontWeight: '600', color: '#0B2A4A' },
  primaryBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 6, paddingVertical: 10, borderRadius: 10, backgroundColor: '#0B2A4A',
  },
  primaryBtnText: { fontSize: 13, fontWeight: '600', color: '#fff' },

  empty: { alignItems: 'center', paddingTop: 60, gap: 12 },
  emptyText: { fontSize: 15, color: '#94a3b8', fontWeight: '500' },
});

export default EmployerShortlisted;
