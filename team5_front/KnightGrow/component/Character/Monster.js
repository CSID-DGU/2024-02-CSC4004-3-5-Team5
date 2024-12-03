import React from 'react';
import { Image, StyleSheet } from 'react-native';

const Monster = ({ state }) => {
  // 상태에 따라 이미지 변경
  const source = {
    standing: require('./monster/monster.png'),
    hit: require('./monster/monster_hit.gif'),
  }[state || 'standing']; // 기본값은 'standing'

  return (
    <Image
      source={source}
      style={styles.monster}
    />
  );
};

const styles = StyleSheet.create({
  monster: {
    width: 100,
    height: 100,
  },
});

export default Monster;
