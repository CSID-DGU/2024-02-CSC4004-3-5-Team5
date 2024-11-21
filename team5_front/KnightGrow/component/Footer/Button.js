import React, { useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';

const Button = ({ updateContent }) => {
  const [selectedButton, setSelectedButton] = useState('랭킹');

  const handleButtonPress = (buttonName) => {
    if (buttonName === '챗봇') {
      updateContent(buttonName);
      return;
    }

    if (selectedButton !== buttonName) {
      setSelectedButton(buttonName);
      updateContent(buttonName);
    }
  };

  const getButtonStyle = (buttonName) => {
    return selectedButton === buttonName
      ? { backgroundColor: '#555' }  // 선택된 버튼 색
      : { backgroundColor: '#ccc' }; // 기본 버튼 색
  };

  const getTextStyle = (buttonName) => {
    return selectedButton === buttonName
      ? { color: 'white' }   // 선택된 버튼 글자 색
      : { color: 'black' };  // 선택되지 않은 버튼 글자 색
  };

  return (
    <View style={styles.bottom}>
      {['던전', '랭킹', '스텟', '챗봇'].map((buttonName) => (
        <TouchableOpacity
          key={buttonName}
          onPress={() => handleButtonPress(buttonName)}
          style={[styles.button, getButtonStyle(buttonName)]}
          disabled={selectedButton === buttonName && buttonName !== '챗봇'}
        >
          <Text style={[styles.buttonText, getTextStyle(buttonName)]}>
            {buttonName}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  bottom: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    padding: 10,
    backgroundColor: '#ccc',
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 0,
    flex: 1,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Button;
