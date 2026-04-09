import { useState, useEffect } from "react";
import { registerUser } from "../src/api.js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as DocumentPicker from "expo-document-picker";
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
  Alert,
} from "react-native";
import { useRouter } from "expo-router";
import { LinearGradient } from "expo-linear-gradient";

// ===== CONSTANTS =====
const DEPARTMENTS = [
  "Computer Science",
  "Physics",
  "Chemistry",
  "Biology",
  "Mathematics",
  "Geology",
  "Biophysics",
];

const YEARS = ["1st Year", "2nd Year", "3rd Year", "4th Year", "Graduate"];

const CS_SKILLS = [
  "Python", "JavaScript", "Java", "C++",
  "Data Structures", "Algorithms", "Machine Learning", "Data Science",
  "Web Development", "Mobile Development", "Database Design", "Cloud Computing",
  "AI", "Cybersecurity", "Software Engineering", "UI/UX Design",
  "React", "Node.js", "Django", "Flask",
];

const GENERAL_SKILLS = [
  "Teaching", "Research", "Lab Work", "Data Analysis",
  "Communication", "Technical Writing", "Leadership", "Team Work",
  "Problem Solving", "Time Management",
];

const ROLES = [
  "Professor",
  "Lab Manager",
  "Head of Department",
  "Administrative Staff",
  "Teaching Staff",
];

// ===== TYPES =====
type UserType = "student" | "employer";
type PasswordStrength = "Weak" | "Medium" | "Strong" | "";

// ===== HELPER: Dropdown =====
const Dropdown = ({
  value,
  placeholder,
  options,
  visible,
  onToggle,
  onSelect,
}: {
  value: string;
  placeholder: string;
  options: string[];
  visible: boolean;
  onToggle: () => void;
  onSelect: (val: string) => void;
}) => (
  <View style={{ width: "100%", zIndex: visible ? 100 : 1, marginBottom: 4 }}>
    <TouchableOpacity style={styles.dropdown} onPress={onToggle} activeOpacity={0.8}>
      <Text style={value ? styles.dropdownSelected : styles.dropdownPlaceholder}>
        {value || placeholder}
      </Text>
      <Text style={styles.dropdownArrow}>{visible ? "▲" : "▼"}</Text>
    </TouchableOpacity>
    {visible && (
      <View style={styles.dropdownList}>
        {options.map((opt) => (
          <TouchableOpacity
            key={opt}
            style={styles.dropdownItem}
            onPress={() => {
              onSelect(opt);
              onToggle();
            }}
          >
            <Text style={styles.dropdownItemText}>{opt}</Text>
          </TouchableOpacity>
        ))}
      </View>
    )}
  </View>
);

