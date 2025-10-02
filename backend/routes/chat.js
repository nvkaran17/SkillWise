import express from 'express';
import { askAI } from '../utils/ai.js';

const router = express.Router();

/**
 * POST /api/chat
 * Body: { message: string, context?: string }
 *
 * - message: user's chat message (required)
 * - context: optional extra context (e.g., short user/file summary) to give the model
 */
router.post('/', async (req, res) => {
  try {
    const { message, context } = req.body;

    if (!message || !message.toString().trim()) {
      return res.status(400).json({ error: 'Message is required' });
    }

    // Basic system persona + optional context
    const systemInstruction = `You are SkillWise's AI mentor assistant. Be helpful, concise,
provide clear explanations, ask clarifying questions if needed, and avoid hallucination.
If the user asks for code, produce runnable code blocks.`;

    // Compose a prompt string (we keep it simple and safe for current askAI helper)
    // If `context` is provided (short summary of a file or user state), include it.
    const promptParts = [
      `System: ${systemInstruction}`,
      context ? `Context: ${context}` : null,
      `User: ${message}`
    ].filter(Boolean);

    const prompt = promptParts.join('\n\n');

    // Reuse askAI helper which posts to OpenRouter and returns trimmed content
    const reply = await askAI(prompt);

    res.json({ reply });
  } catch (err) {
    console.error('❌ /api/chat error:', err.response?.data || err.message || err);
    res.status(500).json({ error: 'Failed to get response from AI' });
  }
});

export { router };
