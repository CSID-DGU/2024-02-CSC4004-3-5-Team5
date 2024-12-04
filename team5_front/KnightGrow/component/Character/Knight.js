import React from 'react';
import { Image, StyleSheet } from 'react-native';

const Knight = ({ state }) => {
  const source = {
    standing: require('./knight/standing.gif'),
    attacking: require('./knight/attack.gif'),
  }[state || 'standing'];

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
