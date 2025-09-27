// contexts/TaskContext.jsx
import React, { createContext, useContext, useState } from "react";

const TaskContext = createContext();

export function TaskProvider({ children }) {
  const [tasks, setTasks] = useState([]);

  // Add task function
  const addTask = (title, time) => {
    const newTask = {
      id: Date.now().toString(),
      title,
      completed: false,
      time,
    };
    setTasks(prev => [...prev, newTask]);
  };

  // Remove task function
  const removeTask = (taskId) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
  };

  // Toggle task completion
  const toggleTask = (taskId) => {
    setTasks(prev => 
      prev.map(task => 
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  // Clear all tasks
  const clearAllTasks = () => {
    setTasks([]);
  };

  const value = {
    tasks,
    setTasks,
    addTask,
    removeTask,
    toggleTask,
    clearAllTasks,
  };

  return (
    <TaskContext.Provider value={value}>
      {children}
    </TaskContext.Provider>
  );
}

// ✅ Make sure this is named correctly - useTaskContext NOT useTasks
export function useTaskContext() {
  const context = useContext(TaskContext);
  if (!context) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
}