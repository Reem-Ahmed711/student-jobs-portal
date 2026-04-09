import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Dimensions,
  Alert,
  Platform,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

// ─── Types ───────────────────────────────────────────────────────────────────
interface FormData {
  title: string;
  department: string;
  type: string;
  deadline: string;
  description: string;
  duration: string;
  compensationType: string;
  hours: number;
}

// ─── Constants ────────────────────────────────────────────────────────────────
const DEPARTMENTS = ['Physics', 'Chemistry', 'Mathematics', 'Biology', 'Geology'];
const JOB_TYPES = ['Part-Time', 'Full-Time', 'Contract'];
const DURATIONS = ['One Semester', 'Two Semesters', 'Academic Year'];
const COMPENSATION_TYPES = ['Paid', 'Unpaid', 'Stipend'];
const ALL_SKILLS = [
  'Teaching', 'Research', 'Lab Work', 'Data Analysis',
  'Communication', 'Python', 'MATLAB', 'Statistics',
];

const STEPS = ['Details', 'Requirements', 'Schedule'];

// ─── Reusable Components ─────────────────────────────────────────────────────

const SelectPicker = ({
  label,
  options,
  value,
  onSelect,
}: {
  label: string;
  options: string[];
  value: string;
  onSelect: (val: string) => void;
}) => {
  const [open, setOpen] = useState(false);
  return (
    <View style={pickerStyles.wrapper}>
      <Text style={pickerStyles.label}>{label}</Text>
      <TouchableOpacity style={pickerStyles.trigger} onPress={() => setOpen(!open)}>
        <Text style={pickerStyles.triggerText}>{value}</Text>
        <Ionicons name={open ? 'chevron-up' : 'chevron-down'} size={16} color="#64748b" />
      </TouchableOpacity>
      {open && (
        <View style={pickerStyles.dropdown}>
          {options.map((opt) => (
            <TouchableOpacity
              key={opt}
              style={[pickerStyles.option, value === opt && pickerStyles.optionActive]}
              onPress={() => {
                onSelect(opt);
                setOpen(false);
              }}
            >
              <Text style={[pickerStyles.optionText, value === opt && pickerStyles.optionTextActive]}>
                {opt}
              </Text>
              {value === opt && <Ionicons name="checkmark" size={16} color="#0B2A4A" />}
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

const pickerStyles = StyleSheet.create({
  wrapper: { marginBottom: 20 },
  label: { fontSize: 13, fontWeight: '600', color: '#0B2A4A', marginBottom: 8 },
  trigger: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    borderWidth: 1.5, borderColor: '#E2E8F0', borderRadius: 12,
    paddingHorizontal: 14, paddingVertical: 13, backgroundColor: '#fff',
  },
  triggerText: { fontSize: 14, color: '#1e293b' },
  dropdown: {
    borderWidth: 1.5, borderColor: '#E2E8F0', borderRadius: 12,
    backgroundColor: '#fff', marginTop: 4,
    shadowColor: '#000', shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08, shadowRadius: 8, elevation: 4,
    zIndex: 100,
  },
  option: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    paddingHorizontal: 14, paddingVertical: 12,
    borderBottomWidth: 1, borderBottomColor: '#f1f5f9',
  },
  optionActive: { backgroundColor: '#EBF0F9' },
  optionText: { fontSize: 14, color: '#64748b' },
  optionTextActive: { color: '#0B2A4A', fontWeight: '600' },
});

// ─── Main Component ──────────────────────────────────────────────────────────
const PostJob = () => {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  const [formData, setFormData] = useState<FormData>({
    title: '',
    department: 'Physics',
    type: 'Part-Time',
    deadline: '',
    description: '',
    duration: 'One Semester',
    compensationType: 'Paid',
    hours: 15,
  });

  const updateForm = (key: keyof FormData, value: string | number) =>
    setFormData((prev) => ({ ...prev, [key]: value }));

  const toggleSkill = (skill: string) =>
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );

  const handlePublish = () => {
    Alert.alert(
      '🎉 Job Posted!',
      'Your job posting has been published successfully.',
      [{ text: 'Back to Dashboard', onPress: () => router.back() }]
    );
  };

  // ─── Step 1: Basic Details ────────────────────────────────────────────────
  const renderStep1 = () => (
    <>
      <Text style={styles.stepHeading}>Basic Details</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Job Title *</Text>
        <TextInput
          style={styles.input}
          value={formData.title}
          onChangeText={(v) => updateForm('title', v)}
          placeholder="e.g., Teaching Assistant - Physics 101"
          placeholderTextColor="#adb5bd"
        />
      </View>

      <SelectPicker
        label="Department *"
        options={DEPARTMENTS}
        value={formData.department}
        onSelect={(v) => updateForm('department', v)}
      />

      <SelectPicker
        label="Employment Type *"
        options={JOB_TYPES}
        value={formData.type}
        onSelect={(v) => updateForm('type', v)}
      />

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Application Deadline *</Text>
        <TextInput
          style={styles.input}
          value={formData.deadline}
          onChangeText={(v) => updateForm('deadline', v)}
          placeholder="e.g., 2026-03-15"
          placeholderTextColor="#adb5bd"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Job Description *</Text>
        <TextInput
          style={[styles.input, styles.textarea]}
          value={formData.description}
          onChangeText={(v) => updateForm('description', v)}
          placeholder="Describe the role and what the position entails..."
          placeholderTextColor="#adb5bd"
          multiline
          numberOfLines={5}
          textAlignVertical="top"
        />
      </View>
    </>
  );

  // ─── Step 2: Skills ───────────────────────────────────────────────────────
  const renderStep2 = () => (
    <>
      <Text style={styles.stepHeading}>Skills Needed</Text>
      <Text style={styles.stepSubtext}>Select all that apply</Text>

      <View style={styles.skillsGrid}>
        {ALL_SKILLS.map((skill) => {
          const active = selectedSkills.includes(skill);
          return (
            <TouchableOpacity
              key={skill}
              onPress={() => toggleSkill(skill)}
              style={[styles.skillChip, active && styles.skillChipActive]}
            >
              {active && <Ionicons name="checkmark-circle" size={14} color="#fff" style={{ marginRight: 4 }} />}
              <Text style={[styles.skillChipText, active && styles.skillChipTextActive]}>{skill}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

      {selectedSkills.length > 0 && (
        <View style={styles.selectedSkillsBox}>
          <Text style={styles.selectedSkillsLabel}>
            {selectedSkills.length} skill{selectedSkills.length > 1 ? 's' : ''} selected
          </Text>
          <View style={styles.selectedSkillsRow}>
            {selectedSkills.map((s) => (
              <View key={s} style={styles.selectedSkillBadge}>
                <Text style={styles.selectedSkillBadgeText}>{s}</Text>
              </View>
            ))}
          </View>
        </View>
      )}
    </>
  );

  // ─── Step 3: Schedule & Compensation ─────────────────────────────────────
  const renderStep3 = () => (
    <>
      <Text style={styles.stepHeading}>Schedule & Compensation</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.inputLabel}>Hours per Week</Text>
        <View style={styles.hoursRow}>
          <TouchableOpacity
            style={styles.hoursBtn}
            onPress={() => updateForm('hours', Math.max(0, formData.hours - 1))}
          >
            <Ionicons name="remove" size={18} color="#0B2A4A" />
          </TouchableOpacity>
          <View style={styles.hoursDisplay}>
            <Text style={styles.hoursNumber}>{formData.hours}</Text>
            <Text style={styles.hoursUnit}>hrs/week</Text>
          </View>
          <TouchableOpacity
            style={styles.hoursBtn}
            onPress={() => updateForm('hours', Math.min(40, formData.hours + 1))}
          >
            <Ionicons name="add" size={18} color="#0B2A4A" />
          </TouchableOpacity>
        </View>
        <View style={styles.hoursTrack}>
          <View style={[styles.hoursFill, { width: `${(formData.hours / 40) * 100}%` }]} />
        </View>
        <View style={styles.hoursRange}>
          <Text style={styles.hoursRangeText}>0</Text>
          <Text style={styles.hoursRangeText}>40+</Text>
        </View>
      </View>

      <SelectPicker
        label="Duration *"
        options={DURATIONS}
        value={formData.duration}
        onSelect={(v) => updateForm('duration', v)}
      />

      <SelectPicker
        label="Compensation Type *"
        options={COMPENSATION_TYPES}
        value={formData.compensationType}
        onSelect={(v) => updateForm('compensationType', v)}
      />

      {/* Preview Summary */}
      <View style={styles.previewCard}>
        <Text style={styles.previewTitle}>📋 Posting Summary</Text>
        <View style={styles.previewRow}>
          <Text style={styles.previewKey}>Title</Text>
          <Text style={styles.previewVal}>{formData.title || '—'}</Text>
        </View>
        <View style={styles.previewRow}>
          <Text style={styles.previewKey}>Department</Text>
          <Text style={styles.previewVal}>{formData.department}</Text>
        </View>
        <View style={styles.previewRow}>
          <Text style={styles.previewKey}>Type</Text>
          <Text style={styles.previewVal}>{formData.type}</Text>
        </View>
        <View style={styles.previewRow}>
          <Text style={styles.previewKey}>Hours</Text>
          <Text style={styles.previewVal}>{formData.hours} hrs/week</Text>
        </View>
        <View style={styles.previewRow}>
          <Text style={styles.previewKey}>Duration</Text>
          <Text style={styles.previewVal}>{formData.duration}</Text>
        </View>
        <View style={styles.previewRow}>
          <Text style={styles.previewKey}>Compensation</Text>
          <Text style={styles.previewVal}>{formData.compensationType}</Text>
        </View>
        {selectedSkills.length > 0 && (
          <View style={styles.previewRow}>
            <Text style={styles.previewKey}>Skills</Text>
            <Text style={styles.previewVal}>{selectedSkills.join(', ')}</Text>
          </View>
        )}
      </View>
    </>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* ── Top Bar ── */}
      <View style={styles.topBar}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={20} color="#0B2A4A" />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>Post a Job</Text>
        <View style={{ width: 36 }} />
      </View>

      {/* ── Step Indicator ── */}
      <View style={styles.stepIndicator}>
        {STEPS.map((label, idx) => {
          const num = idx + 1;
          const done = num < step;
          const active = num === step;
          return (
            <React.Fragment key={label}>
              <View style={styles.stepItem}>
                <View style={[styles.stepCircle, active && styles.stepCircleActive, done && styles.stepCircleDone]}>
                  {done
                    ? <Ionicons name="checkmark" size={14} color="#fff" />
                    : <Text style={[styles.stepNum, (active || done) && styles.stepNumActive]}>{num}</Text>
                  }
                </View>
                <Text style={[styles.stepLabel, active && styles.stepLabelActive]}>{label}</Text>
              </View>
              {idx < STEPS.length - 1 && (
                <View style={[styles.stepLine, done && styles.stepLineDone]} />
              )}
            </React.Fragment>
          );
        })}
      </View>

      {/* ── Form ── */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.card}>
          {step === 1 && renderStep1()}
          {step === 2 && renderStep2()}
          {step === 3 && renderStep3()}
        </View>

        {/* ── Navigation Buttons ── */}
        <View style={styles.navButtons}>
          {step > 1 && (
            <TouchableOpacity
              style={styles.prevBtn}
              onPress={() => setStep((s) => s - 1)}
            >
              <Ionicons name="arrow-back" size={16} color="#0B2A4A" />
              <Text style={styles.prevBtnText}>Previous</Text>
            </TouchableOpacity>
          )}
          <TouchableOpacity
            style={[styles.nextBtn, step === 1 && { flex: 1 }]}
            onPress={step < 3 ? () => setStep((s) => s + 1) : handlePublish}
          >
            <Text style={styles.nextBtnText}>
              {step < 3 ? 'Next Step' : '🚀 Publish Job'}
            </Text>
            {step < 3 && <Ionicons name="arrow-forward" size={16} color="#fff" style={{ marginLeft: 6 }} />}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#f8fafc' },

  // Top Bar
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

  // Step Indicator
  stepIndicator: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 24, paddingVertical: 20,
    backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#f1f5f9',
  },
  stepItem: { alignItems: 'center', flex: 0 },
  stepCircle: {
    width: 32, height: 32, borderRadius: 16,
    backgroundColor: '#E2E8F0', justifyContent: 'center', alignItems: 'center',
    marginBottom: 4,
  },
  stepCircleActive: { backgroundColor: '#0B2A4A' },
  stepCircleDone: { backgroundColor: '#10b981' },
  stepNum: { fontSize: 13, fontWeight: '700', color: '#94a3b8' },
  stepNumActive: { color: '#fff' },
  stepLabel: { fontSize: 11, color: '#94a3b8', fontWeight: '500' },
  stepLabelActive: { color: '#0B2A4A', fontWeight: '700' },
  stepLine: { flex: 1, height: 2, backgroundColor: '#E2E8F0', marginHorizontal: 6, marginBottom: 18 },
  stepLineDone: { backgroundColor: '#10b981' },

  // Scroll
  scroll: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 40 },

  // Card
  card: {
    backgroundColor: '#fff', borderRadius: 16, padding: 20,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 8, elevation: 3,
    marginBottom: 20,
  },
  stepHeading: { fontSize: 18, fontWeight: '700', color: '#0B2A4A', marginBottom: 4 },
  stepSubtext: { fontSize: 13, color: '#94a3b8', marginBottom: 20 },

  // Input
  inputGroup: { marginBottom: 20 },
  inputLabel: { fontSize: 13, fontWeight: '600', color: '#0B2A4A', marginBottom: 8 },
  input: {
    borderWidth: 1.5, borderColor: '#E2E8F0', borderRadius: 12,
    paddingHorizontal: 14, paddingVertical: 13,
    fontSize: 14, color: '#1e293b', backgroundColor: '#fff',
  },
  textarea: { height: 120, paddingTop: 12 },

  // Skills
  skillsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginTop: 8, marginBottom: 20 },
  skillChip: {
    flexDirection: 'row', alignItems: 'center',
    paddingHorizontal: 14, paddingVertical: 8,
    borderRadius: 20, borderWidth: 1.5, borderColor: '#CBD5E1',
    backgroundColor: '#fff',
  },
  skillChipActive: { backgroundColor: '#0B2A4A', borderColor: '#0B2A4A' },
  skillChipText: { fontSize: 13, color: '#64748b', fontWeight: '500' },
  skillChipTextActive: { color: '#fff', fontWeight: '600' },
  selectedSkillsBox: {
    backgroundColor: '#EBF0F9', borderRadius: 12,
    padding: 14, marginTop: 4,
  },
  selectedSkillsLabel: { fontSize: 12, color: '#0B2A4A', fontWeight: '700', marginBottom: 8 },
  selectedSkillsRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  selectedSkillBadge: {
    backgroundColor: '#0B2A4A', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 10,
  },
  selectedSkillBadgeText: { color: '#fff', fontSize: 11, fontWeight: '600' },

  // Hours
  hoursRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 20, marginBottom: 14,
  },
  hoursBtn: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: '#EBF0F9', justifyContent: 'center', alignItems: 'center',
  },
  hoursDisplay: { alignItems: 'center' },
  hoursNumber: { fontSize: 28, fontWeight: '800', color: '#0B2A4A' },
  hoursUnit: { fontSize: 11, color: '#94a3b8', fontWeight: '500' },
  hoursTrack: {
    height: 6, backgroundColor: '#E2E8F0', borderRadius: 3,
    overflow: 'hidden', marginBottom: 6,
  },
  hoursFill: { height: '100%', backgroundColor: '#0B2A4A', borderRadius: 3 },
  hoursRange: { flexDirection: 'row', justifyContent: 'space-between' },
  hoursRangeText: { fontSize: 11, color: '#94a3b8' },

  // Preview Summary
  previewCard: {
    backgroundColor: '#f8fafc', borderRadius: 12,
    borderWidth: 1, borderColor: '#E2E8F0', padding: 16, marginTop: 24,
  },
  previewTitle: { fontSize: 14, fontWeight: '700', color: '#0B2A4A', marginBottom: 12 },
  previewRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    paddingVertical: 7, borderBottomWidth: 1, borderBottomColor: '#f1f5f9',
  },
  previewKey: { fontSize: 13, color: '#94a3b8', fontWeight: '500', flex: 1 },
  previewVal: { fontSize: 13, color: '#1e293b', fontWeight: '600', flex: 2, textAlign: 'right' },

  // Nav Buttons
  navButtons: { flexDirection: 'row', gap: 12 },
  prevBtn: {
    flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingVertical: 14, borderRadius: 12,
    borderWidth: 1.5, borderColor: '#CBD5E1', backgroundColor: '#fff', gap: 6,
  },
  prevBtnText: { fontSize: 14, fontWeight: '600', color: '#0B2A4A' },
  nextBtn: {
    flex: 2, flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    paddingVertical: 14, borderRadius: 12, backgroundColor: '#0B2A4A',
  },
  nextBtnText: { fontSize: 14, fontWeight: '700', color: '#fff' },
});

export default PostJob;
