import React, { createContext, useState } from 'react';

export const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [answeredQuestions, setAnsweredQuestions] = useState([]); // 맞춘 퀴즈 ID 저장

  const markQuestionAsAnswered = (newsId) => {
    setAnsweredQuestions((prev) => [...prev, newsId]); // 맞춘 뉴스 ID 추가
  };

  return (
    <AppContext.Provider value={{ answeredQuestions, markQuestionAsAnswered }}>
      {children}
    </AppContext.Provider>
  );
};
