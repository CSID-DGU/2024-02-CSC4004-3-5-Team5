import React from "react";
import { View, StyleSheet } from "react-native";
import { WebView } from 'react-native-webview';
import axios from 'axios';
import { useNavigation } from '@react-navigation/native';

const REST_API_KEY = '3f25aa1915bca4417d2a36dd3f8d68b4';
const REDIRECT_URI = 'http://211.188.49.69:8081/callback';
const INJECTED_JAVASCRIPT = `window.ReactNativeWebView.postMessage('message from webView')`;

const KaKaoLogin = () => {
  const navigation = useNavigation();

  function KakaoLoginWebView(data) {
    const exp = "code=";
    const condition = data.indexOf(exp);
    if (condition !== -1) {
      console.log('Raw Data:', data);
      const authorize_code = data.substring(condition + exp.length);
      console.log('Authorization Code:', authorize_code);
      
      // 인가 코드를 백엔드로 전송
      sendCodeToBackend(authorize_code);
    }
  }

  const sendCodeToBackend = async (authorize_code) => {
    try {
      // 인가 코드를 백엔드로 GET 방식으로 전송
      const response = await axios.get(`http://211.188.49.69:8081/login`, {
        params: {
          code: authorize_code,
        },
      });
      console.log('Backend response:', response.data);
      
      // 로그인 성공 후 Main 화면으로 이동
      navigation.navigate('Main');
    } catch (error) {
      console.error('Failed to send code to backend:', error.response?.data || error.message);
    }
  };

  return (
    <View style={Styles.container}>
      <WebView
        style={{ flex: 1 }}
        originWhitelist={['*']}
        scalesPageToFit={false}
        source={{
          uri: `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}`,
        }}
        injectedJavaScript={INJECTED_JAVASCRIPT}
        javaScriptEnabled
        onMessage={(event) => { KakaoLoginWebView(event.nativeEvent["url"]); }}
      />
    </View>
  );
};

export default KaKaoLogin;

const Styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 24,
    backgroundColor: '#fff',
  },
});
