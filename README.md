# Chitti App

React Native mobile app initialized with Expo and Firebase.

## What is included

- Expo SDK 54 project scaffold
- Firebase JS SDK installed
- Firebase init module with Auth + Firestore exports
- Environment variable template for Firebase config

## Firebase setup

1. Create a Firebase project in the Firebase Console.
2. Enable the services you need (for example Authentication and Firestore).
3. Copy `.env.example` to `.env`.
4. Fill all `EXPO_PUBLIC_FIREBASE_*` values in `.env`.

## Run locally

```bash
npm install
npm run start
```

Then press:

- `a` for Android
- `i` for iOS (macOS only)
- `w` for web

## Project structure

- `App.js` - entry UI, imports Firebase module
- `src/firebase/config.js` - Firebase app, auth, and Firestore setup
- `.env.example` - required Firebase environment variables
