import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';

interface RoleSelectionScreenProps {
  onRoleSelect: (role: 'farmer' | 'shop_owner') => void;
  onBack: () => void;
}

export const RoleSelectionScreen: React.FC<RoleSelectionScreenProps> = ({
  onRoleSelect,
  onBack,
}) => {
  const [selectedRole, setSelectedRole] = React.useState<'farmer' | 'shop_owner' | null>(null);

  const handleContinue = () => {
    if (selectedRole) {
      onRoleSelect(selectedRole);
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-gradient-to-br from-primary-50 to-primary-100">
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
            <Text className="text-lg font-semibold text-primary-800">Choose Your Role</Text>
            <View className="w-10" />
          </Animated.View>

          {/* Title */}
          <Animated.View 
            entering={FadeInUp.delay(300).duration(800)}
            className="items-center mb-12 mt-8"
          >
            <Text className="text-2xl font-bold text-primary-800 text-center mb-4">
              How will you use AgroConnect?
            </Text>
            <Text className="text-base text-primary-600 text-center leading-relaxed">
              Select your role to customize your experience
            </Text>
          </Animated.View>

          {/* Role Options */}
          <Animated.View 
            entering={FadeInDown.delay(400).duration(800)}
            className="flex-1 space-y-4"
          >
            <RoleCard
              title="I'm a Farmer"
              description="Browse and purchase agrochemicals, find nearby suppliers, and manage your orders"
              icon="👨‍🌾"
              features={[
                "Browse products and suppliers",
                "Place and track orders",
                "Find nearby shops",
                "Get farming recommendations"
              ]}
              isSelected={selectedRole === 'farmer'}
              onSelect={() => setSelectedRole('farmer')}
            />

            <RoleCard
              title="I'm a Shop Owner"
              description="Manage your inventory, receive orders from farmers, and grow your business"
              icon="🏪"
              features={[
                "Manage product inventory",
                "Receive and process orders",
                "Connect with local farmers",
                "Track sales and analytics"
              ]}
              isSelected={selectedRole === 'shop_owner'}
              onSelect={() => setSelectedRole('shop_owner')}
            />
          </Animated.View>

          {/* Continue Button */}
          <Animated.View 
            entering={FadeInDown.delay(600).duration(800)}
            className="mt-8"
          >
            <Button
              title="Continue"
              onPress={handleContinue}
              size="lg"
              disabled={!selectedRole}
              className={`${!selectedRole ? 'opacity-50' : ''}`}
            />
          </Animated.View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

interface RoleCardProps {
  title: string;
  description: string;
  icon: string;
  features: string[];
  isSelected: boolean;
  onSelect: () => void;
}

const RoleCard: React.FC<RoleCardProps> = ({
  title,
  description,
  icon,
  features,
  isSelected,
  onSelect,
}) => {
  return (
    <TouchableOpacity onPress={onSelect} className="mb-4">
      <Card 
        className={`p-6 ${
          isSelected 
            ? 'border-2 border-primary-500 bg-primary-50' 
            : 'border border-neutral-200 bg-white'
        }`}
      >
        <View className="flex-row items-start mb-4">
          <View className={`w-16 h-16 rounded-2xl items-center justify-center mr-4 ${
            isSelected ? 'bg-primary-100' : 'bg-neutral-100'
          }`}>
            <Text className="text-3xl">{icon}</Text>
          </View>
          
          <View className="flex-1">
            <Text className={`text-lg font-bold mb-2 ${
              isSelected ? 'text-primary-800' : 'text-neutral-800'
            }`}>
              {title}
            </Text>
            <Text className={`text-sm leading-relaxed ${
              isSelected ? 'text-primary-600' : 'text-neutral-600'
            }`}>
              {description}
            </Text>
          </View>
          
          <View className={`w-6 h-6 rounded-full border-2 items-center justify-center ${
            isSelected 
              ? 'border-primary-500 bg-primary-500' 
              : 'border-neutral-300 bg-white'
          }`}>
            {isSelected && <Text className="text-white text-xs">✓</Text>}
          </View>
        </View>

        <View className="space-y-2">
          {features.map((feature, index) => (
            <View key={index} className="flex-row items-center">
              <Text className={`mr-2 ${
                isSelected ? 'text-primary-500' : 'text-neutral-400'
              }`}>
                ✓
              </Text>
              <Text className={`text-sm ${
                isSelected ? 'text-primary-700' : 'text-neutral-600'
              }`}>
                {feature}
              </Text>
            </View>
          ))}
        </View>
      </Card>
    </TouchableOpacity>
  );
};