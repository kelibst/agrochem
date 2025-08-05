import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { Card } from '../../components/Card';

interface DevMenuScreenProps {
  onNavigate: (screen: string) => void;
  onBack: () => void;
}

export const DevMenuScreen: React.FC<DevMenuScreenProps> = ({
  onNavigate,
  onBack,
}) => {
  const screenCategories = [
    {
      title: 'Authentication Screens',
      icon: '🔐',
      screens: [
        { name: 'Welcome Screen', id: 'welcome', description: 'Landing page with app introduction' },
        { name: 'Login Screen', id: 'login', description: 'User login form' },
        { name: 'Register Screen', id: 'register', description: 'User registration form' },
        { name: 'Role Selection', id: 'role-selection', description: 'Choose farmer or shop owner' },
      ]
    },
    {
      title: 'Farmer Screens',
      icon: '👨‍🌾',
      screens: [
        { name: 'Farmer Home', id: 'farmer-home', description: 'Main dashboard for farmers' },
        { name: 'Product Browse', id: 'product-browse', description: 'Browse and search products' },
        { name: 'Product Details', id: 'product-details', description: 'Detailed product view' },
        { name: 'Cart Screen', id: 'cart', description: 'Shopping cart and checkout' },
        { name: 'Orders Screen', id: 'farmer-orders', description: 'Order history and tracking' },
        { name: 'Shop Finder', id: 'shop-finder', description: 'Find nearby shops with map' },
        { name: 'Messages', id: 'farmer-messages', description: 'Chat with shop owners' },
        { name: 'Profile', id: 'farmer-profile', description: 'Farmer profile management' },
      ]
    },
    {
      title: 'Shop Owner Screens',
      icon: '🏪',
      screens: [
        { name: 'Shop Dashboard', id: 'shop-dashboard', description: 'Main dashboard for shop owners' },
        { name: 'Inventory Management', id: 'inventory', description: 'Product inventory management' },
        { name: 'Add/Edit Product', id: 'product-form', description: 'Add or edit products' },
        { name: 'Order Management', id: 'shop-orders', description: 'Manage incoming orders' },
        { name: 'Analytics', id: 'analytics', description: 'Sales analytics and reports' },
        { name: 'Shop Profile', id: 'shop-profile', description: 'Shop information and settings' },
        { name: 'Customer Messages', id: 'shop-messages', description: 'Chat with customers' },
      ]
    },
    {
      title: 'Shared Screens',
      icon: '🔄',
      screens: [
        { name: 'Settings', id: 'settings', description: 'App settings and preferences' },
        { name: 'Notifications', id: 'notifications', description: 'Push notifications center' },
        { name: 'Help & Support', id: 'help', description: 'Help documentation and support' },
        { name: 'About', id: 'about', description: 'App information and credits' },
      ]
    },
    {
      title: 'Component Showcase',
      icon: '🧩',
      screens: [
        { name: 'Button Variants', id: 'button-showcase', description: 'All button styles and states' },
        { name: 'Card Components', id: 'card-showcase', description: 'Different card layouts' },
        { name: 'Input Components', id: 'input-showcase', description: 'Form inputs and validation' },
        { name: 'Color Palette', id: 'color-palette', description: 'App color scheme' },
        { name: 'Typography', id: 'typography', description: 'Text styles and fonts' },
        { name: 'Icons & Emojis', id: 'icons', description: 'Icon library showcase' },
      ]
    }
  ];

  return (
    <SafeAreaView className="flex-1 bg-neutral-50">
      {/* Header */}
      <Animated.View 
        entering={FadeInUp.delay(200).duration(800)}
        className="px-6 pt-4 pb-6 bg-white"
      >
        <View className="flex-row items-center justify-between mb-4">
          <TouchableOpacity onPress={onBack} className="p-2 -ml-2">
            <Text className="text-2xl">←</Text>
          </TouchableOpacity>
          <Text className="text-lg font-semibold text-primary-800">Developer Menu</Text>
          <View className="w-10" />
        </View>

        <View className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl p-4">
          <Text className="text-white text-lg font-semibold mb-2">🚀 AgroConnect Prototype</Text>
          <Text className="text-primary-100 text-sm">
            Navigate to any screen in the app for development and testing
          </Text>
        </View>
      </Animated.View>

      {/* Screen Categories */}
      <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
        {screenCategories.map((category, categoryIndex) => (
          <Animated.View
            key={category.title}
            entering={FadeInDown.delay(300 + categoryIndex * 100).duration(600)}
            className="mb-6"
          >
            <View className="flex-row items-center mb-4">
              <Text className="text-2xl mr-3">{category.icon}</Text>
              <Text className="text-lg font-bold text-neutral-800">{category.title}</Text>
            </View>

            {category.screens.map((screen, screenIndex) => (
              <Animated.View
                key={screen.id}
                entering={FadeInDown.delay(400 + categoryIndex * 100 + screenIndex * 50).duration(600)}
                className="mb-3"
              >
                <Card onPress={() => onNavigate(screen.id)}>
                  <View className="flex-row items-center justify-between">
                    <View className="flex-1">
                      <Text className="text-base font-semibold text-neutral-800 mb-1">
                        {screen.name}
                      </Text>
                      <Text className="text-sm text-neutral-600">
                        {screen.description}
                      </Text>
                    </View>
                    <Text className="text-primary-600 text-xl ml-4">→</Text>
                  </View>
                </Card>
              </Animated.View>
            ))}
          </Animated.View>
        ))}

        {/* App Info */}
        <Animated.View 
          entering={FadeInDown.delay(800).duration(800)}
          className="mb-8"
        >
          <Card className="bg-primary-50 border border-primary-200">
            <View className="items-center">
              <Text className="text-4xl mb-3">🌱</Text>
              <Text className="text-lg font-bold text-primary-800 mb-2">
                AgroConnect v1.0.0
              </Text>
              <Text className="text-sm text-primary-600 text-center">
                Beautiful prototype showcasing the complete agrochemical marketplace experience
              </Text>
            </View>
          </Card>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
};