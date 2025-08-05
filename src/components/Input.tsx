import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, TextInputProps } from 'react-native';
import Animated, { useSharedValue, useAnimatedStyle, withTiming } from 'react-native-reanimated';

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
  const [isFocused, setIsFocused] = useState(false);
  const borderColor = useSharedValue('#e5e5e5');

  const animatedStyle = useAnimatedStyle(() => ({
    borderColor: borderColor.value,
  }));

  const handleFocus = (e: any) => {
    setIsFocused(true);
    borderColor.value = withTiming('#16a34a', { duration: 200 });
    props.onFocus?.(e);
  };

  const handleBlur = (e: any) => {
    setIsFocused(false);
    borderColor.value = withTiming(error ? '#ef4444' : '#e5e5e5', { duration: 200 });
    props.onBlur?.(e);
  };

  const getVariantStyles = () => {
    switch (variant) {
      case 'filled':
        return 'bg-neutral-50 border-0';
      case 'outlined':
        return 'bg-transparent border-2';
      default:
        return 'bg-white border';
    }
  };

  return (
    <View className={`mb-4 ${className}`}>
      {label && (
        <Text className={`text-sm font-medium mb-2 ${
          isFocused ? 'text-primary-600' : 'text-neutral-700'
        }`}>
          {label}
        </Text>
      )}
      
      <Animated.View
        style={animatedStyle}
        className={`
          ${getVariantStyles()}
          rounded-xl px-4 py-3
          flex-row items-center
          ${error ? 'border-error' : ''}
        `}
      >
        {icon && (
          <View className="mr-3">
            {icon}
          </View>
        )}
        
        <TextInput
          {...props}
          onFocus={handleFocus}
          onBlur={handleBlur}
          className="flex-1 text-neutral-800 text-base"
          placeholderTextColor="#a3a3a3"
        />
        
        {rightIcon && (
          <TouchableOpacity onPress={onRightIconPress} className="ml-3">
            {rightIcon}
          </TouchableOpacity>
        )}
      </Animated.View>
      
      {error && (
        <Text className="text-error text-sm mt-1">{error}</Text>
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