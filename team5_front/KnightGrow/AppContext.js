import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [answeredQuestions, setAnsweredQuestions] = useState([]);

  // 마지막 접속 시간과 비교하여 상태 초기화
  useEffect(() => {
    const loadAnsweredQuestions = async () => {
      try {
        const savedQuestions = await AsyncStorage.getItem('answeredQuestions');
        const lastAccessTime = await AsyncStorage.getItem('lastAccessTime');
        const currentTime = new Date();

        if (lastAccessTime) {
          const lastAccessDate = new Date(parseInt(lastAccessTime, 10));
          // 마지막 접속 시간과 현재 시간 비교
          if (lastAccessDate.getHours() !== currentTime.getHours()) {
            // 시(hour)가 바뀌었으면 데이터 초기화
            console.log('시(hour)가 바뀌어서 데이터를 초기화합니다.');
            await AsyncStorage.removeItem('answeredQuestions');
            await AsyncStorage.removeItem('lastAccessTime');
            setAnsweredQuestions([]);
          } else if (savedQuestions) {
            setAnsweredQuestions(JSON.parse(savedQuestions));
          }
        } else if (savedQuestions) {
          setAnsweredQuestions(JSON.parse(savedQuestions));
        }

        // 마지막 접속 시간 업데이트
        await AsyncStorage.setItem('lastAccessTime', currentTime.getTime().toString());
      } catch (error) {
        console.error('로컬 저장소에서 데이터를 불러오는 중 오류가 발생했습니다.', error);
      }
    };

    loadAnsweredQuestions();
  }, []);

  // 정각 감시를 위한 Interval 설정
  useEffect(() => {
    const interval = setInterval(async () => {
      const currentTime = new Date();
      const currentMinutes = currentTime.getMinutes();
      const currentSeconds = currentTime.getSeconds();

      // 현재 시간이 정각 (0분 0초)일 경우 상태 초기화
      if (currentMinutes === 0 && currentSeconds === 0) {
        console.log('정각이 되어 데이터를 초기화합니다.');
        await AsyncStorage.removeItem('answeredQuestions');
        setAnsweredQuestions([]);
      }
    }, 1000); // 1초마다 실행 (정확한 체크를 위해)

    // 컴포넌트가 언마운트될 때 interval 해제
    return () => clearInterval(interval);
  }, []);

  // 상태가 변경될 때 상태 저장
  useEffect(() => {
    const saveAnsweredQuestions = async () => {
      try {
        const currentTime = new Date().getTime();
        await AsyncStorage.setItem('answeredQuestions', JSON.stringify(answeredQuestions));
        await AsyncStorage.setItem('lastAccessTime', currentTime.toString());
      } catch (error) {
        console.error('로컬 저장소에 데이터를 저장하는 중 오류가 발생했습니다.', error);
      }
    };

    if (answeredQuestions.length > 0) {
      saveAnsweredQuestions();
    }
  }, [answeredQuestions]);

  const markQuestionAsAnswered = (newsId) => {
    setAnsweredQuestions((prev) => {
      if (!prev.includes(newsId)) {
        const updatedQuestions = [...prev, newsId];
        return updatedQuestions;
      }
      return prev;
    });
  };

  return (
    <AppContext.Provider value={{ answeredQuestions, markQuestionAsAnswered }}>
      {children}
    </AppContext.Provider>
  );
};
