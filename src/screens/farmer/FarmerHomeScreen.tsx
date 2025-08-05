import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { SearchInput } from '../../components/Input';
import { ProductCard, ShopCard, Card } from '../../components/Card';
import { Button } from '../../components/Button';

interface FarmerHomeScreenProps {
  onSearchPress: () => void;
  onProductPress: (productId: string) => void;
  onShopPress: (shopId: string) => void;
  onCategoryPress: (category: string) => void;
  onViewAllProducts: () => void;
  onViewAllShops: () => void;
}

export const FarmerHomeScreen: React.FC<FarmerHomeScreenProps> = ({
  onSearchPress,
  onProductPress,
  onShopPress,
  onCategoryPress,
  onViewAllProducts,
  onViewAllShops,
}) => {
  const [searchQuery, setSearchQuery] = React.useState('');

  const categories = [
    { id: '1', name: 'Fertilizers', icon: '🌱', color: 'bg-primary-100' },
    { id: '2', name: 'Pesticides', icon: '🦗', color: 'bg-accent-100' },
    { id: '3', name: 'Seeds', icon: '🌰', color: 'bg-secondary-100' },
    { id: '4', name: 'Tools', icon: '🔨', color: 'bg-info/20' },
  ];

  const featuredProducts = [
    { id: '1', title: 'NPK Fertilizer Premium', price: '$45.99', category: 'Fertilizers', rating: 4.8 },
    { id: '2', title: 'Organic Pesticide Spray', price: '$28.50', category: 'Pesticides', rating: 4.6 },
    { id: '3', title: 'Hybrid Corn Seeds', price: '$35.00', category: 'Seeds', rating: 4.9 },
  ];

  const nearbyShops = [
    { id: '1', name: 'Green Valley Supplies', distance: '2.3 km', rating: 4.7, productsCount: 156, isOpen: true },
    { id: '2', name: 'Farm Tech Solutions', distance: '3.8 km', rating: 4.5, productsCount: 89, isOpen: true },
    { id: '3', name: 'AgriCare Center', distance: '5.1 km', rating: 4.8, productsCount: 203, isOpen: false },
  ];

  return (
    <SafeAreaView className="flex-1 bg-neutral-50">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Animated.View 
          entering={FadeInUp.delay(200).duration(800)}
          className="px-6 pt-4 pb-6 bg-white"
        >
          <View className="flex-row items-center justify-between mb-4">
            <View>
              <Text className="text-2xl font-bold text-primary-800">Good Morning! 👋</Text>
              <Text className="text-primary-600">Ready to grow your farm?</Text>
            </View>
            <TouchableOpacity className="w-12 h-12 bg-primary-100 rounded-xl items-center justify-center">
              <Text className="text-xl">🔔</Text>
            </TouchableOpacity>
          </View>

          <SearchInput
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search products, shops..."
            onSearch={onSearchPress}
          />
        </Animated.View>

        {/* Weather Card */}
        <Animated.View 
          entering={FadeInDown.delay(300).duration(800)}
          className="px-6 mb-6"
        >
          <Card className="bg-gradient-to-r from-primary-500 to-primary-600 p-6">
            <View className="flex-row items-center justify-between">
              <View>
                <Text className="text-white text-lg font-semibold mb-1">Today's Weather</Text>
                <Text className="text-primary-100 text-sm">Perfect for spraying pesticides</Text>
              </View>
              <View className="items-center">
                <Text className="text-4xl mb-1">☀️</Text>
                <Text className="text-white font-bold text-xl">28°C</Text>
              </View>
            </View>
          </Card>
        </Animated.View>

        {/* Categories */}
        <Animated.View 
          entering={FadeInDown.delay(400).duration(800)}
          className="mb-6"
        >
          <View className="flex-row items-center justify-between px-6 mb-4">
            <Text className="text-lg font-bold text-neutral-800">Categories</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-6">
            <View className="flex-row space-x-4">
              {categories.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  onPress={() => onCategoryPress(category.name)}
                  className="items-center"
                >
                  <View className={`w-16 h-16 ${category.color} rounded-2xl items-center justify-center mb-2`}>
                    <Text className="text-2xl">{category.icon}</Text>
                  </View>
                  <Text className="text-sm font-medium text-neutral-700 text-center w-20" numberOfLines={2}>
                    {category.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </Animated.View>

        {/* Featured Products */}
        <Animated.View 
          entering={FadeInDown.delay(500).duration(800)}
          className="mb-6"
        >
          <View className="flex-row items-center justify-between px-6 mb-4">
            <Text className="text-lg font-bold text-neutral-800">Featured Products</Text>
            <TouchableOpacity onPress={onViewAllProducts}>
              <Text className="text-primary-600 font-medium">View All</Text>
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            <View className="flex-row pl-6">
              {featuredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  title={product.title}
                  price={product.price}
                  category={product.category}
                  rating={product.rating}
                  onPress={() => onProductPress(product.id)}
                  onAddToCart={() => {}}
                />
              ))}
            </View>
          </ScrollView>
        </Animated.View>

        {/* Quick Actions */}
        <Animated.View 
          entering={FadeInDown.delay(600).duration(800)}
          className="px-6 mb-6"
        >
          <Text className="text-lg font-bold text-neutral-800 mb-4">Quick Actions</Text>
          <View className="flex-row space-x-4">
            <View className="flex-1">
              <Card onPress={() => {}} className="p-4 bg-accent-50">
                <View className="items-center">
                  <Text className="text-2xl mb-2">📦</Text>
                  <Text className="text-sm font-medium text-accent-800">Track Orders</Text>
                </View>
              </Card>
            </View>
            <View className="flex-1">
              <Card onPress={() => {}} className="p-4 bg-info/10">
                <View className="items-center">
                  <Text className="text-2xl mb-2">💬</Text>
                  <Text className="text-sm font-medium text-info">Messages</Text>
                </View>
              </Card>
            </View>
            <View className="flex-1">
              <Card onPress={() => {}} className="p-4 bg-success/10">
                <View className="items-center">
                  <Text className="text-2xl mb-2">📍</Text>
                  <Text className="text-sm font-medium text-success">Find Shops</Text>
                </View>
              </Card>
            </View>
          </View>
        </Animated.View>

        {/* Nearby Shops */}
        <Animated.View 
          entering={FadeInDown.delay(700).duration(800)}
          className="px-6 pb-6"
        >
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-lg font-bold text-neutral-800">Nearby Shops</Text>
            <TouchableOpacity onPress={onViewAllShops}>
              <Text className="text-primary-600 font-medium">View All</Text>
            </TouchableOpacity>
          </View>
          {nearbyShops.map((shop) => (
            <ShopCard
              key={shop.id}
              name={shop.name}
              distance={shop.distance}
              rating={shop.rating}
              productsCount={shop.productsCount}
              isOpen={shop.isOpen}
              onPress={() => onShopPress(shop.id)}
            />
          ))}
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
};