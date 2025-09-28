// tasks/AddEventScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useTheme } from "../../contexts/ThemeContext";
import { useTaskContext } from "../../contexts/TaskContext";

export default function AddEventScreen() {
  const navigation = useNavigation();
  const { theme } = useTheme();
  const { addEvent, events } = useTaskContext();
  
  const [eventData, setEventData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    priority: "medium",
    type: "event",
  });

  const handleSaveEvent = () => {
    console.log("AddEventScreen: Save button pressed");
    
    if (!eventData.title.trim()) {
      Alert.alert("Error", "Please enter an event title");
      return;
    }

    if (!eventData.date.trim()) {
      Alert.alert("Error", "Please enter a date for the event");
      return;
    }

    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(eventData.date)) {
      Alert.alert("Error", "Please enter a valid date in YYYY-MM-DD format");
      return;
    }

    try {
      addEvent(eventData);
      console.log("AddEventScreen: Event added successfully");
      
      Alert.alert("Success", "Event added successfully!", [
        { 
          text: "OK", 
          onPress: () => navigation.goBack() 
        }
      ]);
    } catch (error) {
      console.error("AddEventScreen: Error adding event:", error);
      Alert.alert("Error", "Failed to add event. Please try again.");
    }
  };

  const formatDateInput = (text) => {
    const numbers = text.replace(/\D/g, '');
    if (numbers.length <= 4) return numbers;
    if (numbers.length <= 6) return numbers.slice(0, 4) + '-' + numbers.slice(4);
    return numbers.slice(0, 4) + '-' + numbers.slice(4, 6) + '-' + numbers.slice(6, 8);
  };

  const formatTimeInput = (text) => {
    const numbers = text.replace(/\D/g, '');
    if (numbers.length <= 2) return numbers;
    return numbers.slice(0, 2) + ':' + numbers.slice(2, 4);
  };

  React.useEffect(() => {
    const today = new Date();
    const todayStr = today.toISOString().split('T')[0];
    setEventData(prev => ({ ...prev, date: todayStr }));
  }, []);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.colors.background }}>
      <View style={[styles.header, { borderBottomColor: theme.colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Ionicons name="close" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Add New Event</Text>
        <TouchableOpacity onPress={handleSaveEvent}>
          <Text style={[styles.saveButton, { color: theme.colors.primary }]}>Save</Text>
        </TouchableOpacity>
      </View>

      <ScrollView contentContainerStyle={styles.container}>
        <View style={styles.inputSection}>
          <Text style={[styles.label, { color: theme.colors.text }]}>Event Title *</Text>
          <TextInput
            style={[
              styles.input,
              { 
                backgroundColor: theme.colors.card,
                color: theme.colors.text,
                borderColor: theme.colors.border 
              }
            ]}
            placeholder="Enter event title"
            placeholderTextColor="#888"
            value={eventData.title}
            onChangeText={(text) => setEventData({ ...eventData, title: text })}
          />
        </View>

        <View style={styles.inputSection}>
          <Text style={[styles.label, { color: theme.colors.text }]}>Description</Text>
          <TextInput
            style={[
              styles.textArea,
              { 
                backgroundColor: theme.colors.card,
                color: theme.colors.text,
                borderColor: theme.colors.border 
              }
            ]}
            placeholder="Enter description (optional)"
            placeholderTextColor="#888"
            value={eventData.description}
            onChangeText={(text) => setEventData({ ...eventData, description: text })}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
        </View>

        <View style={styles.inputSection}>
          <Text style={[styles.label, { color: theme.colors.text }]}>Date *</Text>
          <TextInput
            style={[
              styles.input,
              { 
                backgroundColor: theme.colors.card,
                color: theme.colors.text,
                borderColor: theme.colors.border 
              }
            ]}
            placeholder="YYYY-MM-DD"
            placeholderTextColor="#888"
            value={eventData.date}
            onChangeText={(text) => setEventData({ ...eventData, date: formatDateInput(text) })}
            keyboardType="numeric"
            maxLength={10}
          />
        </View>

        <View style={styles.inputSection}>
          <Text style={[styles.label, { color: theme.colors.text }]}>Time</Text>
          <TextInput
            style={[
              styles.input,
              { 
                backgroundColor: theme.colors.card,
                color: theme.colors.text,
                borderColor: theme.colors.border 
              }
            ]}
            placeholder="HH:MM (optional)"
            placeholderTextColor="#888"
            value={eventData.time}
            onChangeText={(text) => setEventData({ ...eventData, time: formatTimeInput(text) })}
            keyboardType="numeric"
            maxLength={5}
          />
        </View>

        <View style={styles.inputSection}>
          <Text style={[styles.label, { color: theme.colors.text }]}>Priority</Text>
          <View style={styles.priorityContainer}>
            {["low", "medium", "high"].map((priority) => (
              <TouchableOpacity
                key={priority}
                style={[
                  styles.priorityButton,
                  { 
                    backgroundColor: eventData.priority === priority 
                      ? theme.colors.primary 
                      : theme.colors.card,
                    borderColor: theme.colors.border
                  }
                ]}
                onPress={() => setEventData({ ...eventData, priority })}
              >
                <Text style={[
                  styles.priorityText,
                  { 
                    color: eventData.priority === priority 
                      ? "#fff" 
                      : theme.colors.text 
                  }
                ]}>
                  {priority.charAt(0).toUpperCase() + priority.slice(1)}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.inputSection}>
          <Text style={[styles.label, { color: theme.colors.text }]}>Event Type</Text>
          <View style={styles.typeContainer}>
            {[
              { value: "event", label: "Event", icon: "calendar-outline" },
              { value: "task", label: "Task", icon: "checkbox-outline" },
              { value: "reminder", label: "Reminder", icon: "notifications-outline" },
            ].map((type) => (
              <TouchableOpacity
                key={type.value}
                style={[
                  styles.typeButton,
                  { 
                    backgroundColor: eventData.type === type.value 
                      ? theme.colors.primary 
                      : theme.colors.card,
                    borderColor: theme.colors.border
                  }
                ]}
                onPress={() => setEventData({ ...eventData, type: type.value })}
              >
                <Ionicons 
                  name={type.icon} 
                  size={20} 
                  color={eventData.type === type.value ? "#fff" : theme.colors.text} 
                />
                <Text style={[
                  styles.typeText,
                  { 
                    color: eventData.type === type.value 
                      ? "#fff" 
                      : theme.colors.text 
                  }
                ]}>
                  {type.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <View style={styles.inputSection}>
          <Text style={[styles.label, { color: theme.colors.text }]}>Quick Date</Text>
          <View style={styles.quickDateContainer}>
            {[
              { label: "Today", days: 0 },
              { label: "Tomorrow", days: 1 },
              { label: "Next Week", days: 7 },
            ].map((option) => (
              <TouchableOpacity
                key={option.label}
                style={[styles.quickDateButton, { backgroundColor: theme.colors.card, borderColor: theme.colors.border }]}
                onPress={() => {
                  const date = new Date();
                  date.setDate(date.getDate() + option.days);
                  const dateStr = date.toISOString().split('T')[0];
                  setEventData({ ...eventData, date: dateStr });
                }}
              >
                <Text style={[styles.quickDateText, { color: theme.colors.text }]}>
                  {option.label}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: "700",
  },
  saveButton: {
    fontSize: 16,
    fontWeight: "600",
  },
  container: {
    padding: 16,
    paddingBottom: 30,
  },
  inputSection: {
    marginBottom: 24,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
  },
  input: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    fontSize: 16,
  },
  textArea: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    fontSize: 16,
    minHeight: 100,
    textAlignVertical: "top",
  },
  priorityContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  priorityButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: "center",
  },
  priorityText: {
    fontSize: 14,
    fontWeight: "500",
  },
  typeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  typeButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    gap: 6,
  },
  typeText: {
    fontSize: 14,
    fontWeight: "500",
  },
  quickDateContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 8,
  },
  quickDateButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 1,
  },
  quickDateText: {
    fontSize: 14,
    fontWeight: "500",
  },
});