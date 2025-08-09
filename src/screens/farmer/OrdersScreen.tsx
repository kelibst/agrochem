import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { useTheme } from '../../context/ThemeContext';
import { getStatusColor } from '../../utils/themeUtils';

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
  const { theme } = useTheme();
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

  const getStatusStyle = (status: Order['status']) => {
    switch (status) {
      case 'pending': return { color: theme.warning, backgroundColor: theme.warningContainer };
      case 'confirmed': return { color: theme.info, backgroundColor: theme.infoContainer };
      case 'shipped': return { color: theme.primary, backgroundColor: theme.primaryContainer };
      case 'delivered': return { color: theme.success, backgroundColor: theme.successContainer };
      case 'cancelled': return { color: theme.error, backgroundColor: theme.errorContainer };
      default: return { color: theme.textSecondary, backgroundColor: theme.surfaceVariant };
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
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      {/* Header */}
      <Animated.View 
        entering={FadeInUp.delay(200).duration(800)}
        style={{ paddingHorizontal: 24, paddingTop: 16, paddingBottom: 24, backgroundColor: theme.surface }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
          <TouchableOpacity onPress={onBack} style={{ padding: 8, marginLeft: -8 }}>
            <Text style={{ fontSize: 24, color: theme.text }}>←</Text>
          </TouchableOpacity>
          <Text style={{ fontSize: 18, fontWeight: '600', color: theme.primaryDark }}>My Orders</Text>
          <TouchableOpacity style={{ padding: 8 }}>
            <Text style={{ fontSize: 20 }}>🔍</Text>
          </TouchableOpacity>
        </View>

        {/* Tabs */}
        <View style={{ flexDirection: 'row', backgroundColor: theme.surfaceVariant, borderRadius: 12, padding: 4 }}>
          <TouchableOpacity
            onPress={() => setActiveTab('active')}
            style={{
              flex: 1,
              paddingVertical: 12,
              borderRadius: 8,
              backgroundColor: activeTab === 'active' ? theme.surface : 'transparent',
              shadowColor: activeTab === 'active' ? theme.text : 'transparent',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: activeTab === 'active' ? 0.1 : 0,
              shadowRadius: 2,
              elevation: activeTab === 'active' ? 2 : 0,
            }}
          >
            <Text style={{
              textAlign: 'center',
              fontWeight: '500',
              color: activeTab === 'active' ? theme.primaryDark : theme.textSecondary
            }}>
              Active ({activeOrders.length})
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setActiveTab('completed')}
            style={{
              flex: 1,
              paddingVertical: 12,
              borderRadius: 8,
              backgroundColor: activeTab === 'completed' ? theme.surface : 'transparent',
              shadowColor: activeTab === 'completed' ? theme.text : 'transparent',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: activeTab === 'completed' ? 0.1 : 0,
              shadowRadius: 2,
              elevation: activeTab === 'completed' ? 2 : 0,
            }}
          >
            <Text style={{
              textAlign: 'center',
              fontWeight: '500',
              color: activeTab === 'completed' ? theme.primaryDark : theme.textSecondary
            }}>
              Completed ({completedOrders.length})
            </Text>
          </TouchableOpacity>
        </View>
      </Animated.View>

      {/* Orders List */}
      <ScrollView style={{ flex: 1, paddingHorizontal: 24 }} showsVerticalScrollIndicator={false}>
        {displayOrders.length === 0 ? (
          <Animated.View 
            entering={FadeInDown.delay(400).duration(800)}
            style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: 80 }}
          >
            <Text style={{ fontSize: 60, marginBottom: 16 }}>📦</Text>
            <Text style={{ fontSize: 18, fontWeight: '600', color: theme.text, marginBottom: 8 }}>
              No {activeTab} orders
            </Text>
            <Text style={{ color: theme.textSecondary, textAlign: 'center' }}>
              {activeTab === 'active' 
                ? 'Start shopping to see your orders here'
                : 'Your completed orders will appear here'
              }
            </Text>
          </Animated.View>
        ) : (
          displayOrders.map((order, index) => {
            const statusStyle = getStatusStyle(order.status);
            return (
            <Animated.View
              key={order.id}
              entering={FadeInDown.delay(300 + index * 100).duration(600)}
              style={{ marginBottom: 16 }}
            >
              <Card onPress={() => onOrderPress(order.id)}>
                <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 16 }}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 18, fontWeight: '600', color: theme.text, marginBottom: 4 }}>
                      {order.orderNumber}
                    </Text>
                    <Text style={{ fontSize: 14, color: theme.textSecondary, marginBottom: 8 }}>
                      {order.shopName} • {order.date}
                    </Text>
                    <View style={{
                      alignSelf: 'flex-start',
                      paddingHorizontal: 8,
                      paddingVertical: 4,
                      borderRadius: 12,
                      backgroundColor: statusStyle.backgroundColor
                    }}>
                      <Text style={{ fontSize: 12, fontWeight: '500', color: statusStyle.color }}>
                        {getStatusIcon(order.status)} {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </Text>
                    </View>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={{ fontSize: 18, fontWeight: 'bold', color: theme.primary, marginBottom: 4 }}>
                      {order.total}
                    </Text>
                    <Text style={{ fontSize: 14, color: theme.textSecondary }}>
                      {order.items} items
                    </Text>
                  </View>
                </View>

                {order.estimatedDelivery && (
                  <View style={{ backgroundColor: theme.primaryContainer, padding: 12, borderRadius: 12, marginBottom: 16 }}>
                    <Text style={{ fontSize: 14, color: theme.onPrimaryContainer }}>
                      🚚 Estimated delivery: {order.estimatedDelivery}
                    </Text>
                  </View>
                )}

                <View style={{ flexDirection: 'row', gap: 12 }}>
                  <View style={{ flex: 1 }}>
                    {activeTab === 'active' ? (
                      <Button
                        title="Track Order"
                        onPress={() => onTrackOrder(order.id)}
                        variant="outline"
                        size="sm"
                      />
                    ) : (
                      <Button
                        title="Reorder"
                        onPress={() => onReorder(order.id)}
                        variant="outline"
                        size="sm"
                      />
                    )}
                  </View>
                  <View style={{ flex: 1 }}>
                    <Button
                      title="View Details"
                      onPress={() => onOrderPress(order.id)}
                      size="sm"
                    />
                  </View>
                </View>
              </Card>
            </Animated.View>
          );})
        )}
      </ScrollView>
    </SafeAreaView>
  );
};