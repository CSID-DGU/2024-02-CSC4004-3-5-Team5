import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

//TODO: chatbot api 직접 사용 X -> 백엔드에 사용자 질문 넘겨주고 답변 받는 방식으로 구현

const ChatBotScreen = ({ onClose }) => {
  const [userMessage, setUserMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const handleSendMessage = async () => {
    if (!userMessage.trim()) return;

    setLoading(true);
    setMessages((prevMessages) => [...prevMessages, { role: 'user', text: userMessage }]);
    setUserMessage('');

    try {
      const response = await getChatGPTResponse(userMessage);
      setMessages((prevMessages) => [...prevMessages, { role: 'bot', text: response }]);
    } catch (error) {
      setMessages((prevMessages) => [...prevMessages, { role: 'bot', text: '오류가 발생했습니다.' }]);
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
            style={[styles.messageBubble, message.role === 'user' ? styles.userMessage : styles.botMessage]}
          >
            <Text style={styles.messageText}>{message.text}</Text>
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
  messageBubble: { padding: 10, marginVertical: 5, borderRadius: 10 },
  userMessage: { alignSelf: 'flex-end', backgroundColor: '#d1f7c4' },
  botMessage: { alignSelf: 'flex-start', backgroundColor: '#f0f0f0' },
  messageText: { fontSize: 16, color: '#333' },
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
