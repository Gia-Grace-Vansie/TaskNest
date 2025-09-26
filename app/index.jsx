import { SafeAreaView, Text, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function Welcome() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Welcome</Text>
      <Text style={styles.subtitle}>Get started with your app</Text>

      <Pressable
        style={styles.button}
        onPress={() => router.push("/auth/signin")}
      >
        <Text style={styles.buttonText}>Get Started</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20 },
  title: { fontSize: 32, fontWeight: "bold", marginBottom: 10 },
  subtitle: { fontSize: 16, color: "#666", marginBottom: 40 },
  button: { backgroundColor: "black", padding: 16, borderRadius: 12, width: "80%" },
  buttonText: { color: "white", fontSize: 18, textAlign: "center", fontWeight: "bold" },
});
