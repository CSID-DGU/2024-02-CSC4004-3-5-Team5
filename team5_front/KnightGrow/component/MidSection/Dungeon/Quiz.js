import React, { useState, useContext } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import axios from 'axios';
import { BattleContext } from '../../../BattleContext';
import { AppContext } from '../../../AppContext';
import { API_CONFIG } from '../../../ApiConfig';

const Quiz = ({ quizData, onGoToNewsDetail, onGoToNewsList, setResetMonsterTrigger }) => {
  const [message, setMessage] = useState('');
  const [isAnswered, setIsAnswered] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const { triggerAttackSequence } = useContext(BattleContext);
  const { markQuestionAsAnswered } = useContext(AppContext);

  const handleOptionPress = async (selectedOption) => {
    if (isAnswered) return;

    const selectedIndex = quizData.quizOptions.indexOf(selectedOption);

    if (selectedIndex === quizData.quizAnswer) {
      setMessage('정답입니다! 경험치 100 획득');
      setIsCorrect(true);
      setIsAnswered(true);
      markQuestionAsAnswered(quizData.id); // 백엔드와 동기화

      triggerAttackSequence(); // 기사 공격 애니메이션 실행
      await updateExp(); // 경험치 업데이트
    } else {
      setMessage('오답입니다!');
    }
  };

  const updateExp = async () => {
    try {
      console.log('경험치 업데이트 요청 전송');
      const response = await axios.post(`${API_CONFIG.news}/exp`);
      if (response.status === 200 && response.data.code === 'SU') {
        const info = response.data.info;
        if (info.levelUp) {
          Alert.alert(
            '레벨업!',
            `축하합니다! 레벨 ${info.previousLevel} → ${info.currentLevel}로 레벨업했습니다.`
          );
        }
      }
    } catch (error) {
      console.error('경험치 업데이트 오류:', error);
      if (error.response) {
        const errorMessage =
          error.response.data.message || '경험치 업데이트 중 문제가 발생했습니다.';
        Alert.alert('오류', errorMessage);
      } else {
        Alert.alert('오류', '서버와 통신 중 문제가 발생했습니다.');
      }
    }
  };

  const handleBackButton = () => {
    if (isCorrect) {
      setResetMonsterTrigger(true); // 몬스터 다시 등장 트리거 활성화
      onGoToNewsList();
    } else {
      onGoToNewsDetail();
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.message}>{message}</Text>
        <TouchableOpacity
          style={styles.navigationButton}
          onPress={handleBackButton}
        >
          <Text style={styles.navigationButtonText}>
            {isCorrect ? '돌아가기' : '뉴스 보러가기'}
          </Text>
        </TouchableOpacity>
      </View>

      <ScrollView>
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
      </ScrollView>
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
  userInfo: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#f9f9f9',
    borderRadius: 5,
  },
  userInfoText: {
    fontSize: 16,
    color: '#333',
  },
});

export default Quiz;
