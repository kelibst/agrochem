import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';

export type ThemeMode = 'light' | 'dark' | 'system';

interface ThemeColors {
  // Background colors
  background: string;
  surface: string;
  surfaceVariant: string;
  
  // Text colors
  text: string;
  textSecondary: string;
  textTertiary: string;
  
  // Primary colors
  primary: string;
  primaryContainer: string;
  onPrimary: string;
  onPrimaryContainer: string;
  
  // Secondary colors
  secondary: string;
  secondaryContainer: string;
  onSecondary: string;
  onSecondaryContainer: string;
  
  // Accent colors
  accent: string;
  accentContainer: string;
  onAccent: string;
  onAccentContainer: string;
  
  // Status colors
  success: string;
  warning: string;
  error: string;
  info: string;
  
  // Border and divider
  border: string;
  divider: string;
  
  // Card and elevation
  card: string;
  cardElevated: string;
  
  // Input colors
  inputBackground: string;
  inputBorder: string;
  inputPlaceholder: string;
}

const lightTheme: ThemeColors = {
  // Background colors
  background: '#fafafa', // neutral-50
  surface: '#ffffff',
  surfaceVariant: '#f5f5f5', // neutral-100
  
  // Text colors
  text: '#171717', // neutral-900
  textSecondary: '#525252', // neutral-600
  textTertiary: '#a3a3a3', // neutral-400
  
  // Primary colors
  primary: '#16a34a', // primary-600
  primaryContainer: '#dcfce7', // primary-100
  onPrimary: '#ffffff',
  onPrimaryContainer: '#15803d', // primary-700
  
  // Secondary colors
  secondary: '#a18072', // secondary-600
  secondaryContainer: '#f2e8e5', // secondary-100
  onSecondary: '#ffffff',
  onSecondaryContainer: '#846358', // secondary-800
  
  // Accent colors
  accent: '#ca8a04', // accent-600
  accentContainer: '#fef9c3', // accent-100
  onAccent: '#ffffff',
  onAccentContainer: '#a16207', // accent-700
  
  // Status colors
  success: '#22c55e',
  warning: '#f59e0b',
  error: '#ef4444',
  info: '#3b82f6',
  
  // Border and divider
  border: '#e5e5e5', // neutral-200
  divider: '#d4d4d4', // neutral-300
  
  // Card and elevation
  card: '#ffffff',
  cardElevated: '#ffffff',
  
  // Input colors
  inputBackground: '#ffffff',
  inputBorder: '#e5e5e5', // neutral-200
  inputPlaceholder: '#a3a3a3', // neutral-400
};

const darkTheme: ThemeColors = {
  // Background colors
  background: '#0a0a0a', // Very dark
  surface: '#171717', // neutral-900
  surfaceVariant: '#262626', // neutral-800
  
  // Text colors
  text: '#fafafa', // neutral-50
  textSecondary: '#d4d4d4', // neutral-300
  textTertiary: '#737373', // neutral-500
  
  // Primary colors
  primary: '#22c55e', // primary-500 (brighter in dark)
  primaryContainer: '#15803d', // primary-700
  onPrimary: '#0a0a0a',
  onPrimaryContainer: '#bbf7d0', // primary-200
  
  // Secondary colors
  secondary: '#d2bab0', // secondary-400 (lighter in dark)
  secondaryContainer: '#846358', // secondary-800
  onSecondary: '#0a0a0a',
  onSecondaryContainer: '#eaddd7', // secondary-200
  
  // Accent colors
  accent: '#fde047', // accent-300 (brighter in dark)
  accentContainer: '#a16207', // accent-700
  onAccent: '#0a0a0a',
  onAccentContainer: '#fef08a', // accent-200
  
  // Status colors
  success: '#4ade80', // Brighter success
  warning: '#fbbf24', // Brighter warning
  error: '#f87171', // Brighter error
  info: '#60a5fa', // Brighter info
  
  // Border and divider
  border: '#404040', // neutral-700
  divider: '#525252', // neutral-600
  
  // Card and elevation
  card: '#262626', // neutral-800
  cardElevated: '#404040', // neutral-700
  
  // Input colors
  inputBackground: '#262626', // neutral-800
  inputBorder: '#404040', // neutral-700
  inputPlaceholder: '#737373', // neutral-500
};

interface ThemeContextType {
  theme: ThemeColors;
  themeMode: ThemeMode;
  isDark: boolean;
  setThemeMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [themeMode, setThemeMode] = useState<ThemeMode>('system');
  const systemColorScheme = useColorScheme();
  
  const isDark = themeMode === 'dark' || (themeMode === 'system' && systemColorScheme === 'dark');
  const theme = isDark ? darkTheme : lightTheme;
  
  const toggleTheme = () => {
    setThemeMode(current => {
      if (current === 'light') return 'dark';
      if (current === 'dark') return 'system';
      return 'light';
    });
  };
  
  const value: ThemeContextType = {
    theme,
    themeMode,
    isDark,
    setThemeMode,
    toggleTheme,
  };
  
  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};