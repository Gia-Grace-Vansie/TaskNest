import { Ionicons } from '@expo/vector-icons';

function TabNavigator() {
  return (
    <Tab.Navigator 
      screenOptions={{ 
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopLeftRadius: 20,
          borderTopRightRadius: 20,
          height: 80,
          paddingBottom: 10,
        }
      }}
    >
      <Tab.Screen 
        name="Dashboard" 
        component={Dashboard}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons name={focused ? "home" : "home-outline"} size={size} color={color} />
          ),
          tabBarLabel: "Home",
        }}
      />
      <Tab.Screen 
        name="Calendar" 
        component={CalendarScreen}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons name={focused ? "calendar" : "calendar-outline"} size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="Add" 
        component={AddTask}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons name={focused ? "add-circle" : "add-circle-outline"} size={32} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="ToDo" 
        component={ToDoScreen}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons name={focused ? "list" : "list-outline"} size={size} color={color} />
          ),
        }}
      />
      <Tab.Screen 
        name="Profile" 
        component={ProfileScreen}
        options={{
          tabBarIcon: ({ focused, color, size }) => (
            <Ionicons name={focused ? "person" : "person-outline"} size={size} color={color} />
          ),
        }}
      />
    </Tab.Navigator>
  );
}