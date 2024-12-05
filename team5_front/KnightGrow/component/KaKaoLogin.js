import React, { useState } from "react";
import { View, StyleSheet, ActivityIndicator } from "react-native";
import { WebView } from "react-native-webview";
import axios from "axios";
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const REST_API_KEY = "3f25aa1915bca4417d2a36dd3f8d68b4";
const REDIRECT_URI = "http://211.188.49.69:8081/callback";

const KaKaoLogin = () => {
  const navigation = useNavigation();
  const [loading, setLoading] = useState(false);
  const [isWebViewVisible, setIsWebViewVisible] = useState(true); 

  const handleRequest = (request) => {
    const { url } = request;

    if (url.startsWith(REDIRECT_URI)) {
      const codeMatch = url.match(/code=([^&]+)/);
      if (codeMatch) {
        const code = codeMatch[1];
        // console.log("Authorization Code:", code);
        sendCodeToBackend(code); 
      }
      setIsWebViewVisible(false); 
      return false; 
    }
    return true; 
  };

  const sendCodeToBackend = async (authorize_code) => {
    setLoading(true);
    try {
      const response = await axios.get(`http://211.188.49.69:8081/login`, {
        params: { code: authorize_code },
      });
      // console.log("Backend response:", response.data);

      const { loginUser } = response.data;
      await AsyncStorage.setItem("user", JSON.stringify(loginUser));

      navigation.navigate("Main"); // Main 화면으로 이동
    } catch (error) {
      console.error("Failed to send code to backend:", error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={Styles.container}>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" style={Styles.loader} />
      ) : isWebViewVisible ? (
        <WebView
          style={{ flex: 1 }}
          originWhitelist={["*"]}
          source={{
            uri: `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${REST_API_KEY}&redirect_uri=${REDIRECT_URI}`,
          }}
          javaScriptEnabled
          onShouldStartLoadWithRequest={handleRequest} 
        />
      ) : null}
    </View>
  );
};

export default KaKaoLogin;

const Styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 24,
    backgroundColor: "#fff",
  },
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});
