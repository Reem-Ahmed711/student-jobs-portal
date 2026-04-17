// MOBILE-APP/frontEnd/app/admin/AdminManageUsers.tsx
import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  RefreshControl,
  Modal,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons, MaterialIcons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { getAllUsers, adminDeleteUser, makeAdmin, removeAdmin } from '../../src/api';

// ==================== Types ====================
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  department?: string;
  createdAt?: string;
}

interface ConfirmAction {
  type: string;
  uid: string;
  name: string;
}

type FilterType = 'all' | 'student' | 'employer' | 'admin';

interface RoleStyle {
  bg: string;
  text: string;
}

// ==================== Helper Functions ====================
const showConfirmHandler = (
  setConfirmAction: React.Dispatch<React.SetStateAction<ConfirmAction | null>>,
  setConfirmModal: React.Dispatch<React.SetStateAction<boolean>>
) => (type: string, uid: string, name: string) => {
  setConfirmAction({ type, uid, name });
  setConfirmModal(true);
};

const getRoleStyleHandler = (role: string): RoleStyle => {
  switch (role) {
    case 'student':
      return { bg: '#EFF6FF', text: '#1d4ed8' };
    case 'employer':
      return { bg: '#D1FAE5', text: '#065f46' };
    case 'admin':
      return { bg: '#FEE2E2', text: '#991b1b' };
    default:
      return { bg: '#F1F5F9', text: '#475569' };
  }
};

