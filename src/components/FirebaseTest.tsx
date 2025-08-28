import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { checkFirebaseConfig } from '@/config/firebase';

export const FirebaseTest: React.FC = () => {
  const { theme, styles } = useTheme();
  const { isAuthenticated, user } = useAuth();
  const [firebaseStatus, setFirebaseStatus] = useState<{
    isConfigured: boolean;
    services: {
      auth: boolean;
      firestore: boolean;
      storage: boolean;
      messaging: boolean;
    };
  } | null>(null);

  useEffect(() => {
    const testFirebase = async () => {
      try {
        const status = await checkFirebaseConfig();
        setFirebaseStatus(status);
        console.log('🔥 Firebase status check completed:', status);
      } catch (error) {
        console.error('🔥 Firebase test failed:', error);
        setFirebaseStatus({
          isConfigured: false,
          services: {
            auth: false,
            firestore: false,
            storage: false,
            messaging: false,
          }
        });
      }
    };

    testFirebase();
  }, []);

  return (
    <View style={[styles.surface, { padding: 16, margin: 16, borderRadius: 8 }]}>
      <Text style={[styles.text, { fontSize: 18, fontWeight: 'bold', marginBottom: 12 }]}>
        🔥 Firebase Status
      </Text>
      
      {firebaseStatus ? (
        <View>
          <Text style={[styles.text, { marginBottom: 8 }]}>
            Overall Status: {firebaseStatus.isConfigured ? '✅ Configured' : '❌ Not Configured'}
          </Text>
          
          <Text style={[styles.text, { marginBottom: 4 }]}>
            🔐 Auth: {firebaseStatus.services.auth ? '✅' : '❌'}
          </Text>
          
          <Text style={[styles.text, { marginBottom: 4 }]}>
            💾 Firestore: {firebaseStatus.services.firestore ? '✅' : '❌'}
          </Text>
          
          <Text style={[styles.text, { marginBottom: 4 }]}>
            📁 Storage: {firebaseStatus.services.storage ? '✅' : '❌'}
          </Text>
          
          <Text style={[styles.text, { marginBottom: 12 }]}>
            📱 Messaging: {firebaseStatus.services.messaging ? '✅' : '❌'}
          </Text>
          
          <Text style={[styles.textSecondary, { fontSize: 14 }]}>
            Auth Status: {isAuthenticated ? `✅ Authenticated (${user?.email})` : '❌ Not Authenticated'}
          </Text>
        </View>
      ) : (
        <Text style={styles.textSecondary}>Loading Firebase status...</Text>
      )}
      
      <Text style={[styles.textTertiary, { fontSize: 12, marginTop: 12 }]}>
        Note: Some services may show as not configured until you set up Firebase console and add configuration files.
      </Text>
    </View>
  );
};