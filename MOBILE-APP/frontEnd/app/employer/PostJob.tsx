import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { createNewJob } from '../../src/api'; // ✅ مهم

interface FormData {
  title: string;
  department: string;
  type: string;
  deadline: string;
  description: string;
  duration: string;
  compensationType: string;
  hours: number;
}

const PostJob = () => {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  const [formData, setFormData] = useState<FormData>({
    title: '',
    department: 'Physics',
    type: 'Part-Time',
    deadline: '',
    description: '',
    duration: 'One Semester',
    compensationType: 'Paid',
    hours: 10,
  });

  const updateForm = (key: keyof FormData, value: any) => {
    setFormData((prev) => ({ ...prev, [key]: value }));
  };
const handlePublish = async () => {
  console.log("🔥 BUTTON CLICKED");

  try {
    const result = await createNewJob({
      title: formData.title,
      department: formData.department,
      description: formData.description,
      requirements: selectedSkills.join(', '),
      salary: 0,
      deadline: formData.deadline,
    });

    console.log("✅ RESULT:", result);

    if (result.success) {
      alert("SUCCESS");
    } else {
      alert("ERROR: " + result.message);
    }

  } catch (err) {
    console.log("❌ ERROR:", err);
    alert("CATCH ERROR");
  }
};

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f8fafc' }}>
      <ScrollView contentContainerStyle={{ padding: 20 }}>
        
        <Text style={{ fontSize: 22, fontWeight: 'bold', marginBottom: 20 }}>
          Post a Job
        </Text>

        <TextInput
          placeholder="Job Title"
          style={styles.input}
          value={formData.title}
          onChangeText={(v) => updateForm('title', v)}
        />

        <TextInput
          placeholder="Department"
          style={styles.input}
          value={formData.department}
          onChangeText={(v) => updateForm('department', v)}
        />

        <TextInput
          placeholder="Description"
          style={styles.input}
          value={formData.description}
          onChangeText={(v) => updateForm('description', v)}
        />

        <TextInput
          placeholder="Deadline (YYYY-MM-DD)"
          style={styles.input}
          value={formData.deadline}
          onChangeText={(v) => updateForm('deadline', v)}
        />

        <TouchableOpacity style={styles.btn} onPress={handlePublish}>
          <Text style={styles.btnText}>🚀 Publish Job</Text>
        </TouchableOpacity>

      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  input: {
    backgroundColor: '#fff',
    padding: 12,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  btn: {
    backgroundColor: '#0B2A4A',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
  },
  btnText: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default PostJob;