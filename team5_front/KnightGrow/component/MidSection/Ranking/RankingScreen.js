import React from 'react';
import { View, Text, FlatList, StyleSheet, Image } from 'react-native';

// TODO: 백엔드에서 랭킹 데이터를 받아와 출력

const RankingScreen = ({ characterData }) => {
  // 임시 랭킹 데이터
  const rankingData = [
    { id: 1, name: '임영준', score: 1500 },
    { id: 2, name: '안성현', score: 1200 },
    { id: 3, name: '이제혁', score: 1000 },
    { id: 4, name: '장준혁', score: 800 },
    { id: 5, name: '류창선', score: 700 },
  ];

  // 캐릭터 데이터를 추가
  if (characterData) {
    const { name, stats } = characterData;
    rankingData.push({ id: rankingData.length + 1, name, score: stats.totalIntelligence });
  }

  // 랭킹 데이터 정렬
  rankingData.sort((a, b) => b.score - a.score);

  // 메달 이미지 경로
  const medalImages = [
    require('./image/class_6.png'),
    require('./image/class_5.png'),
    require('./image/class_4.png'),
  ];

  // 개별 랭킹 항목 렌더링
  const renderItem = ({ item, index }) => (
    <View style={[styles.rankItem, index < 3 ? styles.topRank : null]}>
      {index < 3 ? (
        <Image source={medalImages[index]} style={styles.medalImage} />
      ) : (
        <Text style={styles.rankIndex}>{index + 1}위</Text>
      )}
      <Text style={styles.rankName}>{item.name}</Text>
      <Text style={styles.rankScore}>{item.score}점</Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <FlatList
        data={rankingData}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
    padding: 16,
    width: '100%'
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
});

export default RankingScreen;

