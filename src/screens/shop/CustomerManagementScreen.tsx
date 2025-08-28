import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { useTheme } from '../../context/ThemeContext';

interface CustomerManagementScreenProps {
  onBackPress: () => void;
  onCustomerPress: (customerId: string) => void;
}

export const CustomerManagementScreen: React.FC<CustomerManagementScreenProps> = ({
  onBackPress,
  onCustomerPress,
}) => {
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'active' | 'new' | 'inactive'>('all');

  const customers = [
    {
      id: '1',
      name: 'John Farmer',
      email: 'john@farmstead.com',
      phone: '+1 (555) 123-4567',
      location: 'Green Valley, CA',
      totalOrders: 15,
      totalSpent: 'GHC 2,450.75',
      lastOrder: '2 days ago',
      status: 'active',
      joinDate: 'Jan 2024',
      rating: 4.8,
    },
    {
      id: '2',
      name: 'Sarah Green',
      email: 'sarah@greenacres.com',
      phone: '+1 (555) 234-5678',
      location: 'Sunny Fields, TX',
      totalOrders: 23,
      totalSpent: 'GHC 3,890.50',
      lastOrder: '1 day ago',
      status: 'active',
      joinDate: 'Nov 2023',
      rating: 4.9,
    },
    {
      id: '3',
      name: 'Mike Johnson',
      email: 'mike@johnsonfarm.net',
      phone: '+1 (555) 345-6789',
      location: 'Prairie View, KS',
      totalOrders: 8,
      totalSpent: 'GHc1,230.25',
      lastOrder: '1 week ago',
      status: 'new',
      joinDate: 'Mar 2024',
      rating: 4.6,
    },
    {
      id: '4',
      name: 'Lisa Brown',
      email: 'lisa@brownfarms.org',
      phone: '+1 (555) 456-7890',
      location: 'Golden Plains, NE',
      totalOrders: 45,
      totalSpent: 'GHc8,750.00',
      lastOrder: '3 weeks ago',
      status: 'inactive',
      joinDate: 'Jun 2023',
      rating: 4.7,
    },
  ];

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'active':
        return {
          backgroundColor: theme.successContainer,
          color: theme.success,
        };
      case 'new':
        return {
          backgroundColor: theme.infoContainer,
          color: theme.info,
        };
      case 'inactive':
        return {
          backgroundColor: theme.errorContainer,
          color: theme.error,
        };
      default:
        return {
          backgroundColor: theme.surfaceVariant,
          color: theme.textSecondary,
        };
    }
  };

  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         customer.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         customer.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesFilter = selectedFilter === 'all' || customer.status === selectedFilter;
    
    return matchesSearch && matchesFilter;
  });

  const FilterTabs = () => (
    <View style={{ 
      flexDirection: 'row', 
      backgroundColor: theme.surfaceVariant, 
      borderRadius: 12, 
      padding: 4,
      marginBottom: 16,
    }}>
      {(['all', 'active', 'new', 'inactive'] as const).map((filter) => (
        <TouchableOpacity
          key={filter}
          onPress={() => setSelectedFilter(filter)}
          style={{
            flex: 1,
            paddingVertical: 8,
            paddingHorizontal: 12,
            borderRadius: 8,
            backgroundColor: selectedFilter === filter ? theme.primary : 'transparent',
            alignItems: 'center',
          }}
        >
          <Text style={{
            color: selectedFilter === filter ? theme.onPrimary : theme.text,
            fontWeight: selectedFilter === filter ? '600' : '500',
            fontSize: 14,
            textTransform: 'capitalize',
          }}>
            {filter}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

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
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TouchableOpacity 
                onPress={onBackPress}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  backgroundColor: theme.surfaceVariant,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 16,
                }}
              >
                <Text style={{ fontSize: 18 }}>←</Text>
              </TouchableOpacity>
              <View>
                <Text style={{ fontSize: 24, fontWeight: 'bold', color: theme.text }}>Customers 👥</Text>
                <Text style={{ color: theme.textSecondary }}>{filteredCustomers.length} customers</Text>
              </View>
            </View>
          </View>

          {/* Search */}
          <View style={{
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: theme.surfaceVariant,
            borderRadius: 12,
            paddingHorizontal: 16,
            paddingVertical: 12,
            marginBottom: 16,
          }}>
            <Text style={{ fontSize: 16, marginRight: 8, color: theme.textSecondary }}>🔍</Text>
            <TextInput
              style={{
                flex: 1,
                fontSize: 16,
                color: theme.text,
              }}
              placeholder="Search customers..."
              placeholderTextColor={theme.textTertiary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          <FilterTabs />
        </Animated.View>

        {/* Customer List */}
        <Animated.View 
          entering={FadeInDown.delay(400).duration(800)}
          style={{ paddingHorizontal: 24, marginBottom: 24 }}
        >
          {filteredCustomers.map((customer, index) => (
            <Animated.View
              key={customer.id}
              entering={FadeInDown.delay(500 + index * 100).duration(600)}
              style={{ marginBottom: 16 }}
            >
              <Card onPress={() => onCustomerPress(customer.id)}>
                <View style={{ flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                  <View style={{ flex: 1 }}>
                    {/* Customer Name & Status */}
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                      <Text style={{ fontSize: 18, fontWeight: '600', color: theme.text, marginRight: 12 }}>
                        {customer.name}
                      </Text>
                      <View style={{
                        paddingHorizontal: 8,
                        paddingVertical: 4,
                        borderRadius: 12,
                        ...getStatusStyle(customer.status),
                      }}>
                        <Text style={{ 
                          fontSize: 12, 
                          fontWeight: '500', 
                          textTransform: 'capitalize',
                          color: getStatusStyle(customer.status).color 
                        }}>
                          {customer.status}
                        </Text>
                      </View>
                    </View>

                    {/* Contact Info */}
                    <Text style={{ fontSize: 14, color: theme.textSecondary, marginBottom: 2 }}>
                      📧 {customer.email}
                    </Text>
                    <Text style={{ fontSize: 14, color: theme.textSecondary, marginBottom: 2 }}>
                      📞 {customer.phone}
                    </Text>
                    <Text style={{ fontSize: 14, color: theme.textSecondary, marginBottom: 8 }}>
                      📍 {customer.location}
                    </Text>

                    {/* Stats */}
                    <View style={{ flexDirection: 'row', gap: 16, marginBottom: 8 }}>
                      <View>
                        <Text style={{ fontSize: 12, color: theme.textTertiary }}>Orders</Text>
                        <Text style={{ fontSize: 16, fontWeight: '600', color: theme.text }}>
                          {customer.totalOrders}
                        </Text>
                      </View>
                      <View>
                        <Text style={{ fontSize: 12, color: theme.textTertiary }}>Total Spent</Text>
                        <Text style={{ fontSize: 16, fontWeight: '600', color: theme.primary }}>
                          {customer.totalSpent}
                        </Text>
                      </View>
                      <View>
                        <Text style={{ fontSize: 12, color: theme.textTertiary }}>Rating</Text>
                        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                          <Text style={{ color: theme.star, marginRight: 4 }}>★</Text>
                          <Text style={{ fontSize: 16, fontWeight: '600', color: theme.text }}>
                            {customer.rating}
                          </Text>
                        </View>
                      </View>
                    </View>

                    <Text style={{ fontSize: 12, color: theme.textTertiary }}>
                      Last order: {customer.lastOrder} • Joined: {customer.joinDate}
                    </Text>
                  </View>
                </View>
              </Card>
            </Animated.View>
          ))}
        </Animated.View>

        {/* Summary Stats */}
        <Animated.View 
          entering={FadeInDown.delay(700).duration(800)}
          style={{ paddingHorizontal: 24, paddingBottom: 24 }}
        >
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: theme.text, marginBottom: 16 }}>
            Customer Summary
          </Text>
          
          <Card>
            <View style={{ gap: 12 }}>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ color: theme.textSecondary }}>Total Customers</Text>
                <Text style={{ fontWeight: '600', color: theme.text }}>{customers.length}</Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ color: theme.textSecondary }}>Active Customers</Text>
                <Text style={{ fontWeight: '600', color: theme.success }}>
                  {customers.filter(c => c.status === 'active').length}
                </Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ color: theme.textSecondary }}>New This Month</Text>
                <Text style={{ fontWeight: '600', color: theme.info }}>
                  {customers.filter(c => c.status === 'new').length}
                </Text>
              </View>
              <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                <Text style={{ color: theme.textSecondary }}>Average Rating</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                  <Text style={{ color: theme.star, marginRight: 4 }}>★</Text>
                  <Text style={{ fontWeight: '600', color: theme.text }}>
                    {(customers.reduce((sum, c) => sum + c.rating, 0) / customers.length).toFixed(1)}
                  </Text>
                </View>
              </View>
            </View>
          </Card>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
};

