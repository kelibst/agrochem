import React from 'react';
import { TouchableOpacity, Text, View } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring, withTiming } from 'react-native-reanimated';
import { useTheme } from '../context/ThemeContext';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

export const ThemeToggle: React.FC = () => {
  const { theme, themeMode, toggleTheme, isDark } = useTheme();
  const scale = useSharedValue(1);
  const rotation = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [
      { scale: scale.value },
      { rotate: `${rotation.value}deg` }
    ],
  }));

  const handlePress = () => {
    scale.value = withSpring(0.8, {}, () => {
      scale.value = withSpring(1);
    });
    rotation.value = withTiming(rotation.value + 180, { duration: 300 });
    toggleTheme();
  };

  const getThemeIcon = () => {
    switch (themeMode) {
      case 'light': return '☀️';
      case 'dark': return '🌙';
      case 'system': return '📱';
      default: return '☀️';
    }
  };

  const getThemeText = () => {
    switch (themeMode) {
      case 'light': return 'Light';
      case 'dark': return 'Dark';
      case 'system': return 'System';
      default: return 'Light';
    }
  };

  return (
    <AnimatedTouchableOpacity
      style={[
        animatedStyle,
        {
          flexDirection: 'row',
          alignItems: 'center',
          paddingHorizontal: 12,
          paddingVertical: 8,
          borderRadius: 20,
          backgroundColor: theme.surfaceVariant,
          borderWidth: 1,
          borderColor: theme.border,
        },
      ]}
      onPress={handlePress}
      activeOpacity={0.7}
    >
      <Text style={{ fontSize: 16, marginRight: 6 }}>
        {getThemeIcon()}
      </Text>
      <Text
        style={{
          fontSize: 14,
          fontWeight: '500',
          color: theme.text,
        }}
      >
        {getThemeText()}
      </Text>
    </AnimatedTouchableOpacity>
  );
};