import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { SearchInput } from '../../components/Input';
import { ProductCard, Card } from '../../components/Card';
import { useTheme } from '../../context/ThemeContext';

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
  const { theme } = useTheme();
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
      style={{ width: '50%', paddingHorizontal: 8, marginBottom: 16 }}
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
        <View style={{
          position: 'absolute',
          top: 8,
          right: 16,
          backgroundColor: theme.error,
          opacity: 0.9,
          paddingHorizontal: 8,
          paddingVertical: 4,
          borderRadius: 8
        }}>
          <Text style={{ color: theme.onError, fontSize: 12, fontWeight: '500' }}>Out of Stock</Text>
        </View>
      )}
    </Animated.View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      {/* Header */}
      <Animated.View 
        entering={FadeInUp.delay(200).duration(800)}
        style={{ paddingHorizontal: 24, paddingTop: 16, paddingBottom: 24, backgroundColor: theme.surface }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <TouchableOpacity onPress={onBack} style={{ padding: 8, marginLeft: -8 }}>
            <Text style={{ fontSize: 24, color: theme.text }}>←</Text>
          </TouchableOpacity>
          <Text style={{ fontSize: 18, fontWeight: '600', color: theme.primaryDark }}>Browse Products</Text>
          <TouchableOpacity onPress={onFilterPress} style={{ padding: 8 }}>
            <Text style={{ fontSize: 20 }}>⚙️</Text>
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
        style={{ paddingHorizontal: 24, paddingVertical: 16, backgroundColor: theme.surface, borderTopWidth: 1, borderTopColor: theme.border }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text style={{ fontSize: 14, color: theme.textSecondary }}>
            {filteredProducts.length} products found
          </Text>
          <TouchableOpacity style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ fontSize: 14, color: theme.primary, marginRight: 4 }}>Sort by: {sortBy}</Text>
            <Text style={{ color: theme.primary }}>↕️</Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* Categories */}
      <Animated.View 
        entering={FadeInDown.delay(400).duration(800)}
        style={{ paddingVertical: 16, backgroundColor: theme.surface }}
      >
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ paddingHorizontal: 24 }}>
          <View style={{ flexDirection: 'row', gap: 12 }}>
            {categories.map((category) => (
              <TouchableOpacity
                key={category}
                onPress={() => setSelectedCategory(category)}
                style={{
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  borderRadius: 20,
                  backgroundColor: selectedCategory === category ? theme.primary : theme.surfaceVariant
                }}
              >
                <Text style={{
                  fontSize: 14,
                  fontWeight: '500',
                  color: selectedCategory === category ? theme.onPrimary : theme.textSecondary
                }}>
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
        style={{ position: 'absolute', bottom: 24, right: 24 }}
      >
        <TouchableOpacity style={{
          width: 56,
          height: 56,
          backgroundColor: theme.primary,
          borderRadius: 28,
          alignItems: 'center',
          justifyContent: 'center',
          shadowColor: theme.text,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 8,
        }}>
          <Text style={{ color: theme.onPrimary, fontSize: 20 }}>🛒</Text>
        </TouchableOpacity>
      </Animated.View>
    </SafeAreaView>
  );
};