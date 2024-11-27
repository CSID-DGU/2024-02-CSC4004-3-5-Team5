import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native';
import axios from 'axios';

const sendMessageToBackend = async (message) => {
  try {
    const response = await axios.post('http://220.116.240.223:5001/receive_json', {
      question: message,
    });

    console.log('Backend response (data):', response.data); // 응답 전체 확인
    console.log('Extracted answer:', response.data.answer.answer); // answer 부분 확인


    return response.data.answer.answer;
  } catch (error) {
    console.error('Error communicating with backend:', error);

    if (error.response) {
      throw new Error(`서버 오류: ${error.response.data.message || '알 수 없는 오류'}`);
    } else if (error.request) {
      throw new Error('서버 응답이 없습니다.');
    } else {
      throw new Error('요청 처리 중 문제가 발생했습니다.');
    }
  }
};


const ChatBotScreen = ({ onClose }) => {
  const [userMessage, setUserMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!userMessage.trim()) return;

    setLoading(true);
    setMessages((prevMessages) => [...prevMessages, { role: 'user', text: userMessage }]);
    const currentMessage = userMessage;
    setUserMessage('');

    try {
      const response = await sendMessageToBackend(currentMessage); // 최종 문자열 반환됨
      console.log('Processed response:', response); // 문자열 확인

      setMessages((prevMessages) => [
        ...prevMessages,
        { role: 'bot', text: response }, // 문자열만 추가
      ]);
    } catch (error) {
      setMessages((prevMessages) => [
        ...prevMessages,
        { role: 'bot', text: error.message },
      ]);
    } finally {
      setLoading(false);
    }
  };



  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={onClose} style={styles.closeButton}>
        <Text style={styles.closeText}>X</Text>
      </TouchableOpacity>

      <ScrollView style={styles.messagesContainer}>
        {messages.map((message, index) => (
          <View
            key={index}
            style={[
              styles.messageWrapper,
              message.role === 'user' ? styles.userMessageWrapper : styles.botMessageWrapper,
            ]}
          >
            {message.role === 'bot' && (
              <Image style={styles.profileImage} source={require('./icon.png')} />
            )}
            <View
              style={[
                styles.messageBubble,
                message.role === 'user' ? styles.userMessage : styles.botMessage,
              ]}
            >
              <Text style={styles.messageText}>{message.text}</Text>
            </View>
            {message.role === 'user' && (
              <Image style={styles.profileImage} source={require('./icon.png')} />
            )}
          </View>
        ))}
      </ScrollView>

      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={userMessage}
          onChangeText={setUserMessage}
          placeholder="메시지를 입력하세요..."
        />
        <TouchableOpacity onPress={handleSendMessage} disabled={loading} style={styles.sendButton}>
          <Text style={styles.sendButtonText}>{loading ? '로딩 중...' : '전송'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, paddingTop: 50, backgroundColor: '#fff' },
  messagesContainer: { flex: 1, paddingHorizontal: 16 },
  messageWrapper: { flexDirection: 'row', alignItems: 'center', marginVertical: 5 },
  userMessageWrapper: { justifyContent: 'flex-end' },
  botMessageWrapper: { justifyContent: 'flex-start' },
  messageBubble: { padding: 10, borderRadius: 10, maxWidth: '70%' },
  userMessage: { alignSelf: 'flex-end', backgroundColor: '#d1f7c4' },
  botMessage: { alignSelf: 'flex-start', backgroundColor: '#f0f0f0' },
  messageText: { fontSize: 16, color: '#333' },
  profileImage: { width: 30, height: 30, borderRadius: 15 },
  inputContainer: { flexDirection: 'row', padding: 10, borderTopWidth: 1, borderColor: '#ddd' },
  input: { flex: 1, borderWidth: 1, borderColor: '#ccc', borderRadius: 5, padding: 10 },
  sendButton: { marginLeft: 10, backgroundColor: '#007bff', paddingVertical: 10, paddingHorizontal: 20, borderRadius: 5 },
  sendButtonText: { color: '#fff', fontSize: 16 },
  closeButton: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#f44336',
    padding: 0,
    width: 30,
    height: 30,
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 10,
  },
});

export default ChatBotScreen;