// ===== MAIN COMPONENT =====
export default function RegisterScreen() {
  const router = useRouter();

  // ── State ──
  const [userType, setUserType] = useState<UserType>("student");
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");
  const [formProgress, setFormProgress] = useState(0);
  const [agreedTerms, setAgreedTerms] = useState(false);

  // Student fields
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [phone, setPhone] = useState("");
  const [department, setDepartment] = useState("");
  const [academicYear, setAcademicYear] = useState("");
  const [gpa, setGpa] = useState("");
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);

  // CV Upload
  const [cvFile, setCvFile] = useState<{ name: string; uri: string; size?: number } | null>(null);
  const [cvError, setCvError] = useState("");

  // Employer fields
  const [institutionName, setInstitutionName] = useState("");
  const [officialEmail, setOfficialEmail] = useState("");
  const [position, setPosition] = useState("");
  const [empDepartment, setEmpDepartment] = useState("");
  const [empPassword, setEmpPassword] = useState("");
  const [empConfirmPassword, setEmpConfirmPassword] = useState("");

  // Password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showEmpPassword, setShowEmpPassword] = useState(false);
  const [showEmpConfirm, setShowEmpConfirm] = useState(false);

  // Dropdowns
  const [showDeptDropdown, setShowDeptDropdown] = useState(false);
  const [showYearDropdown, setShowYearDropdown] = useState(false);
  const [showRoleDropdown, setShowRoleDropdown] = useState(false);
  const [showEmpDeptDropdown, setShowEmpDeptDropdown] = useState(false);

  // ── Password Strength ──
  const getPasswordStrength = (pwd: string): PasswordStrength => {
    if (pwd.length === 0) return "";
    if (pwd.length < 6) return "Weak";
    if (pwd.length < 8) return "Medium";
    const hasUpper = /[A-Z]/.test(pwd);
    const hasNum = /[0-9]/.test(pwd);
    const hasSpecial = /[!@#$%^&*]/.test(pwd);
    if (hasUpper && hasNum && hasSpecial) return "Strong";
    return "Medium";
  };

  const strengthColor: Record<string, string> = {
    Weak: "#ef4444",
    Medium: "#f59e0b",
    Strong: "#16a34a",
  };

  const studentStrength = getPasswordStrength(password);
  const employerStrength = getPasswordStrength(empPassword);

  // ── Form Progress ──
  useEffect(() => {
    let filled = 0;
    let total = 0;

    if (userType === "student") {
      if (step === 1) {
        total = 4;
        const fields = [fullName, email, password, confirmPassword];
        filled = fields.filter((f) => f.length > 0).length;
      } else {
        total = 7;
        const fields = [fullName, email, password, confirmPassword, department, academicYear];
        filled = fields.filter((f) => f.length > 0).length;
        if (gpa) filled += 0.5;
        if (selectedSkills.length > 0) filled += 0.5;
      }
    } else {
      total = 7;
      const fields = [
        institutionName, officialEmail, position, phone,
        empDepartment, empPassword, empConfirmPassword,
      ];
      filled = fields.filter((f) => f.length > 0).length;
    }

    setFormProgress(Math.min(100, Math.round((filled / total) * 100)));
  }, [
    fullName, email, password, confirmPassword, phone,
    department, academicYear, gpa, selectedSkills,
    institutionName, officialEmail, position, empDepartment,
    empPassword, empConfirmPassword, userType, step,
  ]);

  // ── Skills ──
  const toggleSkill = (skill: string) => {
    setSelectedSkills((prev) =>
      prev.includes(skill) ? prev.filter((s) => s !== skill) : [...prev, skill]
    );
  };

  const getSkillsList = () =>
    department === "Computer Science" ? CS_SKILLS : GENERAL_SKILLS;

  // ── CV Picker ──
  const handlePickCV = async () => {
    setCvError("");
    try {
      const result = await DocumentPicker.getDocumentAsync({
        type: "application/pdf",
        copyToCacheDirectory: true,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        const file = result.assets[0];

        // Check size (max 5MB)
        if (file.size && file.size > 5 * 1024 * 1024) {
          setCvError("File too large. Max size is 5MB.");
          return;
        }

        setCvFile({ name: file.name, uri: file.uri, size: file.size });
      }
    } catch (err) {
      setCvError("Failed to pick file. Please try again.");
    }
  };

  // ── Validation + Next ──
  const handleNext = () => {
    setErrorMsg("");

    if (userType === "student") {
      if (!fullName || !email || !password || !confirmPassword) {
        setErrorMsg("Please fill all required fields.");
        return;
      }
      if (!email.includes("@")) {
        setErrorMsg("Please enter a valid email.");
        return;
      }
      if (password.length < 6) {
        setErrorMsg("Password must be at least 6 characters.");
        return;
      }
      if (password !== confirmPassword) {
        setErrorMsg("Passwords do not match.");
        return;
      }
    } else {
      if (
        !institutionName || !officialEmail || !position ||
        !phone || !empDepartment || !empPassword || !empConfirmPassword
      ) {
        setErrorMsg("Please fill all required fields.");
        return;
      }
      if (!officialEmail.includes("@cu.edu.eg")) {
        setErrorMsg("Email must end with @cu.edu.eg");
        return;
      }
      if (empPassword.length < 6) {
        setErrorMsg("Password must be at least 6 characters.");
        return;
      }
      if (empPassword !== empConfirmPassword) {
        setErrorMsg("Passwords do not match.");
        return;
      }
    }

    setStep(2);
  };

  // ── Submit ──
  const handleSubmit = async () => {
    setErrorMsg("");

    if (!agreedTerms) {
      setErrorMsg("Please agree to the terms and conditions.");
      return;
    }

    if (userType === "student") {
      if (!department || !academicYear) {
        setErrorMsg("Please complete your academic information.");
        return;
      }
    }

    setLoading(true);

    try {
      let res;

      if (userType === "student") {
        // استخدام FormData لدعم رفع الـ CV
        const formData = new FormData();
        formData.append("username", fullName.trim());
        formData.append("email", email.toLowerCase().trim());
        formData.append("password", password);
        formData.append("role", "student");
        formData.append("department", department);
        formData.append("year", academicYear);
        if (gpa) formData.append("gpa", gpa);
        if (selectedSkills.length > 0)
          formData.append("skills", JSON.stringify(selectedSkills));
        if (cvFile) {
          formData.append("cv", {
            uri: cvFile.uri,
            name: cvFile.name,
            type: "application/pdf",
          } as any);
        }

        res = await registerUser(formData); // true = multipart
      } else {
        const payload = {
          username: institutionName.trim(),
          email: officialEmail.toLowerCase().trim(),
          password: empPassword,
          role: "employer",
          position: position,
          institution: institutionName.trim(),
        };
        res = await registerUser(payload);
      }

      if (res.success) {
        await AsyncStorage.setItem(
          "userData",
          JSON.stringify(res.data.user || {})
        );

        Alert.alert(
          "Success 🎉",
          userType === "student"
            ? "Welcome to Student Portal!"
            : "Account created! Awaiting verification."
        );

        if (userType === "student") {
          router.replace("/StudentDashboard");
        } else {
          router.replace("/employer/EmployerDashboard");
        }
      } else {
        setErrorMsg(res.message || "Registration failed.");
      }
    } catch (err) {
      setErrorMsg("Network error. Please check your connection.");
    } finally {
      setLoading(false);
    }
  };

  // ── Strength Bar Helper ──
  const StrengthBar = ({ strength }: { strength: PasswordStrength }) => {
    if (!strength) return null;
    const levels = ["Weak", "Medium", "Strong"];
    return (
      <View style={styles.strengthRow}>
        <View style={styles.strengthBarsRow}>
          {levels.map((s, i) => (
            <View
              key={s}
              style={[
                styles.strengthSegment,
                {
                  backgroundColor:
                    levels.indexOf(strength) >= i
                      ? strengthColor[strength]
                      : "#e5e7eb",
                },
              ]}
            />
          ))}
        </View>
        <Text style={[styles.strengthLabel, { color: strengthColor[strength] }]}>
          {strength}
        </Text>
      </View>
    );
  };

  const progressWidth = `${formProgress}%` as any;

  return (
    <View style={styles.screen}>
      <StatusBar barStyle="dark-content" backgroundColor="#f8faff" />
      <LinearGradient
        colors={["#1E3A5F", "#2a4a7a"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
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
          {/* ── Header ── */}
          <View style={styles.headerCard}>
            <TouchableOpacity
              style={styles.backBtn}
              onPress={() => (step === 1 ? router.back() : setStep(1))}
            >
              <Text style={styles.backArrow}>←</Text>
            </TouchableOpacity>
            <View style={styles.headerTextGroup}>
              <Text style={styles.title}>Create Account</Text>
              <Text style={styles.stepLabel}>Step {step} of 2</Text>
            </View>
            <View style={styles.cuBadge}>
              <Text style={styles.cuBadgeText}>CU</Text>
            </View>
          </View>

          {/* ── Progress Bar ── */}
          <View style={styles.progressHeader}>
            <Text style={styles.progressLabel}>Profile Completion</Text>
            <Text style={styles.progressPercent}>{formProgress}%</Text>
          </View>
          <View style={styles.progressBg}>
            <LinearGradient
              colors={["#1E3A5F", "#2a4a7a"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.progressFill, { width: progressWidth }]}
            />
          </View>

          {/* ── User Type Toggle (Step 1 only) ── */}
          {step === 1 && (
            <View style={styles.userTypeRow}>
              {(["student", "employer"] as UserType[]).map((type) => (
                <TouchableOpacity
                  key={type}
                  style={[
                    styles.userTypeBtn,
                    userType === type && styles.userTypeBtnActive,
                  ]}
                  onPress={() => {
                    setUserType(type);
                    setStep(1);
                    setErrorMsg("");
                  }}
                  activeOpacity={0.8}
                >
                  {userType === type && (
                    <LinearGradient
                      colors={["#eff6ff", "#dbeafe"]}
                      style={[StyleSheet.absoluteFill, { borderRadius: 14 }]}
                    />
                  )}
                  <Text style={styles.userTypeIcon}>
                    {type === "student" ? "🎓" : "🏢"}
                  </Text>
                  <Text
                    style={[
                      styles.userTypeText,
                      userType === type && styles.userTypeTextActive,
                    ]}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          )}

          {/* ── Error Box ── */}
          {errorMsg ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorIcon}>⚠️</Text>
              <Text style={styles.errorText}>{errorMsg}</Text>
            </View>
          ) : null}

          {/* ════════════════════════════════════
              STUDENT — STEP 1
          ════════════════════════════════════ */}
          {userType === "student" && step === 1 && (
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
                  placeholder="Ahmed Mohamed"
                  placeholderTextColor="#94a3b8"
                  value={fullName}
                  onChangeText={setFullName}
                />
              </View>

              <Text style={styles.label}>Email</Text>
              <View style={styles.inputWrapper}>
                <Text style={styles.inputIcon}>✉️</Text>
                <TextInput
                  style={styles.input}
                  placeholder="ahmed@science.cu.edu.eg"
                  placeholderTextColor="#94a3b8"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={email}
                  onChangeText={setEmail}
                />
              </View>
              <Text style={styles.hint}>📌 Use your @science.cu.edu.eg email</Text>

              <Text style={styles.label}>Phone (Optional)</Text>
              <View style={styles.inputWrapper}>
                <Text style={styles.inputIcon}>📞</Text>
                <TextInput
                  style={styles.input}
                  placeholder="+20 123 456 7890"
                  placeholderTextColor="#94a3b8"
                  keyboardType="phone-pad"
                  value={phone}
                  onChangeText={setPhone}
                />
              </View>

              <Text style={styles.label}>Password</Text>
              <View style={styles.inputWrapper}>
                <Text style={styles.inputIcon}>🔒</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Create a strong password"
                  placeholderTextColor="#94a3b8"
                  secureTextEntry={!showPassword}
                  value={password}
                  onChangeText={setPassword}
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                  <Text style={styles.eyeIcon}>{showPassword ? "🙈" : "👁️"}</Text>
                </TouchableOpacity>
              </View>
              <StrengthBar strength={studentStrength} />

              <Text style={styles.label}>Confirm Password</Text>
              <View style={styles.inputWrapper}>
                <Text style={styles.inputIcon}>🔒</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Re-enter password"
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
          )}

          {/* ════════════════════════════════════
              STUDENT — STEP 2
          ════════════════════════════════════ */}
          {userType === "student" && step === 2 && (
            <>
              <View style={styles.sectionCard}>
                <View style={styles.sectionHeader}>
                  <View style={styles.sectionDot} />
                  <Text style={styles.sectionTitle}>Academic Information</Text>
                </View>

                <Text style={styles.label}>Department</Text>
                <Dropdown
                  value={department}
                  placeholder="Select your department"
                  options={DEPARTMENTS}
                  visible={showDeptDropdown}
                  onToggle={() => setShowDeptDropdown(!showDeptDropdown)}
                  onSelect={setDepartment}
                />

                <Text style={styles.label}>Academic Year</Text>
                <Dropdown
                  value={academicYear}
                  placeholder="Select your year"
                  options={YEARS}
                  visible={showYearDropdown}
                  onToggle={() => setShowYearDropdown(!showYearDropdown)}
                  onSelect={setAcademicYear}
                />

                <Text style={styles.label}>GPA (out of 5.0)</Text>
                <View style={styles.inputWrapper}>
                  <TextInput
                    style={styles.input}
                    placeholder="e.g. 3.85"
                    placeholderTextColor="#94a3b8"
                    keyboardType="decimal-pad"
                    value={gpa}
                    onChangeText={setGpa}
                  />
                </View>
                {gpa !== "" && (
                  <Text style={[styles.hint, { color: "#1E3A5F", fontWeight: "600" }]}>
                    {parseFloat(gpa) >= 3.5
                      ? "🌟 Excellent"
                      : parseFloat(gpa) >= 3.0
                      ? "👍 Good"
                      : parseFloat(gpa) >= 2.0
                      ? "✅ Satisfactory"
                      : "📚 Needs Improvement"}
                  </Text>
                )}

                {/* ── CV Upload ── */}
                <Text style={styles.label}>
                  CV / Resume{" "}
                  <Text style={{ color: "#94a3b8", fontWeight: "400" }}>(Optional)</Text>
                </Text>
                <TouchableOpacity
                  style={[
                    styles.cvUploadBox,
                    cvFile && styles.cvUploadBoxFilled,
                  ]}
                  onPress={handlePickCV}
                  activeOpacity={0.8}
                >
                  {cvFile ? (
                    <View style={styles.cvFileRow}>
                      <View style={styles.cvFileIconWrapper}>
                        <Text style={styles.cvFileIconEmoji}>📄</Text>
                      </View>
                      <View style={styles.cvFileInfo}>
                        <Text style={styles.cvFileName} numberOfLines={1}>
                          {cvFile.name}
                        </Text>
                        {cvFile.size && (
                          <Text style={styles.cvFileSize}>
                            {cvFile.size < 1024 * 1024
                              ? `${(cvFile.size / 1024).toFixed(1)} KB`
                              : `${(cvFile.size / (1024 * 1024)).toFixed(2)} MB`}
                            {" "}• PDF
                          </Text>
                        )}
                      </View>
                      <TouchableOpacity
                        style={styles.cvRemoveBtn}
                        onPress={(e) => {
                          e.stopPropagation?.();
                          setCvFile(null);
                          setCvError("");
                        }}
                        hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                      >
                        <Text style={styles.cvRemoveText}>✕</Text>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <View style={styles.cvPlaceholder}>
                      <View style={styles.cvUploadIconWrapper}>
                        <Text style={styles.cvUploadIconEmoji}>📎</Text>
                      </View>
                      <Text style={styles.cvUploadTitle}>Upload your CV</Text>
                      <Text style={styles.cvUploadSub}>PDF only • Max 5MB</Text>
                    </View>
                  )}
                </TouchableOpacity>
                {cvError ? (
                  <View style={styles.cvErrorRow}>
                    <Text style={styles.cvErrorText}>⚠️ {cvError}</Text>
                  </View>
                ) : null}
                <Text style={styles.hint}>
                  Helps employers review your profile faster
                </Text>
              </View>

              <View style={styles.sectionCard}>
                <View style={styles.sectionHeader}>
                  <View style={styles.sectionDot} />
                  <Text style={styles.sectionTitle}>Skills</Text>
                </View>
                <Text style={styles.hint}>
                  Select all that apply • {selectedSkills.length} selected
                </Text>
                <View style={styles.skillsGrid}>
                  {getSkillsList().map((skill) => {
                    const active = selectedSkills.includes(skill);
                    return (
                      <TouchableOpacity
                        key={skill}
                        style={[styles.skillChip, active && styles.skillChipActive]}
                        onPress={() => toggleSkill(skill)}
                        activeOpacity={0.8}
                      >
                        {active && (
                          <LinearGradient
                            colors={["#1E3A5F", "#2a4a7a"]}
                            start={{ x: 0, y: 0 }}
                            end={{ x: 1, y: 0 }}
                            style={[StyleSheet.absoluteFill, { borderRadius: 20 }]}
                          />
                        )}
                        <Text
                          style={[styles.skillText, active && styles.skillTextActive]}
                        >
                          {skill}
                        </Text>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>

              {/* Terms */}
              <TouchableOpacity
                style={styles.checkRow}
                onPress={() => setAgreedTerms(!agreedTerms)}
                activeOpacity={0.8}
              >
                <View style={[styles.checkbox, agreedTerms && styles.checkboxChecked]}>
                  {agreedTerms && <Text style={styles.checkmark}>✓</Text>}
                </View>
                <Text style={styles.checkText}>
                  I agree to the{" "}
                  <Text style={styles.link}>terms and conditions</Text>
                </Text>
              </TouchableOpacity>
            </>
          )}

          {/* ════════════════════════════════════
              EMPLOYER — STEP 1
          ════════════════════════════════════ */}
          {userType === "employer" && step === 1 && (
            <View style={styles.sectionCard}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionDot} />
                <Text style={styles.sectionTitle}>Institution Details</Text>
              </View>

              <Text style={styles.label}>Institution / Department Name</Text>
              <View style={styles.inputWrapper}>
                <Text style={styles.inputIcon}>🏢</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Computer Science Department"
                  placeholderTextColor="#94a3b8"
                  value={institutionName}
                  onChangeText={setInstitutionName}
                />
              </View>

              <Text style={styles.label}>Official Email</Text>
              <View style={styles.inputWrapper}>
                <Text style={styles.inputIcon}>✉️</Text>
                <TextInput
                  style={styles.input}
                  placeholder="cs@cu.edu.eg"
                  placeholderTextColor="#94a3b8"
                  keyboardType="email-address"
                  autoCapitalize="none"
                  value={officialEmail}
                  onChangeText={setOfficialEmail}
                />
              </View>
              <Text style={styles.hint}>📌 Must end with @cu.edu.eg</Text>

              <Text style={styles.label}>Position / Role</Text>
              <Dropdown
                value={position}
                placeholder="Select your role"
                options={ROLES}
                visible={showRoleDropdown}
                onToggle={() => setShowRoleDropdown(!showRoleDropdown)}
                onSelect={setPosition}
              />

              <Text style={styles.label}>Phone Number</Text>
              <View style={styles.inputWrapper}>
                <Text style={styles.inputIcon}>📞</Text>
                <TextInput
                  style={styles.input}
                  placeholder="+20 123 456 7890"
                  placeholderTextColor="#94a3b8"
                  keyboardType="phone-pad"
                  value={phone}
                  onChangeText={setPhone}
                />
              </View>

              <Text style={styles.label}>Department for Job Posting</Text>
              <Dropdown
                value={empDepartment}
                placeholder="Select department"
                options={DEPARTMENTS}
                visible={showEmpDeptDropdown}
                onToggle={() => setShowEmpDeptDropdown(!showEmpDeptDropdown)}
                onSelect={setEmpDepartment}
              />

              <Text style={styles.label}>Password</Text>
              <View style={styles.inputWrapper}>
                <Text style={styles.inputIcon}>🔒</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Create a strong password"
                  placeholderTextColor="#94a3b8"
                  secureTextEntry={!showEmpPassword}
                  value={empPassword}
                  onChangeText={setEmpPassword}
                />
                <TouchableOpacity onPress={() => setShowEmpPassword(!showEmpPassword)}>
                  <Text style={styles.eyeIcon}>{showEmpPassword ? "🙈" : "👁️"}</Text>
                </TouchableOpacity>
              </View>
              <StrengthBar strength={employerStrength} />

              <Text style={styles.label}>Confirm Password</Text>
              <View style={styles.inputWrapper}>
                <Text style={styles.inputIcon}>🔒</Text>
                <TextInput
                  style={styles.input}
                  placeholder="Re-enter password"
                  placeholderTextColor="#94a3b8"
                  secureTextEntry={!showEmpConfirm}
                  value={empConfirmPassword}
                  onChangeText={setEmpConfirmPassword}
                />
                <TouchableOpacity onPress={() => setShowEmpConfirm(!showEmpConfirm)}>
                  <Text style={styles.eyeIcon}>{showEmpConfirm ? "🙈" : "👁️"}</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* ════════════════════════════════════
              EMPLOYER — STEP 2
          ════════════════════════════════════ */}
          {userType === "employer" && step === 2 && (
            <>
              <View style={styles.verificationBox}>
                <Text style={styles.verificationIcon}>🛡️</Text>
                <Text style={styles.verificationText}>
                  Your account will be verified by the admin before activation.
                </Text>
              </View>

              <TouchableOpacity
                style={styles.checkRow}
                onPress={() => setAgreedTerms(!agreedTerms)}
                activeOpacity={0.8}
              >
                <View style={[styles.checkbox, agreedTerms && styles.checkboxChecked]}>
                  {agreedTerms && <Text style={styles.checkmark}>✓</Text>}
                </View>
                <Text style={styles.checkText}>
                  I agree to the{" "}
                  <Text style={styles.link}>terms and conditions</Text>
                </Text>
              </TouchableOpacity>
            </>
          )}

          {/* ── Primary Button ── */}
          <TouchableOpacity
            activeOpacity={0.85}
            onPress={step === 1 ? handleNext : handleSubmit}
            disabled={loading}
          >
            <LinearGradient
              colors={["#1E3A5F", "#2a4a7a"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={[styles.primaryBtn, loading && { opacity: 0.7 }]}
            >
              <Text style={styles.primaryBtnText}>
                {loading
                  ? "Creating Account..."
                  : step === 1
                  ? "Next Step →"
                  : "Create Account 🎉"}
              </Text>
            </LinearGradient>
          </TouchableOpacity>

          {/* ── Sign In ── */}
          <View style={styles.signInRow}>
            <Text style={styles.signInText}>Already have an account? </Text>
            <TouchableOpacity onPress={() => router.push("/login")}>
              <Text style={styles.signInLink}>Sign in</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            style={styles.backToHome}
            onPress={() => router.push("/")}
          >
            <Text style={styles.backToHomeText}>← Back to Home</Text>
          </TouchableOpacity>
        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

// ===== STYLES =====
const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: "#f8faff" },
  topAccent: { height: 4, width: "100%" },
  container: { padding: 20, paddingBottom: 50 },

  headerCard: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    shadowColor: "#1E3A5F",
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 3,
    gap: 12,
  },
  backBtn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#f1f5f9",
    alignItems: "center",
    justifyContent: "center",
  },
  backArrow: { fontSize: 18, color: "#1E3A5F", fontWeight: "700" },
  headerTextGroup: { flex: 1 },
  title: { fontSize: 18, fontWeight: "800", color: "#0f172a" },
  stepLabel: { fontSize: 12, color: "#64748b", marginTop: 2 },
  cuBadge: {
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "#1E3A5F",
    alignItems: "center",
    justifyContent: "center",
  },
  cuBadgeText: { color: "#fff", fontWeight: "800", fontSize: 13 },

  progressHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },
  progressLabel: { fontSize: 12, color: "#64748b" },
  progressPercent: { fontSize: 12, fontWeight: "700", color: "#1E3A5F" },
  progressBg: {
    height: 6,
    backgroundColor: "#e0e0e0",
    borderRadius: 3,
    overflow: "hidden",
    marginBottom: 16,
  },
  progressFill: { height: 6, borderRadius: 3 },

  userTypeRow: { flexDirection: "row", gap: 12, marginBottom: 18 },
  userTypeBtn: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 18,
    borderRadius: 14,
    backgroundColor: "#fff",
    borderWidth: 2,
    borderColor: "#e2e8f0",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowRadius: 6,
    elevation: 2,
  },
  userTypeBtnActive: { borderColor: "#2a4a7a" },
  userTypeIcon: { fontSize: 28, marginBottom: 6 },
  userTypeText: { fontSize: 14, fontWeight: "600", color: "#64748b" },
  userTypeTextActive: { color: "#1E3A5F" },

  errorBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fef2f2",
    borderWidth: 1,
    borderColor: "#fecaca",
    borderRadius: 10,
    padding: 12,
    marginBottom: 14,
    gap: 8,
  },
  errorIcon: { fontSize: 16 },
  errorText: { flex: 1, color: "#dc2626", fontSize: 13 },

  sectionCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 18,
    marginBottom: 14,
    shadowColor: "#1E3A5F",
    shadowOpacity: 0.06,
    shadowRadius: 10,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginBottom: 14,
  },
  sectionDot: { width: 4, height: 20, borderRadius: 2, backgroundColor: "#1E3A5F" },
  sectionTitle: { fontSize: 15, fontWeight: "700", color: "#0f172a" },

  label: {
    fontSize: 12,
    fontWeight: "600",
    color: "#64748b",
    marginBottom: 6,
    marginTop: 10,
  },
  hint: { fontSize: 11, color: "#94a3b8", marginBottom: 8 },

  inputWrapper: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8faff",
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 50,
    borderWidth: 1.5,
    borderColor: "#e2e8f0",
    marginBottom: 2,
  },
  inputIcon: { fontSize: 15, marginRight: 10 },
  input: { flex: 1, fontSize: 14, color: "#0f172a" },
  eyeIcon: { fontSize: 17 },

  strengthRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 6,
    marginBottom: 4,
  },
  strengthBarsRow: { flex: 1, flexDirection: "row", gap: 4 },
  strengthSegment: { flex: 1, height: 4, borderRadius: 2 },
  strengthLabel: { fontSize: 11, fontWeight: "700", minWidth: 48 },

  dropdown: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#f8faff",
    borderRadius: 12,
    paddingHorizontal: 14,
    height: 50,
    borderWidth: 1.5,
    borderColor: "#e2e8f0",
    marginBottom: 2,
  },
  dropdownPlaceholder: { fontSize: 14, color: "#94a3b8" },
  dropdownSelected: { fontSize: 14, color: "#0f172a", fontWeight: "500" },
  dropdownArrow: { fontSize: 11, color: "#94a3b8" },
  dropdownList: {
    backgroundColor: "#fff",
    borderRadius: 12,
    borderWidth: 1.5,
    borderColor: "#e2e8f0",
    shadowColor: "#1E3A5F",
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
    marginBottom: 6,
  },
  dropdownItem: {
    paddingHorizontal: 16,
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: "#f1f5f9",
  },
  dropdownItemText: { fontSize: 14, color: "#334155" },

  // ── CV Upload Styles ──
  cvUploadBox: {
    borderWidth: 2,
    borderColor: "#e2e8f0",
    borderStyle: "dashed",
    borderRadius: 14,
    padding: 20,
    alignItems: "center",
    backgroundColor: "#f8faff",
    marginBottom: 4,
    marginTop: 2,
  },
  cvUploadBoxFilled: {
    borderStyle: "solid",
    borderColor: "#1E3A5F",
    backgroundColor: "#eff6ff",
    padding: 14,
  },
  cvPlaceholder: { alignItems: "center", gap: 8 },
  cvUploadIconWrapper: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: "#dbeafe",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 4,
  },
  cvUploadIconEmoji: { fontSize: 24 },
  cvUploadTitle: { fontSize: 14, fontWeight: "700", color: "#1E3A5F" },
  cvUploadSub: { fontSize: 12, color: "#94a3b8" },
  cvFileRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    width: "100%",
  },
  cvFileIconWrapper: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: "#dbeafe",
    alignItems: "center",
    justifyContent: "center",
  },
  cvFileIconEmoji: { fontSize: 22 },
  cvFileInfo: { flex: 1 },
  cvFileName: {
    fontSize: 13,
    fontWeight: "700",
    color: "#0f172a",
    marginBottom: 2,
  },
  cvFileSize: { fontSize: 11, color: "#64748b" },
  cvRemoveBtn: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "#fee2e2",
    alignItems: "center",
    justifyContent: "center",
  },
  cvRemoveText: { fontSize: 12, color: "#ef4444", fontWeight: "800" },
  cvErrorRow: { marginBottom: 4 },
  cvErrorText: { fontSize: 12, color: "#dc2626" },

  skillsGrid: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 6 },
  skillChip: {
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "#f1f5f9",
    borderWidth: 1.5,
    borderColor: "#e2e8f0",
    overflow: "hidden",
  },
  skillChipActive: { borderColor: "#1E3A5F" },
  skillText: { fontSize: 12, color: "#475569", fontWeight: "500" },
  skillTextActive: { color: "#fff", fontWeight: "600" },

  verificationBox: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#e8f0fe",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    gap: 12,
  },
  verificationIcon: { fontSize: 28 },
  verificationText: {
    flex: 1,
    color: "#1E3A5F",
    fontSize: 14,
    fontWeight: "500",
    lineHeight: 20,
  },

  checkRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 10,
    marginBottom: 16,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 2,
    borderColor: "#cbd5e1",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 1,
  },
  checkboxChecked: { backgroundColor: "#1E3A5F", borderColor: "#1E3A5F" },
  checkmark: { color: "#fff", fontSize: 13, fontWeight: "800" },
  checkText: { flex: 1, fontSize: 13, color: "#475569", lineHeight: 20 },
  link: { color: "#1E3A5F", fontWeight: "700" },

  primaryBtn: {
    borderRadius: 14,
    height: 54,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 6,
    marginBottom: 4,
    shadowColor: "#1E3A5F",
    shadowOpacity: 0.35,
    shadowRadius: 12,
    elevation: 6,
  },
  primaryBtnText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "800",
    letterSpacing: 0.3,
  },

  signInRow: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 16,
    marginBottom: 8,
  },
  signInText: { color: "#94a3b8", fontSize: 13 },
  signInLink: { color: "#1E3A5F", fontSize: 13, fontWeight: "700" },

  backToHome: { alignItems: "center", marginTop: 8 },
  backToHomeText: { color: "#9ca3af", fontSize: 13 },
});
