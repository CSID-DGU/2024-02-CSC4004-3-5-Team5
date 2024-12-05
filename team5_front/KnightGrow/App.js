import React, { useState } from 'react';
import { StatusBar } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './component/LoginScreen';
import KaKaoLogin from './component/KaKaoLogin';
import Main from './component/Main';
import { BattleProvider } from './BattleContext';

const Stack = createStackNavigator();

const App = () => {
  const [triggerAttackAnimation, setTriggerAttackAnimation] = useState(false);

  return (
    <BattleProvider>
        <NavigationContainer>
          <Stack.Navigator initialRouteName="Login">
            <Stack.Screen name="Login" component={LoginScreen} options={{ headerShown: false }} />
            <Stack.Screen name="KaKaoLogin" component={KaKaoLogin} options={{ headerShown: false }} />
            <Stack.Screen
              name="Main"
              options={{ headerShown: false }}
            >
              {({ route, navigation }) => (
                <Main
                  route={route || { params: {} }}
                  navigation={navigation}
                  triggerAttackAnimation={triggerAttackAnimation}
                  setTriggerAttackAnimation={setTriggerAttackAnimation}
                />
              )}
            </Stack.Screen>
          </Stack.Navigator>
        </NavigationContainer>
    </BattleProvider>
  );
};

export default App;
