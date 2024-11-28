import React, { useEffect, useState } from 'react';
import { View, Text, Image, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native';
import axios from 'axios';
import { API_CONFIG } from '../../../ApiConfig';

const StatScreen = ({
  getLevelUpThreshold = (level) => 100 * level, // 레벨 업 경험치 계산 로직 기본값
  getRank = (level) => ({ rank: 'Unknown', image: null }), // 랭크와 이미지 계산 기본값
}) => {
  const [characterData, setCharacterData] = useState(null); // 사용자 데이터
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [error, setError] = useState(null); // 에러 상태

  // 사용자 데이터 호출 함수
  const fetchUserData = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${API_CONFIG.news}/stat`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200 && response.data.code === 'SU') {
        setCharacterData(response.data.loginUser);
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
    fetchUserData(); // 컴포넌트가 마운트될 때 사용자 데이터 가져오기
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
    level = 0,
    exp = 0,
    winCount = 0,
    userName = 'Unknown',
    profileImage = null,
  } = characterData;

  const { rank, image } = getRank(level);
  const levelUpThreshold = getLevelUpThreshold(level);

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
          <Text style={styles.statName}>Name</Text>
          <Text style={styles.statValue}>{userName}</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statName}>Level</Text>
          <Text style={styles.statValue}>{level}</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statName}>Rank</Text>
          <View style={styles.statValueContainer}>
            <Text style={styles.statValue}>{rank}</Text>
            {image && <Image source={image} style={styles.rankImage} />}
          </View>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statName}>Experience</Text>
          <Text style={styles.statValue}>
            {exp} / {levelUpThreshold}
          </Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statName}>Win Count</Text>
          <Text style={styles.statValue}>{winCount}</Text>
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
    marginBottom: 16,
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
  },
  statRow: {
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderColor: '#ddd',
  },
  statName: {
    fontSize: 16,
    color: '#333',
    flex: 1,
  },
  statValueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statValue: {
    fontSize: 16,
    color: '#333',
  },
  rankImage: {
    width: 20,
    height: 20,
    marginLeft: 10,
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
