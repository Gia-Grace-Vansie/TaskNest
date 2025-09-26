import React from "react";
import { View, Text, StyleSheet, Pressable } from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function NotFoundScreen() {
  const navigation = useNavigation();

  const goBackHome = () => {
    navigation.navigate("dashboard"); // replace with your home route
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>404</Text>
      <Text style={styles.subtitle}>Page Not Found</Text>
      <Text style={styles.message}>
        Oops! The page you're looking for doesn't exist.
      </Text>

      <Pressable style={styles.button} onPress={goBackHome}>
        <Text style={styles.buttonText}>Go Back Home</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f8f8",
    padding: 20,
  },
  title: {
    fontSize: 72,
    fontWeight: "bold",
    color: "#000",
  },
  subtitle: {
    fontSize: 24,
    fontWeight: "600",
    marginVertical: 10,
    color: "#000",
  },
  message: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 30,
  },
  button: {
    backgroundColor: "#000",
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});
