import admin from "firebase-admin";
import { readFileSync } from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

try {
  // Load your service account key
  const serviceAccount = JSON.parse(
    readFileSync(path.join(__dirname, "../skillwise1-98828-firebase-adminsdk-fbsvc-a850dcf0bf.json"))
  );

  // Initialize Firebase Admin if not already initialized
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
    console.log('✅ Firebase Admin initialized successfully');
  }
} catch (error) {
  console.error('❌ Error initializing Firebase Admin:', error);
  process.exit(1);
}

export const verifyFirebaseToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;
    console.log('Auth Header:', authHeader); // Debug log

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      console.log('❌ No Bearer token found in header');
      return res.status(401).json({ error: 'Unauthorized: No token provided' });
    }

    const idToken = authHeader.split('Bearer ')[1];
    if (!idToken) {
      console.log('❌ Token is empty after Bearer');
      return res.status(401).json({ error: 'Unauthorized: Empty token' });
    }

    console.log('🔑 Attempting to verify token...');
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    console.log('✅ Token verified successfully');
    
    req.user = decodedToken;
    next();
  } catch (error) {
    console.error('❌ Error verifying Firebase token:', error);
    console.error('Error details:', {
      name: error.name,
      message: error.message,
      code: error.code,
    });
    return res.status(403).json({ 
      error: 'Unauthorized: Invalid token',
      details: error.message
    });
  }
};