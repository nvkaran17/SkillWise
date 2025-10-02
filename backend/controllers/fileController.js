import pdfParse from 'pdf-parse';
import { askAI } from '../utils/ai.js';

// This will hold the latest file's content in memory
let extractedText = '';

export const uploadFile = async (req, res) => {
  try {
    const dataBuffer = req.file.buffer;
    const pdfData = await pdfParse(dataBuffer);
    extractedText = pdfData.text;
    res.json({ success: true, message: 'File processed successfully' });
  } catch (err) {
    console.error('❌ PDF Parsing Error:', err.message);
    res.status(500).json({ success: false, error: 'Failed to extract text' });
  }
};

export const askFromFile = async (req, res) => {
  const { question } = req.body;

  if (!extractedText) {
    return res.status(400).json({ success: false, error: 'No file uploaded or parsed yet' });
  }

  const prompt = `You are an expert assistant. Use the following text to answer the question.

Text:
${extractedText.slice(0, 3000)}  <!-- prevent token overflow -->

Question: ${question}`;

  try {
    const answer = await askAI([{ role: 'user', content: prompt }]);
    res.json({ success: true, answer });
  } catch (err) {
    console.error('❌ AI Error:', err.message);
    res.status(500).json({ success: false, error: 'Failed to get answer' });
  }
};
