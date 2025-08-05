import React from 'react';
import { TouchableOpacity, Text, ViewStyle, TextStyle } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming } from 'react-native-reanimated';
import { useTheme } from '../context/ThemeContext';

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
  const { theme } = useTheme();
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
        return {
          backgroundColor: theme.primary,
          borderWidth: 0,
        };
      case 'secondary':
        return {
          backgroundColor: theme.secondary,
          borderWidth: 0,
        };
      case 'outline':
        return {
          backgroundColor: 'transparent',
          borderWidth: 2,
          borderColor: theme.primary,
        };
      case 'ghost':
        return {
          backgroundColor: 'transparent',
          borderWidth: 0,
        };
      default:
        return {
          backgroundColor: theme.primary,
          borderWidth: 0,
        };
    }
  };

  const getSizeStyles = () => {
    switch (size) {
      case 'sm':
        return { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 };
      case 'md':
        return { paddingHorizontal: 16, paddingVertical: 12, borderRadius: 12 };
      case 'lg':
        return { paddingHorizontal: 24, paddingVertical: 16, borderRadius: 12 };
      default:
        return { paddingHorizontal: 16, paddingVertical: 12, borderRadius: 12 };
    }
  };

  const getTextColor = () => {
    switch (variant) {
      case 'outline':
      case 'ghost':
        return theme.primary;
      default:
        return theme.onPrimary;
    }
  };

  const getTextSize = () => {
    switch (size) {
      case 'sm': return 14;
      case 'lg': return 18;
      default: return 16;
    }
  };

  return (
    <AnimatedTouchableOpacity
      style={[
        animatedStyle,
        {
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          opacity: disabled ? 0.5 : 1,
          ...getVariantStyles(),
          ...getSizeStyles(),
        },
      ]}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      disabled={disabled}
    >
      {icon && <Text style={{ marginRight: 8, fontSize: getTextSize() }}>{icon}</Text>}
      <Text
        style={{
          fontSize: getTextSize(),
          fontWeight: '600',
          textAlign: 'center',
          color: getTextColor(),
        }}
      >
        {title}
      </Text>
    </AnimatedTouchableOpacity>
  );
};