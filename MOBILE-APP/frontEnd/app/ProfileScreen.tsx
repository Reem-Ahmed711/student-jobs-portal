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
import { getUserRating, updateStudentProfile, fetchStudentProfile, uploadProfileImage, getSavedJobsCount, getAppliedJobsCount } from '../src/api';
import * as ImagePicker from 'expo-image-picker';
import * as DocumentPicker from 'expo-document-picker';
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
  
  const [appliedJobs, setAppliedJobs] = useState(0);
  const [savedJobsCount, setSavedJobsCount] = useState(0);

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

  const loadCounts = async () => {
    try {
      const [appliedRes, savedRes] = await Promise.all([
        getAppliedJobsCount(),
        getSavedJobsCount()
      ]);
      setAppliedJobs(appliedRes.count || 0);
      setSavedJobsCount(savedRes.count || 0);
      console.log("📊 Counts loaded - Applied:", appliedRes.count, "Saved:", savedRes.count);
    } catch (err) {
      console.log("Error loading counts:", err);
    }
  };

  useEffect(() => {
    loadProfile();
    loadCounts();
  }, []);

  const loadProfile = async () => {
    try {
      let backendData = null;
      try {
        const freshData = await fetchStudentProfile();
        if (freshData.success && freshData.data) {
          backendData = freshData.data;
        }
      } catch (err) {
        console.log('Backend fetch error:', err);
      }

      const stored = await AsyncStorage.getItem('userData');
      let localData = null;
      if (stored) {
        localData = JSON.parse(stored);
      }

      const finalData = backendData || localData || {};

      console.log("🔍 finalData.profileImage:", finalData.profileImage);
      console.log("🔍 finalData.name:", finalData.name);

      setProfile({
        uid: finalData.uid || '',
        name: finalData.name || 'Student',
        email: finalData.email || '',
        department: finalData.department || 'Not set',
        gpa: finalData.gpa?.toString() || '-',
        year: finalData.year?.toString() || '-',
        phone: finalData.phone || '',
        skills: finalData.skills || [],
        about: finalData.about || '',
        profileImage: finalData.profileImage || '',
        studentId: finalData.studentId || '',
        cv: finalData.cv || null,
      });

      setEditForm({
        name: finalData.name || '',
        phone: finalData.phone || '',
        about: finalData.about || '',
        skills: (finalData.skills || []).join(', '),
        studentId: finalData.studentId || '',
        cv: finalData.cv || null,
        gpa: finalData.gpa?.toString() || '',
        year: finalData.year?.toString() || '',
      });

      if (backendData) {
        // ✅ smart merge: لو الـ backend رجع قيمة فاضية أو null،
        // نفضل بالقيمة الموجودة في localData بدل ما نمسحها
        const smartMerged: any = { ...(localData || {}) };
        for (const key of Object.keys(backendData)) {
          const val = (backendData as any)[key];
          const isEmpty = val === null || val === undefined || val === '';
          if (!isEmpty) {
            smartMerged[key] = val;
          }
        }
        await AsyncStorage.setItem('userData', JSON.stringify(smartMerged));
      }

      const uid = finalData.uid || localData?.uid;
      if (uid) {
        const ratingRes = await getUserRating(uid);
        if (ratingRes.success && ratingRes.data) {
          setRatingData(ratingRes.data);
        }
      }
    } catch (err) {
      console.log('Failed to load profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handlePickPhoto = async () => {
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
      base64: true,
    });
    
    if (!result.canceled && result.assets[0]) {
      const base64 = `data:image/jpeg;base64,${result.assets[0].base64}`;
      await uploadAndSaveImage(base64);
    }
  };

  const uploadAndSaveImage = async (base64Image: string) => {
    setSaving(true);
    try {
      const res = await uploadProfileImage(base64Image);

      if (res.success && res.data?.url) {
        const imageUrl = res.data.url;
        console.log("✅ Image URL from Cloudinary:", imageUrl);

        setProfile(prev => ({ ...prev, profileImage: imageUrl }));

        const userData = await AsyncStorage.getItem('userData');
        if (userData) {
          const parsed = JSON.parse(userData);
          parsed.profileImage = imageUrl;
          await AsyncStorage.setItem('userData', JSON.stringify(parsed));
          console.log("✅ تم حفظ الصورة في AsyncStorage:", imageUrl);
        } else {
          const newUserData = { profileImage: imageUrl };
          await AsyncStorage.setItem('userData', JSON.stringify(newUserData));
        }

        Alert.alert('Success', 'Profile picture updated!');
      } else {
        Alert.alert('Error', res.message || 'Failed to upload image');
      }
    } catch (err) {
      console.error("Upload error:", err);
      Alert.alert('Error', 'Failed to upload profile picture');
    } finally {
      setSaving(false);
    }
  };

  const handleUploadCV = async () => {
    if (Platform.OS === 'web') {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.pdf,.doc,.docx';
      input.onchange = async (e: any) => {
        const file = e.target.files[0];
        if (file) {
          try {
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

  const openCV = async () => {
    if (!profile.cv) {
      Alert.alert("No CV", "You haven't uploaded a CV yet. You can add one in Edit Profile.");
      return;
    }

    try {
      const cvUrl = profile.cv;
      if (cvUrl.startsWith('http://') || cvUrl.startsWith('https://')) {
        const supported = await Linking.canOpenURL(cvUrl);
        if (supported) {
          await Linking.openURL(cvUrl);
        } else {
          Alert.alert('Error', 'Cannot open this CV link');
        }
      } else if (cvUrl.startsWith('file://') || cvUrl.includes('file://')) {
        if (Platform.OS === 'web') {
          Alert.alert('Info', 'Local files cannot be opened on web. Please upload to server first.');
        } else {
          const isSharingAvailable = await Sharing.isAvailableAsync();
          if (isSharingAvailable) {
            await Sharing.shareAsync(cvUrl);
          } else {
            Alert.alert('Error', 'Cannot open this file');
          }
        }
      } else if (cvUrl.startsWith('blob:')) {
        if (Platform.OS === 'web') {
          window.open(cvUrl, '_blank');
        } else {
          Alert.alert('Error', 'Invalid CV format for mobile');
        }
      } else {
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
        studentId: editForm.studentId.trim(), // ✅ دايمًا بيتبعت للـ backend
        gpa: editForm.gpa.trim(),
        year: editForm.year.trim(),
      };

      if (editForm.cv && editForm.cv !== profile.cv) {
        updateData.cv = editForm.cv;
      }

      const res = await updateStudentProfile(updateData);

      if (res.success) {
        const freshData = await fetchStudentProfile();

        // ✅ دايمًا اجيب الـ AsyncStorage الموجود الأول عشان نعمل merge صح
        const existingStored = await AsyncStorage.getItem('userData');
        const existingData = existingStored ? JSON.parse(existingStored) : {};
        
        if (freshData.success && freshData.data) {
          // ✅ smart merge: لو الـ backend رجع قيمة فاضية، نفضل بالقيمة القديمة
          const backendFields: any = freshData.data;
          const mergedFromBackend: any = { ...profile };
          for (const key of Object.keys(backendFields)) {
            const val = backendFields[key];
            const isEmpty = val === null || val === undefined || val === '';
            if (!isEmpty) mergedFromBackend[key] = val;
          }
          const updatedProfile = {
            ...mergedFromBackend,
            gpa: (backendFields.gpa && backendFields.gpa !== '') ? backendFields.gpa.toString() : editForm.gpa,
            year: (backendFields.year && backendFields.year !== '') ? backendFields.year.toString() : editForm.year,
            // ✅ studentId: خد من الـ backend لو موجود، لو لأ من الـ form، لو لأ من القديم
            studentId: backendFields.studentId || editForm.studentId.trim() || profile.studentId,
          };
          setProfile(updatedProfile);
          
          // ✅ smart merge مع existingData: لا تمسح أي حاجة موجودة بقيمة فاضية
          const finalStorage: any = { ...existingData };
          for (const key of Object.keys(updatedProfile)) {
            const val = (updatedProfile as any)[key];
            const isEmpty = val === null || val === undefined || val === '' || (Array.isArray(val) && val.length === 0);
            if (!isEmpty) finalStorage[key] = val;
          }
          // studentId لازم يتحفظ دايمًا حتى لو الـ loop فاته
          if (updatedProfile.studentId) finalStorage.studentId = updatedProfile.studentId;
          await AsyncStorage.setItem('userData', JSON.stringify(finalStorage));
          
          setEditForm({
            name: updatedProfile.name,
            phone: updatedProfile.phone,
            about: updatedProfile.about,
            skills: (updatedProfile.skills || []).join(', '),
            studentId: updatedProfile.studentId || editForm.studentId.trim(),
            cv: updatedProfile.cv,
            gpa: updatedProfile.gpa,
            year: updatedProfile.year,
          });
        } else {
          // ✅ لو fetchStudentProfile فشل، نحدث من الـ editForm مع merge
          const updatedProfile = {
            ...profile,
            name: editForm.name.trim(),
            phone: editForm.phone.trim(),
            about: editForm.about.trim(),
            skills: skillsArray,
            studentId: editForm.studentId.trim(),
            gpa: editForm.gpa.trim(),
            year: editForm.year.trim(),
            cv: editForm.cv || profile.cv,
          };
          setProfile(updatedProfile);
          // ✅ نفس الإصلاح: merge بدل overwrite
          await AsyncStorage.setItem('userData', JSON.stringify({
            ...existingData,
            ...updatedProfile,
          }));
        }

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

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Header with Avatar */}
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
          {ratingData?.ratings && ratingData.ratings.length > 0 && (
            <>
              <View style={styles.sectionLabel}>
                <Text style={styles.sectionLabelText}>EMPLOYER REVIEWS</Text>
              </View>
              <View style={styles.card}>
                {ratingData.ratings.map((review: any, index: number) => (
                  <View key={review.id || index} style={styles.reviewItem}>
                    <View style={styles.reviewHeader}>
                      <View style={styles.reviewEmployer}>
                        <Ionicons name="business-outline" size={14} color="#6B7280" />
                        <Text style={styles.reviewEmployerName}>
                          {review.raterName || 'Employer'}
                        </Text>
                      </View>
                      <View style={styles.reviewStars}>
                        {[1, 2, 3, 4, 5].map(star => (
                          <Ionicons 
                            key={star}
                            name={star <= review.rating ? "star" : "star-outline"}
                            size={12}
                            color={star <= review.rating ? "#F59E0B" : "#D1D5DB"}
                          />
                        ))}
                      </View>
                    </View>
                    {review.review ? (
                      <Text style={styles.reviewComment}>"{review.review}"</Text>
                    ) : (
                      <Text style={styles.reviewCommentNoText}>No comment provided</Text>
                    )}
                    {review.createdAt && (
                      <Text style={styles.reviewDate}>
                        {review.createdAt?.seconds 
                          ? new Date(review.createdAt.seconds * 1000).toLocaleDateString('en-US')
                          : new Date(review.createdAt).toLocaleDateString()}
                      </Text>
                    )}
                    {index < ratingData.ratings.length - 1 && <View style={styles.reviewDivider} />}
                  </View>
                ))}
              </View>
            </>
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
            <Text style={styles.statNumber}>{savedJobsCount}</Text>
            <Text style={styles.statLabel}>Saved</Text>
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
          <TouchableOpacity style={styles.settingRow} onPress={() => router.push('/notifications')} activeOpacity={0.7}>
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
                <View style={styles.modalField}>
                  <Text style={styles.modalFieldLabel}>Full Name</Text>
                  <TextInput
                    style={styles.modalInput}
                    value={editForm.name}
                    onChangeText={(v) => setEditForm({ ...editForm, name: v })}
                    placeholder="Enter your name"
                  />
                </View>

                <View style={styles.rowFields}>
                  <View style={[styles.modalField, { flex: 1, marginRight: 10 }]}>
                    <Text style={styles.modalFieldLabel}>GPA (0-5)</Text>
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
                      placeholder="e.g., 1,2,3,4,Graduate"
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

  card: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    elevation: 2,
  },

  aboutText: {
    fontSize: 14,
    color: '#4B5563',
    lineHeight: 20,
    paddingVertical: 8,
  },

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
  
  cvRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },

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

  divider: {
    height: 1,
    backgroundColor: '#F3F4F6',
  },

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
  reviewItem: {
    paddingVertical: 12,
  },
  reviewHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  reviewEmployer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  reviewEmployerName: {
    fontSize: 12,
    fontWeight: '500',
    color: '#4B5563',
  },
  reviewStars: {
    flexDirection: 'row',
    gap: 2,
  },
  reviewComment: {
    fontSize: 13,
    color: '#6B7280',
    fontStyle: 'italic',
    marginBottom: 6,
    lineHeight: 18,
  },
  reviewCommentNoText: {
    fontSize: 12,
    color: '#9CA3AF',
    fontStyle: 'italic',
    marginBottom: 6,
  },
  reviewDate: {
    fontSize: 10,
    color: '#9CA3AF',
  },
  reviewDivider: {
    height: 1,
    backgroundColor: '#F3F4F6',
    marginTop: 8,
  },
});

export default ProfileScreen;
