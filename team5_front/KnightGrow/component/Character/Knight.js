import React from 'react';
import { Image, StyleSheet } from 'react-native';

const Knight = ({ state }) => {
  // 상태에 따라 이미지 변경
  const source = {
    standing: require('./knight/standing.gif'),
    attacking: require('./knight/attack1.gif'),
  }[state || 'standing']; // 기본값은 'standing'

  return (
    <Image
      source={source}
      style={styles.knight}
    />
  );
};

const styles = StyleSheet.create({
  knight: {
    width: 100,
    height: 100,
  },
});

export default Knight;
