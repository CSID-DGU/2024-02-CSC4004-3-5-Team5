import React, { useContext } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';
import { AppContext } from '../../../AppContext';

const NewsList = ({ newsData, onSelect }) => {
  const { answeredQuestions } = useContext(AppContext);
  return (
    <ScrollView>
      <View style={styles.container}>
        {newsData.map((news) => (
          <TouchableOpacity
            key={news.id}
            style={[
              styles.newsButton,
              answeredQuestions.includes(news.id) && styles.answeredButton,
            ]}
            onPress={() => !answeredQuestions.includes(news.id) && onSelect(news)}
            disabled={answeredQuestions.includes(news.id)} // 비활성화
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
