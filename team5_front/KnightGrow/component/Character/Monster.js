import React from 'react';
import { Image, StyleSheet } from 'react-native';

const Monster = () => {
  return (
    <Image
      source={require('./monster/monster.png')}
      style={styles.monster}
    />
  );
}

const styles = StyleSheet.create({
  monster: {
    width: 100,
    height: 100,
  },
});

export default Monster;