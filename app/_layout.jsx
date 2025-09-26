import { Slot, usePathname } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { UserProvider } from "../contexts/UserContext";
import BottomNav from "./components/BottomNav";

export default function RootLayout() {
  const pathname = usePathname();
  // List of routes where BottomNav should be hidden
  const hideNav = [
    "/",           // index
    "/auth/signin", // login
    "/auth/signup" // signup
  ];

  return (
    <SafeAreaProvider>
      <UserProvider>
        <Slot />
        {!hideNav.includes(pathname) && <BottomNav />}
      </UserProvider>
    </SafeAreaProvider>
  );
}