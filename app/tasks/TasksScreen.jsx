import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Pressable, 
  TextInput,
  Modal,
  SafeAreaView 
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function TasksScreen() {
  const [tasks, setTasks] = useState([
    { id: '1', title: 'Complete project proposal', completed: false },
    { id: '2', title: 'Team meeting at 2 PM', completed: true },
    { id: '3', title: 'Review design mockups', completed: false },
    { id: '4', title: 'Update project timeline', completed: false },
  ]);
  
  const [modalVisible, setModalVisible] = useState(false);
  const [newTaskTitle, setNewTaskTitle] = useState('');

  const toggleTask = (taskId) => {
    setTasks(tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    ));
  };

  const addTask = () => {
    if (newTaskTitle.trim()) {
      const newTask = {
        id: Date.now().toString(),
        title: newTaskTitle,
        completed: false
      };
      setTasks([...tasks, newTask]);
      setNewTaskTitle('');
      setModalVisible(false);
    }
  };

  const deleteTask = (taskId) => {
    setTasks(tasks.filter(task => task.id !== taskId));
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>My Tasks</Text>
        <Text style={styles.subtitle}>{tasks.filter(t => !t.completed).length} tasks remaining</Text>
      </View>

      {/* Add Task Button */}
      <Pressable 
        style={styles.addButton}
        onPress={() => setModalVisible(true)}
      >
        <Ionicons name="add" size={24} color="white" />
        <Text style={styles.addButtonText}>Add New Task</Text>
      </Pressable>

      {/* Tasks List */}
      <ScrollView style={styles.taskList}>
        {tasks.map((task) => (
          <View key={task.id} style={styles.taskItem}>
            <Pressable 
              style={[styles.checkbox, task.completed && styles.checkboxCompleted]}
              onPress={() => toggleTask(task.id)}
            >
              {task.completed && <Ionicons name="checkmark" size={16} color="white" />}
            </Pressable>
            
            <Text style={[
              styles.taskText, 
              task.completed && styles.taskTextCompleted
            ]}>
              {task.title}
            </Text>
            
            <Pressable 
              style={styles.deleteButton}
              onPress={() => deleteTask(task.id)}
            >
              <Ionicons name="trash-outline" size={20} color="#FF3B30" />
            </Pressable>
          </View>
        ))}
      </ScrollView>

      {/* Add Task Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Add New Task</Text>
            
            <TextInput
              style={styles.textInput}
              placeholder="Enter task description"
              value={newTaskTitle}
              onChangeText={setNewTaskTitle}
              autoFocus={true}
            />
            
            <View style={styles.modalButtons}>
              <Pressable 
                style={[styles.modalButton, styles.cancelButton]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </Pressable>
              
              <Pressable 
                style={[styles.modalButton, styles.addButtonModal]}
                onPress={addTask}
              >
                <Text style={styles.addButtonTextModal}>Add Task</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f8f8',
    padding: 20,
  },
  header: {
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#000',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
  addButton: {
    flexDirection: 'row',
    backgroundColor: '#000',
    padding: 15,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  addButtonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 8,
    fontSize: 16,
  },
  taskList: {
    flex: 1,
  },
  taskItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#ddd',
    borderRadius: 6,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxCompleted: {
    backgroundColor: '#000',
    borderColor: '#000',
  },
  taskText: {
    flex: 1,
    fontSize: 16,
    color: '#333',
  },
  taskTextCompleted: {
    textDecorationLine: 'line-through',
    color: '#999',
  },
  deleteButton: {
    padding: 4,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 25,
    width: '85%',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
    textAlign: 'center',
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    marginBottom: 20,
  },
  modalButtons: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  modalButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginHorizontal: 5,
  },
  cancelButton: {
    backgroundColor: '#f0f0f0',
  },
  addButtonModal: {
    backgroundColor: '#000',
  },
  cancelButtonText: {
    color: '#333',
    fontWeight: 'bold',
  },
  addButtonTextModal: {
    color: 'white',
    fontWeight: 'bold',
  },
});