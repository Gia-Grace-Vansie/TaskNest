import React, { createContext, useContext, useState, useEffect } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // Load user from AsyncStorage on app start
  useEffect(() => {
    const loadUser = async () => {
      const storedUser = await AsyncStorage.getItem("user");
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      } else {
        // Set default username for demo
        const defaultUser = { username: "test" };
        setUser(defaultUser);
        await AsyncStorage.setItem("user", JSON.stringify(defaultUser));
      }
    };
    loadUser();
  }, []);

  // Update user and persist
  const saveUser = async (newUser) => {
    setUser(newUser);
    await AsyncStorage.setItem("user", JSON.stringify(newUser));
  };

  return (
    <UserContext.Provider value={{ user, setUser: saveUser }}>
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
