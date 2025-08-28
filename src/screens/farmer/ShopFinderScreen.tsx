import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  FadeInUp,
  FadeInDown,
  SlideInRight,
  BounceIn,
  Layout,
} from 'react-native-reanimated';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { useTheme } from '../../context/ThemeContext';

const { width } = Dimensions.get('window');

interface Shop {
  id: string;
  name: string;
  rating: number;
  reviews: number;
  distance: number;
  address: string;
  phone: string;
  specialties: string[];
  isOpen: boolean;
  openHours: string;
  verified: boolean;
  image: string;
  deliveryAvailable: boolean;
  deliveryFee: number;
  minOrder: number;
}

interface ShopFinderScreenProps {
  onBack: () => void;
  onShopPress: (shopId: string) => void;
  onCallShop: (phone: string) => void;
  onGetDirections: (shopId: string) => void;
  onMessageShop: (shopId: string) => void;
}

export const ShopFinderScreen: React.FC<ShopFinderScreenProps> = ({
  onBack,
  onShopPress,
  onCallShop,
  onGetDirections,
  onMessageShop,
}) => {
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'open' | 'delivery' | 'nearby'>('all');
  const [viewMode, setViewMode] = useState<'list' | 'map'>('list');

  // Mock shops data
  const [shops] = useState<Shop[]>([
    {
      id: '1',
      name: 'Green Valley Supplies',
      rating: 4.9,
      reviews: 234,
      distance: 2.5,
      address: '123 Farm Road, Agricultural District',
      phone: '+1 (555) 123-4567',
      specialties: ['Fertilizers', 'Seeds', 'Pesticides'],
      isOpen: true,
      openHours: '8:00 AM - 6:00 PM',
      verified: true,
      image: '🏪',
      deliveryAvailable: true,
      deliveryFee: 5.99,
      minOrder: 50,
    },
    {
      id: '2',
      name: 'EcoFarm Solutions',
      rating: 4.7,
      reviews: 189,
      distance: 4.2,
      address: '456 Organic Lane, Green Valley',
      phone: '+1 (555) 987-6543',
      specialties: ['Organic Products', 'Bio-fertilizers', 'Tools'],
      isOpen: true,
      openHours: '7:30 AM - 7:00 PM',
      verified: true,
      image: '🌱',
      deliveryAvailable: true,
      deliveryFee: 7.99,
      minOrder: 75,
    },
    {
      id: '3',
      name: 'AgriTools Pro',
      rating: 4.6,
      reviews: 156,
      distance: 6.8,
      address: '789 Equipment Street, Industrial Zone',
      phone: '+1 (555) 456-7890',
      specialties: ['Equipment', 'Tools', 'Machinery'],
      isOpen: false,
      openHours: '9:00 AM - 5:00 PM',
      verified: false,
      image: '🔧',
      deliveryAvailable: false,
      deliveryFee: 0,
      minOrder: 0,
    },
    {
      id: '4',
      name: 'FarmFresh Depot',
      rating: 4.8,
      reviews: 312,
      distance: 8.1,
      address: '321 Supply Avenue, Market District',
      phone: '+1 (555) 321-0987',
      specialties: ['Seeds', 'Fertilizers', 'Irrigation'],
      isOpen: true,
      openHours: '6:00 AM - 8:00 PM',
      verified: true,
      image: '🚚',
      deliveryAvailable: true,
      deliveryFee: 9.99,
      minOrder: 100,
    },
  ]);

  const filteredShops = shops.filter(shop => {
    const matchesSearch = shop.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         shop.specialties.some(specialty => 
                           specialty.toLowerCase().includes(searchQuery.toLowerCase())
                         );

    switch (selectedFilter) {
      case 'open':
        return matchesSearch && shop.isOpen;
      case 'delivery':
        return matchesSearch && shop.deliveryAvailable;
      case 'nearby':
        return matchesSearch && shop.distance <= 5;
      default:
        return matchesSearch;
    }
  });

  const filters = [
    { id: 'all', label: 'All Shops', icon: '🏪' },
    { id: 'open', label: 'Open Now', icon: '🟢' },
    { id: 'delivery', label: 'Delivery', icon: '🚚' },
    { id: 'nearby', label: 'Nearby', icon: '📍' },
  ];

  const ShopCard = ({ shop, index }: { shop: Shop; index: number }) => (
    <Animated.View
      key={shop.id}
      entering={SlideInRight.delay(index * 100).duration(600)}
      layout={Layout.springify()}
      style={{ marginBottom: 16 }}
    >
      <Card onPress={() => onShopPress(shop.id)}>
        <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
          {/* Shop Image/Icon */}
          <View
            style={{
              width: 60,
              height: 60,
              backgroundColor: theme.primaryContainer,
              borderRadius: 12,
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 16,
            }}
          >
            <Text style={{ fontSize: 24 }}>{shop.image}</Text>
          </View>

          {/* Shop Info */}
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: 'bold',
                  color: theme.text,
                  flex: 1,
                }}
                numberOfLines={1}
              >
                {shop.name}
              </Text>
              {shop.verified && (
                <Text style={{ color: theme.primary, marginLeft: 4 }}>✓</Text>
              )}
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
              <Text style={{ color: theme.star, marginRight: 4 }}>★</Text>
              <Text style={{ fontSize: 14, color: theme.text, fontWeight: '600', marginRight: 4 }}>
                {shop.rating}
              </Text>
              <Text style={{ fontSize: 14, color: theme.textSecondary, marginRight: 8 }}>
                ({shop.reviews})
              </Text>
              <Text style={{ fontSize: 14, color: theme.textSecondary }}>
                {shop.distance} km away
              </Text>
            </View>

            <Text
              style={{
                fontSize: 12,
                color: theme.textSecondary,
                marginBottom: 8,
              }}
              numberOfLines={1}
            >
              {shop.address}
            </Text>

            {/* Status and Hours */}
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
              <View
                style={{
                  backgroundColor: shop.isOpen ? theme.success + '20' : theme.error + '20',
                  paddingHorizontal: 8,
                  paddingVertical: 4,
                  borderRadius: 6,
                  marginRight: 8,
                }}
              >
                <Text
                  style={{
                    fontSize: 12,
                    color: shop.isOpen ? theme.success : theme.error,
                    fontWeight: '600',
                  }}
                >
                  {shop.isOpen ? 'Open' : 'Closed'}
                </Text>
              </View>
              <Text style={{ fontSize: 12, color: theme.textSecondary }}>
                {shop.openHours}
              </Text>
            </View>

            {/* Specialties */}
            <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 12 }}>
              {shop.specialties.slice(0, 3).map((specialty, idx) => (
                <View
                  key={idx}
                  style={{
                    backgroundColor: theme.secondaryContainer,
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                    borderRadius: 6,
                    marginRight: 6,
                    marginBottom: 4,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 11,
                      color: theme.onSecondaryContainer,
                      fontWeight: '600',
                    }}
                  >
                    {specialty}
                  </Text>
                </View>
              ))}
            </View>

            {/* Delivery Info */}
            {shop.deliveryAvailable && (
              <View
                style={{
                  backgroundColor: theme.primaryContainer,
                  padding: 8,
                  borderRadius: 8,
                  marginBottom: 12,
                }}
              >
                <Text
                  style={{
                    fontSize: 12,
                    color: theme.onPrimaryContainer,
                    fontWeight: '600',
                  }}
                >
                  🚚 Delivery: GHC ${shop.deliveryFee} • Min order: GHC ${shop.minOrder}
                </Text>
              </View>
            )}

            {/* Action Buttons */}
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <TouchableOpacity
                  onPress={() => onCallShop(shop.phone)}
                  style={{
                    backgroundColor: theme.success + '20',
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    borderRadius: 6,
                    marginRight: 8,
                  }}
                >
                  <Text style={{ fontSize: 12, color: theme.success, fontWeight: '600' }}>
                    📞 Call
                  </Text>
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() => onMessageShop(shop.id)}
                  style={{
                    backgroundColor: theme.primaryContainer,
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    borderRadius: 6,
                    marginRight: 8,
                  }}
                >
                  <Text style={{ fontSize: 12, color: theme.onPrimaryContainer, fontWeight: '600' }}>
                    💬 Message
                  </Text>
                </TouchableOpacity>
              </View>

              <TouchableOpacity
                onPress={() => onGetDirections(shop.id)}
                style={{
                  backgroundColor: theme.accent + '20',
                  paddingHorizontal: 12,
                  paddingVertical: 6,
                  borderRadius: 6,
                }}
              >
                <Text style={{ fontSize: 12, color: theme.accent, fontWeight: '600' }}>
                  📍 Directions
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Card>
    </Animated.View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      {/* Header */}
      <Animated.View
        entering={FadeInUp.delay(200).duration(600)}
        style={{
          backgroundColor: theme.surface,
          paddingHorizontal: 20,
          paddingVertical: 16,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <TouchableOpacity onPress={onBack} style={{ padding: 8, marginLeft: -8 }}>
            <Text style={{ fontSize: 24, color: theme.text }}>←</Text>
          </TouchableOpacity>
          <Text style={{ fontSize: 18, fontWeight: '600', color: theme.text }}>
            Find Shops
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <TouchableOpacity
              onPress={() => setViewMode(viewMode === 'list' ? 'map' : 'list')}
              style={{
                backgroundColor: theme.primaryContainer,
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 8,
              }}
            >
              <Text style={{ fontSize: 12, color: theme.onPrimaryContainer, fontWeight: '600' }}>
                {viewMode === 'list' ? '🗺️ Map' : '📋 List'}
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Search Bar */}
        <Input
          placeholder="Search shops or products..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          leftIcon="🔍"
          style={{ marginBottom: 16 }}
        />

        {/* Filter Tabs */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {filters.map((filter, index) => (
            <Animated.View
              key={filter.id}
              entering={SlideInRight.delay(300 + index * 50).duration(400)}
            >
              <TouchableOpacity
                onPress={() => setSelectedFilter(filter.id as any)}
                style={{
                  backgroundColor: selectedFilter === filter.id ? theme.primary : theme.surfaceVariant,
                  paddingHorizontal: 16,
                  paddingVertical: 10,
                  borderRadius: 20,
                  marginRight: 12,
                  flexDirection: 'row',
                  alignItems: 'center',
                }}
              >
                <Text style={{ fontSize: 14, marginRight: 6 }}>{filter.icon}</Text>
                <Text
                  style={{
                    fontSize: 14,
                    fontWeight: '600',
                    color: selectedFilter === filter.id ? theme.onPrimary : theme.text,
                  }}
                >
                  {filter.label}
                </Text>
              </TouchableOpacity>
            </Animated.View>
          ))}
        </ScrollView>
      </Animated.View>

      {viewMode === 'map' ? (
        /* Map View Placeholder */
        <Animated.View
          entering={FadeInDown.delay(400).duration(600)}
          style={{
            flex: 1,
            backgroundColor: theme.surfaceVariant,
            margin: 20,
            borderRadius: 16,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text style={{ fontSize: 60, marginBottom: 16 }}>🗺️</Text>
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: theme.text, marginBottom: 8 }}>
            Map View
          </Text>
          <Text style={{ fontSize: 14, color: theme.textSecondary, textAlign: 'center', paddingHorizontal: 32 }}>
            Interactive map showing nearby shops would be integrated here using Google Maps or similar service.
          </Text>
          
          {/* Mock Map Pins */}
          <View style={{ position: 'absolute', top: 100, left: 80 }}>
            <Text style={{ fontSize: 32 }}>📍</Text>
          </View>
          <View style={{ position: 'absolute', top: 150, right: 100 }}>
            <Text style={{ fontSize: 32 }}>📍</Text>
          </View>
          <View style={{ position: 'absolute', bottom: 120, left: 120 }}>
            <Text style={{ fontSize: 32 }}>📍</Text>
          </View>
        </Animated.View>
      ) : (
        /* List View */
        <>
          {/* Results Header */}
          <Animated.View
            entering={FadeInDown.delay(400).duration(600)}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingHorizontal: 20,
              paddingVertical: 16,
            }}
          >
            <Text style={{ fontSize: 16, fontWeight: '600', color: theme.text }}>
              {filteredShops.length} shops found
            </Text>
            <TouchableOpacity
              style={{
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: theme.surfaceVariant,
                paddingHorizontal: 12,
                paddingVertical: 6,
                borderRadius: 8,
              }}
            >
              <Text style={{ fontSize: 12, color: theme.text, fontWeight: '600', marginRight: 4 }}>
                Sort by Distance
              </Text>
              <Text style={{ fontSize: 12, color: theme.text }}>↕️</Text>
            </TouchableOpacity>
          </Animated.View>

          {filteredShops.length === 0 ? (
            /* No Results */
            <Animated.View
              entering={FadeInDown.delay(600).duration(800)}
              style={{
                flex: 1,
                alignItems: 'center',
                justifyContent: 'center',
                paddingHorizontal: 32,
              }}
            >
              <Text style={{ fontSize: 80, marginBottom: 24 }}>🔍</Text>
              <Text
                style={{
                  fontSize: 24,
                  fontWeight: 'bold',
                  color: theme.text,
                  textAlign: 'center',
                  marginBottom: 12,
                }}
              >
                No shops found
              </Text>
              <Text
                style={{
                  fontSize: 16,
                  color: theme.textSecondary,
                  textAlign: 'center',
                  marginBottom: 32,
                  lineHeight: 24,
                }}
              >
                Try adjusting your search terms or filters to find more shops in your area.
              </Text>
              <Button
                title="Clear Filters"
                onPress={() => {
                  setSearchQuery('');
                  setSelectedFilter('all');
                }}
                variant="outline"
              />
            </Animated.View>
          ) : (
            /* Shop List */
            <ScrollView
              style={{ flex: 1, paddingHorizontal: 20 }}
              showsVerticalScrollIndicator={false}
            >
              {filteredShops.map((shop, index) => (
                <ShopCard key={shop.id} shop={shop} index={index} />
              ))}
              <View style={{ height: 20 }} />
            </ScrollView>
          )}
        </>
      )}
    </SafeAreaView>
  );
};

