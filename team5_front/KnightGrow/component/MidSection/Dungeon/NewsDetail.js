import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

// 뉴스 설명 컴포넌트

const NewsDetail = ({ news, onNext, onGoToNewsList }) => {
  return (
    <View style={styles.container}>
      <View style={styles.backButtonContainer}>
        <TouchableOpacity style={styles.backButton} onPress={onGoToNewsList}>
          <Text style={styles.buttonText}>던전 목록</Text>
        </TouchableOpacity>
      </View>
      <Text style={styles.title}>{news.newsTitle}</Text>

      <View style={styles.newsContainer}>
        <ScrollView style={styles.shortScroll}>
          <Text style={styles.newsShortText}>{news.newsShort}</Text>
        </ScrollView>
        <TouchableOpacity style={styles.quizButton} onPress={onNext}>
          <Text style={styles.buttonText}>퀴즈 풀기</Text>
        </TouchableOpacity>
      </View>
      <ScrollView style={styles.longScroll}>
        <Text style={styles.content}>{news.newsFull}</Text>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'flex-start',
  },
  backButtonContainer: {
    alignItems: 'flex-end',
    marginBottom: 1,
  },
  backButton: {
    backgroundColor: '#007bff',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  shortScroll: {
    width: '60%',
    height: 70,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#000',
    paddingHorizontal: 10,
    marginRight: 10,
    marginTop: 10,
  },
  longScroll: {
    flex: 1,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#000',
    paddingHorizontal: 10,
    marginTop: 10,
  },
  newsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  title: {
    fontSize: 26,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    borderBottomWidth: 1,
    borderColor: '#000',
    paddingBottom: 10,
    marginTop: 10,
  },
  quizButton: {
    width: '30%',
    backgroundColor: '#28a745',
    padding: 10,
    borderRadius: 5,
    marginTop: 10,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: 'bold',
  },
});

export default NewsDetail;
