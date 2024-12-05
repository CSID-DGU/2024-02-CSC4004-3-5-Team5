import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import axios from 'axios';
import { API_CONFIG } from '../../../ApiConfig';

const StatScreen = ({ }) => {
  const [characterData, setCharacterData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  {/* 백엔드에 유저 stat 요청 */ }
  const fetchUserData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_CONFIG.news}/stat`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200 && response.data.code === 'SU') {
        // console.log(response.data);
        setCharacterData(response.data);
      } else {
        throw new Error(response.data.message || '사용자 데이터를 가져오지 못했습니다.');
      }
    } catch (err) {
      console.error('에러 상세:', err);
      setError('서버와 통신 중 문제가 발생했습니다.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserData();
  }, []);

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

  if (!characterData) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>사용자 데이터를 찾을 수 없습니다.</Text>
      </View>
    );
  }

  const {
    loginUser = {},
    gainedExpInThisLevel = 0,
    requiredExpForNextLevel = 0,
  } = characterData || {};

  const {
    level = 0,
    winCount = 0,
    userName = 'Unknown',
    profileImage = null,
    consecutiveDay = 0,
  } = loginUser || {};

  const weight = 1 + 0.1 * consecutiveDay;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* 프로필 이미지 */}
      <View style={styles.profileImageContainer}>
        {profileImage ? (
          <Image source={{ uri: profileImage }} style={styles.profileImage} />
        ) : (
          <View style={[styles.profileImage, styles.placeholder]} />
        )}
      </View>

      {/* 스탯 정보 */}
      <View style={styles.infoContainer}>
        <View style={styles.statRow}>
          <Text style={styles.statName}>이름</Text>
          <Text style={styles.statValue}>{userName}</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statName}>레벨</Text>
          <Text style={styles.statValue}>{level}</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statName}>경험치</Text>
          <Text style={styles.statValue}>{gainedExpInThisLevel}/{requiredExpForNextLevel + gainedExpInThisLevel}</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statName}>승리 횟수</Text>
          <Text style={styles.statValue}>{winCount}</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statName}>연속 출석일</Text>
          <Text style={styles.statValue}>{consecutiveDay} 일(경험치 {weight}배)</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  profileImageContainer: {
    alignItems: 'center',
    padding: 16,
    marginBottom: 8,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  placeholder: {
    backgroundColor: '#ddd',
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoContainer: {
    padding: 16,
    marginBottom: 30,
  },
  statRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  statName: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  statValue: {
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

export default StatScreen;
