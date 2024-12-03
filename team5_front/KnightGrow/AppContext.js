import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [answeredQuestions, setAnsweredQuestions] = useState([]);

  useEffect(() => {
    const loadAnsweredQuestions = async () => {
      try {
        // AsyncStorage.clear();

        const savedQuestions = await AsyncStorage.getItem('answeredQuestions');
        const lastAccessTime = await AsyncStorage.getItem('lastAccessTime');
        const currentTime = new Date();
        if (lastAccessTime) {
          const lastAccessDate = new Date(parseInt(lastAccessTime, 10));
          if (lastAccessDate.getHours() !== currentTime.getHours()) {
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

        await AsyncStorage.setItem('lastAccessTime', currentTime.getTime().toString());
      } catch (error) {
        console.error('로컬 저장소에서 데이터를 불러오는 중 오류가 발생했습니다.', error);
      }
    };

    loadAnsweredQuestions();
  }, []);

  useEffect(() => {
    const interval = setInterval(async () => {
      const currentTime = new Date();
      const currentMinutes = currentTime.getMinutes();
      const currentSeconds = currentTime.getSeconds();

      if (currentMinutes === 0 && currentSeconds === 0) {
        console.log('정각이 되어 데이터를 초기화합니다.');
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
