import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, TextInputProps } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';
import { useTheme } from '../context/ThemeContext';

interface InputProps extends TextInputProps {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
  onRightIconPress?: () => void;
  variant?: 'default' | 'filled' | 'outlined';
}

export const Input: React.FC<InputProps> = ({
  label,
  error,
  icon,
  rightIcon,
  onRightIconPress,
  variant = 'default',
  className = '',
  ...props
}) => {
  const { theme } = useTheme();
  const [isFocused, setIsFocused] = useState(false);
  const borderColor = useSharedValue(theme.inputBorder);

  const animatedStyle = useAnimatedStyle(() => ({
    borderColor: borderColor.value,
  }));

  const handleFocus = (e: any) => {
    setIsFocused(true);
    borderColor.value = withTiming(theme.primary, { duration: 200 });
    props.onFocus?.(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    borderColor.value = withTiming(error ? theme.error : theme.inputBorder, { duration: 200 });
    props.onBlur?.(e);
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'filled':
        return {
          backgroundColor: theme.surfaceVariant,
          borderWidth: 0,
        };
      case 'outlined':
        return {
          backgroundColor: 'transparent',
          borderWidth: 2,
        };
      default:
        return {
          backgroundColor: theme.inputBackground,
          borderWidth: 1,
        };
    }
  };

  return (
    <View style={{ marginBottom: 16 }}>
      {label && (
        <Text
          style={{
            fontSize: 14,
            fontWeight: '500',
            marginBottom: 8,
            color: isFocused ? theme.primary : theme.textSecondary,
          }}
        >
          {label}
        </Text>
      )}
      
      <Animated.View
        style={[
          animatedStyle,
          {
            borderRadius: 12,
            paddingHorizontal: 16,
            paddingVertical: 12,
            flexDirection: 'row',
            alignItems: 'center',
            borderColor: error ? theme.error : undefined,
            ...getVariantStyles(),
          },
        ]}
      >
        {icon && (
          <View style={{ marginRight: 12 }}>
            {icon}
          </View>
        )}
        
        <TextInput
          {...props}
          onFocus={handleFocus}
          onBlur={handleBlur}
          style={{
            flex: 1,
            color: theme.text,
            fontSize: 16,
          }}
          placeholderTextColor={theme.inputPlaceholder}
        />
        
        {rightIcon && (
          <TouchableOpacity onPress={onRightIconPress} style={{ marginLeft: 12 }}>
            {rightIcon}
          </TouchableOpacity>
        )}
      </Animated.View>
      
      {error && (
        <Text
          style={{
            color: theme.error,
            fontSize: 14,
            marginTop: 4,
          }}
        >
          {error}
        </Text>
      )}
    </View>
  );
};

interface SearchInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  onSearch?: () => void;
}

export const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChangeText,
  placeholder = 'Search...',
  onSearch,
}) => {
  return (
    <View className="relative">
      <Input
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        variant="filled"
        icon={<Text className="text-neutral-400">🔍</Text>}
        rightIcon={value ? <Text className="text-neutral-400">✕</Text> : undefined}
        onRightIconPress={() => onChangeText('')}
        returnKeyType="search"
        onSubmitEditing={onSearch}
      />
    </View>
  );
};