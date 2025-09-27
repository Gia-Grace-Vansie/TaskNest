import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Image,
  TouchableOpacity,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useUser } from "../../contexts/UserContext";
import { useRouter } from "expo-router";
import { useTheme } from "../../contexts/ThemeContext";

export default function ProfileScreen() {
  const { user, logout } = useUser();
  const router = useRouter();
  const { theme, setAccentColor, toggleTheme } = useTheme();

  if (!user) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: theme.colors.background,
        }}
      >
        <Text style={{ color: theme.colors.text }}>Loading...</Text>
      </View>
    );
  }

  const handleLogout = async () => {
    try {
      await logout();
      router.push("/logoutScreen");
    } catch (error) {
      console.error("Logout failed:", error);
      alert("Something went wrong while logging out.");
    }
  };

  // Classy-cutesy student palette
  const colors = ["#5A8DEE", "#FFB6C1", "#CBA6F7", "#A3E3D6", "#FFE066"];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 20 }}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <Image
            source={require("../../assets/images/default-avatar.png")}
            style={[styles.avatar, { borderColor: theme.colors.primary, borderWidth: 2 }]}
          />
          <Text style={[styles.userName, { color: theme.colors.text }]}>{user.username}</Text>
          <Text style={[styles.userEmail, { color: theme.colors.text }]}>{user.email}</Text>
        </View>

        {/* Account Information */}
        <View style={styles.infoSection}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Account Information</Text>
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: theme.colors.text }]}>Username:</Text>
            <Text style={[styles.infoValue, { color: theme.colors.text }]}>{user.username}</Text>
          </View>
          <View style={styles.infoRow}>
            <Text style={[styles.infoLabel, { color: theme.colors.text }]}>Email:</Text>
            <Text style={[styles.infoValue, { color: theme.colors.text }]}>{user.email}</Text>
          </View>
        </View>

        {/* Theme Customization */}
        <View style={styles.infoSection}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Customize Theme</Text>
          <View style={styles.colorsContainer}>
            {colors.map((color) => (
              <TouchableOpacity
                key={color}
                style={[
                  styles.colorCircle,
                  { backgroundColor: color },
                  theme.colors.primary.toLowerCase() === color.toLowerCase() && styles.selectedColor,
                ]}
                onPress={() => setAccentColor(color)}
              />
            ))}
          </View>
          <TouchableOpacity
            style={[styles.toggleButton, { backgroundColor: theme.colors.primary }]}
            onPress={toggleTheme}
          >
            <Text style={{ color: "#fff", fontWeight: "600", fontSize: 14 }}>Toggle Light/Dark Mode</Text>
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <View style={styles.infoSection}>
          <Pressable
            style={[styles.logoutButton, { backgroundColor: theme.colors.primary }]}
            onPress={handleLogout}
          >
            <Text style={[styles.logoutText, { color: "#fff" }]}>Log Out</Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  profileHeader: { alignItems: "center", marginBottom: 24 },
  avatar: { width: 90, height: 90, borderRadius: 45, backgroundColor: "#fff", marginBottom: 12 },
  userName: { fontSize: 20, fontWeight: "700" },
  userEmail: { fontSize: 14, marginTop: 2 },
  infoSection: { marginTop: 16 },
  sectionTitle: { fontSize: 16, fontWeight: "700", marginBottom: 10 },
  infoRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 10 },
  infoLabel: { fontSize: 14 },
  infoValue: { fontSize: 14, fontWeight: "500" },
  logoutButton: {
    marginTop: 8,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    elevation: 2,
  },
  logoutText: { fontSize: 14, fontWeight: "600" },
  colorsContainer: { flexDirection: "row", justifyContent: "center", marginBottom: 14 },
  colorCircle: { width: 36, height: 36, borderRadius: 18, marginHorizontal: 6 },
  selectedColor: { borderWidth: 2, borderColor: "#000", transform: [{ scale: 1.05 }] },
  toggleButton: { paddingVertical: 10, borderRadius: 10, alignItems: "center" },
});
