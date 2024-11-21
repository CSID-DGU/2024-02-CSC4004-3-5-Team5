import React from 'react';
import { Image, StyleSheet } from 'react-native';

const Knight= () => {
  return (
    <Image
      source={require('./knight/standing.gif')}
      style={styles.knight}
    />
  );
}

const styles = StyleSheet.create({
  knight: {
    width: 100,
    height: 100,
  },
});

export default Knight;