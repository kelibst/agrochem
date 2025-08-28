import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, FlatList, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { SearchInput } from '../../components/Input';
import { ProductCard, Card } from '../../components/Card';
import { useTheme } from '../../context/ThemeContext';
import { productService, Product, CATEGORIES } from '../../services/ProductService';

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
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('popular');
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const categories = ['All', ...CATEGORIES];
  
  // Load products from Firebase
  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const fetchedProducts = await productService.getAllProducts();
      setProducts(fetchedProducts);
    } catch (error) {
      console.error('Error loading products:', error);
      setError('Failed to load products. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const renderProduct = ({ item, index }: { item: Product, index: number }) => {
    const isInStock = item.stock > 0;
    return (
      <Animated.View
        entering={FadeInDown.delay(index * 100).duration(600)}
        style={{ width: '50%', paddingHorizontal: 8, marginBottom: 16 }}
      >
        <ProductCard
          title={item.name}
          price={`$${item.price.toFixed(2)}`}
          category={item.category}
          rating={4.5} // Default rating for now
          onPress={() => onProductPress(item.id)}
          onAddToCart={isInStock ? () => {} : undefined}
        />
        {!isInStock && (
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
  };

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
      {isLoading ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 50 }}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={{ color: theme.textSecondary, marginTop: 16, fontSize: 16 }}>Loading products...</Text>
        </View>
      ) : error ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 50, paddingHorizontal: 24 }}>
          <Text style={{ fontSize: 48, marginBottom: 16 }}>⚠️</Text>
          <Text style={{ fontSize: 18, fontWeight: '600', color: theme.error, marginBottom: 8, textAlign: 'center' }}>Error Loading Products</Text>
          <Text style={{ color: theme.textSecondary, textAlign: 'center', marginBottom: 20 }}>{error}</Text>
          <TouchableOpacity 
            onPress={loadProducts}
            style={{
              backgroundColor: theme.primary,
              paddingHorizontal: 24,
              paddingVertical: 12,
              borderRadius: 8
            }}
          >
            <Text style={{ color: theme.onPrimary, fontWeight: '600' }}>Try Again</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={filteredProducts}
          renderItem={renderProduct}
          numColumns={2}
          contentContainerStyle={{ padding: 16 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Animated.View 
              entering={FadeInDown.delay(500).duration(800)}
              style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: 80 }}
            >
              <Text style={{ fontSize: 48, marginBottom: 16 }}>🔍</Text>
              <Text style={{ fontSize: 18, fontWeight: '600', color: theme.text, marginBottom: 8 }}>No products found</Text>
              <Text style={{ color: theme.textSecondary, textAlign: 'center' }}>
                Try adjusting your search or filter criteria
              </Text>
            </Animated.View>
          }
        />
      )}

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