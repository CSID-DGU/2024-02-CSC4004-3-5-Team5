import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Image, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { API_CONFIG } from '../../../ApiConfig';

const RankingScreen = () => {
  const [rankingData, setRankingData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchRankingData = async () => {
    try {
      const response = await axios.get(`${API_CONFIG.news}/main`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
  
      if (response.status === 200 && response.data.code === 'SU') {
        const ranking = response.data.ranking;
  
        if (ranking.length > 0) {
          setRankingData(ranking.slice(0, 5)); // 상위 5명만 표시
        } else {
          setRankingData([]);
          setError('현재 랭킹에 유저가 없습니다.');
        }
      } else {
        throw new Error(response.data.message || '데이터를 불러올 수 없습니다.');
      }
    } catch (err) {
      console.error('에러 상세:', err); // 에러 상세 정보를 출력
      if (err.response && err.response.status === 503) {
        setError(err.response.data.message || '서버가 요청을 처리할 수 없습니다.');
      } else {
        setError('서버와 통신 중 문제가 발생했습니다.');
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRankingData();
  }, []);

  // 개별 랭킹 항목 렌더링
  const renderItem = ({ item, index }) => (
    <View style={[styles.rankItem, index < 3 ? styles.topRank : null]}>
      {index < 3 ? (
        <Image
          source={
            index === 0
              ? require('./image/class_6.png') // 1위 이미지
              : index === 1
              ? require('./image/class_5.png') // 2위 이미지
              : require('./image/class_4.png') // 3위 이미지
          }
          style={styles.medalImage}
        />
      ) : (
        <Text style={styles.rankIndex}>{index + 1}위</Text>
      )}
      <Image source={{ uri: item.profileImage }} style={styles.profileImage} />
      <Text style={styles.rankName}>{item.userName}</Text>
      <Text style={styles.rankScore}>레벨 {item.level}</Text>
    </View>
  );

  if (loading) {
    return (
      <View style={styles.loaderContainer}>
        <ActivityIndicator size="large" color="#007bff" />
        <Text style={styles.loaderText}>데이터를 불러오는 중...</Text>
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={rankingData}
        keyExtractor={(item, index) => index.toString()}
        renderItem={renderItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: '100%',
    backgroundColor: '#ffffff',
    padding: 16,
  },
  rankItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  topRank: {
    backgroundColor: '#f8e1f4',
  },
  medalImage: {
    width: 30,
    height: 30,
    marginRight: 10,
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: 10,
  },
  rankIndex: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#666',
    marginRight: 10,
  },
  rankName: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  rankScore: {
    fontSize: 16,
    color: '#333',
  },
  loaderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loaderText: {
    marginTop: 10,
    fontSize: 16,
    color: '#555',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: 'red',
    fontSize: 16,
  },
});

export default RankingScreen;
