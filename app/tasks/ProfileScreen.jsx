import React from "react";
import { View, Text, StyleSheet, ScrollView, Pressable, Image, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUser } from "../../contexts/UserContext";

export default function ProfileScreen() {
  const { user, logout } = useUser();

  if (!user) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const handleLogout = () => {
    Alert.alert(
      "Logout",
      "Are you sure you want to log out?",
      [
        { text: "Cancel", style: "cancel" },
        { text: "Logout", style: "destructive", onPress: () => logout() },
      ]
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f8f8f8" }}>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 20 }}>
        <View style={styles.profileHeader}>
          <Image
            source={require("../../assets/images/default-avatar.png")}
            style={styles.avatar}
          />
          <Text style={styles.userName}>{user.username}</Text>
          <Text style={styles.userEmail}>{user.email}</Text>
        </View>

        <View style={styles.infoSection}>
          <Text style={styles.sectionTitle}>Account Information</Text>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Username:</Text>
            <Text style={styles.infoValue}>{user.username}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>Email:</Text>
            <Text style={styles.infoValue}>{user.email}</Text>
          </View>

          {/* Logout Button */}
          <Pressable style={styles.logoutButton} onPress={handleLogout}>
            <Text style={styles.logoutText}>Log Out</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  profileHeader: {
    alignItems: "center",
    marginBottom: 30,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "#000",
    marginBottom: 15,
  },
  userName: { fontSize: 22, fontWeight: "bold", color: "#000" },
  userEmail: { fontSize: 16, color: "#666" },
  infoSection: { marginTop: 20 },
  sectionTitle: { fontSize: 18, fontWeight: "bold", color: "#000", marginBottom: 10 },
  infoRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 10 },
  infoLabel: { fontSize: 16, color: "#666" },
  infoValue: { fontSize: 16, color: "#000" },
  logoutButton: {
    marginTop: 30,
    backgroundColor: "#000",
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
  },
  logoutText: { color: "#fff", fontSize: 16, fontWeight: "bold" },
});
