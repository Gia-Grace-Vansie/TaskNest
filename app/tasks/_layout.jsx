import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import BottomNav from "../components/BottomNav"; // Import BottomNav

export default function RootLayout() {
  return (
    <>
      <StatusBar style="auto" />
      <Stack>
        {/* App Screens */}
        <Stack.Screen
          name="./dashboard"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="CalendarScreen"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ToDoScreen"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="ProfileScreen"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AddTask"
          options={{ headerShown: false }}
        />
        <Stack.Screen
          name="AddProject"
          options={{ headerShown: false }}
        />

        {/* Goals */}
        <Stack.Screen
          name="goals"
          options={{ headerShown: false }}
        />

        {/* 404 Not Found */}
        <Stack.Screen
          name="+not-found"
          options={{ title: "Page Not Found" }}
        />
      </Stack>
      <BottomNav /> {/* Keep Bottom Navigation for app screens */}
    </>
  );
}
