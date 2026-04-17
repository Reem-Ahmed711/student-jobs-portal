import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  TextInput, Switch, Alert, ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';

type Tab = 'profile' | 'notifications' | 'privacy' | 'security';

const TABS: { key: Tab; label: string; icon: string }[] = [
  { key: 'profile',       label: 'Profile',        icon: 'person-outline' },
  { key: 'notifications', label: 'Notifications',  icon: 'notifications-outline' },
  { key: 'privacy',       label: 'Privacy',        icon: 'lock-closed-outline' },
  { key: 'security',      label: 'Security',       icon: 'shield-outline' },
];

const EmployerSettings = () => {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<Tab>('profile');
  const [loading, setLoading] = useState(false);
  const [saved, setSaved] = useState(false);

  const [profileData, setProfileData] = useState({
    companyName: 'Physics Department',
    email: 'physics@cu.edu.eg',
    phone: '+20 123 456 7890',
    website: 'physics.cu.edu.eg',
    address: 'Faculty of Science, Cairo University',
    description: 'Leading physics department with cutting-edge research',
  });

  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    newApplications: true,
    interviewReminders: true,
    weeklyReports: false,
  });

  const [privacy, setPrivacy] = useState({
    profileVisible: true,
    showContact: true,
  });

  const [passwords, setPasswords] = useState({
    current: '', newPass: '', confirm: '',
  });

  const handleSave = () => {
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }, 1000);
  };

  // ── Input Field ─────────────────────────────────────────────────────────────
  const Field = ({
    label, value, onChangeText, placeholder = '', secureTextEntry = false, multiline = false,
  }: {
    label: string; value: string; onChangeText: (v: string) => void;
    placeholder?: string; secureTextEntry?: boolean; multiline?: boolean;
  }) => (
    <View style={styles.fieldWrap}>
      <Text style={styles.fieldLabel}>{label}</Text>
      <TextInput
        style={[styles.fieldInput, multiline && styles.fieldTextarea]}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#adb5bd"
        secureTextEntry={secureTextEntry}
        multiline={multiline}
        numberOfLines={multiline ? 4 : 1}
        textAlignVertical={multiline ? 'top' : 'center'}
      />
    </View>
  );

  // ── Toggle Row ───────────────────────────────────────────────────────────────
  const ToggleRow = ({
    label, subtitle, value, onToggle,
  }: { label: string; subtitle?: string; value: boolean; onToggle: () => void }) => (
    <View style={styles.toggleRow}>
      <View style={{ flex: 1 }}>
        <Text style={styles.toggleLabel}>{label}</Text>
        {subtitle ? <Text style={styles.toggleSub}>{subtitle}</Text> : null}
      </View>
      <Switch
        value={value}
        onValueChange={onToggle}
        trackColor={{ false: '#E2E8F0', true: '#0B2A4A' }}
        thumbColor="#fff"
      />
    </View>
  );

  // ── Tab Content ──────────────────────────────────────────────────────────────
  const renderProfile = () => (
    <>
      <Text style={styles.sectionTitle}>Company Information</Text>
      <Field label="Company Name" value={profileData.companyName}
        onChangeText={(v) => setProfileData(p => ({ ...p, companyName: v }))} />
      <Field label="Email" value={profileData.email}
        onChangeText={(v) => setProfileData(p => ({ ...p, email: v }))} />
      <Field label="Phone" value={profileData.phone}
        onChangeText={(v) => setProfileData(p => ({ ...p, phone: v }))} />
      <Field label="Website" value={profileData.website}
        onChangeText={(v) => setProfileData(p => ({ ...p, website: v }))} />
      <Field label="Address" value={profileData.address}
        onChangeText={(v) => setProfileData(p => ({ ...p, address: v }))} />
      <Field label="Description" value={profileData.description}
        onChangeText={(v) => setProfileData(p => ({ ...p, description: v }))} multiline />
      <View style={styles.btnRow}>
        <TouchableOpacity style={styles.resetBtn}
          onPress={() => setProfileData({
            companyName: 'Physics Department', email: 'physics@cu.edu.eg',
            phone: '+20 123 456 7890', website: 'physics.cu.edu.eg',
            address: 'Faculty of Science, Cairo University',
            description: 'Leading physics department with cutting-edge research',
          })}>
          <Text style={styles.resetBtnText}>Reset</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
          {loading
            ? <ActivityIndicator size="small" color="#fff" />
            : <Text style={styles.saveBtnText}>Save Changes</Text>}
        </TouchableOpacity>
      </View>
    </>
  );

  const renderNotifications = () => (
    <>
      <Text style={styles.sectionTitle}>Email Notifications</Text>
      <ToggleRow label="Receive email notifications"
        value={notifications.emailNotifications}
        onToggle={() => setNotifications(p => ({ ...p, emailNotifications: !p.emailNotifications }))} />
      <ToggleRow label="New applications"
        value={notifications.newApplications}
        onToggle={() => setNotifications(p => ({ ...p, newApplications: !p.newApplications }))} />
      <ToggleRow label="Interview reminders"
        value={notifications.interviewReminders}
        onToggle={() => setNotifications(p => ({ ...p, interviewReminders: !p.interviewReminders }))} />
      <ToggleRow label="Weekly reports"
        value={notifications.weeklyReports}
        onToggle={() => setNotifications(p => ({ ...p, weeklyReports: !p.weeklyReports }))} />
      <TouchableOpacity style={[styles.saveBtn, { marginTop: 24 }]} onPress={handleSave}>
        <Text style={styles.saveBtnText}>Save Preferences</Text>
      </TouchableOpacity>
    </>
  );

  const renderPrivacy = () => (
    <>
      <Text style={styles.sectionTitle}>Visibility</Text>
      <ToggleRow label="Make profile visible to students"
        subtitle="Students can see your department information"
        value={privacy.profileVisible}
        onToggle={() => setPrivacy(p => ({ ...p, profileVisible: !p.profileVisible }))} />
      <ToggleRow label="Show contact information"
        subtitle="Display email and phone to students"
        value={privacy.showContact}
        onToggle={() => setPrivacy(p => ({ ...p, showContact: !p.showContact }))} />
      <TouchableOpacity style={[styles.saveBtn, { marginTop: 24 }]} onPress={handleSave}>
        <Text style={styles.saveBtnText}>Save Privacy Settings</Text>
      </TouchableOpacity>
    </>
  );

  const renderSecurity = () => (
    <>
      <Text style={styles.sectionTitle}>Change Password</Text>
      <Field label="Current Password" value={passwords.current} secureTextEntry
        onChangeText={(v) => setPasswords(p => ({ ...p, current: v }))} />
      <Field label="New Password" value={passwords.newPass} secureTextEntry
        onChangeText={(v) => setPasswords(p => ({ ...p, newPass: v }))} />
      <Field label="Confirm New Password" value={passwords.confirm} secureTextEntry
        onChangeText={(v) => setPasswords(p => ({ ...p, confirm: v }))} />
      <TouchableOpacity style={[styles.saveBtn, { marginTop: 24 }]} onPress={() => {
        if (passwords.newPass !== passwords.confirm) {
          Alert.alert('Error', 'Passwords do not match');
          return;
        }
        handleSave();
      }}>
        <Text style={styles.saveBtnText}>Update Password</Text>
      </TouchableOpacity>
    </>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      {/* Top Bar */}
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={20} color="#0B2A4A" />
        </TouchableOpacity>
        <Text style={styles.topBarTitle}>Settings</Text>
        <View style={{ width: 36 }} />
      </View>

      {/* Success Banner */}
      {saved && (
        <View style={styles.successBanner}>
          <Ionicons name="checkmark-circle" size={16} color="#155724" />
          <Text style={styles.successText}>Settings saved successfully!</Text>
        </View>
      )}

      {/* Tab Bar */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabScroll}
        contentContainerStyle={styles.tabContent}>
        {TABS.map((t) => {
          const active = activeTab === t.key;
          return (
            <TouchableOpacity key={t.key} style={[styles.tab, active && styles.tabActive]}
              onPress={() => setActiveTab(t.key)}>
              <Ionicons name={t.icon as any} size={16} color={active ? '#fff' : '#64748b'} />
              <Text style={[styles.tabText, active && styles.tabTextActive]}>{t.label}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Content */}
      <ScrollView style={styles.scroll} contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <View style={styles.card}>
          {activeTab === 'profile'       && renderProfile()}
          {activeTab === 'notifications' && renderNotifications()}
          {activeTab === 'privacy'       && renderPrivacy()}
          {activeTab === 'security'      && renderSecurity()}
        </View>
      </ScrollView>
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

  successBanner: {
    flexDirection: 'row', alignItems: 'center', gap: 8,
    backgroundColor: '#d4edda', paddingHorizontal: 20, paddingVertical: 12,
  },
  successText: { color: '#155724', fontSize: 13, fontWeight: '600' },

  tabScroll: { flexGrow: 0, backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#f1f5f9' },
  tabContent: { paddingHorizontal: 16, paddingVertical: 12, gap: 8 },
  tab: {
    flexDirection: 'row', alignItems: 'center', gap: 6,
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20,
    borderWidth: 1.5, borderColor: '#E2E8F0', backgroundColor: '#fff',
  },
  tabActive: { backgroundColor: '#0B2A4A', borderColor: '#0B2A4A' },
  tabText: { fontSize: 13, fontWeight: '600', color: '#64748b' },
  tabTextActive: { color: '#fff' },

  scroll: { flex: 1 },
  scrollContent: { padding: 20, paddingBottom: 40 },
  card: {
    backgroundColor: '#fff', borderRadius: 16, padding: 20,
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 8, elevation: 3,
  },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: '#0B2A4A', marginBottom: 20 },

  fieldWrap: { marginBottom: 18 },
  fieldLabel: { fontSize: 13, fontWeight: '600', color: '#0B2A4A', marginBottom: 8 },
  fieldInput: {
    borderWidth: 1.5, borderColor: '#E2E8F0', borderRadius: 12,
    paddingHorizontal: 14, paddingVertical: 13, fontSize: 14, color: '#1e293b', backgroundColor: '#fff',
  },
  fieldTextarea: { height: 110, paddingTop: 12 },

  toggleRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingVertical: 14, borderBottomWidth: 1, borderBottomColor: '#f1f5f9',
  },
  toggleLabel: { fontSize: 14, fontWeight: '600', color: '#1e293b', marginBottom: 2 },
  toggleSub: { fontSize: 12, color: '#94a3b8' },

  btnRow: { flexDirection: 'row', gap: 12, marginTop: 24 },
  resetBtn: {
    flex: 1, paddingVertical: 14, borderRadius: 12,
    borderWidth: 1.5, borderColor: '#CBD5E1', alignItems: 'center',
  },
  resetBtnText: { fontSize: 14, fontWeight: '600', color: '#64748b' },
  saveBtn: {
    flex: 2, paddingVertical: 14, borderRadius: 12,
    backgroundColor: '#0B2A4A', alignItems: 'center', justifyContent: 'center',
  },
  saveBtnText: { fontSize: 14, fontWeight: '700', color: '#fff' },
});

export default EmployerSettings;