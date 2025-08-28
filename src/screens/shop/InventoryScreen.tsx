import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, FlatList, ActivityIndicator, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { SearchInput } from '../../components/Input';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '../../context/AuthContext';
import { productService, Product, CATEGORIES } from '../../services/ProductService';

interface InventoryScreenProps {
  onProductPress: (productId: string) => void;
  onAddProductPress: () => void;
  onEditProductPress: (productId: string, product: Product) => void;
  onBack: () => void;
}

// Remove local Product interface - using the one from ProductService

export const InventoryScreen: React.FC<InventoryScreenProps> = ({
  onProductPress,
  onAddProductPress,
  onEditProductPress,
  onBack,
}) => {
  const { theme } = useTheme();
  const { user, userProfile } = useAuth();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [sortBy, setSortBy] = useState('name');
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const categories = ['All', ...CATEGORIES];
  
  // Load products from Firebase
  useEffect(() => {
    if (user && userProfile?.role === 'shop_owner') {
      loadProducts();
    }
  }, [user, userProfile]);

  const loadProducts = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const fetchedProducts = await productService.getShopProducts(user!.uid);
      setProducts(fetchedProducts);
    } catch (error) {
      console.error('Error loading products:', error);
      setError('Failed to load products. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleDeleteProduct = async (productId: string, productName: string) => {
    Alert.alert(
      'Delete Product',
      `Are you sure you want to delete "${productName}"? This action cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await productService.deleteProduct(productId);
              setProducts(prev => prev.filter(p => p.id !== productId));
              Alert.alert('Success', 'Product deleted successfully.');
            } catch (error) {
              console.error('Error deleting product:', error);
              Alert.alert('Error', 'Failed to delete product. Please try again.');
            }
          }
        }
      ]
    );
  };

  const getProductStatus = (stock: number): 'in_stock' | 'low_stock' | 'out_of_stock' => {
    if (stock === 0) return 'out_of_stock';
    if (stock <= 10) return 'low_stock'; // Consider low stock if <= 10 items
    return 'in_stock';
  };

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getStatusColor = (status: 'in_stock' | 'low_stock' | 'out_of_stock') => {
    switch (status) {
      case 'in_stock': return { color: theme.success, backgroundColor: theme.success + '33' };
      case 'low_stock': return { color: theme.warning, backgroundColor: theme.warning + '33' };
      case 'out_of_stock': return { color: theme.error, backgroundColor: theme.error + '33' };
      default: return { color: theme.textSecondary, backgroundColor: theme.surfaceVariant };
    }
  };

  const getStatusText = (status: 'in_stock' | 'low_stock' | 'out_of_stock') => {
    switch (status) {
      case 'in_stock': return 'In Stock';
      case 'low_stock': return 'Low Stock';
      case 'out_of_stock': return 'Out of Stock';
      default: return 'Unknown';
    }
  };

  const totalProducts = products.length;
  const lowStockCount = products.filter(p => getProductStatus(p.stock) === 'low_stock').length;
  const outOfStockCount = products.filter(p => getProductStatus(p.stock) === 'out_of_stock').length;

  const renderProduct = ({ item, index }: { item: Product, index: number }) => {
    const status = getProductStatus(item.stock);
    const statusStyle = getStatusColor(status);
    
    return (
      <Animated.View
        entering={FadeInDown.delay(index * 100).duration(600)}
        style={{ marginBottom: 16 }}
      >
        <Card onPress={() => onProductPress(item.id)}>
          <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 12 }}>
            <View style={{ flex: 1 }}>
              <Text style={{ fontSize: 18, fontWeight: '600', color: theme.text, marginBottom: 4 }}>
                {item.name}
              </Text>
              <Text style={{ fontSize: 14, color: theme.textSecondary, marginBottom: 8 }}>
                {item.category} • {item.unit}
              </Text>
              <View style={{
                alignSelf: 'flex-start',
                paddingHorizontal: 8,
                paddingVertical: 4,
                borderRadius: 12,
                ...statusStyle
              }}>
                <Text style={{ fontSize: 12, fontWeight: '500', color: statusStyle.color }}>
                  {getStatusText(status)}
                </Text>
              </View>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={{ fontSize: 18, fontWeight: 'bold', color: theme.primary, marginBottom: 4 }}>
                ${item.price.toFixed(2)}
              </Text>
              <Text style={{ fontSize: 14, color: theme.textSecondary }}>
                Stock: {item.stock}
              </Text>
            </View>
          </View>

          <View style={{ flexDirection: 'row', gap: 12, marginTop: 8 }}>
            <Button
              title="✏️ Edit"
              onPress={() => onEditProductPress(item.id, item)}
              variant="outline"
              size="sm"
            />
            <Button
              title="🗑️ Delete"
              onPress={() => handleDeleteProduct(item.id, item.name)}
              variant="outline"
              size="sm"
            />
          </View>
        </Card>
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
          <Text style={{ fontSize: 18, fontWeight: '600', color: theme.primaryDark }}>Inventory Management</Text>
          <TouchableOpacity onPress={onAddProductPress} style={{ padding: 8 }}>
            <Text style={{ fontSize: 20 }}>➕</Text>
          </TouchableOpacity>
        </View>

        <SearchInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          placeholder="Search products..."
        />
      </Animated.View>

      {/* Stats */}
      <Animated.View 
        entering={FadeInDown.delay(300).duration(800)}
        style={{ paddingHorizontal: 24, paddingVertical: 16, backgroundColor: theme.surface, borderTopWidth: 1, borderTopColor: theme.border }}
      >
        <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
          <View style={{ alignItems: 'center' }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold', color: theme.primary }}>{totalProducts}</Text>
            <Text style={{ fontSize: 14, color: theme.textSecondary }}>Total Products</Text>
          </View>
          <View style={{ alignItems: 'center' }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold', color: theme.warning }}>{lowStockCount}</Text>
            <Text style={{ fontSize: 14, color: theme.textSecondary }}>Low Stock</Text>
          </View>
          <View style={{ alignItems: 'center' }}>
            <Text style={{ fontSize: 24, fontWeight: 'bold', color: theme.error }}>{outOfStockCount}</Text>
            <Text style={{ fontSize: 14, color: theme.textSecondary }}>Out of Stock</Text>
          </View>
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

      {/* Products List */}
      {isLoading ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 50 }}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={{ color: theme.textSecondary, marginTop: 16, fontSize: 16 }}>Loading inventory...</Text>
        </View>
      ) : error ? (
        <View style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: 50, paddingHorizontal: 24 }}>
          <Text style={{ fontSize: 48, marginBottom: 16 }}>⚠️</Text>
          <Text style={{ fontSize: 18, fontWeight: '600', color: theme.error, marginBottom: 8, textAlign: 'center' }}>Error Loading Inventory</Text>
          <Text style={{ color: theme.textSecondary, textAlign: 'center', marginBottom: 20 }}>{error}</Text>
          <Button
            title="Try Again"
            onPress={loadProducts}
            variant="primary"
          />
        </View>
      ) : (
        <FlatList
          data={filteredProducts}
          renderItem={renderProduct}
          contentContainerStyle={{ padding: 16 }}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <Animated.View 
              entering={FadeInDown.delay(500).duration(800)}
              style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: 80 }}
            >
              <Text style={{ fontSize: 48, marginBottom: 16 }}>📦</Text>
              <Text style={{ fontSize: 18, fontWeight: '600', color: theme.text, marginBottom: 8 }}>No products found</Text>
              <Text style={{ color: theme.textSecondary, textAlign: 'center', marginBottom: 24 }}>
                Try adjusting your search or add new products
              </Text>
              <Button
                title="➕ Add Product"
                onPress={onAddProductPress}
                variant="primary"
              />
            </Animated.View>
          }
        />
      )}
    </SafeAreaView>
  );
};