import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { useTheme } from '../../context/ThemeContext';

interface ShopDashboardScreenProps {
  onOrderPress: (orderId: string) => void;
  onInventoryPress: () => void;
  onAnalyticsPress: () => void;
  onMessagesPress: () => void;
  onAddProductPress: () => void;
  onCustomerManagementPress: () => void;
}

export const ShopDashboardScreen: React.FC<ShopDashboardScreenProps> = ({
  onOrderPress,
  onInventoryPress,
  onAnalyticsPress,
  onMessagesPress,
  onAddProductPress,
  onCustomerManagementPress,
}) => {
  const { theme } = useTheme();
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

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'pending': 
        return {
          color: theme.warning,
          backgroundColor: theme.warningContainer,
        };
      case 'confirmed': 
        return {
          color: theme.info,
          backgroundColor: theme.infoContainer,
        };
      case 'shipped': 
        return {
          color: theme.primary,
          backgroundColor: theme.primaryContainer,
        };
      default: 
        return {
          color: theme.textSecondary,
          backgroundColor: theme.surfaceVariant,
        };
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Animated.View 
          entering={FadeInUp.delay(200).duration(800)}
          style={{
            paddingHorizontal: 24,
            paddingTop: 16,
            paddingBottom: 24,
            backgroundColor: theme.surface,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <View>
              <Text style={{ fontSize: 24, fontWeight: 'bold', color: theme.text }}>Dashboard 📊</Text>
              <Text style={{ color: theme.primary }}>Green Valley Supplies</Text>
            </View>
            <View style={{ flexDirection: 'row', gap: 12 }}>
              <TouchableOpacity 
                onPress={onMessagesPress}
                style={{
                  width: 48,
                  height: 48,
                  backgroundColor: theme.primaryContainer,
                  borderRadius: 12,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text style={{ fontSize: 20 }}>💬</Text>
              </TouchableOpacity>
              <TouchableOpacity style={{
                width: 48,
                height: 48,
                backgroundColor: theme.primaryContainer,
                borderRadius: 12,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Text style={{ fontSize: 20 }}>🔔</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={{
            backgroundColor: theme.primary,
            borderRadius: 16,
            padding: 16,
          }}>
            <Text style={{ color: theme.onPrimary, fontSize: 18, fontWeight: '600', marginBottom: 8 }}>Today's Performance</Text>
            <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
              <View style={{ alignItems: 'center' }}>
                <Text style={{ color: theme.onPrimary, fontSize: 12, opacity: 0.8 }}>Revenue</Text>
                <Text style={{ color: theme.onPrimary, fontWeight: 'bold', fontSize: 18 }}>{todayStats.revenue}</Text>
              </View>
              <View style={{ alignItems: 'center' }}>
                <Text style={{ color: theme.onPrimary, fontSize: 12, opacity: 0.8 }}>Orders</Text>
                <Text style={{ color: theme.onPrimary, fontWeight: 'bold', fontSize: 18 }}>{todayStats.orders}</Text>
              </View>
              <View style={{ alignItems: 'center' }}>
                <Text style={{ color: theme.onPrimary, fontSize: 12, opacity: 0.8 }}>Visitors</Text>
                <Text style={{ color: theme.onPrimary, fontWeight: 'bold', fontSize: 18 }}>{todayStats.visitors}</Text>
              </View>
              <View style={{ alignItems: 'center' }}>
                <Text style={{ color: theme.onPrimary, fontSize: 12, opacity: 0.8 }}>Conversion</Text>
                <Text style={{ color: theme.onPrimary, fontWeight: 'bold', fontSize: 18 }}>{todayStats.conversion}</Text>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Quick Actions */}
        <Animated.View 
          entering={FadeInDown.delay(300).duration(800)}
          style={{ paddingHorizontal: 24, marginBottom: 24 }}
        >
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: theme.text, marginBottom: 16 }}>Quick Actions</Text>
          <View style={{ flexDirection: 'row', gap: 16, marginBottom: 16 }}>
            <View style={{ flex: 1 }}>
              <Card onPress={onAddProductPress}>
                <View style={{ padding: 16, backgroundColor: theme.primaryContainer, alignItems: 'center' }}>
                  <Text style={{ fontSize: 24, marginBottom: 8 }}>➕</Text>
                  <Text style={{ fontSize: 14, fontWeight: '500', color: theme.onPrimaryContainer }}>Add Product</Text>
                </View>
              </Card>
            </View>
            <View style={{ flex: 1 }}>
              <Card onPress={onInventoryPress}>
                <View style={{ padding: 16, backgroundColor: theme.accentContainer, alignItems: 'center' }}>
                  <Text style={{ fontSize: 24, marginBottom: 8 }}>📦</Text>
                  <Text style={{ fontSize: 14, fontWeight: '500', color: theme.onAccentContainer }}>Inventory</Text>
                </View>
              </Card>
            </View>
            <View style={{ flex: 1 }}>
              <Card onPress={onAnalyticsPress}>
                <View style={{ padding: 16, backgroundColor: theme.infoContainer, alignItems: 'center' }}>
                  <Text style={{ fontSize: 24, marginBottom: 8 }}>📈</Text>
                  <Text style={{ fontSize: 14, fontWeight: '500', color: theme.text }}>Analytics</Text>
                </View>
              </Card>
            </View>
          </View>
          
          <View style={{ flexDirection: 'row', gap: 16 }}>
            <View style={{ flex: 1 }}>
              <Card onPress={onCustomerManagementPress}>
                <View style={{ padding: 16, backgroundColor: theme.successContainer, alignItems: 'center' }}>
                  <Text style={{ fontSize: 24, marginBottom: 8 }}>👥</Text>
                  <Text style={{ fontSize: 14, fontWeight: '500', color: theme.text }}>Customers</Text>
                </View>
              </Card>
            </View>
            <View style={{ flex: 1 }}>
              <Card onPress={onMessagesPress}>
                <View style={{ padding: 16, backgroundColor: theme.secondaryContainer, alignItems: 'center' }}>
                  <Text style={{ fontSize: 24, marginBottom: 8 }}>💬</Text>
                  <Text style={{ fontSize: 14, fontWeight: '500', color: theme.text }}>Messages</Text>
                </View>
              </Card>
            </View>
            <View style={{ flex: 1 }}>
              {/* Empty space for balance */}
              <View style={{ opacity: 0 }}>
                <Card>
                  <View style={{ padding: 16, alignItems: 'center' }}>
                    <Text style={{ fontSize: 24, marginBottom: 8 }}> </Text>
                    <Text style={{ fontSize: 14, fontWeight: '500' }}> </Text>
                  </View>
                </Card>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Recent Orders */}
        <Animated.View 
          entering={FadeInDown.delay(400).duration(800)}
          style={{ paddingHorizontal: 24, marginBottom: 24 }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: theme.text }}>Recent Orders</Text>
            <TouchableOpacity>
              <Text style={{ color: theme.primary, fontWeight: '500' }}>View All</Text>
            </TouchableOpacity>
          </View>
          
          {recentOrders.map((order, index) => (
            <Animated.View
              key={order.id}
              entering={FadeInDown.delay(500 + index * 100).duration(600)}
              style={{ marginBottom: 12 }}
            >
              <Card onPress={() => onOrderPress(order.id)}>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 16, fontWeight: '600', color: theme.text, marginBottom: 4 }}>
                      {order.customer}
                    </Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <View style={{
                        paddingHorizontal: 8,
                        paddingVertical: 4,
                        borderRadius: 12,
                        marginRight: 12,
                        ...getStatusStyle(order.status),
                      }}>
                        <Text style={{ fontSize: 12, fontWeight: '500', textTransform: 'capitalize', color: getStatusStyle(order.status).color }}>{order.status}</Text>
                      </View>
                      <Text style={{ fontSize: 14, color: theme.textSecondary }}>{order.time}</Text>
                    </View>
                  </View>
                  <Text style={{ fontSize: 18, fontWeight: 'bold', color: theme.primary }}>{order.amount}</Text>
                </View>
              </Card>
            </Animated.View>
          ))}
        </Animated.View>

        {/* Low Stock Alert */}
        <Animated.View 
          entering={FadeInDown.delay(700).duration(800)}
          style={{ paddingHorizontal: 24, marginBottom: 24 }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <Text style={{ fontSize: 18, fontWeight: 'bold', color: theme.text }}>
              ⚠️ Low Stock Alert
            </Text>
            <TouchableOpacity onPress={onInventoryPress}>
              <Text style={{ color: theme.primary, fontWeight: '500' }}>Manage</Text>
            </TouchableOpacity>
          </View>
          
          <Card>
            <View style={{ backgroundColor: theme.warningContainer, borderWidth: 1, borderColor: theme.warning, borderRadius: 12, padding: 16 }}>
            {lowStockProducts.map((product, index) => (
              <View 
                key={product.id}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  paddingVertical: 12,
                  borderBottomWidth: index < lowStockProducts.length - 1 ? 1 : 0,
                  borderBottomColor: theme.warning,
                  opacity: 0.1,
                }}
              >
                <View>
                  <Text style={{ fontSize: 16, fontWeight: '500', color: theme.text }}>{product.name}</Text>
                  <Text style={{ fontSize: 14, color: theme.warning }}>
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
            </View>
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