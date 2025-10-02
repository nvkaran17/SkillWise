// Minimal Vercel serverless function for testing
export default function handler(req, res) {
  console.log('Function called:', req.method, req.url);
  
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
  
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }
  
  res.status(200).json({
    message: 'SkillWise API is running! 🚀',
    timestamp: new Date().toISOString(),
    method: req.method,
    url: req.url,
    env: process.env.NODE_ENV || 'production',
    hasFirebase: !!process.env.FIREBASE_PROJECT_ID
  });
}