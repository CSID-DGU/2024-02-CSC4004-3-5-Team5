import React, { useEffect } from 'react';
import { View, TouchableOpacity, StyleSheet, Image } from 'react-native';
import * as AuthSession from 'expo-auth-session';
import { API_CONFIG } from '../ApiConfig';

const KAKAO_REST_API_KEY = '3f25aa1915bca4417d2a36dd3f8d68b4';
const BACKEND_URL = `${API_CONFIG.news}/login`;
const redirectUri = `${API_CONFIG.news}/callback`;

const LoginScreen = ({ navigation }) => {
  const discovery = {
    authorizationEndpoint: 'https://kauth.kakao.com/oauth/authorize',
  };

  const [request, response, promptAsync] = AuthSession.useAuthRequest(
    {
      clientId: KAKAO_REST_API_KEY,
      redirectUri,
      responseType: 'code',
    },
    discovery
  );

  useEffect(() => {
    if (response?.type === 'success') {
      const authorizationCode = response.params.code;

      const sendAuthorizationCode = async () => {
        try {
          const res = await fetch(BACKEND_URL, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ code: authorizationCode }),
          });

          const data = await res.json();

          if (res.status === 200 && data.code === 'SU') {
            const user = data.loginUser;
            navigation.navigate('Main', { user });
          } else {
            console.error('로그인 실패:', data.message);
          }
        } catch (err) {
          console.error('로그인 오류:', err);
        }
      };

      sendAuthorizationCode();
    }
  }, [response]);

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => promptAsync({ useProxy: true })}
        style={styles.kakaoButton}
        disabled={!request}
      >
        <Image
          source={{
            uri: 'https://developers.kakao.com/tool/resource/static/img/button/login/full/ko/kakao_login_medium_wide.png',
          }}
          style={styles.kakaoButtonImage}
        />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#fff' },
  kakaoButton: { width: 300, height: 45, marginBottom: 20 },
  kakaoButtonImage: { width: '100%', height: '100%', resizeMode: 'contain' },
});

export default LoginScreen;
