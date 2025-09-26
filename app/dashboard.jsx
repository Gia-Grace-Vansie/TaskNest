import React, { useRef, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  Pressable,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useUser } from "../contexts/UserContext";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

export default function DashboardContent() {
  const { user } = useUser();
  const navigation = useNavigation();
  const scrollRef = useRef(null);

  // Disable mouse wheel scrolling on web
  useEffect(() => {
    const el = scrollRef.current;
    if (el && typeof window !== "undefined") {
      const handleWheel = (e) => e.preventDefault();
      el.addEventListener("wheel", handleWheel, { passive: false });
      return () => el.removeEventListener("wheel", handleWheel);
    }
  }, []);

  if (!user) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  return (
    <ScrollView
      ref={scrollRef}
      scrollEnabled={true}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      {/* Header / Greeting */}
      <View style={styles.header}>
        <Text style={styles.greeting}>Welcome Back, {user.username} 👋</Text>
        <Text style={styles.subGreeting}>
          Ready to stay on top of your tasks?
        </Text>
      </View>

      {/* Quick Stats */}
      <View style={styles.statsSection}>
        <View style={styles.statCard}>
          <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
          <Text style={styles.statNumber}>12</Text>
          <Text style={styles.statLabel}>Completed</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="time" size={24} color="#FF9800" />
          <Text style={styles.statNumber}>5</Text>
          <Text style={styles.statLabel}>Pending</Text>
        </View>
        <View style={styles.statCard}>
          <Ionicons name="flame" size={24} color="#F44336" />
          <Text style={styles.statNumber}>3</Text>
          <Text style={styles.statLabel}>Streak</Text>
        </View>
      </View>

      {/* Today's Tasks */}
      <View style={styles.tasksSection}>
        <Text style={styles.tasksTitle}>Today's Tasks</Text>

        <View style={styles.taskItem}>
          <View style={styles.taskIndicator}></View>
          <View style={styles.taskContent}>
            <Text style={styles.taskText}>Low-fi Wireframe Done</Text>
            <Text style={styles.taskTime}>9:00 AM</Text>
          </View>
        </View>

        <View style={styles.taskItem}>
          <View style={[styles.taskIndicator, styles.taskIndicatorCompleted]}></View>
          <View style={styles.taskContent}>
            <Text style={[styles.taskText, styles.taskCompleted]}>
              Hi-fi Wireframe Done
            </Text>
            <Text style={styles.taskTime}>11:00 AM</Text>
          </View>
        </View>

        <View style={styles.taskItem}>
          <View style={styles.taskIndicator}></View>
          <View style={styles.taskContent}>
            <Text style={styles.taskText}>Team Meeting</Text>
            <Text style={styles.taskTime}>2:00 PM</Text>
          </View>
        </View>

        {/* Add Task Button */}
        <Pressable
          style={styles.addTaskButton}
          onPress={() => navigation.navigate("tasks/AddTask")}
        >
          <Ionicons name="add-circle-outline" size={28} color="#fff" />
          <Text style={styles.addTaskText}>Add Task</Text>
        </Pressable>
      </View>

      {/* Projects Section */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Projects</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.projectsContainer}
        >
          <Pressable
            style={styles.projectCard}
            onPress={() => navigation.navigate("tasks/AddProject")}
          >
            <Ionicons name="add-circle-outline" size={32} color="#fff" />
            <Text style={styles.projectText}>Add Project</Text>
          </Pressable>

          <View style={[styles.projectCard, styles.sampleProject]}>
            <Ionicons name="briefcase-outline" size={32} color="#fff" />
            <Text style={styles.projectText}>Work</Text>
          </View>

          <View style={[styles.projectCard, styles.sampleProject]}>
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
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
  header: { marginBottom: 30, marginTop: 10 },
  greeting: { fontSize: 28, fontWeight: "bold", color: "#000", marginBottom: 5 },
  subGreeting: { fontSize: 16, color: "#666" },
  statsSection: { flexDirection: "row", justifyContent: "space-between", marginBottom: 20 },
  statCard: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    alignItems: "center",
    marginHorizontal: 5,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  statNumber: { fontSize: 24, fontWeight: "bold", color: "#000", marginVertical: 5 },
  statLabel: { fontSize: 12, color: "#666", fontWeight: "500" },
  tasksSection: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 20,
    marginBottom: 30,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    elevation: 3,
  },
  tasksTitle: { fontSize: 18, fontWeight: "bold", color: "#000", marginBottom: 15 },
  taskItem: { flexDirection: "row", alignItems: "center", paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: "#f0f0f0" },
  taskIndicator: { width: 8, height: 8, borderRadius: 4, backgroundColor: "#007AFF", marginRight: 12 },
  taskIndicatorCompleted: { backgroundColor: "#4CAF50" },
  taskContent: { flex: 1 },
  taskText: { fontSize: 16, color: "#000", fontWeight: "500", marginBottom: 2 },
  taskCompleted: { color: "#666", textDecorationLine: "line-through" },
  taskTime: { fontSize: 14, color: "#666" },
  addTaskButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#007AFF",
    borderRadius: 12,
    paddingVertical: 12,
    marginTop: 20,
  },
  addTaskText: { color: "#fff", fontWeight: "bold", fontSize: 16, marginLeft: 8 },
  section: { marginBottom: 30 },
  sectionTitle: { fontSize: 20, fontWeight: "bold", color: "#000", marginBottom: 15 },
  projectsContainer: { paddingRight: 20 },
  projectCard: {
    width: 140,
    height: 120,
    backgroundColor: "#000",
    borderRadius: 16,
    marginRight: 15,
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
  },
  sampleProject: { backgroundColor: "#333" },
  projectText: { color: "white", fontWeight: "bold", textAlign: "center", marginTop: 8, fontSize: 14 },
});
