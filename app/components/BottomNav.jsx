import React from "react";
import { View, Pressable, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter, usePathname } from "expo-router";
import { useTheme } from "../../contexts/ThemeContext"; // <-- import theme

export default function BottomNav() {
  const router = useRouter();
  const pathname = usePathname();
  const { theme } = useTheme(); // <-- get theme

  const navItems = [
    { name: "dashboard", label: "Home", icon: "home-outline" },
    { name: "tasks/CalendarScreen", label: "Calendar", icon: "calendar-outline" },
    { name: "tasks/ToDoScreen", label: "Tasks", icon: "checkmark-done-outline" },
    { name: "tasks/ProfileScreen", label: "Profile", icon: "person-outline" },
  ];

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {navItems.map((item) => {
        const isActive = pathname.includes(item.name);
        return (
          <Pressable
            key={item.name}
            style={styles.navItem}
            onPress={() => router.push(`/${item.name}`)}
          >
            <Ionicons
              name={item.icon}
              size={24}
              color={isActive ? theme.colors.primary : theme.colors.text}
            />
            <Text style={[styles.label, { color: isActive ? theme.colors.primary : theme.colors.text }]}>
              {item.label}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingVertical: 10,
    borderTopWidth: 1,
    borderTopColor: "#ccc",
    position: "absolute",
    bottom: 0,
    width: "100%",
  },
  navItem: { alignItems: "center" },
  label: { fontSize: 12, marginTop: 2 },
});
