import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Pressable,
  Alert,
  TextInput,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../../contexts/ThemeContext";
import { useCalendarEvents } from "../../hooks/useCalendarEvents";

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

// Error Boundary Component
class ErrorBoundary extends React.Component {
  state = { hasError: false, error: null, errorInfo: null };
  
  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }
  
  componentDidCatch(error, errorInfo) {
    this.setState({ errorInfo });
    console.error('Error caught by boundary:', error, errorInfo);
  }
  
  render() {
    if (this.state.hasError) {
      return (
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#fff' }}>
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: 'red', marginBottom: 10 }}>
            Something went wrong
          </Text>
          <Text style={{ textAlign: 'center', color: '#666' }}>
            {this.state.error?.toString()}
          </Text>
        </View>
      );
    }
    return this.props.children;
  }
}

function CalendarScreenContent() {
  const today = new Date();
  const navigation = useNavigation();
  const { theme } = useTheme();
  
  // Use the custom hook for event management
  const {
    events,
    loading,
    addEvent,
    deleteEvent,
    editEventTitle,
    getEventsForDate,
    getEventCountForDate,
  } = useCalendarEvents();

  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDate, setSelectedDate] = useState(null);
  const [viewMode, setViewMode] = useState("monthly");
  const [modalVisible, setModalVisible] = useState(false);
  const [eventsForSelectedDate, setEventsForSelectedDate] = useState([]);
  const [currentWeek, setCurrentWeek] = useState(0);
  
  // Add Event modal
  const [addEventModalVisible, setAddEventModalVisible] = useState(false);
  const [newEventTitle, setNewEventTitle] = useState("");
  const [newEventDate, setNewEventDate] = useState("");

  // Edit Event state
  const [editingEvent, setEditingEvent] = useState(null);
  const [editEventTitleText, setEditEventTitleText] = useState("");

  // Today's Events modal
  const [todayEventsModalVisible, setTodayEventsModalVisible] = useState(false);

  // Set current week based on today's date
  useEffect(() => {
    setCurrentWeek(getWeekOfMonth(today));
  }, []);

  // Format date input with automatic dashes and numbers only
  const formatDateInput = (text) => {
    // Remove all non-digit characters
    const numbers = text.replace(/\D/g, '');
    
    // Auto-format as user types: YYYY-MM-DD
    if (numbers.length <= 4) {
      // Just the year
      setNewEventDate(numbers);
    } else if (numbers.length <= 6) {
      // Year and month
      setNewEventDate(`${numbers.slice(0, 4)}-${numbers.slice(4)}`);
    } else {
      // Full date
      setNewEventDate(`${numbers.slice(0, 4)}-${numbers.slice(4, 6)}-${numbers.slice(6, 8)}`);
    }
  };

  // Format date input for editing
  const formatEditDateInput = (text) => {
    // Remove all non-digit characters
    const numbers = text.replace(/\D/g, '');
    
    // Auto-format as user types: YYYY-MM-DD
    if (numbers.length <= 4) {
      setEditingEvent({ ...editingEvent, dueDate: numbers });
    } else if (numbers.length <= 6) {
      setEditingEvent({ ...editingEvent, dueDate: `${numbers.slice(0, 4)}-${numbers.slice(4)}` });
    } else {
      setEditingEvent({ ...editingEvent, dueDate: `${numbers.slice(0, 4)}-${numbers.slice(4, 6)}-${numbers.slice(6, 8)}` });
    }
  };

  const generateMonth = (month, year) => {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    let days = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let d = 1; d <= daysInMonth; d++) days.push(d);
    return days;
  };

  // Get the week of month for a given date
  const getWeekOfMonth = (date) => {
    const firstDayOfMonth = new Date(date.getFullYear(), date.getMonth(), 1);
    const firstDayOfWeek = firstDayOfMonth.getDay();
    const offsetDate = date.getDate() + firstDayOfWeek - 1;
    return Math.floor(offsetDate / 7);
  };

  // Generate a specific week of the month
  const generateWeek = (month, year, weekIndex) => {
    const firstDayOfMonth = new Date(year, month, 1);
    const firstDayOfWeek = firstDayOfMonth.getDay();
    
    // Calculate the first day of the requested week
    const startDate = 1 + (weekIndex * 7) - firstDayOfWeek;
    
    let days = [];
    for (let i = 0; i < 7; i++) {
      const currentDate = new Date(year, month, startDate + i);
      
      // Check if the date is in the current month
      if (currentDate.getMonth() === month) {
        days.push({
          day: currentDate.getDate(),
          month: month,
          year: year,
          isCurrentMonth: true
        });
      } else {
        // Date is from previous or next month
        days.push({
          day: currentDate.getDate(),
          month: currentDate.getMonth(),
          year: currentDate.getFullYear(),
          isCurrentMonth: false
        });
      }
    }
    return days;
  };

  const getHolidayForDate = (dateStr) => {
    return holidays[dateStr];
  };

  const handleDatePress = (year, month, day) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
    setSelectedDate(dateStr);
    const eventsForDate = getEventsForDate(dateStr);
    setEventsForSelectedDate(eventsForDate);
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
    // Reset to first week when changing months
    setCurrentWeek(0);
  };

  const changeWeek = (direction) => {
    let newWeek = currentWeek + direction;
    const weeksInMonth = getWeeksInMonth(currentMonth, currentYear);
    
    if (newWeek < 0) {
      // Go to previous month
      changeMonth(-1);
      setCurrentWeek(getWeeksInMonth(currentMonth - 1, currentYear) - 1);
    } else if (newWeek >= weeksInMonth) {
      // Go to next month
      changeMonth(1);
      setCurrentWeek(0);
    } else {
      setCurrentWeek(newWeek);
    }
  };

  // Calculate number of weeks in a month
  const getWeeksInMonth = (month, year) => {
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const numWeeks = Math.ceil((firstDay.getDay() + daysInMonth) / 7);
    return numWeeks;
  };

  // Add Event using the hook
  const handleAddEvent = async () => {
    const success = await addEvent(newEventTitle, newEventDate);
    if (success) {
      setNewEventTitle("");
      setNewEventDate("");
      setAddEventModalVisible(false);
    }
  };

  const openAddEventModal = () => {
    const defaultDate = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;
    setNewEventDate(defaultDate);
    setAddEventModalVisible(true);
  };

  // Delete Event using the hook
  const handleDeleteEvent = async (eventId) => {
    const success = await deleteEvent(eventId);
    if (success) {
      // Update the modal view immediately
      const updatedSelectedEvents = eventsForSelectedDate.filter(e => e.id !== eventId);
      setEventsForSelectedDate(updatedSelectedEvents);
      
      // If no events left, close the modal
      if (updatedSelectedEvents.length === 0) {
        setModalVisible(false);
      }
    }
  };

  // Edit Event using the hook
  const handleEditEvent = (event) => {
    setEditingEvent(event);
    setEditEventTitleText(event.title);
  };

  const saveEditedEvent = async () => {
    if (!editEventTitleText.trim()) {
      Alert.alert("Error", "Event title cannot be empty");
      return;
    }
    
    const success = await editEventTitle(editingEvent.id, editEventTitleText);
    if (success) {
      // Update the modal view
      const updatedSelectedEvents = eventsForSelectedDate.map(e => 
        e.id === editingEvent.id ? { ...e, title: editEventTitleText.trim() } : e
      );
      setEventsForSelectedDate(updatedSelectedEvents);
      
      setEditingEvent(null);
      setEditEventTitleText("");
    }
  };

  // Today's events
  const showDailySummary = () => {
    const todayDateStr = today.toISOString().split('T')[0];
    const eventsToday = getEventsForDate(todayDateStr);
    setEventsForSelectedDate(eventsToday);
    setSelectedDate(todayDateStr);
    setTodayEventsModalVisible(true);
  };

  // Get the display days based on view mode
  const getDisplayDays = () => {
    if (viewMode === "monthly") {
      return generateMonth(currentMonth, currentYear);
    } else {
      return generateWeek(currentMonth, currentYear, currentWeek);
    }
  };

  const days = getDisplayDays();
  const monthName = new Date(currentYear, currentMonth).toLocaleString("default", { month: "long" });
  const weekNumber = currentWeek + 1;
  const totalWeeks = getWeeksInMonth(currentMonth, currentYear);

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background, justifyContent: 'center', alignItems: 'center' }}>
        <Text style={{ color: theme.colors.text }}>Loading events...</Text>
      </SafeAreaView>
    );
  }

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
            {monthName}, {currentYear} {viewMode === "weekly" && `(Week ${weekNumber} of ${totalWeeks})`}
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
            if (viewMode === "monthly") {
              // Monthly view logic
              if (!day) return <View key={idx} style={styles.dayBox} />;
              
              const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
              const eventCount = getEventCountForDate(dateStr);
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
                  {eventCount > 0 && (
                    <View style={[
                      styles.taskIndicator,
                      { backgroundColor: theme.colors.primary }
                    ]}>
                      <Text style={styles.taskIndicatorText}>{eventCount}</Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            } else {
              // Weekly view logic
              const dateObj = day;
              const dateStr = `${dateObj.year}-${String(dateObj.month + 1).padStart(2, "0")}-${String(dateObj.day).padStart(2, "0")}`;
              const eventCount = getEventCountForDate(dateStr);
              const isHoliday = holidays[dateStr];
              const isToday = dateStr === today.toISOString().split('T')[0];
              const isCurrentMonth = dateObj.month === currentMonth;

              return (
                <TouchableOpacity
                  key={idx}
                  style={[
                    styles.dayBox,
                    isToday && { backgroundColor: theme.colors.primary, borderRadius: 8 },
                    !isCurrentMonth && { opacity: 0.4 },
                  ]}
                  onPress={() => handleDatePress(dateObj.year, dateObj.month, dateObj.day)}
                >
                  <Text
                    style={[
                      styles.dayText,
                      { color: isCurrentMonth ? theme.colors.text : "#999" },
                      isToday && { color: "#fff", fontWeight: "700" },
                    ]}
                  >
                    {dateObj.day}
                  </Text>
                  {isHoliday && <View style={styles.holidayDot} />}
                  {eventCount > 0 && (
                    <View style={[
                      styles.taskIndicator,
                      { backgroundColor: theme.colors.primary }
                    ]}>
                      <Text style={styles.taskIndicatorText}>{eventCount}</Text>
                    </View>
                  )}
                </TouchableOpacity>
              );
            }
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
            <Text style={styles.summaryButtonText}>View Today's Events</Text>
          </TouchableOpacity>
          <Text style={[styles.summaryText, { color: theme.colors.text }]}>
            Tap any date to see events due that day
          </Text>
        </View>
      </ScrollView>

      {/* Event Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { backgroundColor: theme.colors.background }]}>
            <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
              Events for {selectedDate}
            </Text>
            
            {/* Show Holiday Information */}
            {getHolidayForDate(selectedDate) && (
              <View style={[styles.holidayBanner, { backgroundColor: theme.colors.primary + '20' }]}>
                <Ionicons name="calendar" size={20} color={theme.colors.primary} />
                <Text style={[styles.holidayText, { color: theme.colors.primary }]}>
                  {getHolidayForDate(selectedDate)}
                </Text>
              </View>
            )}
            
            {eventsForSelectedDate.length === 0 ? (
              <Text style={[styles.noTasksText, { color: theme.colors.text }]}>
                No events due on this date
              </Text>
            ) : (
              eventsForSelectedDate.map(event => (
                <View key={event.id} style={styles.taskItem}>
                  <Ionicons 
                    name={event.completed ? "checkmark-circle" : "radio-button-off"} 
                    size={20} 
                    color={event.completed ? "#4CAF50" : theme.colors.primary} 
                  />
                  <Text style={[
                    styles.taskText,
                    { color: theme.colors.text },
                    event.completed && styles.completedTask
                  ]}>
                    {event.title}
                  </Text>
                  <TouchableOpacity onPress={() => handleEditEvent(event)} style={{ marginLeft: 8 }}>
                    <Ionicons name="pencil" size={18} color={theme.colors.primary} />
                  </TouchableOpacity>
                  <TouchableOpacity onPress={() => handleDeleteEvent(event.id)} style={{ marginLeft: 8 }}>
                    <Ionicons name="trash" size={18} color="red" />
                  </TouchableOpacity>
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

      {/* Today's Events Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={todayEventsModalVisible}
        onRequestClose={() => setTodayEventsModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { backgroundColor: theme.colors.background }]}>
            <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
              📋 Today's Events ({selectedDate})
            </Text>
            
            {/* Show Holiday Information */}
            {getHolidayForDate(selectedDate) && (
              <View style={[styles.holidayBanner, { backgroundColor: theme.colors.primary + '20' }]}>
                <Ionicons name="calendar" size={20} color={theme.colors.primary} />
                <Text style={[styles.holidayText, { color: theme.colors.primary }]}>
                  {getHolidayForDate(selectedDate)}
                </Text>
              </View>
            )}
            
            {eventsForSelectedDate.length === 0 ? (
              <Text style={[styles.noTasksText, { color: theme.colors.text }]}>
                No events today! 🎉
              </Text>
            ) : (
              <View>
                <Text style={[styles.tasksCountText, { color: theme.colors.text }]}>
                  You have {eventsForSelectedDate.length} event{eventsForSelectedDate.length !== 1 ? 's' : ''} today:
                </Text>
                {eventsForSelectedDate.map(event => (
                  <View key={event.id} style={styles.taskItem}>
                    <Ionicons 
                      name={event.completed ? "checkmark-circle" : "radio-button-off"} 
                      size={20} 
                      color={event.completed ? "#4CAF50" : theme.colors.primary} 
                    />
                    <Text style={[
                      styles.taskText,
                      { color: theme.colors.text },
                      event.completed && styles.completedTask
                    ]}>
                      {event.title}
                    </Text>
                  </View>
                ))}
              </View>
            )}
            
            <Pressable
              style={[styles.closeButton, { backgroundColor: theme.colors.primary }]}
              onPress={() => setTodayEventsModalVisible(false)}
            >
              <Text style={styles.closeButtonText}>Close</Text>
            </Pressable>
          </View>
        </View>
      </Modal>

      {/* Add Event Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={addEventModalVisible}
        onRequestClose={() => setAddEventModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { backgroundColor: theme.colors.background }]}>
            <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
              Add New Event
            </Text>
            
            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: theme.colors.text }]}>Event Title</Text>
              <TextInput
                style={[styles.textInput, { 
                  backgroundColor: theme.colors.card,
                  color: theme.colors.text,
                  borderColor: theme.colors.border 
                }]}
                placeholder="Enter event title"
                placeholderTextColor={theme.colors.text + "80"}
                value={newEventTitle}
                onChangeText={setNewEventTitle}
              />
            </View>
            
            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: theme.colors.text }]}>Date (YYYY-MM-DD)</Text>
              <TextInput
                style={[styles.textInput, { 
                  backgroundColor: theme.colors.card,
                  color: theme.colors.text,
                  borderColor: theme.colors.border 
                }]}
                placeholder="2025-09-15"
                placeholderTextColor={theme.colors.text + "80"}
                value={newEventDate}
                onChangeText={formatDateInput}
                keyboardType="numeric"
                maxLength={10}
              />
            </View>
            
            <View style={styles.modalButtonsContainer}>
              <Pressable
                style={[styles.modalButton, styles.cancelButton, { borderColor: theme.colors.primary }]}
                onPress={() => setAddEventModalVisible(false)}
              >
                <Text style={[styles.modalButtonText, { color: theme.colors.primary }]}>Cancel</Text>
              </Pressable>
              
              <Pressable
                style={[styles.modalButton, { backgroundColor: theme.colors.primary }]}
                onPress={handleAddEvent}
              >
                <Text style={[styles.modalButtonText, { color: "#fff" }]}>Add Event</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Edit Event Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={!!editingEvent}
        onRequestClose={() => setEditingEvent(null)}
      >
        <View style={styles.modalContainer}>
          <View style={[styles.modalContent, { backgroundColor: theme.colors.background }]}>
            <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
              Edit Event
            </Text>
            
            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: theme.colors.text }]}>Event Title</Text>
              <TextInput
                style={[styles.textInput, { 
                  backgroundColor: theme.colors.card,
                  color: theme.colors.text,
                  borderColor: theme.colors.border 
                }]}
                value={editEventTitleText}
                onChangeText={setEditEventTitleText}
              />
            </View>

            <View style={styles.inputContainer}>
              <Text style={[styles.label, { color: theme.colors.text }]}>Date (YYYY-MM-DD)</Text>
              <TextInput
                style={[styles.textInput, { 
                  backgroundColor: theme.colors.card,
                  color: theme.colors.text,
                  borderColor: theme.colors.border 
                }]}
                value={editingEvent?.dueDate || ''}
                onChangeText={formatEditDateInput}
                keyboardType="numeric"
                maxLength={10}
              />
            </View>
            
            <View style={styles.modalButtonsContainer}>
              <Pressable
                style={[styles.modalButton, styles.cancelButton, { borderColor: theme.colors.primary }]}
                onPress={() => setEditingEvent(null)}
              >
                <Text style={[styles.modalButtonText, { color: theme.colors.primary }]}>Cancel</Text>
              </Pressable>
              
              <Pressable
                style={[styles.modalButton, { backgroundColor: theme.colors.primary }]}
                onPress={saveEditedEvent}
              >
                <Text style={[styles.modalButtonText, { color: "#fff" }]}>Save</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>

      {/* Add Event Button */}
      <TouchableOpacity
        style={[styles.addEventButton, { backgroundColor: theme.colors.primary }]}
        onPress={openAddEventModal}
      >
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

// Main export with Error Boundary
export default function CalendarScreen(props) {
  return (
    <ErrorBoundary>
      <CalendarScreenContent {...props} />
    </ErrorBoundary>
  );
}

// Your existing styles remain exactly the same
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
  holidayBanner: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
  },
  holidayText: {
    marginLeft: 8,
    fontWeight: "600",
    fontSize: 14,
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
  inputContainer: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
  },
  modalButtonsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 16,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
    marginHorizontal: 4,
  },
  cancelButton: {
    borderWidth: 1,
    backgroundColor: "transparent",
  },
  modalButtonText: {
    fontWeight: "600",
    fontSize: 14,
  },
  tasksCountText: {
    fontSize: 14,
    marginBottom: 12,
    textAlign: "center",
    fontStyle: "italic",
  },
});