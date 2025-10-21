import { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { View, Text, TextInput, Pressable, StyleSheet } from "react-native";
import { useUser } from "../../contexts/UserContext";
import { useRouter } from "expo-router";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore"; // 🔹 Firestore import

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
  const [fieldErrors, setFieldErrors] = useState({});

  const handleBirthdayChange = (text) => {
    const digits = text.replace(/\D/g, "");
    let formatted = digits;
    if (digits.length > 4 && digits.length <= 6)
      formatted = digits.slice(0, 4) + "-" + digits.slice(4);
    else if (digits.length > 6)
      formatted =
        digits.slice(0, 4) + "-" + digits.slice(4, 6) + "-" + digits.slice(6, 8);
    if (formatted.length > 10) formatted = formatted.slice(0, 10);
    setBirthday(formatted);
  };

  const validateFields = () => {
    const errors = {};

    if (!username.trim()) errors.username = "Username is required";
    if (!email.trim()) errors.email = "Email is required";

    if (!password) {
      errors.password = "Password is required";
    } else {
      if (password.length < 6)
        errors.password = "Password must be at least 6 characters";
      else if (!/[A-Z]/.test(password))
        errors.password = "Password must contain at least one uppercase letter";
      else if (!/\d/.test(password))
        errors.password = "Password must contain at least one number";
    }

    if (!confirmPassword) errors.confirmPassword = "Please confirm your password";
    if (password && confirmPassword && password !== confirmPassword)
      errors.confirmPassword = "Passwords do not match";

    if (!birthday.trim()) errors.birthday = "Birthday is required";
    if (!agree) errors.agree = "You must agree to the terms";

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSignUp = async () => {
    if (!validateFields()) return;

    try {
      const auth = getAuth();
      const firestore = getFirestore(); // 🔹 Initialize Firestore

      // Create user in Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const uid = userCredential.user.uid;

      // 🔹 Save user data in Firestore
      await setDoc(doc(firestore, "users", uid), {
        uid,
        username,
        email,
        birthday,
        createdAt: new Date().toISOString(),
      });

      // Save to context
      setUser({ uid, username, email, birthday });

      alert(`Welcome, ${username}!`);
      router.replace("/welcome");
    } catch (err) {
      console.error("Signup error:", err);
      setError(err.message);
    }
  };

  const getInputStyle = (field) => [
    styles.input,
    fieldErrors[field] && { borderColor: "#FF6B6B" },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Sign Up</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <TextInput
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
        style={getInputStyle("username")}
      />
      {fieldErrors.username && <Text style={styles.fieldError}>{fieldErrors.username}</Text>}

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={getInputStyle("email")}
        keyboardType="email-address"
      />
      {fieldErrors.email && <Text style={styles.fieldError}>{fieldErrors.email}</Text>}

      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        style={getInputStyle("password")}
        secureTextEntry
      />
      {fieldErrors.password && <Text style={styles.fieldError}>{fieldErrors.password}</Text>}

      <TextInput
        placeholder="Confirm Password"
        value={confirmPassword}
        onChangeText={setConfirmPassword}
        style={getInputStyle("confirmPassword")}
        secureTextEntry
      />
      {fieldErrors.confirmPassword && (
        <Text style={styles.fieldError}>{fieldErrors.confirmPassword}</Text>
      )}

      <TextInput
        placeholder="Birthday (YYYY-MM-DD)"
        value={birthday}
        onChangeText={handleBirthdayChange}
        style={getInputStyle("birthday")}
        keyboardType="number-pad"
        maxLength={10}
      />
      {fieldErrors.birthday && <Text style={styles.fieldError}>{fieldErrors.birthday}</Text>}

      <Pressable style={styles.agreeRow} onPress={() => setAgree(!agree)}>
        <View
          style={[
            styles.checkbox,
            agree && { backgroundColor: "#4A90E2", borderColor: "#4A90E2" },
            fieldErrors.agree && { borderColor: "#FF6B6B" },
          ]}
        >
          {agree && <Text style={styles.checkmark}>✓</Text>}
        </View>
        <Text style={styles.agreeText}>
          I agree to the <Text style={styles.link}>Terms and Conditions</Text>
        </Text>
      </Pressable>
      {fieldErrors.agree && <Text style={styles.fieldError}>{fieldErrors.agree}</Text>}

      <Pressable
        style={[styles.button, !agree && { backgroundColor: "#A0AEC0" }]}
        onPress={handleSignUp}
      >
        <Text style={styles.buttonText}>Sign Up</Text>
      </Pressable>

      <Pressable onPress={() => router.push("/auth/signin")}>
        <Text style={styles.link}>Already have an account? Sign In</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "#FAFAFA",
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
    color: "#1B1F3B",
  },
  input: {
    borderWidth: 1,
    borderColor: "#4A90E2",
    borderRadius: 10,
    padding: 10,
    marginBottom: 8,
    fontSize: 14,
    color: "#1B1F3B",
    backgroundColor: "#FFFFFF",
  },
  fieldError: {
    color: "#FF6B6B",
    fontSize: 11,
    marginBottom: 6,
    marginLeft: 4,
  },
  button: {
    backgroundColor: "#4A90E2",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 6,
    shadowColor: "#1B1F3B",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 5,
    elevation: 3,
  },
  buttonText: {
    color: "#FAFAFA",
    fontWeight: "bold",
    fontSize: 14,
  },
  link: {
    color: "#FF6B6B",
    textAlign: "center",
    marginTop: 8,
    fontSize: 12,
    fontWeight: "600",
  },
  error: {
    color: "#FF6B6B",
    marginBottom: 8,
    textAlign: "center",
    fontSize: 12,
  },
  agreeRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderWidth: 1,
    borderColor: "#1B1F3B",
    marginRight: 8,
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#FFFFFF",
  },
  checkmark: {
    fontSize: 12,
    color: "#FAFAFA",
    fontWeight: "bold",
  },
  agreeText: {
    fontSize: 12,
    flexShrink: 1,
    color: "#1B1F3B",
  },
});
