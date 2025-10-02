import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();
const router = express.Router();

const OPENROUTER_URL = "https://openrouter.ai/api/v1/chat/completions";

router.post('/generate', async (req, res) => {
  const { topic, numQuestions = 10, difficulty = 'mid' } = req.body;

  // Map short difficulty to full names
  const difficultyLabel = {
    ez: 'easy',
    mid: 'medium',
    tuff: 'hard'
  }[difficulty] || 'medium';

  const prompt = `
You are an expert quiz generator. Generate ${numQuestions} unique and challenging multiple-choice questions on the topic "${topic}" with "${difficultyLabel}" difficulty.

Use this exact JSON format:
[
  {
    "question": "Your question here?",
    "options": ["Option A", "Option B", "Option C", "Option D"],
    "answer": 2 // index of correct option (0 to 3)
  }
]

Rules:
- Make sure difficulty matches "${difficultyLabel}" level.
- Do NOT return any explanation, commentary, or markdown.
- Ensure the questions are varied and not repetitive.
- Randomize the content to avoid repetition across calls.
`;

  try {
    const response = await fetch(OPENROUTER_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${process.env.OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "openai/gpt-3.5-turbo",
        messages: [{ role: "user", content: prompt }],
        temperature: 0.9
      })
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("❌ OpenRouter API error:", err);
      return res.status(response.status).json({ error: "OpenRouter request failed" });
    }

    const data = await response.json();
    const aiText = data.choices[0].message.content.trim();

    let quiz;
    try {
      quiz = JSON.parse(aiText);
    } catch (parseError) {
      console.error('❌ Failed to parse JSON:', aiText);
      return res.status(400).json({ success: false, error: 'Failed to parse quiz from AI' });
    }

    res.json({ success: true, quiz });
  } catch (error) {
    console.error('❌ Error generating quiz:', error.response?.data || error.message);
    res.status(500).json({ success: false, error: 'Quiz generation failed' });
  }
});

export { router };

