import React from 'react';
import { View, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const LoginScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={Styles.container}>
      <Image 
        source={require('../assets/Loading.png')} 
        style={Styles.backgroundImage}
      />
      <TouchableOpacity
        onPress={() => navigation.navigate("KaKaoLogin")}
        style={Styles.kakaoButton}
      >
        <Image 
          source={require('../assets/kakaoLogin.png')} 
          style={Styles.kakaoImage}
        />
      </TouchableOpacity>
    </View>
  );
};

export default LoginScreen;

const Styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    width: '100%',
    height: '100%',
    position: 'absolute',
    resizeMode: 'cover',
  },
  kakaoButton: {
    alignSelf: 'center',
    position: 'absolute',
    bottom: 50,
  },
  kakaoImage: {
    width: 200,
    height: 50,
    resizeMode: 'contain',
  },
});
