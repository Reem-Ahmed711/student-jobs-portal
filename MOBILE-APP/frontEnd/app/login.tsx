import { useState } from "react";
import { useRouter } from "expo-router";
import AsyncStorage from "@react-native-async-storage/async-storage";
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
import { LinearGradient } from "expo-linear-gradient";
import { loginUser } from "../src/api";

export default function LoginScreen() {
const [email, setEmail] = useState<string>("");
const [password, setPassword] = useState<string>("");
const [showPassword, setShowPassword] = useState<boolean>(false);
const [emailFocused, setEmailFocused] = useState<boolean>(false);
const [passwordFocused, setPasswordFocused] = useState<boolean>(false);
const [loading, setLoading] = useState<boolean>(false);
const [errorMsg, setErrorMsg] = useState<string>("");

const router = useRouter();

const [fontsLoaded] = useFonts({
Poppins_400Regular,
Poppins_600SemiBold,
Poppins_700Bold,
Poppins_800ExtraBold,
});

if (!fontsLoaded) return null;

const handleLogin = async () => {
try {
setErrorMsg("");

if (!email || !password) {
setErrorMsg("Please enter both email and password.");
return;
}

setLoading(true);

const res = await loginUser(email, password);

if (res.success && res.data) {
const backendData = res.data;

await AsyncStorage.setItem("userToken", backendData.token);

const userData = {
uid: backendData.uid,
name: backendData.name || backendData.displayName || email.split("@")[0],
email: backendData.email,
role: backendData.role,
department: backendData.department || "",
gpa: backendData.gpa || "",
year: backendData.year || "",
};

await AsyncStorage.setItem("userData", JSON.stringify(userData));

if (userData.role === "admin") {
Alert.alert("Success 🎉", "Welcome Admin!");
router.replace("/admin/AdminDashboard");
} else if (userData.role === "employer") {
Alert.alert("Success 🎉", "Welcome Employer!");
router.replace("/employer/EmployerDashboard");
} else {
Alert.alert("Success 🎉", `Welcome ${userData.name}!`);
router.replace({
pathname: "/StudentDashboard",
params: userData,
});
}
} else {
setErrorMsg(res.message || "Invalid credentials.");
}
} catch (err: any) {
console.log("LOGIN ERROR FRONT:", err);
setErrorMsg(err?.message || "Server error. Try again.");
} finally {
setLoading(false);
}
};

return (
<View style={styles.root}>
<StatusBar barStyle="dark-content" backgroundColor="#f5f7fa" />

<LinearGradient
colors={["#1E3A5F", "#2a4a7a"]}
start={{ x: 0, y: 0 }}
end={{ x: 1, y: 0 }}
style={styles.topAccent}
/>

<KeyboardAvoidingView
behavior={Platform.OS === "ios" ? "padding" : "height"}
style={styles.kav}
>
<ScrollView
contentContainerStyle={styles.scroll}
keyboardShouldPersistTaps="handled"
showsVerticalScrollIndicator={false}
>
<View style={styles.topBar}>
<View style={styles.logoRow}>
<Text style={styles.appName}>Student Jobs Portal</Text>
</View>
</View>

<View style={styles.illustrationWrapper}>
<View
style={[
styles.dot,
{ top: 10, right: 40, width: 6, height: 6 },
]}
/>
<View
style={[
styles.dot,
{ top: 35, left: 25, width: 4, height: 4, opacity: 0.4 },
]}
/>
<View
style={[
styles.dot,
{ bottom: 10, right: 15, width: 5, height: 5, opacity: 0.3 },
]}
/>
<View style={styles.planetRing}>
<View style={styles.planetCore} />
</View>
<View style={styles.illustrationBox}>
<Text style={styles.illustrationEmoji}>👩‍💻</Text>
</View>
<View style={styles.floatBubble1}>
<Text style={styles.floatIcon}>📊</Text>
</View>
<View style={styles.floatBubble2}>
<Text style={styles.floatIcon}>✏️</Text>
</View>
</View>

<Text style={styles.heading}>Welcome Back</Text>
<Text style={styles.subheading}>
{"Don't have an account? "}
<Text
style={styles.signupLink}
onPress={() => router.push("/register")}
>
Sign up
</Text>
</Text>

<View
style={[styles.inputBox, emailFocused && styles.inputBoxFocused]}
>
<Text style={styles.floatingLabel}>Email Address</Text>
<TextInput
style={styles.input}
placeholder="example@science.cu.edu.eg"
placeholderTextColor="#b0bec5"
keyboardType="email-address"
autoCapitalize="none"
value={email}
onChangeText={setEmail}
onFocus={() => setEmailFocused(true)}
onBlur={() => setEmailFocused(false)}
/>
</View>

<View
style={[
styles.inputBox,
passwordFocused && styles.inputBoxFocused,
]}
>
<Text style={styles.floatingLabel}>Enter Password</Text>
<View style={styles.passwordRow}>
<TextInput
style={[styles.input, { flex: 1 }]}
placeholder="••••••••"
placeholderTextColor="#b0bec5"
secureTextEntry={!showPassword}
value={password}
onChangeText={setPassword}
onFocus={() => setPasswordFocused(true)}
onBlur={() => setPasswordFocused(false)}
/>
<TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
<Text style={styles.toggleText}>
{showPassword ? "Hide" : "Show"}
</Text>
</TouchableOpacity>
</View>
</View>

{errorMsg ? <Text style={styles.errorText}>{errorMsg}</Text> : null}

<TouchableOpacity
activeOpacity={0.85}
onPress={handleLogin}
disabled={loading}
>
<LinearGradient
colors={["#1E3A5F", "#2a4a7a"]}
start={{ x: 0, y: 0 }}
end={{ x: 1, y: 0 }}
style={[styles.signInBtn, loading && { opacity: 0.7 }]}
>
<Text style={styles.signInText}>
{loading ? "Signing in..." : "Sign in"}
</Text>
</LinearGradient>
</TouchableOpacity>

<TouchableOpacity
style={styles.forgotBtn}
onPress={() => router.push("/forgot-password")}
>
<Text style={styles.forgotText}>Forgot your password?</Text>
</TouchableOpacity>

<View style={styles.dividerRow}>
<View style={styles.dividerLine} />
<Text style={styles.orText}>Or sign in with</Text>
<View style={styles.dividerLine} />
</View>

<View style={styles.socialRow}>
<TouchableOpacity style={styles.socialBtn} activeOpacity={0.8}>
<Text style={styles.googleG}>G</Text>
<Text style={styles.socialText}>Google</Text>
</TouchableOpacity>

<TouchableOpacity
style={[styles.socialBtn, styles.facebookBtn]}
activeOpacity={0.8}
>
<Text style={styles.facebookF}>f</Text>
<Text style={[styles.socialText, { color: "#fff" }]}>
Facebook
</Text>
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
topAccent: { height: 4, width: "100%" },
scroll: { flexGrow: 1, paddingHorizontal: 26, paddingBottom: 40 },
topBar: { paddingTop: 54, paddingBottom: 4, alignItems: "center" },
logoRow: { flexDirection: "row", alignItems: "center", gap: 5 },
appName: {
fontFamily: "Poppins_600SemiBold",
fontSize: 16,
color: "#0f172a",
letterSpacing: 0.2,
},
illustrationWrapper: {
height: 180,
alignItems: "center",
justifyContent: "center",
position: "relative",
marginTop: 10,
marginBottom: 4,
},
illustrationBox: {
width: 130,
height: 130,
borderRadius: 65,
backgroundColor: "#eef2ff",
alignItems: "center",
justifyContent: "center",
},
illustrationEmoji: { fontSize: 64 },
dot: {
position: "absolute",
borderRadius: 99,
backgroundColor: "#1E3A5F",
},
planetRing: {
position: "absolute",
top: 12,
right: 50,
width: 30,
height: 30,
borderRadius: 15,
borderWidth: 2,
borderColor: "#c7d9f8",
alignItems: "center",
justifyContent: "center",
},
planetCore: {
width: 10,
height: 10,
borderRadius: 5,
backgroundColor: "#c7d9f8",
},
floatBubble1: {
position: "absolute",
bottom: 20,
left: 30,
backgroundColor: "#fff",
borderRadius: 12,
padding: 6,
shadowColor: "#000",
shadowOpacity: 0.08,
shadowRadius: 6,
elevation: 3,
},
floatBubble2: {
position: "absolute",
top: 20,
left: 50,
backgroundColor: "#fff",
borderRadius: 12,
padding: 6,
shadowColor: "#000",
shadowOpacity: 0.08,
shadowRadius: 6,
elevation: 3,
},
floatIcon: { fontSize: 18 },
heading: {
fontFamily: "Poppins_800ExtraBold",
fontSize: 32,
color: "#0f172a",
marginBottom: 6,
marginTop: 8,
},
subheading: {
fontFamily: "Poppins_400Regular",
fontSize: 13.5,
color: "#94a3b8",
marginBottom: 26,
},
signupLink: {
fontFamily: "Poppins_600SemiBold",
color: "#1E3A5F",
},
inputBox: {
width: "100%",
backgroundColor: "#ffffff",
borderRadius: 14,
paddingHorizontal: 16,
paddingTop: 10,
paddingBottom: 10,
marginBottom: 14,
borderWidth: 1.5,
borderColor: "#e8edf2",
shadowColor: "#000",
shadowOpacity: 0.03,
shadowRadius: 4,
elevation: 1,
},
inputBoxFocused: { borderColor: "#1E3A5F" },
floatingLabel: {
fontFamily: "Poppins_400Regular",
fontSize: 11,
color: "#94a3b8",
marginBottom: 2,
},
passwordRow: { flexDirection: "row", alignItems: "center" },
input: {
fontFamily: "Poppins_400Regular",
fontSize: 15,
color: "#0f172a",
paddingVertical: 2,
},
toggleText: {
fontFamily: "Poppins_600SemiBold",
fontSize: 12,
color: "#1E3A5F",
paddingLeft: 8,
},
errorText: {
fontFamily: "Poppins_400Regular",
color: "#ef4444",
fontSize: 13,
textAlign: "center",
marginBottom: 8,
},
signInBtn: {
width: "100%",
height: 52,
borderRadius: 30,
alignItems: "center",
justifyContent: "center",
marginTop: 4,
marginBottom: 14,
shadowColor: "#1E3A5F",
shadowOffset: { width: 0, height: 6 },
shadowOpacity: 0.35,
shadowRadius: 14,
elevation: 6,
},
signInText: {
fontFamily: "Poppins_700Bold",
fontSize: 16,
color: "#ffffff",
letterSpacing: 0.3,
},
forgotBtn: { alignItems: "center", marginBottom: 22 },
forgotText: {
fontFamily: "Poppins_600SemiBold",
fontSize: 13,
color: "#1E3A5F",
},
dividerRow: { flexDirection: "row", alignItems: "center", marginBottom: 18 },
dividerLine: { flex: 1, height: 1, backgroundColor: "#e2e8f0" },
orText: {
fontFamily: "Poppins_400Regular",
fontSize: 13,
color: "#94a3b8",
marginHorizontal: 12,
},
socialRow: { flexDirection: "row", gap: 12 },
socialBtn: {
flex: 1,
flexDirection: "row",
alignItems: "center",
justifyContent: "center",
height: 50,
borderRadius: 14,
borderWidth: 1.5,
borderColor: "#e2e8f0",
gap: 8,
backgroundColor: "#ffffff",
shadowColor: "#000",
shadowOpacity: 0.04,
shadowRadius: 4,
elevation: 1,
},
facebookBtn: { backgroundColor: "#1877F2", borderColor: "#1877F2" },
googleG: {
fontFamily: "Poppins_700Bold",
fontSize: 17,
color: "#EA4335",
},
facebookF: {
fontFamily: "Poppins_700Bold",
fontSize: 18,
color: "#fff",
},
socialText: {
fontFamily: "Poppins_600SemiBold",
fontSize: 14,
color: "#0f172a",
},
});