import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';

// Load environment variables first
dotenv.config();

const app = express();

// Add error handling for imports
let fileRoutes, quizRoutes, chatRoutes, healthRouter, verifyFirebaseToken;

try {
  console.log('Loading routes and middleware...');
  
  const fileModule = await import('../routes/file.js');
  fileRoutes = fileModule.router;
  
  const quizModule = await import('../routes/quiz.js');
  quizRoutes = quizModule.router;
  
  const chatModule = await import('../routes/chat.js');
  chatRoutes = chatModule.router;
  
  const healthModule = await import('../routes/health.js');
  healthRouter = healthModule.healthRouter;
  
  const authModule = await import('../middleware/auth.js');
  verifyFirebaseToken = authModule.verifyFirebaseToken;
  
  console.log('✅ All modules loaded successfully');
} catch (error) {
  console.error('❌ Error loading modules:', error);
  // Continue without erroring out completely
}

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

// Mount routes only if they loaded successfully
if (healthRouter) {
  app.use('/health', healthRouter);
  console.log('✅ Health route mounted');
}

if (verifyFirebaseToken && quizRoutes) {
  app.use('/api/quiz', verifyFirebaseToken, quizRoutes);
  console.log('✅ Quiz routes mounted');
}

if (verifyFirebaseToken && fileRoutes) {
  app.use('/api/file', verifyFirebaseToken, fileRoutes);
  console.log('✅ File routes mounted');
}

if (verifyFirebaseToken && chatRoutes) {
  app.use('/api/chat', verifyFirebaseToken, chatRoutes);
  console.log('✅ Chat routes mounted');
}

// Add a debug route to check environment
app.get('/debug', (req, res) => {
  res.json({
    message: 'Debug info',
    env: {
      NODE_ENV: process.env.NODE_ENV,
      hasFirebaseProjectId: !!process.env.FIREBASE_PROJECT_ID,
      hasOpenAI: !!process.env.OPENROUTER_API_KEY,
      moduleStatus: {
        healthRouter: !!healthRouter,
        fileRoutes: !!fileRoutes,
        quizRoutes: !!quizRoutes,
        chatRoutes: !!chatRoutes,
        verifyFirebaseToken: !!verifyFirebaseToken
      }
    }
  });
});

// Export the Express app as a serverless function for Vercel
export default app;
