# Step 2: Authentication System - Complete Setup Guide

## Overview
A production-grade authentication system with Email/Password and Google Sign-In using Firebase, React Hook Form, and Zod validation.

---

## 📁 Files Created

### 1. **Types & Validation**
- `src/types/auth.ts` - Auth interface definitions
- `src/utils/validators/authValidators.ts` - Zod validation schemas

### 2. **Services Layer**
- `src/services/authService.ts` - Firebase auth operations (updated)
- `src/services/userProfileService.ts` - Firestore user profile CRUD

### 3. **Context & State Management**
- `src/context/AuthContext.tsx` - Auth provider with full state + hooks (updated)

### 4. **Components**
- `src/components/auth/SocialLoginButton.tsx` - Reusable social login button
- `src/components/auth/PasswordInput.tsx` - Password field with show/hide toggle

### 5. **Screens**
- `src/screens/auth/LoginScreen.tsx` - Email/password + Google login
- `src/screens/auth/RegisterScreen.tsx` - Email registration with validation
- `src/screens/auth/ForgotPasswordScreen.tsx` - Password reset flow
- `src/screens/home/DashboardScreen.tsx` - Authenticated user dashboard

### 6. **Navigation**
- `src/navigation/index.tsx` - Auth/App stack with conditional routing (updated)
- `tsconfig.json` - Added path aliases (updated)

---

## 🔧 Installation & Setup

### Step 1: Install Dependencies
All required packages are already installed in package.json. Verify with:
```bash
npm list
```

Key dependencies:
- ✅ `firebase` - Backend
- ✅ `react-hook-form` - Form handling
- ✅ `zod` - Validation
- ✅ `@react-native-google-signin/google-signin` - Google login
- ✅ `@react-navigation/native` - Navigation

### Step 2: Update App.tsx
Make sure AuthProvider wraps your navigation:

```typescript
import { AuthProvider } from '@context/AuthContext';
import AppNavigation from '@navigation';

export default function App() {
  return (
    <AuthProvider>
      <AppNavigation />
    </AuthProvider>
  );
}
```

### Step 3: Enable Firebase Services

#### Email/Password Authentication
1. Firebase Console → Authentication → Sign-in method
2. Click **Email/Password**
3. Toggle **Enable**
4. Click **Save**

#### Firestore Database
1. Firebase Console → Firestore Database
2. Click **Create Database**
3. Select region
4. Start in **Test mode** (for development)

#### Firestore Rules (Test Mode)
```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /{document=**} {
      allow read, write: if request.auth != null;
    }
  }
}
```

### Step 4: Setup Google Sign-In

#### Get Web Client ID
1. Google Cloud Console: https://console.cloud.google.com
2. Select project: `chitti-app-ebb83`
3. **APIs & Services** → **Credentials**
4. Find **Web application** OAuth 2.0 Client ID
5. Copy the **Client ID**

#### Configure in App (Advanced)
For production, integrate `@react-native-google-signin/google-signin`:

```typescript
import { GoogleSignin } from '@react-native-google-signin/google-signin';

GoogleSignin.configure({
  webClientId: 'YOUR_WEB_CLIENT_ID.apps.googleusercontent.com',
});

// Then use:
const { idToken } = await GoogleSignin.signIn();
await loginWithGoogle(idToken);
```

---

## 🎯 Features Implemented

### ✅ Authentication Screens
- **LoginScreen**
  - Email/password login
  - Google sign-in button
  - Forgot password link
  - Redirect to register
  
- **RegisterScreen**
  - Full name input
  - Email registration
  - Password with strength hints
  - Password confirmation
  - Validation feedback

- **ForgotPasswordScreen**
  - Email-based password reset
  - Success confirmation
  - Back to login navigation

### ✅ Auth Methods
1. **Email/Password Login** - `login(email, password)`
2. **Email/Password Register** - `register(fullName, email, password)`
3. **Google Login** - `loginWithGoogle(idToken)`
4. **Password Reset** - `resetPassword(email)`
5. **Logout** - `logout()`

### ✅ Validation (Zod Schemas)
- Email format validation
- Password strength (8+ chars, uppercase, number)
- Confirm password matching
- Required field validation
- User-friendly error messages

### ✅ Firestore Integration
- Auto-create user profile on first login
- Store: fullName, email, authProvider, photoURL, role, timestamps
- Update lastLoginAt on each login
- Support for both email and Google auth

### ✅ Auth State Management
- Context-based auth store
- User profile data caching
- Error handling and display
- Loading states for all operations
- `useAuth()` hook for easy access

### ✅ Route Protection
- Conditional navigation: Auth Stack ↔ App Stack
- Initialized check before rendering
- Persistent session handling via Firebase auth

