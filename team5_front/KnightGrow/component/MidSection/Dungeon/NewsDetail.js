import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Modal } from 'react-native';
import ChatBotScreen from '../chatbot/ChatBotScreen';

const NewsDetail = ({ news, onNext, onGoToNewsList }) => {
  const [isModalVisible, setModalVisible] = useState(false); // NewsDetail Modal 상태
  const [isChatBotVisible, setChatBotVisible] = useState(false); // ChatBot Modal 상태

  const handleOpenModal = () => {
    setModalVisible(true);
  };

  const handleCloseModal = () => {
    setModalVisible(false);
  };

  const handleOpenChatBot = () => {
    setChatBotVisible(true);
  };

  const handleCloseChatBot = () => {
    setChatBotVisible(false);
  };

  return (
    <View style={styles.container}>
      {/* 헤더 영역 */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backButton} onPress={onGoToNewsList}>
          <Text style={styles.buttonText}>← 던전 목록</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.quizButton} onPress={onNext}>
          <Text style={styles.buttonText}>퀴즈 풀기</Text>
        </TouchableOpacity>
      </View>

      {/* 뉴스 제목 */}
      <Text style={styles.title}>{news.newsTitle}</Text>
      {/* 뉴스 요약 및 전체 내용 */}
      <ScrollView style={styles.contentContainer}>
        <TouchableOpacity onPress={handleOpenModal}>
          {/* 뉴스 요약 섹션 */}
          <View style={styles.section}>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <Text style={styles.sectionTitle}>기사 요약</Text>
              <Text style={styles.clickToViewText}>(클릭하여 전체보기)</Text>
            </View>
            <View style={styles.separator} />
            <View style={styles.newsShortContainer}>
              <Text style={styles.newsShortText}>{news.newsShort}</Text>
            </View>
          </View>

          {/* 뉴스 전문 섹션 */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>전체 기사</Text>
            <View style={styles.separator} />
            <Text style={styles.newsFullText}>{news.newsFull}</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>

      {/* 뉴스 세부내용 Modal */}
      <Modal
        visible={isModalVisible}
        animationType="slide"
        transparent={true}
        onRequestClose={handleCloseModal}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <ScrollView>
              <Text style={styles.modalTitle}>기사 요약</Text>
              <Text style={styles.modalText}>{news.newsShort}</Text>
              <Text style={styles.modalTitle}>전체 기사</Text>
              <Text style={styles.modalText}>{news.newsFull}</Text>
            </ScrollView>
            <View style={styles.modalButtonContainer}>
              <TouchableOpacity style={styles.modalCloseButton} onPress={handleCloseModal}>
                <Text style={styles.modalCloseButtonText}>닫기</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.modalFairyButton} onPress={handleOpenChatBot}>
                <Text style={styles.modalFairyButtonText}>요정</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* 요정 Modal */}
      <Modal
        visible={isChatBotVisible}
        transparent={true}
        onRequestClose={handleCloseChatBot}
      >
        <View style={styles.chatBotModalContainer}>
          <ChatBotScreen onClose={handleCloseChatBot} />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    padding: 20,
  },
  newsShortContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    justifyContent: 'flex-start',
  },
  clickToViewText: {
    fontSize: 14,
    color: '#999',
    marginLeft: 5,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  backButton: {
    backgroundColor: '#007bff',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  quizButton: {
    backgroundColor: '#28a745',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    borderBottomWidth: 1,
    borderColor: '#ddd',
    paddingBottom: 10,
  },
  contentContainer: {
    flex: 1,
    padding: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#444',
    marginBottom: 10,
  },
  separator: {
    height: 1,
    backgroundColor: '#ddd',
    marginBottom: 10,
  },
  newsShortText: {
    fontSize: 16,
    marginBottom: 10,
    color: '#555',
    lineHeight: 22,
  },
  newsFullText: {
    fontSize: 16,
    marginTop: 10,
    color: '#333',
    lineHeight: 22,
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 0.8,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 100,

  },
  modalContent: {
    width: '90%',
    backgroundColor: '#fff',
    padding: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: "black",
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    color: '#555',
    lineHeight: 22,
    marginTop: 20,
    marginBottom: 20,
  },
  modalButtonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 20,
  },
  modalCloseButton: {
    backgroundColor: '#007bff',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    flex: 1,
    marginRight: 10,
  },
  modalCloseButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalFairyButton: {
    backgroundColor: '#28a745',
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    flex: 1,
  },
  modalFairyButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  chatBotModalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
});

export default NewsDetail;
