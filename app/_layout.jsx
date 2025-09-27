// app/_layout.jsx
import { Slot, usePathname } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { UserProvider } from "../contexts/UserContext";
import { ThemeProvider } from "../contexts/ThemeContext";
import { TaskProvider } from "../contexts/TaskContext"; // Import TaskProvider
import BottomNav from "./components/BottomNav";

export default function RootLayout() {
  const pathname = usePathname();

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
          <TaskProvider> {/* Add TaskProvider here */}
            <Slot />
            {!hideNav.includes(pathname) && <BottomNav />}
          </TaskProvider>
        </UserProvider>
      </SafeAreaProvider>
    </ThemeProvider>
  );
}