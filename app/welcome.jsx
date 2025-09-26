import { useEffect } from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { useUser } from "../contexts/UserContext";

export default function Welcome() {
  const router = useRouter();
  const { user } = useUser();

  useEffect(() => {
    // Auto-redirect after 2 seconds (optional)
    const timer = setTimeout(() => {
      router.replace("/dashboard");
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome, {user?.username || "Guest"}!</Text>
      <Pressable style={styles.button} onPress={() => router.replace("/dashboard")}>
        <Text style={styles.buttonText}>Continue to Dashboard</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  title: { fontSize: 28, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  button: { backgroundColor: "black", padding: 16, borderRadius: 10 },
  buttonText: { color: "white", fontWeight: "bold", fontSize: 16 },
});
