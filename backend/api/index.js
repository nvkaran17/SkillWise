import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import { router as fileRoutes } from '../routes/file.js';
import { router as quizRoutes } from '../routes/quiz.js';
import { router as chatRoutes } from '../routes/chat.js';
import { healthRouter } from '../routes/health.js';
import { verifyFirebaseToken } from '../middleware/auth.js';

dotenv.config();
const app = express();

// Configure CORS for both development and production
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  process.env.VITE_FRONTEND_ORIGIN,
  process.env.FRONTEND_URL
].filter(Boolean);

app.use(cors({
  origin: allowedOrigins.length > 0 ? allowedOrigins : true,
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
  credentials: true
}));

app.use(express.json());

// Root route for Vercel deployment
app.get('/', (req, res) => {
  res.json({ 
    message: 'SkillWise API is running! 🚀',
    timestamp: new Date().toISOString(),
    env: process.env.NODE_ENV || 'development'
  });
});

app.use('/health', healthRouter);

// Mount routes with token verification middleware
app.use('/api/quiz', verifyFirebaseToken, quizRoutes);
app.use('/api/file', verifyFirebaseToken, fileRoutes);
app.use('/api/chat', verifyFirebaseToken, chatRoutes);

// Export the Express app as a serverless function for Vercel
export default app;
