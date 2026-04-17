import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function EmployerProfile() {
  const router = useRouter();
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    const load = async () => {
      const stored = await AsyncStorage.getItem("userData");
      if (stored) setUserData(JSON.parse(stored));
    };
    load();
  }, []);

  const handleLogout = () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      { 
        text: "Logout", style: 'destructive', onPress: async () => {
          await AsyncStorage.removeItem("userToken");
          await AsyncStorage.removeItem("userData");
          router.replace("/login");
        }
      }
    ]);
  };

  return (
    <SafeAreaView style={styles.safe}>
      <View style={styles.banner} />
      
      <View style={styles.profileCard}>
        <View style={styles.avatar}>
          <Text style={styles.avatarTxt}>{(userData?.name || "E").charAt(0).toUpperCase()}</Text>
        </View>
        <Text style={styles.name}>{userData?.name || "Employer Name"}</Text>
        <Text style={styles.email}>{userData?.email || "employer@cu.edu.eg"}</Text>
        <View style={styles.roleBadge}>
          <Text style={styles.roleTxt}>Employer Account</Text>
        </View>
      </View>

      <View style={styles.menuCard}>
        <MenuItem icon="business-outline" label="Company Details" />
        <MenuItem icon="stats-chart-outline" label="Performance Stats" />
        <MenuItem icon="notifications-outline" label="Notifications" />
        <MenuItem icon="help-circle-outline" label="Help & Support" />
      </View>

      <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
        <Ionicons name="log-out-outline" size={20} color="#DC2626" />
        <Text style={styles.logoutTxt}>Logout</Text>
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const MenuItem = ({ icon, label }: { icon: any, label: string }) => (
  <TouchableOpacity style={styles.menuItem}>
    <Ionicons name={icon} size={22} color="#1E3A5F" style={{ width: 30 }} />
    <Text style={styles.menuLabel}>{label}</Text>
    <Ionicons name="chevron-forward" size={20} color="#CCC" />
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F1F5F9' },
  banner: { height: 130, backgroundColor: '#1E3A5F' },
  profileCard: { backgroundColor: '#fff', marginHorizontal: 20, borderRadius: 20, padding: 20, alignItems: 'center', marginTop: -50, shadowColor: '#000', shadowOpacity: 0.1, elevation: 5 },
  avatar: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#fff', borderWidth: 4, borderColor: '#1E3A5F', justifyContent: 'center', alignItems: 'center', marginBottom: 12 },
  avatarTxt: { fontSize: 32, fontWeight: 'bold', color: '#1E3A5F' },
  name: { fontSize: 20, fontWeight: '700', color: '#333', marginBottom: 4 },
  email: { fontSize: 14, color: '#666', marginBottom: 10 },
  roleBadge: { backgroundColor: '#EFF6FF', paddingHorizontal: 16, paddingVertical: 6, borderRadius: 20 },
  roleTxt: { color: '#1E3A5F', fontWeight: '700', fontSize: 12 },
  menuCard: { backgroundColor: '#fff', marginHorizontal: 20, borderRadius: 16, marginTop: 25, overflow: 'hidden' },
  menuItem: { flexDirection: 'row', alignItems: 'center', padding: 16, borderBottomWidth: 1, borderColor: '#F3F4F6' },
  menuLabel: { flex: 1, fontSize: 15, color: '#333', marginLeft: 10 },
  logoutBtn: { margin: 25, backgroundColor: '#FEE2E2', padding: 16, borderRadius: 14, flexDirection: 'row', justifyContent: 'center', alignItems: 'center', gap: 10 },
  logoutTxt: { color: '#DC2626', fontWeight: '700', fontSize: 16 }
});