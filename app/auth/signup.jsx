import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import { useUser } from "../../contexts/UserContext";
import { useRouter } from "expo-router";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";

export default function SignUp() {
  const { setUser } = useUser();
  const router = useRouter();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [birthday, setBirthday] = useState("");
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState("");

  const handleBirthdayChange = (text) => {
    const digits = text.replace(/\D/g, "");
    let formatted = digits;
    if (digits.length > 4 && digits.length <= 6) formatted = digits.slice(0, 4) + "-" + digits.slice(4);
    else if (digits.length > 6) formatted = digits.slice(0, 4) + "-" + digits.slice(4, 6) + "-" + digits.slice(6, 8);
    if (formatted.length > 10) formatted = formatted.slice(0, 10);
    setBirthday(formatted);
  };

  const handleSignUp = async () => {
    if (!username.trim() || !email.trim() || !password || !confirmPassword || !birthday) {
      alert("Please fill all fields!");
      return;
    }
    if (password !== confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    if (!agree) {
      alert("You must agree to the Terms and Conditions before signing up.");
      return;
    }

    try {
      const auth = getAuth();
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);

      setUser({ uid: userCredential.user.uid, username, email, birthday });
      alert(`Welcome, ${username}!`);
      router.replace("/main/MainScreen");
    } catch (err) {
      console.error("Signup error:", err);
      setError(err.message);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <TextInput placeholder="Username" value={username} onChangeText={setUsername} style={styles.input} />
      <TextInput placeholder="Email" value={email} onChangeText={setEmail} style={styles.input} keyboardType="email-address" />
      <TextInput placeholder="Password" value={password} onChangeText={setPassword} style={styles.input} secureTextEntry />
      <TextInput placeholder="Confirm Password" value={confirmPassword} onChangeText={setConfirmPassword} style={styles.input} secureTextEntry />
      <TextInput placeholder="Birthday (YYYY-MM-DD)" value={birthday} onChangeText={handleBirthdayChange} style={styles.input} keyboardType="number-pad" maxLength={10} />

      <Pressable style={styles.agreeRow} onPress={() => setAgree(!agree)}>
        <View style={styles.checkbox}>{agree && <Text style={styles.checkmark}>✓</Text>}</View>
        <Text style={styles.agreeText}>I agree to the <Text style={styles.link}>Terms and Conditions</Text></Text>
      </Pressable>

      <Pressable style={[styles.button, !agree && { backgroundColor: "#aaa" }]} onPress={handleSignUp}>
        <Text style={styles.buttonText}>Sign Up</Text>
      </Pressable>

      <Pressable onPress={() => router.push("/auth/signin")}>
        <Text style={styles.link}>Already have an account? Sign In</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 16, textAlign: "center" },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 10, padding: 10, marginBottom: 12, fontSize: 14 },
  button: { backgroundColor: "black", padding: 14, borderRadius: 10, alignItems: "center", marginBottom: 10 },
  buttonText: { color: "white", fontWeight: "bold", fontSize: 14 },
  link: { color: "blue", textAlign: "center", marginTop: 8, fontSize: 12 },
  error: { color: "red", marginBottom: 8, textAlign: "center", fontSize: 12 },
  agreeRow: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  checkbox: { width: 18, height: 18, borderWidth: 1, borderColor: "#555", marginRight: 8, borderRadius: 4, justifyContent: "center", alignItems: "center" },
  checkmark: { fontSize: 12, color: "black", fontWeight: "bold" },
  agreeText: { fontSize: 12, flexShrink: 1 },
});
