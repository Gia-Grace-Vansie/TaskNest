// app/App.js
import React, { useEffect } from "react";
import { Platform, StatusBar } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons";
import ImmersiveMode from "react-native-immersive-mode";

// Import screens - CORRECTED PATHS
import Dashboard from "./dashboard"; // This should be your dashboard file
import CalendarScreen from "./tasks/CalendarScreen";
import ToDoScreen from "./tasks/ToDoScreen";
import ProfileScreen from "./tasks/ProfileScreen";
import Welcome from "./welcome";
import SignUp from "./auth/signup";
import AddEventScreen from "./tasks/AddEventScreen";

// Import contexts
import { UserProvider } from "../contexts/UserContext";
import { ThemeProvider } from "../contexts/ThemeContext";
import { TaskProvider } from "../contexts/TaskContext";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Calendar stack
function CalendarStack() {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="CalendarMain" component={CalendarScreen} />
      <Stack.Screen name="AddEvent" component={AddEventScreen} />
    </Stack.Navigator>
  );
}

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: "#fff",
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          height: 80,
          paddingBottom: 10,
          position: "absolute",
        },
        tabBarActiveTintColor: "#000",
        tabBarInactiveTintColor: "#666",
      }}
    >
      <Tab.Screen
        name="Home"
        component={Dashboard}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? "home" : "home-outline"}
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Calendar"
        component={CalendarStack}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? "calendar" : "calendar-outline"}
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="ToDo"
        component={ToDoScreen}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? "list" : "list-outline"}
              size={24}
              color={color}
            />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <Ionicons
              name={focused ? "person" : "person-outline"}
              size={24}
              color={color}
            />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
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

  return (
    <UserProvider>
      <ThemeProvider>
        <TaskProvider>
          <StatusBar hidden />
          <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
            <NavigationContainer>
              <Stack.Navigator
                initialRouteName="Welcome"
                screenOptions={{ headerShown: false }}
              >
                <Stack.Screen name="Welcome" component={Welcome} />
                <Stack.Screen name="SignUp" component={SignUp} />
                <Stack.Screen name="Main" component={MainTabs} />
              </Stack.Navigator>
            </NavigationContainer>
          </SafeAreaView>
        </TaskProvider>
      </ThemeProvider>
    </UserProvider>
  );
}