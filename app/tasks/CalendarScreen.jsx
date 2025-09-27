import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Modal,
  Pressable,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../../contexts/ThemeContext";

const holidays = {
  "2025-01-01": "New Year's Day",
  "2025-04-09": "Araw ng Kagitingan",
  "2025-04-18": "Good Friday",
  "2025-04-20": "Easter Sunday",
  "2025-05-01": "Labor Day",
  "2025-06-12": "Independence Day",
  "2025-08-21": "Ninoy Aquino Day",
  "2025-08-25": "National Heroes Day",
  "2025-11-01": "All Saints' Day",
  "2025-11-02": "All Souls' Day",
  "2025-12-25": "Christmas Day",
  "2025-12-30": "Rizal Day",
};

// Mock tasks data - replace with your actual tasks
const mockTasks = [
  { id: 1, title: "Project Proposal", dueDate: "2025-09-15", completed: false },
  { id: 2, title: "Team Meeting", dueDate: "2025-09-15", completed: false },
  { id: 3, title: "Design Review", dueDate: "2025-09-20", completed: true },
  { id: 4, title: "Client Presentation", dueDate: "2025-09-25", completed: false },
  { id: 5, title: "Code Deployment", dueDate: "2025-09-10", completed: false },
];

export default function CalendarScreen() {
  const today = new Date();
  const navigation = useNavigation();
  const { theme } = useTheme();

  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState(null);
  const [viewMode, setViewMode] = useState("monthly"); // "monthly" or "weekly"
  const [modalVisible, setModalVisible] = useState(false);
  const [tasksForSelectedDate, setTasksForSelectedDate] = useState([]);

  const generateMonth = (month, year) => {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    let days = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let d = 1; d <= daysInMonth; d++) days.push(d);
    return days;
  };

  const generateWeek = (month, year, weekStart) => {
    let days = [];
    for (let i = 0; i < 7; i++) {
      const date = new Date(year, month, weekStart + i);
      days.push(date.getDate());
    }
    return days;
  };

  const getTasksForDate = (dateStr) => {
    return mockTasks.filter(task => task.dueDate === dateStr);
  };

  const handleDatePress = (year, month, day) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    setSelectedDate(dateStr);
    const tasks = getTasksForDate(dateStr);
    setTasksForSelectedDate(tasks);
    setModalVisible(true);
  };

  const changeMonth = (direction) => {
    let newMonth = currentMonth + direction;
    let newYear = currentYear;
    if (newMonth > 11) {
      newMonth = 0;
      newYear++;
    } else if (newMonth < 0) {
      newMonth = 11;
      newYear--;
    }
    setCurrentMonth(newMonth);
    setCurrentYear(newYear);
  };

  const changeWeek = (direction) => {
    // Simple week navigation - in a real app, you'd want more sophisticated logic
    changeMonth(direction);
  };

  const getTaskCountForDate = (dateStr) => {
    return mockTasks.filter(task => task.dueDate === dateStr).length;
  };

  const days = viewMode === "monthly" 
    ? generateMonth(currentMonth, currentYear)
    : generateWeek(currentMonth, currentYear, 1); // Simple week generation

  const monthName = new Date(currentYear, currentMonth).toLocaleString("default", { month: "long" });

  // Updated function name to reflect its purpose
  const navigateToAddEvent = () => navigation.navigate("AddEvent");

  const showDailySummary = () => {
    const tasksToday = getTasksForDate(today.toISOString().split('T')[0]);
    Alert.alert(
      "📋 Today's Tasks", 
      `You have ${tasksToday.length} task${tasksToday.length !== 1 ? 's' : ''} due today!`,
      [{ text: "OK" }]
    );
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 140 }}>
        {/* View Mode Toggle */}
        <View style={styles.viewModeContainer}>
          <TouchableOpacity 
            style={[
              styles.viewModeButton, 
              viewMode === "monthly" && [styles.activeViewMode, { backgroundColor: theme.colors.primary }]
            ]}
            onPress={() => setViewMode("monthly")}
          >
            <Text style={[
              styles.viewModeText,
              viewMode === "monthly" && styles.activeViewModeText
            ]}>
              Monthly
            </Text>
          </TouchableOpacity>
          <TouchableOpacity 
            style={[
              styles.viewModeButton, 
              viewMode === "weekly" && [styles.activeViewMode, { backgroundColor: theme.colors.primary }]
            ]}
            onPress={() => setViewMode("weekly")}
          >
            <Text style={[
              styles.viewModeText,
              viewMode === "weekly" && styles.activeViewModeText
            ]}>
              Weekly
            </Text>
          </TouchableOpacity>
        </View>

        {/* Navigation Header */}
        <View style={styles.monthHeader}>
          <TouchableOpacity onPress={() => viewMode === "monthly" ? changeMonth(-1) : changeWeek(-1)}>
            <Ionicons name="chevron-back" size={24} color={theme.colors.primary} />
          </TouchableOpacity>
          <Text style={[styles.monthTitle, { color: theme.colors.primary }]}>
            {monthName}, {currentYear} {viewMode === "weekly" && "(Week 1)"}
          </Text>
          <TouchableOpacity onPress={() => viewMode === "monthly" ? changeMonth(1) : changeWeek(1)}>
            <Ionicons name="chevron-forward" size={24} color={theme.colors.primary} />
          </TouchableOpacity>
        </View>

        {/* Week Days Header */}
        <View style={styles.weekRow}>
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, idx) => (
            <Text key={idx} style={[styles.weekDay, { color: theme.colors.text }]}>
              {day}
            </Text>
          ))}
        </View>

        {/* Calendar Grid */}
        <View style={styles.daysGrid}>
          {days.map((day, idx) => {
            if (!day) return <View key={idx} style={styles.dayBox} />;
            
            const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
            const taskCount = getTaskCountForDate(dateStr);
            const isHoliday = holidays[dateStr];
            const isToday = dateStr === today.toISOString().split('T')[0];

            return (
              <TouchableOpacity
                key={idx}
                style={[
                  styles.dayBox,
                  isToday && { backgroundColor: theme.colors.primary, borderRadius: 8 },
                ]}
                onPress={() => handleDatePress(currentYear, currentMonth, day)}
              >
                <Text
                  style={[
                    styles.dayText,
                    { color: theme.colors.text },
                    isToday && { color: "#fff", fontWeight: "700" },
                  ]}
                >
                  {day}
                </Text>
                {isHoliday && <View style={styles.holidayDot} />}
                {taskCount > 0 && (
                  <View style={[
                    styles.taskIndicator,
                    { backgroundColor: theme.colors.primary }
                  ]}>
                    <Text style={styles.taskIndicatorText}>{taskCount}</Text>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Daily Summary Section */}
        <View style={[styles.summarySection, { backgroundColor: theme.colors.background, borderColor: theme.colors.border }]}>
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>Daily Summary</Text>
          <TouchableOpacity 
            style={[styles.summaryButton, { backgroundColor: theme.colors.primary }]}
            onPress={showDailySummary}
          >
            <Ionicons name="calendar" size={20} color="#fff" />
            <Text style={styles.summaryButtonText}>View Today's Tasks</Text>
          </TouchableOpacity>
          <Text style={[styles.summaryText, { color: theme.colors.text }]}>
            Tap any date to see tasks due that day
          </Text>
        </View>
      </ScrollView>

      {/* Date Tasks Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { backgroundColor: theme.colors.background }]}>
            <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
              Tasks for {selectedDate}
            </Text>
            
            {tasksForSelectedDate.length === 0 ? (
              <Text style={[styles.noTasksText, { color: theme.colors.text }]}>
                No tasks due on this date
              </Text>
            ) : (
              tasksForSelectedDate.map(task => (
                <View key={task.id} style={styles.taskItem}>
                  <Ionicons 
                    name={task.completed ? "checkmark-circle" : "radio-button-off"} 
                    size={20} 
                    color={task.completed ? "#4CAF50" : theme.colors.primary} 
                  />
                  <Text style={[
                    styles.taskText,
                    { color: theme.colors.text },
                    task.completed && styles.completedTask
                  ]}>
                    {task.title}
                  </Text>
                </View>
              ))
            )}
            
            <Pressable
              style={[styles.closeButton, { backgroundColor: theme.colors.primary }]}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Add Event Button - Updated comment */}
      <TouchableOpacity
        style={[styles.addEventButton, { backgroundColor: theme.colors.primary }]}
        onPress={navigateToAddEvent}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  viewModeContainer: {
    flexDirection: "row",
    marginBottom: 20,
    backgroundColor: "#f0f0f0",
    borderRadius: 10,
    padding: 4,
  },
  viewModeButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: "center",
  },
  activeViewMode: {
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  viewModeText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#666",
  },
  activeViewModeText: {
    color: "#fff",
  },
  monthHeader: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    alignItems: "center", 
    marginBottom: 10 
  },
  monthTitle: { fontSize: 18, fontWeight: "700" },
  weekRow: { 
    flexDirection: "row", 
    justifyContent: "space-between", 
    marginBottom: 5 
  },
  weekDay: { 
    flex: 1, 
    textAlign: "center", 
    fontWeight: "600",
    fontSize: 12 
  },
  daysGrid: { 
    flexDirection: "row", 
    flexWrap: "wrap" 
  },
  dayBox: { 
    width: "14.2%", 
    aspectRatio: 1, 
    justifyContent: "center", 
    alignItems: "center",
    position: "relative",
  },
  dayText: { 
    fontSize: 14, 
    fontWeight: "500" 
  },
  holidayDot: { 
    position: "absolute",
    top: 4,
    right: 4,
    width: 4, 
    height: 4, 
    borderRadius: 2, 
    backgroundColor: "red" 
  },
  taskIndicator: {
    position: "absolute",
    bottom: 4,
    right: 4,
    width: 16,
    height: 16,
    borderRadius: 8,
    justifyContent: "center",
    alignItems: "center",
  },
  taskIndicatorText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "bold",
  },
  summarySection: {
    marginTop: 30,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 12,
  },
  summaryButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 10,
    borderRadius: 8,
    marginBottom: 8,
  },
  summaryButtonText: {
    color: "#fff",
    fontWeight: "600",
    marginLeft: 8,
  },
  summaryText: {
    fontSize: 12,
    textAlign: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "80%",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 16,
    textAlign: "center",
  },
  taskItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  taskText: {
    flex: 1,
    marginLeft: 12,
    fontSize: 14,
  },
  completedTask: {
    textDecorationLine: "line-through",
    color: "#888",
  },
  noTasksText: {
    textAlign: "center",
    fontStyle: "italic",
    marginVertical: 20,
  },
  closeButton: {
    marginTop: 16,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  closeButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
  addEventButton: {
    position: "absolute",
    bottom: 90,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 4,
    elevation: 5,
  },
});