import React from 'react';
import { TouchableOpacity, Text, ViewStyle, TextStyle } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming } from 'react-native-reanimated';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  icon?: React.ReactNode;
  className?: string;
}

export const Button: React.FC<ButtonProps> = ({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  icon,
  className = '',
}) => {
  const scale = useSharedValue(1);
  const opacity = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.95);
    opacity.value = withTiming(0.8, { duration: 100 });
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
    opacity.value = withTiming(1, { duration: 100 });
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'primary':
        return 'bg-primary-600 active:bg-primary-700';
      case 'secondary':
        return 'bg-secondary-600 active:bg-secondary-700';
      case 'outline':
        return 'border-2 border-primary-600 bg-transparent active:bg-primary-50';
      case 'ghost':
        return 'bg-transparent active:bg-primary-50';
      default:
        return 'bg-primary-600 active:bg-primary-700';
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return 'px-3 py-2 rounded-lg';
      case 'md':
        return 'px-4 py-3 rounded-xl';
      case 'lg':
        return 'px-6 py-4 rounded-xl';
      default:
        return 'px-4 py-3 rounded-xl';
    }
  };

  const getTextStyles = () => {
    const baseStyles = 'font-semibold text-center';
    const variantStyles = variant === 'outline' || variant === 'ghost' 
      ? 'text-primary-600' 
      : 'text-white';
    
    const sizeStyles = size === 'sm' ? 'text-sm' : size === 'lg' ? 'text-lg' : 'text-base';
    
    return `${baseStyles} ${variantStyles} ${sizeStyles}`;
  };

  return (
    <AnimatedTouchableOpacity
      style={animatedStyle}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
      className={`
        ${getVariantStyles()}
        ${getSizeStyles()}
        flex-row items-center justify-center
        ${disabled ? 'opacity-50' : ''}
        ${className}
      `}
    >
      {icon && <Text className="mr-2">{icon}</Text>}
      <Text className={getTextStyles()}>{title}</Text>
    </AnimatedTouchableOpacity>
  );
};