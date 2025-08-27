import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { SearchInput } from '../../components/Input';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { useTheme } from '@/context/ThemeContext';

interface InventoryScreenProps {
  onProductPress: (productId: string) => void;
  onAddProductPress: () => void;
  onEditProductPress: (productId: string) => void;
  onBack: () => void;
}

interface Product {
  id: string;
  name: string;
  category: string;
  price: string;
  stock: number;
  minStock: number;
  status: 'in_stock' | 'low_stock' | 'out_of_stock';
  sales: number;
}

export const InventoryScreen: React.FC<InventoryScreenProps> = ({
  onProductPress,
  onAddProductPress,
  onEditProductPress,
  onBack,
}) => {
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = React.useState('');
  const [selectedCategory, setSelectedCategory] = React.useState('All');
  const [sortBy, setSortBy] = React.useState('name');

  const categories = ['All', 'Fertilizers', 'Pesticides', 'Seeds', 'Tools'];
  
  const products: Product[] = [
    {
      id: '1',
      name: 'NPK Fertilizer Premium',
      category: 'Fertilizers',
      price: '$45.99',
      stock: 5,
      minStock: 20,
      status: 'low_stock',
      sales: 156
    },
    {
      id: '2',
      name: 'Organic Pesticide Spray',
      category: 'Pesticides',
      price: '$28.50',
      stock: 45,
      minStock: 15,
      status: 'in_stock',
      sales: 89
    },
    {
      id: '3',
      name: 'Hybrid Corn Seeds',
      category: 'Seeds',
      price: '$35.00',
      stock: 0,
      minStock: 25,
      status: 'out_of_stock',
      sales: 67
    },
    {
      id: '4',
      name: 'Potassium Sulfate',
      category: 'Fertilizers',
      price: '$52.00',
      stock: 32,
      minStock: 10,
      status: 'in_stock',
      sales: 234
    },
    {
      id: '5',
      name: 'Garden Hose 50ft',
      category: 'Tools',
      price: '$89.99',
      stock: 8,
      minStock: 5,
      status: 'in_stock',
      sales: 23
    },
  ];

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const getStatusColor = (status: Product['status']) => {
    switch (status) {
      case 'in_stock': return 'text-success bg-success/20';
      case 'low_stock': return 'text-warning bg-warning/20';
      case 'out_of_stock': return 'text-error bg-error/20';
      default: return 'text-neutral-600 bg-neutral-100';
    }
  };

  const getStatusText = (status: Product['status']) => {
    switch (status) {
      case 'in_stock': return 'In Stock';
      case 'low_stock': return 'Low Stock';
      case 'out_of_stock': return 'Out of Stock';
      default: return 'Unknown';
    }
  };

  const totalProducts = products.length;
  const lowStockCount = products.filter(p => p.status === 'low_stock').length;
  const outOfStockCount = products.filter(p => p.status === 'out_of_stock').length;

  const renderProduct = ({ item, index }: { item: Product, index: number }) => (
    <Animated.View
      entering={FadeInDown.delay(index * 100).duration(600)}
      className="mb-4"
    >
      <Card onPress={() => onProductPress(item.id)}>
        <View className="flex-row items-start justify-between mb-3">
          <View className="flex-1">
            <Text className="text-lg font-semibold text-neutral-800 mb-1">
              {item.name}
            </Text>
            <Text className="text-sm text-neutral-600 mb-2">
              {item.category}
            </Text>
            <View className={`self-start px-2 py-1 rounded-full ${getStatusColor(item.status)}`}>
              <Text className="text-xs font-medium">
                {getStatusText(item.status)}
              </Text>
            </View>
          </View>
          <View className="items-end">
            <Text className="text-lg font-bold text-primary-600 mb-1">
              {item.price}
            </Text>
            <Text className="text-sm text-neutral-600">
              {item.sales} sold
            </Text>
          </View>
        </View>

        <View className="flex-row items-center justify-between mb-3">
          <View className="flex-1">
            <Text className="text-sm text-neutral-600 mb-1">Stock Level</Text>
            <View className="flex-row items-center">
              <Text className={`text-base font-semibold ${
                item.status === 'out_of_stock' ? 'text-error' :
                item.status === 'low_stock' ? 'text-warning' : 'text-success'
              }`}>
                {item.stock}
              </Text>
              <Text className="text-sm text-neutral-500 ml-2">
                / Min: {item.minStock}
              </Text>
            </View>
          </View>
          
          <View className="w-24 h-2 bg-neutral-200 rounded-full overflow-hidden">
            <View 
              className={`h-full rounded-full ${
                item.status === 'out_of_stock' ? 'bg-error' :
                item.status === 'low_stock' ? 'bg-warning' : 'bg-success'
              }`}
              style={{ 
                width: `${Math.min((item.stock / (item.minStock * 2)) * 100, 100)}%` 
              }}
            />
          </View>
        </View>

        <View className="flex-row space-x-3">
          <Button
            title="Edit"
            onPress={() => onEditProductPress(item.id)}
            variant="outline"
            size="sm"
            className="flex-1"
          />
          <Button
            title={item.status === 'out_of_stock' ? 'Restock' : 'Update Stock'}
            onPress={() => {}}
            size="sm"
            className="flex-1"
          />
        </View>
      </Card>
    </Animated.View>
  );

  return (
    <SafeAreaView className="flex-1 bg-neutral-50" style={{ backgroundColor: theme.background }}>
      {/* Header */}
      <Animated.View 
        entering={FadeInUp.delay(200).duration(800)}
        className="px-6 pt-4 pb-6"
      >
        <View className="flex-row items-center justify-between mb-4">
          <TouchableOpacity onPress={onBack} className="p-2 -ml-2">
            <Text className="text-2xl">←</Text>
          </TouchableOpacity>
          <Text className="text-lg font-semibold text-primary-800">Inventory</Text>
          <TouchableOpacity onPress={onAddProductPress} className="p-2">
            <Text className="text-xl">➕</Text>
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
        className="px-6 py-4 border-t border-neutral-100"
      >
        <View className="flex-row justify-between">
          <View className="items-center">
            <Text className="text-2xl font-bold text-primary-600">{totalProducts}</Text>
            <Text className="text-sm text-neutral-600">Total Products</Text>
          </View>
          <View className="items-center">
            <Text className="text-2xl font-bold text-warning">{lowStockCount}</Text>
            <Text className="text-sm text-neutral-600">Low Stock</Text>
          </View>
          <View className="items-center">
            <Text className="text-2xl font-bold text-error">{outOfStockCount}</Text>
            <Text className="text-sm text-neutral-600">Out of Stock</Text>
          </View>
        </View>
      </Animated.View>

      {/* Categories */}
      <Animated.View 
        entering={FadeInDown.delay(400).duration(800)}
        className="py-4"
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

      {/* Products List */}
      <FlatList
        data={filteredProducts}
        renderItem={renderProduct}
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <Animated.View 
            entering={FadeInDown.delay(500).duration(800)}
            className="items-center justify-center py-20"
          >
            <Text className="text-6xl mb-4">📦</Text>
            <Text className="text-lg font-semibold text-neutral-800 mb-2">No products found</Text>
            <Text className="text-neutral-600 text-center mb-6">
              Try adjusting your search or add new products
            </Text>
            <Button
              title="Add Product"
              onPress={onAddProductPress}
              icon="➕"
            />
          </Animated.View>
        }
      />
    </SafeAreaView>
  );
};