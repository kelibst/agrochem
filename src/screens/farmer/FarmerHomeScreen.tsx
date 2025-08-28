import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { SearchInput } from '../../components/Input';
import { ProductCard, ShopCard, Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { productService, Product, CATEGORIES } from '../../services/ProductService';

interface FarmerHomeScreenProps {
  onSearchPress: () => void;
  onProductPress: (productId: string) => void;
  onShopPress: (shopId: string) => void;
  onCategoryPress: (category: string) => void;
  onViewAllProducts: () => void;
  onViewAllShops: () => void;
  onProfilePress: () => void;
  onRecommendationsPress: () => void;
  onOrdersPress: () => void;
  onCartPress: () => void;
}

export const FarmerHomeScreen: React.FC<FarmerHomeScreenProps> = ({
  onSearchPress,
  onProductPress,
  onShopPress,
  onCategoryPress,
  onViewAllProducts,
  onViewAllShops,
  onProfilePress,
  onRecommendationsPress,
  onOrdersPress,
  onCartPress,
}) => {
  const { theme } = useTheme();
  const { userProfile } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [stats, setStats] = useState({
    totalProducts: 0,
    totalShops: 0,
    categoriesAvailable: 0,
  });

  // Get user's first name for greeting
  const userName = userProfile?.profile?.name?.split(' ')[0] || 'Farmer';

  // Load products and calculate stats
  useEffect(() => {
    loadProductData();
  }, []);

  const loadProductData = async () => {
    try {
      setIsLoading(true);
      const fetchedProducts = await productService.getAllProducts();
      setProducts(fetchedProducts);
      
      // Calculate statistics
      const uniqueShops = new Set(fetchedProducts.map(p => p.shopId));
      const uniqueCategories = new Set(fetchedProducts.map(p => p.category));
      
      setStats({
        totalProducts: fetchedProducts.length,
        totalShops: uniqueShops.size,
        categoriesAvailable: uniqueCategories.size,
      });
    } catch (error) {
      console.error('Error loading product data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const categories = [
    { id: '1', name: 'Fertilizers', icon: '🌱', color: theme.primaryContainer },
    { id: '2', name: 'Pesticides', icon: '🦗', color: theme.accentContainer },
    { id: '3', name: 'Seeds', icon: '🌰', color: theme.secondaryContainer },
    { id: '4', name: 'Tools', icon: '🔨', color: theme.infoContainer },
  ];

  // Get featured products (latest 3 products)
  const featuredProducts = products.slice(0, 3);

  const nearbyShops = [
    { id: '1', name: 'Green Valley Supplies', distance: '2.3 km', rating: 4.7, productsCount: 156, isOpen: true },
    { id: '2', name: 'Farm Tech Solutions', distance: '3.8 km', rating: 4.5, productsCount: 89, isOpen: true },
    { id: '3', name: 'AgriCare Center', distance: '5.1 km', rating: 4.8, productsCount: 203, isOpen: false },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }} edges={['top', 'left', 'right']}>
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Animated.View 
          entering={FadeInUp.delay(200).duration(800)}
          style={{ paddingHorizontal: 24, paddingTop: 8, paddingBottom: 24 }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <View>
              <Text style={{ fontSize: 24, fontWeight: 'bold', color: theme.primaryDark }}>Good Morning, {userName}! 👋</Text>
              <Text style={{ color: theme.primary }}>Ready to grow your farm?</Text>
              {userProfile?.profile && 'farmName' in userProfile.profile && userProfile.profile.farmName && (
                <Text style={{ color: theme.textSecondary, fontSize: 14, marginTop: 2 }}>
                  {userProfile.profile.farmName}
                </Text>
              )}
            </View>
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <TouchableOpacity 
                onPress={onCartPress}
                style={{
                  width: 48,
                  height: 48,
                  backgroundColor: theme.primaryContainer,
                  borderRadius: 12,
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Text style={{ fontSize: 20 }}>🛒</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={onProfilePress}
                style={{
                  width: 48,
                  height: 48,
                  backgroundColor: theme.primaryContainer,
                  borderRadius: 12,
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                <Text style={{ fontSize: 20 }}>👤</Text>
              </TouchableOpacity>
            </View>
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
          style={{ paddingHorizontal: 24, marginBottom: 24 }}
        >
          <View style={{
            backgroundColor: theme.primary,
            padding: 24,
            borderRadius: 12,
            shadowColor: theme.text,
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.1,
            shadowRadius: 4,
            elevation: 3,
          }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <View>
                <Text style={{ color: theme.onPrimary, fontSize: 18, fontWeight: '600', marginBottom: 4 }}>Today's Weather</Text>
                <Text style={{ color: theme.onPrimary, opacity: 0.8, fontSize: 14 }}>Perfect for spraying pesticides</Text>
              </View>
              <View style={{ alignItems: 'center' }}>
                <Text style={{ fontSize: 32, marginBottom: 4 }}>☀️</Text>
                <Text style={{ color: theme.onPrimary, fontWeight: 'bold', fontSize: 20 }}>28°C</Text>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Product Statistics */}
        <Animated.View 
          entering={FadeInDown.delay(350).duration(800)}
          style={{ paddingHorizontal: 24, marginBottom: 24 }}
        >
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: theme.text, marginBottom: 16 }}>Available Products</Text>
          {isLoading ? (
            <View style={{ alignItems: 'center', paddingVertical: 40 }}>
              <ActivityIndicator size="large" color={theme.primary} />
              <Text style={{ color: theme.textSecondary, marginTop: 12 }}>Loading products...</Text>
            </View>
          ) : (
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <View style={{ flex: 1 }}>
                <Card>
                  <View style={{ padding: 16, alignItems: 'center', backgroundColor: theme.primaryContainer }}>
                    <Text style={{ fontSize: 24, fontWeight: 'bold', color: theme.primary, marginBottom: 4 }}>{stats.totalProducts}</Text>
                    <Text style={{ fontSize: 12, color: theme.text, textAlign: 'center' }}>Total Products</Text>
                  </View>
                </Card>
              </View>
              <View style={{ flex: 1 }}>
                <Card>
                  <View style={{ padding: 16, alignItems: 'center', backgroundColor: theme.accentContainer }}>
                    <Text style={{ fontSize: 24, fontWeight: 'bold', color: theme.accent, marginBottom: 4 }}>{stats.totalShops}</Text>
                    <Text style={{ fontSize: 12, color: theme.text, textAlign: 'center' }}>Active Shops</Text>
                  </View>
                </Card>
              </View>
              <View style={{ flex: 1 }}>
                <Card>
                  <View style={{ padding: 16, alignItems: 'center', backgroundColor: theme.infoContainer }}>
                    <Text style={{ fontSize: 24, fontWeight: 'bold', color: theme.info, marginBottom: 4 }}>{stats.categoriesAvailable}</Text>
                    <Text style={{ fontSize: 12, color: theme.text, textAlign: 'center' }}>Categories</Text>
                  </View>
                </Card>
              </View>
            </View>
          )}
        </Animated.View>

        {/* Categories */}
        <Animated.View 
          entering={FadeInDown.delay(400).duration(800)}
          style={{ marginBottom: 24 }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24, marginBottom: 16 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: theme.text }}>Categories</Text>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ paddingHorizontal: 24 }}>
            <View style={{ flexDirection: 'row', gap: 16 }}>
              {categories.map((category) => (
                <TouchableOpacity
                  key={category.id}
                  onPress={() => onCategoryPress(category.name)}
                  style={{ alignItems: 'center' }}
                >
                  <View style={{
                    width: 64,
                    height: 64,
                    backgroundColor: category.color,
                    borderRadius: 16,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: 8
                  }}>
                    <Text style={{ fontSize: 24 }}>{category.icon}</Text>
                  </View>
                  <Text style={{ fontSize: 14, fontWeight: '500', color: theme.textSecondary, textAlign: 'center', width: 80 }} numberOfLines={2}>
                    {category.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </ScrollView>
        </Animated.View>

        {/* Featured Products */}
        {!isLoading && featuredProducts.length > 0 && (
          <Animated.View 
            entering={FadeInDown.delay(500).duration(800)}
            style={{ marginBottom: 24 }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 24, marginBottom: 16 }}>
              <Text style={{ fontSize: 18, fontWeight: 'bold', color: theme.text }}>Recently Added</Text>
              <TouchableOpacity onPress={onViewAllProducts}>
                <Text style={{ color: theme.primary, fontWeight: '500' }}>View All</Text>
              </TouchableOpacity>
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={{ flexDirection: 'row', paddingLeft: 24 }}>
                {featuredProducts.map((product) => (
                  <ProductCard
                    key={product.id}
                    title={product.name}
                    price={`$${product.price.toFixed(2)}`}
                    category={product.category}
                    rating={4.5} // Default rating for now
                    onPress={() => onProductPress(product.id)}
                    onAddToCart={() => {}}
                  />
                ))}
              </View>
            </ScrollView>
          </Animated.View>
        )}

        {/* Category Summary */}
        {!isLoading && products.length > 0 && (
          <Animated.View 
            entering={FadeInDown.delay(600).duration(800)}
            style={{ paddingHorizontal: 24, marginBottom: 24 }}
          >
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: theme.text, marginBottom: 16 }}>Popular Categories</Text>
            <View style={{ flexDirection: 'row', gap: 16 }}>
              {CATEGORIES.slice(0, 3).map((categoryName, index) => {
                const categoryProducts = products.filter(p => p.category === categoryName);
                const averagePrice = categoryProducts.length > 0 
                  ? categoryProducts.reduce((sum, p) => sum + p.price, 0) / categoryProducts.length 
                  : 0;
                
                const colors = [theme.accentContainer, theme.infoContainer, theme.successContainer];
                const textColors = [theme.onAccentContainer, theme.onInfo, theme.onSuccess];
                
                return (
                  <View key={categoryName} style={{ flex: 1 }}>
                    <TouchableOpacity 
                      onPress={() => onCategoryPress(categoryName)}
                      style={{
                        padding: 16,
                        backgroundColor: colors[index],
                        borderRadius: 12,
                        alignItems: 'center',
                        shadowColor: theme.text,
                        shadowOffset: { width: 0, height: 2 },
                        shadowOpacity: 0.1,
                        shadowRadius: 4,
                        elevation: 3,
                      }}
                    >
                      <Text style={{ fontSize: 18, marginBottom: 8 }}>{categoryProducts.length}</Text>
                      <Text style={{ fontSize: 12, fontWeight: '500', color: textColors[index], textAlign: 'center' }}>
                        {categoryName}
                      </Text>
                      <Text style={{ fontSize: 10, color: textColors[index], textAlign: 'center', marginTop: 4 }}>
                        Avg: ${averagePrice.toFixed(0)}
                      </Text>
                    </TouchableOpacity>
                  </View>
                );
              })}
            </View>
          </Animated.View>
        )}

        {/* Nearby Shops */}
        <Animated.View 
          entering={FadeInDown.delay(700).duration(800)}
          style={{ paddingHorizontal: 24, paddingBottom: 24 }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: theme.text }}>Nearby Shops</Text>
            <TouchableOpacity onPress={onViewAllShops}>
              <Text style={{ color: theme.primary, fontWeight: '500' }}>View All</Text>
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