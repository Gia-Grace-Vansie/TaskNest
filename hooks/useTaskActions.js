import { useCallback, useState } from "react";

export function useTaskActions(selectedTasks, setSelectedTasks) {
  const [tasks, setTasks] = useState([]);

  // Add a new task
  const addTask = useCallback((title) => {
    const newTask = {
      id: Date.now().toString(),
      title,
      subject: "Personal",
      dueDate: "",
      priority: "medium",
      completed: false,
    };
    setTasks(prev => [...prev, newTask]);
  }, [setTasks]);

  // Delete a single task
  const deleteTask = useCallback((id) => {
    setTasks(prev => prev.filter(task => task.id !== id));
    setSelectedTasks(prev => prev.filter(taskId => taskId !== id));
  }, [setTasks, setSelectedTasks]);

  // Delete all selected tasks
  const deleteSelectedTasks = useCallback(() => {
    setTasks(prev => prev.filter(task => !selectedTasks.includes(task.id)));
    setSelectedTasks([]);
  }, [setTasks, selectedTasks, setSelectedTasks]);

  // Clear all tasks
  const clearAllTasks = useCallback(() => {
    setTasks([]);
    setSelectedTasks([]);
  }, [setTasks, setSelectedTasks]);

  // Toggle completion (if you use it)
  const toggleTask = useCallback((id) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === id ? { ...task, completed: !task.completed } : task
      )
    );
  }, [setTasks]);

  // Update a task (for editing)
  const updateTask = useCallback((updatedTask) => {
    setTasks(prev =>
      prev.map(task =>
        task.id === updatedTask.id ? { ...updatedTask } : task
      )
    );
    return true;
  }, [setTasks]);

  return {
    tasks,
    setTasks,
    addTask,
    deleteTask,
    deleteSelectedTasks,
    clearAllTasks,
    toggleTask,
    updateTask,
  };
}