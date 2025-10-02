import firebaseAdmin from '../firebaseAdmin.js';

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
    
    if (!firebaseAdmin) {
      console.log('❌ Firebase Admin not initialized');
      return res.status(500).json({ error: 'Server configuration error: Firebase not initialized' });
    }
    
    const decodedToken = await firebaseAdmin.auth().verifyIdToken(idToken);
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