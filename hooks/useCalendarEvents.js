// hooks/useCalendarEvents.js
import { useState, useEffect } from 'react';
import { Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = '@calendar_events';

// Mock events data
const mockEvents = [
  { id: 1, title: "Project Proposal", dueDate: "2025-09-15", completed: false },
  { id: 2, title: "Team Meeting", dueDate: "2025-09-15", completed: false },
  { id: 3, title: "Design Review", dueDate: "2025-09-20", completed: true },
  { id: 4, title: "Client Presentation", dueDate: "2025-09-25", completed: false },
  { id: 5, title: "Code Deployment", dueDate: "2025-09-10", completed: false },
];

export const useCalendarEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load events from storage on hook initialization
  useEffect(() => {
    loadEvents();
  }, []);

  const loadEvents = async () => {
    try {
      setLoading(true);
      const storedEvents = await AsyncStorage.getItem(STORAGE_KEY);
      if (storedEvents !== null) {
        setEvents(JSON.parse(storedEvents));
      } else {
        // If no stored events, use mock events
        setEvents(mockEvents);
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(mockEvents));
      }
    } catch (error) {
      console.error('Error loading events:', error);
      setEvents(mockEvents);
    } finally {
      setLoading(false);
    }
  };

  // Save events to storage and update state
  const saveEvents = async (updatedEvents) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(updatedEvents));
      setEvents(updatedEvents);
      return true;
    } catch (error) {
      console.error('Error saving events:', error);
      Alert.alert("Error", "Failed to save events");
      return false;
    }
  };

  // Add a new event
  const addEvent = (title, dueDate) => {
    if (!title?.trim() || !dueDate?.trim()) {
      Alert.alert("Error", "Please fill in both title and date");
      return false;
    }

    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(dueDate)) {
      Alert.alert("Error", "Please use YYYY-MM-DD format for date");
      return false;
    }

    const newEvent = {
      id: Date.now().toString(),
      title: title.trim(),
      dueDate: dueDate,
      completed: false,
    };

    setEvents(prev => [...prev, newEvent]);
    return true;
  };

  // Delete a single event
  const deleteEvent = (eventId) => {
    setEvents(prev => prev.filter(event => event.id !== eventId));
  };

  // Delete event with confirmation
  const deleteEventWithConfirmation = (eventId) => {
    return new Promise((resolve) => {
      Alert.alert(
        "Delete Event",
        "Are you sure you want to delete this event?",
        [
          { text: "Cancel", style: "cancel", onPress: () => resolve(false) },
          { 
            text: "Delete", 
            style: "destructive", 
            onPress: () => {
              deleteEvent(eventId);
              resolve(true);
            }
          },
        ]
      );
    });
  };

  // Update an event
  const updateEvent = (eventId, updates) => {
    if (!eventId || !updates) return false;
    
    setEvents(prev => 
      prev.map(event => 
        event.id === eventId ? { ...event, ...updates } : event
      )
    );
    return true;
  };

  // Edit event title
  const editEventTitle = (eventId, newTitle) => {
    if (!newTitle?.trim()) {
      Alert.alert("Error", "Event title cannot be empty");
      return false;
    }
    return updateEvent(eventId, { title: newTitle.trim() });
  };

  // Toggle event completion
  const toggleEventCompletion = (eventId) => {
    const event = events.find(e => e.id === eventId);
    if (event) {
      return updateEvent(eventId, { completed: !event.completed });
    }
    return false;
  };

  // Clear all events
  const clearAllEvents = () => {
    setEvents([]);
  };

  // Get events for specific date
  const getEventsForDate = (dateStr) => {
    return events.filter(event => event.dueDate === dateStr);
  };

  // Get event count for specific date
  const getEventCountForDate = (dateStr) => {
    return events.filter(event => event.dueDate === dateStr).length;
  };

  // Auto-save events whenever events change
  useEffect(() => {
    if (!loading) {
      saveEvents(events);
    }
  }, [events, loading]);

  return {
    events,
    setEvents,
    loading,
    addEvent,
    deleteEvent,
    deleteEventWithConfirmation,
    updateEvent,
    editEventTitle,
    toggleEventCompletion,
    clearAllEvents,
    getEventsForDate,
    getEventCountForDate,
    refreshEvents: loadEvents,
  };
};