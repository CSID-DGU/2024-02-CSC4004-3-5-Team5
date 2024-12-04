import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AppContext = createContext();
// AsyncStorage.clear() // 테스트용 로컬 저장소 초기화

export const AppProvider = ({ children }) => {
  const [answeredQuestions, setAnsweredQuestions] = useState([]);
  {/* 접속 했을 때 이전 접속 시간과 비교해서 정각이 넘었다면 초기화 */ }
  useEffect(() => {
    const loadAnsweredQuestions = async () => {
      try {
        const savedQuestions = await AsyncStorage.getItem('answeredQuestions');
        const lastAccessTime = await AsyncStorage.getItem('lastAccessTime');
        const currentTime = new Date();
        if (lastAccessTime) {
          const lastAccessDate = new Date(parseInt(lastAccessTime, 10));
          if (lastAccessDate.getHours() !== currentTime.getHours()) {
            await AsyncStorage.removeItem('answeredQuestions');
            await AsyncStorage.removeItem('lastAccessTime');
            setAnsweredQuestions([]);
          } else if (savedQuestions) {
            setAnsweredQuestions(JSON.parse(savedQuestions));
          }
        } else if (savedQuestions) {
          setAnsweredQuestions(JSON.parse(savedQuestions));
        }

        await AsyncStorage.setItem('lastAccessTime', currentTime.getTime().toString());
      } catch (error) {
        console.error('로컬 저장소에서 데이터를 불러오는 중 오류가 발생했습니다.', error);
      }
    };

    loadAnsweredQuestions();
  }, []);

  {/* 접속해 있을 때 정각에 초기화 */ }
  useEffect(() => {
    const interval = setInterval(async () => {
      const currentTime = new Date();
      const currentMinutes = currentTime.getMinutes();
      const currentSeconds = currentTime.getSeconds();

      if (currentMinutes === 0 && currentSeconds === 0) {
        await AsyncStorage.removeItem('answeredQuestions');
        setAnsweredQuestions([]);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

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