// ==================== Main Component ====================
const AdminManageUsers: React.FC = () => {
  const router = useRouter();
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState<boolean>(false);
  const [filter, setFilter] = useState<FilterType>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [confirmModal, setConfirmModal] = useState<boolean>(false);
  const [confirmAction, setConfirmAction] = useState<ConfirmAction | null>(null);

  // ==================== Show Confirm ====================
  const showConfirm = useCallback(
    (type: string, uid: string, name: string) => {
      setConfirmAction({ type, uid, name });
      setConfirmModal(true);
    },
    []
  );

  // ==================== Fetch Users ====================
    // ==================== Fetch Users ====================
  const fetchUsers = useCallback(async () => {
    try {
      // استخدم undefined بدل null
      const roleParam = filter === 'all' ? undefined : filter;
      const res = await getAllUsers(roleParam, 1, 100);

      if (res.success && res.data) {
        if (Array.isArray(res.data)) {
          setUsers(res.data as User[]);
        } else if (res.data.users && Array.isArray(res.data.users)) {
          setUsers(res.data.users as User[]);
        } else {
          setUsers([]);
        }
      } else {
        setUsers([]);
      }
    } catch (err) {
      console.log('Failed to fetch users:', err);
      setUsers([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [filter]);
  
  // ==================== Refresh ====================
  const onRefresh = useCallback(() => {
    setRefreshing(true);
    fetchUsers();
  }, [fetchUsers]);

  // ==================== Handle Confirm ====================
  const handleConfirmAction = async (): Promise<void> => {
    if (!confirmAction) return;
    setConfirmModal(false);

    const { type, uid }: { type: string; uid: string; name: string } = confirmAction;

    try {
      let res: { success: boolean; message?: string } | null = null;

      if (type === 'delete') {
        res = await adminDeleteUser(uid);
      } else if (type === 'makeAdmin') {
        res = await makeAdmin(uid);
      } else if (type === 'removeAdmin') {
        res = await removeAdmin(uid);
      }

      if (res && res.success) {
        Alert.alert('Success', res.message || 'Action completed');
        fetchUsers();
      } else {
        Alert.alert('Error', (res && res.message) || 'Action failed');
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Action failed';
      Alert.alert('Error', errorMessage);
    }
  };

  // ==================== Filter Users ====================
  const filteredUsers: User[] = users.filter((user: User): boolean => {
    if (!searchQuery) return true;
    const query: string = searchQuery.toLowerCase();
    const userName: string = user.name || '';
    const userEmail: string = user.email || '';
    return userName.toLowerCase().includes(query) || userEmail.toLowerCase().includes(query);
  });

  // ==================== Get Role Style ====================
  const getRoleStyle = (role: string): RoleStyle => {
    return getRoleStyleHandler(role);
  };

  // ==================== Render ====================
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color="#fff" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Manage Users</Text>
        <View style={{ width: 24 }} />
      </View>

      {/* Search Box */}
      <View style={styles.searchContainer}>
        <Ionicons name="search" size={18} color="#9CA3AF" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search by name or email..."
          placeholderTextColor="#9CA3AF"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
        {searchQuery.length > 0 && (
          <TouchableOpacity onPress={() => setSearchQuery('')}>
            <Ionicons name="close-circle" size={18} color="#9CA3AF" />
          </TouchableOpacity>
        )}
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerStyle={{ paddingBottom: 30 }}
      >
        <Text style={styles.subtitle}>{users.length} registered users</Text>

        {/* Filter Tabs */}
        <View style={styles.filterRow}>
          {(['all', 'student', 'employer', 'admin'] as FilterType[]).map((f: FilterType) => (
            <TouchableOpacity
              key={f}
              style={[styles.filterTab, filter === f && styles.filterTabActive]}
              onPress={() => setFilter(f)}
            >
              <Text style={[styles.filterTabText, filter === f && styles.filterTabTextActive]}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Loading State */}
        {loading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#1E3A5F" />
            <Text style={styles.loadingText}>Loading users...</Text>
          </View>
        ) : filteredUsers.length === 0 ? (
          /* Empty State */
          <View style={styles.emptyState}>
            <Text style={styles.emptyIcon}>👥</Text>
            <Text style={styles.emptyTitle}>No users found</Text>
            <Text style={styles.emptySubtitle}>
              {searchQuery ? 'Try a different search term' : 'No users in this category'}
            </Text>
          </View>
        ) : (
          /* User Cards */
          filteredUsers.map((user: User) => {
            const roleStyle: RoleStyle = getRoleStyle(user.role || 'student');
            return (
              <View key={user.id} style={styles.card}>
                {/* Card Top */}
                <View style={styles.cardTop}>
                  <View style={styles.avatar}>
                    <Text style={styles.avatarText}>
                      {(user.name || '?').charAt(0).toUpperCase()}
                    </Text>
                  </View>
                  <View style={styles.userInfo}>
                    <Text style={styles.userName}>{user.name || 'Unknown'}</Text>
                    <Text style={styles.userEmail}>{user.email || ''}</Text>
                    {user.department ? (
                      <Text style={styles.userDept}>{user.department}</Text>
                    ) : null}
                    <View style={styles.badges}>
                      <View style={[styles.badge, { backgroundColor: roleStyle.bg }]}>
                        <Text style={[styles.badgeText, { color: roleStyle.text }]}>
                          {(user.role || 'student').toUpperCase()}
                        </Text>
                      </View>
                    </View>
                  </View>
                </View>

                {/* Card Actions */}
                <View style={styles.cardActions}>
                  {/* Make Admin Button */}
                  {user.role === 'student' && (
                    <TouchableOpacity
                      style={styles.btnAdmin}
                      onPress={() => showConfirm('makeAdmin', user.id, user.name)}
                    >
                      <MaterialIcons name="admin-panel-settings" size={14} color="#065F46" />
                      <Text style={styles.btnAdminText}>Make Admin</Text>
                    </TouchableOpacity>
                  )}

                  {/* Remove Admin Button */}
                  {user.role === 'admin' && (
                    <TouchableOpacity
                      style={[styles.btnAdmin, { borderColor: '#F59E0B', backgroundColor: '#FFFBEB' }]}
                      onPress={() => showConfirm('removeAdmin', user.id, user.name)}
                    >
                      <MaterialIcons name="remove-circle" size={14} color="#D97706" />
                      <Text style={[styles.btnAdminText, { color: '#D97706' }]}>Remove Admin</Text>
                    </TouchableOpacity>
                  )}

                  {/* Delete Button */}
                  {user.role !== 'admin' && (
                    <TouchableOpacity
                      style={styles.btnDelete}
                      onPress={() => showConfirm('delete', user.id, user.name)}
                    >
                      <MaterialIcons name="delete-outline" size={14} color="#ef4444" />
                      <Text style={styles.btnDeleteText}>Delete</Text>
                    </TouchableOpacity>
                  )}
                </View>
              </View>
            );
          })
        )}
      </ScrollView>

      {/* ==================== Confirm Modal ==================== */}
      <Modal visible={confirmModal} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalContainer}>
            <MaterialIcons
              name={confirmAction?.type === 'delete' ? 'warning' : 'info'}
              size={48}
              color={confirmAction?.type === 'delete' ? '#EF4444' : '#1E3A5F'}
            />

            <Text style={styles.modalTitle}>
              {confirmAction?.type === 'delete' && `Delete ${confirmAction.name}?`}
              {confirmAction?.type === 'makeAdmin' && `Make ${confirmAction.name} Admin?`}
              {confirmAction?.type === 'removeAdmin' && `Remove Admin from ${confirmAction.name}?`}
            </Text>

            <Text style={styles.modalMessage}>
              {confirmAction?.type === 'delete' &&
                'This action cannot be undone. All user data will be permanently deleted.'}
              {confirmAction?.type === 'makeAdmin' &&
                'This user will have full admin privileges.'}
              {confirmAction?.type === 'removeAdmin' &&
                'This user will be demoted to student role.'}
            </Text>

            <View style={styles.modalActions}>
              <TouchableOpacity style={styles.modalCancel} onPress={() => setConfirmModal(false)}>
                <Text style={styles.modalCancelText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.modalConfirm,
                  confirmAction?.type === 'delete' && { backgroundColor: '#EF4444' },
                ]}
                onPress={handleConfirmAction}
              >
                <Text style={styles.modalConfirmText}>
                  {confirmAction?.type === 'delete' ? 'Delete' : 'Confirm'}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
};

// ==================== Styles ====================
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    backgroundColor: '#1E3A5F',
    padding: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  backBtn: {
    padding: 4,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },

  // Search
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    marginHorizontal: 16,
    marginTop: 16,
    paddingHorizontal: 14,
    height: 46,
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: '#E2E8F0',
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
    color: '#111827',
  },

  // Subtitle
  subtitle: {
    fontSize: 13,
    color: '#999',
    marginBottom: 12,
    paddingHorizontal: 16,
    paddingTop: 12,
  },

  // Filter
  filterRow: {
    flexDirection: 'row',
    backgroundColor: '#e5e7eb',
    borderRadius: 10,
    padding: 4,
    marginBottom: 16,
    marginHorizontal: 16,
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
    fontSize: 11,
    color: '#666',
    fontWeight: '500',
  },
  filterTabTextActive: {
    color: '#1E3A5F',
    fontWeight: '700',
  },

  // Loading
  loadingContainer: {
    alignItems: 'center',
    marginTop: 60,
  },
  loadingText: {
    marginTop: 12,
    color: '#666',
    fontSize: 14,
  },

  // Empty State
  emptyState: {
    alignItems: 'center',
    marginTop: 60,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 6,
  },
  emptySubtitle: {
    fontSize: 14,
    color: '#9CA3AF',
    textAlign: 'center',
  },

  // Card
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    marginHorizontal: 16,
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
    marginBottom: 4,
  },
  userDept: {
    fontSize: 11,
    color: '#9CA3AF',
    marginBottom: 6,
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

  // Card Actions
  cardActions: {
    flexDirection: 'row',
    gap: 10,
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  btnAdmin: {
    flex: 1,
    backgroundColor: '#F0FDF4',
    borderWidth: 1,
    borderColor: '#86EFAC',
    borderRadius: 8,
    paddingVertical: 9,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  btnAdminText: {
    color: '#065F46',
    fontWeight: '600',
    fontSize: 12,
  },
  btnDelete: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ef4444',
    borderRadius: 8,
    paddingVertical: 9,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    gap: 6,
  },
  btnDeleteText: {
    color: '#ef4444',
    fontWeight: '600',
    fontSize: 12,
  },

  // Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContainer: {
    backgroundColor: '#fff',
    width: '85%',
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
    marginTop: 16,
    marginBottom: 8,
  },
  modalMessage: {
    fontSize: 13,
    color: '#666',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  modalActions: {
    flexDirection: 'row',
    gap: 12,
    width: '100%',
  },
  modalCancel: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    alignItems: 'center',
  },
  modalCancelText: {
    color: '#666',
    fontWeight: '600',
  },
  modalConfirm: {
    flex: 1,
    backgroundColor: '#1E3A5F',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  modalConfirmText: {
    color: '#fff',
    fontWeight: '700',
  },
});

export default AdminManageUsers;