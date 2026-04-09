import React from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

// ─── Types ────────────────────────────────────────────────────────────────────

interface AdminUser {
  name?: string;
  email?: string;
  role?: string;
  department?: string;
  joinedDate?: string;
}

interface AdminProfileProps {
  user?: AdminUser;
}

// ─── Main Component ────────────────────────────────────────────────────────────

const AdminProfile: React.FC<AdminProfileProps> = ({ user }) => {
  const displayName = user?.name ?? 'Admin';
  const displayEmail = user?.email ?? 'admin@cu.edu.eg';
  const displayRole = user?.role ?? 'System Administrator';
  const displayDepartment = user?.department ?? 'IT Department';
  const displayJoined = user?.joinedDate ?? 'Jan 2024';

  const initial = displayName.charAt(0).toUpperCase();

  const stats = [
    { label: 'Jobs Managed', value: '82' },
    { label: 'Users Verified', value: '240' },
    { label: 'Reports Resolved', value: '18' },
  ];

  const menuItems = [
    { icon: '✏️', label: 'Edit Profile' },
    { icon: '🔒', label: 'Change Password' },
    { icon: '🔔', label: 'Notifications' },
    { icon: '🛡️', label: 'Privacy & Security' },
    { icon: '📋', label: 'Activity Log' },
    { icon: '🚪', label: 'Logout', danger: true },
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* ── Header Banner ── */}
      <View style={styles.banner} />

      {/* ── Profile Card ── */}
      <View style={styles.profileCard}>
        {/* Avatar */}
        <View style={styles.avatarWrapper}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{initial}</Text>
          </View>
          <TouchableOpacity style={styles.editAvatarBtn}>
            <Text style={styles.editAvatarIcon}>✏️</Text>
          </TouchableOpacity>
        </View>

        <Text style={styles.name}>{displayName}</Text>
        <Text style={styles.role}>{displayRole}</Text>
        <Text style={styles.email}>{displayEmail}</Text>

        {/* Meta */}
        <View style={styles.metaRow}>
          <View style={styles.metaItem}>
            <Text style={styles.metaIcon}>🏛️</Text>
            <Text style={styles.metaText}>{displayDepartment}</Text>
          </View>
          <View style={styles.metaDivider} />
          <View style={styles.metaItem}>
            <Text style={styles.metaIcon}>📅</Text>
            <Text style={styles.metaText}>Joined {displayJoined}</Text>
          </View>
        </View>
      </View>

      {/* ── Stats ── */}
      <View style={styles.statsRow}>
        {stats.map((s, i) => (
          <View key={i} style={styles.statCard}>
            <Text style={styles.statValue}>{s.value}</Text>
            <Text style={styles.statLabel}>{s.label}</Text>
          </View>
        ))}
      </View>

      {/* ── Menu ── */}
      <View style={styles.menuCard}>
        {menuItems.map((item, i) => (
          <TouchableOpacity
            key={i}
            style={[
              styles.menuItem,
              i === menuItems.length - 1 && { borderBottomWidth: 0 },
            ]}
          >
            <Text style={styles.menuIcon}>{item.icon}</Text>
            <Text
              style={[styles.menuLabel, item.danger && styles.menuLabelDanger]}
            >
              {item.label}
            </Text>
            {!item.danger && <Text style={styles.menuArrow}>›</Text>}
          </TouchableOpacity>
        ))}
      </View>

      <View style={{ height: 30 }} />
    </ScrollView>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },

  // Banner
  banner: {
    height: 140,
    backgroundColor: '#1E3A5F',
  },

  // Profile Card
  profileCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginTop: -50,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 4,
    marginBottom: 16,
  },
  avatarWrapper: {
    position: 'relative',
    marginBottom: 12,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#1E3A5F',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 4,
    borderColor: '#fff',
  },
  avatarText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#fff',
  },
  editAvatarBtn: {
    position: 'absolute',
    bottom: 0,
    right: -4,
    backgroundColor: '#f0f0f0',
    borderRadius: 14,
    width: 28,
    height: 28,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  editAvatarIcon: { fontSize: 13 },
  name: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E3A5F',
    marginBottom: 4,
  },
  role: {
    fontSize: 13,
    color: '#4a8ac4',
    fontWeight: '600',
    marginBottom: 4,
  },
  email: {
    fontSize: 13,
    color: '#999',
    marginBottom: 14,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
  },
  metaIcon: { fontSize: 14 },
  metaText: {
    fontSize: 12,
    color: '#555',
  },
  metaDivider: {
    width: 1,
    height: 20,
    backgroundColor: '#e0e0e0',
  },

  // Stats
  statsRow: {
    flexDirection: 'row',
    marginHorizontal: 16,
    gap: 10,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  statValue: {
    fontSize: 22,
    fontWeight: '700',
    color: '#1E3A5F',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 11,
    color: '#999',
    textAlign: 'center',
  },

  // Menu
  menuCard: {
    backgroundColor: '#fff',
    marginHorizontal: 16,
    borderRadius: 14,
    paddingHorizontal: 16,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  menuIcon: {
    fontSize: 18,
    marginRight: 14,
    width: 24,
    textAlign: 'center',
  },
  menuLabel: {
    flex: 1,
    fontSize: 14,
    color: '#333',
    fontWeight: '500',
  },
  menuLabelDanger: {
    color: '#ef4444',
  },
  menuArrow: {
    fontSize: 20,
    color: '#ccc',
  },
});

export default AdminProfile;
