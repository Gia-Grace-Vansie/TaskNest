import React, { createContext, useContext, useState } from "react";

// Classy-cutesy student theme colors
const baseLightTheme = {
  colors: {
    primary: "#5A8DEE",     // main accent
    background: "#FDF6F0",  // light background
    card: "#FFFFFF",         // cards / containers
    text: "#1A1A1A",         // dark text
    border: "#ddd",
    accent: "#5A8DEE",
  },
};

const baseDarkTheme = {
  colors: {
    primary: "#5A8DEE",
    background: "#1A1A1A",  // dark background
    card: "#2C2C2C",         // dark card
    text: "#FFFFFF",          // light text
    border: "#333",
    accent: "#5A8DEE",
  },
};

const ThemeContext = createContext({
  theme: baseLightTheme,
  toggleTheme: () => {},
  setThemeMode: () => {},
  setAccentColor: () => {},
});

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState(baseLightTheme);
  const [mode, setMode] = useState("light"); // "light" or "dark"

  const toggleTheme = () => {
    const newMode = mode === "light" ? "dark" : "light";
    setMode(newMode);
    setTheme(
      newMode === "light"
        ? { ...baseLightTheme, colors: { ...baseLightTheme.colors, primary: theme.colors.primary } }
        : { ...baseDarkTheme, colors: { ...baseDarkTheme.colors, primary: theme.colors.primary } }
    );
  };

  const setThemeMode = (newMode) => {
    setMode(newMode);
    setTheme(
      newMode === "light"
        ? { ...baseLightTheme, colors: { ...baseLightTheme.colors, primary: theme.colors.primary } }
        : { ...baseDarkTheme, colors: { ...baseDarkTheme.colors, primary: theme.colors.primary } }
    );
  };

  const setAccentColor = (color) => {
    setTheme((prev) => ({
      ...prev,
      colors: { ...prev.colors, primary: color, accent: color },
    }));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme, setThemeMode, setAccentColor }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => useContext(ThemeContext);
