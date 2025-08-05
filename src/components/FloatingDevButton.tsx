import React from 'react';
import { TouchableOpacity, Text } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withSpring } from 'react-native-reanimated';
import { useTheme } from '../context/ThemeContext';

const AnimatedTouchableOpacity = Animated.createAnimatedComponent(TouchableOpacity);

interface FloatingDevButtonProps {
  onPress: () => void;
  visible?: boolean;
}

export const FloatingDevButton: React.FC<FloatingDevButtonProps> = ({
  onPress,
  visible = true,
}) => {
  const { theme } = useTheme();
  const scale = useSharedValue(1);
  const opacity = useSharedValue(visible ? 1 : 0);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  const handlePressIn = () => {
    scale.value = withSpring(0.9);
  };

  const handlePressOut = () => {
    scale.value = withSpring(1);
  };

  React.useEffect(() => {
    opacity.value = withSpring(visible ? 1 : 0);
  }, [visible, opacity]);

  if (!visible) return null;

  return (
    <AnimatedTouchableOpacity
      style={[
        animatedStyle,
        {
          position: 'absolute',
          bottom: 20,
          left: 20,
          width: 56,
          height: 56,
          borderRadius: 28,
          backgroundColor: theme.accent,
          shadowColor: '#000',
          shadowOffset: {
            width: 0,
            height: 4,
          },
          shadowOpacity: 0.3,
          shadowRadius: 8,
          elevation: 8,
          zIndex: 1000,
          alignItems: 'center',
          justifyContent: 'center',
        },
      ]}
      onPress={onPress}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      activeOpacity={0.8}
    >
      <Text style={{ fontSize: 24 }}>⚙️</Text>
    </AnimatedTouchableOpacity>
  );
};