import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import axios from 'axios';
import NewsList from './NewsList';
import NewsDetail from './NewsDetail';
import Quiz from './Quiz';
import { API_CONFIG } from '../../../ApiConfig';

const DungeonScreen = ({ setResetMonsterTrigger }) => {
  const [currentScreen, setCurrentScreen] = useState('newsList');
  const [newsData, setNewsData] = useState([]);
  const [selectedNews, setSelectedNews] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    {/* 백엔드에서 뉴스 및 퀴즈 정보 받아오기 */}
    const fetchNewsData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await axios.get(`${API_CONFIG.news}/news`);
        const { newsList } = response.data;
        // console.log({newsList});
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

  {/* newsList 로 돌아가면 몬스터 리셋 */}
  useEffect(() => {
    if (currentScreen === 'newsList') {
      setResetMonsterTrigger(true);
      setTimeout(() => setResetMonsterTrigger(false), 100);
    }
  }, [currentScreen]);

  {/* 뉴스 선택 */}
  const handleNewsSelect = (newsItem) => {
    setSelectedNews(newsItem);
    setCurrentScreen('newsDetail');
  };

  {/* 던전 화면 */}
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
            setResetMonsterTrigger={setResetMonsterTrigger}
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
