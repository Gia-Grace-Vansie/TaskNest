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
import { useNavigation } from "@react-navigation/native";

export default function DashboardContent() {
  const { user } = useUser();
  const { theme } = useTheme();
  const navigation = useNavigation();
  const scrollRef = useRef(null);
  
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);

  // Mock tasks data - replace with your actual task data source
  useEffect(() => {
    // Simulate loading tasks
    const mockTasks = [
      { id: 1, title: "Complete project proposal", completed: true, dueDate: new Date() },
      { id: 2, title: "Team meeting", completed: false, dueDate: new Date() },
      { id: 3, title: "Design review", completed: true, dueDate: new Date() },
      { id: 4, title: "Client call", completed: false, dueDate: new Date() },
      { id: 5, title: "Code deployment", completed: false, dueDate: new Date() },
      { id: 6, title: "Documentation update", completed: true, dueDate: new Date() },
    ];
    
    setTimeout(() => {
      setTasks(mockTasks);
      setLoading(false);
    }, 500);
  }, []);

  // Calculate statistics
  const completedTasks = tasks.filter(task => task.completed).length;
  const pendingTasks = tasks.filter(task => !task.completed).length;
  
  // Calculate streak (mock implementation)
  const calculateStreak = () => {
    // This is a simple mock - replace with your actual streak logic
    const completedToday = tasks.filter(task => 
      task.completed && 
      task.dueDate.toDateString() === new Date().toDateString()
    ).length;
    
    return completedToday > 0 ? 3 : 0; // Mock streak of 3 if tasks completed today
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
        <Text style={[styles.loadingText, { color: theme.colors.text }]}>Loading your tasks...</Text>
      </View>
    );
  }

  return (
    <ScrollView
      ref={scrollRef}
      scrollEnabled
      showsVerticalScrollIndicator={false}
      contentContainerStyle={[styles.scrollContent, { backgroundColor: theme.colors.background }]}
    >
      {/* Header / Greeting */}
      <View style={styles.header}>
        <Text style={[styles.greeting, { color: theme.colors.text }]}>
          Welcome Back, {user.username} 👋
        </Text>
        <Text style={[styles.subGreeting, { color: theme.colors.text }]}>
          {pendingTasks > 0 
            ? `You have ${pendingTasks} task${pendingTasks !== 1 ? 's' : ''} to complete today!`
            : "All tasks completed! Great job! 🎉"
          }
        </Text>
      </View>

      {/* Quick Stats */}
      <View style={styles.statsSection}>
        <View style={[styles.statCard, { backgroundColor: theme.colors.background, borderColor: theme.colors.border, borderWidth: 1 }]}>
          <Ionicons name="checkmark-circle" size={26} color="#4CAF50" />
          <Text style={[styles.statNumber, { color: theme.colors.text }]}>{completedTasks}</Text>
          <Text style={[styles.statLabel, { color: theme.colors.text }]}>Completed</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: theme.colors.background, borderColor: theme.colors.border, borderWidth: 1 }]}>
          <Ionicons name="time" size={26} color="#FF9800" />
          <Text style={[styles.statNumber, { color: theme.colors.text }]}>{pendingTasks}</Text>
          <Text style={[styles.statLabel, { color: theme.colors.text }]}>Pending</Text>
        </View>
        <View style={[styles.statCard, { backgroundColor: theme.colors.background, borderColor: theme.colors.border, borderWidth: 1 }]}>
          <Ionicons name="flame" size={26} color={currentStreak > 0 ? "#F44336" : "#666"} />
          <Text style={[styles.statNumber, { color: theme.colors.text }]}>{currentStreak}</Text>
          <Text style={[styles.statLabel, { color: theme.colors.text }]}>Day Streak</Text>
        </View>
      </View>

      {/* Today's Tasks Preview */}
      <View style={[styles.tasksSection, { backgroundColor: theme.colors.background, borderColor: theme.colors.border, borderWidth: 1 }]}>
        <View style={styles.tasksHeader}>
          <Text style={[styles.tasksTitle, { color: theme.colors.text }]}>Today's Tasks</Text>
          <Text style={[styles.tasksCount, { color: theme.colors.primary }]}>
            {pendingTasks} pending
          </Text>
        </View>
        
        {tasks.slice(0, 3).map((task) => (
          <View key={task.id} style={styles.taskItem}>
            <View style={[
              styles.taskIndicator,
              { backgroundColor: task.completed ? "#4CAF50" : "#FF9800" }
            ]} />
            <Text style={[
              styles.taskText,
              { color: theme.colors.text },
              task.completed && styles.completedTask
            ]}>
              {task.title}
            </Text>
            <Ionicons 
              name={task.completed ? "checkmark-circle" : "time"} 
              size={20} 
              color={task.completed ? "#4CAF50" : "#FF9800"} 
            />
          </View>
        ))}
        
        {tasks.length === 0 && (
          <Text style={[styles.noTasksText, { color: theme.colors.text }]}>
            No tasks for today. Add some tasks to get started!
          </Text>
        )}
        
        {/* Add Task Button REMOVED */}
      </View>

      {/* Projects Section */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Projects</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.projectsContainer}
        >
          <Pressable
            style={[styles.projectCard, { backgroundColor: theme.colors.primary }]}
            onPress={() => navigation.navigate("tasks/AddProject")}
          >
            <Ionicons name="add-circle-outline" size={32} color="#fff" />
            <Text style={styles.projectText}>Add Project</Text>
          </Pressable>

          <View style={[styles.projectCard, { backgroundColor: theme.colors.primary }]}>
            <Ionicons name="briefcase-outline" size={32} color="#fff" />
            <Text style={styles.projectText}>Work</Text>
          </View>

          <View style={[styles.projectCard, { backgroundColor: theme.colors.primary }]}>
            <Ionicons name="home-outline" size={32} color="#fff" />
            <Text style={styles.projectText}>Personal</Text>
          </View>
        </ScrollView>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  scrollContent: { padding: 20, paddingBottom: 100 },
  loader: { 
    flex: 1, 
    justifyContent: "center", 
    alignItems: "center" 
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
  },
  header: { marginBottom: 25, marginTop: 10 },
  greeting: { fontSize: 26, fontWeight: "700", marginBottom: 6 },
  subGreeting: { fontSize: 16 },
  statsSection: { flexDirection: "row", justifyContent: "space-between", marginBottom: 22 },
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
    marginBottom: 28,
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
  // REMOVED: addTaskButton and addTaskText styles
  section: { marginBottom: 28 },
  sectionTitle: { fontSize: 20, fontWeight: "700", marginBottom: 16 },
  projectsContainer: { paddingRight: 20 },
  projectCard: {
    width: 140,
    height: 120,
    borderRadius: 18,
    marginRight: 15,
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
  },
  projectText: { color: "#fff", fontWeight: "600", textAlign: "center", marginTop: 8, fontSize: 14 },
});