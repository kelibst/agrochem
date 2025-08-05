import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { useTheme } from '../context/ThemeContext';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

interface CardProps {
  children: React.ReactNode;
  onPress?: () => void;
  className?: string;
  variant?: 'default' | 'elevated' | 'outlined';
}

export const Card: React.FC<CardProps> = ({
  children,
  onPress,
  className = '',
  variant = 'default',
}) => {
  const { theme } = useTheme();
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const handlePressIn = () => {
    if (onPress) {
      scale.value = withSpring(0.98);
    }
  };

  const handlePressOut = () => {
    if (onPress) {
      scale.value = withSpring(1);
    }
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'elevated':
        return {
          backgroundColor: theme.cardElevated,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 4,
        };
      case 'outlined':
        return {
          backgroundColor: theme.card,
          borderWidth: 1,
          borderColor: theme.border,
        };
      default:
        return {
          backgroundColor: theme.card,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.05,
          shadowRadius: 4,
          elevation: 2,
        };
    }
  };

  const CardComponent = onPress ? AnimatedTouchableOpacity : View;

  return (
    <CardComponent
      style={[
        onPress ? animatedStyle : undefined,
        {
          borderRadius: 16,
          padding: 16,
          ...getVariantStyles(),
        },
      ]}
      onPress={onPress}
      onPressIn={onPress ? handlePressIn : undefined}
      onPressOut={onPress ? handlePressOut : undefined}
    >
      {children}
    </CardComponent>
  );
};

interface ProductCardProps {
  title: string;
  price: string;
  image?: string;
  category: string;
  rating?: number;
  onPress: () => void;
  onAddToCart?: () => void;
}

export const ProductCard: React.FC<ProductCardProps> = ({
  title,
  price,
  category,
  rating = 0,
  onPress,
  onAddToCart,
}) => {
  const { theme } = useTheme();
  
  return (
    <View style={{ width: 176, marginHorizontal: 8 }}>
      <Card onPress={onPress}>
        <View
          style={{
            height: 128,
            backgroundColor: theme.surfaceVariant,
            borderRadius: 12,
            marginBottom: 12,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <Text style={{ fontSize: 32 }}>🌱</Text>
        </View>
        
        <Text
          style={{
            fontSize: 12,
            color: theme.primary,
            fontWeight: '500',
            marginBottom: 4,
          }}
        >
          {category}
        </Text>
        <Text
          style={{
            fontSize: 14,
            fontWeight: '600',
            color: theme.text,
            marginBottom: 8,
          }}
          numberOfLines={2}
        >
          {title}
        </Text>
        
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          <Text
            style={{
              fontSize: 18,
              fontWeight: 'bold',
              color: theme.primary,
            }}
          >
            {price}
          </Text>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ fontSize: 12, color: theme.accent, marginRight: 4 }}>⭐</Text>
            <Text style={{ fontSize: 12, color: theme.textSecondary }}>{rating.toFixed(1)}</Text>
          </View>
        </View>
        
        {onAddToCart && (
          <TouchableOpacity
            onPress={onAddToCart}
            style={{
              marginTop: 12,
              backgroundColor: theme.primary,
              borderRadius: 8,
              paddingVertical: 8,
              alignItems: 'center',
            }}
          >
            <Text
              style={{
                color: theme.onPrimary,
                fontSize: 14,
                fontWeight: '500',
              }}
            >
              Add to Cart
            </Text>
          </TouchableOpacity>
        )}
      </Card>
    </View>
  );
};

interface ShopCardProps {
  name: string;
  distance: string;
  rating: number;
  productsCount: number;
  isOpen: boolean;
  onPress: () => void;
}

export const ShopCard: React.FC<ShopCardProps> = ({
  name,
  distance,
  rating,
  productsCount,
  isOpen,
  onPress,
}) => {
  const { theme } = useTheme();
  
  return (
    <View style={{ marginBottom: 12 }}>
      <Card onPress={onPress}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <View
            style={{
              width: 64,
              height: 64,
              backgroundColor: theme.primaryContainer,
              borderRadius: 12,
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 16,
            }}
          >
            <Text style={{ fontSize: 24 }}>🏪</Text>
          </View>
          
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
              <Text
                style={{
                  fontSize: 18,
                  fontWeight: '600',
                  color: theme.text,
                }}
              >
                {name}
              </Text>
              <View
                style={{
                  paddingHorizontal: 8,
                  paddingVertical: 4,
                  borderRadius: 12,
                  backgroundColor: isOpen ? theme.success + '20' : theme.error + '20',
                }}
              >
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: '500',
                    color: isOpen ? theme.success : theme.error,
                  }}
                >
                  {isOpen ? 'Open' : 'Closed'}
                </Text>
              </View>
            </View>
            
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <Text
                style={{
                  fontSize: 14,
                  color: theme.textSecondary,
                }}
              >
                {distance} • {productsCount} products
              </Text>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <Text style={{ fontSize: 14, color: theme.accent, marginRight: 4 }}>⭐</Text>
                <Text style={{ fontSize: 14, color: theme.textSecondary }}>{rating.toFixed(1)}</Text>
              </View>
            </View>
          </View>
        </View>
      </Card>
    </View>
  );
};