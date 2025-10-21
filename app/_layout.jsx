// app/_layout.jsx
import { Stack, usePathname } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { UserProvider } from "../contexts/UserContext";
import { ThemeProvider } from "../contexts/ThemeContext";
import { TaskProvider } from "../contexts/TaskContext";
import BottomNav from "./components/BottomNav";
import { useEffect } from "react";
import { Platform } from "react-native";
import ImmersiveMode from "react-native-immersive-mode";

export default function RootLayout() {
  const pathname = usePathname();

  useEffect(() => {
    if (Platform.OS === "android") {
      try {
        ImmersiveMode.fullLayout(true);
        ImmersiveMode.setBarMode("Full");
      } catch (e) {
        console.warn("ImmersiveMode not available in Expo Go");
      }
    }
  }, []);

  const hideNav = [
    "/",
    "/auth/signin", 
    "/auth/signup",
    "/logoutScreen",
  ];

  return (
    <ThemeProvider>
      <SafeAreaProvider>
        <UserProvider>
          <TaskProvider>
            <Stack screenOptions={{ headerShown: false }}>
              <Stack.Screen name="index" />
              <Stack.Screen name="welcome" />
              <Stack.Screen name="auth/signup" />
              <Stack.Screen name="dashboard" />
              <Stack.Screen name="tasks/CalendarScreen" />
              <Stack.Screen name="tasks/ToDoScreen" />
              <Stack.Screen name="tasks/ProfileScreen" />
              <Stack.Screen name="tasks/AddEventScreen" />
            </Stack>
            {!hideNav.includes(pathname) && <BottomNav />}
          </TaskProvider>
        </UserProvider>
      </SafeAreaProvider>
    </ThemeProvider>
  );
}