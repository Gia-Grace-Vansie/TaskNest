// App.js
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { Ionicons } from "@expo/vector-icons";

import Dashboard from "./dashboard.jsx";
import CalendarScreen from "./tasks/CalendarScreen.jsx";
import AddTask from "./tasks/AddTask.jsx";
import ToDoScreen from "./tasks/ToDoScreen.jsx";
import ProfileScreen from "./tasks/ProfileScreen.jsx";
import Welcome from "./welcome.jsx";
import SignUp from "./auth/signup.jsx";

import { ThemeProvider } from "../contexts/ThemeContext";
import { TaskProvider } from "../contexts/TaskContext";   // ✅ add this

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

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
            <Ionicons name={focused ? "home" : "home-outline"} size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Calendar"
        component={CalendarScreen}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <Ionicons name={focused ? "calendar" : "calendar-outline"} size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Add"
        component={AddTask}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <Ionicons name={focused ? "add-circle" : "add-circle-outline"} size={32} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="ToDo"
        component={ToDoScreen}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <Ionicons name={focused ? "list" : "list-outline"} size={24} color={color} />
          ),
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused, color }) => (
            <Ionicons name={focused ? "person" : "person-outline"} size={24} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <TaskProvider>   {/* ✅ Wrap all screens with TaskProvider */}
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Welcome" screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Welcome" component={Welcome} />
            <Stack.Screen name="SignUp" component={SignUp} />
            <Stack.Screen name="Main" component={MainTabs} />
          </Stack.Navigator>
        </NavigationContainer>
      </TaskProvider>
    </ThemeProvider>
  );
}
