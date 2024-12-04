import React, { useContext, useState, useEffect } from 'react';
import { View, StyleSheet, Modal, Text, BackHandler, Alert } from 'react-native';
import { BattleContext } from '../BattleContext';
import TopSection from './TopSection/TopSection';
import RankingScreen from './MidSection/Ranking/RankingScreen';
import StatScreen from './MidSection/Stat/StatScreen';
import ChatBotScreen from './MidSection/chatbot/ChatBotScreen';
import Button from './Footer/Button';
import DungeonScreen from './MidSection/Dungeon/DungeonScreen';

const Main = ({ route }) => {
  const { triggerAttackAnimation } = useContext(BattleContext);
  const userData = route?.params?.user || {};
  const [middleContent, setMiddleContent] = useState('랭킹');
  const [isChatBotVisible, setIsChatBotVisible] = useState(false);
  const [triggerDungeonAnimation, setTriggerDungeonAnimation] = useState(false);
  const [triggerResetAnimation, setTriggerResetAnimation] = useState(false);
  const [resetMonsterTrigger, setResetMonsterTrigger] = useState(false);
  useEffect(() => {
    const backAction = () => {
      Alert.alert('게임 종료', '정말로 게임을 종료하시겠습니까?', [
        { text: '취소', onPress: () => null, style: 'cancel' },
        { text: '확인', onPress: () => BackHandler.exitApp() },
      ]);
      return true;
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

    return () => backHandler.remove();
  }, []);

  const updateMiddleContent = (content) => {
    if (content === '요정') {
      setIsChatBotVisible(true);
    } else {
      setMiddleContent(content);
      if (content === '던전') {
        setTriggerDungeonAnimation(true);
        setTimeout(() => setTriggerDungeonAnimation(false), 300);
      } else {
        setTriggerResetAnimation(true);
        setTimeout(() => setTriggerResetAnimation(false), 300);
      }
    }
  };

  const renderMiddleContent = () => {
    switch (middleContent) {
      case '던전':
        return <DungeonScreen userID={userData.userID}
          setResetMonsterTrigger={setResetMonsterTrigger}
          triggerAttackAnimation={triggerAttackAnimation}
        />;
      case '랭킹':
        return <RankingScreen />;
      case '스텟':
        return <StatScreen characterData={userData} />;
      default:
        return <RankingScreen />;
    }
  };

  return (
    <View style={styles.container}>
      <TopSection
        triggerDungeonAnimation={triggerDungeonAnimation}
        triggerResetAnimation={triggerResetAnimation}
        triggerAttack={triggerAttackAnimation}
        resetMonsterTrigger={resetMonsterTrigger}
      />
      <View style={styles.header}>
        <Text style={styles.headerText}>{middleContent}</Text>
      </View>
      <View style={styles.middle}>{renderMiddleContent()}</View>
      <Button style={styles.bottom} updateContent={updateMiddleContent} />
      <Modal
        transparent={true}
        visible={isChatBotVisible}
        onRequestClose={() => setIsChatBotVisible(false)}
      >
        <View style={styles.modalBackground}>
          <ChatBotScreen onClose={() => setIsChatBotVisible(false)} />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    width: '100%'
  },
  header: {
    padding: 15,
    backgroundColor: '#F5F5DC',
    alignItems: 'center'
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold'
  },
  middle: {
    flex: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white'
  },
  bottom: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    backgroundColor: '#007bff'
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)'
  },
});

export default Main;
