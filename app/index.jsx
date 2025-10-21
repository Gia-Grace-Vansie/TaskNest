import { SafeAreaView, Text, Pressable, StyleSheet } from "react-native";
import { useRouter } from "expo-router";

export default function Welcome() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>TaskNest</Text>
      <Text style={styles.subtitle}>Where your goals take flight.</Text>

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
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#FAFAFA", // Off-White background
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#1B1F3B", // Deep Navy text
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: "#4A90E2", // Bright Blue for a lively subtitle
    marginBottom: 40,
  },
  button: {
    backgroundColor: "#4A90E2", // Bright Blue primary button
    padding: 16,
    borderRadius: 12,
    width: "80%",
    shadowColor: "#1B1F3B",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 3,
  },
  buttonText: {
    color: "#FAFAFA", // Off-White text for contrast
    fontSize: 18,
    textAlign: "center",
    fontWeight: "bold",
  },
});
