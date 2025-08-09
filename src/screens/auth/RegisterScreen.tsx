import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Logo } from '../../components/Logo';
import { useTheme } from '../../context/ThemeContext';

interface RegisterScreenProps {
  onRegister: (data: RegisterData) => void;
  onLogin: () => void;
  onBack: () => void;
}

interface RegisterData {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
}

export const RegisterScreen: React.FC<RegisterScreenProps> = ({
  onRegister,
  onLogin,
  onBack,
}) => {
  const { theme } = useTheme();
  const [formData, setFormData] = useState<RegisterData>({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Partial<RegisterData>>({});

  const updateField = (field: keyof RegisterData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = () => {
    const newErrors: Partial<RegisterData> = {};
    
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Full name is required';
    }
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.phone) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\+?[\d\s-()]+$/.test(formData.phone)) {
      newErrors.phone = 'Phone number is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'Please confirm your password';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = () => {
    if (validateForm()) {
      onRegister(formData);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        <View className="flex-1 px-6">
          {/* Header */}
          <Animated.View 
            entering={FadeInUp.delay(200).duration(800)}
            className="flex-row items-center justify-between py-4"
          >
            <TouchableOpacity onPress={onBack} className="p-2">
              <Text style={{ fontSize: 24, color: theme.text }}>←</Text>
            </TouchableOpacity>
            <Text style={{ fontSize: 18, fontWeight: '600', color: theme.text }}>Create Account</Text>
            <View className="w-10" />
          </Animated.View>

          {/* Logo */}
          <Animated.View 
            entering={FadeInUp.delay(300).duration(800)}
            className="items-center mb-8"
          >
            <View className="mb-4">
              <Logo width={80} height={80} />
            </View>
            <Text style={{ fontSize: 24, fontWeight: 'bold', color: theme.text, marginBottom: 8 }}>Join AgroConnect</Text>
            <Text style={{ fontSize: 16, color: theme.textSecondary, textAlign: 'center' }}>
              Create your account to get started
            </Text>
          </Animated.View>

          {/* Form */}
          <Animated.View 
            entering={FadeInDown.delay(400).duration(800)}
            className="pb-8"
          >
            <Input
              label="Full Name"
              value={formData.fullName}
              onChangeText={(value) => updateField('fullName', value)}
              placeholder="Enter your full name"
              error={errors.fullName}
              icon={<Text className="text-neutral-400">👤</Text>}
            />

            <Input
              label="Email Address"
              value={formData.email}
              onChangeText={(value) => updateField('email', value)}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
              error={errors.email}
              icon={<Text className="text-neutral-400">📧</Text>}
            />

            <Input
              label="Phone Number"
              value={formData.phone}
              onChangeText={(value) => updateField('phone', value)}
              placeholder="Enter your phone number"
              keyboardType="phone-pad"
              error={errors.phone}
              icon={<Text className="text-neutral-400">📱</Text>}
            />

            <Input
              label="Password"
              value={formData.password}
              onChangeText={(value) => updateField('password', value)}
              placeholder="Create a password"
              secureTextEntry={!showPassword}
              error={errors.password}
              icon={<Text className="text-neutral-400">🔒</Text>}
              rightIcon={<Text className="text-neutral-400">{showPassword ? '👁️' : '👁️‍🗨️'}</Text>}
              onRightIconPress={() => setShowPassword(!showPassword)}
            />

            <Input
              label="Confirm Password"
              value={formData.confirmPassword}
              onChangeText={(value) => updateField('confirmPassword', value)}
              placeholder="Confirm your password"
              secureTextEntry={!showConfirmPassword}
              error={errors.confirmPassword}
              icon={<Text className="text-neutral-400">🔒</Text>}
              rightIcon={<Text className="text-neutral-400">{showConfirmPassword ? '👁️' : '👁️‍🗨️'}</Text>}
              onRightIconPress={() => setShowConfirmPassword(!showConfirmPassword)}
            />

            <Button
              title="Create Account"
              onPress={handleRegister}
              size="lg"
              className="mb-6"
            />

            <View className="flex-row items-center mb-6">
              <View className="flex-1 h-px bg-neutral-200" />
              <Text className="mx-4 text-neutral-500">or</Text>
              <View className="flex-1 h-px bg-neutral-200" />
            </View>

            <Button
              title="Sign up with Google"
              onPress={() => {}}
              variant="outline"
              size="lg"
              icon="🔍"
              className="mb-6"
            />

            <View className="flex-row justify-center">
              <Text className="text-neutral-600">Already have an account? </Text>
              <TouchableOpacity onPress={onLogin}>
                <Text className="text-primary-600 font-medium">Sign In</Text>
              </TouchableOpacity>
            </View>

            <Text className="text-xs text-neutral-500 text-center mt-6 leading-relaxed">
              By creating an account, you agree to our Terms of Service and Privacy Policy
            </Text>
          </Animated.View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};