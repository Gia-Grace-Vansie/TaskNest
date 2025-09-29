// app/App.js
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons";

// Import screens (these are in the app folder)
import Dashboard from "./dashboard";
import CalendarScreen from "./tasks/CalendarScreen";
import ToDoScreen from "./tasks/ToDoScreen";
import ProfileScreen from "./tasks/ProfileScreen";
import Welcome from "./welcome";
import SignUp from "./auth/signup";
import AddEventScreen from "./tasks/AddEventScreen";

// Import contexts (these are outside the app folder)
import { UserProvider } from "../contexts/UserContext";
import { ThemeProvider } from "../contexts/ThemeContext";
import { TaskProvider } from "../contexts/TaskContext";

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// Create a stack navigator for the Calendar tab
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
  return (
    <UserProvider>
      <ThemeProvider>
        <TaskProvider>
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
        </TaskProvider>
      </ThemeProvider>
    </UserProvider>
  );
}