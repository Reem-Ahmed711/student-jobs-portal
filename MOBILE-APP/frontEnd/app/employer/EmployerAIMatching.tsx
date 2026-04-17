import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  FlatList, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

interface Candidate {
  id: number; name: string; email: string; year: string;
  department: string; matchScore: number; gpa: string;
  availability: string; predictedSuccess: number;
  experience: string;
  skills: { matched: string[]; missing: string[] };
  strengths: string[]; weaknesses: string[];
}

const JOBS = [
  { id: 'physics', name: 'Teaching Assistant - Physics 101', applicants: 24 },
  { id: 'quantum', name: 'Research Assistant - Quantum',     applicants: 12 },
  { id: 'lab',     name: 'Lab Assistant - General Physics',  applicants: 18 },
];

const CANDIDATES: Candidate[] = [
  {
    id: 1, name: 'Ahmed Mohamed', email: 'ahmed.mohamed@science.cu.edu.eg',
    year: '3rd Year', department: 'Physics', matchScore: 94, gpa: '3.7',
    availability: '15 hrs/week', predictedSuccess: 92,
    experience: 'Peer tutor for 2 years',
    skills: { matched: ['Teaching', 'Lab Work', 'Communication', 'Physics'], missing: ['Python'] },
    strengths: ['Excellent communication', 'Strong fundamentals'],
    weaknesses: ['No research experience'],
  },
  {
    id: 2, name: 'Mariam Ali', email: 'mariam.ali@science.cu.edu.eg',
    year: '4th Year', department: 'Physics', matchScore: 91, gpa: '3.9',
    availability: '20 hrs/week', predictedSuccess: 95,
    experience: 'Teaching assistant for 1 semester',
    skills: { matched: ['Teaching', 'Physics', 'Communication', 'Lab Work'], missing: [] },
    strengths: ['Previous TA experience', 'Excellent grades'],
    weaknesses: ['Limited availability'],
  },
  {
    id: 3, name: 'Yasmine Hassan', email: 'yasmine.h@science.cu.edu.eg',
    year: '3rd Year', department: 'Physics', matchScore: 78, gpa: '3.5',
    availability: '10 hrs/week', predictedSuccess: 75,
    experience: 'Lab volunteer for 1 semester',
    skills: { matched: ['Lab Work', 'Physics'], missing: ['Teaching', 'Communication'] },
    strengths: ['Hands-on lab experience'],
    weaknesses: ['No teaching experience', 'Limited hours'],
  },
];

const matchColor = (score: number) => {
  if (score >= 90) return '#00C851';
  if (score >= 80) return '#ffbb33';
  return '#ff4444';
};

