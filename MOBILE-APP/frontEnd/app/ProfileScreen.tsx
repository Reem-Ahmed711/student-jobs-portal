// MOBILE-APP/frontEnd/app/ProfileScreen.tsx
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
  Modal,
  KeyboardAvoidingView,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUserRating, updateUserProfile } from '../src/api';

type TabKey = 'home' | 'jobs' | 'applications' | 'profile' | 'more';

interface ProfileData {
  uid: string;
  name: string;
  email: string;
  department: string;
  gpa: string;
  year: string;
  phone: string;
  skills: string[];
  about: string;
  profileImage: string;
}

const BottomTabBar: React.FC<{ active: TabKey; onPress: (k: TabKey) => void }> = ({ active, onPress }) => {
  const tabs: { key: TabKey; label: string }[] = [
    { key: 'home', label: 'Home' },
    { key: 'jobs', label: 'Jobs' },
    { key: 'applications', label: 'Applications' },
    { key: 'profile', label: 'Profile' },
    { key: 'more', label: 'More' },
  ];

  const getIcon = (key: TabKey, isActive: boolean) => {
    const color = isActive ? '#1E3A5F' : '#9CA3AF';
    switch (key) {
      case 'home': return <Ionicons name={isActive ? 'home' : 'home-outline'} size={23} color={color} />;
      case 'jobs': return <MaterialCommunityIcons name="briefcase-outline" size={23} color={color} />;
      case 'applications': return <Ionicons name={isActive ? 'document-text' : 'document-text-outline'} size={23} color={color} />;
      case 'profile': return <Ionicons name={isActive ? 'person' : 'person-outline'} size={23} color={color} />;
      case 'more': return <Feather name="more-horizontal" size={23} color={color} />;
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

const ProfileScreen: React.FC = () => {
  const router = useRouter();
  const params = useLocalSearchParams();
  const [activeTab, setActiveTab] = useState<TabKey>('profile');
  const [editVisible, setEditVisible] = useState(false);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [ratingData, setRatingData] = useState<any>(null);

  const [profile, setProfile] = useState<ProfileData>({
    uid: '',
    name: '',
    email: '',
    department: '',
    gpa: '',
    year: '',
    phone: '',
    skills: [],
    about: '',
    profileImage: '',
  });

  const [editForm, setEditForm] = useState({
    name: '',
    phone: '',
    about: '',
    skills: '',
  });

  useEffect(() => {
    loadProfile();
  }, []);

  const loadProfile = async () => {
    try {
      const stored = await AsyncStorage.getItem('userData');
      if (stored) {
        const parsed = JSON.parse(stored);
        setProfile({
          uid: parsed.uid || '',
          name: parsed.name || 'Student',
          email: parsed.email || '',
          department: parsed.department || 'Not set',
          gpa: parsed.gpa || '-',
          year: parsed.year || '-',
          phone: parsed.phone || '',
          skills: parsed.skills || [],
          about: parsed.about || '',
          profileImage: parsed.profileImage || '',
        });
        setEditForm({
          name: parsed.name || '',
          phone: parsed.phone || '',
          about: parsed.about || '',
          skills: (parsed.skills || []).join(', '),
        });

        // Load rating
        if (parsed.uid) {
          const ratingRes = await getUserRating(parsed.uid);
          if (ratingRes.success && ratingRes.data) {
            setRatingData(ratingRes.data);
          }
        }
      }
    } catch (err) {
      console.log('Failed to load profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    if (!editForm.name.trim()) {
      return Alert.alert('Error', 'Name is required');
    }

    setSaving(true);
    try {
      const skillsArray = editForm.skills
        .split(',')
        .map(s => s.trim())
        .filter(s => s.length > 0);

      const res = await updateUserProfile(profile.uid, {
        name: editForm.name.trim(),
        phone: editForm.phone.trim(),
        about: editForm.about.trim(),
        skills: skillsArray,
      });

      if (res.success) {
        const updatedProfile = {
          ...profile,
          name: editForm.name.trim(),
          phone: editForm.phone.trim(),
          about: editForm.about.trim(),
          skills: skillsArray,
        };
        setProfile(updatedProfile);

        // Update local storage
        await AsyncStorage.setItem('userData', JSON.stringify({
          ...updatedProfile,
          username: updatedProfile.name,
        }));

        Alert.alert('Success', 'Profile updated successfully');
        setEditVisible(false);
      } else {
        Alert.alert('Error', res.message || 'Failed to update');
      }
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to update profile');
    } finally {
      setSaving(false);
    }
  };

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await AsyncStorage.removeItem('userToken');
          await AsyncStorage.removeItem('userData');
          router.replace('/login');
        },
      },
    ]);
  };

  const handleTabPress = (key: TabKey) => {
    setActiveTab(key);
    const userData = {
      name: profile.name,
      email: profile.email,
      department: profile.department,
      gpa: profile.gpa,
      year: profile.year,
    };
    const pathMap: Record<string, string> = {
      home: '/StudentDashboard',
      jobs: '/JobsScreen',
      applications: '/ApplicationsScreen',
      more: '/MoreScreen',
    };
    if (pathMap[key]) {
      router.replace({ pathname: pathMap[key] as any, params: userData as any });
    }
  };

  if (loading) {
    return (
      <View style={[styles.safe, { justifyContent: 'center', alignItems: 'center' }]}>
        <ActivityIndicator size="large" color="#1E3A5F" />
      </View>
    );
  }

  const firstName = profile.name.split(' ')[0];
  const initial = firstName.charAt(0).toUpperCase();

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#1E3A5F" />

      {/* Header Banner */}
      <View style={styles.banner}>
        <View style={styles.bannerContent}>
          <Text style={styles.bannerTitle}>My Profile</Text>
        </View>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{initial}</Text>
            </View>
            <TouchableOpacity style={styles.editAvatarBtn}>
              <Ionicons name="camera" size={18} color="#1E3A5F" />
            </TouchableOpacity>
          </View>

          <Text style={styles.profileName}>{profile.name}</Text>
          <Text style={styles.profileEmail}>{profile.email}</Text>

          {/* Rating */}
          {ratingData && (
            <View style={styles.ratingRow}>
              <Ionicons name="star" size={18} color="#F59E0B" />
              <Text style={styles.ratingValue}>{ratingData.average || 0}</Text>
              <Text style={styles.ratingCount}>({ratingData.total || 0} ratings)</Text>
            </View>
          )}

          {/* Info Grid */}
          <View style={styles.infoGrid}>
            <View style={styles.infoItem}>
              <View style={styles.infoIconWrap}>
                <Ionicons name="school" size={18} color="#1E3A5F" />
              </View>
              <View>
                <Text style={styles.infoLabel}>Department</Text>
                <Text style={styles.infoValue}>{profile.department}</Text>
              </View>
            </View>

            <View style={styles.infoItem}>
              <View style={styles.infoIconWrap}>
                <Ionicons name="calendar" size={18} color="#1E3A5F" />
              </View>
              <View>
                <Text style={styles.infoLabel}>Year</Text>
                <Text style={styles.infoValue}>{profile.year}</Text>
              </View>
            </View>

            <View style={styles.infoItem}>
              <View style={styles.infoIconWrap}>
                <Ionicons name="stats-chart" size={18} color="#1E3A5F" />
              </View>
              <View>
                <Text style={styles.infoLabel}>GPA</Text>
                <Text style={styles.infoValue}>{profile.gpa}</Text>
              </View>
            </View>

            <View style={styles.infoItem}>
              <View style={styles.infoIconWrap}>
                <Ionicons name="call" size={18} color="#1E3A5F" />
              </View>
              <View>
                <Text style={styles.infoLabel}>Phone</Text>
                <Text style={styles.infoValue}>{profile.phone || 'Not set'}</Text>
              </View>
            </View>
          </View>

          {/* About */}
          {profile.about ? (
            <View style={styles.aboutSection}>
              <Text style={styles.aboutTitle}>About</Text>
              <Text style={styles.aboutText}>{profile.about}</Text>
            </View>
          ) : null}

          {/* Skills */}
          {profile.skills && profile.skills.length > 0 && (
            <View style={styles.skillsSection}>
              <Text style={styles.skillsTitle}>Skills</Text>
              <View style={styles.skillsGrid}>
                {profile.skills.map((skill, index) => (
                  <View key={index} style={styles.skillChip}>
                    <Text style={styles.skillText}>{skill}</Text>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>

        {/* Actions */}
        <View style={styles.actionsCard}>
          <TouchableOpacity style={styles.actionRow} onPress={() => setEditVisible(true)}>
            <Ionicons name="create-outline" size={20} color="#1E3A5F" />
            <Text style={styles.actionLabel}>Edit Profile</Text>
            <Feather name="chevron-right" size={18} color="#9CA3AF" />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.actionRow} onPress={() => router.push('/notifications')}>
            <Ionicons name="notifications-outline" size={20} color="#1E3A5F" />
            <Text style={styles.actionLabel}>Notifications</Text>
            <Feather name="chevron-right" size={18} color="#9CA3AF" />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.actionRow} onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={20} color="#DC2626" />
            <Text style={[styles.actionLabel, { color: '#DC2626' }]}>Logout</Text>
            <View style={{ width: 18 }} />
          </TouchableOpacity>
        </View>

        <View style={{ height: 80 }} />
      </ScrollView>

      {/* Edit Modal */}
      <Modal visible={editVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            style={styles.modalContainer}
          >
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Edit Profile</Text>
              <TouchableOpacity onPress={() => setEditVisible(false)}>
                <Ionicons name="close" size={24} color="#6B7280" />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Full Name</Text>
                <TextInput
                  style={styles.fieldInput}
                  value={editForm.name}
                  onChangeText={(v) => setEditForm({ ...editForm, name: v })}
                  placeholder="Enter your name"
                />
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Phone Number</Text>
                <TextInput
                  style={styles.fieldInput}
                  value={editForm.phone}
                  onChangeText={(v) => setEditForm({ ...editForm, phone: v })}
                  placeholder="+20 xxx xxx xxxx"
                  keyboardType="phone-pad"
                />
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>About</Text>
                <TextInput
                  style={[styles.fieldInput, { height: 100, textAlignVertical: 'top' }]}
                  value={editForm.about}
                  onChangeText={(v) => setEditForm({ ...editForm, about: v })}
                  placeholder="Tell us about yourself..."
                  multiline
                  numberOfLines={4}
                />
              </View>

              <View style={styles.fieldGroup}>
                <Text style={styles.fieldLabel}>Skills (comma separated)</Text>
                <TextInput
                  style={styles.fieldInput}
                  value={editForm.skills}
                  onChangeText={(v) => setEditForm({ ...editForm, skills: v })}
                  placeholder="Python, JavaScript, Research..."
                />
                <Text style={styles.fieldHint}>Separate skills with commas</Text>
              </View>
            </ScrollView>

            <TouchableOpacity
              style={[styles.saveBtn, saving && { opacity: 0.6 }]}
              onPress={handleSave}
              disabled={saving}
            >
              <Text style={styles.saveBtnText}>{saving ? 'Saving...' : 'Save Changes'}</Text>
            </TouchableOpacity>
          </KeyboardAvoidingView>
        </View>
      </Modal>

      <BottomTabBar active={activeTab} onPress={handleTabPress} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F1F5F9' },
  scroll: { flex: 1 },

  // Banner
  banner: {
    backgroundColor: '#1E3A5F',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 60,
  },
  bannerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  bannerTitle: { color: '#fff', fontSize: 22, fontWeight: '700' },

  // Profile Card
  profileCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    borderRadius: 20,
    padding: 20,
    alignItems: 'center',
    marginTop: -45,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 5,
    marginBottom: 16,
  },
  avatarContainer: { position: 'relative', marginBottom: 12 },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#1E3A5F',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#fff',
  },
  avatarText: { fontSize: 36, fontWeight: '800', color: '#fff' },
  editAvatarBtn: {
    position: 'absolute',
    bottom: 2,
    right: -2,
    backgroundColor: '#fff',
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  profileName: { fontSize: 22, fontWeight: '700', color: '#111827', marginBottom: 4 },
  profileEmail: { fontSize: 14, color: '#6B7280', marginBottom: 12 },

  // Rating
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginBottom: 16,
  },
  ratingValue: { fontSize: 16, fontWeight: '700', color: '#1E3A5F', marginLeft: 6 },
  ratingCount: { fontSize: 13, color: '#92400E', marginLeft: 4 },

  // Info Grid
  infoGrid: { width: '100%', marginTop: 8 },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F3F4F6',
  },
  infoIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  infoLabel: { fontSize: 12, color: '#9CA3AF', fontWeight: '500' },
  infoValue: { fontSize: 15, color: '#111827', fontWeight: '600' },

  // About
  aboutSection: { width: '100%', marginTop: 16, paddingTop: 12, borderTopWidth: 1, borderTopColor: '#F3F4F6' },
  aboutTitle: { fontSize: 14, fontWeight: '700', color: '#1E3A5F', marginBottom: 6 },
  aboutText: { fontSize: 13, color: '#6B7280', lineHeight: 20 },

  // Skills
  skillsSection: { width: '100%', marginTop: 16 },
  skillsTitle: { fontSize: 14, fontWeight: '700', color: '#1E3A5F', marginBottom: 10 },
  skillsGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  skillChip: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  skillText: { fontSize: 12, fontWeight: '600', color: '#1E3A5F' },

  // Actions Card
  actionsCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    borderRadius: 16,
    paddingHorizontal: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    elevation: 2,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    gap: 12,
  },
  actionLabel: { flex: 1, fontSize: 15, color: '#111827', fontWeight: '500' },
  divider: { height: 1, backgroundColor: '#F3F4F6' },

  // Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)' },
  modalContainer: {
    backgroundColor: '#fff',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 20,
    maxHeight: '90%',
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: { fontSize: 20, fontWeight: '700', color: '#111827' },
  fieldGroup: { marginBottom: 18 },
  fieldLabel: { fontSize: 13, fontWeight: '600', color: '#64748B', marginBottom: 6 },
  fieldInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#111827',
  },
  fieldHint: { fontSize: 11, color: '#9CA3AF', marginTop: 4 },
  saveBtn: {
    backgroundColor: '#1E3A5F',
    borderRadius: 14,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  saveBtnText: { color: '#fff', fontSize: 16, fontWeight: '700' },

  // Tab Bar
  tabBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingBottom: 8,
    paddingTop: 10,
    elevation: 8,
  },
  tabItem: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  tabLabel: { fontSize: 10, color: '#9CA3AF', marginTop: 3 },
  tabLabelActive: { color: '#1E3A5F', fontWeight: '600' },
});

export default ProfileScreen;