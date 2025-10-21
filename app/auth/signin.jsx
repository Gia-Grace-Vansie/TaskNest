import { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, TextInput, Pressable, StyleSheet, Image } from "react-native";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { useUser } from "../../contexts/UserContext";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";

WebBrowser.maybeCompleteAuthSession();

export default function SignIn() {
  const { setUser } = useUser();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId:"772927447522-d24ke6satugduo8atboqan336jh8q52e.apps.googleusercontent.com",
    iosClientId: "YOUR_IOS_CLIENT_ID.apps.googleusercontent.com",
    webClientId:
      "772927447522-6gajulbrp53pqljd28sutilpbi42gmiu.apps.googleusercontent.com",
    expoClientId:
      "772927447522-6gajulbrp53pqljd28sutilpbi42gmiu.apps.googleusercontent.com",
  });

  useEffect(() => {
    if (response?.type === "success" && response.authentication?.accessToken) {
      (async () => {
        try {
          const res = await fetch("https://www.googleapis.com/userinfo/v2/me", {
            headers: {
              Authorization: `Bearer ${response.authentication.accessToken}`,
            },
          });
          const user = await res.json();
          setUser({ username: user.name, email: user.email });
          router.replace("/welcome");
        } catch (err) {
          console.error("Google login error:", err);
        }
      })();
    }
  }, [response]);

  const handleSignIn = async () => {
    if (!email.trim() || !password) {
      alert("Please enter email and password!");
      return;
    }

    try {
      const auth = getAuth();
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const { user } = userCredential;

      setUser({ uid: user.uid, email: user.email, username: user.email.split("@")[0] });
      alert(`Welcome back, ${user.email.split("@")[0]}!`);
      router.replace("/welcome");
    } catch (err) {
      console.error("Sign-in error:", err);
      // Friendly error messages
      if (err.code === "auth/user-not-found") setError("No account found with that email.");
      else if (err.code === "auth/wrong-password") setError("Incorrect password. Try again.");
      else if (err.code === "auth/invalid-email") setError("Please enter a valid email address.");
      else setError("Failed to sign in. Please try again.");
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Sign In</Text>
      {error ? <Text style={styles.error}>{error}</Text> : null}

      <TextInput
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        style={styles.input}
        keyboardType="email-address"
      />
      <TextInput
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        style={styles.input}
        secureTextEntry
      />

      <Pressable style={styles.button} onPress={handleSignIn}>
        <Text style={styles.buttonText}>Sign In</Text>
      </Pressable>

      <Pressable
        style={styles.googleButton}
        disabled={!request}
        onPress={() => promptAsync()}
      >
        <Image
          source={{
            uri: "https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg",
          }}
          style={styles.googleLogo}
        />
        <Text style={styles.googleText}>Continue with Google</Text>
      </Pressable>

      <Pressable onPress={() => router.push("/auth/signup")}>
        <Text style={styles.link}>Don’t have an account? Sign Up</Text>
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
    marginBottom: 12,
    fontSize: 14,
    color: "#1B1F3B",
    backgroundColor: "#FFFFFF",
  },
  button: {
    backgroundColor: "#4A90E2",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
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
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#FFD166",
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
    backgroundColor: "#FFFFFF",
  },
  googleLogo: { width: 18, height: 18, marginRight: 6 },
  googleText: { fontSize: 14, fontWeight: "bold", color: "#1B1F3B" },
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
});
