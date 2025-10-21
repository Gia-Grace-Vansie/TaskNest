import React, { useRef, useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useUser } from "../contexts/UserContext";
import { useTheme } from "../contexts/ThemeContext";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function DashboardContent() {
  const { user } = useUser();
  const { theme } = useTheme();
  const scrollRef = useRef(null);

  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadTasks = async () => {
      try {
        const storedTasks = await AsyncStorage.getItem("@todo_tasks");
        if (storedTasks !== null) {
          setTasks(JSON.parse(storedTasks));
        } else {
          setTasks([]);
        }
      } catch (error) {
        setTasks([]);
      }
      setLoading(false);
    };
    loadTasks();
  }, []);

  const completedTasks = tasks.filter((task) => task.completed).length;
  const pendingTasks = tasks.filter((task) => !task.completed).length;

  const calculateStreak = () => {
    const today = new Date().toISOString().slice(0, 10);
    const completedToday = tasks.filter(
      (task) => task.completed && task.dueDate === today
    ).length;
    return completedToday > 0 ? 3 : 0;
  };

  const currentStreak = calculateStreak();

  if (!user) {
    return (
      <View style={[styles.loader, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  if (loading) {
    return (
      <View style={[styles.loader, { backgroundColor: theme.colors.background }]}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
        <Text style={[styles.loadingText, { color: theme.colors.text }]}>
          Loading your tasks...
        </Text>
      </View>
    );
  }

  const todayStr = new Date().toISOString().slice(0, 10);
  const todaysTasks = tasks.filter((task) => task.dueDate === todayStr);

  return (
    <ScrollView
      ref={scrollRef}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[
        styles.scrollContent,
        { flexGrow: 1, backgroundColor: theme.colors.background },
      ]}
    >
      {/* Header */}
      <View style={styles.header}>
        <Text style={[styles.greeting, { color: theme.colors.text }]}>
          Welcome Back, {user.username} 👋
        </Text>
        <Text style={[styles.subGreeting, { color: theme.colors.text }]}>
          {pendingTasks > 0
            ? `You have ${pendingTasks} task${
                pendingTasks !== 1 ? "s" : ""
              } to complete today!`
            : "All tasks completed! Great job! 🎉"}
        </Text>
      </View>

      {/* Quick Stats */}
      <View style={styles.statsSection}>
        <View
          style={[
            styles.statCard,
            {
              backgroundColor: theme.colors.background,
              borderColor: theme.colors.border,
              borderWidth: 1,
            },
          ]}
        >
          <Ionicons name="checkmark-circle" size={26} color="#4CAF50" />
          <Text style={[styles.statNumber, { color: theme.colors.text }]}>
            {completedTasks}
          </Text>
          <Text style={[styles.statLabel, { color: theme.colors.text }]}>
            Completed
          </Text>
        </View>
        <View
          style={[
            styles.statCard,
            {
              backgroundColor: theme.colors.background,
              borderColor: theme.colors.border,
              borderWidth: 1,
            },
          ]}
        >
          <Ionicons name="time" size={26} color="#FF9800" />
          <Text style={[styles.statNumber, { color: theme.colors.text }]}>
            {pendingTasks}
          </Text>
          <Text style={[styles.statLabel, { color: theme.colors.text }]}>
            Pending
          </Text>
        </View>
        <View
          style={[
            styles.statCard,
            {
              backgroundColor: theme.colors.background,
              borderColor: theme.colors.border,
              borderWidth: 1,
            },
          ]}
        >
          <Ionicons
            name="flame"
            size={26}
            color={currentStreak > 0 ? "#F44336" : "#666"}
          />
          <Text style={[styles.statNumber, { color: theme.colors.text }]}>
            {currentStreak}
          </Text>
          <Text style={[styles.statLabel, { color: theme.colors.text }]}>
            Day Streak
          </Text>
        </View>
      </View>

      {/* Today's Tasks */}
      <View
        style={[
          styles.tasksSection,
          {
            backgroundColor: theme.colors.background,
            borderColor: theme.colors.border,
            borderWidth: 1,
          },
        ]}
      >
        <View style={styles.tasksHeader}>
          <Text style={[styles.tasksTitle, { color: theme.colors.text }]}>
            Today's Tasks
          </Text>
          <Text style={[styles.tasksCount, { color: theme.colors.primary }]}>
            {todaysTasks.filter((task) => !task.completed).length} pending
          </Text>
        </View>

        {todaysTasks.length > 0 ? (
          todaysTasks.slice(0, 3).map((task) => (
            <View key={task.id} style={styles.taskItem}>
              <View
                style={[
                  styles.taskIndicator,
                  { backgroundColor: task.completed ? "#4CAF50" : "#FF9800" },
                ]}
              />
              <Text
                style={[
                  styles.taskText,
                  { color: theme.colors.text },
                  task.completed && styles.completedTask,
                ]}
              >
                {task.title}
              </Text>
              <Ionicons
                name={task.completed ? "checkmark-circle" : "time"}
                size={20}
                color={task.completed ? "#4CAF50" : "#FF9800"}
              />
            </View>
          ))
        ) : (
          <Text style={[styles.noTasksText, { color: theme.colors.text }]}>
            No tasks for today. Add some tasks to get started!
          </Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: { padding: 20, paddingBottom: 40 },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  header: { marginBottom: 25, marginTop: 10 },
  greeting: { fontSize: 26, fontWeight: "700", marginBottom: 6 },
  subGreeting: { fontSize: 16 },
  statsSection: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 22,
  },
  statCard: {
    flex: 1,
    borderRadius: 14,
    padding: 16,
    alignItems: "center",
    marginHorizontal: 5,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 6,
    elevation: 2,
  },
  statNumber: { fontSize: 22, fontWeight: "700", marginVertical: 4 },
  statLabel: { fontSize: 13, fontWeight: "500" },
  tasksSection: {
    borderRadius: 18,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 10,
    elevation: 3,
  },
  tasksHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  tasksTitle: { fontSize: 18, fontWeight: "700" },
  tasksCount: { fontSize: 14, fontWeight: "600" },
  taskItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  taskIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 12,
  },
  taskText: {
    flex: 1,
    fontSize: 14,
  },
  completedTask: {
    textDecorationLine: "line-through",
    color: "#888",
  },
  noTasksText: {
    textAlign: "center",
    fontSize: 14,
    marginVertical: 20,
    fontStyle: "italic",
  },
});
