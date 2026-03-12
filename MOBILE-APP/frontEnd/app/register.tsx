import { useState } from "react";
import { registerUser } from "./api.js";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
} from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

const DEPARTMENTS = [
  "Mathematics", "Physics", "Chemistry", "Biology",
  "Geology", "Biochemistry", "Astronomy", "Statistics",
];
const ROLES = ["Student", "Teaching Assistant", "Lecturer", "Professor"];
const SKILLS = [
  "Teaching", "Research", "Lab Work", "Data Analysis",
  "Communication", "Leadership", "Technical Writing", "Public Speaking",
];
const ACADEMIC_YEARS = ["1st Year", "2nd Year", "3rd Year", "4th Year", "Graduate"];

export default function RegisterScreen() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [userType, setUserType] = useState<"Student" | "Employer">("Student");

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [department, setDepartment] = useState("");
  const [academicYear, setAcademicYear] = useState("");
  const [gpa, setGpa] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  const [role, setRole] = useState("");
  const [phone, setPhone] = useState("");
  const [empDepartment, setEmpDepartment] = useState("");
  const [agreed, setAgreed] = useState(false);

  const [showDeptDropdown, setShowDeptDropdown] = useState(false);
  const [showYearDropdown, setShowYearDropdown] = useState(false);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showEmpDeptDropdown, setShowEmpDeptDropdown] = useState(false);

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  // ── Handle Registration ──
  const handleRegister = async () => {
    try {
      setErrorMsg("");

      if (!fullName || !email || !password) {
        setErrorMsg("Please fill all required fields.");
        return;
      }

      if (password !== confirmPassword) {
        setErrorMsg("Passwords do not match.");
        return;
      }

      setLoading(true);

      const res = await registerUser(fullName, email, password);

      console.log(res);

      if (res.success || res.valid) {
        alert("Account created successfully!");
        router.push("/login");
      } else {
        setErrorMsg(res.message || "Registration failed.");
      }
    } catch (err: any) {
      console.log(err);
      setErrorMsg(err.response?.data?.message || "Server error. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const getPasswordStrength = () => {
    if (password.length === 0) return { label: "", color: "#e2e8f0", width: "0%" };
    if (password.length < 6) return { label: "Weak", color: "#ef4444", width: "33%" };
    if (password.length < 10) return { label: "Medium", color: "#f59e0b", width: "66%" };
    return { label: "Strong", color: "#22c55e", width: "100%" };
  };
  const strength = getPasswordStrength();

  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const Dropdown = ({ value, placeholder, options, visible, onToggle, onSelect }: any) => (
    <View style={{ width: "100%", zIndex: visible ? 100 : 1, marginBottom: 4 }}>
      <TouchableOpacity style={styles.dropdown} onPress={onToggle} activeOpacity={0.8}>
        <Text style={value ? styles.dropdownSelected : styles.dropdownPlaceholder}>
          {value || placeholder}
        </Text>
        <Text style={styles.dropdownArrow}>▼</Text>
      </TouchableOpacity>
      {visible && (
        <View style={styles.dropdownList}>
          {options.map((opt: string) => (
            <TouchableOpacity
              key={opt}
              style={styles.dropdownItem}
              onPress={() => { onSelect(opt); onToggle(); }}
            >
              <Text style={styles.dropdownItemText}>{opt}</Text>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );

  const progress = userType === "Student" ? (step / 2) : 1;

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8faff" />
      <LinearGradient
        colors={["#1d4ed8", "#3b82f6"]}
        start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
        style={styles.topAccent}
      />

      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={styles.container}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.headerCard}>
            <TouchableOpacity
              style={styles.backBtn}
              onPress={() => step === 1 ? router.back() : setStep(1)}
            >
              <Text style={styles.backArrow}>←</Text>
            </TouchableOpacity>
            <View style={styles.headerTextGroup}>
              <Text style={styles.title}>Create Your Account</Text>
              <Text style={styles.stepLabel}>
                {userType === "Employer" ? "Complete your profile" : `Step ${step} of 2`}
              </Text>
            </View>
            <View style={styles.cuBadge}>
              <Text style={styles.cuBadgeText}>CU</Text>
            </View>
          </View>

          {/* Progress */}
          <View style={styles.progressBg}>
            <LinearGradient
              colors={["#1d4ed8", "#60a5fa"]}
              start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
              style={[styles.progressFill, { width: `${progress * 100}%` as any }]}
            />
          </View>

          {/* STEP 1 */}
          {step === 1 && (
            <>
              {/* User Type */}
              <Text style={styles.sectionLabel}>I am a</Text>
              <View style={styles.userTypeRow}>
                {(["Student", "Employer"] as const).map((type) => (
                  <TouchableOpacity
                    key={type}
                    style={[styles.userTypeBtn, userType === type && styles.userTypeBtnActive]}
                    onPress={() => setUserType(type)}
                    activeOpacity={0.8}
                  >
                    {userType === type && (
                      <LinearGradient
                        colors={["#eff6ff", "#dbeafe"]}
                        style={[StyleSheet.absoluteFill, { borderRadius: 14 }]}
                      />
                    )}
                    <Text style={styles.userTypeIcon}>{type === "Student" ? "🎓" : "💼"}</Text>
                    <Text style={[styles.userTypeText, userType === type && styles.userTypeTextActive]}>
                      {type}
                    </Text>
                  </TouchableOpacity>
                ))}
              </View>

              {/* Personal Info */}
              <View style={styles.sectionCard}>
                <View style={styles.sectionHeader}>
                  <View style={styles.sectionDot} />
                  <Text style={styles.sectionTitle}>Personal Information</Text>
                </View>

                <Text style={styles.label}>Full Name</Text>
                <View style={styles.inputWrapper}>
                  <Text style={styles.inputIcon}>👤</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter your full name"
                    placeholderTextColor="#94a3b8"
                    value={fullName}
                    onChangeText={setFullName}
                  />
                </View>

                <Text style={styles.label}>Email Address</Text>
                <View style={styles.inputWrapper}>
                  <Text style={styles.inputIcon}>✉️</Text>
                  <TextInput
                    style={styles.input}
                    placeholder={userType === "Student" ? "student@science.cu.edu.eg" : "your@email.com"}
                    placeholderTextColor="#94a3b8"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    value={email}
                    onChangeText={setEmail}
                  />
                </View>
                {userType === "Student" && (
                  <Text style={styles.hint}>📌 Use your university email</Text>
                )}

                <Text style={styles.label}>Password</Text>
                <View style={styles.inputWrapper}>
                  <Text style={styles.inputIcon}>🔒</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Enter password"
                    placeholderTextColor="#94a3b8"
                    secureTextEntry={!showPassword}
                    value={password}
                    onChangeText={setPassword}
                  />
                  <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                    <Text style={styles.eyeIcon}>{showPassword ? "🙈" : "👁️"}</Text>
                  </TouchableOpacity>
                </View>
                {password.length > 0 && (
                  <View style={styles.strengthRow}>
                    <View style={styles.strengthBg}>
                      <View style={[styles.strengthFill, {
                        width: strength.width as any,
                        backgroundColor: strength.color,
                      }]} />
                    </View>
                    <Text style={[styles.strengthLabel, { color: strength.color }]}>
                      {strength.label}
                    </Text>
                  </View>
                )}

                <Text style={styles.label}>Confirm Password</Text>
                <View style={styles.inputWrapper}>
                  <Text style={styles.inputIcon}>🔒</Text>
                  <TextInput
                    style={styles.input}
                    placeholder="Confirm password"
                    placeholderTextColor="#94a3b8"
                    secureTextEntry={!showConfirm}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                  />
                  <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)}>
                    <Text style={styles.eyeIcon}>{showConfirm ? "🙈" : "👁️"}</Text>
                  </TouchableOpacity>
                </View>
              </View>

              {errorMsg ? (
                <Text style={{ color: "#ef4444", marginTop: 6, textAlign: "center" }}>
                  {errorMsg}
                </Text>
              ) : null}

              <TouchableOpacity
                activeOpacity={0.85}
                onPress={() => {
                  if (userType === "Student") {
                    setStep(2);
                  } else {
                    handleRegister();
                  }
                }}
              >
                <LinearGradient
                  colors={["#1d4ed8", "#3b82f6"]}
                  start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                  style={styles.primaryBtn}
                >
                  <Text style={styles.primaryBtnText}>
                    {loading ? "Loading..." : userType === "Student" ? "Next →" : "Create Account"}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </>
          )}

          {/* STEP 2 Student */}
          {step === 2 && userType === "Student" && (
            <>
              {/* Academic Info */}
              <View style={styles.sectionCard}>
                <View style={styles.sectionHeader}>
                  <View style={styles.sectionDot} />
                  <Text style={styles.sectionTitle}>Academic Information</Text>
                </View>

                <Text style={styles.label}>Department</Text>
                <Dropdown value={department} placeholder="Select your department" options={DEPARTMENTS}
                  visible={showDeptDropdown}
                  onToggle={() => setShowDeptDropdown(!showDeptDropdown)}
                  onSelect={setDepartment} />

                <View style={styles.row}>
                  <View style={{ flex: 1, marginRight: 10 }}>
                    <Text style={styles.label}>Academic Year</Text>
                    <Dropdown value={academicYear} placeholder="Select" options={ACADEMIC_YEARS}
                      visible={showYearDropdown}
                      onToggle={() => setShowYearDropdown(!showYearDropdown)}
                      onSelect={setAcademicYear} />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.label}>GPA</Text>
                    <View style={styles.inputWrapper}>
                      <TextInput
                        style={styles.input}
                        placeholder="3.85"
                        placeholderTextColor="#94a3b8"
                        keyboardType="decimal-pad"
                        value={gpa}
                        onChangeText={setGpa}
                      />
                    </View>
                  </View>
                </View>
              </View>

              {/* Skills */}
              <View style={styles.sectionCard}>
                <View style={styles.sectionHeader}>
                  <View style={styles.sectionDot} />
                  <Text style={styles.sectionTitle}>Skills</Text>
                </View>
                <Text style={styles.hint}>Select all that apply</Text>
                <View style={styles.skillsGrid}>
                  {SKILLS.map((skill) => (
                    <TouchableOpacity
                      key={skill}
                      style={[styles.skillChip, selectedSkills.includes(skill) && styles.skillChipActive]}
                      onPress={() => toggleSkill(skill)}
                      activeOpacity={0.8}
                    >
                      {selectedSkills.includes(skill) && (
                        <LinearGradient
                          colors={["#1d4ed8", "#3b82f6"]}
                          start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                          style={[StyleSheet.absoluteFill, { borderRadius: 20 }]}
                        />
                      )}
                      <Text style={[styles.skillText, selectedSkills.includes(skill) && styles.skillTextActive]}>
                        {skill}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              <TouchableOpacity
                activeOpacity={0.85}
                onPress={handleRegister}
              >
                <LinearGradient
                  colors={["#1d4ed8", "#3b82f6"]}
                  start={{ x: 0, y: 0 }} end={{ x: 1, y: 0 }}
                  style={styles.primaryBtn}
                >
                  <Text style={styles.primaryBtnText}>
                    {loading ? "Loading..." : "Create Account 🎉"}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
            </>
          )}

        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#f8faff" },
  topAccent: { height: 4, width: "100%" },
  container: { padding: 20, paddingBottom: 50 },

  headerCard: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: "#fff", borderRadius: 16, padding: 16,
    marginBottom: 14, shadowColor: "#1d4ed8",
    shadowOpacity: 0.08, shadowRadius: 12, elevation: 3, gap: 12,
  },
  backBtn: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: "#f1f5f9", alignItems: "center", justifyContent: "center",
  },
  backArrow: { fontSize: 18, color: "#1d4ed8", fontWeight: "700" },
  headerTextGroup: { flex: 1 },
  title: { fontSize: 18, fontWeight: "800", color: "#0f172a" },
  stepLabel: { fontSize: 12, color: "#64748b", marginTop: 2 },
  cuBadge: {
    width: 38, height: 38, borderRadius: 19,
    backgroundColor: "#1d4ed8", alignItems: "center", justifyContent: "center",
  },
  cuBadgeText: { color: "#fff", fontWeight: "800", fontSize: 13 },

  progressBg: {
    height: 6, backgroundColor: "#e2e8f0",
    borderRadius: 3, marginBottom: 20, overflow: "hidden",
  },
  progressFill: { height: 6, borderRadius: 3 },

  sectionLabel: { fontSize: 14, fontWeight: "700", color: "#334155", marginBottom: 10 },
  userTypeRow: { flexDirection: "row", gap: 12, marginBottom: 18 },
  userTypeBtn: {
    flex: 1, alignItems: "center", paddingVertical: 18,
    borderRadius: 14, backgroundColor: "#fff",
    borderWidth: 2, borderColor: "#e2e8f0", overflow: "hidden",
    shadowColor: "#000", shadowOpacity: 0.04, shadowRadius: 6, elevation: 2,
  },
  userTypeBtnActive: { borderColor: "#3b82f6" },
  userTypeIcon: { fontSize: 30, marginBottom: 6 },
  userTypeText: { fontSize: 14, fontWeight: "600", color: "#64748b" },
  userTypeTextActive: { color: "#1d4ed8" },

  sectionCard: {
    backgroundColor: "#fff", borderRadius: 16, padding: 18,
    marginBottom: 14, shadowColor: "#1d4ed8",
    shadowOpacity: 0.06, shadowRadius: 10, elevation: 2,
  },
  sectionHeader: { flexDirection: "row", alignItems: "center", gap: 8, marginBottom: 14 },
  sectionDot: { width: 4, height: 20, borderRadius: 2, backgroundColor: "#3b82f6" },
  sectionTitle: { fontSize: 15, fontWeight: "700", color: "#0f172a" },

  label: { fontSize: 12, fontWeight: "600", color: "#64748b", marginBottom: 6, marginTop: 10 },
  hint: { fontSize: 11, color: "#94a3b8", marginBottom: 8 },

  inputWrapper: {
    flexDirection: "row", alignItems: "center",
    backgroundColor: "#f8faff", borderRadius: 12,
    paddingHorizontal: 14, height: 50,
    borderWidth: 1.5, borderColor: "#e2e8f0", marginBottom: 2,
  },
  inputIcon: { fontSize: 15, marginRight: 10 },
  input: { flex: 1, fontSize: 14, color: "#0f172a" },
  eyeIcon: { fontSize: 17 },

  strengthRow: { flexDirection: "row", alignItems: "center", gap: 10, marginTop: 6, marginBottom: 4 },
  strengthBg: { flex: 1, height: 4, backgroundColor: "#e2e8f0", borderRadius: 2, overflow: "hidden" },
  strengthFill: { height: 4, borderRadius: 2 },
  strengthLabel: { fontSize: 11, fontWeight: "700", minWidth: 48 },

  dropdown: {
    flexDirection: "row", justifyContent: "space-between", alignItems: "center",
    backgroundColor: "#f8faff", borderRadius: 12, paddingHorizontal: 14,
    height: 50, borderWidth: 1.5, borderColor: "#e2e8f0", marginBottom: 2,
  },
  dropdownPlaceholder: { fontSize: 14, color: "#94a3b8" },
  dropdownSelected: { fontSize: 14, color: "#0f172a", fontWeight: "500" },
  dropdownArrow: { fontSize: 11, color: "#94a3b8" },
  dropdownList: {
    backgroundColor: "#fff", borderRadius: 12,
    borderWidth: 1.5, borderColor: "#e2e8f0",
    shadowColor: "#1d4ed8", shadowOpacity: 0.1,
    shadowRadius: 12, elevation: 6, marginBottom: 6,
  },
  dropdownItem: {
    paddingHorizontal: 16, paddingVertical: 13,
    borderBottomWidth: 1, borderBottomColor: "#f1f5f9",
  },
  dropdownItemText: { fontSize: 14, color: "#334155" },

  row: { flexDirection: "row", alignItems: "flex-start" },

  skillsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 6 },
  skillChip: {
    paddingHorizontal: 16, paddingVertical: 9,
    borderRadius: 20, backgroundColor: "#f1f5f9",
    borderWidth: 1.5, borderColor: "#e2e8f0", overflow: "hidden",
  },
  skillChipActive: { borderColor: "#3b82f6" },
  skillText: { fontSize: 13, color: "#475569", fontWeight: "500" },
  skillTextActive: { color: "#fff", fontWeight: "600" },

  uploadBox: {
    borderWidth: 2, borderColor: "#bfdbfe", borderStyle: "dashed",
    borderRadius: 14, alignItems: "center", justifyContent: "center",
    paddingVertical: 28, backgroundColor: "#f0f7ff", marginTop: 6,
  },
  uploadIconCircle: {
    width: 52, height: 52, borderRadius: 26,
    backgroundColor: "#dbeafe", alignItems: "center",
    justifyContent: "center", marginBottom: 10,
  },
  uploadIconText: { fontSize: 22 },
  uploadText: { fontSize: 14, color: "#1d4ed8", fontWeight: "700" },
  uploadHint: { fontSize: 11, color: "#94a3b8", marginTop: 4 },

  infoBox: {
    flexDirection: "row", backgroundColor: "#eff6ff",
    borderRadius: 10, padding: 12, gap: 8,
    marginTop: 14, alignItems: "flex-start",
    borderLeftWidth: 3, borderLeftColor: "#3b82f6",
  },
  infoIcon: { fontSize: 14 },
  infoText: { fontSize: 12, color: "#1d4ed8", flex: 1, lineHeight: 18 },

  checkRow: { flexDirection: "row", alignItems: "flex-start", gap: 10, marginTop: 14 },
  checkbox: {
    width: 22, height: 22, borderRadius: 6,
    borderWidth: 2, borderColor: "#cbd5e1",
    alignItems: "center", justifyContent: "center", marginTop: 1,
  },
  checkboxChecked: { backgroundColor: "#1d4ed8", borderColor: "#1d4ed8" },
  checkmark: { color: "#fff", fontSize: 13, fontWeight: "800" },
  checkText: { flex: 1, fontSize: 12, color: "#475569", lineHeight: 20 },
  link: { color: "#1d4ed8", fontWeight: "700" },

  primaryBtn: {
    borderRadius: 14, height: 54,
    alignItems: "center", justifyContent: "center",
    marginTop: 6, marginBottom: 4,
    shadowColor: "#1d4ed8", shadowOpacity: 0.35,
    shadowRadius: 12, elevation: 6,
  },
  primaryBtnText: { color: "#fff", fontSize: 16, fontWeight: "800", letterSpacing: 0.3 },

  signInRow: { flexDirection: "row", justifyContent: "center", marginTop: 16, marginBottom: 8 },
  signInText: { color: "#94a3b8", fontSize: 13 },
  signInLink: { color: "#1d4ed8", fontSize: 13, fontWeight: "700" },
});