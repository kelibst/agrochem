import React from 'react';
import { Image, ImageStyle, StyleProp } from 'react-native';
import { useTheme } from '../context/ThemeContext';

interface LogoProps {
  width?: number;
  height?: number;
  style?: StyleProp<ImageStyle>;
  resizeMode?: 'cover' | 'contain' | 'stretch' | 'repeat' | 'center';
}

export const Logo: React.FC<LogoProps> = ({
  width = 120,
  height = 120,
  style,
  resizeMode = 'contain',
}) => {
  const { theme, themeMode } = useTheme();
  
  // Use light logo for dark theme and dark logo for light theme for better contrast
  const logoSource = themeMode === 'dark' 
    ? require('../../assets/light-logo.png')
    : require('../../assets/dark-logo.png');

  return (
    <Image
      source={logoSource}
      style={[
        {
          width,
          height,
        },
        style,
      ]}
      resizeMode={resizeMode}
    />
  );
};

// Preset sizes for common use cases
export const LogoLarge: React.FC<Omit<LogoProps, 'width' | 'height'>> = (props) => (
  <Logo width={120} height={120} {...props} />
);

export const LogoMedium: React.FC<Omit<LogoProps, 'width' | 'height'>> = (props) => (
  <Logo width={80} height={80} {...props} />
);

export const LogoSmall: React.FC<Omit<LogoProps, 'width' | 'height'>> = (props) => (
  <Logo width={40} height={40} {...props} />
);

