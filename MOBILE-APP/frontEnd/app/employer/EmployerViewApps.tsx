// MOBILE-APP/frontEnd/app/employer/EmployerViewApps.tsx
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
  Modal,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { getJobApplicants, acceptApplication, rejectApplication, rateStudent } from '../../src/api';

export default function EmployerViewApps() {
  const router = useRouter();
  const { jobId, jobTitle } = useLocalSearchParams();
  const [apps, setApps] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Rating Modal State
  const [ratingModal, setRatingModal] = useState(false);
  const [selectedStudentUid, setSelectedStudentUid] = useState("");
  const [selectedApplicationId, setSelectedApplicationId] = useState("");
  const [ratingValue, setRatingValue] = useState("");
  const [reviewValue, setReviewValue] = useState("");
  const [submittingRating, setSubmittingRating] = useState(false);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    const fetchApps = async () => {
      try {
        const res = await getJobApplicants(jobId as string);
        if (res.success) {
          setApps(res.data || []);
        } else {
          setApps([]);
        }
      } catch (err) {
        console.log('Failed to fetch applicants:', err);
        setApps([]);
      } finally {
        setLoading(false);
      }
    };
    fetchApps();
  }, [jobId]);

  const handleAction = async (appId: string, newStatus: 'accepted' | 'rejected') => {
    setActionLoading(appId);
    try {
      let res;
      if (newStatus === 'accepted') {
        res = await acceptApplication(appId);
      } else {
        res = await rejectApplication(appId);
      }

      if (res.success) {
        setApps((prev) =>
          prev.map((app) => (app.id === appId ? { ...app, status: newStatus } : app))
        );
        Alert.alert('Success', `Application ${newStatus}`);
      } else {
        Alert.alert('Error', res.message || 'Action failed');
      }
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Action failed');
    } finally {
      setActionLoading(null);
    }
  };

  const openRatingModal = (studentUid: string, applicationId: string) => {
    setSelectedStudentUid(studentUid);
    setSelectedApplicationId(applicationId);
    setRatingValue('');
    setReviewValue('');
    setRatingModal(true);
  };

  const submitRating = async () => {
    const rating = parseInt(ratingValue);
    if (!rating || rating < 1 || rating > 5) {
      return Alert.alert('Error', 'Please enter a rating between 1 and 5');
    }

    setSubmittingRating(true);
    try {
      const res = await rateStudent(selectedStudentUid, {
        rating,
        review: reviewValue,
        applicationId: selectedApplicationId,
      });

      if (res.success) {
        Alert.alert('Success', 'Student rated successfully!');
        setRatingModal(false);
      } else {
        Alert.alert('Error', res.message || 'Failed to rate student');
      }
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to rate student');
    } finally {
      setSubmittingRating(false);
    }
  };

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'pending':
        return { bg: '#FEF3C7', color: '#92400e' };
      case 'accepted':
        return { bg: '#DCFCE7', color: '#065f46' };
      case 'rejected':
        return { bg: '#FEE2E2', color: '#991b1b' };
      case 'under_review':
        return { bg: '#EDE9FE', color: '#5B21B6' };
      default:
        return { bg: '#F1F5F9', color: '#475569' };
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle} numberOfLines={1}>
          {jobTitle || 'Applicants'}
        </Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Stats Bar */}
      {!loading && apps.length > 0 && (
        <View style={styles.statsBar}>
          <View style={styles.statChip}>
            <View style={[styles.statDot, { backgroundColor: '#FEF3C7' }]} />
            <Text style={styles.statText}>
              {apps.filter((a) => a.status === 'pending').length} Pending
            </Text>
          </View>
          <View style={styles.statChip}>
            <View style={[styles.statDot, { backgroundColor: '#DCFCE7' }]} />
            <Text style={styles.statText}>
              {apps.filter((a) => a.status === 'accepted').length} Accepted
            </Text>
          </View>
          <View style={styles.statChip}>
            <View style={[styles.statDot, { backgroundColor: '#FEE2E2' }]} />
            <Text style={styles.statText}>
              {apps.filter((a) => a.status === 'rejected').length} Rejected
            </Text>
          </View>
        </View>
      )}

      {loading ? (
        <View style={styles.centerLoading}>
          <ActivityIndicator size="large" color="#1E3A5F" />
          <Text style={styles.loadingText}>Loading applicants...</Text>
        </View>
      ) : (
        <ScrollView
          style={styles.body}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 30 }}
        >
          {apps.length === 0 ? (
            <View style={styles.emptyState}>
              <View style={styles.emptyIconWrap}>
                <Ionicons name="people-outline" size={48} color="#D1D5DB" />
              </View>
              <Text style={styles.emptyTitle}>No applications yet</Text>
              <Text style={styles.emptySubtitle}>
                Share this job to get more applicants
              </Text>
            </View>
          ) : (
            apps.map((app) => {
              const statusStyle = getStatusStyle(app.status);
              const isLoading = actionLoading === app.id;

              return (
                <View key={app.id} style={styles.card}>
                  {/* Card Top: Avatar + Info + Status */}
                  <View style={styles.cardTop}>
                    <View style={styles.avatar}>
                      <Text style={styles.avatarTxt}>
                        {(app.student?.name || '?').charAt(0)}
                      </Text>
                    </View>
                    <View style={{ flex: 1, marginLeft: 12 }}>
                      <Text style={styles.name}>
                        {app.student?.name || 'Unknown Student'}
                      </Text>
                      <Text style={styles.email}>{app.student?.email || ''}</Text>
                      <View style={styles.tagsRow}>
                        <Text style={styles.tag}>
                          🎓 {app.student?.department || 'N/A'}
                        </Text>
                        <Text style={styles.tag}>
                          📊 GPA: {app.student?.gpa || 'N/A'}
                        </Text>
                        {app.student?.year && (
                          <Text style={styles.tag}>
                            📅 Year {app.student?.year}
                          </Text>
                        )}
                      </View>
                    </View>
                    <View
                      style={[styles.badge, { backgroundColor: statusStyle.bg }]}
                    >
                      <Text style={[styles.badgeTxt, { color: statusStyle.color }]}>
                        {(app.status || 'pending').charAt(0).toUpperCase() +
                          (app.status || 'pending').slice(1)}
                      </Text>
                    </View>
                  </View>

                  {/* Skills */}
                  {app.student?.skills && app.student.skills.length > 0 && (
                    <View style={styles.skillsContainer}>
                      {app.student.skills.map((skill: string, i: number) => (
                        <View key={i} style={styles.skillChip}>
                          <Text style={styles.skillTxt}>{skill}</Text>
                        </View>
                      ))}
                    </View>
                  )}

                  {/* Student Rating */}
                  {app.student?.averageRating !== undefined && (
                    <View style={styles.ratingRow}>
                      <Ionicons name="star" size={14} color="#F59E0B" />
                      <Text style={styles.ratingValue}>
                        {app.student.averageRating}
                      </Text>
                      <Text style={styles.ratingCount}>
                        ({app.student.totalRatings || 0} ratings)
                      </Text>
                    </View>
                  )}

                  {/* Contact Info */}
                  {(app.student?.phone || app.student?.linkedin) && (
                    <View style={styles.contactRow}>
                      {app.student?.phone && (
                        <View style={styles.contactItem}>
                          <Ionicons name="call" size={13} color="#6B7280" />
                          <Text style={styles.contactText}>{app.student.phone}</Text>
                        </View>
                      )}
                      {app.student?.linkedin && (
                        <View style={styles.contactItem}>
                          <Ionicons name="logo-linkedin" size={13} color="#6B7280" />
                          <Text style={styles.contactText}>LinkedIn</Text>
                        </View>
                      )}
                    </View>
                  )}

                  {/* Applied Date */}
                  {app.appliedAt && (
                    <View style={styles.dateRow}>
                      <Ionicons name="time-outline" size={13} color="#9CA3AF" />
                      <Text style={styles.dateText}>
                        Applied:{' '}
                        {app.appliedAt?.toDate
                          ? app.appliedAt.toDate().toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })
                          : new Date(app.appliedAt).toLocaleDateString('en-US', {
                              month: 'short',
                              day: 'numeric',
                              year: 'numeric',
                            })}
                      </Text>
                    </View>
                  )}

                  {/* Action Buttons */}
                  {app.status === 'pending' && (
                    <View style={styles.actions}>
                      <TouchableOpacity
                        style={[styles.accBtn, isLoading && styles.disabledBtn]}
                        onPress={() => handleAction(app.id, 'accepted')}
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <ActivityIndicator size="small" color="#fff" />
                        ) : (
                          <Ionicons name="checkmark-circle" size={18} color="#fff" />
                        )}
                        <Text style={styles.accTxt}>Accept</Text>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={[styles.rejBtn, isLoading && styles.disabledBtn]}
                        onPress={() => handleAction(app.id, 'rejected')}
                        disabled={isLoading}
                      >
                        {isLoading ? (
                          <ActivityIndicator size="small" color="#DC2626" />
                        ) : (
                          <Ionicons name="close-circle" size={18} color="#DC2626" />
                        )}
                        <Text style={styles.rejTxt}>Reject</Text>
                      </TouchableOpacity>
                    </View>
                  )}

                  {/* Status indicator if not pending */}
                  {app.status !== 'pending' && (
                    <View
                      style={[
                        styles.statusBanner,
                        app.status === 'accepted'
                          ? styles.acceptedBanner
                          : styles.rejectedBanner,
                      ]}
                    >
                      <Ionicons
                        name={
                          app.status === 'accepted'
                            ? 'checkmark-circle'
                            : 'close-circle'
                        }
                        size={18}
                        color={app.status === 'accepted' ? '#065f46' : '#991b1b'}
                      />
                      <Text
                        style={[
                          styles.statusBannerText,
                          app.status === 'accepted'
                            ? { color: '#065f46' }
                            : { color: '#991b1b' },
                        ]}
                      >
                        {app.status === 'accepted'
                          ? 'Application Accepted'
                          : 'Application Rejected'}
                        {app.rejectionReason
                          ? ` — ${app.rejectionReason}`
                          : ''}
                      </Text>
                    </View>
                  )}

                  {/* Rate Button */}
                  <TouchableOpacity
                    style={styles.rateBtn}
                    onPress={() => openRatingModal(app.studentUid, app.id)}
                  >
                    <MaterialIcons name="star-rate" size={18} color="#F59E0B" />
                    <Text style={styles.rateTxt}>Rate Student</Text>
                    {app.student?.averageRating > 0 && (
                      <Text style={styles.rateExisting}>
                        (Current: {app.student.averageRating})
                      </Text>
                    )}
                  </TouchableOpacity>
                </View>
              );
            })
          )}
        </ScrollView>
      )}

      {/* ==================== Rating Modal ==================== */}
      <Modal visible={ratingModal} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            {/* Modal Header */}
            <View style={styles.modalHeader}>
              <View>
                <Text style={styles.modalTitle}>Rate Student</Text>
                <Text style={styles.modalSubtitle}>
                  Enter a rating from 1 to 5
                </Text>
              </View>
              <TouchableOpacity onPress={() => setRatingModal(false)}>
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            {/* Star Visual */}
            <View style={styles.starRow}>
              {[1, 2, 3, 4, 5].map((star) => (
                <TouchableOpacity
                  key={star}
                  onPress={() => setRatingValue(star.toString())}
                  activeOpacity={0.7}
                >
                  <Ionicons
                    name={parseInt(ratingValue) >= star ? 'star' : 'star-outline'}
                    size={40}
                    color={parseInt(ratingValue) >= star ? '#F59E0B' : '#D1D5DB'}
                  />
                </TouchableOpacity>
              ))}
            </View>

            {/* Rating Number Input */}
            <Text style={styles.inputLabel}>Rating (1-5)</Text>
            <TextInput
              style={styles.modalInput}
              placeholder="Enter rating number"
              keyboardType="numeric"
              maxLength={1}
              value={ratingValue}
              onChangeText={setRatingValue}
            />

            {/* Review Input */}
            <Text style={styles.inputLabel}>Review (Optional)</Text>
            <TextInput
              style={[styles.modalInput, { height: 100, textAlignVertical: 'top' }]}
              placeholder="Write your review about this student..."
              multiline
              numberOfLines={4}
              value={reviewValue}
              onChangeText={setReviewValue}
            />

            {/* Modal Actions */}
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={styles.cancelBtn}
                onPress={() => setRatingModal(false)}
              >
                <Text style={styles.cancelTxt}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.submitBtn, submittingRating && styles.disabledBtn]}
                onPress={submitRating}
                disabled={submittingRating}
              >
                {submittingRating ? (
                  <ActivityIndicator size="small" color="#fff" />
                ) : (
                  <Text style={styles.submitTxt}>Submit Rating</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// ==================== Styles ====================

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F1F5F9' },
  centerLoading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F1F5F9',
  },
  loadingText: { marginTop: 10, color: '#666', fontSize: 14 },

  // Header
  header: {
    backgroundColor: '#1E3A5F',
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    flex: 1,
    textAlign: 'center',
    marginRight: 24,
  },

  // Stats Bar
  statsBar: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: '#fff',
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  statChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  statText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4B5563',
  },

  // Body
  body: {
    padding: 16,
    backgroundColor: '#F1F5F9',
  },

  // Empty State
  emptyState: {
    alignItems: 'center',
    marginTop: 60,
  },
  emptyIconWrap: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#F3F4F6',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
    maxWidth: '70%',
  },

  // Card
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 16,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  // Avatar
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#1E3A5F',
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarTxt: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },

  // Info
  name: {
    fontSize: 16,
    fontWeight: '700',
    color: '#111827',
    marginBottom: 2,
  },
  email: {
    fontSize: 12,
    color: '#6B7280',
    marginBottom: 8,
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  tag: {
    fontSize: 11,
    color: '#1E3A5F',
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 6,
    overflow: 'hidden',
  },

  // Badge
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 20,
    marginLeft: 8,
    alignSelf: 'flex-start',
  },
  badgeTxt: {
    fontSize: 11,
    fontWeight: 'bold',
  },

  // Skills
  skillsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
    marginTop: 14,
    paddingTop: 14,
    borderTopWidth: 1,
    borderColor: '#F3F4F6',
  },
  skillChip: {
    backgroundColor: '#F3F4F6',
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 14,
  },
  skillTxt: {
    fontSize: 11,
    color: '#4B5563',
    fontWeight: '500',
  },

  // Rating Row
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 12,
    paddingTop: 10,
    borderTopWidth: 1,
    borderColor: '#F3F4F6',
  },
  ratingValue: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E3A5F',
    marginLeft: 4,
  },
  ratingCount: {
    fontSize: 12,
    color: '#9CA3AF',
    marginLeft: 4,
  },

  // Contact Row
  contactRow: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 10,
  },
  contactItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  contactText: {
    fontSize: 12,
    color: '#6B7280',
  },

  // Date Row
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    marginTop: 10,
  },
  dateText: {
    fontSize: 12,
    color: '#9CA3AF',
  },

  // Actions
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 16,
    paddingTop: 14,
    borderTopWidth: 1,
    borderColor: '#F3F4F6',
  },
  accBtn: {
    flex: 1,
    backgroundColor: '#16A34A',
    padding: 12,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  accTxt: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
  rejBtn: {
    flex: 1,
    backgroundColor: '#FEE2E2',
    padding: 12,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 8,
  },
  rejTxt: {
    color: '#DC2626',
    fontWeight: '700',
    fontSize: 14,
  },
  disabledBtn: {
    opacity: 0.6,
  },

  // Status Banner
  statusBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginTop: 14,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
  },
  acceptedBanner: {
    backgroundColor: '#DCFCE7',
  },
  rejectedBanner: {
    backgroundColor: '#FEE2E2',
  },
  statusBannerText: {
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
  },

  // Rate Button
  rateBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 14,
    paddingTop: 12,
    borderTopWidth: 1,
    borderColor: '#F3F4F6',
    alignSelf: 'flex-start',
    paddingVertical: 4,
  },
  rateTxt: {
    fontSize: 14,
    color: '#F59E0B',
    fontWeight: '600',
  },
  rateExisting: {
    fontSize: 12,
    color: '#9CA3AF',
    fontStyle: 'italic',
  },

  // ==================== Modal Styles ====================
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
    maxHeight: '85%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
    marginBottom: 4,
  },
  modalSubtitle: {
    fontSize: 14,
    color: '#9CA3AF',
  },

  // Star Row
  starRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 24,
  },

  // Input
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 6,
    marginTop: 8,
  },
  modalInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    padding: 14,
    marginBottom: 8,
    fontSize: 15,
    color: '#111827',
  },

  // Modal Actions
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  cancelBtn: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  cancelTxt: {
    color: '#4B5563',
    fontWeight: '700',
    fontSize: 15,
  },
  submitBtn: {
    flex: 2,
    backgroundColor: '#1E3A5F',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 8,
  },
  submitTxt: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
});