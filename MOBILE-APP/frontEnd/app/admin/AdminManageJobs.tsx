import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Job {
  id: number;
  title: string;
  department: string;
  postedBy: string;
  status: 'active' | 'pending';
  applicants: number;
}

// ─── Main Component ────────────────────────────────────────────────────────────

const AdminManageJobs: React.FC = () => {
  const [jobs, setJobs] = useState<Job[]>([
    {
      id: 1,
      title: 'Teaching Assistant - Physics',
      department: 'Physics',
      postedBy: 'Dr. Ahmed',
      status: 'active',
      applicants: 24,
    },
    {
      id: 2,
      title: 'Research Assistant - Chemistry',
      department: 'Chemistry',
      postedBy: 'Dr. Sara',
      status: 'pending',
      applicants: 12,
    },
    {
      id: 3,
      title: 'Lab Assistant - Biology',
      department: 'Biology',
      postedBy: 'Dr. Mona',
      status: 'active',
      applicants: 18,
    },
  ]);

  const handleDelete = (id: number) => {
    setJobs((prev) => prev.filter((job) => job.id !== id));
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* ── Header ── */}
      <Text style={styles.title}>Manage Jobs</Text>
      <Text style={styles.subtitle}>{jobs.length} total jobs</Text>

      {/* ── Job Cards ── */}
      {jobs.map((job) => (
        <View key={job.id} style={styles.card}>
          {/* Top Row */}
          <View style={styles.cardHeader}>
            <View style={styles.cardHeaderLeft}>
              <Text style={styles.jobTitle}>{job.title}</Text>
              <Text style={styles.jobDept}>{job.department}</Text>
            </View>
            <View
              style={[
                styles.badge,
                job.status === 'active' ? styles.badgeSuccess : styles.badgeWarning,
              ]}
            >
              <Text
                style={[
                  styles.badgeText,
                  job.status === 'active'
                    ? styles.badgeTextSuccess
                    : styles.badgeTextWarning,
                ]}
              >
                {job.status.toUpperCase()}
              </Text>
            </View>
          </View>

          {/* Meta Info */}
          <View style={styles.metaRow}>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Posted by</Text>
              <Text style={styles.metaValue}>{job.postedBy}</Text>
            </View>
            <View style={styles.metaItem}>
              <Text style={styles.metaLabel}>Applicants</Text>
              <Text style={styles.metaValue}>{job.applicants}</Text>
            </View>
          </View>

          {/* Actions */}
          <View style={styles.cardActions}>
            <TouchableOpacity style={styles.btnView}>
              <Text style={styles.btnViewText}>View Details</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.btnDelete}
              onPress={() => handleDelete(job.id)}
            >
              <Text style={styles.btnDeleteText}>Delete</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}

      {jobs.length === 0 && (
        <View style={styles.emptyState}>
          <Text style={styles.emptyIcon}>💼</Text>
          <Text style={styles.emptyText}>No jobs found</Text>
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
    marginBottom: 20,
  },

  // Card
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    marginBottom: 14,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  cardHeaderLeft: {
    flex: 1,
    marginRight: 8,
  },
  jobTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E3A5F',
    marginBottom: 3,
  },
  jobDept: {
    fontSize: 13,
    color: '#666',
  },

  // Badge
  badge: {
    borderRadius: 20,
    paddingHorizontal: 10,
    paddingVertical: 4,
    alignSelf: 'flex-start',
  },
  badgeSuccess: {
    backgroundColor: '#d1fae5',
  },
  badgeWarning: {
    backgroundColor: '#fef3c7',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  badgeTextSuccess: {
    color: '#065f46',
  },
  badgeTextWarning: {
    color: '#92400e',
  },

  // Meta
  metaRow: {
    flexDirection: 'row',
    gap: 20,
    marginBottom: 14,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
  },
  metaItem: {},
  metaLabel: {
    fontSize: 11,
    color: '#999',
    marginBottom: 2,
  },
  metaValue: {
    fontSize: 13,
    fontWeight: '600',
    color: '#333',
  },

  // Actions
  cardActions: {
    flexDirection: 'row',
    gap: 10,
  },
  btnView: {
    flex: 1,
    backgroundColor: '#1E3A5F',
    borderRadius: 8,
    paddingVertical: 9,
    alignItems: 'center',
  },
  btnViewText: {
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

export default AdminManageJobs;
