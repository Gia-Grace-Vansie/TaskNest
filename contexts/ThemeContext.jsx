// contexts/ThemeContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

// Classy-cutesy student theme colors
const baseLightTheme = {
  isDark: false,
  colors: {
    primary: "#5A8DEE",     // main accent
    background: "#FDF6F0",  // warm light background
    card: "#FFFFFF",        // cards / containers
    text: "#1A1A1A",        // dark text
    border: "#E8D7C7",      // warm border
    accent: "#5A8DEE",
    notification: "#FF6B6B",
  },
};

const baseDarkTheme = {
  isDark: true,
  colors: {
    primary: "#5A8DEE",
    background: "#1A1A1A",  // dark background
    card: "#2C2C2C",        // dark card
    text: "#FFFFFF",        // light text
    border: "#444444",      // dark border
    accent: "#5A8DEE",
    notification: "#FF6B6B",
  },
};

const ThemeContext = createContext();

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(baseLightTheme);
  const [mode, setMode] = useState("light");
  const [accentColor, setAccentColorState] = useState("#5A8DEE");
  const [isLoading, setIsLoading] = useState(true);

  // Load saved theme settings on app start
  useEffect(() => {
    loadThemeSettings();
  }, []);

  const loadThemeSettings = async () => {
    try {
      const savedSettings = await AsyncStorage.getItem('@theme_settings');
      if (savedSettings) {
        const { mode: savedMode, accentColor: savedAccentColor } = JSON.parse(savedSettings);
        
        setMode(savedMode);
        setAccentColorState(savedAccentColor);
        
        // Apply the saved theme
        const baseTheme = savedMode === "light" ? baseLightTheme : baseDarkTheme;
        setTheme({
          ...baseTheme,
          colors: { ...baseTheme.colors, primary: savedAccentColor, accent: savedAccentColor }
        });
      }
    } catch (error) {
      console.error('Error loading theme settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveThemeSettings = async (newMode, newAccentColor) => {
    try {
      const settings = {
        mode: newMode,
        accentColor: newAccentColor,
      };
      await AsyncStorage.setItem('@theme_settings', JSON.stringify(settings));
    } catch (error) {
      console.error('Error saving theme settings:', error);
    }
  };

  const toggleTheme = () => {
    const newMode = mode === "light" ? "dark" : "light";
    setMode(newMode);
    
    const baseTheme = newMode === "light" ? baseLightTheme : baseDarkTheme;
    const updatedTheme = {
      ...baseTheme,
      colors: { ...baseTheme.colors, primary: accentColor, accent: accentColor }
    };
    
    setTheme(updatedTheme);
    saveThemeSettings(newMode, accentColor);
  };

  const setThemeMode = (newMode) => {
    setMode(newMode);
    
    const baseTheme = newMode === "light" ? baseLightTheme : baseDarkTheme;
    const updatedTheme = {
      ...baseTheme,
      colors: { ...baseTheme.colors, primary: accentColor, accent: accentColor }
    };
    
    setTheme(updatedTheme);
    saveThemeSettings(newMode, accentColor);
  };

  const setAccentColor = (color) => {
    setAccentColorState(color);
    
    const baseTheme = mode === "light" ? baseLightTheme : baseDarkTheme;
    const updatedTheme = {
      ...baseTheme,
      colors: { ...baseTheme.colors, primary: color, accent: color }
    };
    
    setTheme(updatedTheme);
    saveThemeSettings(mode, color);
  };

  // Provide loading state to prevent flash of default theme
  if (isLoading) {
    return null;
  }

  const value = {
    theme,
    toggleTheme,
    setThemeMode,
    setAccentColor,
    mode,
    accentColor,
    isLoading,
  };

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};