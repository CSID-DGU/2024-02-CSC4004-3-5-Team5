import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

// TODO: Quiz.js에서 정답을 맞춘 뉴스는 비활성화 해야됨

const NewsList = ({ newsData, onSelect, answeredQuestion }) => {
  return (
    <ScrollView>
      <View style={styles.container}>
        
        {newsData.map((news) => (
          <TouchableOpacity
            key={news.id}
            style={[
              styles.newsButton,
              news.id === answeredQuestion && styles.answeredButton,
            ]}
            onPress={() => news.id !== answeredQuestion && onSelect(news)}
            disabled={news.id === answeredQuestion}
          >
            <Text style={styles.newsTitle}>{news.newsTitle}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  newsButton: {
    backgroundColor: '#D3D3A3',
    padding: 15,
    borderRadius: 5,
    marginBottom: 15,
  },
  answeredButton: {
    backgroundColor: '#A9A9A9',
  },
  newsTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    textAlign: 'center',
  },
});

export default NewsList;
