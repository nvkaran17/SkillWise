import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

export async function askAI(prompt) {
  try {
    const response = await axios.post(
      'https://openrouter.ai/api/v1/chat/completions',
      {
        model: 'openai/gpt-3.5-turbo',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.7,
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          'Content-Type': 'application/json',
        }
      }
    );

    return response.data.choices[0].message.content.trim();
  } catch (error) {
    console.error('AI API Error:', error.response?.data || error.message);
    throw error;
  }
}
