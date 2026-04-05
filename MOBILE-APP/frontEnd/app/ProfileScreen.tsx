import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  TextInput,
  Platform,
  Image,
  Modal,
  KeyboardAvoidingView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ─── Types ─────────────────────────────────────────────────────────────────
type TabKey = 'home' | 'jobs' | 'applications' | 'profile' | 'more';

interface ProfileData {
  name: string;
  department: string;
  gpa: string;
  year: string;
  email: string;
  phone: string;
  studentId: string;
  photo: string | null;
}

// ─── Save/Load Helpers ─────────────────────────────────────────────────────
const saveProfileData = async (data: ProfileData) => {
  const json = JSON.stringify(data);
  try {
    await AsyncStorage.setItem('userData', json);
  } catch (_) {}
};

const loadProfileData = async (): Promise<Partial<ProfileData>> => {
  try {
    const stored = await AsyncStorage.getItem('userData');
    if (stored) return JSON.parse(stored);
  } catch (_) {}
  return {};
};

// ─── Bottom Tab Bar ────────────────────────────────────────────────────────
const BottomTabBar: React.FC<{ active: TabKey; onPress: (k: TabKey) => void }> = ({ active, onPress }) => {
  const tabs: { key: TabKey; label: string }[] = [
    { key: 'home',         label: 'Home' },
    { key: 'jobs',         label: 'Jobs' },
    { key: 'applications', label: 'Applications' },
    { key: 'profile',      label: 'Profile' },
    { key: 'more',         label: 'More' },
  ];

  const getIcon = (key: TabKey, isActive: boolean) => {
    const color = isActive ? '#2563EB' : '#9CA3AF';
    switch (key) {
      case 'home':         return <Ionicons name={isActive ? 'home' : 'home-outline'} size={23} color={color} />;
      case 'jobs':         return <MaterialCommunityIcons name="briefcase-outline" size={23} color={color} />;
      case 'applications': return <Ionicons name={isActive ? 'document-text' : 'document-text-outline'} size={23} color={color} />;
      case 'profile':      return <Ionicons name={isActive ? 'person' : 'person-outline'} size={23} color={color} />;
      case 'more':         return <Feather name="more-horizontal" size={23} color={color} />;
    }
  };

  return (
    <View style={styles.tabBar}>
      {tabs.map((tab) => (
        <TouchableOpacity key={tab.key} style={styles.tabItem} onPress={() => onPress(tab.key)}>
          {getIcon(tab.key, active === tab.key)}
          <Text style={[styles.tabLabel, active === tab.key && styles.tabLabelActive]}>
            {tab.label}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

// ─── Edit Modal ────────────────────────────────────────────────────────────
interface EditModalProps {
  visible: boolean;
  profile: ProfileData;
  onSave: (data: ProfileData) => void;
  onClose: () => void;
}

const EditModal: React.FC<EditModalProps> = ({ visible, profile, onSave, onClose }) => {
  const [form, setForm] = useState<ProfileData>(profile);

  useEffect(() => { setForm(profile); }, [profile]);

  const update = (key: keyof ProfileData, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  const Field = ({ label, field, keyboard = 'default' }: {
    label: string;
    field: keyof ProfileData;
    keyboard?: any;
  }) => (
    <View style={styles.modalField}>
      <Text style={styles.modalFieldLabel}>{label}</Text>
      <TextInput
        style={styles.modalInput}
        value={form[field] as string}
        onChangeText={(v) => update(field, v)}
        keyboardType={keyboard}
        placeholderTextColor="#9CA3AF"
        autoCorrect={false}
        autoCapitalize="none"
      />
    </View>
  );

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={{ flex: 1 }}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Profile</Text>
              <TouchableOpacity onPress={onClose}>
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <ScrollView
              showsVerticalScrollIndicator={false}
              keyboardShouldPersistTaps="handled"
              contentContainerStyle={{ paddingBottom: 16 }}
            >
              <Field label="Full Name"     field="name" />
              <Field label="Department"    field="department" />
              <Field label="Academic Year" field="year" />
              <Field label="GPA"           field="gpa"   keyboard="decimal-pad" />
              <Field label="Email"         field="email" keyboard="email-address" />
              <Field label="Phone"         field="phone" keyboard="phone-pad" />
              <Field label="Student ID"    field="studentId" />
            </ScrollView>

            <TouchableOpacity
              style={styles.saveBtn}
              onPress={() => onSave(form)}
              activeOpacity={0.85}
            >
              <Text style={styles.saveBtnText}>Save Changes</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </Modal>
  );
};

// ─── Main Screen ───────────────────────────────────────────────────────────
const ProfileScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('profile');
  const [editVisible, setEditVisible] = useState(false);
  const router = useRouter();
  const params = useLocalSearchParams();

  const [profile, setProfile] = useState<ProfileData>({
    name:       (params.name as string)       || 'Student',
    department: (params.department as string) || 'Department',
    gpa:        (params.gpa as string)        || '-',
    year:       (params.year as string)       || '-',
    email:      (params.email as string)      || 'student@university.edu',
    phone:      '',
    studentId:  '',
    photo:      null,
  });

  useEffect(() => {
    loadProfileData().then((saved) => {
      if (saved && Object.keys(saved).length > 0) {
        setProfile(prev => ({ ...prev, ...saved }));
      }
    });
  }, []);

  const firstName = profile.name.split(' ')[0];
  const initial   = firstName.charAt(0).toUpperCase();

  // ── Pick Photo ────────────────────────────────────────────────────────
  const handlePickPhoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      const uri = result.assets[0].uri;
      const updated = { ...profile, photo: uri };
      setProfile(updated);
      saveProfileData(updated);
    }
  };

  // ── Save Edit ─────────────────────────────────────────────────────────
  const handleSave = async (data: ProfileData) => {
    setProfile(data);
    await saveProfileData(data);
    setEditVisible(false);
  };

  // ✅ الإصلاح: استبدال window.confirm بـ Alert.alert
  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('userData');
            } catch (_) {}
            router.replace('/login');
          },
        },
      ]
    );
  };

  // ── Tab Press ─────────────────────────────────────────────────────────
  const handleTabPress = (key: TabKey) => {
    setActiveTab(key);

    const userData = {
      name:       profile.name,
      department: profile.department,
      gpa:        profile.gpa,
      year:       profile.year,
      email:      profile.email,
    };

    switch (key) {
      case 'home':
        router.push({ pathname: '/StudentDashboard', params: userData });
        break;
      case 'jobs':
        router.push({ pathname: '/JobsScreen', params: userData });
        break;
      case 'applications':
        router.push({ pathname: '/ApplicationsScreen', params: userData });
        break;
      case 'more':
        router.push({ pathname: '/MoreScreen', params: userData });
        break;
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#2563EB" />

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* ── Blue Header ── */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.avatarWrap} onPress={handlePickPhoto}>
            {profile.photo ? (
              <Image source={{ uri: profile.photo }} style={styles.avatarImage} />
            ) : (
              <View style={styles.avatarCircle}>
                <Text style={styles.avatarInitial}>{initial}</Text>
              </View>
            )}
            <View style={styles.editAvatarBtn}>
              <Feather name="edit-2" size={11} color="#fff" />
            </View>
          </TouchableOpacity>

          <Text style={styles.headerName}>{profile.name}</Text>
          <Text style={styles.headerDept}>{profile.department}</Text>
          <Text style={styles.headerMeta}>{profile.year}  •  GPA: {profile.gpa}</Text>
        </View>

        {/* ── Stats Row ── */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>3</Text>
            <Text style={styles.statLabel}>Applied</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>2</Text>
            <Text style={styles.statLabel}>Saved</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>1</Text>
            <Text style={styles.statLabel}>Interviews</Text>
          </View>
        </View>

        {/* ── Contact Information ── */}
        <View style={styles.sectionLabel}>
          <Text style={styles.sectionLabelText}>CONTACT INFORMATION</Text>
        </View>

        <View style={styles.card}>
          <View style={styles.contactRow}>
            <View style={[styles.contactIconWrap, { backgroundColor: '#EFF6FF' }]}>
              <Ionicons name="mail-outline" size={18} color="#2563EB" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.contactLabel}>Email</Text>
              <Text style={styles.contactValue}>{profile.email}</Text>
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.contactRow}>
            <View style={[styles.contactIconWrap, { backgroundColor: '#F0FDF4' }]}>
              <Ionicons name="call-outline" size={18} color="#16A34A" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.contactLabel}>Phone</Text>
              <Text style={styles.contactValue}>{profile.phone || 'Not set'}</Text>
            </View>
          </View>
          <View style={styles.divider} />
          <View style={styles.contactRow}>
            <View style={[styles.contactIconWrap, { backgroundColor: '#F5F3FF' }]}>
              <Ionicons name="school-outline" size={18} color="#7C3AED" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.contactLabel}>Student ID</Text>
              <Text style={styles.contactValue}>{profile.studentId || 'Not set'}</Text>
            </View>
          </View>
        </View>

        {/* ── Settings ── */}
        <View style={styles.sectionLabel}>
          <Text style={styles.sectionLabelText}>SETTINGS</Text>
        </View>

        <View style={styles.card}>
          <TouchableOpacity style={styles.settingRow} onPress={() => setEditVisible(true)} activeOpacity={0.7}>
            <View style={styles.settingLeft}>
              <View style={styles.settingIconWrap}>
                <Ionicons name="person-outline" size={18} color="#2563EB" />
              </View>
              <Text style={styles.settingLabel}>Edit Profile</Text>
            </View>
            <Feather name="chevron-right" size={18} color="#9CA3AF" />
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.settingRow} activeOpacity={0.7}>
            <View style={styles.settingLeft}>
              <View style={styles.settingIconWrap}>
                <Ionicons name="document-text-outline" size={18} color="#2563EB" />
              </View>
              <Text style={styles.settingLabel}>My Documents</Text>
            </View>
            <Feather name="chevron-right" size={18} color="#9CA3AF" />
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.settingRow} activeOpacity={0.7}>
            <View style={styles.settingLeft}>
              <View style={styles.settingIconWrap}>
                <Ionicons name="notifications-outline" size={18} color="#2563EB" />
              </View>
              <Text style={styles.settingLabel}>Notifications</Text>
            </View>
            <Feather name="chevron-right" size={18} color="#9CA3AF" />
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.settingRow} activeOpacity={0.7}>
            <View style={styles.settingLeft}>
              <View style={styles.settingIconWrap}>
                <Ionicons name="lock-closed-outline" size={18} color="#2563EB" />
              </View>
              <Text style={styles.settingLabel}>Privacy & Security</Text>
            </View>
            <Feather name="chevron-right" size={18} color="#9CA3AF" />
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.settingRow} activeOpacity={0.7}>
            <View style={styles.settingLeft}>
              <View style={styles.settingIconWrap}>
                <Ionicons name="help-circle-outline" size={18} color="#2563EB" />
              </View>
              <Text style={styles.settingLabel}>Help & Support</Text>
            </View>
            <Feather name="chevron-right" size={18} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        {/* ── Logout ── */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.85}>
          <Ionicons name="log-out-outline" size={20} color="#DC2626" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        <View style={{ height: 24 }} />
      </ScrollView>

      <EditModal
        visible={editVisible}
        profile={profile}
        onSave={handleSave}
        onClose={() => setEditVisible(false)}
      />

      <BottomTabBar active={activeTab} onPress={handleTabPress} />
    </SafeAreaView>
  );
};

