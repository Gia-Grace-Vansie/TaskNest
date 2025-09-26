import React, { useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  SafeAreaView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

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

export default function CalendarScreen() {
  const today = new Date();
  const navigation = useNavigation();

  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [selectedDates, setSelectedDates] = useState([]);

  const generateMonth = (month, year) => {
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    let days = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let d = 1; d <= daysInMonth; d++) days.push(d);
    return days;
  };

  const toggleDate = (year, month, day) => {
    const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(
      day
    ).padStart(2, "0")}`;
    if (selectedDates.includes(dateStr)) {
      setSelectedDates(selectedDates.filter((d) => d !== dateStr));
    } else {
      setSelectedDates([...selectedDates, dateStr]);
    }
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

  const days = generateMonth(currentMonth, currentYear);
  const monthName = new Date(currentYear, currentMonth).toLocaleString(
    "default",
    { month: "long" }
  );

  const navigateToAddEvent = () => {
    navigation.navigate("AddTask"); // or a dedicated AddEvent screen
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#f8f8f8" }}>
      <ScrollView contentContainerStyle={{ padding: 16, paddingBottom: 140 }}>
        <View style={styles.monthHeader}>
          <TouchableOpacity onPress={() => changeMonth(-1)}>
            <Ionicons name="chevron-back" size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.monthTitle}>
            {monthName}, {currentYear}
          </Text>
          <TouchableOpacity onPress={() => changeMonth(1)}>
            <Ionicons name="chevron-forward" size={24} color="#000" />
          </TouchableOpacity>
        </View>

        <View style={styles.weekRow}>
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day, idx) => (
            <Text key={idx} style={styles.weekDay}>{day}</Text>
          ))}
        </View>

        <View style={styles.daysGrid}>
          {days.map((day, idx) => {
            if (!day) return <View key={idx} style={styles.dayBox} />;
            const dateStr = `${currentYear}-${String(currentMonth + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
            const isSelected = selectedDates.includes(dateStr);
            const isHoliday = holidays[dateStr];
            const isToday =
              currentYear === today.getFullYear() &&
              currentMonth === today.getMonth() &&
              day === today.getDate();

            return (
              <TouchableOpacity
                key={idx}
                style={[
                  styles.dayBox,
                  (isSelected || isToday) && styles.selectedDay,
                ]}
                onPress={() => toggleDate(currentYear, currentMonth, day)}
              >
                <Text
                  style={[
                    styles.dayText,
                    (isSelected || isToday) && styles.selectedDayText,
                  ]}
                >
                  {day}
                </Text>
                {isHoliday && <View style={styles.holidayDot} />}
              </TouchableOpacity>
            );
          })}
        </View>
      </ScrollView>

      {/* Floating Add Event Button */}
      <TouchableOpacity style={styles.addEventButton} onPress={navigateToAddEvent}>
        <Ionicons name="add" size={28} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  monthHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 10 },
  monthTitle: { fontSize: 18, fontWeight: "bold", color: "#000" },
  weekRow: { flexDirection: "row", justifyContent: "space-between", marginBottom: 5 },
  weekDay: { flex: 1, textAlign: "center", fontWeight: "600", color: "#666" },
  daysGrid: { flexDirection: "row", flexWrap: "wrap" },
  dayBox: { width: "14.2%", aspectRatio: 1, justifyContent: "center", alignItems: "center" },
  dayText: { fontSize: 14, color: "#000" },
  selectedDay: { backgroundColor: "#000", borderRadius: 8 },
  selectedDayText: { color: "#fff", fontWeight: "bold" },
  holidayDot: { width: 6, height: 6, borderRadius: 3, backgroundColor: "red", marginTop: 2 },
  addEventButton: {
    position: "absolute",
    bottom: 20,
    right: 20,
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#000",
    justifyContent: "center",
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 4,
    elevation: 5,
  },
});
