import "../global.css";
import { Slot } from "expo-router";
import { useEffect, useState } from 'react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { ThemeProvider } from '../context/ThemeContext';
import { AuthProvider } from '../context/AuthContext';
import { NotificationProvider } from '../context/NotificationContext';
import { ThemedStatusBar } from '../components/ThemedStatusBar';
import { NotificationContainer } from '../components/NotificationContainer';
import { initializeFirebase, checkFirebaseConfig } from '../config/firebase';

export default function Layout() {
  const [isFirebaseReady, setIsFirebaseReady] = useState(false);

  useEffect(() => {
    const setupFirebase = async () => {
      try {
        const initialized = await initializeFirebase();
        if (initialized) {
          const config = await checkFirebaseConfig();
          console.log('Firebase configuration status:', config);
        }
        setIsFirebaseReady(true);
      } catch (error) {
        console.error('Firebase setup failed:', error);
        setIsFirebaseReady(true); // Continue even if Firebase fails
      }
    };

    setupFirebase();
  }, []);

  // You could show a loading screen here while Firebase initializes
  // For now, we'll continue rendering even if Firebase isn't ready
  
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <ThemeProvider>
        <NotificationProvider>
          <AuthProvider>
            <ThemedStatusBar />
            <Slot />
            <NotificationContainer />
          </AuthProvider>
        </NotificationProvider>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
