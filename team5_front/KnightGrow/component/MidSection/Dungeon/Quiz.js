import React, { useContext, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { AppContext } from '../../../Appcontext';
import axios from 'axios';

const Quiz = ({ quizData, onGoToNewsDetail, onGoToNewsList }) => {
  const [message, setMessage] = useState('');
  const [isAnswered, setIsAnswered] = useState(false); // 정답 여부 확인
  const [isCorrect, setIsCorrect] = useState(false); // 정답 맞춤 여부
  const [userInfo, setUserInfo] = useState(null); // 유저 정보 상태 관리

  const { markQuestionAsAnswered } = useContext(AppContext);



  const handleOptionPress = async (selectedOption) => {
    if (isAnswered) return; // 이미 정답을 선택한 경우 아무 동작하지 않음

    if (selectedOption === quizData.quizAnswer) {
      setMessage('정답입니다!');
      setIsCorrect(true);
      markQuestionAsAnswered(quizData.id);
      await updateExp(); // 경험치 업데이트 함수 호출
    } else {
      setMessage('오답입니다!');
    }

    setIsAnswered(true);
  };

  // 경험치 업데이트 함수
  const updateExp = async () => {
    try {
      const response = await axios.post('https://211.188.49.69:8081/exp', {
        userID: 12345, // 실제 로그인된 유저의 ID를 전달해야 함
        quizID: quizData.id, // 퀴즈 ID 전달
        correct: true, // 정답 여부
      });

      if (response.status === 200 && response.data.code === 'SU') {
        const info = response.data.info;
        setUserInfo(info);

        // 경험치 및 레벨업 정보 표시
        if (info.levelUp) {
          Alert.alert(
            '레벨업!',
            `축하합니다! 레벨 ${info.previousLevel} → ${info.currentLevel}로 레벨업했습니다.`
          );
        } else {
          Alert.alert('경험치 획득', `경험치 ${info.gainedExp}을 획득했습니다.`);
        }
      }
    } catch (error) {
      if (error.response) {
        // 서버 에러 메시지 처리
        const errorMessage =
          error.response.data.message || '경험치 업데이트 중 문제가 발생했습니다.';
        Alert.alert('오류', errorMessage);
      } else {
        // 네트워크 또는 기타 에러 처리
        Alert.alert('오류', '서버와 통신 중 문제가 발생했습니다.');
      }
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

      {/* 유저 정보 표시 */}
      {userInfo && (
        <View style={styles.userInfo}>
          <Text style={styles.userInfoText}>
            유저: {userInfo.userName}, 레벨: {userInfo.currentLevel}, 경험치: +{userInfo.gainedExp}
          </Text>
        </View>
      )}
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
