import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const TaskContext = createContext();

export function TaskProvider({ children }) {
  const [tasks, setTasks] = useState([]);
  const [events, setEvents] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load tasks and events from storage on app start
  useEffect(() => {
    loadInitialData();
  }, []);

  const loadInitialData = async () => {
    try {
      await loadTasks();
      await loadEvents();
    } catch (error) {
      console.error('Error loading initial data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Load tasks from AsyncStorage
  const loadTasks = async () => {
    try {
      const storedTasks = await AsyncStorage.getItem('@todo_tasks');
      if (storedTasks !== null) {
        setTasks(JSON.parse(storedTasks));
      }
    } catch (error) {
      console.error('Error loading tasks:', error);
    }
  };

  // Load events from AsyncStorage
  const loadEvents = async () => {
    try {
      const storedEvents = await AsyncStorage.getItem('@calendar_events');
      if (storedEvents !== null) {
        setEvents(JSON.parse(storedEvents));
      } else {
        // Initialize with empty array if no events exist
        setEvents([]);
        await AsyncStorage.setItem('@calendar_events', JSON.stringify([]));
      }
    } catch (error) {
      console.error('Error loading events:', error);
    }
  };

  // Save tasks to AsyncStorage
  const saveTasks = async (newTasks) => {
    try {
      await AsyncStorage.setItem('@todo_tasks', JSON.stringify(newTasks));
    } catch (error) {
      console.error('Error saving tasks:', error);
    }
  };

  // Save events to AsyncStorage
  const saveEvents = async (newEvents) => {
    try {
      await AsyncStorage.setItem('@calendar_events', JSON.stringify(newEvents));
    } catch (error) {
      console.error('Error saving events:', error);
    }
  };

  // Task functions
  const addTask = (title, dueDate = "", dueTime = "23:59") => {
    const newTask = {
      id: Date.now().toString(),
      title,
      completed: false,
      dueDate,
      dueTime,
      subject: "Personal",
      priority: "medium",
      createdAt: new Date().toISOString(),
    };
    const updatedTasks = [...tasks, newTask];
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
    return newTask;
  };

  const removeTask = (taskId) => {
    const updatedTasks = tasks.filter(task => task.id !== taskId);
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
  };

  const toggleTask = (taskId) => {
    const updatedTasks = tasks.map(task => 
      task.id === taskId ? { ...task, completed: !task.completed } : task
    );
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
  };

  const updateTask = (updatedTask) => {
    const updatedTasks = tasks.map(task => 
      task.id === updatedTask.id ? updatedTask : task
    );
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
    return true;
  };

  const clearAllTasks = () => {
    setTasks([]);
    saveTasks([]);
  };

  const deleteSelectedTasks = (selectedTaskIds) => {
    const updatedTasks = tasks.filter(task => !selectedTaskIds.includes(task.id));
    setTasks(updatedTasks);
    saveTasks(updatedTasks);
  };

  // Event functions for calendar
  // contexts/TaskContext.jsx - Just the addEvent function
const addEvent = (eventData) => {
  console.log("TaskContext: addEvent called with:", eventData);
  
  const newEvent = {
    id: Date.now().toString(),
    title: eventData.title || "Untitled Event",
    description: eventData.description || "",
    date: eventData.date || new Date().toISOString().split('T')[0],
    time: eventData.time || "00:00",
    priority: eventData.priority || "medium",
    type: eventData.type || "event",
    completed: false,
    createdAt: new Date().toISOString(),
  };
  
  const updatedEvents = [...events, newEvent];
  setEvents(updatedEvents);
  saveEvents(updatedEvents);
  
  console.log("TaskContext: Event saved. Total events:", updatedEvents.length);
  return newEvent;
};

  const getEventsForDate = (dateStr) => {
    return events.filter(event => event.date === dateStr);
  };

  const getTasksForDate = (dateStr) => {
    return tasks.filter(task => task.dueDate === dateStr);
  };

  const getAllItemsForDate = (dateStr) => {
    const dateEvents = getEventsForDate(dateStr);
    const dateTasks = getTasksForDate(dateStr);
    return [...dateEvents, ...dateTasks];
  };

  const value = {
    // Task related
    tasks,
    setTasks,
    addTask,
    removeTask,
    toggleTask,
    updateTask,
    clearAllTasks,
    deleteSelectedTasks,
    
    // Event/Calendar related
    events,
    setEvents,
    addEvent,
    getEventsForDate,
    getTasksForDate,
    getAllItemsForDate,
    
    // Loading state
    isLoading,
  };

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
}

export function useTaskContext() {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
}