import admin from 'firebase-admin';
import fs from 'fs';
import dotenv from 'dotenv';
dotenv.config();

let firebaseAdmin = null;
const saPath = process.env.FIREBASE_ADMIN_KEY_PATH || './firebase-adminsdk.json';

try {
  if (fs.existsSync(saPath)) {
    const serviceAccount = JSON.parse(fs.readFileSync(saPath, 'utf8'));
    if (!admin.apps.length) {
      admin.initializeApp({ credential: admin.credential.cert(serviceAccount) });
    }
    firebaseAdmin = admin;
    console.log('✅ Firebase Admin initialized.');
  } else {
    console.warn(`⚠️ Firebase service account not found at: ${saPath}. Running without admin (dev mode).`);
  }
} catch (error) {
  console.error('❌ Error initializing Firebase Admin:', error);
  // keep firebaseAdmin null so middleware can fallback
}

export default firebaseAdmin;
