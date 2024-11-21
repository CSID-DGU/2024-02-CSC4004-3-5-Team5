import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const Quiz = ({ quizData, onGoToNewsDetail, onGoToNewsList }) => {
  const [message, setMessage] = useState('');
  const [isAnswered, setIsAnswered] = useState(false); // 정답 여부 확인
  const [isCorrect, setIsCorrect] = useState(false); // 정답 맞춤 여부

  const handleOptionPress = (selectedOption) => {
    if (isAnswered) return; // 이미 정답을 선택한 경우 아무 동작하지 않음
  
    if (selectedOption === quizData.quizAnswer) {
      setMessage('정답입니다!');
      setIsAnswered(true);
      setIsCorrect(true);
    } else {
      setMessage('오답입니다!');
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.message}>{message}</Text>
        <TouchableOpacity
          style={styles.navigationButton}
          onPress={isCorrect ? onGoToNewsList : onGoToNewsDetail}
        >
          <Text style={styles.navigationButtonText}>
            {isCorrect ? '돌아가기' : '뉴스 보러가기'}
          </Text>
        </TouchableOpacity>
      </View>

      {/* 퀴즈 질문 및 선택지 */}
      <Text style={styles.title}>{quizData.quizQuestion}</Text>
      {quizData.quizOptions.map((option, index) => (
        <TouchableOpacity
          key={index}
          style={[
            styles.button,
            isAnswered && { backgroundColor: '#ccc', opacity: 0.7 },
          ]}
          onPress={() => handleOptionPress(option)}
          disabled={isAnswered}
        >
          <Text style={styles.buttonText}>{option}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'flex-start',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  message: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  navigationButton: {
    backgroundColor: '#007bff',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  navigationButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#28a745',
    padding: 15,
    borderRadius: 5,
    alignItems: 'center',
    marginBottom: 10,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Quiz;
