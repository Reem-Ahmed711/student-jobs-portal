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
  Image,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, Feather, MaterialCommunityIcons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getUserRating, updateUserProfile } from '../src/api';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
import * as FileSystem from 'expo-file-system';
import * as Sharing from 'expo-sharing';

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
  studentId: string;
  cv: string | null;
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
  const [uploadingCV, setUploadingCV] = useState(false);

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
    studentId: '',
    cv: null,
  });

  const [editForm, setEditForm] = useState({
    name: '',
    phone: '',
    about: '',
    skills: '',
    studentId: '',
    cv: null as string | null,
    gpa: '',
    year: '',
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
          studentId: parsed.studentId || '',
          cv: parsed.cv || null,
        });
        setEditForm({
          name: parsed.name || '',
          phone: parsed.phone || '',
          about: parsed.about || '',
          skills: (parsed.skills || []).join(', '),
          studentId: parsed.studentId || '',
          cv: parsed.cv || null,
          gpa: parsed.gpa || '',
          year: parsed.year || '',
        });

        // Load rating from backend
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

 // أضف هذا الجزء في ProfileScreen.tsx في دالة handlePickPhoto
const handlePickPhoto = async () => {
  if (Platform.OS === 'web') {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.onchange = async (e: any) => {
      const file = e.target.files[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = async (ev) => {
          const uri = ev.target?.result as string;
          const updated = { ...profile, profileImage: uri };
          setProfile(updated);
          // حفظ البيانات مع الصورة في AsyncStorage
          const userData = await AsyncStorage.getItem('userData');
          if (userData) {
            const parsed = JSON.parse(userData);
            const updatedUserData = { ...parsed, profileImage: uri };
            await AsyncStorage.setItem('userData', JSON.stringify(updatedUserData));
          }
          Alert.alert('Success', 'Profile picture updated');
        };
        reader.readAsDataURL(file);
      }
    };
    input.click();
  } else {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please grant permission to access your photos');
      return;
    }
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.8,
    });
    if (!result.canceled && result.assets[0]) {
      const uri = result.assets[0].uri;
      const updated = { ...profile, profileImage: uri };
      setProfile(updated);
      
      // حفظ البيانات مع الصورة في AsyncStorage
      const userData = await AsyncStorage.getItem('userData');
      if (userData) {
        const parsed = JSON.parse(userData);
        const updatedUserData = { ...parsed, profileImage: uri };
        await AsyncStorage.setItem('userData', JSON.stringify(updatedUserData));
      }
      Alert.alert('Success', 'Profile picture updated');
    }
  }
};

  // دالة رفع الـ CV - نسخة مبسطة بدون FileSystem
  const handleUploadCV = async () => {
    if (Platform.OS === 'web') {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.pdf,.doc,.docx';
      input.onchange = async (e: any) => {
        const file = e.target.files[0];
        if (file) {
          try {
            // على الويب، نستخدم URL.createObjectURL لإنشاء رابط مؤقت
            const tempUrl = URL.createObjectURL(file);
            setEditForm({ ...editForm, cv: tempUrl });
            Alert.alert('Success', 'CV selected successfully');
          } catch (error) {
            Alert.alert('Error', 'Failed to upload CV');
          }
        }
      };
      input.click();
    } else {
      try {
        setUploadingCV(true);
        const result = await DocumentPicker.getDocumentAsync({
          type: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
          copyToCacheDirectory: true,
        });

        if (result.assets && result.assets[0]) {
          const asset = result.assets[0];
          // حفظ الرابط كما هو
          setEditForm({ ...editForm, cv: asset.uri });
          Alert.alert('Success', 'CV selected successfully');
        }
      } catch (err) {
        console.log('Error picking CV:', err);
        Alert.alert('Error', 'Failed to select CV');
      } finally {
        setUploadingCV(false);
      }
    }
  };

  // دالة مبسطة لفتح الـ CV
  const openCV = async () => {
    if (!profile.cv) {
      Alert.alert("No CV", "You haven't uploaded a CV yet. You can add one in Edit Profile.");
      return;
    }

    try {
      const cvUrl = profile.cv;
      
      // التحقق من نوع الرابط
      if (cvUrl.startsWith('http://') || cvUrl.startsWith('https://')) {
        // رابط سيرفر - محاولة الفتح في المتصفح
        const supported = await Linking.canOpenURL(cvUrl);
        if (supported) {
          await Linking.openURL(cvUrl);
        } else {
          Alert.alert('Error', 'Cannot open this CV link');
        }
      } 
      else if (cvUrl.startsWith('file://') || cvUrl.includes('file://')) {
        // ملف محلي على الجهاز
        if (Platform.OS === 'web') {
          Alert.alert('Info', 'Local files cannot be opened on web. Please upload to server first.');
        } else {
          // على الموبايل، نحاول المشاركة
          const isSharingAvailable = await Sharing.isAvailableAsync();
          if (isSharingAvailable) {
            await Sharing.shareAsync(cvUrl);
          } else {
            Alert.alert('Error', 'Cannot open this file');
          }
        }
      }
      else if (cvUrl.startsWith('blob:')) {
        // رابط blob على الويب
        if (Platform.OS === 'web') {
          window.open(cvUrl, '_blank');
        } else {
          Alert.alert('Error', 'Invalid CV format for mobile');
        }
      }
      else {
        // محاولة معالجة الرابط كمسار عادي
        const supported = await Linking.canOpenURL(cvUrl);
        if (supported) {
          await Linking.openURL(cvUrl);
        } else {
          Alert.alert('Error', 'Invalid CV link format. Please re-upload your CV.');
        }
      }
    } catch (error) {
      console.log('Error opening CV:', error);
      Alert.alert('Error', 'Could not open CV. Please try re-uploading the file.');
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

      const updateData: any = {
        name: editForm.name.trim(),
        phone: editForm.phone.trim(),
        about: editForm.about.trim(),
        skills: skillsArray,
        studentId: editForm.studentId.trim(),
        gpa: editForm.gpa.trim(),
        year: editForm.year.trim(),
      };

      if (editForm.cv && editForm.cv !== profile.cv) {
        updateData.cv = editForm.cv;
      }

      const res = await updateUserProfile(profile.uid, updateData);

      if (res.success) {
        const updatedProfile = {
          ...profile,
          name: editForm.name.trim(),
          phone: editForm.phone.trim(),
          about: editForm.about.trim(),
          skills: skillsArray,
          studentId: editForm.studentId.trim(),
          cv: editForm.cv || profile.cv,
          gpa: editForm.gpa.trim(),
          year: editForm.year.trim(),
        };
        setProfile(updatedProfile);

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

  const appliedJobs = 3;
  const savedJobs = 2;
  const interviewsCount = 1;

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#1E3A5F" />

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Header with Avatar - GPA and Year are already shown here */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.avatarWrap} onPress={handlePickPhoto}>
            {profile.profileImage ? (
              <Image source={{ uri: profile.profileImage }} style={styles.avatarImage} />
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
          <Text style={styles.headerMeta}>{profile.year} • GPA: {profile.gpa}</Text>
          
          {ratingData && (
            <View style={styles.ratingContainer}>
              <Ionicons name="star" size={16} color="#F59E0B" />
              <Text style={styles.ratingValue}>{ratingData.average?.toFixed(1) || 0}</Text>
              <Text style={styles.ratingCount}>({ratingData.total || 0} ratings)</Text>
            </View>
          )}
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{appliedJobs}</Text>
            <Text style={styles.statLabel}>Applied</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{savedJobs}</Text>
            <Text style={styles.statLabel}>Saved</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{interviewsCount}</Text>
            <Text style={styles.statLabel}>Interviews</Text>
          </View>
        </View>

        {/* About Section */}
        {profile.about ? (
          <>
            <View style={styles.sectionLabel}>
              <Text style={styles.sectionLabelText}>ABOUT</Text>
            </View>
            <View style={styles.card}>
              <Text style={styles.aboutText}>{profile.about}</Text>
            </View>
          </>
        ) : null}

        {/* Skills Section */}
        {profile.skills && profile.skills.length > 0 && (
          <>
            <View style={styles.sectionLabel}>
              <Text style={styles.sectionLabelText}>SKILLS</Text>
            </View>
            <View style={styles.card}>
              <View style={styles.skillsGrid}>
                {profile.skills.map((skill, index) => (
                  <View key={index} style={styles.skillChip}>
                    <Text style={styles.skillText}>{skill}</Text>
                  </View>
                ))}
              </View>
            </View>
          </>
        )}

        {/* CV Section */}
        <View style={styles.sectionLabel}>
          <Text style={styles.sectionLabelText}>CV / RESUME</Text>
        </View>
        <View style={styles.card}>
          {profile.cv ? (
            <TouchableOpacity style={styles.cvRow} onPress={openCV}>
              <View style={[styles.contactIconWrap, { backgroundColor: '#FEF2F2' }]}>
                <Ionicons name="document-text-outline" size={18} color="#DC2626" />
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.contactLabel}>My CV</Text>
                <Text style={styles.contactValue} numberOfLines={1}>View / Download CV</Text>
              </View>
              <Feather name="external-link" size={18} color="#6B7280" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.cvRow} onPress={() => setEditVisible(true)}>
              <View style={[styles.contactIconWrap, { backgroundColor: '#EFF6FF' }]}>
                <Ionicons name="cloud-upload-outline" size={18} color="#1E3A5F" />
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text style={styles.contactLabel}>No CV Uploaded</Text>
                <Text style={styles.contactValue}>Tap to add your CV</Text>
              </View>
              <Feather name="chevron-right" size={18} color="#9CA3AF" />
            </TouchableOpacity>
          )}
        </View>

        {/* Contact Information */}
        <View style={styles.sectionLabel}>
          <Text style={styles.sectionLabelText}>CONTACT INFORMATION</Text>
        </View>
        <View style={styles.card}>
          <View style={styles.contactRow}>
            <View style={[styles.contactIconWrap, { backgroundColor: '#EFF6FF' }]}>
              <Ionicons name="mail-outline" size={18} color="#1E3A5F" />
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
              <Ionicons name="card-outline" size={18} color="#7C3AED" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.contactLabel}>Student ID</Text>
              <Text style={styles.contactValue}>{profile.studentId || 'Not set'}</Text>
            </View>
          </View>
        </View>

        {/* Settings */}
        <View style={styles.sectionLabel}>
          <Text style={styles.sectionLabelText}>SETTINGS</Text>
        </View>
        <View style={styles.card}>
          <TouchableOpacity style={styles.settingRow} onPress={() => setEditVisible(true)} activeOpacity={0.7}>
            <View style={styles.settingLeft}>
              <View style={styles.settingIconWrap}>
                <Ionicons name="person-outline" size={18} color="#1E3A5F" />
              </View>
              <Text style={styles.settingLabel}>Edit Profile</Text>
            </View>
            <Feather name="chevron-right" size={18} color="#9CA3AF" />
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.settingRow} activeOpacity={0.7}>
            <View style={styles.settingLeft}>
              <View style={styles.settingIconWrap}>
                <Ionicons name="notifications-outline" size={18} color="#1E3A5F" />
              </View>
              <Text style={styles.settingLabel}>Notifications</Text>
            </View>
            <Feather name="chevron-right" size={18} color="#9CA3AF" />
          </TouchableOpacity>
        </View>

        <View style={{ height: 80 }} />
      </ScrollView>

      {/* Edit Modal */}
      <Modal visible={editVisible} animationType="slide" transparent>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={{ flex: 1 }}
        >
          <View style={styles.modalOverlay}>
            <View style={styles.modalContainer}>
              <View style={styles.modalHeader}>
                <Text style={styles.modalTitle}>Edit Profile</Text>
                <TouchableOpacity onPress={() => setEditVisible(false)}>
                  <Ionicons name="close" size={24} color="#6B7280" />
                </TouchableOpacity>
              </View>

              <ScrollView showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
                {/* Basic Information */}
                <View style={styles.modalField}>
                  <Text style={styles.modalFieldLabel}>Full Name</Text>
                  <TextInput
                    style={styles.modalInput}
                    value={editForm.name}
                    onChangeText={(v) => setEditForm({ ...editForm, name: v })}
                    placeholder="Enter your name"
                  />
                </View>

                {/* GPA and Year in same row */}
                <View style={styles.rowFields}>
                  <View style={[styles.modalField, { flex: 1, marginRight: 10 }]}>
                    <Text style={styles.modalFieldLabel}>GPA</Text>
                    <TextInput
                      style={styles.modalInput}
                      value={editForm.gpa}
                      onChangeText={(v) => setEditForm({ ...editForm, gpa: v })}
                      placeholder="e.g., 3.5"
                      keyboardType="numeric"
                    />
                  </View>

                  <View style={[styles.modalField, { flex: 1 }]}>
                    <Text style={styles.modalFieldLabel}>Academic Year</Text>
                    <TextInput
                      style={styles.modalInput}
                      value={editForm.year}
                      onChangeText={(v) => setEditForm({ ...editForm, year: v })}
                      placeholder="e.g., Senior, Junior"
                    />
                  </View>
                </View>

                <View style={styles.modalField}>
                  <Text style={styles.modalFieldLabel}>Phone Number</Text>
                  <TextInput
                    style={styles.modalInput}
                    value={editForm.phone}
                    onChangeText={(v) => setEditForm({ ...editForm, phone: v })}
                    placeholder="+20 xxx xxx xxxx"
                    keyboardType="phone-pad"
                  />
                </View>

                <View style={styles.modalField}>
                  <Text style={styles.modalFieldLabel}>Student ID</Text>
                  <TextInput
                    style={styles.modalInput}
                    value={editForm.studentId}
                    onChangeText={(v) => setEditForm({ ...editForm, studentId: v })}
                    placeholder="Enter your Student ID"
                  />
                </View>

                {/* CV Upload */}
                <View style={styles.modalField}>
                  <Text style={styles.modalFieldLabel}>CV / Resume</Text>
                  <TouchableOpacity 
                    style={styles.uploadCVButton} 
                    onPress={handleUploadCV}
                    disabled={uploadingCV}
                  >
                    <Ionicons name="cloud-upload-outline" size={20} color="#1E3A5F" />
                    <Text style={styles.uploadCVText}>
                      {uploadingCV ? 'Uploading...' : (editForm.cv ? 'Change CV' : 'Upload CV (PDF, DOC)')}
                    </Text>
                  </TouchableOpacity>
                  {editForm.cv && (
                    <Text style={styles.cvFileName} numberOfLines={1}>
                      ✓ CV file selected
                    </Text>
                  )}
                  <Text style={styles.fieldHint}>Supported formats: PDF, DOC, DOCX</Text>
                </View>

                <View style={styles.modalField}>
                  <Text style={styles.modalFieldLabel}>About</Text>
                  <TextInput
                    style={[styles.modalInput, { height: 100, textAlignVertical: 'top' }]}
                    value={editForm.about}
                    onChangeText={(v) => setEditForm({ ...editForm, about: v })}
                    placeholder="Tell us about yourself..."
                    multiline
                    numberOfLines={4}
                  />
                </View>

                <View style={styles.modalField}>
                  <Text style={styles.modalFieldLabel}>Skills (comma separated)</Text>
                  <TextInput
                    style={styles.modalInput}
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
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>

      <BottomTabBar active={activeTab} onPress={handleTabPress} />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F1F5F9' },
  scroll: { flex: 1 },

  // Header
  header: {
    backgroundColor: '#1E3A5F',
    paddingTop: 30,
    paddingBottom: 30,
    alignItems: 'center',
  },
  avatarWrap: {
    position: 'relative',
    marginBottom: 14,
  },
  avatarCircle: {
    width: 90,
    height: 90,
    borderRadius: 45,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  avatarImage: {
    width: 90,
    height: 90,
    borderRadius: 45,
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.5)',
  },
  avatarInitial: {
    fontSize: 36,
    fontWeight: '800',
    color: '#1E3A5F',
  },
  editAvatarBtn: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    backgroundColor: '#1E3A5F',
    borderRadius: 12,
    width: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  headerName: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '800',
  },
  headerDept: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 14,
    marginTop: 4,
  },
  headerMeta: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 13,
    marginTop: 4,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 10,
  },
  ratingValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#fff',
    marginLeft: 4,
  },
  ratingCount: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    marginLeft: 4,
  },

  // Stats Row
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
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 22,
    fontWeight: '800',
    color: '#111827',
  },
  statLabel: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
  statDivider: {
    width: 1,
    backgroundColor: '#E5E7EB',
    marginVertical: 4,
  },

  // Section Label
  sectionLabel: {
    paddingHorizontal: 20,
    marginBottom: 8,
    marginTop: 8,
  },
  sectionLabelText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#9CA3AF',
    letterSpacing: 1,
  },

  // Card
  card: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    elevation: 2,
  },

  // About
  aboutText: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
    paddingVertical: 8,
  },

  // Skills
  skillsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    paddingVertical: 8,
  },
  skillChip: {
    backgroundColor: '#EFF6FF',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
  },
  skillText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#1E3A5F',
  },
  
  // CV Row
  cvRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },

  // Contact
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    gap: 14,
  },
  contactIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  contactLabel: {
    fontSize: 11,
    color: '#9CA3AF',
    marginBottom: 2,
  },
  contactValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
  },

  // Divider
  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
  },

  // Settings
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  settingIconWrap: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: '#EFF6FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  settingLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: '#111827',
  },

  // Logout
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#FECACA',
    backgroundColor: '#FFF',
    marginBottom: 20,
  },
  logoutText: {
    fontSize: 15,
    fontWeight: '700',
    color: '#DC2626',
  },

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
  tabItem: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tabLabel: {
    fontSize: 10,
    color: '#9CA3AF',
    marginTop: 3,
  },
  tabLabelActive: {
    color: '#1E3A5F',
    fontWeight: '600',
  },

  // Modal
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
    maxHeight: '90%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  modalField: {
    marginBottom: 18,
  },
  modalFieldLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 6,
  },
  modalInput: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#111827',
  },
  fieldHint: {
    fontSize: 11,
    color: '#9CA3AF',
    marginTop: 4,
  },
  saveBtn: {
    backgroundColor: '#1E3A5F',
    borderRadius: 14,
    height: 52,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 10,
  },
  saveBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  uploadCVButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#F1F5F9',
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    borderStyle: 'dashed',
    borderRadius: 12,
    padding: 12,
    gap: 8,
  },
  uploadCVText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1E3A5F',
  },
  cvFileName: {
    fontSize: 12,
    color: '#10B981',
    marginTop: 6,
    textAlign: 'center',
  },
  rowFields: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
});

export default ProfileScreen;