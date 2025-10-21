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
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#FDF6F0", // soft neutral background
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#1B1F3B", // deep navy for text
  },
  button: {
    backgroundColor: "#5A8DEE", // TaskNest blue accent
    padding: 16,
    borderRadius: 12,
    width: "80%",
    shadowColor: "#1B1F3B",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
    elevation: 3,
  },
  buttonText: {
    color: "#FFFFFF",
    fontWeight: "bold",
    fontSize: 16,
    textAlign: "center",
  },
});
