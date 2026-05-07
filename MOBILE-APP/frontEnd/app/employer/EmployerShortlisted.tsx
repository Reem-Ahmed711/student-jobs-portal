// MOBILE-APP/frontEnd/app/EmployerShortlisted.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Modal,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

// Types
interface Stage {
  id: string;
  name: string;
  count: number;
}

interface Candidate {
  id: number;
  name: string;
  email: string;
  year: string;
  department: string;
  job: string;
  matchScore: number;
  skills: string[];
  stage: string;
  interviewDate?: string;
  feedback?: string;
  gpa: string;
}

// Stages Data
const stages: Stage[] = [
  { id: 'all', name: 'All Stages', count: 8 },
  { id: 'interview', name: 'Interview', count: 3 },
  { id: 'review', name: 'Under Review', count: 3 },
  { id: 'offered', name: 'Offer Sent', count: 2 },
];

// Sample Candidates Data
const shortlistedData: Candidate[] = [
  {
    id: 1,
    name: 'Nour Ahmed',
    email: 'nour.ahmed@science.cu.edu.eg',
    year: '4th Year',
    department: 'Mathematics',
    job: 'Teaching Assistant - Calculus',
    matchScore: 94,
    skills: ['Teaching', 'Mathematics', 'Tutoring'],
    stage: 'Interview',
    interviewDate: 'Mar 3, 2026 - 2:00 PM',
    feedback: 'Strong candidate, excellent communication',
    gpa: '3.8',
  },
  {
    id: 2,
    name: 'Sara Ibrahim',
    email: 'sara.ibrahim@science.cu.edu.eg',
    year: '4th Year',
    department: 'Chemistry',
    job: 'Research Assistant - Chemistry',
    matchScore: 88,
    skills: ['Research', 'Lab Work', 'Data Analysis'],
    stage: 'Under Review',
    feedback: 'Good candidate, waiting for more documents',
    gpa: '3.9',
  },
  {
    id: 3,
    name: 'Omar Hassan',
    email: 'omar.hassan@science.cu.edu.eg',
    year: '3rd Year',
    department: 'Physics',
    job: 'Lab Assistant - Physics',
    matchScore: 91,
    skills: ['Lab Work', 'Physics', 'Communication'],
    stage: 'Offer Sent',
    interviewDate: 'Feb 25, 2026 - 11:00 AM',
    feedback: 'Excellent candidate, offer sent',
    gpa: '3.7',
  },
];

