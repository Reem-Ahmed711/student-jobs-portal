import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

// ─── Types ────────────────────────────────────────────────────────────────────

type UserRole = 'student' | 'employer';
type UserStatus = 'active' | 'pending';

interface User {
  id: number;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
}

// ─── Main Component ────────────────────────────────────────────────────────────

const AdminManageUsers: React.FC = () => {
  const [users, setUsers] = useState<User[]>([
    {
      id: 1,
      name: 'Ahmed Mohamed',
      email: 'ahmed@cu.edu.eg',
      role: 'student',
      status: 'active',
    },
    {
      id: 2,
      name: 'Dr. Sara Ali',
      email: 'sara@cu.edu.eg',
      role: 'employer',
      status: 'pending',
    },
    {
      id: 3,
      name: 'Mariam Hassan',
      email: 'mariam@cu.edu.eg',
      role: 'student',
      status: 'active',
    },
    {
      id: 4,
      name: 'Prof. Mahmoud',
      email: 'mahmoud@cu.edu.eg',
      role: 'employer',
      status: 'active',
    },
  ]);

  const [filter, setFilter] = useState<'all' | UserRole>('all');

  const filtered =
    filter === 'all' ? users : users.filter((u) => u.role === filter);

  const handleDelete = (id: number) => {
    setUsers((prev) => prev.filter((u) => u.id !== id));
  };

  const getRoleStyle = (role: UserRole) =>
    role === 'student'
      ? { bg: '#eff6ff', text: '#1d4ed8' }
      : { bg: '#d1fae5', text: '#065f46' };

  const getStatusStyle = (status: UserStatus) =>
    status === 'active'
      ? { bg: '#d1fae5', text: '#065f46' }
      : { bg: '#fef3c7', text: '#92400e' };

  const avatarInitial = (name: string) => name.charAt(0).toUpperCase();

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* ── Header ── */}
      <Text style={styles.title}>Manage Users</Text>
      <Text style={styles.subtitle}>{users.length} registered users</Text>

      {/* ── Filter Tabs ── */}
      <View style={styles.filterRow}>
        {(['all', 'student', 'employer'] as const).map((f) => (
          <TouchableOpacity
            key={f}
            style={[styles.filterTab, filter === f && styles.filterTabActive]}
            onPress={() => setFilter(f)}
          >
            <Text
              style={[
                styles.filterTabText,
                filter === f && styles.filterTabTextActive,
              ]}
            >
              {f.charAt(0).toUpperCase() + f.slice(1)}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* ── User Cards ── */}
      {filtered.map((user) => {
        const roleStyle = getRoleStyle(user.role);
        const statusStyle = getStatusStyle(user.status);
        return (
          <View key={user.id} style={styles.card}>
            <View style={styles.cardTop}>
              {/* Avatar */}
              <View style={styles.avatar}>
                <Text style={styles.avatarText}>{avatarInitial(user.name)}</Text>
              </View>

              {/* Info */}
              <View style={styles.userInfo}>
                <Text style={styles.userName}>{user.name}</Text>
                <Text style={styles.userEmail}>{user.email}</Text>

                {/* Badges */}
                <View style={styles.badges}>
                  <View style={[styles.badge, { backgroundColor: roleStyle.bg }]}>
                    <Text style={[styles.badgeText, { color: roleStyle.text }]}>
                      {user.role.toUpperCase()}
                    </Text>
                  </View>
                  <View
                    style={[styles.badge, { backgroundColor: statusStyle.bg }]}
                  >
                    <Text
                      style={[styles.badgeText, { color: statusStyle.text }]}
                    >
                      {user.status.toUpperCase()}
                    </Text>
                  </View>
                </View>
              </View>
            </View>

            {/* Actions */}
            <View style={styles.cardActions}>
              <TouchableOpacity style={styles.btnEdit}>
                <Text style={styles.btnEditText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.btnDelete}
                onPress={() => handleDelete(user.id)}
              >
                <Text style={styles.btnDeleteText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        );
      })}

      {filtered.length === 0 && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>👥</Text>
          <Text style={styles.emptyText}>No users found</Text>
        </View>
      )}

      <View style={{ height: 30 }} />
    </ScrollView>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    paddingHorizontal: 16,
    paddingTop: 50,
  },
  title: {
    fontSize: 26,
    fontWeight: '700',
    color: '#1E3A5F',
    marginBottom: 4,
  },
  subtitle: {
    fontSize: 13,
    color: '#999',
    marginBottom: 16,
  },

  // Filter Tabs
  filterRow: {
    flexDirection: 'row',
    backgroundColor: '#e5e7eb',
    borderRadius: 10,
    padding: 4,
    marginBottom: 20,
  },
  filterTab: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  filterTabActive: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  filterTabText: {
    fontSize: 13,
    color: '#666',
    fontWeight: '500',
  },
  filterTabTextActive: {
    color: '#1E3A5F',
    fontWeight: '700',
  },

  // Card
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 14,
  },

  // Avatar
  avatar: {
    width: 46,
    height: 46,
    borderRadius: 23,
    backgroundColor: '#1E3A5F',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },

  // User Info
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E3A5F',
    marginBottom: 2,
  },
  userEmail: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  badges: {
    flexDirection: 'row',
    gap: 8,
  },
  badge: {
    borderRadius: 20,
    paddingHorizontal: 8,
    paddingVertical: 3,
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },

  // Actions
  cardActions: {
    flexDirection: 'row',
    gap: 10,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  btnEdit: {
    flex: 1,
    backgroundColor: '#1E3A5F',
    borderRadius: 8,
    paddingVertical: 9,
    alignItems: 'center',
  },
  btnEditText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 13,
  },
  btnDelete: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ef4444',
    borderRadius: 8,
    paddingVertical: 9,
    alignItems: 'center',
  },
  btnDeleteText: {
    color: '#ef4444',
    fontWeight: '600',
    fontSize: 13,
  },

  // Empty state
  emptyState: {
    alignItems: 'center',
    marginTop: 60,
  },
  emptyIcon: { fontSize: 48, marginBottom: 12 },
  emptyText: {
    fontSize: 16,
    color: '#999',
  },
});

export default AdminManageUsers;
