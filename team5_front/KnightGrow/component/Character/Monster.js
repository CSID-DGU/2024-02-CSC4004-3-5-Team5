import React from 'react';
import { Image, StyleSheet } from 'react-native';

const Monster = ({ state }) => {
  const source = {
    standing: require('./monster/monster.gif'),
    hit: require('./monster/monster_hit.gif'),
  }[state || 'standing'];

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
