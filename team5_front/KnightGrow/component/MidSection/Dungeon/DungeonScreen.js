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
        const response = await axios.get('http://211.188.49.69:8081/news');

        // 올바른 newsList 디스트럭처링
        const { newsList } = response.data;

        // 데이터를 변환
        const formattedNewsData = newsList.map((news) => ({
          id: news.newsID,
          newsDate: news.newsDate,
          newsTitle: news.newsTitle,
          newsShort: news.newsShort,
          newsFull: news.newsFull || '내용 없음',
          quizQuestion: news.quizQuestion,
          quizOptions: JSON.parse(
            news.quizOption.replace(/\[/g, '["').replace(/\]/g, '"]').replace(/, /g, '", "')
          ),
          quizAnswer: news.quizAnswer,
        }));

        setNewsData(formattedNewsData);
      } catch (err) {
        if (err.response) {
          const serverError = err.response.data.error || JSON.stringify(err.response.data);
          console.error(`서버 오류: ${err.response.status} - ${serverError}`);
          setError(`서버 오류: ${err.response.status} - ${serverError}`);
        } else if (err.request) {
          console.error('서버에 응답이 없습니다. 네트워크를 확인하세요.');
          setError('서버에 응답이 없습니다.');
        } else {
          console.error(`오류 발생: ${err.message}`);
          setError(`오류 발생: ${err.message}`);
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
