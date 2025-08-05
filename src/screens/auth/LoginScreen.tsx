import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';

interface LoginScreenProps {
  onLogin: (email: string, password: string) => void;
  onForgotPassword: () => void;
  onRegister: () => void;
  onBack: () => void;
}

export const LoginScreen: React.FC<LoginScreenProps> = ({
  onLogin,
  onForgotPassword,
  onRegister,
  onBack,
}) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{email?: string; password?: string}>({});

  const validateForm = () => {
    const newErrors: {email?: string; password?: string} = {};
    
    if (!email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!password) {
      newErrors.password = 'Password is required';
    } else if (password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleLogin = () => {
    if (validateForm()) {
      onLogin(email, password);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1" contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 px-6">
          {/* Header */}
          <Animated.View 
            entering={FadeInUp.delay(200).duration(800)}
            className="flex-row items-center justify-between py-4"
          >
            <TouchableOpacity onPress={onBack} className="p-2">
              <Text className="text-2xl">←</Text>
            </TouchableOpacity>
            <Text className="text-lg font-semibold text-primary-800">Sign In</Text>
            <View className="w-10" />
          </Animated.View>

          {/* Logo */}
          <Animated.View 
            entering={FadeInUp.delay(300).duration(800)}
            className="items-center mb-8 mt-8"
          >
            <View className="w-20 h-20 bg-primary-600 rounded-2xl items-center justify-center mb-4">
              <Text className="text-3xl">🌱</Text>
            </View>
            <Text className="text-2xl font-bold text-primary-800 mb-2">Welcome Back</Text>
            <Text className="text-base text-neutral-600 text-center">
              Sign in to continue to AgroConnect
            </Text>
          </Animated.View>

          {/* Form */}
          <Animated.View 
            entering={FadeInDown.delay(400).duration(800)}
            className="flex-1"
          >
            <Input
              label="Email Address"
              value={email}
              onChangeText={setEmail}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
              error={errors.email}
              icon={<Text className="text-neutral-400">📧</Text>}
            />

            <Input
              label="Password"
              value={password}
              onChangeText={setPassword}
              placeholder="Enter your password"
              secureTextEntry={!showPassword}
              error={errors.password}
              icon={<Text className="text-neutral-400">🔒</Text>}
              rightIcon={<Text className="text-neutral-400">{showPassword ? '👁️' : '👁️‍🗨️'}</Text>}
              onRightIconPress={() => setShowPassword(!showPassword)}
            />

            <TouchableOpacity onPress={onForgotPassword} className="mb-6">
              <Text className="text-primary-600 font-medium text-right">
                Forgot Password?
              </Text>
            </TouchableOpacity>

            <Button
              title="Sign In"
              onPress={handleLogin}
              size="lg"
              className="mb-6"
            />

            <View className="flex-row items-center mb-6">
              <View className="flex-1 h-px bg-neutral-200" />
              <Text className="mx-4 text-neutral-500">or</Text>
              <View className="flex-1 h-px bg-neutral-200" />
            </View>

            <Button
              title="Sign in with Google"
              onPress={() => {}}
              variant="outline"
              size="lg"
              icon="🔍"
              className="mb-4"
            />

            <View className="flex-row justify-center">
              <Text className="text-neutral-600">Don't have an account? </Text>
              <TouchableOpacity onPress={onRegister}>
                <Text className="text-primary-600 font-medium">Sign Up</Text>
              </TouchableOpacity>
            </View>
          </Animated.View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};