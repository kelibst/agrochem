import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { useTheme } from '../../context/ThemeContext';
import { collection, query, where, onSnapshot, orderBy } from 'firebase/firestore';
import { firebaseFirestore, firebaseAuth } from '../../config/firebase';

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  location: string;
  totalOrders: number;
  totalSpent: string;
  lastOrder: string;
  status: string;
  joinDate: string;
  rating: number;
  role?: string;
}

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
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        setError(null);

        const currentUser = firebaseAuth.currentUser;
        if (!currentUser) {
          setError('User not authenticated');
          setLoading(false);
          return;
        }

        // Query users collection for farmers
        const customersQuery = query(
          collection(firebaseFirestore, 'users'),
          where('role', '==', 'farmer')
        );

        // Set up real-time listener
        const unsubscribe = onSnapshot(
          customersQuery,
          (snapshot) => {
            const fetchedCustomers: Customer[] = [];
            
            snapshot.forEach((doc) => {
              const data = doc.data();
              const createdAt = data.createdAt?.toDate ? data.createdAt.toDate() : new Date();
              const lastOrderDate = data.lastOrderDate?.toDate ? data.lastOrderDate.toDate() : null;
              
              // Calculate relative time for join date
              const joinDateFormatted = new Intl.DateTimeFormat('en-US', { 
                month: 'short', 
                year: 'numeric' 
              }).format(createdAt);
              
              // Calculate relative time for last order
              const getRelativeTime = (date: Date | null) => {
                if (!date) return 'No orders yet';
                const diff = Date.now() - date.getTime();
                const days = Math.floor(diff / (1000 * 60 * 60 * 24));
                if (days === 0) return 'Today';
                if (days === 1) return '1 day ago';
                if (days < 7) return `${days} days ago`;
                if (days < 30) return `${Math.floor(days / 7)} week${Math.floor(days / 7) > 1 ? 's' : ''} ago`;
                return `${Math.floor(days / 30)} month${Math.floor(days / 30) > 1 ? 's' : ''} ago`;
              };
              
              // Determine customer status
              const getCustomerStatus = () => {
                const daysSinceJoined = Math.floor((Date.now() - createdAt.getTime()) / (1000 * 60 * 60 * 24));
                if (daysSinceJoined < 30) return 'new';
                if (!lastOrderDate) return 'inactive';
                const daysSinceLastOrder = Math.floor((Date.now() - lastOrderDate.getTime()) / (1000 * 60 * 60 * 24));
                if (daysSinceLastOrder > 30) return 'inactive';
                return 'active';
              };
              
              fetchedCustomers.push({
                id: doc.id,
                name: data.profile?.name || data.fullName || data.name || 'Unknown',
                email: data.email || '',
                phone: data.profile?.phone || data.phoneNumber || data.phone || '',
                location: data.profile?.address || data.location || data.address || 'Location not set',
                totalOrders: data.totalOrders || 0,
                totalSpent: `GHC ${(data.totalSpent || 0).toFixed(2)}`,
                lastOrder: getRelativeTime(lastOrderDate),
                status: getCustomerStatus(),
                joinDate: joinDateFormatted,
                rating: data.rating || 4.0,
                role: data.role
              });
            });
            
            // Shuffle the customers array for random display
            const shuffledCustomers = [...fetchedCustomers].sort(() => Math.random() - 0.5);
            setCustomers(shuffledCustomers);
            setLoading(false);
          },
          (error) => {
            console.error('Error fetching customers:', error);
            setError('Failed to load customers');
            setLoading(false);
          }
        );

        // Cleanup subscription
        return () => unsubscribe();
      } catch (error) {
        console.error('Error setting up customers listener:', error);
        setError('Failed to initialize customer data');
        setLoading(false);
      }
  };

    fetchCustomers();
  }, []);

  console.log(customers, 'customers');

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

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color={theme.primary} />
          <Text style={{ marginTop: 16, color: theme.textSecondary }}>Loading customers...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 24 }}>
          <Text style={{ fontSize: 48, marginBottom: 16 }}>⚠️</Text>
          <Text style={{ fontSize: 18, color: theme.text, marginBottom: 8 }}>Error Loading Customers</Text>
          <Text style={{ color: theme.textSecondary, textAlign: 'center' }}>{error}</Text>
          <TouchableOpacity
            onPress={onBackPress}
            style={{
              marginTop: 24,
              paddingVertical: 12,
              paddingHorizontal: 24,
              backgroundColor: theme.primary,
              borderRadius: 12,
            }}
          >
            <Text style={{ color: theme.onPrimary, fontWeight: '600' }}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

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
          {filteredCustomers.length === 0 ? (
            <View style={{ 
              paddingVertical: 48, 
              alignItems: 'center',
              backgroundColor: theme.surface,
              borderRadius: 12,
            }}>
              <Text style={{ fontSize: 48, marginBottom: 16 }}>🔍</Text>
              <Text style={{ fontSize: 16, color: theme.text, marginBottom: 8 }}>
                No customers found
              </Text>
              <Text style={{ color: theme.textSecondary, textAlign: 'center' }}>
                {searchQuery ? 'Try adjusting your search' : 'No farmers have registered yet'}
              </Text>
            </View>
          ) : (
            filteredCustomers.map((customer, index) => (
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
          ))
          )}
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

