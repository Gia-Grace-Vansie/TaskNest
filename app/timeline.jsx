import { View, Text, StyleSheet, ScrollView } from "react-native";
import { useTasks } from "../contexts/TaskContext";

export default function Timeline() {
  const { tasks } = useTasks();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Timeline</Text>
      <ScrollView>
        {tasks.map((task, i) => (
          <View key={task.id} style={styles.row}>
            <View style={styles.dot} />
            <View style={styles.line} />
            <View style={styles.card}>
              <Text style={styles.taskTitle}>{task.title}</Text>
              <Text style={styles.taskTime}>{task.time}</Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  row: { flexDirection: "row", alignItems: "center", marginBottom: 30 },
  dot: { width: 12, height: 12, borderRadius: 6, backgroundColor: "black" },
  line: { width: 2, height: 50, backgroundColor: "black", marginHorizontal: 10 },
  card: { backgroundColor: "#f5f5f5", padding: 15, borderRadius: 10, flex: 1 },
  taskTitle: { fontWeight: "bold" },
  taskTime: { color: "gray" },
});
