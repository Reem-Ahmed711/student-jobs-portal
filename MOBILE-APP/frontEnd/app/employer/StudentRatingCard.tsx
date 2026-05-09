// MOBILE-APP/frontEnd/components/StudentRatingCard.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  ActivityIndicator,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface StudentRatingCardProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (rating: number, comment: string) => void;
  studentName: string;
  studentId: string;
  jobTitle?: string;
  submitting?: boolean;
}

const StudentRatingCard: React.FC<StudentRatingCardProps> = ({
  visible,
  onClose,
  onSubmit,
  studentName,
  studentId,
  jobTitle,
  submitting = false,
}) => {
  const [rating, setRating] = useState<number>(0);
  const [comment, setComment] = useState<string>('');
  const [selectedRating, setSelectedRating] = useState<number>(0);

  const handleRatingPress = (value: number) => {
    setRating(value);
    setSelectedRating(value);
  };

  const handleSubmit = () => {
    if (rating === 0) {
      alert('Please select a rating');
      return;
    }
    onSubmit(rating, comment);
    // Reset form
    setRating(0);
    setSelectedRating(0);
    setComment('');
  };

  const handleClose = () => {
    if (submitting) return;
    setRating(0);
    setSelectedRating(0);
    setComment('');
    onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={handleClose}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            {/* Header */}
            <View style={styles.header}>
              <Text style={styles.title}>Rate Student</Text>
              <TouchableOpacity onPress={handleClose} disabled={submitting} style={styles.closeButton}>
                <Ionicons name="close" size={24} color={submitting ? "#D1D5DB" : "#6B7280"} />
              </TouchableOpacity>
            </View>

            {/* Student Info - WITHOUT ID (cleaner UI) */}
            <View style={styles.studentInfo}>
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{studentName.charAt(0)}</Text>
              </View>
              <View style={styles.studentDetails}>
                <Text style={styles.studentName}>{studentName}</Text>
                {jobTitle && <Text style={styles.jobTitle}>{jobTitle}</Text>}
              </View>
            </View>

            {/* Rating Stars */}
            <View style={styles.ratingContainer}>
              <Text style={styles.label}>Your Rating</Text>
              <View style={styles.starsContainer}>
                {[1, 2, 3, 4, 5].map((star) => (
                  <TouchableOpacity
                    key={star}
                    onPress={() => handleRatingPress(star)}
                    activeOpacity={0.7}
                    disabled={submitting}
                  >
                    <Ionicons
                      name={star <= selectedRating ? "star" : "star-outline"}
                      size={40}
                      color={star <= selectedRating ? "#FBBF24" : "#D1D5DB"}
                      style={styles.star}
                    />
                  </TouchableOpacity>
                ))}
              </View>
              {selectedRating > 0 && (
                <Text style={styles.ratingText}>
                  {selectedRating} of 5 stars
                </Text>
              )}
            </View>

            {/* Comment Input */}
            <View style={styles.commentContainer}>
              <Text style={styles.label}>Your Comment</Text>
              <TextInput
                style={styles.commentInput}
                placeholder="Share your experience with this student..."
                placeholderTextColor="#9CA3AF"
                value={comment}
                onChangeText={setComment}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                editable={!submitting}
              />
              <Text style={styles.commentHint}>
                Optional: Provide feedback about work ethic, punctuality, skills, etc.
              </Text>
            </View>

            {/* Submit Button */}
            <TouchableOpacity
              style={[styles.submitButton, (rating === 0 || submitting) && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={rating === 0 || submitting}
            >
              {submitting ? (
                <ActivityIndicator color="#FFFFFF" size="small" />
              ) : (
                <Text style={styles.submitButtonText}>Submit Rating</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    width: '90%',
    maxWidth: 400,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1E3A5F',
  },
  closeButton: {
    padding: 4,
  },
  studentInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  avatar: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E3A5F',
  },
  studentDetails: {
    flex: 1,
  },
  studentName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 2,
  },
  jobTitle: {
    fontSize: 12,
    color: '#1E3A5F',
    marginTop: 2,
    fontWeight: '500',
  },
  ratingContainer: {
    marginBottom: 24,
    alignItems: 'center',
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 12,
    alignSelf: 'flex-start',
  },
  starsContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 8,
  },
  star: {
    marginHorizontal: 6,
  },
  ratingText: {
    fontSize: 13,
    color: '#6B7280',
    marginTop: 8,
  },
  commentContainer: {
    marginBottom: 24,
  },
  commentInput: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 12,
    padding: 12,
    fontSize: 14,
    color: '#111827',
    minHeight: 100,
    backgroundColor: '#F9FAFB',
  },
  commentHint: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 6,
  },
  submitButton: {
    backgroundColor: '#1E3A5F',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    backgroundColor: '#D1D5DB',
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default StudentRatingCard;