// ─── Main EmployerShortlisted Component ─────────────────────────────────────
const EmployerShortlisted = () => {
  const [selectedStage, setSelectedStage] = useState<string>('all');
  const [selectedCandidate, setSelectedCandidate] = useState<Candidate | null>(null);
  const [scheduleModalVisible, setScheduleModalVisible] = useState(false);
  const [offerModalVisible, setOfferModalVisible] = useState(false);
  const [interviewDate, setInterviewDate] = useState('');
  const [offerMessage, setOfferMessage] = useState('');

  const router = useRouter();

  // Filter candidates based on selected stage
  const filteredCandidates = shortlistedData.filter((candidate) => {
    if (selectedStage === 'all') return true;
    if (selectedStage === 'interview') return candidate.stage === 'Interview';
    if (selectedStage === 'review') return candidate.stage === 'Under Review';
    if (selectedStage === 'offered') return candidate.stage === 'Offer Sent';
    return true;
  });

  // Get stage color for badges
  const getStageColors = (stage: string) => {
    switch (stage) {
      case 'Interview':
        return { bg: '#DCFCE7', color: '#16A34A' };
      case 'Under Review':
        return { bg: '#FEF3C7', color: '#D97706' };
      case 'Offer Sent':
        return { bg: '#DBEAFE', color: '#2563EB' };
      default:
        return { bg: '#F3F4F6', color: '#6B7280' };
    }
  };

  // Get match score color
  const getMatchScoreColor = (score: number) => {
    if (score >= 90) return '#16A34A';
    if (score >= 70) return '#F59E0B';
    return '#EF4444';
  };

  // Schedule Interview
  const handleScheduleInterview = () => {
    if (!interviewDate) {
      Alert.alert('Error', 'Please select an interview date');
      return;
    }
    Alert.alert('Success', `Interview scheduled for ${interviewDate}`);
    setScheduleModalVisible(false);
    setInterviewDate('');
  };

  // Send Offer
  const handleSendOffer = () => {
    Alert.alert('Success', `Offer sent successfully${offerMessage ? `: ${offerMessage}` : ''}`);
    setOfferModalVisible(false);
    setOfferMessage('');
  };

  // Go back
  const handleGoBack = () => {
    router.back();
  };

  // Get initials for avatar
  const getInitials = (name: string) => {
    return name.charAt(0).toUpperCase();
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header with Back Button */}
      <View style={styles.header}>
        <TouchableOpacity onPress={handleGoBack} style={styles.backButton}>
          <Ionicons name="arrow-back" size={24} color="#0B2A4A" />
        </TouchableOpacity>
        <View style={styles.headerTextContainer}>
          <Text style={styles.headerTitle}>Shortlisted Candidates</Text>
          <Text style={styles.headerSubtitle}>Track candidates in your hiring pipeline</Text>
        </View>
      </View>

      <ScrollView
        style={styles.scroll}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.content}>
          {/* Stages Filter */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            style={styles.stagesContainer}
          >
            {stages.map((stage) => {
              const isActive = selectedStage === stage.id;
              return (
                <TouchableOpacity
                  key={stage.id}
                  style={[
                    styles.stageButton,
                    isActive && styles.stageButtonActive,
                  ]}
                  onPress={() => setSelectedStage(stage.id)}
                >
                  <Text
                    style={[
                      styles.stageButtonText,
                      isActive && styles.stageButtonTextActive,
                    ]}
                  >
                    {stage.name}
                  </Text>
                  <View
                    style={[
                      styles.stageCount,
                      isActive && styles.stageCountActive,
                    ]}
                  >
                    <Text
                      style={[
                        styles.stageCountText,
                        isActive && styles.stageCountTextActive,
                      ]}
                    >
                      {stage.count}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Candidates List */}
          {filteredCandidates.length === 0 ? (
            <View style={styles.emptyState}>
              <Ionicons name="people-outline" size={64} color="#D1D5DB" />
              <Text style={styles.emptyTitle}>No candidates found</Text>
              <Text style={styles.emptySubtitle}>
                Try changing the stage filter
              </Text>
            </View>
          ) : (
            filteredCandidates.map((candidate) => {
              const stageColors = getStageColors(candidate.stage);
              const matchScoreColor = getMatchScoreColor(candidate.matchScore);
              
              return (
                <View key={candidate.id} style={styles.card}>
                  {/* Header with Avatar and Info */}
                  <View style={styles.cardHeader}>
                    <View style={styles.userInfo}>
                      <View style={styles.avatar}>
                        <Text style={styles.avatarText}>
                          {getInitials(candidate.name)}
                        </Text>
                      </View>
                      <View style={styles.userDetails}>
                        <Text style={styles.candidateName}>{candidate.name}</Text>
                        <Text style={styles.candidateEmail}>{candidate.email}</Text>
                        <Text style={styles.candidateDetail}>
                          {candidate.job} • GPA: {candidate.gpa}
                        </Text>
                      </View>
                    </View>
                    
                    <View style={styles.scoreContainer}>
                      <View style={styles.matchScoreBox}>
                        <Text style={[styles.matchScore, { color: matchScoreColor }]}>
                          {candidate.matchScore}%
                        </Text>
                      </View>
                      <View style={[styles.stageBadge, { backgroundColor: stageColors.bg }]}>
                        <Text style={[styles.stageText, { color: stageColors.color }]}>
                          {candidate.stage}
                        </Text>
                      </View>
                    </View>
                  </View>

                  {/* Skills */}
                  <View style={styles.skillsContainer}>
                    {candidate.skills.map((skill, index) => (
                      <View key={index} style={styles.skillTag}>
                        <Text style={styles.skillTagText}>{skill}</Text>
                      </View>
                    ))}
                  </View>

                  {/* Feedback Section */}
                  <View style={styles.feedbackContainer}>
                    <Text style={styles.feedbackLabel}>Feedback:</Text>
                    <Text style={styles.feedbackText}>
                      {candidate.feedback || 'No feedback yet'}
                    </Text>
                    {candidate.interviewDate && (
                      <View style={styles.interviewDateContainer}>
                        <Ionicons name="checkmark-circle" size={14} color="#16A34A" />
                        <Text style={styles.interviewDateText}>
                          Interview: {candidate.interviewDate}
                        </Text>
                      </View>
                    )}
                  </View>

                  {/* Action Buttons */}
                  <View style={styles.actionButtons}>
                    <TouchableOpacity
                      style={[styles.actionButton, styles.outlineButton]}
                      onPress={() => {
                        setSelectedCandidate(candidate);
                        setScheduleModalVisible(true);
                      }}
                    >
                      <Ionicons name="calendar-outline" size={18} color="#0B2A4A" />
                      <Text style={styles.outlineButtonText}>Schedule Interview</Text>
                    </TouchableOpacity>
                    
                    <TouchableOpacity
                      style={[styles.actionButton, styles.primaryButton]}
                      onPress={() => {
                        setSelectedCandidate(candidate);
                        setOfferModalVisible(true);
                      }}
                    >
                      <Ionicons name="document-text-outline" size={18} color="#fff" />
                      <Text style={styles.primaryButtonText}>Send Offer</Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })
          )}
          
          <View style={{ height: 20 }} />
        </View>
      </ScrollView>

      {/* Schedule Interview Modal */}
      <Modal visible={scheduleModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Schedule Interview</Text>
              <TouchableOpacity onPress={() => setScheduleModalVisible(false)}>
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.modalBody}>
              <Text style={styles.modalLabel}>Interview Date & Time</Text>
              <TextInput
                style={styles.modalInput}
                placeholder="e.g., Mar 10, 2026 - 2:00 PM"
                placeholderTextColor="#9CA3AF"
                value={interviewDate}
                onChangeText={setInterviewDate}
              />
              <Text style={styles.modalHint}>
                Example: Mar 15, 2026 - 11:00 AM
              </Text>
            </View>
            
            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setScheduleModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleScheduleInterview}
              >
                <Text style={styles.confirmButtonText}>Schedule</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Send Offer Modal */}
      <Modal visible={offerModalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Send Offer</Text>
              <TouchableOpacity onPress={() => setOfferModalVisible(false)}>
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>
            
            <View style={styles.modalBody}>
              <Text style={styles.modalLabel}>Offer Details (Optional)</Text>
              <TextInput
                style={[styles.modalInput, styles.textArea]}
                placeholder="Enter offer details, salary, benefits..."
                placeholderTextColor="#9CA3AF"
                value={offerMessage}
                onChangeText={setOfferMessage}
                multiline
                numberOfLines={4}
              />
            </View>
            
            <View style={styles.modalFooter}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setOfferModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.modalButton, styles.confirmButton]}
                onPress={handleSendOffer}
              >
                <Text style={styles.confirmButtonText}>Send Offer</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

export default EmployerShortlisted;

// ─── Styles ──────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safe: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  scroll: {
    flex: 1,
  },
  header: {
    backgroundColor: '#fff',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    marginRight: 16,
    padding: 4,
  },
  headerTextContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#0B2A4A',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#6B7280',
  },
  content: {
    padding: 16,
  },
  stagesContainer: {
    flexDirection: 'row',
    marginBottom: 24,
  },
  stageButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderRadius: 30,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  stageButtonActive: {
    backgroundColor: '#0B2A4A',
    borderColor: '#0B2A4A',
  },
  stageButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#6B7280',
  },
  stageButtonTextActive: {
    color: '#fff',
  },
  stageCount: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 20,
    backgroundColor: '#F1F5F9',
  },
  stageCountActive: {
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  stageCountText: {
    fontSize: 12,
    color: '#6B7280',
  },
  stageCountTextActive: {
    color: '#fff',
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16,
  },
  userInfo: {
    flexDirection: 'row',
    gap: 12,
    flex: 1,
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#E6F0FA',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#0B2A4A',
  },
  userDetails: {
    flex: 1,
  },
  candidateName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0B2A4A',
    marginBottom: 2,
  },
  candidateEmail: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 2,
  },
  candidateDetail: {
    fontSize: 12,
    color: '#9CA3AF',
  },
  scoreContainer: {
    alignItems: 'flex-end',
    gap: 8,
  },
  matchScoreBox: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 30,
    backgroundColor: '#F1F5F9',
  },
  matchScore: {
    fontSize: 18,
    fontWeight: '700',
  },
  stageBadge: {
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  stageText: {
    fontSize: 12,
    fontWeight: '600',
  },
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 16,
  },
  skillTag: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
  },
  skillTagText: {
    fontSize: 12,
    color: '#0B2A4A',
  },
  feedbackContainer: {
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 12,
    marginBottom: 16,
  },
  feedbackLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0B2A4A',
    marginBottom: 4,
  },
  feedbackText: {
    fontSize: 13,
    color: '#6B7280',
    marginBottom: 8,
  },
  interviewDateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  interviewDateText: {
    fontSize: 12,
    color: '#16A34A',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'flex-end',
  },
  actionButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  outlineButton: {
    borderWidth: 1,
    borderColor: '#0B2A4A',
    backgroundColor: 'transparent',
  },
  outlineButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0B2A4A',
  },
  primaryButton: {
    backgroundColor: '#0B2A4A',
  },
  primaryButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#fff',
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
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
  },
  // Modal Styles
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderRadius: 20,
    width: '90%',
    maxWidth: 400,
    padding: 20,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0B2A4A',
  },
  modalBody: {
    marginBottom: 20,
  },
  modalLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  modalInput: {
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: '#111827',
    backgroundColor: '#F8FAFC',
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  modalHint: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 6,
  },
  modalFooter: {
    flexDirection: 'row',
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#F3F4F6',
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6B7280',
  },
  confirmButton: {
    backgroundColor: '#0B2A4A',
  },
  confirmButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
});