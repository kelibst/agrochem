# Environment Setup

## Security Notice
This project now uses environment variables to store sensitive configuration data like API keys. **Never commit `.env` files to version control.**

## Setup Instructions

### 1. Environment Configuration
1. Copy the example environment file:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` with your actual Firebase configuration:
   ```bash
   # Firebase Configuration
   EXPO_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key_here
   EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
   EXPO_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
   EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.firebasestorage.app
   EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
   EXPO_PUBLIC_FIREBASE_APP_ID=your_app_id
   ```

### 2. Getting Firebase Configuration
1. Go to your [Firebase Console](https://console.firebase.google.com)
2. Select your project
3. Go to Project Settings (⚙️ icon)
4. In the "Your apps" section, find your app
5. Copy the configuration values to your `.env` file

### 3. Security Best Practices
- ✅ `.env` files are ignored by git (listed in `.gitignore`)
- ✅ Use `.env.example` as a template for new developers
- ✅ Never commit actual API keys or secrets
- ❌ Don't share `.env` files via chat, email, or other channels
- ❌ Don't hardcode API keys directly in source code

### 4. Development Workflow
After setting up your `.env` file, you can run the development server as usual:
```bash
npm start
```

The app will automatically load the environment variables and use them for Firebase configuration.

## Important Security Notes

⚠️ **API Key Rotation Required**: The Firebase API keys in this project were previously committed to version control. For production use, you should:

1. **Rotate your Firebase API keys:**
   - Go to Firebase Console > Project Settings > General tab
   - In the "Your apps" section, regenerate your Web API key
   - Update your `.env` file with the new keys
   
2. **Review Firebase Security Rules:**
   - Ensure your Firestore and Storage security rules are properly configured
   - Don't rely solely on API key secrecy for security

3. **Monitor Usage:**
   - Check Firebase Console for any unusual activity
   - Set up billing alerts if using paid Firebase features

## Troubleshooting

### Environment Variables Not Loading
- Ensure your `.env` file is in the project root directory
- Restart the Expo development server after changing environment variables
- Check that variable names start with `EXPO_PUBLIC_` for client-side access

### Firebase Connection Issues
- Verify all environment variables are set correctly
- Check Firebase Console to ensure your project is active
- Confirm your app's bundle ID matches Firebase configuration