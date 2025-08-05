import React from 'react';
import { View, Text, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { Button } from '../../components/Button';

interface WelcomeScreenProps {
  onLogin: () => void;
  onRegister: () => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({
  onLogin,
  onRegister,
}) => {
  return (
    <SafeAreaView className="flex-1 bg-gradient-to-br from-primary-50 to-primary-100">
      <ScrollView className="flex-1" contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 px-6 justify-center">
          {/* Logo and Header */}
          <Animated.View 
            entering={FadeInUp.delay(200).duration(800)}
            className="items-center mb-12"
          >
            <View className="w-24 h-24 bg-primary-600 rounded-3xl items-center justify-center mb-6 shadow-lg">
              <Text className="text-4xl">🌱</Text>
            </View>
            <Text className="text-3xl font-bold text-primary-800 text-center mb-2">
              AgroConnect
            </Text>
            <Text className="text-lg text-primary-600 text-center leading-relaxed">
              Connecting farmers with agrochemical suppliers for a sustainable future
            </Text>
          </Animated.View>

          {/* Features */}
          <Animated.View 
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
          </Animated.View>

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
            <Text className="text-sm text-primary-500 text-center">
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

const FeatureItem: React.FC<FeatureItemProps> = ({ icon, title, description }) => (
  <View className="flex-row items-center p-4 bg-white/50 rounded-2xl">
    <View className="w-12 h-12 bg-primary-100 rounded-xl items-center justify-center mr-4">
      <Text className="text-xl">{icon}</Text>
    </View>
    <View className="flex-1">
      <Text className="text-lg font-semibold text-primary-800 mb-1">{title}</Text>
      <Text className="text-sm text-primary-600">{description}</Text>
    </View>
  </View>
);