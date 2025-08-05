import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';

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
        return 'bg-white shadow-lg shadow-neutral-200';
      case 'outlined':
        return 'bg-white border border-neutral-200';
      default:
        return 'bg-white shadow-md shadow-neutral-100';
    }
  };

  const CardComponent = onPress ? AnimatedTouchableOpacity : View;

  return (
    <CardComponent
      style={onPress ? animatedStyle : undefined}
      onPress={onPress}
      onPressIn={onPress ? handlePressIn : undefined}
      onPressOut={onPress ? handlePressOut : undefined}
      className={`
        ${getVariantStyles()}
        rounded-2xl p-4
        ${className}
      `}
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
  return (
    <Card onPress={onPress} className="w-44 mx-2">
      <View className="h-32 bg-neutral-100 rounded-xl mb-3 items-center justify-center">
        <Text className="text-4xl">🌱</Text>
      </View>
      
      <Text className="text-xs text-primary-600 font-medium mb-1">{category}</Text>
      <Text className="text-sm font-semibold text-neutral-800 mb-2" numberOfLines={2}>
        {title}
      </Text>
      
      <View className="flex-row items-center justify-between">
        <Text className="text-lg font-bold text-primary-600">{price}</Text>
        <View className="flex-row items-center">
          <Text className="text-xs text-accent-500 mr-1">⭐</Text>
          <Text className="text-xs text-neutral-600">{rating.toFixed(1)}</Text>
        </View>
      </View>
      
      {onAddToCart && (
        <TouchableOpacity
          onPress={onAddToCart}
          className="mt-3 bg-primary-600 rounded-lg py-2 items-center"
        >
          <Text className="text-white text-sm font-medium">Add to Cart</Text>
        </TouchableOpacity>
      )}
    </Card>
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
  return (
    <Card onPress={onPress} className="mb-3">
      <View className="flex-row items-center">
        <View className="w-16 h-16 bg-primary-100 rounded-xl items-center justify-center mr-4">
          <Text className="text-2xl">🏪</Text>
        </View>
        
        <View className="flex-1">
          <View className="flex-row items-center justify-between mb-1">
            <Text className="text-lg font-semibold text-neutral-800">{name}</Text>
            <View className={`px-2 py-1 rounded-full ${isOpen ? 'bg-success/20' : 'bg-error/20'}`}>
              <Text className={`text-xs font-medium ${isOpen ? 'text-success' : 'text-error'}`}>
                {isOpen ? 'Open' : 'Closed'}
              </Text>
            </View>
          </View>
          
          <View className="flex-row items-center justify-between">
            <Text className="text-sm text-neutral-600">{distance} • {productsCount} products</Text>
            <View className="flex-row items-center">
              <Text className="text-accent-500 mr-1">⭐</Text>
              <Text className="text-sm text-neutral-600">{rating.toFixed(1)}</Text>
            </View>
          </View>
        </View>
      </View>
    </Card>
  );
};