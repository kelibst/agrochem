import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { Button } from '../../components/Button';
import { Card, ProductCard, ShopCard } from '../../components/Card';
import { Input, SearchInput } from '../../components/Input';

interface ComponentShowcaseScreenProps {
  onBack: () => void;
}

export const ComponentShowcaseScreen: React.FC<ComponentShowcaseScreenProps> = ({
  onBack,
}) => {
  const [inputValue, setInputValue] = React.useState('');
  const [searchValue, setSearchValue] = React.useState('');

  const colors = [
    { name: 'Primary', colors: ['primary-50', 'primary-100', 'primary-300', 'primary-500', 'primary-700', 'primary-900'] },
    { name: 'Secondary', colors: ['secondary-50', 'secondary-100', 'secondary-300', 'secondary-500', 'secondary-700', 'secondary-900'] },
    { name: 'Accent', colors: ['accent-50', 'accent-100', 'accent-300', 'accent-500', 'accent-700', 'accent-900'] },
    { name: 'Neutral', colors: ['neutral-50', 'neutral-100', 'neutral-300', 'neutral-500', 'neutral-700', 'neutral-900'] },
  ];

  return (
    <SafeAreaView className="flex-1 bg-neutral-50">
      {/* Header */}
      <Animated.View 
        entering={FadeInUp.delay(200).duration(800)}
        className="px-6 pt-4 pb-6 bg-white"
      >
        <View className="flex-row items-center justify-between">
          <TouchableOpacity onPress={onBack} className="p-2 -ml-2">
            <Text className="text-2xl">←</Text>
          </TouchableOpacity>
          <Text className="text-lg font-semibold text-primary-800">Component Showcase</Text>
          <View className="w-10" />
        </View>
      </Animated.View>

      <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
        {/* Buttons */}
        <Animated.View 
          entering={FadeInDown.delay(300).duration(800)}
          className="mb-8"
        >
          <Text className="text-xl font-bold text-neutral-800 mb-4">🔘 Buttons</Text>
          
          <View className="space-y-4">
            <View>
              <Text className="text-sm font-medium text-neutral-600 mb-2">Primary Buttons</Text>
              <View className="flex-row space-x-3">
                <Button title="Small" size="sm" onPress={() => {}} />
                <Button title="Medium" size="md" onPress={() => {}} />
                <Button title="Large" size="lg" onPress={() => {}} />
              </View>
            </View>

            <View>
              <Text className="text-sm font-medium text-neutral-600 mb-2">Button Variants</Text>
              <View className="space-y-2">
                <Button title="Primary Button" variant="primary" onPress={() => {}} />
                <Button title="Secondary Button" variant="secondary" onPress={() => {}} />
                <Button title="Outline Button" variant="outline" onPress={() => {}} />
                <Button title="Ghost Button" variant="ghost" onPress={() => {}} />
                <Button title="Disabled Button" disabled onPress={() => {}} />
              </View>
            </View>

            <View>
              <Text className="text-sm font-medium text-neutral-600 mb-2">Buttons with Icons</Text>
              <View className="space-y-2">
                <Button title="Add to Cart" icon="🛒" onPress={() => {}} />
                <Button title="Search" icon="🔍" variant="outline" onPress={() => {}} />
                <Button title="Message" icon="💬" variant="ghost" onPress={() => {}} />
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Inputs */}
        <Animated.View 
          entering={FadeInDown.delay(400).duration(800)}
          className="mb-8"
        >
          <Text className="text-xl font-bold text-neutral-800 mb-4">📝 Input Components</Text>
          
          <View className="space-y-4">
            <Input
              label="Default Input"
              value={inputValue}
              onChangeText={setInputValue}
              placeholder="Enter some text..."
            />
            
            <Input
              label="Input with Icon"
              value=""
              onChangeText={() => {}}
              placeholder="Email address"
              icon={<Text className="text-neutral-400">📧</Text>}
            />
            
            <Input
              label="Password Input"
              value=""
              onChangeText={() => {}}
              placeholder="Password"
              secureTextEntry
              icon={<Text className="text-neutral-400">🔒</Text>}
              rightIcon={<Text className="text-neutral-400">👁️</Text>}
            />
            
            <Input
              label="Input with Error"
              value=""
              onChangeText={() => {}}
              placeholder="This field has an error"
              error="This field is required"
            />
            
            <SearchInput
              value={searchValue}
              onChangeText={setSearchValue}
              placeholder="Search anything..."
            />
          </View>
        </Animated.View>

        {/* Cards */}
        <Animated.View 
          entering={FadeInDown.delay(500).duration(800)}
          className="mb-8"
        >
          <Text className="text-xl font-bold text-neutral-800 mb-4">🃏 Card Components</Text>
          
          <View className="space-y-4">
            <Card>
              <Text className="text-base font-medium text-neutral-800 mb-2">Default Card</Text>
              <Text className="text-sm text-neutral-600">
                This is a basic card component with default styling.
              </Text>
            </Card>
            
            <Card variant="elevated">
              <Text className="text-base font-medium text-neutral-800 mb-2">Elevated Card</Text>
              <Text className="text-sm text-neutral-600">
                This card has more prominent shadow elevation.
              </Text>
            </Card>
            
            <Card variant="outlined">
              <Text className="text-base font-medium text-neutral-800 mb-2">Outlined Card</Text>
              <Text className="text-sm text-neutral-600">
                This card uses border instead of shadow.
              </Text>
            </Card>
            
            <Card onPress={() => {}} className="bg-primary-50">
              <Text className="text-base font-medium text-primary-800 mb-2">Pressable Card</Text>
              <Text className="text-sm text-primary-600">
                This card responds to touch with animation.
              </Text>
            </Card>
          </View>
        </Animated.View>

        {/* Product & Shop Cards */}
        <Animated.View 
          entering={FadeInDown.delay(600).duration(800)}
          className="mb-8"
        >
          <Text className="text-xl font-bold text-neutral-800 mb-4">🛍️ Specialized Cards</Text>
          
          <View className="space-y-4">
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View className="flex-row">
                <ProductCard
                  title="NPK Fertilizer Premium"
                  price="GHC 45.99"
                  category="Fertilizers"
                  rating={4.8}
                  onPress={() => {}}
                  onAddToCart={() => {}}
                />
                <ProductCard
                  title="Organic Pesticide Spray"
                  price="GHC 28.50"
                  category="Pesticides"
                  rating={4.6}
                  onPress={() => {}}
                  onAddToCart={() => {}}
                />
              </View>
            </ScrollView>
            
            <ShopCard
              name="Green Valley Supplies"
              distance="2.3 km"
              rating={4.7}
              productsCount={156}
              isOpen={true}
              onPress={() => {}}
            />
            
            <ShopCard
              name="Farm Tech Solutions"
              distance="5.1 km"
              rating={4.5}
              productsCount={89}
              isOpen={false}
              onPress={() => {}}
            />
          </View>
        </Animated.View>

        {/* Color Palette */}
        <Animated.View 
          entering={FadeInDown.delay(700).duration(800)}
          className="mb-8"
        >
          <Text className="text-xl font-bold text-neutral-800 mb-4">🎨 Color Palette</Text>
          
          {colors.map((colorGroup) => (
            <View key={colorGroup.name} className="mb-4">
              <Text className="text-sm font-medium text-neutral-600 mb-2">{colorGroup.name}</Text>
              <View className="flex-row">
                {colorGroup.colors.map((color) => (
                  <View
                    key={color}
                    className={`w-12 h-12 bg-${color} border border-neutral-200 mr-2 rounded-lg`}
                  />
                ))}
              </View>
            </View>
          ))}
        </Animated.View>

        {/* Typography */}
        <Animated.View 
          entering={FadeInDown.delay(800).duration(800)}
          className="mb-8"
        >
          <Text className="text-xl font-bold text-neutral-800 mb-4">📝 Typography</Text>
          
          <View className="space-y-3">
            <Text className="text-3xl font-bold text-neutral-800">Heading 1 - Bold</Text>
            <Text className="text-2xl font-bold text-neutral-800">Heading 2 - Bold</Text>
            <Text className="text-xl font-bold text-neutral-800">Heading 3 - Bold</Text>
            <Text className="text-lg font-semibold text-neutral-800">Heading 4 - Semibold</Text>
            <Text className="text-base font-medium text-neutral-800">Body Text - Medium</Text>
            <Text className="text-base text-neutral-600">Body Text - Regular</Text>
            <Text className="text-sm text-neutral-600">Small Text - Regular</Text>
            <Text className="text-xs text-neutral-500">Caption Text - Regular</Text>
          </View>
        </Animated.View>

        {/* Status Colors */}
        <Animated.View 
          entering={FadeInDown.delay(900).duration(800)}
          className="mb-8"
        >
          <Text className="text-xl font-bold text-neutral-800 mb-4">🚦 Status Colors</Text>
          
          <View className="space-y-3">
            <View className="px-3 py-2 bg-success/20 rounded-lg">
              <Text className="text-success font-medium">✅ Success Message</Text>
            </View>
            <View className="px-3 py-2 bg-warning/20 rounded-lg">
              <Text className="text-warning font-medium">⚠️ Warning Message</Text>
            </View>
            <View className="px-3 py-2 bg-error/20 rounded-lg">
              <Text className="text-error font-medium">❌ Error Message</Text>
            </View>
            <View className="px-3 py-2 bg-info/20 rounded-lg">
              <Text className="text-info font-medium">ℹ️ Info Message</Text>
            </View>
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
};