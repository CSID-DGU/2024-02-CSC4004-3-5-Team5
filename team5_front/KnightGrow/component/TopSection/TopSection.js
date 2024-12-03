import React, { useState, useRef, useEffect } from 'react';
import { View, Animated, StyleSheet, ImageBackground } from 'react-native';
import Knight from '../Character/Knight';
import Monster from '../Character/Monster';

const TopSection = ({
  triggerDungeonAnimation,
  triggerResetAnimation,
  triggerAttack,
  resetMonsterTrigger, // 몬스터를 다시 나타내는 트리거 추가
}) => {
  const zoomValue = useRef(new Animated.Value(1)).current;
  const opacityValue = useRef(new Animated.Value(1)).current;
  const knightPosition = useRef(new Animated.Value(0)).current;
  const monsterOpacity = useRef(new Animated.Value(1)).current;
  const [knightState, setKnightState] = useState('standing');
  const [monsterState, setMonsterState] = useState('standing');
  const [backgroundImage, setBackgroundImage] = useState(require('./backgroundImage/background1.png'));
  const [currentBackground, setCurrentBackground] = useState('default');

  // 던전 진입 애니메이션
  useEffect(() => {
    if (triggerDungeonAnimation) {
      Animated.sequence([
        Animated.timing(zoomValue, {
          toValue: 1.2,
          duration: 300,
          useNativeDriver: false,
        }),
        Animated.timing(opacityValue, {
          toValue: 0,
          duration: 300,
          useNativeDriver: false,
        }),
      ]).start(() => {
        setBackgroundImage(require('./backgroundImage/background2.png'));
        setCurrentBackground('dungeon');
        Animated.sequence([
          Animated.timing(opacityValue, {
            toValue: 1,
            duration: 300,
            useNativeDriver: false,
          }),
          Animated.timing(zoomValue, {
            toValue: 1,
            duration: 300,
            useNativeDriver: false,
          }),
        ]).start();
      });
    }
  }, [triggerDungeonAnimation]);

  // 초기화 애니메이션
  useEffect(() => {
    if (triggerResetAnimation && currentBackground !== 'default') {
      Animated.timing(opacityValue, {
        toValue: 0,
        duration: 300,
        useNativeDriver: false,
      }).start(() => {
        setBackgroundImage(require('./backgroundImage/background1.png'));
        setCurrentBackground('default');
        Animated.timing(opacityValue, {
          toValue: 1,
          duration: 300,
          useNativeDriver: false,
        }).start();
      });
    }
  }, [triggerResetAnimation, currentBackground]);

  // 공격 애니메이션
  useEffect(() => {
    if (triggerAttack && currentBackground === 'dungeon') {
      setKnightState('attacking');
      Animated.timing(knightPosition, {
        toValue: 100,
        duration: 500,
        useNativeDriver: true,
      }).start(() => {
        setMonsterState('hit');
        setTimeout(() => {
          Animated.timing(monsterOpacity, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }).start();
        }, 500);
        setTimeout(() => {
          setKnightState('standing');
          Animated.timing(knightPosition, {
            toValue: 0,
            duration: 500,
            useNativeDriver: true,
          }).start();
        }, 1500);
      });
    }
  }, [triggerAttack, currentBackground]);

  // 몬스터를 다시 등장시키는 트리거
  useEffect(() => {
    if (resetMonsterTrigger) {
      setMonsterState('standing'); // 몬스터를 다시 등장 상태로 설정
      Animated.timing(monsterOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      }).start(() => {
        console.log('Monster reappeared');
      });
    }
  }, [resetMonsterTrigger]);
  

  return (
    <Animated.View
      style={[
        styles.container,
        {
          transform: [{ scale: zoomValue }],
          opacity: opacityValue,
        },
      ]}
    >
      <ImageBackground source={backgroundImage} style={styles.background} resizeMode="cover">
        <View style={styles.characterContainer}>
          {currentBackground === 'default' ? (
            <View style={styles.knightCenter}>
              <Knight state={knightState} />
            </View>
          ) : (
            <>
              <Animated.View
                style={[
                  styles.knightLeft,
                  { transform: [{ translateX: knightPosition }] },
                ]}
              >
                <Knight state={knightState} />
              </Animated.View>
              <Animated.View
                style={[
                  styles.monsterRight,
                  { opacity: monsterOpacity },
                ]}
              >
                <Monster state={monsterState} />
              </Animated.View>
            </>
          )}
        </View>
      </ImageBackground>
    </Animated.View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
  },
  background: {
    width: '100%',
    height: '100%',
  },
  characterContainer: {
    position: 'absolute',
    bottom: 50,
    width: '100%',
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  knightCenter: {
    justifyContent: 'center',
    alignItems: 'center',
    flex: 1,
  },
  knightLeft: {
    flex: 1,
    justifyContent: 'flex-start',
    alignItems: 'center',
    paddingLeft: 20,
  },
  monsterRight: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingRight: 20,
  },
});

export default TopSection;
