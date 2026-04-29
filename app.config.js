/* eslint-disable @typescript-eslint/no-var-requires */
const dotenv = require('dotenv');
const fs = require('fs');

// load .env if present
if (fs.existsSync('.env')) {
  dotenv.config();
}

module.exports = ({ config }) => {
  return {
    ...config,
    name: 'Chitti App',
    slug: 'chitti-app',
    version: '1.0.0',
    icon: './assets/icon.png',
    splash: {
      image: './assets/splash-icon.png',
      resizeMode: 'contain',
      backgroundColor: '#ffffff',
    },
    plugins: [...(config.plugins || []), 'expo-web-browser', 'expo-font', '@react-native-community/datetimepicker'],
    android: {
      ...(config.android || {}),
      package: 'com.abhirag.chittiapp',
      adaptiveIcon: {
        foregroundImage: './assets/adaptive-icon.png',
        backgroundColor: '#ffffff',
      },
      edgeToEdgeEnabled: true,
    },
    ios: {
      ...(config.ios || {}),
      supportsTablet: true,
    },
    web: {
      ...(config.web || {}),
      favicon: './assets/favicon.png',
    },
    extra: {
      ...(config.extra || {}),
      eas: {
        projectId: process.env.EAS_PROJECT_ID || '0b93840e-fa34-430f-88d6-0039b7be74d1',
      },
      EXPO_PUBLIC_FIREBASE_API_KEY: process.env.EXPO_PUBLIC_FIREBASE_API_KEY || '',
      EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN || '',
      EXPO_PUBLIC_FIREBASE_PROJECT_ID: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID || '',
      EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET || '',
      EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '',
      EXPO_PUBLIC_FIREBASE_APP_ID: process.env.EXPO_PUBLIC_FIREBASE_APP_ID || '',
      EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID: process.env.EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID || '',
    },
  };
};