const EmployerAIMatching = () => {
  const router = useRouter();
  const [selectedJob, setSelectedJob] = useState('physics');
  const [threshold, setThreshold] = useState(70);
  const [jobPickerOpen, setJobPickerOpen] = useState(false);

  const filtered = CANDIDATES.filter((c) => c.matchScore >= threshold);

  const renderCandidate = ({ item }: { item: Candidate }) => {
    const mc = matchColor(item.matchScore);
    return (
      <View style={[styles.card, { borderLeftColor: mc }]}>
        {/* Header */}
        <View style={styles.cardHeader}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{item.name[0]}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={styles.candidateName}>{item.name}</Text>
            <Text style={styles.candidateEmail}>{item.email}</Text>
            <Text style={styles.candidateMeta}>GPA {item.gpa} · {item.availability}</Text>
          </View>
          <View style={styles.scoreWrap}>
            <Text style={[styles.scoreNum, { color: mc }]}>{item.matchScore}%</Text>
            <View style={styles.predictedBadge}>
              <Text style={styles.predictedText}>{item.predictedSuccess}% success</Text>
            </View>
          </View>
        </View>

        {/* Skills */}
        <View style={styles.skillsRow}>
          {item.skills.matched.map((s) => (
            <View key={s} style={styles.skillMatched}>
              <Ionicons name="checkmark" size={10} color="#155724" />
              <Text style={styles.skillMatchedText}>{s}</Text>
            </View>
          ))}
          {item.skills.missing.map((s) => (
            <View key={s} style={styles.skillMissing}>
              <Ionicons name="close" size={10} color="#721c24" />
              <Text style={styles.skillMissingText}>{s}</Text>
            </View>
          ))}
        </View>

        {/* Strengths / Weaknesses */}
        <View style={styles.swRow}>
          <View style={styles.swBox}>
            <View style={styles.swTitleRow}>
              <Ionicons name="star" size={13} color="#ffbb33" />
              <Text style={styles.swTitle}>Strengths</Text>
            </View>
            {item.strengths.map((s, i) => (
              <Text key={i} style={styles.swItem}>· {s}</Text>
            ))}
          </View>
          <View style={styles.swDivider} />
          <View style={styles.swBox}>
            <View style={styles.swTitleRow}>
              <Ionicons name="alert-circle-outline" size={13} color="#ffbb33" />
              <Text style={styles.swTitle}>Consider</Text>
            </View>
            {item.weaknesses.map((w, i) => (
              <Text key={i} style={styles.swItem}>· {w}</Text>
            ))}
          </View>
        </View>

        {/* Actions */}
        <View style={styles.actions}>
          <TouchableOpacity style={styles.outlineBtn}
            onPress={() => Alert.alert('Full Analysis', `Showing analysis for ${item.name}`)}>
            <Ionicons name="stats-chart-outline" size={14} color="#0B2A4A" />
            <Text style={styles.outlineBtnText}>Analysis</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryBtn}
            onPress={() => Alert.alert('Shortlisted', `${item.name} added to shortlist`)}>
            <Ionicons name="bookmark-outline" size={14} color="#0B2A4A" />
            <Text style={styles.secondaryBtnText}>Shortlist</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.primaryBtn}
            onPress={() => Alert.alert('Schedule', `Scheduling interview with ${item.name}`)}>
            <Ionicons name="calendar-outline" size={14} color="#fff" />
            <Text style={styles.primaryBtnText}>Interview</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  const selectedJobName = JOBS.find((j) => j.id === selectedJob)?.name || '';

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color="#0B2A4A" />
        </TouchableOpacity>
        <View style={styles.topBarCenter}>
          <Text style={styles.topBarTitle}>AI Matching</Text>
          <View style={styles.betaBadge}><Text style={styles.betaText}>BETA</Text></View>
        </View>
        <View style={{ width: 36 }} />
      </View>

      <FlatList
        data={filtered}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderCandidate}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={() => (
          <View>
            {/* AI Insight Banner */}
            <View style={styles.insightBanner}>
              <View style={styles.insightHeader}>
                <MaterialIcons name="auto-awesome" size={18} color="#fff" />
                <Text style={styles.insightTitle}>AI Insights</Text>
              </View>
              <View style={styles.insightBody}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.insightLabel}>Top Required Skills</Text>
                  <View style={styles.insightSkills}>
                    {['Teaching', 'Lab Work', 'Physics', 'Comm'].map((s) => (
                      <View key={s} style={styles.insightSkillChip}>
                        <Text style={styles.insightSkillText}>{s}</Text>
                      </View>
                    ))}
                  </View>
                </View>
                <View style={styles.insightScore}>
                  <Text style={styles.insightScoreLabel}>Avg Match</Text>
                  <Text style={styles.insightScoreNum}>89%</Text>
                </View>
              </View>
            </View>

            {/* Filters */}
            <View style={styles.filtersCard}>
              {/* Job Picker */}
              <Text style={styles.filterLabel}>Select Job</Text>
              <TouchableOpacity style={styles.jobPicker} onPress={() => setJobPickerOpen(!jobPickerOpen)}>
                <Text style={styles.jobPickerText} numberOfLines={1}>{selectedJobName}</Text>
                <Ionicons name={jobPickerOpen ? 'chevron-up' : 'chevron-down'} size={16} color="#64748b" />
              </TouchableOpacity>
              {jobPickerOpen && (
                <View style={styles.jobDropdown}>
                  {JOBS.map((j) => (
                    <TouchableOpacity key={j.id} style={[styles.jobOption, selectedJob === j.id && styles.jobOptionActive]}
                      onPress={() => { setSelectedJob(j.id); setJobPickerOpen(false); }}>
                      <Text style={[styles.jobOptionText, selectedJob === j.id && styles.jobOptionTextActive]}
                        numberOfLines={1}>{j.name}</Text>
                      <Text style={styles.jobOptionCount}>{j.applicants}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}

              {/* Threshold */}
              <View style={styles.thresholdRow}>
                <Text style={styles.filterLabel}>Match Threshold</Text>
                <Text style={styles.thresholdNum}>{threshold}%</Text>
              </View>
              <View style={styles.thresholdBtns}>
                {[60, 70, 80, 90].map((v) => (
                  <TouchableOpacity key={v} style={[styles.thresholdBtn, threshold === v && styles.thresholdBtnActive]}
                    onPress={() => setThreshold(v)}>
                    <Text style={[styles.thresholdBtnText, threshold === v && styles.thresholdBtnTextActive]}>
                      {v}%+
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>
              <View style={styles.thresholdTrack}>
                <View style={[styles.thresholdFill, { width: `${threshold}%` }]} />
              </View>

              {/* Results count */}
              <Text style={styles.resultsCount}>
                {filtered.length} candidate{filtered.length !== 1 ? 's' : ''} above {threshold}%
              </Text>
            </View>

            <Text style={styles.sectionTitle}>Top Matches</Text>
          </View>
        )}
        ListEmptyComponent={() => (
          <View style={styles.empty}>
            <MaterialIcons name="auto-awesome" size={48} color="#CBD5E1" />
            <Text style={styles.emptyText}>No candidates above {threshold}% match</Text>
            <TouchableOpacity onPress={() => setThreshold(Math.max(0, threshold - 10))}>
              <Text style={styles.emptyAction}>Lower threshold</Text>
            </TouchableOpacity>
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
  topBarCenter: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  topBarTitle: { fontSize: 17, fontWeight: '700', color: '#0B2A4A' },
  betaBadge: { backgroundColor: '#0B2A4A', paddingHorizontal: 8, paddingVertical: 2, borderRadius: 10 },
  betaText: { color: '#fff', fontSize: 10, fontWeight: '700' },

  listContent: { paddingBottom: 40 },

  // AI Banner
  insightBanner: {
    margin: 20, marginBottom: 0,
    borderRadius: 14, padding: 18,
    backgroundColor: '#0B2A4A',
  },
  insightHeader: { flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 14 },
  insightTitle: { color: '#fff', fontSize: 15, fontWeight: '700' },
  insightBody: { flexDirection: 'row', alignItems: 'flex-start', gap: 16 },
  insightLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 12, marginBottom: 8 },
  insightSkills: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  insightSkillChip: {
    backgroundColor: 'rgba(255,255,255,0.15)', paddingHorizontal: 10,
    paddingVertical: 4, borderRadius: 10,
  },
  insightSkillText: { color: '#fff', fontSize: 11, fontWeight: '600' },
  insightScore: { alignItems: 'center' },
  insightScoreLabel: { color: 'rgba(255,255,255,0.7)', fontSize: 11, marginBottom: 4 },
  insightScoreNum: { color: '#fff', fontSize: 26, fontWeight: '800' },

  // Filters Card
  filtersCard: {
    margin: 20, marginBottom: 10,
    backgroundColor: '#fff', borderRadius: 14, padding: 16,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 6, elevation: 3,
  },
  filterLabel: { fontSize: 13, fontWeight: '600', color: '#0B2A4A', marginBottom: 8 },
  jobPicker: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    borderWidth: 1.5, borderColor: '#E2E8F0', borderRadius: 10,
    paddingHorizontal: 12, paddingVertical: 11, marginBottom: 4,
  },
  jobPickerText: { fontSize: 13, color: '#1e293b', flex: 1, marginRight: 8 },
  jobDropdown: {
    borderWidth: 1.5, borderColor: '#E2E8F0', borderRadius: 10,
    backgroundColor: '#fff', marginBottom: 16, overflow: 'hidden',
  },
  jobOption: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 12, paddingVertical: 11,
    borderBottomWidth: 1, borderBottomColor: '#f1f5f9',
  },
  jobOptionActive: { backgroundColor: '#EBF0F9' },
  jobOptionText: { fontSize: 13, color: '#64748b', flex: 1, marginRight: 8 },
  jobOptionTextActive: { color: '#0B2A4A', fontWeight: '700' },
  jobOptionCount: { fontSize: 11, color: '#94a3b8' },

  thresholdRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: 16 },
  thresholdNum: { fontSize: 15, fontWeight: '800', color: '#0B2A4A' },
  thresholdBtns: { flexDirection: 'row', gap: 8, marginTop: 10, marginBottom: 12 },
  thresholdBtn: {
    flex: 1, paddingVertical: 8, borderRadius: 8,
    borderWidth: 1.5, borderColor: '#E2E8F0', alignItems: 'center',
  },
  thresholdBtnActive: { backgroundColor: '#0B2A4A', borderColor: '#0B2A4A' },
  thresholdBtnText: { fontSize: 12, fontWeight: '700', color: '#64748b' },
  thresholdBtnTextActive: { color: '#fff' },
  thresholdTrack: {
    height: 5, backgroundColor: '#E2E8F0', borderRadius: 3,
    overflow: 'hidden', marginBottom: 10,
  },
  thresholdFill: { height: '100%', backgroundColor: '#0B2A4A', borderRadius: 3 },
  resultsCount: { fontSize: 12, color: '#94a3b8', fontWeight: '500', textAlign: 'center' },

  sectionTitle: { fontSize: 17, fontWeight: '700', color: '#0B2A4A', paddingHorizontal: 20, marginBottom: 10 },

  // Candidate Card
  card: {
    backgroundColor: '#fff', marginHorizontal: 20, marginBottom: 15,
    borderRadius: 14, padding: 16, borderLeftWidth: 4,
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
  scoreWrap: { alignItems: 'flex-end', gap: 4 },
  scoreNum: { fontSize: 24, fontWeight: '800' },
  predictedBadge: { backgroundColor: '#f1f5f9', paddingHorizontal: 8, paddingVertical: 3, borderRadius: 8 },
  predictedText: { fontSize: 10, color: '#64748b', fontWeight: '600' },

  skillsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginBottom: 12 },
  skillMatched: {
    flexDirection: 'row', alignItems: 'center', gap: 3,
    backgroundColor: '#d4edda', paddingHorizontal: 9, paddingVertical: 4, borderRadius: 10,
  },
  skillMatchedText: { fontSize: 11, color: '#155724', fontWeight: '600' },
  skillMissing: {
    flexDirection: 'row', alignItems: 'center', gap: 3,
    backgroundColor: '#f8d7da', paddingHorizontal: 9, paddingVertical: 4, borderRadius: 10,
  },
  skillMissingText: { fontSize: 11, color: '#721c24', fontWeight: '600' },

  swRow: {
    flexDirection: 'row', backgroundColor: '#f8fafc',
    borderRadius: 10, padding: 12, marginBottom: 14,
    borderWidth: 1, borderColor: '#f1f5f9',
  },
  swBox: { flex: 1 },
  swDivider: { width: 1, backgroundColor: '#E2E8F0', marginHorizontal: 12 },
  swTitleRow: { flexDirection: 'row', alignItems: 'center', gap: 4, marginBottom: 6 },
  swTitle: { fontSize: 12, fontWeight: '700', color: '#0B2A4A' },
  swItem: { fontSize: 11, color: '#64748b', marginBottom: 3 },

  actions: { flexDirection: 'row', gap: 8 },
  outlineBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 4, paddingVertical: 9, borderRadius: 9,
    borderWidth: 1.5, borderColor: '#CBD5E1',
  },
  outlineBtnText: { fontSize: 12, fontWeight: '600', color: '#0B2A4A' },
  secondaryBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 4, paddingVertical: 9, borderRadius: 9,
    borderWidth: 1.5, borderColor: '#0B2A4A',
  },
  secondaryBtnText: { fontSize: 12, fontWeight: '600', color: '#0B2A4A' },
  primaryBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 4, paddingVertical: 9, borderRadius: 9, backgroundColor: '#0B2A4A',
  },
  primaryBtnText: { fontSize: 12, fontWeight: '600', color: '#fff' },

  empty: { alignItems: 'center', paddingTop: 60, gap: 12, paddingHorizontal: 40 },
  emptyText: { fontSize: 15, color: '#94a3b8', fontWeight: '500', textAlign: 'center' },
  emptyAction: { fontSize: 14, color: '#0B2A4A', fontWeight: '700', textDecorationLine: 'underline' },
});

export default EmployerAIMatching;