export default ProfileScreen;

// ─── Styles ────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F1F5F9' },
  scroll: { flex: 1 },

  header: {
    backgroundColor: '#2563EB',
    paddingTop: 30,
    paddingBottom: 30,
    alignItems: 'center',
  },
  avatarWrap: { position: 'relative', marginBottom: 14 },
  avatarCircle: {
    width: 90, height: 90, borderRadius: 45,
    backgroundColor: '#fff',
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 3, borderColor: 'rgba(255,255,255,0.5)',
  },
  avatarImage: {
    width: 90, height: 90, borderRadius: 45,
    borderWidth: 3, borderColor: 'rgba(255,255,255,0.5)',
  },
  avatarInitial: { fontSize: 36, fontWeight: '800', color: '#2563EB' },
  editAvatarBtn: {
    position: 'absolute', bottom: 2, right: 2,
    backgroundColor: '#2563EB', borderRadius: 12,
    width: 24, height: 24,
    justifyContent: 'center', alignItems: 'center',
    borderWidth: 2, borderColor: '#fff',
  },
  headerName: { color: '#fff', fontSize: 22, fontWeight: '800' },
  headerDept: { color: 'rgba(255,255,255,0.8)', fontSize: 14, marginTop: 4 },
  headerMeta: { color: 'rgba(255,255,255,0.7)', fontSize: 13, marginTop: 4 },

  statsRow: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: -20,
    borderRadius: 16,
    padding: 16,
    elevation: 5,
    marginBottom: 20,
  },
  statItem: { flex: 1, alignItems: 'center' },
  statNumber: { fontSize: 22, fontWeight: '800', color: '#111827' },
  statLabel: { fontSize: 12, color: '#6B7280', marginTop: 2 },
  statDivider: { width: 1, backgroundColor: '#E5E7EB', marginVertical: 4 },

  sectionLabel: { paddingHorizontal: 20, marginBottom: 8 },
  sectionLabelText: { fontSize: 11, fontWeight: '700', color: '#9CA3AF', letterSpacing: 1 },

  card: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    borderRadius: 16,
    paddingHorizontal: 16,
    marginBottom: 20,
    elevation: 2,
  },

  contactRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: 14, gap: 14,
  },
  contactIconWrap: {
    width: 38, height: 38, borderRadius: 10,
    justifyContent: 'center', alignItems: 'center',
  },
  contactLabel: { fontSize: 11, color: '#9CA3AF', marginBottom: 2 },
  contactValue: { fontSize: 14, fontWeight: '600', color: '#111827' },

  divider: { height: 1, backgroundColor: '#F3F4F6' },

  settingRow: {
    flexDirection: 'row', alignItems: 'center',
    justifyContent: 'space-between', paddingVertical: 16,
  },
  settingLeft: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  settingIconWrap: {
    width: 38, height: 38, borderRadius: 10,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center', alignItems: 'center',
  },
  settingLabel: { fontSize: 15, fontWeight: '500', color: '#111827' },

  logoutBtn: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'center',
    gap: 8, marginHorizontal: 16, paddingVertical: 16,
    borderRadius: 16, borderWidth: 1.5, borderColor: '#FECACA', backgroundColor: '#FFF',
  },
  logoutText: { fontSize: 15, fontWeight: '700', color: '#DC2626' },

  tabBar: {
    flexDirection: 'row', backgroundColor: '#fff',
    borderTopWidth: 1, borderTopColor: '#E5E7EB',
    paddingBottom: 8, paddingTop: 10, elevation: 8,
  },
  tabItem: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  tabLabel: { fontSize: 10, color: '#9CA3AF', marginTop: 3 },
  tabLabelActive: { color: '#2563EB', fontWeight: '600' },

  modalOverlay: {
    flex: 1, backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#fff', borderTopLeftRadius: 24, borderTopRightRadius: 24,
    padding: 24, maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row', justifyContent: 'space-between',
    alignItems: 'center', marginBottom: 20,
  },
  modalTitle: { fontSize: 18, fontWeight: '800', color: '#111827' },
  modalField: { marginBottom: 16 },
  modalFieldLabel: { fontSize: 12, fontWeight: '600', color: '#6B7280', marginBottom: 6 },
  modalInput: {
    backgroundColor: '#F8FAFF', borderRadius: 12,
    paddingHorizontal: 14, height: 48,
    borderWidth: 1.5, borderColor: '#E2E8F0',
    fontSize: 14, color: '#0F172A',
  },
  saveBtn: {
    backgroundColor: '#2563EB', borderRadius: 14,
    height: 52, alignItems: 'center', justifyContent: 'center',
    marginTop: 8,
  },
  saveBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },
});
