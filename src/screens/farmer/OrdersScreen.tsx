import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';

interface OrdersScreenProps {
  onOrderPress: (orderId: string) => void;
  onTrackOrder: (orderId: string) => void;
  onReorder: (orderId: string) => void;
  onBack: () => void;
}

interface Order {
  id: string;
  orderNumber: string;
  date: string;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  total: string;
  items: number;
  shopName: string;
  estimatedDelivery?: string;
}

export const OrdersScreen: React.FC<OrdersScreenProps> = ({
  onOrderPress,
  onTrackOrder,
  onReorder,
  onBack,
}) => {
  const [activeTab, setActiveTab] = React.useState<'active' | 'completed'>('active');

  const orders: Order[] = [
    {
      id: '1',
      orderNumber: 'ORD-2024-001',
      date: '2024-01-15',
      status: 'shipped',
      total: '$127.50',
      items: 3,
      shopName: 'Green Valley Supplies',
      estimatedDelivery: '2024-01-17'
    },
    {
      id: '2',
      orderNumber: 'ORD-2024-002',
      date: '2024-01-12',
      status: 'delivered',
      total: '$89.99',
      items: 2,
      shopName: 'Farm Tech Solutions',
    },
    {
      id: '3',
      orderNumber: 'ORD-2024-003',
      date: '2024-01-10',
      status: 'pending',
      total: '$245.75',
      items: 5,
      shopName: 'AgriCare Center',
      estimatedDelivery: '2024-01-18'
    },
    {
      id: '4',
      orderNumber: 'ORD-2024-004',
      date: '2024-01-08',
      status: 'delivered',
      total: '$156.25',
      items: 4,
      shopName: 'Green Valley Supplies',
    },
  ];

  const activeOrders = orders.filter(order => 
    ['pending', 'confirmed', 'shipped'].includes(order.status)
  );
  
  const completedOrders = orders.filter(order => 
    ['delivered', 'cancelled'].includes(order.status)
  );

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'pending': return 'text-warning bg-warning/20';
      case 'confirmed': return 'text-info bg-info/20';
      case 'shipped': return 'text-primary-600 bg-primary-100';
      case 'delivered': return 'text-success bg-success/20';
      case 'cancelled': return 'text-error bg-error/20';
      default: return 'text-neutral-600 bg-neutral-100';
    }
  };

  const getStatusIcon = (status: Order['status']) => {
    switch (status) {
      case 'pending': return '⏳';
      case 'confirmed': return '✅';
      case 'shipped': return '🚚';
      case 'delivered': return '📦';
      case 'cancelled': return '❌';
      default: return '📋';
    }
  };

  const displayOrders = activeTab === 'active' ? activeOrders : completedOrders;

  return (
    <SafeAreaView className="flex-1 bg-neutral-50">
      {/* Header */}
      <Animated.View 
        entering={FadeInUp.delay(200).duration(800)}
        className="px-6 pt-4 pb-6 bg-white"
      >
        <View className="flex-row items-center justify-between mb-6">
          <TouchableOpacity onPress={onBack} className="p-2 -ml-2">
            <Text className="text-2xl">←</Text>
          </TouchableOpacity>
          <Text className="text-lg font-semibold text-primary-800">My Orders</Text>
          <TouchableOpacity className="p-2">
            <Text className="text-xl">🔍</Text>
          </TouchableOpacity>
        </View>

        {/* Tabs */}
        <View className="flex-row bg-neutral-100 rounded-xl p-1">
          <TouchableOpacity
            onPress={() => setActiveTab('active')}
            className={`flex-1 py-3 rounded-lg ${
              activeTab === 'active' ? 'bg-white shadow-sm' : ''
            }`}
          >
            <Text className={`text-center font-medium ${
              activeTab === 'active' ? 'text-primary-800' : 'text-neutral-600'
            }`}>
              Active ({activeOrders.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveTab('completed')}
            className={`flex-1 py-3 rounded-lg ${
              activeTab === 'completed' ? 'bg-white shadow-sm' : ''
            }`}
          >
            <Text className={`text-center font-medium ${
              activeTab === 'completed' ? 'text-primary-800' : 'text-neutral-600'
            }`}>
              Completed ({completedOrders.length})
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* Orders List */}
      <ScrollView className="flex-1 px-6" showsVerticalScrollIndicator={false}>
        {displayOrders.length === 0 ? (
          <Animated.View 
            entering={FadeInDown.delay(400).duration(800)}
            className="items-center justify-center py-20"
          >
            <Text className="text-6xl mb-4">📦</Text>
            <Text className="text-lg font-semibold text-neutral-800 mb-2">
              No {activeTab} orders
            </Text>
            <Text className="text-neutral-600 text-center">
              {activeTab === 'active' 
                ? 'Start shopping to see your orders here'
                : 'Your completed orders will appear here'
              }
            </Text>
          </Animated.View>
        ) : (
          displayOrders.map((order, index) => (
            <Animated.View
              key={order.id}
              entering={FadeInDown.delay(300 + index * 100).duration(600)}
              className="mb-4"
            >
              <Card onPress={() => onOrderPress(order.id)}>
                <View className="flex-row items-start justify-between mb-4">
                  <View className="flex-1">
                    <Text className="text-lg font-semibold text-neutral-800 mb-1">
                      {order.orderNumber}
                    </Text>
                    <Text className="text-sm text-neutral-600 mb-2">
                      {order.shopName} • {order.date}
                    </Text>
                    <View className={`self-start px-2 py-1 rounded-full ${getStatusColor(order.status)}`}>
                      <Text className="text-xs font-medium">
                        {getStatusIcon(order.status)} {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </Text>
                    </View>
                  </View>
                  <View className="items-end">
                    <Text className="text-lg font-bold text-primary-600 mb-1">
                      {order.total}
                    </Text>
                    <Text className="text-sm text-neutral-600">
                      {order.items} items
                    </Text>
                  </View>
                </View>

                {order.estimatedDelivery && (
                  <View className="bg-primary-50 p-3 rounded-xl mb-4">
                    <Text className="text-sm text-primary-700">
                      🚚 Estimated delivery: {order.estimatedDelivery}
                    </Text>
                  </View>
                )}

                <View className="flex-row space-x-3">
                  {activeTab === 'active' ? (
                    <Button
                      title="Track Order"
                      onPress={() => onTrackOrder(order.id)}
                      variant="outline"
                      size="sm"
                      className="flex-1"
                    />
                  ) : (
                    <Button
                      title="Reorder"
                      onPress={() => onReorder(order.id)}
                      variant="outline"
                      size="sm"
                      className="flex-1"
                    />
                  )}
                  <Button
                    title="View Details"
                    onPress={() => onOrderPress(order.id)}
                    size="sm"
                    className="flex-1"
                  />
                </View>
              </Card>
            </Animated.View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  );
};