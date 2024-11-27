import React, { useState, useContext } from 'react';
import { View, StyleSheet, Modal, Text } from 'react-native';
import TopSection from './TopSection/TopSection';
import DungeonScreen from './MidSection/Dungeon/DungeonScreen';
import RankingScreen from './MidSection/Ranking/RankingScreen';
import StatScreen from './MidSection/Stat/StatScreen';
import ChatBotScreen from './MidSection/chatbot/ChatBotScreen';
import Button from './Footer/Button';
import { AppContext } from '../AppContext';


const Main = ({ route }) => {
  const [middleContent, setMiddleContent] = useState('랭킹'); // 중간화면 상태 관리 (기본 상태 ; 랭킹)
  const [isChatBotVisible, setIsChatBotVisible] = useState(false);
  const { answeredQuestions } = useContext(AppContext);
  // 로그인 시 전달받은 사용자 데이터
  const userData = route.params?.user || {};

  // 중간 화면 상태 업데이트
  const updateMiddleContent = (content) => {
    if (content === '챗봇') {
      setIsChatBotVisible(true);
    } else {
      setMiddleContent(content);
    }
  };

  // 챗봇 팝업 닫기
  const closeChatBot = () => {
    setIsChatBotVisible(false);
  };

  // 중간 화면 렌더링
  const renderMiddleContent = () => {
    switch (middleContent) {
      case '던전':
        return <DungeonScreen userID={userData.userID} />;
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
      <TopSection style={styles.top} resizeMode="cover" />
      <View style={styles.header}>
        <Text style={styles.headerText}>{middleContent}</Text>
      </View>
      <View style={styles.middle}>{renderMiddleContent()}</View>
      <Button style={styles.bottom} updateContent={updateMiddleContent} />

      {/* 챗봇 팝업 구현 */}
      <Modal
        animationType="fade"
        transparent={true}
        visible={isChatBotVisible}
        onRequestClose={closeChatBot}
      >
        <View style={styles.modalBackground}>
          <View style={styles.chatBotContainer}>
            <ChatBotScreen onClose={closeChatBot} />
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'space-between',
    width: '100%',
  },
  top: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    padding: 15,
    backgroundColor: '#F5F5DC',
    alignItems: 'center',
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
  },
  middle: {
    flex: 1.5,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  bottom: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    backgroundColor: '#007bff',
  },
  modalBackground: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  chatBotContainer: {
    width: '80%',
    height: '70%',
    backgroundColor: '#D3D3A3',
    borderRadius: 10,
    padding: 10,
  },
});

export default Main;
