import admin from 'firebase-admin';

let firebaseApp = null;

/**
 * Initialize Firebase Admin SDK
 */
export const initializeFirebase = () => {
  try {
    // Check if already initialized
    if (firebaseApp) {
      return firebaseApp;
    }

    // Check if Firebase credentials are provided
    if (!process.env.FIREBASE_PROJECT_ID || 
        !process.env.FIREBASE_PRIVATE_KEY || 
        !process.env.FIREBASE_CLIENT_EMAIL) {
      console.log('⚠️  Firebase credentials not provided. Google Auth will be disabled.');
      return null;
    }

    // Initialize Firebase
    firebaseApp = admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, '\n'),
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      }),
    });

    console.log('✅ Firebase Admin SDK initialized');
    return firebaseApp;
  } catch (error) {
    console.error('❌ Error initializing Firebase:', error.message);
    return null;
  }
};

/**
 * Verify Firebase ID token
 */
export const verifyFirebaseToken = async (idToken) => {
  try {
    if (!firebaseApp) {
      throw new Error('Firebase not initialized');
    }

    const decodedToken = await admin.auth().verifyIdToken(idToken);
    return decodedToken;
  } catch (error) {
    throw new Error(`Firebase token verification failed: ${error.message}`);
  }
};

export default { initializeFirebase, verifyFirebaseToken };
