// MOBILE-APP/frontEnd/app/MoreScreen.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

type TabKey = 'home' | 'jobs' | 'applications' | 'profile' | 'more';

// ========== Bottom Tab Bar - نفس تصميم StudentDashboard ==========
const BottomTabBar: React.FC<{ active: TabKey; onPress: (k: TabKey) => void }> = ({ active, onPress }) => {
  const tabs: { key: TabKey; label: string }[] = [
    { key: 'home', label: 'Home' },
    { key: 'jobs', label: 'Jobs' },
    { key: 'applications', label: 'Apps' },
    { key: 'profile', label: 'Profile' },
    { key: 'more', label: 'More' },
  ];

  const getIcon = (key: TabKey, isActive: boolean) => {
    const color = isActive ? '#1E3A5F' : '#9CA3AF';
    switch (key) {
      case 'home':
        return <Ionicons name={isActive ? 'home' : 'home-outline'} size={23} color={color} />;
      case 'jobs':
        return <MaterialCommunityIcons name="briefcase-outline" size={23} color={color} />;
      case 'applications':
        return <Ionicons name={isActive ? 'document-text' : 'document-text-outline'} size={23} color={color} />;
      case 'profile':
        return <Ionicons name={isActive ? 'person' : 'person-outline'} size={23} color={color} />;
      case 'more':
        return <Feather name="more-horizontal" size={23} color={color} />;
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

export default function MoreScreen() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState<TabKey>('more');

  // Simple logout function
  const handleLogout = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            try {
              await AsyncStorage.removeItem('userToken');
              await AsyncStorage.removeItem('userData');
              console.log('Logged out successfully');
              router.replace('/login');
            } catch (error) {
              console.log('Logout error:', error);
              Alert.alert('Error', 'Failed to logout');
            }
          }
        }
      ]
    );
  };

  // ========== التنقل بين التبويبات ==========
  const handleTabPress = (key: TabKey) => {
    setActiveTab(key);
    
    // حفظ بيانات المستخدم لتمريرها
    const loadUserData = async () => {
      try {
        const stored = await AsyncStorage.getItem('userData');
        const userData = stored ? JSON.parse(stored) : {};
        const params = {
          name: userData.name || 'Student',
          email: userData.email || '',
          department: userData.department || '',
          gpa: userData.gpa || '',
          year: userData.year || '',
        };

        const pathMap: Record<string, string> = {
          home: '/StudentDashboard',
          jobs: '/JobsScreen',
          applications: '/ApplicationsScreen',
          profile: '/ProfileScreen',
          more: '/MoreScreen',
        };
        
        if (pathMap[key] && pathMap[key] !== '/MoreScreen') {
          router.replace({ pathname: pathMap[key] as any, params: params as any });
        }
      } catch (error) {
        console.log('Error loading user data:', error);
      }
    };
    
    loadUserData();
  };

  // Navigation functions
  const goToSavedJobs = () => {
    Alert.alert('Saved Jobs', 'This feature will be available soon!');
  };

  const goToDocuments = () => {
    Alert.alert('My Documents', 'This feature will be available soon!');
  };

  const goToHelpCenter = () => {
    Alert.alert('Help Center', 'Contact us at: support@cu.edu.eg');
  };

  const goToAbout = () => {
    Alert.alert('About', 'Student Jobs Portal v1.0.0\nCairo University');
  };

  const goToSettings = () => {
    Alert.alert('Settings', 'App settings coming soon!');
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>More</Text>
      </View>

      <ScrollView style={styles.scroll}>
        {/* Section 1 - My Activity */}
        <Text style={styles.sectionTitle}>MY ACTIVITY</Text>
        
        <TouchableOpacity style={styles.menuCard} onPress={goToSavedJobs}>
          <View style={styles.menuLeft}>
            <View style={[styles.iconBox, { backgroundColor: '#EFF6FF' }]}>
              <Ionicons name="bookmark-outline" size={20} color="#1E3A5F" />
            </View>
            <Text style={styles.menuLabel}>Saved Jobs</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuCard} onPress={goToDocuments}>
          <View style={styles.menuLeft}>
            <View style={[styles.iconBox, { backgroundColor: '#EFF6FF' }]}>
              <Ionicons name="document-text-outline" size={20} color="#1E3A5F" />
            </View>
            <Text style={styles.menuLabel}>My Documents</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
        </TouchableOpacity>

        {/* Section 2 - Support */}
        <Text style={[styles.sectionTitle, { marginTop: 24 }]}>SUPPORT</Text>

        <TouchableOpacity style={styles.menuCard} onPress={goToHelpCenter}>
          <View style={styles.menuLeft}>
            <View style={[styles.iconBox, { backgroundColor: '#F0FDF4' }]}>
              <Ionicons name="help-circle-outline" size={20} color="#16A34A" />
            </View>
            <Text style={styles.menuLabel}>Help Center</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.menuCard} onPress={goToAbout}>
          <View style={styles.menuLeft}>
            <View style={[styles.iconBox, { backgroundColor: '#F0FDF4' }]}>
              <Ionicons name="information-circle-outline" size={20} color="#16A34A" />
            </View>
            <Text style={styles.menuLabel}>About</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
        </TouchableOpacity>

        {/* Section 3 - Settings */}
        <Text style={[styles.sectionTitle, { marginTop: 24 }]}>SETTINGS</Text>

        <TouchableOpacity style={styles.menuCard} onPress={goToSettings}>
          <View style={styles.menuLeft}>
            <View style={[styles.iconBox, { backgroundColor: '#F5F3FF' }]}>
              <Ionicons name="settings-outline" size={20} color="#2A4A7A" />
            </View>
            <Text style={styles.menuLabel}>App Settings</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
        </TouchableOpacity>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <Ionicons name="log-out-outline" size={22} color="#DC2626" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        {/* Version */}
        <Text style={styles.versionText}>Version 1.0.0</Text>
        <Text style={styles.versionText}>© 2026 Cairo University</Text>
        
        <View style={{ height: 20 }} />
      </ScrollView>

      {/* Bottom Tab Bar */}
      <BottomTabBar active={activeTab} onPress={handleTabPress} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F5F9',
  },
  header: {
    backgroundColor: '#1E3A5F',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 24,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '800',
  },
  scroll: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  sectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    color: '#9CA3AF',
    letterSpacing: 1,
    marginBottom: 12,
  },
  menuCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  menuLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 14,
  },
  iconBox: {
    width: 40,
    height: 40,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
  },
  menuLabel: {
    fontSize: 15,
    fontWeight: '500',
    color: '#111827',
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginTop: 24,
    marginBottom: 20,
    borderWidth: 1.5,
    borderColor: '#FECACA',
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#DC2626',
  },
  versionText: {
    textAlign: 'center',
    fontSize: 12,
    color: '#9CA3AF',
    marginTop: 4,
  },
  // ========== Styles للـ Bottom Tab Bar ==========
  tabBar: {
    flexDirection: 'row',
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    paddingBottom: 8,
    paddingTop: 10,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: -2 },
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
});