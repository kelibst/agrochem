import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { useTheme } from '../../context/ThemeContext';

interface RecommendationsScreenProps {
  onBackPress: () => void;
  onProductPress: (productId: string) => void;
  onAddToCart: (productId: string) => void;
}

export const RecommendationsScreen: React.FC<RecommendationsScreenProps> = ({
  onBackPress,
  onProductPress,
  onAddToCart,
}) => {
  const { theme } = useTheme();
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'seasonal' | 'trending' | 'for-you'>('all');

  const recommendations = {
    seasonal: [
      {
        id: '1',
        name: 'Spring Fertilizer Mix',
        price: 45.99,
        reason: 'Perfect for spring planting season',
        category: 'Fertilizers',
        rating: 4.8,
        inStock: true,
        urgency: 'high',
      },
      {
        id: '2',
        name: 'Early Season Herbicide',
        price: 32.50,
        reason: 'Prevent weeds before they establish',
        category: 'Herbicides',
        rating: 4.6,
        inStock: true,
        urgency: 'medium',
      },
    ],
    trending: [
      {
        id: '3',
        name: 'Organic Growth Booster',
        price: 28.75,
        reason: 'Most popular this month',
        category: 'Growth Regulators',
        rating: 4.9,
        inStock: true,
        urgency: 'low',
      },
      {
        id: '4',
        name: 'Bio-Pesticide Spray',
        price: 55.00,
        reason: 'Trending among organic farmers',
        category: 'Pesticides',
        rating: 4.7,
        inStock: false,
        urgency: 'low',
      },
    ],
    'for-you': [
      {
        id: '5',
        name: 'Corn Specific Fertilizer',
        price: 38.90,
        reason: 'Based on your previous corn purchases',
        category: 'Fertilizers',
        rating: 4.8,
        inStock: true,
        urgency: 'medium',
      },
      {
        id: '6',
        name: 'pH Soil Conditioner',
        price: 22.25,
        reason: 'Complements your recent fertilizer order',
        category: 'Soil Amendments',
        rating: 4.5,
        inStock: true,
        urgency: 'low',
      },
    ],
  };

  const allRecommendations = [
    ...recommendations.seasonal,
    ...recommendations.trending,
    ...recommendations['for-you'],
  ];

  const getCurrentRecommendations = () => {
    switch (selectedCategory) {
      case 'seasonal': return recommendations.seasonal;
      case 'trending': return recommendations.trending;
      case 'for-you': return recommendations['for-you'];
      default: return allRecommendations;
    }
  };

  const getUrgencyStyle = (urgency: string) => {
    switch (urgency) {
      case 'high':
        return {
          backgroundColor: theme.errorContainer,
          color: theme.error,
        };
      case 'medium':
        return {
          backgroundColor: theme.warningContainer,
          color: theme.warning,
        };
      default:
        return {
          backgroundColor: theme.infoContainer,
          color: theme.info,
        };
    }
  };

  const FilterTabs = () => (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false}
      style={{ marginBottom: 20 }}
    >
      <View style={{ flexDirection: 'row', gap: 12, paddingHorizontal: 4 }}>
        {([
          { key: 'all', label: 'All', icon: '🌟' },
          { key: 'seasonal', label: 'Seasonal', icon: '🌱' },
          { key: 'trending', label: 'Trending', icon: '📈' },
          { key: 'for-you', label: 'For You', icon: '🎯' },
        ] as const).map((filter) => (
          <TouchableOpacity
            key={filter.key}
            onPress={() => setSelectedCategory(filter.key)}
            style={{
              paddingHorizontal: 20,
              paddingVertical: 10,
              borderRadius: 20,
              backgroundColor: selectedCategory === filter.key ? theme.primary : theme.surfaceVariant,
              borderWidth: 1,
              borderColor: selectedCategory === filter.key ? theme.primary : theme.border,
              flexDirection: 'row',
              alignItems: 'center',
            }}
          >
            <Text style={{ fontSize: 16, marginRight: 6 }}>{filter.icon}</Text>
            <Text style={{
              color: selectedCategory === filter.key ? theme.onPrimary : theme.text,
              fontWeight: selectedCategory === filter.key ? '600' : '500',
              fontSize: 14,
            }}>
              {filter.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
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
                <Text style={{ fontSize: 24, fontWeight: 'bold', color: theme.text }}>Recommendations 💡</Text>
                <Text style={{ color: theme.textSecondary }}>Curated for your farm</Text>
              </View>
            </View>
          </View>

          <FilterTabs />

          {/* Quick Stats */}
          <View style={{ 
            backgroundColor: theme.primaryContainer, 
            borderRadius: 12, 
            padding: 16,
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
            <View>
              <Text style={{ color: theme.onPrimaryContainer, fontSize: 14, fontWeight: '500' }}>
                Recommendations Available
              </Text>
              <Text style={{ color: theme.onPrimaryContainer, fontSize: 20, fontWeight: 'bold' }}>
                {getCurrentRecommendations().length}
              </Text>
            </View>
            <Text style={{ fontSize: 32 }}>🎯</Text>
          </View>
        </Animated.View>

        {/* Recommendations List */}
        <Animated.View 
          entering={FadeInDown.delay(300).duration(800)}
          style={{ paddingHorizontal: 24, marginBottom: 24 }}
        >
          {getCurrentRecommendations().map((product, index) => (
            <Animated.View
              key={product.id}
              entering={FadeInDown.delay(400 + index * 100).duration(600)}
              style={{ marginBottom: 16 }}
            >
              <Card onPress={() => onProductPress(product.id)}>
                <View>
                  {/* Urgency Badge */}
                  {product.urgency === 'high' && (
                    <View style={{
                      position: 'absolute',
                      top: 12,
                      right: 12,
                      paddingHorizontal: 8,
                      paddingVertical: 4,
                      borderRadius: 12,
                      ...getUrgencyStyle(product.urgency),
                      zIndex: 1,
                    }}>
                      <Text style={{ 
                        fontSize: 10, 
                        fontWeight: '600', 
                        color: getUrgencyStyle(product.urgency).color 
                      }}>
                        URGENT
                      </Text>
                    </View>
                  )}

                  <View style={{ marginBottom: 12 }}>
                    <Text style={{ fontSize: 18, fontWeight: '600', color: theme.text, marginBottom: 4 }}>
                      {product.name}
                    </Text>
                    <Text style={{ fontSize: 14, color: theme.primary, marginBottom: 8 }}>
                      {product.reason}
                    </Text>
                    
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                      <View style={{
                        paddingHorizontal: 8,
                        paddingVertical: 4,
                        borderRadius: 12,
                        backgroundColor: theme.accentContainer,
                        marginRight: 12,
                      }}>
                        <Text style={{ fontSize: 12, color: theme.onAccentContainer, fontWeight: '500' }}>
                          {product.category}
                        </Text>
                      </View>
                      
                      <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 12 }}>
                        <Text style={{ color: theme.star, marginRight: 4 }}>★</Text>
                        <Text style={{ fontSize: 14, color: theme.text, fontWeight: '500' }}>
                          {product.rating}
                        </Text>
                      </View>
                      
                      {!product.inStock && (
                        <View style={{
                          paddingHorizontal: 8,
                          paddingVertical: 4,
                          borderRadius: 12,
                          backgroundColor: theme.errorContainer,
                        }}>
                          <Text style={{ fontSize: 12, color: theme.error, fontWeight: '500' }}>
                            Out of Stock
                          </Text>
                        </View>
                      )}
                    </View>
                  </View>

                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Text style={{ fontSize: 20, fontWeight: 'bold', color: theme.primary }}>
                      ${product.price}
                    </Text>
                    
                    <View style={{ flexDirection: 'row', gap: 8 }}>
                      <Button
                        title="View"
                        onPress={() => onProductPress(product.id)}
                        variant="outline"
                        size="sm"
                      />
                      <Button
                        title="Add to Cart"
                        onPress={() => onAddToCart(product.id)}
                        variant="primary"
                        size="sm"
                        disabled={!product.inStock}
                      />
                    </View>
                  </View>
                </View>
              </Card>
            </Animated.View>
          ))}
        </Animated.View>

        {/* Why These Recommendations */}
        <Animated.View 
          entering={FadeInDown.delay(600).duration(800)}
          style={{ paddingHorizontal: 24, paddingBottom: 24 }}
        >
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: theme.text, marginBottom: 16 }}>
            Why These Recommendations?
          </Text>
          
          <Card>
            <View style={{ gap: 12 }}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ fontSize: 16, marginRight: 8 }}>🌾</Text>
                <Text style={{ color: theme.text, flex: 1 }}>
                  Based on your crop types: {'{Corn, Soybeans, Wheat}'}
                </Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ fontSize: 16, marginRight: 8 }}>📊</Text>
                <Text style={{ color: theme.text, flex: 1 }}>
                  Your purchase history and preferences
                </Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ fontSize: 16, marginRight: 8 }}>🌍</Text>
                <Text style={{ color: theme.text, flex: 1 }}>
                  Local climate and soil conditions
                </Text>
              </View>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ fontSize: 16, marginRight: 8 }}>📅</Text>
                <Text style={{ color: theme.text, flex: 1 }}>
                  Current season and farming calendar
                </Text>
              </View>
            </View>
          </Card>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
};

