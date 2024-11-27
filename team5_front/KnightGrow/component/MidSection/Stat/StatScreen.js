import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';

// 사용자의 스탯 정보를 받아와 표시하는 화면
const StatScreen = ({
  characterData = {},
  getLevelUpThreshold = (level) => 0,
  getRank = (level) => ({ rank: 'Unknown', image: null }),
}) => {
  const {
    level = 0,
    exp = 0,
    winCount = 0,
    userName = 'Unknown',
    profileImage = null,
  } = characterData;

  const { rank, image } = getRank(level); // 레벨에 따른 랭크와 이미지 계산
  const levelUpThreshold = getLevelUpThreshold(level); // 레벨 업 경험치 계산

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
});

export default StatScreen;
