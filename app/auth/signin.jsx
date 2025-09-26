import { useState, useEffect } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import { Text, TextInput, Pressable, StyleSheet, Image } from "react-native";
import { useRouter } from "expo-router";
import * as WebBrowser from "expo-web-browser";
import * as Google from "expo-auth-session/providers/google";
import { useUser } from "../../contexts/UserContext";

WebBrowser.maybeCompleteAuthSession();

export default function SignIn() {
  const { setUser } = useUser();
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [request, response, promptAsync] = Google.useAuthRequest({
    androidClientId:
      "772927447522-d24ke6satugduo8atboqan336jh8q52e.apps.googleusercontent.com",
    iosClientId: "YOUR_IOS_CLIENT_ID.apps.googleusercontent.com",
    webClientId:
      "772927447522-6gajulbrp53pqljd28sutilpbi42gmiu.apps.googleusercontent.com",
    expoClientId:
      "772927447522-6gajulbrp53pqljd28sutilpbi42gmiu.apps.googleusercontent.com",
  });

  // ✅ Handle Google Login response
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

          // redirect to welcome page
          router.replace("/welcome");
        } catch (err) {
          console.error("Google login error:", err);
        }
      })();
    }
  }, [response]);

  // ✅ Handle manual email/password login
  const handleSignIn = () => {
    if (!email.trim() || !password) {
      alert("Please enter email and password!");
      return;
    }
    setUser({ username: email.split("@")[0], email });

    // redirect to welcome page
    router.replace("/welcome");
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Sign In</Text>

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
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
    fontSize: 14,
  },
  button: {
    backgroundColor: "black",
    padding: 14,
    borderRadius: 10,
    alignItems: "center",
    marginBottom: 10,
  },
  buttonText: { color: "white", fontWeight: "bold", fontSize: 14 },
  googleButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 10,
    padding: 10,
    marginBottom: 12,
  },
  googleLogo: { width: 18, height: 18, marginRight: 6 },
  googleText: { fontSize: 14, fontWeight: "bold", color: "#333" },
  link: { color: "blue", textAlign: "center", marginTop: 8, fontSize: 12 },
});
