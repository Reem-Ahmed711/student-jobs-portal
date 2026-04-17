// MOBILE-APP/frontEnd/app/employer/EmployerPostJob.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createNewJob } from '../../src/api';

export default function EmployerPostJob() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: '',
    department: '',
    description: '',
    requirements: '',
    salary: '',
    deadline: '',
  });

  const handlePost = async () => {
    if (!form.title.trim()) {
      Alert.alert('Error', 'Job Title is required');
      return;
    }
    if (!form.department.trim()) {
      Alert.alert('Error', 'Department is required');
      return;
    }

    setLoading(true);
    try {
      const result = await createNewJob(form);
      if (result.success) {
        Alert.alert('Success', 'Job Posted Successfully!', [
          { text: 'OK', onPress: () => router.back() }
        ]);
      } else {
        Alert.alert('Error', result.message || 'Failed to post job');
      }
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to post job');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safe}>
      <StatusBar barStyle="light-content" backgroundColor="#1E3A5F" />
      <KeyboardAvoidingView behavior={Platform.OS === 'ios' ? 'padding' : 'height'} style={{ flex: 1 }}>
        
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
            <Ionicons name="arrow-back" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Post a New Job</Text>
          <View style={{ width: 24 }} />
        </View>
        
        <ScrollView style={styles.body} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Job Title *</Text>
            <TextInput 
              style={styles.input} 
              placeholder="e.g., Teaching Assistant - Physics"
              placeholderTextColor="#9CA3AF"
              value={form.title}
              onChangeText={(text) => setForm({ ...form, title: text })}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Department *</Text>
            <TextInput 
              style={styles.input} 
              placeholder="e.g., Physics, Chemistry, CS"
              placeholderTextColor="#9CA3AF"
              value={form.department}
              onChangeText={(text) => setForm({ ...form, department: text })}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Job Description</Text>
            <TextInput 
              style={[styles.input, styles.textArea]} 
              placeholder="Describe the role, responsibilities, and expectations..."
              placeholderTextColor="#9CA3AF"
              multiline
              numberOfLines={4}
              textAlignVertical="top"
              value={form.description}
              onChangeText={(text) => setForm({ ...form, description: text })}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Requirements</Text>
            <TextInput 
              style={[styles.input, styles.textArea]} 
              placeholder="e.g., GPA 3.5+, Python knowledge, Teaching experience"
              placeholderTextColor="#9CA3AF"
              multiline
              numberOfLines={3}
              textAlignVertical="top"
              value={form.requirements}
              onChangeText={(text) => setForm({ ...form, requirements: text })}
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1, marginRight: 8 }]}>
              <Text style={styles.label}>Salary (EGP)</Text>
              <TextInput 
                style={styles.input} 
                placeholder="e.g., 5000"
                placeholderTextColor="#9CA3AF"
                keyboardType="numeric"
                value={form.salary}
                onChangeText={(text) => setForm({ ...form, salary: text })}
              />
            </View>
            <View style={[styles.inputGroup, { flex: 1, marginLeft: 8 }]}>
              <Text style={styles.label}>Deadline</Text>
              <TextInput 
                style={styles.input} 
                placeholder="YYYY-MM-DD"
                placeholderTextColor="#9CA3AF"
                value={form.deadline}
                onChangeText={(text) => setForm({ ...form, deadline: text })}
              />
            </View>
          </View>

          <TouchableOpacity 
            style={[styles.btn, loading && styles.btnDisabled]} 
            onPress={handlePost} 
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <Text style={styles.btnText}>Publish Job 🚀</Text>
            )}
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: '#F8FAFC' },
  header: { 
    backgroundColor: '#1E3A5F', 
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
  },
  backBtn: {
    padding: 4,
  },
  headerTitle: { color: '#fff', fontSize: 18, fontWeight: '700' },
  body: { flex: 1, padding: 20 },
  inputGroup: { marginBottom: 16 },
  label: { 
    fontSize: 13, 
    fontWeight: '600', 
    color: '#1E3A5F', 
    marginBottom: 6,
  },
  input: { 
    backgroundColor: '#fff', 
    borderWidth: 1.5, 
    borderColor: '#E2E8F0', 
    borderRadius: 12, 
    paddingHorizontal: 14,
    paddingVertical: 12, 
    fontSize: 14, 
    color: '#1E293B',
  },
  textArea: {
    minHeight: 80,
    paddingTop: 12,
  },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  btn: { 
    backgroundColor: '#1E3A5F', 
    paddingVertical: 16, 
    borderRadius: 14, 
    alignItems: 'center', 
    marginTop: 20,
    elevation: 3,
    shadowColor: '#1E3A5F',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  btnDisabled: {
    opacity: 0.6,
  },
  btnText: { color: '#fff', fontWeight: '700', fontSize: 16 },
});