import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import axios from 'axios';
import NewsList from './NewsList';
import NewsDetail from './NewsDetail';
import Quiz from './Quiz';

const DungeonScreen = () => {
  const [currentScreen, setCurrentScreen] = useState('newsList');
  const [newsData, setNewsData] = useState([]);
  const [selectedNews, setSelectedNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchNewsData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get('https://211.188.49.69:8081/news'); 
        console.log('API 응답 데이터:', response.data);
        const { newsList } = response.data;
        
        const formattedNewsData = newsList.map((news) => ({
          id: news.newsID,
          newsTitle: news.newsTitle,
          newsShort: news.newsShort,
          newsFull: news.newsFull || '내용 없음',
          quizQuestion: news.quizQuestion,
          quizOptions: JSON.parse(news.quizOption.replace(/'/g, '"')),
          quizAnswer: news.quizAnswer,
        }));

        setNewsData(formattedNewsData);
      } catch (err) {
        // 오류 처리
        if (err.response) {
          // 서버가 응답을 반환했지만 상태 코드가 2xx가 아님
          console.error(`서버 오류: ${err.response.status} - ${err.response.data.error || err.response.data}`);
          setError(`서버 오류: ${err.response.status}`);
        } else if (err.request) {
          // 요청이 이루어졌지만 응답을 받지 못함
          console.error('서버에 응답이 없습니다. 네트워크를 확인하세요.');
          setError('서버에 응답이 없습니다.');
        } else {
          // 오류가 발생한 요청을 설정하는 중
          console.error(`오류 발생: ${err.message}`);
          setError('오류 발생');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchNewsData();
  }, []);

  const handleNewsSelect = (newsItem) => {
    setSelectedNews(newsItem);
    setCurrentScreen('newsDetail');
  };

  const renderScreen = () => {
    switch (currentScreen) {
      case 'newsList':
        return (
          <NewsList
            newsData={newsData}
            onSelect={handleNewsSelect}
            answeredQuestion={answeredQuestion}
          />
        );
      case 'newsDetail':
        return (
          <NewsDetail
            news={selectedNews}
            onNext={() => setCurrentScreen('quiz')}
            onGoToNewsList={() => setCurrentScreen('newsList')}
          />
        );
      case 'quiz':
        return (
          <Quiz
            quizData={selectedNews}
            onGoToNewsDetail={() => setCurrentScreen('newsDetail')}
            onGoToNewsList={() => setCurrentScreen('newsList')}
          />
        );
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      {loading && <Text>Loading...</Text>}
      {error && <Text>{error}</Text>}
      {!loading && !error && <View style={styles.content}>{renderScreen()}</View>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    width: '100%',
  },
});

export default DungeonScreen;
