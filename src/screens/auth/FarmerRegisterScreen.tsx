import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { Logo } from '../../components/Logo';
import { useTheme } from '../../context/ThemeContext';
import { CreateFarmerProfileData } from '@/types/firebase';

interface FarmerRegisterScreenProps {
  onRegister: (data: RegisterData) => void;
  onLogin: () => void;
  onBack: () => void;
}

interface RegisterData {
  email: string;
  password: string;
  confirmPassword: string;
  userData: CreateFarmerProfileData;
}

interface FormData {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  farmName: string;
  address: string;
  farmSize: string;
  experienceYears: string;
}

export const FarmerRegisterScreen: React.FC<FarmerRegisterScreenProps> = ({
  onRegister,
  onLogin,
  onBack,
}) => {
  const { theme } = useTheme();
  const [formData, setFormData] = useState<FormData>({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    farmName: '',
    address: '',
    farmSize: '',
    experienceYears: '',
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<Partial<FormData>>({});

  const updateField = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const validateForm = () => {
    const newErrors: Partial<FormData> = {};
    
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

    if (!formData.address.trim()) {
      newErrors.address = 'Address is required';
    }

    if (formData.farmSize && isNaN(Number(formData.farmSize))) {
      newErrors.farmSize = 'Farm size must be a number';
    }

    if (formData.experienceYears && isNaN(Number(formData.experienceYears))) {
      newErrors.experienceYears = 'Experience must be a number';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = () => {
    if (validateForm()) {
      const userData: CreateFarmerProfileData = {
        email: formData.email,
        role: 'farmer',
        profile: {
          name: formData.fullName,
          phone: formData.phone,
          address: formData.address,
          farmName: formData.farmName || undefined,
          farmSize: formData.farmSize ? Number(formData.farmSize) : undefined,
          experienceYears: formData.experienceYears ? Number(formData.experienceYears) : undefined,
        }
      };

      onRegister({
        email: formData.email,
        password: formData.password,
        confirmPassword: formData.confirmPassword,
        userData,
      });
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
            <Text style={{ fontSize: 18, fontWeight: '600', color: theme.text }}>Farmer Registration</Text>
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
            <Text style={{ fontSize: 24, fontWeight: 'bold', color: theme.text, marginBottom: 8 }}>Join as a Farmer</Text>
            <Text style={{ fontSize: 16, color: theme.textSecondary, textAlign: 'center' }}>
              Connect with suppliers and grow your business
            </Text>
          </Animated.View>

          {/* Form */}
          <Animated.View 
            entering={FadeInDown.delay(400).duration(800)}
            className="pb-8"
          >
            <Input
              label="Full Name *"
              value={formData.fullName}
              onChangeText={(value) => updateField('fullName', value)}
              placeholder="Enter your full name"
              error={errors.fullName}
              icon={<Text className="text-neutral-400">👤</Text>}
            />

            <Input
              label="Email Address *"
              value={formData.email}
              onChangeText={(value) => updateField('email', value)}
              placeholder="Enter your email"
              keyboardType="email-address"
              autoCapitalize="none"
              error={errors.email}
              icon={<Text className="text-neutral-400">📧</Text>}
            />

            <Input
              label="Phone Number *"
              value={formData.phone}
              onChangeText={(value) => updateField('phone', value)}
              placeholder="Enter your phone number"
              keyboardType="phone-pad"
              error={errors.phone}
              icon={<Text className="text-neutral-400">📱</Text>}
            />

            <Input
              label="Farm Address *"
              value={formData.address}
              onChangeText={(value) => updateField('address', value)}
              placeholder="Enter your farm address"
              error={errors.address}
              icon={<Text className="text-neutral-400">📍</Text>}
            />

            <Input
              label="Farm Name"
              value={formData.farmName}
              onChangeText={(value) => updateField('farmName', value)}
              placeholder="Enter your farm name (optional)"
              icon={<Text className="text-neutral-400">🚜</Text>}
            />

            <Input
              label="Farm Size (acres)"
              value={formData.farmSize}
              onChangeText={(value) => updateField('farmSize', value)}
              placeholder="Enter farm size in acres (optional)"
              keyboardType="numeric"
              error={errors.farmSize}
              icon={<Text className="text-neutral-400">📏</Text>}
            />

            <Input
              label="Years of Experience"
              value={formData.experienceYears}
              onChangeText={(value) => updateField('experienceYears', value)}
              placeholder="Years in farming (optional)"
              keyboardType="numeric"
              error={errors.experienceYears}
              icon={<Text className="text-neutral-400">📅</Text>}
            />

            <Input
              label="Password *"
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
              label="Confirm Password *"
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
              title="Create Farmer Account"
              onPress={handleRegister}
              size="lg"
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