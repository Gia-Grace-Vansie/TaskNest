// contexts/UserContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const storedUser = await AsyncStorage.getItem("@user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error("Error loading user:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const saveUser = async (userData) => {
    try {
      setUser(userData);
      await AsyncStorage.setItem("@user", JSON.stringify(userData));
    } catch (error) {
      console.error("Error saving user:", error);
      throw error;
    }
  };

  const updateProfile = async (profileData) => {
    try {
      const updatedUser = { ...user, ...profileData };
      setUser(updatedUser);
      await AsyncStorage.setItem("@user", JSON.stringify(updatedUser));
      return updatedUser;
    } catch (error) {
      console.error("Error updating profile:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await AsyncStorage.removeItem("@user");
      setUser(null);
    } catch (error) {
      console.error("Error during logout:", error);
      throw error;
    }
  };

  const value = {
    user,
    setUser: saveUser,
    updateProfile,
    logout,
    isLoading,
  };

  return (
    <UserContext.Provider value={value}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};