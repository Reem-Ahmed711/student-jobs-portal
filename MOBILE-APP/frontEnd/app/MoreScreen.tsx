import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  StatusBar,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialCommunityIcons, Feather } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

// ─── Types ─────────────────────────────────────────────────────────────────
type TabKey = 'home' | 'jobs' | 'applications' | 'profile' | 'more';

// ─── Bottom Tab Bar ─────────────────────────────────────────────────────────
const BottomTabBar: React.FC<{ active: TabKey; onPress: (k: TabKey) => void }> = ({ active, onPress }) => {
  const tabs: { key: TabKey; label: string }[] = [
    { key: 'home', label: 'Home' },
    { key: 'jobs', label: 'Jobs' },
    { key: 'applications', label: 'Applications' },
    { key: 'profile', label: 'Profile' },
    { key: 'more', label: 'More' },
  ];

  const getIcon = (key: TabKey, isActive: boolean) => {
    const color = isActive ? '#2563EB' : '#9CA3AF';
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

// ─── Section Row Component ───────────────────────────────────────────────────
interface RowItem {
  icon: string;
  iconBg: string;
  iconColor: string;
  label: string;
  badge?: string | number;
  rightText?: string;
  onPress?: () => void;
}

const MenuRow: React.FC<{ item: RowItem; isLast?: boolean }> = ({ item, isLast }) => (
  <>
    <TouchableOpacity style={styles.row} onPress={item.onPress} activeOpacity={0.7}>
      <View style={styles.rowLeft}>
        <View style={[styles.rowIcon, { backgroundColor: item.iconBg }]}>
          <Ionicons name={item.icon as any} size={18} color={item.iconColor} />
        </View>
        <Text style={styles.rowLabel}>{item.label}</Text>
      </View>
      <View style={styles.rowRight}>
        {item.badge !== undefined && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>{item.badge}</Text>
          </View>
        )}
        {item.rightText && (
          <Text style={styles.rightText}>{item.rightText}</Text>
        )}
        <Feather name="chevron-right" size={18} color="#9CA3AF" />
      </View>
    </TouchableOpacity>
    {!isLast && <View style={styles.divider} />}
  </>
);

// ─── Main Screen ─────────────────────────────────────────────────────────────
const MoreScreen: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabKey>('more');
  const router = useRouter();
  const params = useLocalSearchParams();

  const userData = {
    name: (params.name as string) || 'Student',
    department: (params.department as string) || 'Department',
    gpa: (params.gpa as string) || '-',
    year: (params.year as string) || '-',
    email: (params.email as string) || '',
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

  const handleTabPress = (key: TabKey) => {
    setActiveTab(key);
    switch (key) {
      case 'home':
        router.replace({ pathname: '/StudentDashboard', params: userData });
        break;
      case 'jobs':
        router.replace({ pathname: '/JobsScreen', params: userData });
        break;
      case 'applications':
        router.replace({ pathname: '/ApplicationsScreen', params: userData });
        break;
      case 'profile':
        router.replace({ pathname: '/ProfileScreen', params: userData });
        break;
    }
  };

  const myActivityItems: RowItem[] = [
    {
      icon: 'bookmark-outline',
      iconBg: '#EFF6FF',
      iconColor: '#2563EB',
      label: 'Saved Jobs',
      badge: 2,
      onPress: () => router.replace({ pathname: '/JobsScreen', params: userData }),
    },
    {
      icon: 'document-text-outline',
      iconBg: '#EFF6FF',
      iconColor: '#2563EB',
      label: 'My Documents',
      onPress: () => {},
    },
  ];

  const supportItems: RowItem[] = [
    {
      icon: 'help-circle-outline',
      iconBg: '#F0FDF4',
      iconColor: '#16A34A',
      label: 'Help Center',
      onPress: () => {},
    },
    {
      icon: 'chatbubble-outline',
      iconBg: '#F0FDF4',
      iconColor: '#16A34A',
      label: 'Contact Support',
      onPress: () => {},
    },
    {
      icon: 'information-circle-outline',
      iconBg: '#F0FDF4',
      iconColor: '#16A34A',
      label: 'About',
      onPress: () => {},
    },
  ];

  const settingsItems: RowItem[] = [
    {
      icon: 'settings-outline',
      iconBg: '#F5F3FF',
      iconColor: '#7C3AED',
      label: 'App Settings',
      onPress: () => {},
    },
    {
      icon: 'shield-outline',
      iconBg: '#F5F3FF',
      iconColor: '#7C3AED',
      label: 'Privacy Policy',
      onPress: () => {},
    },
    {
      icon: 'globe-outline',
      iconBg: '#F5F3FF',
      iconColor: '#7C3AED',
      label: 'Language',
      rightText: 'English',
      onPress: () => {},
    },
  ];

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="dark-content" backgroundColor="#fff" />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>More</Text>
      </View>

      <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* MY ACTIVITY */}
        <View style={styles.sectionLabel}>
          <Text style={styles.sectionLabelText}>MY ACTIVITY</Text>
        </View>
        <View style={styles.card}>
          {myActivityItems.map((item, i) => (
            <MenuRow key={item.label} item={item} isLast={i === myActivityItems.length - 1} />
          ))}
        </View>

        {/* SUPPORT */}
        <View style={styles.sectionLabel}>
          <Text style={styles.sectionLabelText}>SUPPORT</Text>
        </View>
        <View style={styles.card}>
          {supportItems.map((item, i) => (
            <MenuRow key={item.label} item={item} isLast={i === supportItems.length - 1} />
          ))}
        </View>

        {/* SETTINGS */}
        <View style={styles.sectionLabel}>
          <Text style={styles.sectionLabelText}>SETTINGS</Text>
        </View>
        <View style={styles.card}>
          {settingsItems.map((item, i) => (
            <MenuRow key={item.label} item={item} isLast={i === settingsItems.length - 1} />
          ))}
        </View>

        {/* Logout */}
        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout} activeOpacity={0.85}>
          <Ionicons name="log-out-outline" size={20} color="#DC2626" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        {/* Version */}
        <View style={styles.versionWrap}>
          <Text style={styles.versionText}>Version 1.0.0</Text>
          <Text style={styles.versionText}>© 2026 Cairo University</Text>
        </View>

        <View style={{ height: 24 }} />
      </ScrollView>

      <BottomTabBar active={activeTab} onPress={handleTabPress} />
    </SafeAreaView>
  );
};

