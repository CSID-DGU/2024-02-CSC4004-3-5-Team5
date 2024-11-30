import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const LoginScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={Styles.container}>      
      <Text style={Styles.HomeText}>로그인 화면</Text>
      <TouchableOpacity
        onPress={() => navigation.navigate("KaKaoLogin")}
        style={Styles.NextBottom}
      >
        <Text style={Styles.BottomText}>카카오 화면으로</Text>
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;

const Styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  HomeText: {
    fontSize: 24,
    marginBottom: 20,
  },
  NextBottom: {
    backgroundColor: '#fdd835',
    padding: 15,
    borderRadius: 5,
  },
  BottomText: {
    fontSize: 18,
    color: '#000',
  },
});
