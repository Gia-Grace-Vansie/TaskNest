// app.js or index.jsx
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { View } from 'react-native';
import Dashboard from '../dashboard.jsx';
import CalendarScreen from './CalendarScreen.jsx';
import AddTask from './AddTask.jsx';
import ToDoScreen from './ToDoScreen.jsx';
import ProfileScreen from './ProfileScreen.jsx';
import Welcome from '../welcome.jsx';
import SignUp from '../auth/signup.jsx';
import BottomNav from '../components/BottomNav';

const Stack = createStackNavigator();

// Main app layout with bottom navigation
function MainAppLayout() {
  return (
    <View style={{ flex: 1 }}>
      <Stack.Navigator 
        screenOptions={{ 
          headerShown: false,
        }}
      >
        <Stack.Screen name="Dashboard" component={Dashboard} />
        <Stack.Screen name="CalendarScreen" component={CalendarScreen} />
        <Stack.Screen name="AddTask" component={AddTask} />
        <Stack.Screen name="ToDoScreen" component={ToDoScreen} />
        <Stack.Screen name="ProfileScreen" component={ProfileScreen} />
      </Stack.Navigator>
      <BottomNav />
    </View>
  );
}

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Welcome" component={Welcome} />
        <Stack.Screen name="SignUp" component={SignUp} />
        <Stack.Screen name="MainApp" component={MainAppLayout} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}