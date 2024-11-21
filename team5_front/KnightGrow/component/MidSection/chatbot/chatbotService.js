// chatbot api 직접 이용하는 컴포넌트

import axios from 'axios';
import { OPENAI_API_KEY } from '@env';
console.log(OPENAI_API_KEY);
const apiEndpoint = 'https://api.openai.com/v1/chat/completions';

export const getChatGPTResponse = async (userMessage) => {
  try {
    const response = await axios.post(
      apiEndpoint,
      {
        model: 'gpt-3.5-turbo',
        messages: [{ role: 'user', content: userMessage }],
        max_tokens: 150,
      },
      {
        headers: {
          'Authorization': `Bearer ${OPENAI_API_KEY}`,
          'Content-Type': 'application/json',
        },
      }
    );
    return response.data.choices[0].message.content;
  } catch (error) {
    console.error('Error fetching GPT response:', error);
    return '죄송합니다. 문제가 발생했습니다.';
  }
};
