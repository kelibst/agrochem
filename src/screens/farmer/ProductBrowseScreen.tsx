import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { SearchInput } from '../../components/Input';
import { ProductCard, Card } from '../../components/Card';

interface ProductBrowseScreenProps {
  onProductPress: (productId: string) => void;
  onFilterPress: () => void;
  onBack: () => void;
}

export const ProductBrowseScreen: React.FC<ProductBrowseScreenProps> = ({
  onProductPress,
  onFilterPress,
  onBack,
}) => {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState('All');
  const [sortBy, setSortBy] = React.useState('popular');

  const categories = ['All', 'Fertilizers', 'Pesticides', 'Seeds', 'Tools', 'Equipment'];
  
  const products = [
    { id: '1', title: 'NPK Fertilizer Premium Grade', price: '$45.99', category: 'Fertilizers', rating: 4.8, inStock: true },
    { id: '2', title: 'Organic Pesticide Spray', price: '$28.50', category: 'Pesticides', rating: 4.6, inStock: true },
    { id: '3', title: 'Hybrid Corn Seeds 10kg', price: '$35.00', category: 'Seeds', rating: 4.9, inStock: false },
    { id: '4', title: 'Potassium Sulfate Fertilizer', price: '$52.00', category: 'Fertilizers', rating: 4.7, inStock: true },
    { id: '5', title: 'Fungicide Spray Concentrate', price: '$42.75', category: 'Pesticides', rating: 4.5, inStock: true },
    { id: '6', title: 'Tomato Seeds Hybrid Variety', price: '$18.99', category: 'Seeds', rating: 4.8, inStock: true },
    { id: '7', title: 'Garden Hose 50ft Premium', price: '$89.99', category: 'Tools', rating: 4.6, inStock: true },
    { id: '8', title: 'Phosphate Rock Fertilizer', price: '$38.50', category: 'Fertilizers', rating: 4.4, inStock: true },
  ];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const renderProduct = ({ item, index }: { item: typeof products[0], index: number }) => (
    <Animated.View
      entering={FadeInDown.delay(index * 100).duration(600)}
      className="w-1/2 px-2 mb-4"
    >
      <ProductCard
        title={item.title}
        price={item.price}
        category={item.category}
        rating={item.rating}
        onPress={() => onProductPress(item.id)}
        onAddToCart={item.inStock ? () => {} : undefined}
      />
      {!item.inStock && (
        <View className="absolute top-2 right-4 bg-error/90 px-2 py-1 rounded-lg">
          <Text className="text-white text-xs font-medium">Out of Stock</Text>
        </View>
      )}
    </Animated.View>
  );

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
          <Text className="text-lg font-semibold text-primary-800">Browse Products</Text>
          <TouchableOpacity onPress={onFilterPress} className="p-2">
            <Text className="text-xl">⚙️</Text>
          </TouchableOpacity>
        </View>

        <SearchInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search products..."
        />
      </Animated.View>

      {/* Filter Stats */}
      <Animated.View 
        entering={FadeInDown.delay(300).duration(800)}
        className="px-6 py-4 bg-white border-t border-neutral-100"
      >
        <View className="flex-row items-center justify-between">
          <Text className="text-sm text-neutral-600">
            {filteredProducts.length} products found
          </Text>
          <TouchableOpacity className="flex-row items-center">
            <Text className="text-sm text-primary-600 mr-1">Sort by: {sortBy}</Text>
            <Text className="text-primary-600">↕️</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* Categories */}
      <Animated.View 
        entering={FadeInDown.delay(400).duration(800)}
        className="py-4 bg-white"
      >
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="px-6">
          <View className="flex-row space-x-3">
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                onPress={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full ${
                  selectedCategory === category
                    ? 'bg-primary-600'
                    : 'bg-neutral-100'
                }`}
              >
                <Text className={`text-sm font-medium ${
                  selectedCategory === category
                    ? 'text-white'
                    : 'text-neutral-600'
                }`}>
                  {category}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </ScrollView>
      </Animated.View>

      {/* Products Grid */}
      <FlatList
        data={filteredProducts}
        renderItem={renderProduct}
        numColumns={2}
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Animated.View 
            entering={FadeInDown.delay(500).duration(800)}
            className="items-center justify-center py-20"
          >
            <Text className="text-6xl mb-4">🔍</Text>
            <Text className="text-lg font-semibold text-neutral-800 mb-2">No products found</Text>
            <Text className="text-neutral-600 text-center">
              Try adjusting your search or filter criteria
            </Text>
          </Animated.View>
        }
      />

      {/* Floating Action Button */}
      <Animated.View 
        entering={FadeInDown.delay(600).duration(800)}
        className="absolute bottom-6 right-6"
      >
        <TouchableOpacity className="w-14 h-14 bg-primary-600 rounded-full items-center justify-center shadow-lg">
          <Text className="text-white text-xl">🛒</Text>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
};