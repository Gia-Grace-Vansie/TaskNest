import React, { useEffect } from "react";
import { View, Text, StyleSheet, ActivityIndicator } from "react-native";
import { useRouter } from "expo-router";

export default function LogoutScreen() {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.replace("/"); // redirect to home after 5s
    }, 5000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>✅ Successfully Logged Out</Text>
      <Text style={styles.subtitle}>Redirecting to home...</Text>
      <ActivityIndicator size="large" color="#000" style={{ marginTop: 20 }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", padding: 20, backgroundColor: "#fff" },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 10, color: "#000" },
  subtitle: { fontSize: 16, color: "#666" },
});
