import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { Button } from '../../components/Button';
import { Logo } from '../../components/Logo';
import { useTheme } from '../../context/ThemeContext';

interface WelcomeScreenProps {
  onLogin: () => void;
  onRegister: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onLogin,
  onRegister,
}) => {
  const { theme } = useTheme();
  
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <ScrollView className="flex-1" contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 px-6 justify-center">
          {/* Logo and Header */}
          <Animated.View 
            entering={FadeInUp.delay(200).duration(800)}
            className="items-center mb-12"
          >
            <View className="mb-6">
              <Logo width={96} height={96} />
            </View>
            <Text style={{ fontSize: 30, fontWeight: 'bold', color: theme.text, textAlign: 'center', marginBottom: 8 }}>
              AgroConnect
            </Text>
            <Text style={{ fontSize: 18, color: theme.textSecondary, textAlign: 'center', lineHeight: 26 }}>
              Connecting farmers with agrochemical suppliers for a sustainable future
            </Text>
          </Animated.View>

          {/* Features */}
          {/* <Animated.View 
            entering={FadeInUp.delay(400).duration(800)}
            className="mb-12"
          >
            <View className="space-y-4">
              <FeatureItem 
                icon="🛒"
                title="Easy Shopping"
                description="Browse and purchase agrochemicals with ease"
              />
              <FeatureItem 
                icon="📍"
                title="Find Nearby Shops"
                description="Locate suppliers in your area instantly"
              />
              <FeatureItem 
                icon="🚚"
                title="Track Orders"
                description="Monitor your deliveries in real-time"
              />
              <FeatureItem 
                icon="💬"
                title="Direct Communication"
                description="Chat directly with shop owners"
              />
            </View>
          </Animated.View> */}

          {/* Action Buttons */}
          <Animated.View 
            entering={FadeInDown.delay(600).duration(800)}
            className="space-y-4"
          >
            <Button
              title="Get Started"
              onPress={onRegister}
              size="lg"
              className="shadow-lg"
            />
            <Button
              title="I already have an account"
              onPress={onLogin}
              variant="ghost"
              size="lg"
            />
          </Animated.View>

          {/* Footer */}
          <Animated.View 
            entering={FadeInUp.delay(800).duration(800)}
            className="mt-8 items-center"
          >
            <Text style={{ fontSize: 14, color: theme.textTertiary, textAlign: 'center' }}>
              By continuing, you agree to our Terms of Service and Privacy Policy
            </Text>
          </Animated.View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

interface FeatureItemProps {
  icon: string;
  title: string;
  description: string;
}

const FeatureItem: React.FC<FeatureItemProps> = ({ icon, title, description }) => {
  const { theme } = useTheme();
  
  return (
    <View style={{ 
      flexDirection: 'row', 
      alignItems: 'center', 
      padding: 16, 
      backgroundColor: theme.surface, 
      borderRadius: 16,
      marginVertical: 4 
    }}>
      <View style={{ 
        width: 48, 
        height: 48, 
        backgroundColor: theme.primaryContainer, 
        borderRadius: 12, 
        alignItems: 'center', 
        justifyContent: 'center', 
        marginRight: 16 
      }}>
        <Text style={{ fontSize: 20 }}>{icon}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <Text style={{ fontSize: 18, fontWeight: '600', color: theme.text, marginBottom: 4 }}>{title}</Text>
        <Text style={{ fontSize: 14, color: theme.textSecondary }}>{description}</Text>
      </View>
    </View>
  );
};