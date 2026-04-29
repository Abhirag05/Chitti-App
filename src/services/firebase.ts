import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import * as FirebaseAuth from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ENV from '@src/config/env';

const firebaseConfig = {
  apiKey: ENV.FIREBASE_API_KEY,
  authDomain: ENV.FIREBASE_AUTH_DOMAIN,
  projectId: ENV.FIREBASE_PROJECT_ID,
  storageBucket: ENV.FIREBASE_STORAGE_BUCKET,
  messagingSenderId: ENV.FIREBASE_MESSAGING_SENDER_ID,
  appId: ENV.FIREBASE_APP_ID,
};

// Debug logs for production tracking
if (__DEV__) {
  // eslint-disable-next-line no-console
  console.log('[Firebase] Initializing with config:', {
    ...firebaseConfig,
    apiKey: firebaseConfig.apiKey ? '***' : 'MISSING',
  });
}

let app: FirebaseApp | null = null;
try {
  if (firebaseConfig.apiKey) {
    app = getApps().length ? getApp() : initializeApp(firebaseConfig);
  } else {
    console.error('[Firebase] Error: Firebase API Key is missing.');
  }
} catch (error) {
  console.error('[Firebase] Initialization Error:', error);
}

const { getAuth, initializeAuth } = FirebaseAuth;
const getReactNativePersistence =
  (FirebaseAuth as unknown as { getReactNativePersistence?: (storage: unknown) => unknown })
    .getReactNativePersistence;

let auth: FirebaseAuth.Auth | null = null;
if (app) {
  try {
    if (getReactNativePersistence) {
      auth = initializeAuth(app, {
        persistence: getReactNativePersistence(AsyncStorage) as FirebaseAuth.Persistence,
      });
    } else {
      auth = getAuth(app);
    }
  } catch (_error: unknown) {
    // If auth is already initialized (fast refresh), fall back to existing instance.
    auth = getAuth(app);
  }
}
const db = app ? getFirestore(app) : null;

export class FirebaseService {
  public app = app;
  public auth = auth;
  public db = db;

  constructor() {}
}

export default new FirebaseService();
