import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Dimensions,
  FlatList 
} from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons, FontAwesome5, MaterialCommunityIcons } from '@expo/vector-icons';

const { width } = Dimensions.get('window');

// تعريف نوع البيانات للوظيفة
interface JobPosting {
  id: number;
  title: string;
  department: string;
  postedDate: string;
  deadline: string;
  applicants: number;
  status: 'Active' | 'Urgent' | 'Filled';
  matchScore: number;
  views: number;
}

const EmployerApplicants = () => {
  const [filter, setFilter] = useState('all');
  const router = useRouter();

  const jobs: JobPosting[] = [
    {
      id: 1,
      title: 'Teaching Assistant - Physics 101',
      department: 'Physics',
      postedDate: 'Feb 15, 2026',
      deadline: 'Mar 15, 2026',
      applicants: 24,
      status: 'Active',
      matchScore: 92,
      views: 156
    },
    {
      id: 2,
      title: 'Research Assistant - Quantum',
      department: 'Physics',
      postedDate: 'Feb 10, 2026',
      deadline: 'Mar 20, 2026',
      applicants: 12,
      status: 'Active',
      matchScore: 88,
      views: 98
    },
    {
      id: 3,
      title: 'Lab Assistant - General Physics',
      department: 'Physics',
      postedDate: 'Feb 18, 2026',
      deadline: 'Mar 10, 2026',
      applicants: 18,
      status: 'Urgent',
      matchScore: 85,
      views: 134
    }
  ];

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Active': return { bg: '#d4edda', color: '#155724' };
      case 'Urgent': return { bg: '#fff3cd', color: '#856404' };
      default: return { bg: '#e2e3e5', color: '#383d41' };
    }
  };

  const renderJobCard = ({ item }: { item: JobPosting }) => {
    const statusColors = getStatusStyle(item.status);
    
    return (
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={{ flex: 1 }}>
            <Text style={styles.jobTitle}>{item.title}</Text>
            <Text style={styles.departmentText}>{item.department} Department</Text>
            
            <View style={styles.infoRow}>
              <View style={styles.iconText}>
                <Ionicons name="calendar-outline" size={14} color="#999" />
                <Text style={styles.infoText}>{item.postedDate}</Text>
              </View>
              <View style={styles.iconText}>
                <Ionicons name="time-outline" size={14} color="#999" />
                <Text style={styles.infoText}>{item.deadline}</Text>
              </View>
            </View>
          </View>

          <View style={styles.statsContainer}>
            <View style={styles.applicantsBadge}>
              <Text style={styles.applicantsCount}>{item.applicants}</Text>
              <Text style={styles.applicantsLabel}>applicants</Text>
            </View>
            <View style={styles.matchBadge}>
              <Text style={styles.matchText}>Match: {item.matchScore}%</Text>
            </View>
          </View>
        </View>

        {/* Progress Bar */}
        <View style={styles.progressContainer}>
          <View style={[styles.progressFill, { width: `${Math.min((item.applicants / 40) * 100, 100)}%` }]} />
        </View>

        {/* Actions */}
        <View style={styles.actionsContainer}>
          <TouchableOpacity style={styles.outlineButton}>
            <Ionicons name="stats-chart" size={16} color="#0B2A4A" />
            <Text style={styles.outlineButtonText}>Analytics</Text>
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.primaryButton}>
            <Ionicons name="people" size={16} color="#FFF" />
            <Text style={styles.primaryButtonText}>Applicants</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={jobs}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderJobCard}
        ListHeaderComponent={() => (
          <View style={styles.header}>
            <View>
              <Text style={styles.title}>My Job Postings</Text>
              <Text style={styles.subtitle}>Manage and track all listings</Text>
            </View>
            
            <TouchableOpacity 
              style={styles.postButton}
            //   onPress={() => router.push('/employer-post-job')}
            >
              <Ionicons name="add" size={24} color="#FFF" />
              <Text style={styles.postButtonText}>New Job</Text>
            </TouchableOpacity>

            <View style={styles.filterSection}>
              <Text style={styles.filterLabel}>Filter by:</Text>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filterScroll}>
                {['all', 'active', 'urgent', 'filled'].map((s) => (
                  <TouchableOpacity 
                    key={s} 
                    onPress={() => setFilter(s)}
                    style={[styles.filterTab, filter === s && styles.filterTabActive]}
                  >
                    <Text style={[styles.filterTabText, filter === s && styles.filterTabTextActive]}>
                      {s.charAt(0).toUpperCase() + s.slice(1)}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>
          </View>
        )}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    padding: 20,
    paddingTop: 40,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0B2A4A',
  },
  subtitle: {
    color: '#666',
    marginTop: 4,
  },
  postButton: {
    backgroundColor: '#0B2A4A',
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 10,
    marginTop: 20,
    justifyContent: 'center',
  },
  postButtonText: {
    color: '#FFF',
    fontWeight: '600',
    marginLeft: 8,
  },
  filterSection: {
    marginTop: 25,
  },
  filterLabel: {
    fontWeight: '600',
    color: '#0B2A4A',
    marginBottom: 10,
  },
  filterScroll: {
    flexDirection: 'row',
  },
  filterTab: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginRight: 10,
  },
  filterTabActive: {
    backgroundColor: '#0B2A4A',
    borderColor: '#0B2A4A',
  },
  filterTabText: {
    color: '#64748b',
    fontSize: 14,
  },
  filterTabTextActive: {
    color: '#FFF',
  },
  listContent: {
    paddingBottom: 30,
  },
  card: {
    backgroundColor: '#FFF',
    marginHorizontal: 20,
    marginBottom: 15,
    borderRadius: 15,
    padding: 16,
    // Shadow for iOS
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    // Elevation for Android
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  jobTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#0B2A4A',
  },
  departmentText: {
    color: '#666',
    fontSize: 14,
    marginVertical: 4,
  },
  infoRow: {
    flexDirection: 'row',
    marginTop: 8,
    gap: 15,
  },
  iconText: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  infoText: {
    color: '#999',
    fontSize: 12,
  },
  statsContainer: {
    alignItems: 'flex-end',
  },
  applicantsBadge: {
    backgroundColor: '#E6F0FA',
    padding: 8,
    borderRadius: 10,
    alignItems: 'center',
    minWidth: 70,
  },
  applicantsCount: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0B2A4A',
  },
  applicantsLabel: {
    fontSize: 10,
    color: '#666',
  },
  matchBadge: {
    marginTop: 8,
    backgroundColor: '#F0F9FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 5,
  },
  matchText: {
    fontSize: 11,
    color: '#0B2A4A',
    fontWeight: '600',
  },
  progressContainer: {
    height: 6,
    backgroundColor: '#F1F5F9',
    borderRadius: 3,
    marginVertical: 15,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#3B82F6',
  },
  actionsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: 10,
  },
  outlineButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#CBD5E1',
    gap: 6,
  },
  outlineButtonText: {
    color: '#0B2A4A',
    fontSize: 13,
    fontWeight: '600',
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    backgroundColor: '#0B2A4A',
    gap: 6,
  },
  primaryButtonText: {
    color: '#FFF',
    fontSize: 13,
    fontWeight: '600',
  },
});

export default EmployerApplicants;