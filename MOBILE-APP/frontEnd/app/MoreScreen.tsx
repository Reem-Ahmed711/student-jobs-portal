import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Alert,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function MoreScreen() {
  const router = useRouter();

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

  // Simple navigation functions
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
      </ScrollView>
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
});