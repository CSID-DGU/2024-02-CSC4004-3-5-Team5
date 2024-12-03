import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import axios from 'axios';
import NewsList from './NewsList';
import NewsDetail from './NewsDetail';
import Quiz from './Quiz';
import { API_CONFIG } from '../../../ApiConfig';

const DungeonScreen = ({ triggerAttackAnimation, setResetMonsterTrigger }) => {
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
        const response = await axios.get(`${API_CONFIG.news}/news`);
        const { newsList } = response.data;

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
        setError(err.message || '오류 발생');
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
        return <NewsList newsData={newsData} onSelect={handleNewsSelect} />;
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
            setResetMonsterTrigger={setResetMonsterTrigger} // 상태 전달
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
