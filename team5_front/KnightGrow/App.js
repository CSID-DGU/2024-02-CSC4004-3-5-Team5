// App.js
import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './component/LoginScreen';
import KaKaoLogin from './component/KaKaoLogin';
import Main from './component/Main';
import { AppProvider } from './AppContext';

const Stack = createStackNavigator();

const App = () => {
  return (
    <AppProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="KaKaoLogin" component={KaKaoLogin} />
          <Stack.Screen name="Main" component={Main} options={{ headerShown: false }} />
        </Stack.Navigator>
      </NavigationContainer>
    </AppProvider>
  );
};

export default App;