export default MoreScreen;

// ─── Styles ──────────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F1F5F9' },
  scroll: { flex: 1 },

  header: {
    backgroundColor: '#2563EB',
    paddingHorizontal: 22,
    paddingTop: 22,
    paddingBottom: 24,
  },
  headerTitle: { color: '#fff', fontSize: 28, fontWeight: '800' },

  sectionLabel: { paddingHorizontal: 20, marginBottom: 8, marginTop: 20 },
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
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },

  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
  },
  rowLeft: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  rowIcon: {
    width: 38, height: 38, borderRadius: 10,
    justifyContent: 'center', alignItems: 'center',
  },
  rowLabel: { fontSize: 15, fontWeight: '500', color: '#111827' },
  rowRight: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  rightText: { fontSize: 13, color: '#9CA3AF' },

  badge: {
    backgroundColor: '#DBEAFE',
    borderRadius: 12,
    paddingHorizontal: 8,
    paddingVertical: 2,
  },
  badgeText: { fontSize: 12, fontWeight: '700', color: '#2563EB' },

  divider: { height: 1, backgroundColor: '#F3F4F6' },

  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    marginHorizontal: 16,
    marginTop: 20,
    paddingVertical: 16,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: '#FECACA',
    backgroundColor: '#fff',
  },
  logoutText: { fontSize: 15, fontWeight: '700', color: '#DC2626' },

  versionWrap: { alignItems: 'center', marginTop: 20, gap: 2 },
  versionText: { fontSize: 12, color: '#9CA3AF' },

  // Tab Bar
  tabBar: {
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
  tabLabelActive: { color: '#2563EB', fontWeight: '600' },
});
