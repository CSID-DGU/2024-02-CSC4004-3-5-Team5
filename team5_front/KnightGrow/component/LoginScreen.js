// TODO: kakao login api 이용하는 로그인 구현
// kakao 인가 코드 받고, 백엔드로 전해주는 것까지

import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet } from 'react-native';

const LoginScreen = ({ navigation }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogin = async () => {
    if (!username || !password) {
      setError('아이디와 비밀번호를 입력해주세요');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('https://your-backend-url.com/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });

      const data = await response.json();

      if (data.success) {
        // 로그인 성공 시 Main 화면으로 이동
        navigation.navigate('Main');
      } else {
        setError('아이디 또는 비밀번호가 틀렸습니다');
      }
    } catch (error) {
      setError('로그인 중 오류가 발생했습니다');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="아이디"
        value={username}
        onChangeText={setUsername}
      />
      <TextInput
        style={styles.input}
        placeholder="비밀번호"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />
      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      <TouchableOpacity onPress={handleLogin} style={styles.button} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? '로그인 중...' : '로그인'}</Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => navigation.navigate('Register')}
        style={styles.link}
      >
        <Text>회원가입</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', padding: 20 },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 10,
    paddingLeft: 10,
    borderRadius: 5,
  },
  button: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    alignItems: 'center',
    borderRadius: 5,
  },
  buttonText: { color: '#fff', fontSize: 16 },
  errorText: { color: 'red', textAlign: 'center', marginBottom: 10 },
  link: { marginTop: 10, alignItems: 'center' },
});

export default LoginScreen;
