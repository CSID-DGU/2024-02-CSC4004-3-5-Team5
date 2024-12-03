import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import LoginScreen from './component/LoginScreen';
import KaKaoLogin from './component/KaKaoLogin';
import Main from './component/Main';
import { AppProvider } from './AppContext';
import { BattleProvider } from './BattleContext';

const Stack = createStackNavigator();

const App = () => {
  const [triggerAttackAnimation, setTriggerAttackAnimation] = useState(false); // 애니메이션 상태 추가

  return (
    <BattleProvider>
      <AppProvider>
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
                  triggerAttackAnimation={triggerAttackAnimation} // 상태 전달
                  setTriggerAttackAnimation={setTriggerAttackAnimation} // 상태 변경 함수 전달
                />
              )}
            </Stack.Screen>
          </Stack.Navigator>
        </NavigationContainer>
      </AppProvider>
    </BattleProvider>
  );
};

export default App;
