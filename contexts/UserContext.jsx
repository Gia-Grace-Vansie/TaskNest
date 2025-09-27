// contexts/UserContext.js
import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const loadUser = async () => {
      const storedUser = await AsyncStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    };
    loadUser();
  }, []);

  const saveUser = async (newUser) => {
    setUser(newUser);
    await AsyncStorage.setItem("user", JSON.stringify(newUser));
  };

  const logout = async () => {
    await AsyncStorage.removeItem("user");
    setUser(null);
  };

  return (
    <UserContext.Provider value={{ user, setUser: saveUser, logout }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