### ✅ UX Features
- Loading indicators on buttons
- Clear error messages
- Password visibility toggle
- Keyboard-safe layouts
- Success feedback screens
- Smooth transitions between screens
- Disabled buttons while loading

---

## 🚀 Usage Example

```typescript
import { useAuth } from '@context/AuthContext';

function MyComponent() {
  const { 
    user,           // Current Firebase user
    userProfile,    // Firestore user profile
    loading,        // Loading state
    error,          // Error message
    login,          // Login function
    register,       // Register function
    logout,         // Logout function
    clearError,     // Clear error state
  } = useAuth();

  const handleLogin = async () => {
    try {
      await login({ email: 'user@example.com', password: 'Pass123!' });
    } catch (err) {
      console.error('Login failed');
    }
  };

  return (
    // Use auth state in your component
  );
}
```

---

## 📋 Firestore Schema

### users/{userId}
```json
{
  "uid": "firebase-uid",
  "fullName": "John Doe",
  "email": "john@example.com",
  "photoURL": "https://...", // optional
  "authProvider": "email|google",
  "role": "user|admin",
  "createdAt": 1704067200000,
  "lastLoginAt": 1704067200000
}
```

---

## ⚙️ Configuration

### Environment Variables (.env)
Already configured in your `.env` file:
```
EXPO_PUBLIC_FIREBASE_API_KEY=...
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=...
EXPO_PUBLIC_FIREBASE_PROJECT_ID=chitti-app-ebb83
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=...
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=...
EXPO_PUBLIC_FIREBASE_APP_ID=...
EXPO_PUBLIC_FIREBASE_MEASUREMENT_ID=G-HP4XES79LZ
```

---

## 🧪 Testing Checklist

- [ ] App starts and shows LoginScreen
- [ ] Register new user with valid data
- [ ] Verify user profile created in Firestore
- [ ] Login with registered email/password
- [ ] Dashboard shows user name and email
- [ ] Logout clears session and returns to LoginScreen
- [ ] Test validation errors (invalid email, weak password, mismatched passwords)
- [ ] Test forgot password flow
- [ ] Test password visibility toggle
- [ ] Test error messages display correctly
- [ ] Test Google login button (configure with real Client ID)

---

## 📱 Navigation Flow

```
Initial App
    ↓
[Initialized?]
    ├─ Yes → [Authenticated?]
    │         ├─ Yes → Dashboard (App Stack)
    │         └─ No → LoginScreen (Auth Stack)
    └─ No → AppLoader (Splash)

Auth Stack:
  LoginScreen → Register/ForgotPassword
  RegisterScreen → Back to Login
  ForgotPasswordScreen → Back to Login

App Stack:
  Dashboard → Logout → LoginScreen
```

---

## 🔒 Security Notes

1. **Firebase Rules** - Use appropriate rules based on your needs
2. **Password Requirements** - Enforce strong passwords
3. **Error Messages** - Don't reveal specific user details
4. **Session Management** - Firebase handles session persistence
5. **Google Client ID** - Keep secure, use for web only

---

## 🎨 Theme Integration

All components use the existing theme system:
- Colors from `theme/colors.ts`
- Spacing from `theme/spacing.ts`
- Typography from `theme/typography.ts`
- Border radius: `sm: 6px, md: 10px, lg: 14px`

---

## 📚 Next Steps

**What's Ready:**
✅ Complete authentication system  
✅ Email/Password login  
✅ Google Sign-In setup  
✅ Firestore profiles  
✅ Route protection  

**Not Included (for Step 3+):**
- Dashboard features
- Loan management
- User profile management
- Additional screens

---

## 🐛 Troubleshooting

### Google Login Not Working
- Verify Web Client ID is correct
- Check Firebase console → Authentication → Google provider is enabled
- Ensure `@react-native-google-signin/google-signin` is properly configured

### Firestore Errors
- Check Firestore rules allow authenticated users
- Verify database is created in correct region
- Check user has appropriate permissions

### Validation Not Working
- Ensure `react-hook-form` and `zod` are installed
- Check resolver is properly passed to useForm
- Verify Zod schema is correct

### Session Not Persisting
- Firebase auth handles persistence automatically
- Check browser/device allows AsyncStorage
- Verify Firebase is properly initialized

---

## 📞 Support References

- [Firebase Auth Docs](https://firebase.google.com/docs/auth)
- [React Hook Form](https://react-hook-form.com/)
- [Zod Validation](https://zod.dev/)
- [React Navigation](https://reactnavigation.org/)
- [Google Sign-In](https://react-native-google-signin.github.io/)
