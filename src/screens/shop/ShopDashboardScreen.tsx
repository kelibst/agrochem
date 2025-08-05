import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';

interface ShopDashboardScreenProps {
  onOrderPress: (orderId: string) => void;
  onInventoryPress: () => void;
  onAnalyticsPress: () => void;
  onMessagesPress: () => void;
  onAddProductPress: () => void;
}

export const ShopDashboardScreen: React.FC<ShopDashboardScreenProps> = ({
  onOrderPress,
  onInventoryPress,
  onAnalyticsPress,
  onMessagesPress,
  onAddProductPress,
}) => {
  const todayStats = {
    revenue: '$1,247.50',
    orders: 12,
    visitors: 89,
    conversion: '13.5%'
  };

  const recentOrders = [
    { id: '1', customer: 'John Farmer', amount: '$89.50', status: 'pending', time: '10:30 AM' },
    { id: '2', customer: 'Sarah Green', amount: '$156.75', status: 'confirmed', time: '09:15 AM' },
    { id: '3', customer: 'Mike Johnson', amount: '$67.25', status: 'shipped', time: '08:45 AM' },
  ];

  const lowStockProducts = [
    { id: '1', name: 'NPK Fertilizer', stock: 5, minStock: 20 },
    { id: '2', name: 'Organic Pesticide', stock: 2, minStock: 15 },
    { id: '3', name: 'Corn Seeds', stock: 8, minStock: 25 },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-warning bg-warning/20';
      case 'confirmed': return 'text-info bg-info/20';
      case 'shipped': return 'text-primary-600 bg-primary-100';
      default: return 'text-neutral-600 bg-neutral-100';
    }
  };

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
              <Text className="text-2xl font-bold text-primary-800">Dashboard 📊</Text>
              <Text className="text-primary-600">Green Valley Supplies</Text>
            </View>
            <View className="flex-row space-x-3">
              <TouchableOpacity 
                onPress={onMessagesPress}
                className="w-12 h-12 bg-primary-100 rounded-xl items-center justify-center"
              >
                <Text className="text-xl">💬</Text>
              </TouchableOpacity>
              <TouchableOpacity className="w-12 h-12 bg-primary-100 rounded-xl items-center justify-center">
                <Text className="text-xl">🔔</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View className="bg-gradient-to-r from-primary-500 to-primary-600 rounded-2xl p-4">
            <Text className="text-white text-lg font-semibold mb-2">Today's Performance</Text>
            <View className="flex-row justify-between">
              <View className="items-center">
                <Text className="text-primary-100 text-sm">Revenue</Text>
                <Text className="text-white font-bold text-lg">{todayStats.revenue}</Text>
              </View>
              <View className="items-center">
                <Text className="text-primary-100 text-sm">Orders</Text>
                <Text className="text-white font-bold text-lg">{todayStats.orders}</Text>
              </View>
              <View className="items-center">
                <Text className="text-primary-100 text-sm">Visitors</Text>
                <Text className="text-white font-bold text-lg">{todayStats.visitors}</Text>
              </View>
              <View className="items-center">
                <Text className="text-primary-100 text-sm">Conversion</Text>
                <Text className="text-white font-bold text-lg">{todayStats.conversion}</Text>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Quick Actions */}
        <Animated.View 
          entering={FadeInDown.delay(300).duration(800)}
          className="px-6 mb-6"
        >
          <Text className="text-lg font-bold text-neutral-800 mb-4">Quick Actions</Text>
          <View className="flex-row space-x-4 mb-4">
            <View className="flex-1">
              <Card onPress={onAddProductPress} className="p-4 bg-primary-50">
                <View className="items-center">
                  <Text className="text-2xl mb-2">➕</Text>
                  <Text className="text-sm font-medium text-primary-800">Add Product</Text>
                </View>
              </Card>
            </View>
            <View className="flex-1">
              <Card onPress={onInventoryPress} className="p-4 bg-accent-50">
                <View className="items-center">
                  <Text className="text-2xl mb-2">📦</Text>
                  <Text className="text-sm font-medium text-accent-800">Inventory</Text>
                </View>
              </Card>
            </View>
            <View className="flex-1">
              <Card onPress={onAnalyticsPress} className="p-4 bg-info/10">
                <View className="items-center">
                  <Text className="text-2xl mb-2">📈</Text>
                  <Text className="text-sm font-medium text-info">Analytics</Text>
                </View>
              </Card>
            </View>
          </View>
        </Animated.View>

        {/* Recent Orders */}
        <Animated.View 
          entering={FadeInDown.delay(400).duration(800)}
          className="px-6 mb-6"
        >
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-lg font-bold text-neutral-800">Recent Orders</Text>
            <TouchableOpacity>
              <Text className="text-primary-600 font-medium">View All</Text>
            </TouchableOpacity>
          </View>
          
          {recentOrders.map((order, index) => (
            <Animated.View
              key={order.id}
              entering={FadeInDown.delay(500 + index * 100).duration(600)}
              className="mb-3"
            >
              <Card onPress={() => onOrderPress(order.id)}>
                <View className="flex-row items-center justify-between">
                  <View className="flex-1">
                    <Text className="text-base font-semibold text-neutral-800 mb-1">
                      {order.customer}
                    </Text>
                    <View className="flex-row items-center">
                      <View className={`px-2 py-1 rounded-full mr-3 ${getStatusColor(order.status)}`}>
                        <Text className="text-xs font-medium capitalize">{order.status}</Text>
                      </View>
                      <Text className="text-sm text-neutral-600">{order.time}</Text>
                    </View>
                  </View>
                  <Text className="text-lg font-bold text-primary-600">{order.amount}</Text>
                </View>
              </Card>
            </Animated.View>
          ))}
        </Animated.View>

        {/* Low Stock Alert */}
        <Animated.View 
          entering={FadeInDown.delay(700).duration(800)}
          className="px-6 mb-6"
        >
          <View className="flex-row items-center justify-between mb-4">
            <Text className="text-lg font-bold text-neutral-800">
              ⚠️ Low Stock Alert
            </Text>
            <TouchableOpacity onPress={onInventoryPress}>
              <Text className="text-primary-600 font-medium">Manage</Text>
            </TouchableOpacity>
          </View>
          
          <Card className="bg-warning/5 border border-warning/20">
            {lowStockProducts.map((product, index) => (
              <View 
                key={product.id}
                className={`flex-row items-center justify-between py-3 ${
                  index < lowStockProducts.length - 1 ? 'border-b border-warning/10' : ''
                }`}
              >
                <View>
                  <Text className="text-base font-medium text-neutral-800">{product.name}</Text>
                  <Text className="text-sm text-warning">
                    Only {product.stock} left (Min: {product.minStock})
                  </Text>
                </View>
                <Button
                  title="Restock"
                  onPress={() => {}}
                  variant="outline"
                  size="sm"
                />
              </View>
            ))}
          </Card>
        </Animated.View>

        {/* Weekly Summary */}
        <Animated.View 
          entering={FadeInDown.delay(800).duration(800)}
          className="px-6 pb-6"
        >
          <Text className="text-lg font-bold text-neutral-800 mb-4">This Week</Text>
          <Card>
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-base font-medium text-neutral-800">Weekly Summary</Text>
              <TouchableOpacity onPress={onAnalyticsPress}>
                <Text className="text-primary-600 font-medium">View Details</Text>
              </TouchableOpacity>
            </View>
            
            <View className="space-y-3">
              <View className="flex-row justify-between">
                <Text className="text-neutral-600">Total Revenue</Text>
                <Text className="font-semibold text-neutral-800">$8,456.25</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-neutral-600">Orders Completed</Text>
                <Text className="font-semibold text-neutral-800">67</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-neutral-600">New Customers</Text>
                <Text className="font-semibold text-neutral-800">12</Text>
              </View>
              <View className="flex-row justify-between">
                <Text className="text-neutral-600">Average Order Value</Text>
                <Text className="font-semibold text-neutral-800">$126.21</Text>
              </View>
            </View>
          </Card>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
};