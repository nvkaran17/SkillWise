import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

import { router as fileRoutes } from './routes/file.js';
import { router as quizRoutes } from './routes/quiz.js';
import { router as chatRoutes } from './routes/chat.js';
import { healthRouter } from './routes/health.js';
import { verifyFirebaseToken } from './middleware/auth.js';

dotenv.config();
const app = express();

app.use(cors({
  origin: [process.env.VITE_FRONTEND_ORIGIN || 'http://localhost:5173'],
  methods: ['GET','POST','PUT','PATCH','DELETE','OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
}));
app.use(express.json());

app.use('/health', healthRouter);

// Mount routes with token verification middleware
app.use('/api/quiz', verifyFirebaseToken, quizRoutes);
app.use('/api/file', verifyFirebaseToken, fileRoutes);
app.use('/api/chat', verifyFirebaseToken, chatRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
