import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
  TextInput,
  Alert,
  Modal,
  Pressable,
  StatusBar,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useTheme } from "../../contexts/ThemeContext";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTaskActions } from "../../hooks/useTaskActions";

export default function TodoScreen() {
  const { theme } = useTheme();
  const [newTask, setNewTask] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [filterModalVisible, setFilterModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [filters, setFilters] = useState({
    subject: "all",
    priority: "all",
    status: "all",
  });
  const [selectedTasks, setSelectedTasks] = useState([]);

  // Use the custom hook ONCE and get everything from it
  const {
    tasks,
    setTasks,
    deleteTask,
    deleteSelectedTasks,
    clearAllTasks,
    toggleTask,
    addTask,
    updateTask,
  } = useTaskActions(selectedTasks, setSelectedTasks);

  useEffect(() => {
    loadTasks();
  }, []);

  useEffect(() => {
    saveTasks();
  }, [tasks]);

  const loadTasks = async () => {
    try {
      const storedTasks = await AsyncStorage.getItem('@todo_tasks');
      if (storedTasks !== null) {
        setTasks(JSON.parse(storedTasks));
      } else {
        const initialTasks = [
          { id: "1", title: "Complete project proposal", subject: "Work", dueDate: "2025-01-15", dueTime: "17:00", priority: "high", completed: false },
          { id: "2", title: "Buy groceries", subject: "Personal", dueDate: "2025-01-10", dueTime: "12:00", priority: "medium", completed: false },
          { id: "3", title: "Team meeting preparation", subject: "Work", dueDate: "2025-01-12", dueTime: "09:30", priority: "high", completed: true },
          { id: "4", title: "Gym workout", subject: "Health", dueDate: "2025-01-09", dueTime: "18:00", priority: "low", completed: false },
          { id: "5", title: "Read research paper", subject: "Study", dueDate: "2025-01-20", dueTime: "23:59", priority: "medium", completed: false },
        ];
        setTasks(initialTasks);
        await AsyncStorage.setItem('@todo_tasks', JSON.stringify(initialTasks));
      }
    } catch (error) {
      console.error('Error loading tasks:', error);
    }
  };

  const saveTasks = async () => {
    try {
      await AsyncStorage.setItem('@todo_tasks', JSON.stringify(tasks));
    } catch (error) {
      console.error('Error saving tasks:', error);
    }
  };

  // Format date input with automatic dashes
  const formatDateInput = (text) => {
    // Remove all non-digit characters
    const numbers = text.replace(/\D/g, '');
    
    // Format as YYYY-MM-DD
    if (numbers.length <= 4) {
      return numbers;
    } else if (numbers.length <= 6) {
      return numbers.slice(0, 4) + '-' + numbers.slice(4);
    } else {
      return numbers.slice(0, 4) + '-' + numbers.slice(4, 6) + '-' + numbers.slice(6, 8);
    }
  };

  // Format time input with automatic colon
  const formatTimeInput = (text) => {
    // Remove all non-digit characters
    const numbers = text.replace(/\D/g, '');
    
    // Format as HH:MM
    if (numbers.length <= 2) {
      return numbers;
    } else {
      return numbers.slice(0, 2) + ':' + numbers.slice(2, 4);
    }
  };

  const handleDateChange = (text) => {
    const formattedDate = formatDateInput(text);
    setEditingTask({ ...editingTask, dueDate: formattedDate });
  };

  const handleTimeChange = (text) => {
    const formattedTime = formatTimeInput(text);
    setEditingTask({ ...editingTask, dueTime: formattedTime });
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesSubject = filters.subject === "all" || task.subject === filters.subject;
    const matchesPriority = filters.priority === "all" || task.priority === filters.priority;
    const matchesStatus = filters.status === "all" ||
      (filters.status === "completed" && task.completed) ||
      (filters.status === "pending" && !task.completed);

    return matchesSearch && matchesSubject && matchesPriority && matchesStatus;
  });

  const handleAddTask = () => {
    if (!newTask.trim()) return;
    // Add default date and time for new tasks
    const today = new Date();
    const defaultDate = today.toISOString().split('T')[0];
    const defaultTime = "23:59";
    
    addTask(newTask, defaultDate, defaultTime);
    setNewTask("");
  };

  const toggleSelectTask = (id) => {
    setSelectedTasks(prev =>
      prev.includes(id)
        ? prev.filter(taskId => taskId !== id)
        : [...prev, id]
    );
  };

  const editTask = (task) => {
    // Ensure dueTime exists when editing
    const taskWithTime = {
      ...task,
      dueTime: task.dueTime || "23:59" // Default time if not set
    };
    setEditingTask({ ...taskWithTime });
    setEditModalVisible(true);
  };

  const handleUpdateTask = () => {
    if (updateTask(editingTask)) {
      setEditModalVisible(false);
      setEditingTask(null);
    }
  };

  const applyFilters = (newFilters) => {
    setFilters(newFilters);
    setFilterModalVisible(false);
  };

  const clearFilters = () => {
    setFilters({ subject: "all", priority: "all", status: "all" });
    setSearchQuery("");
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case "high": return "#FF3B30";
      case "medium": return "#FF9500";
      case "low": return "#4CAF50";
      default: return "#666";
    }
  };

  const getSubjectColor = (subject) => {
    switch (subject) {
      case "Work": return "#007AFF";
      case "Personal": return "#FF2D55";
      case "Health": return "#34C759";
      case "Study": return "#AF52DE";
      default: return "#666";
    }
  };

  // Mark task as complete/incomplete
  const markAsComplete = (taskId) => {
    const updatedTasks = tasks.map(task =>
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
  };

  // Mark selected tasks as complete
  const markSelectedAsComplete = () => {
    if (selectedTasks.length === 0) return;
    
    const updatedTasks = tasks.map(task =>
      selectedTasks.includes(task.id) ? { ...task, completed: true } : task
    );
    setTasks(updatedTasks);
    setSelectedTasks([]); // Clear selection after marking complete
  };

  // Mark selected tasks as incomplete
  const markSelectedAsIncomplete = () => {
    if (selectedTasks.length === 0) return;
    
    const updatedTasks = tasks.map(task =>
      selectedTasks.includes(task.id) ? { ...task, completed: false } : task
    );
    setTasks(updatedTasks);
    setSelectedTasks([]); // Clear selection after marking incomplete
  };

  return (
    <SafeAreaView
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
      }}
    >
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>To-Do List</Text>
        <View style={styles.headerActions}>
          {selectedTasks.length > 0 && (
            <>
              <TouchableOpacity onPress={markSelectedAsComplete} style={styles.completeSelectedButton}>
                <Text style={{ color: "#34C759", fontSize: 12, fontWeight: "500" }}>Mark Complete ({selectedTasks.length})</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={markSelectedAsIncomplete} style={styles.incompleteSelectedButton}>
                <Text style={{ color: "#FF9500", fontSize: 12, fontWeight: "500" }}>Mark Incomplete ({selectedTasks.length})</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={deleteSelectedTasks} style={styles.deleteSelectedButton}>
                <Text style={{ color: "#FF3B30", fontSize: 12, fontWeight: "500" }}>Delete ({selectedTasks.length})</Text>
              </TouchableOpacity>
            </>
          )}
          {tasks.length > 0 && selectedTasks.length === 0 && (
            <TouchableOpacity onPress={clearAllTasks} style={styles.clearAllTasks}>
              <Text style={{ color: "#FF3B30", fontSize: 12, fontWeight: "500" }}>Clear All</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <View style={[styles.searchBar, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}>
          <Ionicons name="search" size={18} color="#888" />
          <TextInput
            style={[styles.searchInput, { color: theme.colors.text }]}
            placeholder="Search tasks..."
            placeholderTextColor="#888"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
          {searchQuery.length > 0 && (
            <TouchableOpacity onPress={() => setSearchQuery("")}>
              <Ionicons name="close-circle" size={18} color="#888" />
            </TouchableOpacity>
          )}
        </View>
        <TouchableOpacity
          style={[styles.filterButton, { backgroundColor: theme.colors.primary }]}
          onPress={() => setFilterModalVisible(true)}
        >
          <Ionicons name="filter" size={18} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Filter Tags */}
      {(filters.subject !== "all" || filters.priority !== "all" || filters.status !== "all" || searchQuery) && (
        <View style={styles.filterTagsContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {searchQuery && (
              <View style={[styles.filterTag, { backgroundColor: theme.colors.primary }]}>
                <Text style={styles.filterTagText}>Search: "{searchQuery}"</Text>
                <TouchableOpacity onPress={() => setSearchQuery("")}>
                  <Ionicons name="close" size={14} color="#fff" />
                </TouchableOpacity>
              </View>
            )}
            {filters.subject !== "all" && (
              <View style={[styles.filterTag, { backgroundColor: getSubjectColor(filters.subject) }]}>
                <Text style={styles.filterTagText}>Subject: {filters.subject}</Text>
                <TouchableOpacity onPress={() => setFilters({ ...filters, subject: "all" })}>
                  <Ionicons name="close" size={14} color="#fff" />
                </TouchableOpacity>
              </View>
            )}
            {filters.priority !== "all" && (
              <View style={[styles.filterTag, { backgroundColor: getPriorityColor(filters.priority) }]}>
                <Text style={styles.filterTagText}>Priority: {filters.priority}</Text>
                <TouchableOpacity onPress={() => setFilters({ ...filters, priority: "all" })}>
                  <Ionicons name="close" size={14} color="#fff" />
                </TouchableOpacity>
              </View>
            )}
            {filters.status !== "all" && (
              <View style={[styles.filterTag, { backgroundColor: "#666" }]}>
                <Text style={styles.filterTagText}>Status: {filters.status}</Text>
                <TouchableOpacity onPress={() => setFilters({ ...filters, status: "all" })}>
                  <Ionicons name="close" size={14} color="#fff" />
                </TouchableOpacity>
              </View>
            )}
            <TouchableOpacity style={styles.clearAllButton} onPress={clearFilters}>
              <Text style={[styles.clearAllText, { color: theme.colors.primary }]}>Clear All</Text>
            </TouchableOpacity>
          </ScrollView>
        </View>
      )}

      {/* Add Task Input */}
      <View style={styles.inputContainer}>
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: theme.colors.card,
              color: theme.colors.text,
              borderColor: theme.colors.border,
            },
          ]}
          placeholder="Add a new task..."
          placeholderTextColor="#888"
          value={newTask}
          onChangeText={setNewTask}
          onSubmitEditing={handleAddTask}
        />
        <TouchableOpacity
          style={[styles.addButton, { backgroundColor: theme.colors.primary }]}
          onPress={handleAddTask}
        >
          <Ionicons name="add" size={20} color="#fff" />
        </TouchableOpacity>
      </View>

      {/* Tasks List */}
      <ScrollView contentContainerStyle={{ padding: 14, paddingBottom: 80 }}>
        {filteredTasks.length === 0 ? (
          <View style={styles.emptyState}>
            <Ionicons name="search-outline" size={48} color="#888" />
            <Text style={[styles.emptyStateText, { color: theme.colors.text }]}>
              {searchQuery || filters.subject !== "all" || filters.priority !== "all" || filters.status !== "all"
                ? "No tasks match your filters"
                : "No tasks yet. Add one above!"}
            </Text>
          </View>
        ) : (
          filteredTasks.map((task) => (
            <Pressable
              key={task.id}
              style={[
                styles.taskRow,
                {
                  backgroundColor: theme.colors.card,
                  borderColor: theme.colors.border,
                  borderWidth: selectedTasks.includes(task.id) ? 2 : 0,
                  borderColor: selectedTasks.includes(task.id) ? theme.colors.primary : theme.colors.border,
                },
              ]}
              onLongPress={() => deleteTask(task.id)}
            >
              <TouchableOpacity
                style={[
                  styles.checkbox,
                  task.completed && {
                    backgroundColor: theme.colors.primary,
                    borderColor: theme.colors.primary,
                  },
                  selectedTasks.includes(task.id) && {
                    backgroundColor: theme.colors.primary,
                    borderColor: theme.colors.primary,
                  },
                ]}
                onPress={() => toggleSelectTask(task.id)}
              >
                {selectedTasks.includes(task.id) ? (
                  <Ionicons name="checkmark" size={14} color="#fff" />
                ) : task.completed ? (
                  <Ionicons name="checkmark" size={14} color="#fff" />
                ) : null}
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.taskContent}
                onPress={() => editTask(task)}
              >
                <Text
                  style={[
                    styles.taskText,
                    { color: theme.colors.text },
                    task.completed && { textDecorationLine: "line-through", color: "#888" },
                  ]}
                >
                  {task.title}
                </Text>
                <View style={styles.taskMeta}>
                  <View style={[styles.subjectTag, { backgroundColor: getSubjectColor(task.subject) }]}>
                    <Text style={styles.metaText}>{task.subject}</Text>
                  </View>
                  <View style={[styles.priorityTag, { backgroundColor: getPriorityColor(task.priority) }]}>
                    <Text style={styles.metaText}>{task.priority}</Text>
                  </View>
                  <Text style={[styles.dueDateText, { color: theme.colors.text }]}>
                    {task.dueDate} {task.dueTime && `at ${task.dueTime}`}
                  </Text>
                </View>
              </TouchableOpacity>

              <View style={styles.taskActions}>
                <TouchableOpacity
                  onPress={() => markAsComplete(task.id)}
                  style={styles.completeButton}
                >
                  <Ionicons 
                    name={task.completed ? "refresh" : "checkmark-circle"} 
                    size={16} 
                    color={task.completed ? "#FF9500" : "#34C759"} 
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => editTask(task)}
                  style={styles.editButton}
                >
                  <Ionicons name="create-outline" size={16} color="#007AFF" />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => deleteTask(task.id)}
                  style={styles.deleteButton}
                >
                  <Ionicons name="trash-outline" size={16} color="#FF3B30" />
                </TouchableOpacity>
              </View>
            </Pressable>
          ))
        )}
      </ScrollView>

      {/* Filter Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={filterModalVisible}
        onRequestClose={() => setFilterModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { backgroundColor: theme.colors.background }]}>
            <Text style={[styles.modalTitle, { color: theme.colors.text }]}>Filter Tasks</Text>

            {/* Subject Filter */}
            <View style={styles.filterSection}>
              <Text style={[styles.filterLabel, { color: theme.colors.text }]}>Subject</Text>
              <View style={styles.filterOptions}>
                {["all", "Work", "Personal", "Health", "Study"].map((subject) => (
                  <Pressable
                    key={subject}
                    style={[
                      styles.filterOption,
                      filters.subject === subject && [styles.selectedOption, { backgroundColor: theme.colors.primary }]
                    ]}
                    onPress={() => applyFilters({ ...filters, subject })}
                  >
                    <Text style={[
                      styles.optionText,
                      { color: theme.colors.text },
                      filters.subject === subject && styles.selectedOptionText
                    ]}>
                      {subject === "all" ? "All Subjects" : subject}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Priority Filter */}
            <View style={styles.filterSection}>
              <Text style={[styles.filterLabel, { color: theme.colors.text }]}>Priority</Text>
              <View style={styles.filterOptions}>
                {["all", "high", "medium", "low"].map((priority) => (
                  <Pressable
                    key={priority}
                    style={[
                      styles.filterOption,
                      filters.priority === priority && [styles.selectedOption, { backgroundColor: theme.colors.primary }]
                    ]}
                    onPress={() => applyFilters({ ...filters, priority })}
                  >
                    <Text style={[
                      styles.optionText,
                      { color: theme.colors.text },
                      filters.priority === priority && styles.selectedOptionText
                    ]}>
                      {priority === "all" ? "All Priorities" : priority}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            {/* Status Filter */}
            <View style={styles.filterSection}>
              <Text style={[styles.filterLabel, { color: theme.colors.text }]}>Status</Text>
              <View style={styles.filterOptions}>
                {["all", "completed", "pending"].map((status) => (
                  <Pressable
                    key={status}
                    style={[
                      styles.filterOption,
                      filters.status === status && [styles.selectedOption, { backgroundColor: theme.colors.primary }]
                    ]}
                    onPress={() => applyFilters({ ...filters, status })}
                  >
                    <Text style={[
                      styles.optionText,
                      { color: theme.colors.text },
                      filters.status === status && styles.selectedOptionText
                    ]}>
                      {status === "all" ? "All Status" : status}
                    </Text>
                  </Pressable>
                ))}
              </View>
            </View>

            <View style={styles.modalButtons}>
              <Pressable
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setFilterModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.modalButton, { backgroundColor: theme.colors.primary }]}
                onPress={() => applyFilters(filters)}
              >
                <Text style={styles.applyButtonText}>Apply Filters</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Edit Task Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={editModalVisible}
        onRequestClose={() => setEditModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { backgroundColor: theme.colors.background }]}>
            <Text style={[styles.modalTitle, { color: theme.colors.text }]}>Edit Task</Text>

            {editingTask && (
              <>
                <View style={styles.editSection}>
                  <Text style={[styles.editLabel, { color: theme.colors.text }]}>Task Title</Text>
                  <TextInput
                    style={[styles.editInput, { backgroundColor: theme.colors.card, color: theme.colors.text, borderColor: theme.colors.border }]}
                    value={editingTask.title}
                    onChangeText={(text) => setEditingTask({ ...editingTask, title: text })}
                    placeholder="Enter task title"
                    placeholderTextColor="#888"
                  />
                </View>

                <View style={styles.editSection}>
                  <Text style={[styles.editLabel, { color: theme.colors.text }]}>Subject</Text>
                  <View style={styles.filterOptions}>
                    {["Work", "Personal", "Health", "Study"].map((subject) => (
                      <Pressable
                        key={subject}
                        style={[
                          styles.filterOption,
                          editingTask.subject === subject && [styles.selectedOption, { backgroundColor: theme.colors.primary }]
                        ]}
                        onPress={() => setEditingTask({ ...editingTask, subject })}
                      >
                        <Text style={[
                          styles.optionText,
                          { color: theme.colors.text },
                          editingTask.subject === subject && styles.selectedOptionText
                        ]}>
                          {subject}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                </View>

                <View style={styles.editSection}>
                  <Text style={[styles.editLabel, { color: theme.colors.text }]}>Priority</Text>
                  <View style={styles.filterOptions}>
                    {["high", "medium", "low"].map((priority) => (
                      <Pressable
                        key={priority}
                        style={[
                          styles.filterOption,
                          editingTask.priority === priority && [styles.selectedOption, { backgroundColor: theme.colors.primary }]
                        ]}
                        onPress={() => setEditingTask({ ...editingTask, priority })}
                      >
                        <Text style={[
                          styles.optionText,
                          { color: theme.colors.text },
                          editingTask.priority === priority && styles.selectedOptionText
                        ]}>
                          {priority}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                </View>

                <View style={styles.editSection}>
                  <Text style={[styles.editLabel, { color: theme.colors.text }]}>Due Date</Text>
                  <TextInput
                    style={[styles.editInput, { backgroundColor: theme.colors.card, color: theme.colors.text, borderColor: theme.colors.border }]}
                    value={editingTask.dueDate}
                    onChangeText={handleDateChange}
                    placeholder="YYYY-MM-DD"
                    placeholderTextColor="#888"
                    keyboardType="numeric"
                    maxLength={10}
                  />
                </View>

                <View style={styles.editSection}>
                  <Text style={[styles.editLabel, { color: theme.colors.text }]}>Due Time</Text>
                  <TextInput
                    style={[styles.editInput, { backgroundColor: theme.colors.card, color: theme.colors.text, borderColor: theme.colors.border }]}
                    value={editingTask.dueTime}
                    onChangeText={handleTimeChange}
                    placeholder="HH:MM"
                    placeholderTextColor="#888"
                    keyboardType="numeric"
                    maxLength={5}
                  />
                </View>
              </>
            )}

            <View style={styles.modalButtons}>
              <Pressable
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setEditModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[styles.modalButton, { backgroundColor: theme.colors.primary }]}
                onPress={handleUpdateTask}
              >
                <Text style={styles.applyButtonText}>Update Task</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

// Keep your existing styles object exactly as it is...
const styles = StyleSheet.create({
  // ...existing styles...
  header: { 
    padding: 14, 
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: { 
    fontSize: 18, 
    fontWeight: "700" 
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flexWrap: 'wrap',
  },
  clearAllTasks: {
    padding: 5,
  },
  completeSelectedButton: {
    padding: 5,
    backgroundColor: 'rgba(52, 199, 89, 0.1)',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  incompleteSelectedButton: {
    padding: 5,
    backgroundColor: 'rgba(255, 149, 0, 0.1)',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  deleteSelectedButton: {
    padding: 5,
    backgroundColor: 'rgba(255, 59, 48, 0.1)',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    margin: 14,
    gap: 10,
  },
  searchBar: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    borderWidth: 1,
    gap: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 14,
  },
  filterButton: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
  },
  filterTagsContainer: {
    paddingHorizontal: 14,
    marginBottom: 10,
  },
  filterTag: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 8,
    gap: 6,
  },
  filterTagText: {
    color: "#fff",
    fontSize: 12,
    fontWeight: "500",
  },
  clearAllButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  clearAllText: {
    fontSize: 12,
    fontWeight: "500",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    margin: 14,
    marginTop: 0,
  },
  input: {
    flex: 1,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 10,
    fontSize: 14,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    elevation: 2,
    borderWidth: 1,
  },
  addButton: {
    marginLeft: 10,
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    elevation: 2,
  },
  taskRow: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
    elevation: 1,
  },
  taskContent: {
    flex: 1,
    marginLeft: 12,
  },
  taskText: { 
    fontSize: 14,
    marginBottom: 4,
  },
  taskMeta: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  taskActions: {
    flexDirection: 'row',
    gap: 8,
    alignItems: 'center',
  },
  completeButton: {
    padding: 4,
  },
  editButton: {
    padding: 4,
  },
  deleteButton: {
    padding: 4,
  },
  subjectTag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  priorityTag: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  metaText: {
    color: "#fff",
    fontSize: 10,
    fontWeight: "500",
  },
  dueDateText: {
    fontSize: 10,
    opacity: 0.7,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: "#5A8DEE",
    justifyContent: "center",
    alignItems: "center",
  },
  emptyState: {
    alignItems: "center",
    paddingVertical: 40,
  },
  emptyStateText: {
    marginTop: 12,
    fontSize: 14,
    textAlign: "center",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "85%",
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
    marginBottom: 20,
    textAlign: "center",
  },
  filterSection: {
    marginBottom: 20,
  },
  editSection: {
    marginBottom: 20,
  },
  filterLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  editLabel: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  editInput: {
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    fontSize: 14,
  },
  filterOptions: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  filterOption: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  selectedOption: {
    borderColor: "#007AFF",
  },
  optionText: {
    fontSize: 12,
    fontWeight: "500",
  },
  selectedOptionText: {
    color: "#fff",
  },
  modalButtons: {
    flexDirection: "row",
    gap: 12,
    marginTop: 20,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#f0f0f0",
  },
  cancelButtonText: {
    color: "#666",
    fontWeight: "600",
  },
  applyButtonText: {
    color: "#fff",
    fontWeight: "600",
  },
});
