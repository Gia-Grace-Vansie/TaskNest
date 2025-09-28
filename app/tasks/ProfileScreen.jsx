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
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 100 }}> {/* Increased paddingBottom */}
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
          
          <Text style={[styles.infoLabel, { color: theme.colors.text, marginBottom: 15 }]}>
            Choose accent color:
          </Text>
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
            style={[styles.toggleButton, { backgroundColor: theme.colors.card, borderColor: theme.colors.primary }]}
            onPress={toggleTheme}
          >
            <Text style={[styles.toggleButtonText, { color: theme.colors.text }]}>
              Switch to {theme.isDark ? "Light" : "Dark"} Mode
            </Text>
          </TouchableOpacity>
        </View>

        {/* Logout Button - Moved up with more spacing */}
        <View style={styles.logoutSection}>
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
  profileHeader: { 
    alignItems: "center", 
    marginBottom: 24,
    paddingVertical: 20,
  },
  avatar: { 
    width: 100, 
    height: 100, 
    borderRadius: 50, 
    backgroundColor: "#fff", 
    marginBottom: 12,
  },
  userName: { 
    fontSize: 24, 
    fontWeight: "700",
    marginBottom: 4,
  },
  userEmail: { 
    fontSize: 16, 
    opacity: 0.7,
  },
  infoSection: { 
    marginTop: 24,
    padding: 16,
    borderRadius: 12,
    backgroundColor: 'rgba(0,0,0,0.03)',
  },
  logoutSection: {
    marginTop: 24,
    marginBottom: 40, // Added extra margin at the bottom
  },
  sectionTitle: { 
    fontSize: 18, 
    fontWeight: "700", 
    marginBottom: 16,
  },
  infoRow: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    marginBottom: 12,
    paddingVertical: 4,
  },
  infoLabel: { 
    fontSize: 14,
    fontWeight: '500',
  },
  infoValue: { 
    fontSize: 14, 
    fontWeight: "500",
    opacity: 0.8,
  },
  logoutButton: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  logoutText: { 
    fontSize: 16, 
    fontWeight: "600" 
  },
  colorsContainer: { 
    flexDirection: "row", 
    justifyContent: "center", 
    marginBottom: 20,
    flexWrap: 'wrap',
  },
  colorCircle: { 
    width: 40, 
    height: 40, 
    borderRadius: 20, 
    marginHorizontal: 6,
    marginVertical: 4,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 2,
  },
  selectedColor: { 
    borderWidth: 3, 
    borderColor: "#fff",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    elevation: 3,
    transform: [{ scale: 1.1 }] 
  },
  toggleButton: {
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: "center",
    borderWidth: 2,
  },
  toggleButtonText: {
    fontWeight: "600", 
    fontSize: 14,
  },
});