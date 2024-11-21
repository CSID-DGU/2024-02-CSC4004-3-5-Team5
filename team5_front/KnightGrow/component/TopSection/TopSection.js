import React from 'react';
import { View, ImageBackground, StyleSheet } from 'react-native';
import Knight from '../Character/Knight';
import Monster from '../Character/Monster';

const TopSection = () => {
  return (
    <ImageBackground
      source={require('./backgroundImage/background2.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.characterContainer}>
        <Knight />
        <Monster />
      </View>
    </ImageBackground>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  characterContainer: {
    position: 'absolute',
    width: '50%',
    bottom: 50,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },

});

export default TopSection;