import React from 'react';
import { View, Text, Image, StyleSheet, ScrollView } from 'react-native';


// 사용자의 스텟 정보를 백엔드에서 받아와야됨

// TODO: HP 없애고 winCount 추가

const StatScreen = ({ characterData = { stats: {} }, getLevelUpThreshold = () => 0, getRank = () => ({ rank: 'Unknown', image: null }) }) => {
  const { Level = 0, intelligence = 0, totalIntelligence = 0, HP = 0 } = characterData.stats;

  const { rank, image } = getRank(Level);
  const levelUpThreshold = getLevelUpThreshold(Level);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.profileImageContainer}>
        <Image source={characterData.profileImage} style={styles.profileImage} />
      </View>
      <View style={styles.infoContainer}>
        <View style={styles.statRow}>
          <Text style={styles.statName}>Name</Text>
          <Text style={styles.statValue}>{characterData.name || 'Unknown'}</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statName}>Level</Text>
          <Text style={styles.statValue}>{Level}</Text>
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
            {intelligence} / {levelUpThreshold}
          </Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statName}>Total Experience</Text>
          <Text style={styles.statValue}>{totalIntelligence}</Text>
        </View>
        <View style={styles.statRow}>
          <Text style={styles.statName}>HP</Text>
          <Text style={styles.statValue}>{HP}</Text>
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
    marginBottom: 0,
    marginHorizontal: 50
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
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












