import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, Image, Alert } from 'react-native';
import axios from 'axios';
import { API_CONFIG } from '../../../ApiConfig';
import AsyncStorage from '@react-native-async-storage/async-storage';

const STORAGE_KEY = 'chatbot_messages';

const DEFAULT_BOT_MESSAGE = { 
  role: 'bot', 
  text: '뉴스 기사에 대해 궁금하신 내용은 저에게 물어봐주세요!' 
};

const sendMessageToBackend = async (message) => {
  try {
    const response = await axios.post(`${API_CONFIG.chatbot}/receive_json`, {
      question: message,
    });

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
  const [messages, setMessages] = useState([DEFAULT_BOT_MESSAGE]);
  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const userJson = await AsyncStorage.getItem('user');
        if (userJson) {
          const user = JSON.parse(userJson);
          setProfileImage(user.profile_image);
        }
      } catch (error) {
        console.error('Failed to load user profile from AsyncStorage:', error);
      }
    };

    const loadMessages = async () => {
      try {
        const storedMessages = await AsyncStorage.getItem(STORAGE_KEY);
        // console.log('Loaded messages:', storedMessages);
        if (storedMessages) {
          setMessages(JSON.parse(storedMessages));
        }
      } catch (error) {
        console.error('Failed to load messages:', error);
      }
    };

    fetchUserProfile();
    loadMessages();
  }, []);

  {/* 대화 저장 */}
  const saveMessages = async (newMessages) => {
    try {
      // console.log('Saving messages:', newMessages); 
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(newMessages));
    } catch (error) {
      console.error('Failed to save messages:', error);
    }
  };

  {/* 대화 백엔드 request 및 response */}
  const handleSendMessage = async () => {
    if (!userMessage.trim()) return;

    setLoading(true);
    const newMessages = [...messages, { role: 'user', text: userMessage }];
    setMessages(newMessages);
    saveMessages(newMessages);

    const currentMessage = userMessage;
    setUserMessage('');

    setMessages((prevMessages) => [
      ...prevMessages,
      { role: 'bot', text: '...', loading: true },
    ]);

    try {
      const response = await sendMessageToBackend(currentMessage);
      const updatedMessages = [
        ...newMessages,
        { role: 'bot', text: response },
      ];
      setMessages(updatedMessages);
      saveMessages(updatedMessages);
    } catch (error) {
      const updatedMessages = [
        ...newMessages,
        { role: 'bot', text: error.message },
      ];
      setMessages(updatedMessages);
      saveMessages(updatedMessages);
    } finally {
      setLoading(false);
    }
  };

  {/* 대화 초기화 경고 */ }
  const confirmClearMessages = () => {
    Alert.alert(
      '경고',
      '대화 기록을 초기화하시겠습니까?',
      [
        { text: '취소', onPress: () => { }, style: 'cancel' },
        { text: '확인', onPress: handleClearMessages },
      ],
      { cancelable: true }
    );
  };

  {/* 대화 초기화 */ }
  const handleClearMessages = async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
      setMessages([DEFAULT_BOT_MESSAGE]);
      Alert.alert('초기화 완료', '대화 기록이 초기화되었습니다.');
    } catch (error) {
      console.error('Failed to clear messages:', error);
    }
  };


  return (
    <View style={styles.chatBotContainer}>
      <View style={styles.header}>
        <Text style={styles.title}>요정</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity style={styles.clearButton} onPress={confirmClearMessages}>
            <Text style={styles.clearButtonText}>초기화</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onClose} style={styles.closeButton}>
            <Text style={styles.closeText}>X</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.container}>
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
                <Image style={styles.profileImage} source={{ uri: profileImage }} />
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
    </View>
  );
};

const styles = StyleSheet.create({
  chatBotContainer: {
    width: '90%',
    height: '80%',
    backgroundColor: '#E6F7FF',
    borderRadius: 10,
    padding: 10
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333333',
  },
  container: {
    flex: 1,
    paddingTop: 0,
    backgroundColor: '#fff'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  headerButtons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  messagesContainer: {
    flex: 1,
    paddingHorizontal: 16
  },
  messageWrapper: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginVertical: 5
  },
  userMessageWrapper: {
    justifyContent: 'flex-end'
  },
  botMessageWrapper: {
    justifyContent: 'flex-start'
  },
  messageBubble: {
    padding: 10,
    borderRadius: 10,
    maxWidth: '70%'
  },
  userMessage: {
    alignSelf: 'flex-end',
    backgroundColor: '#d1f7c4'
  },
  botMessage: {
    alignSelf: 'flex-start',
    backgroundColor: '#f0f0f0'
  },
  messageText: {
    fontSize: 16,
    color: '#333'
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: '#ddd',
    marginLeft: 3,
    marginRight: 3
  },
  inputContainer: {
    flexDirection: 'row',
    padding: 10,
    borderTopWidth: 1,
    borderColor: '#ddd'
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10
  },
  sendButton: {
    marginLeft: 10,
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5
  },
  sendButtonText: {
    color: '#fff',
    fontSize: 16
  },
  clearButton: {
    marginRight: 10,
    padding: 5,
    backgroundColor: '#d3d3d3',
    borderRadius: 5,
  },
  clearButtonText: {
    color: 'black',
    fontWeight: 'bold',
    fontSize: 10,
  },
  closeButton: {
    backgroundColor: '#f44336',
    padding: 5,
    borderRadius: 5,
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
