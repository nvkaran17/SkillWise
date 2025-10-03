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
  
  try {
    const fileModule = await import('../routes/file.js');
    fileRoutes = fileModule.router;
    console.log('✅ File routes loaded');
  } catch (err) {
    console.error('❌ Failed to load file routes:', err.message);
  }
  
  try {
    const quizModule = await import('../routes/quiz.js');
    quizRoutes = quizModule.router;
    console.log('✅ Quiz routes loaded');
  } catch (err) {
    console.error('❌ Failed to load quiz routes:', err.message);
  }
  
  try {
    const chatModule = await import('../routes/chat.js');
    chatRoutes = chatModule.router;
    console.log('✅ Chat routes loaded');
  } catch (err) {
    console.error('❌ Failed to load chat routes:', err.message);
  }
  
  try {
    const healthModule = await import('../routes/health.js');
    healthRouter = healthModule.healthRouter;
    console.log('✅ Health routes loaded');
  } catch (err) {
    console.error('❌ Failed to load health routes:', err.message);
  }
  
  try {
    const authModule = await import('../middleware/auth.js');
    verifyFirebaseToken = authModule.verifyFirebaseToken;
    console.log('✅ Auth middleware loaded');
  } catch (err) {
    console.error('❌ Failed to load auth middleware:', err.message);
  }
  
  console.log('🔄 Module loading completed');
} catch (error) {
  console.error('❌ Fatal error during module loading:', error);
}

// Configure CORS for both development and production
const allowedOrigins = [
  'http://localhost:5173',
  'http://localhost:3000',
  'https://skill-wise-eight.vercel.app',
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

// Add simple routes directly in the main app
app.get('/health', (req, res) => {
  res.json({ 
    ok: true, 
    time: new Date().toISOString(), 
    uptime: process.uptime(),
    message: 'Health check successful'
  });
});

app.get('/status', (req, res) => {
  res.json({
    status: 'online',
    service: 'SkillWise API',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Add simple test routes for debugging
app.get('/api/test', (req, res) => {
  res.json({ message: 'API test route working', timestamp: new Date().toISOString() });
});

app.post('/api/test', (req, res) => {
  res.json({ message: 'API POST test route working', body: req.body, timestamp: new Date().toISOString() });
});

// Test route for file endpoints (no auth required)
app.get('/api/file/test', (req, res) => {
  res.json({ 
    message: 'File routes are working!', 
    timestamp: new Date().toISOString(),
    uploadDirectory: process.env.VERCEL ? '/tmp' : 'uploads/'
  });
});

// Mount other routes only if they loaded successfully
if (healthRouter) {
  console.log('✅ Health router available (using direct route instead)');
}

// Mount routes - make them work even if Firebase fails
if (quizRoutes) {
  if (verifyFirebaseToken) {
    app.use('/api/quiz', verifyFirebaseToken, quizRoutes);
    console.log('✅ Quiz routes mounted with auth');
  } else {
    app.use('/api/quiz', quizRoutes);
    console.log('⚠️ Quiz routes mounted WITHOUT auth (Firebase failed)');
  }
}

if (fileRoutes) {
  if (verifyFirebaseToken) {
    app.use('/api/file', verifyFirebaseToken, fileRoutes);
    console.log('✅ File routes mounted with auth');
  } else {
    app.use('/api/file', fileRoutes);
    console.log('⚠️ File routes mounted WITHOUT auth (Firebase failed)');
  }
}

if (chatRoutes) {
  if (verifyFirebaseToken) {
    app.use('/api/chat', verifyFirebaseToken, chatRoutes);
    console.log('✅ Chat routes mounted with auth');
  } else {
    app.use('/api/chat', chatRoutes);
    console.log('⚠️ Chat routes mounted WITHOUT auth (Firebase failed)');
  }
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
export default (req, res) => {
  // Add some basic logging
  console.log(`${req.method} ${req.url}`);
  
  // Handle the request with Express
  return app(req, res);
};
