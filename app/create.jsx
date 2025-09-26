import { useState } from "react";
import { View, Text, TextInput, StyleSheet, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useRouter } from "expo-router";
import { useTasks } from "../contexts/TaskContext";

export default function Create() {
  const [title, setTitle] = useState("");
  const [time, setTime] = useState("");
  const { addTask } = useTasks();
  const router = useRouter();

  function handleSave() {
    if (!title.trim() || !time.trim()) return;
    addTask(title, time);
    router.back();
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.title}>Create Task</Text>

      <TextInput
        style={styles.input}
        placeholder="Task Title"
        value={title}
        onChangeText={setTitle}
      />
      <TextInput
        style={styles.input}
        placeholder="Time (e.g. 2:00 pm)"
        value={time}
        onChangeText={setTime}
      />

      <Pressable style={styles.button} onPress={handleSave}>
        <Text style={styles.buttonText}>Save Task</Text>
      </Pressable>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20 },
  input: {
    borderWidth: 1, borderColor: "#ccc", borderRadius: 8,
    padding: 12, marginBottom: 16,
  },
  button: {
    backgroundColor: "black", padding: 16, borderRadius: 10,
    alignItems: "center",
  },
  buttonText: { color: "white", fontWeight: "bold" },
});
