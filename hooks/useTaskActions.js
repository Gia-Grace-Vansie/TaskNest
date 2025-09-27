// hooks/useTaskActions.js
import { useState } from 'react';

export function useTaskActions() {
  const [tasks, setTasks] = useState([]);
  const [selectedTasks, setSelectedTasks] = useState([]);

  // Add a new task
  const addTask = (title) => {
    if (!title.trim()) return false;
    
    const newTask = {
      id: Date.now().toString(),
      title: title.trim(),
      subject: "Personal",
      dueDate: new Date().toISOString().split('T')[0],
      priority: "medium",
      completed: false
    };
    
    setTasks(prev => [...prev, newTask]);
    return true;
  };

  // Delete a single task
  const deleteTask = (taskId) => {
    setTasks(prev => prev.filter(task => task.id !== taskId));
    setSelectedTasks(prev => prev.filter(id => id !== taskId));
  };

  // Delete selected tasks
  const deleteSelectedTasks = () => {
    setTasks(prev => prev.filter(task => !selectedTasks.includes(task.id)));
    setSelectedTasks([]);
  };

  // Clear all tasks
  const clearAllTasks = () => {
    setTasks([]);
    setSelectedTasks([]);
  };

  // Toggle task completion
  const toggleTask = (taskId) => {
    setTasks(prev => 
      prev.map(task => 
        task.id === taskId ? { ...task, completed: !task.completed } : task
      )
    );
  };

  // Update a task
  const updateTask = (updatedTask) => {
    if (!updatedTask || !updatedTask.id) return false;
    
    setTasks(prev => 
      prev.map(task => 
        task.id === updatedTask.id ? updatedTask : task
      )
    );
    return true;
  };

  // Toggle task selection
  const toggleSelectTask = (taskId) => {
    setSelectedTasks(prev => 
      prev.includes(taskId) 
        ? prev.filter(id => id !== taskId)
        : [...prev, taskId]
    );
  };

  return {
    tasks,
    setTasks,
    selectedTasks,
    setSelectedTasks,
    addTask,
    deleteTask,
    deleteSelectedTasks,
    clearAllTasks,
    toggleTask,
    updateTask,
    toggleSelectTask
  };
}