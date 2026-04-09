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
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
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
  cvName: string | null;
  bio: string;
  skills: string[];
}

// ─── Edit Modal ────────────────────────────────────────────────────────────
interface EditModalProps {
  visible: boolean;
  profile: ProfileData;
  onSave: (data: ProfileData) => void;
  onClose: () => void;
}

const EditModal: React.FC<EditModalProps> = ({ visible, profile, onSave, onClose }) => {
  const [form, setForm] = useState<ProfileData>(profile);

  useEffect(() => {
    if (visible) setForm(profile);
  }, [visible, profile]);

  const updateField = (key: keyof ProfileData, value: string) => {
    setForm(prev => ({ ...prev, [key]: value }));
  };

  return (
    <Modal visible={visible} animationType="slide" transparent>
      <View style={styles.modalOverlay}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.modalContainer}
        >
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Edit Profile</Text>
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color="#6B7280" />
            </TouchableOpacity>
          </View>

          <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
            <View style={styles.modalField}>
              <Text style={styles.modalFieldLabel}>Full Name</Text>
              <TextInput style={styles.modalInput} value={form.name} onChangeText={(v) => updateField('name', v)} />
            </View>

            <View style={styles.modalRow}>
               <View style={[styles.modalField, { flex: 1, marginRight: 10 }]}>
                 <Text style={styles.modalFieldLabel}>Year</Text>
                 <TextInput style={styles.modalInput} value={form.year} onChangeText={(v) => updateField('year', v)} placeholder="e.g. 3rd Year" />
               </View>
               <View style={[styles.modalField, { flex: 1 }]}>
                 <Text style={styles.modalFieldLabel}>GPA</Text>
                 <TextInput style={styles.modalInput} value={form.gpa} onChangeText={(v) => updateField('gpa', v)} placeholder="e.g. 3.8" keyboardType="numeric" />
               </View>
            </View>

            {/* الحقل الجديد للـ Student ID */}
            <View style={styles.modalField}>
              <Text style={styles.modalFieldLabel}>Student ID</Text>
              <TextInput style={styles.modalInput} value={form.studentId} onChangeText={(v) => updateField('studentId', v)} keyboardType="numeric" />
            </View>

            <View style={styles.modalField}>
              <Text style={styles.modalFieldLabel}>Department</Text>
              <TextInput style={styles.modalInput} value={form.department} onChangeText={(v) => updateField('department', v)} />
            </View>

            <View style={styles.modalField}>
              <Text style={styles.modalFieldLabel}>Phone Number</Text>
              <TextInput style={styles.modalInput} value={form.phone} onChangeText={(v) => updateField('phone', v)} keyboardType="phone-pad" />
            </View>

            <View style={styles.modalField}>
              <Text style={styles.modalFieldLabel}>Bio</Text>
              <TextInput style={[styles.modalInput, { height: 70 }]} value={form.bio} onChangeText={(v) => updateField('bio', v)} multiline />
            </View>
          </ScrollView>

          <TouchableOpacity style={styles.saveBtn} onPress={() => onSave(form)}>
            <Text style={styles.saveBtnText}>Save Changes</Text>
          </TouchableOpacity>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

// ─── Main Screen ───────────────────────────────────────────────────────────
const ProfileScreen: React.FC = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [activeTab, setActiveTab] = useState<TabKey>('profile');
  const [editVisible, setEditVisible] = useState(false);

  const [profile, setProfile] = useState<ProfileData>({
    name: (params.name as string) || 'Sozan Mahmoud',
    department: (params.department as string) || 'Accounting',
    gpa: (params.gpa as string) || '3.5',
    year: (params.year as string) || '3rd Year',
    email: (params.email as string) || 'mah@gmail.com',
    phone: '',
    studentId: '20210542',
    photo: null,
    cvName: 'My_Resume.pdf',
    bio: 'Accounting student with a strong interest in software development.',
    skills: ['React Native', 'Java', 'Accounting', 'UI/UX'],
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        const stored = await AsyncStorage.getItem('userData');
        if (stored) setProfile(prev => ({ ...prev, ...JSON.parse(stored) }));
      } catch (e) { console.error(e); }
    };
    loadData();
  }, []);

  const handleTabPress = (key: TabKey) => {
    setActiveTab(key);
    if (key === 'profile') return;
    const pathMap: Record<string, string> = {
      home: '/StudentDashboard',
      jobs: '/JobsScreen',
      applications: '/ApplicationsScreen',
      more: '/MoreScreen'
    };
    if (pathMap[key]) {
      router.push({ pathname: pathMap[key] as any, params: { ...profile } as any });
    }
  };

  const handleSave = async (updatedData: ProfileData) => {
    setProfile(updatedData);
    await AsyncStorage.setItem('userData', JSON.stringify(updatedData));
    setEditVisible(false);
  };

  const handlePickPhoto = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') return;
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.7,
    });
    if (!result.canceled) {
      const newProfile = { ...profile, photo: result.assets[0].uri };
      setProfile(newProfile);
      await AsyncStorage.setItem('userData', JSON.stringify(newProfile));
    }
  };

  const handlePickCV = async () => {
    const result = await DocumentPicker.getDocumentAsync({ type: 'application/pdf' });
    if (!result.canceled) {
      setProfile(prev => ({ ...prev, cvName: result.assets[0].name }));
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#1E3A5F" />
      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        
        {/* Header Section */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.avatarWrap} onPress={handlePickPhoto}>
            {profile.photo ? (
              <Image source={{ uri: profile.photo }} style={styles.avatarImage} />
            ) : (
              <View style={styles.avatarCircle}>
                <Text style={styles.avatarInitial}>{profile.name.charAt(0).toUpperCase()}</Text>
              </View>
            )}
            <View style={styles.editAvatarBtn}><Feather name="camera" size={12} color="#fff" /></View>
          </TouchableOpacity>
          <Text style={styles.headerName}>{profile.name}</Text>
          <Text style={styles.headerDept}>{profile.department}</Text>
          <Text style={styles.headerGpa}>{profile.year} • GPA: {profile.gpa}</Text>
        </View>

        {/* Stats Section */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}><Text style={styles.statNumber}>3</Text><Text style={styles.statLabel}>Applied</Text></View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}><Text style={styles.statNumber}>2</Text><Text style={styles.statLabel}>Saved</Text></View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}><Text style={styles.statNumber}>1</Text><Text style={styles.statLabel}>Interviews</Text></View>
        </View>

        {/* CV Section */}
        <View style={styles.sectionLabel}><Text style={styles.sectionLabelText}>MY CURRICULUM VITAE (CV)</Text></View>
        <View style={styles.card}>
          <View style={styles.cvRow}>
            <View style={styles.cvIconBox}>
              <MaterialCommunityIcons name="file-pdf-box" size={32} color="#DC2626" />
            </View>
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.cvName} numberOfLines={1}>{profile.cvName || 'No CV Uploaded'}</Text>
              <Text style={styles.cvStatus}>{profile.cvName ? 'Ready to apply' : 'Please upload your resume'}</Text>
            </View>
            <TouchableOpacity style={styles.cvActionBtn} onPress={handlePickCV}>
              <Feather name={profile.cvName ? "eye" : "upload"} size={18} color="#1E3A5F" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Contact Information (تظهر فيها التعديلات فوراً) */}
        <View style={styles.sectionLabel}><Text style={styles.sectionLabelText}>CONTACT INFORMATION</Text></View>
        <View style={styles.card}>
          <ContactItem icon="mail-outline" label="Email" value={profile.email} color="#1E40AF" bg="#DBEAFE" />
          <View style={styles.divider} />
          <ContactItem icon="call-outline" label="Phone" value={profile.phone || 'Not set'} color="#16A34A" bg="#DCFCE7" />
          <View style={styles.divider} />
          <ContactItem icon="school-outline" label="Student ID" value={profile.studentId || 'Not set'} color="#7C3AED" bg="#F3E8FF" />
        </View>

        {/* Skills Section */}
        <View style={styles.sectionLabel}><Text style={styles.sectionLabelText}>SKILLS</Text></View>
        <View style={[styles.card, styles.skillsGrid]}>
          {profile.skills.map((s, i) => (
            <View key={i} style={styles.skillChip}><Text style={styles.skillChipText}>{s}</Text></View>
          ))}
        </View>

        {/* Settings Section */}
        <View style={styles.sectionLabel}><Text style={styles.sectionLabelText}>SETTINGS</Text></View>
        <View style={styles.card}>
          <TouchableOpacity style={styles.settingRow} onPress={() => setEditVisible(true)}>
            <View style={styles.settingLeft}>
              <View style={styles.settingIconWrap}><Ionicons name="person-outline" size={18} color="#1E40AF" /></View>
              <Text style={styles.settingLabel}>Edit Profile</Text>
            </View>
            <Feather name="chevron-right" size={18} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity style={styles.logoutBtn}>
           <Ionicons name="log-out-outline" size={20} color="#DC2626" />
           <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        <View style={{ height: 100 }} />
      </ScrollView>

      <EditModal visible={editVisible} profile={profile} onSave={handleSave} onClose={() => setEditVisible(false)} />

      {/* Tab Bar Section */}
      <View style={styles.tabBar}>
        {(['home', 'jobs', 'applications', 'profile', 'more'] as TabKey[]).map((t) => {
          let iconName: any = t;
          if (t === 'home') iconName = activeTab === t ? 'home' : 'home-outline';
          else if (t === 'jobs') iconName = activeTab === t ? 'briefcase' : 'briefcase-outline';
          else if (t === 'applications') iconName = activeTab === t ? 'document-text' : 'document-text-outline';
          else if (t === 'profile') iconName = activeTab === t ? 'person' : 'person-outline';
          else if (t === 'more') iconName = 'ellipsis-horizontal';

          return (
            <TouchableOpacity key={t} style={styles.tabItem} onPress={() => handleTabPress(t)}>
              <Ionicons name={iconName} size={22} color={activeTab === t ? '#1E3A5F' : '#9CA3AF'} />
              <Text style={[styles.tabLabel, activeTab === t && styles.tabLabelActive]}>
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
};

const ContactItem = ({ icon, label, value, color, bg }: any) => (
  <View style={styles.contactRow}>
    <View style={[styles.contactIconWrap, { backgroundColor: bg }]}>
      <Ionicons name={icon} size={18} color={color} />
    </View>
    <View>
      <Text style={styles.contactLabel}>{label}</Text>
      <Text style={styles.contactValue}>{value}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F8FAFC' },
  scroll: { flex: 1 },
  header: { backgroundColor: '#1E3A5F', paddingVertical: 35, alignItems: 'center' },
  avatarWrap: { position: 'relative' },
  avatarCircle: { width: 85, height: 85, borderRadius: 45, backgroundColor: '#fff', justifyContent: 'center', alignItems: 'center' },
  avatarImage: { width: 85, height: 85, borderRadius: 45, borderWidth: 2, borderColor: '#fff' },
  avatarInitial: { fontSize: 32, fontWeight: 'bold', color: '#1E3A5F' },
  editAvatarBtn: { position: 'absolute', bottom: 0, right: 0, backgroundColor: '#1E3A5F', padding: 5, borderRadius: 15, borderWidth: 1.5, borderColor: '#fff' },
  headerName: { color: '#fff', fontSize: 22, fontWeight: 'bold', marginTop: 10 },
  headerDept: { color: '#CBD5E1', fontSize: 14, marginTop: 2 },
  headerGpa: { color: '#CBD5E1', fontSize: 13, marginTop: 4 },
  statsRow: { flexDirection: 'row', backgroundColor: '#fff', marginHorizontal: 20, marginTop: -25, borderRadius: 15, padding: 15, elevation: 4 },
  statItem: { flex: 1, alignItems: 'center' },
  statNumber: { fontSize: 18, fontWeight: 'bold', color: '#1E293B' },
  statLabel: { fontSize: 11, color: '#64748B' },
  statDivider: { width: 1, backgroundColor: '#E2E8F0', height: '60%' },
  sectionLabel: { marginHorizontal: 20, marginTop: 22, marginBottom: 8 },
  sectionLabelText: { fontSize: 11, fontWeight: 'bold', color: '#94A3B8', letterSpacing: 0.8 },
  card: { backgroundColor: '#fff', marginHorizontal: 20, borderRadius: 15, padding: 15, elevation: 1 },
  cvRow: { flexDirection: 'row', alignItems: 'center' },
  cvIconBox: { backgroundColor: '#FEF2F2', padding: 8, borderRadius: 10 },
  cvName: { fontSize: 14, fontWeight: '600', color: '#1E293B' },
  cvStatus: { fontSize: 12, color: '#94A3B8' },
  cvActionBtn: { backgroundColor: '#F1F5F9', padding: 10, borderRadius: 10 },
  contactRow: { flexDirection: 'row', alignItems: 'center', paddingVertical: 6, gap: 12 },
  contactIconWrap: { width: 34, height: 34, borderRadius: 8, justifyContent: 'center', alignItems: 'center' },
  contactLabel: { fontSize: 10, color: '#94A3B8' },
  contactValue: { fontSize: 13, fontWeight: '600', color: '#1E293B' },
  divider: { height: 1, backgroundColor: '#F1F5F9', marginVertical: 4 },
  skillsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 6 },
  skillChip: { backgroundColor: '#EFF6FF', paddingHorizontal: 10, paddingVertical: 5, borderRadius: 12 },
  skillChipText: { color: '#1E40AF', fontSize: 11, fontWeight: '600' },
  settingRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  settingLeft: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  settingIconWrap: { width: 34, height: 34, borderRadius: 8, backgroundColor: '#F1F5F9', justifyContent: 'center', alignItems: 'center' },
  settingLabel: { fontSize: 14, fontWeight: '600', color: '#1E293B' },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#FEE2E2', marginHorizontal: 20, marginTop: 20, padding: 14, borderRadius: 12, gap: 8 },
  logoutText: { color: '#DC2626', fontWeight: 'bold' },
  tabBar: { position: 'absolute', bottom: 0, left: 0, right: 0, height: 65, backgroundColor: '#fff', flexDirection: 'row', borderTopWidth: 1, borderTopColor: '#E2E8F0', paddingBottom: Platform.OS === 'ios' ? 15 : 0 },
  tabItem: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  tabLabel: { fontSize: 10, color: '#94A3B8', marginTop: 3 },
  tabLabelActive: { color: '#1E3A5F', fontWeight: 'bold' },
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  modalContainer: { backgroundColor: '#fff', borderTopLeftRadius: 25, borderTopRightRadius: 25, padding: 20, maxHeight: '85%' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 15 },
  modalTitle: { fontSize: 18, fontWeight: 'bold' },
  modalRow: { flexDirection: 'row' },
  modalField: { marginBottom: 12 },
  modalFieldLabel: { fontSize: 12, color: '#64748B', marginBottom: 4 },
  modalInput: { backgroundColor: '#F8FAFC', padding: 10, borderRadius: 8, borderWidth: 1, borderColor: '#E2E8F0', color: '#1E293B' },
  saveBtn: { backgroundColor: '#1E3A5F', padding: 14, borderRadius: 12, alignItems: 'center', marginTop: 10 },
  saveBtnText: { color: '#fff', fontWeight: 'bold' }
});

export default ProfileScreen;