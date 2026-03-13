import { useRef, useState } from "react";
import { useRouter } from "expo-router";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
  StatusBar,
  ScrollView,
  Alert,
} from "react-native";
import {
  useFonts,
  Poppins_400Regular,
  Poppins_600SemiBold,
  Poppins_700Bold,
  Poppins_800ExtraBold,
} from "@expo-google-fonts/poppins";

export default function ForgotPasswordScreen() {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [phoneFocused, setPhoneFocused] = useState(false);
  const [newFocused, setNewFocused] = useState(false);
  const [confirmFocused, setConfirmFocused] = useState(false);
  const router = useRouter();
  const otpRefs = useRef<(TextInput | null)[]>([]);

  const [fontsLoaded] = useFonts({
    Poppins_400Regular,
    Poppins_600SemiBold,
    Poppins_700Bold,
    Poppins_800ExtraBold,
  });

  if (!fontsLoaded) return null;

  const handleSendCode = () => {
    if (!phone) return Alert.alert("Error", "Please enter your phone number.");
    setStep(2);
  };

  const handleVerifyOtp = () => {
    if (otp.join("").length < 6) return Alert.alert("Error", "Please enter the full 6-digit code.");
    setStep(3);
  };

  const handleResetPassword = () => {
    if (!newPassword || !confirmPassword) return Alert.alert("Error", "Please fill in all fields.");
    if (newPassword !== confirmPassword) return Alert.alert("Error", "Passwords do not match.");
    Alert.alert("Success", "Password reset successfully!", [
      { text: "Login", onPress: () => router.replace("/") },
    ]);
  };

  const handleOtpChange = (val: string, index: number) => {
    const updated = [...otp];
    updated[index] = val;
    setOtp(updated);
    if (val && index < 5) otpRefs.current[index + 1]?.focus();
  };

  return (
    <View style={styles.root}>
      <StatusBar barStyle="dark-content" backgroundColor="#f5f7fa" />
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.kav}>

        {/* Top Bar */}
        <View style={styles.topBar}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => (step > 1 ? setStep((step - 1) as 1 | 2 | 3) : router.back())}
          >
            <Text style={styles.backArrow}>←</Text>
          </TouchableOpacity>
          <View style={styles.logoRow}>
            {/* <Text style={styles.sparkle}>✦</Text> */}
            <Text style={styles.appName}>Student jobs portal</Text>
          </View>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView
          contentContainerStyle={styles.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >

          {/* ── STEP 1 — Phone ── */}
          {step === 1 && (
            <>
              <View style={styles.iconWrapper}>
                <View style={styles.iconCircle}>
                  <Text style={styles.iconEmoji}>🔒</Text>
                </View>
              </View>

              <Text style={styles.heading}>Forgot Password?</Text>
              <Text style={styles.subheading}>
                No worries! Enter your phone number and we'll send you a reset code.
              </Text>

              <View style={[styles.inputBox, phoneFocused && styles.inputBoxFocused]}>
                <Text style={styles.floatingLabel}>Phone Number</Text>
                <View style={styles.phoneRow}>
                  <Text style={styles.countryCode}>EG +20</Text>
                  <View style={styles.dividerV} />
                  <TextInput
                    style={[styles.input, { flex: 1 }]}
                    placeholder="010 0000 0000"
                    placeholderTextColor="#b0bec5"
                    keyboardType="phone-pad"
                    value={phone}
                    onChangeText={setPhone}
                    onFocus={() => setPhoneFocused(true)}
                    onBlur={() => setPhoneFocused(false)}
                    maxLength={11}
                  />
                  {phone.length >= 10 && <Text style={styles.checkIcon}>✓</Text>}
                </View>
              </View>

              <TouchableOpacity style={styles.mainBtn} activeOpacity={0.85} onPress={handleSendCode}>
                <Text style={styles.mainBtnText}>Send Reset Code</Text>
              </TouchableOpacity>

              <TouchableOpacity style={styles.backToLogin} onPress={() => router.back()}>
                <Text style={styles.backToLoginText}>← Back to Sign In</Text>
              </TouchableOpacity>
            </>
          )}

          {/* ── STEP 2 — OTP ── */}
          {step === 2 && (
            <>
              <View style={styles.iconWrapper}>
                <View style={styles.iconCircle}>
                  <Text style={styles.iconEmoji}>📲</Text>
                </View>
              </View>

              <Text style={styles.heading}>Check your phone</Text>
              <Text style={styles.subheading}>
                We sent a 6-digit code to{"\n"}
                <Text style={styles.phoneHighlight}>+20 {phone}</Text>
              </Text>

              <View style={styles.otpRow}>
                {otp.map((digit, index) => (
                  <TextInput
                    key={index}
                    ref={(ref) => { otpRefs.current[index] = ref; }}
                    style={[styles.otpBox, digit ? styles.otpBoxFilled : undefined]}
                    maxLength={1}
                    keyboardType="number-pad"
                    value={digit}
                    onChangeText={(val) => handleOtpChange(val, index)}
                    textAlign="center"
                  />
                ))}
              </View>

              <TouchableOpacity style={styles.mainBtn} activeOpacity={0.85} onPress={handleVerifyOtp}>
                <Text style={styles.mainBtnText}>Verify Code</Text>
              </TouchableOpacity>

              <View style={styles.resendRow}>
                <Text style={styles.resendText}>Didn't receive it?  </Text>
                <TouchableOpacity>
                  <Text style={styles.resendLink}>Resend SMS</Text>
                </TouchableOpacity>
              </View>
            </>
          )}

          {/* ── STEP 3 — New Password ── */}
          {step === 3 && (
            <>
              <View style={styles.iconWrapper}>
                <View style={styles.iconCircle}>
                  <Text style={styles.iconEmoji}>🔑</Text>
                </View>
              </View>

              <Text style={styles.heading}>New Password</Text>
              <Text style={styles.subheading}>
                Create a strong password to keep{"\n"}your account secure.
              </Text>

              <View style={[styles.inputBox, newFocused && styles.inputBoxFocused]}>
                <Text style={styles.floatingLabel}>New Password</Text>
                <View style={styles.passwordRow}>
                  <TextInput
                    style={[styles.input, { flex: 1 }]}
                    placeholder="Enter new password"
                    placeholderTextColor="#b0bec5"
                    secureTextEntry={!showNew}
                    value={newPassword}
                    onChangeText={setNewPassword}
                    onFocus={() => setNewFocused(true)}
                    onBlur={() => setNewFocused(false)}
                  />
                  <TouchableOpacity onPress={() => setShowNew(!showNew)}>
                    <Text style={styles.toggleText}>{showNew ? "Hide" : "Show"}</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <View style={[styles.inputBox, confirmFocused && styles.inputBoxFocused]}>
                <Text style={styles.floatingLabel}>Confirm Password</Text>
                <View style={styles.passwordRow}>
                  <TextInput
                    style={[styles.input, { flex: 1 }]}
                    placeholder="Confirm new password"
                    placeholderTextColor="#b0bec5"
                    secureTextEntry={!showConfirm}
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    onFocus={() => setConfirmFocused(true)}
                    onBlur={() => setConfirmFocused(false)}
                  />
                  <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)}>
                    <Text style={styles.toggleText}>{showConfirm ? "Hide" : "Show"}</Text>
                  </TouchableOpacity>
                </View>
              </View>

              <TouchableOpacity style={styles.mainBtn} activeOpacity={0.85} onPress={handleResetPassword}>
                <Text style={styles.mainBtnText}>Reset Password</Text>
              </TouchableOpacity>
            </>
          )}

          {/* Footer */}
          <View style={styles.footerRow}>
            <Text style={styles.footerText}>Remember your password?  </Text>
            <TouchableOpacity onPress={() => router.replace("/")}>
              <Text style={styles.footerLink}>Sign In</Text>
            </TouchableOpacity>
          </View>

        </ScrollView>
      </KeyboardAvoidingView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#f5f7fa" },
  kav: { flex: 1 },
  scroll: { flexGrow: 1, paddingHorizontal: 26, paddingBottom: 48 },

  // Top Bar
  topBar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingTop: 54,
    paddingHorizontal: 20,
    paddingBottom: 4,
  },
  backBtn: {
    width: 40, height: 40, borderRadius: 20,
    backgroundColor: "#ffffff",
    alignItems: "center", justifyContent: "center",
    shadowColor: "#000", shadowOpacity: 0.07, shadowRadius: 6, elevation: 2,
  },
  backArrow: { fontSize: 18, color: "#0f172a", fontFamily: "Poppins_700Bold" },
  logoRow: { flexDirection: "row", alignItems: "center", gap: 5 },
  sparkle: { fontSize: 15, color: "#1a6fd4" },
  appName: { fontFamily: "Poppins_600SemiBold", fontSize: 16, color: "#0f172a" },

  // Icon
  iconWrapper: { alignItems: "center", marginTop: 36, marginBottom: 28 },
  iconCircle: {
    width: 120, height: 120, borderRadius: 60,
    backgroundColor: "#eef2ff",
    alignItems: "center", justifyContent: "center",
    shadowColor: "#1a6fd4", shadowOpacity: 0.1, shadowRadius: 20, elevation: 3,
  },
  iconEmoji: { fontSize: 56 },

  // Heading
  heading: {
    fontFamily: "Poppins_800ExtraBold",
    fontSize: 30, color: "#0f172a", marginBottom: 8,
  },
  subheading: {
    fontFamily: "Poppins_400Regular",
    fontSize: 14, color: "#94a3b8", marginBottom: 30, lineHeight: 22,
  },
  phoneHighlight: {
    fontFamily: "Poppins_600SemiBold",
    color: "#1a6fd4",
  },

  // Inputs
  inputBox: {
    width: "100%", backgroundColor: "#ffffff", borderRadius: 14,
    paddingHorizontal: 16, paddingTop: 10, paddingBottom: 10,
    marginBottom: 14, borderWidth: 1.5, borderColor: "#e8edf2",
    shadowColor: "#000", shadowOpacity: 0.03, shadowRadius: 4, elevation: 1,
  },
  inputBoxFocused: { borderColor: "#1a6fd4" },
  floatingLabel: { fontFamily: "Poppins_400Regular", fontSize: 11, color: "#94a3b8", marginBottom: 2 },
  phoneRow: { flexDirection: "row", alignItems: "center" },
  passwordRow: { flexDirection: "row", alignItems: "center" },
  countryCode: { fontFamily: "Poppins_700Bold", fontSize: 13, color: "#0f172a" },
  dividerV: { width: 1.5, height: 22, backgroundColor: "#e2e8f0", marginHorizontal: 10 },
  input: { fontFamily: "Poppins_400Regular", fontSize: 15, color: "#0f172a", paddingVertical: 2 },
  toggleText: { fontFamily: "Poppins_600SemiBold", fontSize: 12, color: "#1a6fd4", paddingLeft: 8 },
  checkIcon: { fontSize: 16, color: "#22c55e", fontFamily: "Poppins_700Bold" },

  // Main Button
  mainBtn: {
    width: "100%", height: 52, borderRadius: 30,
    backgroundColor: "#1a6fd4",
    alignItems: "center", justifyContent: "center",
    marginTop: 6, marginBottom: 16,
    shadowColor: "#1a6fd4", shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.35, shadowRadius: 14, elevation: 6,
  },
  mainBtnText: { fontFamily: "Poppins_700Bold", fontSize: 16, color: "#fff", letterSpacing: 0.3 },

  // Back to login link
  backToLogin: { alignItems: "center", marginTop: 4 },
  backToLoginText: { fontFamily: "Poppins_600SemiBold", fontSize: 13, color: "#1a6fd4" },

  // OTP
  otpRow: {
    flexDirection: "row", justifyContent: "space-between",
    width: "100%", marginBottom: 24,
  },
  otpBox: {
    width: 46, height: 58, borderRadius: 14,
    backgroundColor: "#ffffff", borderWidth: 1.5, borderColor: "#e8edf2",
    fontSize: 24, fontFamily: "Poppins_700Bold", color: "#0f172a",
    shadowColor: "#000", shadowOpacity: 0.03, shadowRadius: 4, elevation: 1,
  },
  otpBoxFilled: { borderColor: "#1a6fd4", backgroundColor: "#f0f6ff" },

  // Resend
  resendRow: { flexDirection: "row", alignItems: "center", justifyContent: "center", marginTop: 4 },
  resendText: { fontFamily: "Poppins_400Regular", color: "#94a3b8", fontSize: 13 },
  resendLink: { fontFamily: "Poppins_700Bold", color: "#1a6fd4", fontSize: 13 },

  // Footer
  footerRow: { flexDirection: "row", marginTop: 32, alignItems: "center", justifyContent: "center" },
  footerText: { fontFamily: "Poppins_400Regular", color: "#94a3b8", fontSize: 13 },
  footerLink: { fontFamily: "Poppins_700Bold", color: "#1a6fd4", fontSize: 13 },
});
