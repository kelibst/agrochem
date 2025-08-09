import React, { createContext, useContext, useState, useEffect } from 'react';
import { useColorScheme } from 'react-native';

// Import AsyncStorage with fallback
let AsyncStorage: any;
try {
  AsyncStorage = require('@react-native-async-storage/async-storage').default;
} catch (error) {
  // Fallback for environments where AsyncStorage is not available
  AsyncStorage = {
    getItem: async () => null,
    setItem: async () => {},
  };
}

export type ThemeMode = 'light' | 'dark' | 'system';

export interface ThemeColors {
  // Background colors
  background: string;
  surface: string;
  surfaceVariant: string;
  surfaceContainer: string;
  
  // Text colors
  text: string;
  textSecondary: string;
  textTertiary: string;
  textInverse: string;
  
  // Primary colors
  primary: string;
  primaryContainer: string;
  primaryLight: string;
  primaryDark: string;
  onPrimary: string;
  onPrimaryContainer: string;
  
  // Secondary colors
  secondary: string;
  secondaryContainer: string;
  secondaryLight: string;
  secondaryDark: string;
  onSecondary: string;
  onSecondaryContainer: string;
  
  // Accent colors
  accent: string;
  accentContainer: string;
  accentLight: string;
  accentDark: string;
  onAccent: string;
  onAccentContainer: string;
  
  // Status colors
  success: string;
  successContainer: string;
  onSuccess: string;
  warning: string;
  warningContainer: string;
  onWarning: string;
  error: string;
  errorContainer: string;
  onError: string;
  info: string;
  infoContainer: string;
  onInfo: string;
  
  // Semantic colors
  star: string; // For ratings
  favorite: string; // For favorites/hearts
  verified: string; // For verification badges
  online: string; // For online status
  offline: string; // For offline status
  
  // Border and divider
  border: string;
  borderLight: string;
  borderStrong: string;
  divider: string;
  
  // Card and elevation
  card: string;
  cardElevated: string;
  cardHover: string;
  cardPressed: string;
  
  // Input colors
  inputBackground: string;
  inputBorder: string;
  inputBorderFocus: string;
  inputPlaceholder: string;
  inputLabel: string;
  inputError: string;
  
  // Interactive states
  hover: string;
  pressed: string;
  focus: string;
  disabled: string;
  
  // Overlay colors
  overlay: string;
  backdropLight: string;
  backdropDark: string;
  
  // Gradient colors
  gradientStart: string;
  gradientEnd: string;
  gradientPrimaryStart: string;
  gradientPrimaryEnd: string;
  gradientSecondaryStart: string;
  gradientSecondaryEnd: string;
}

const lightTheme: ThemeColors = {
  // Background colors
  background: '#fafafa', // neutral-50
  surface: '#ffffff',
  surfaceVariant: '#f5f5f5', // neutral-100
  surfaceContainer: '#f8fafc', // neutral-50
  
  // Text colors
  text: '#171717', // neutral-900
  textSecondary: '#525252', // neutral-600
  textTertiary: '#a3a3a3', // neutral-400
  textInverse: '#ffffff',
  
  // Primary colors
  primary: '#16a34a', // primary-600
  primaryContainer: '#dcfce7', // primary-100
  primaryLight: '#22c55e', // primary-500
  primaryDark: '#15803d', // primary-700
  onPrimary: '#ffffff',
  onPrimaryContainer: '#15803d', // primary-700
  
  // Secondary colors
  secondary: '#a18072', // secondary-600
  secondaryContainer: '#f2e8e5', // secondary-100
  secondaryLight: '#bfa094', // secondary-500
  secondaryDark: '#846358', // secondary-800
  onSecondary: '#ffffff',
  onSecondaryContainer: '#846358', // secondary-800
  
  // Accent colors
  accent: '#ca8a04', // accent-600
  accentContainer: '#fef9c3', // accent-100
  accentLight: '#eab308', // accent-500
  accentDark: '#a16207', // accent-700
  onAccent: '#ffffff',
  onAccentContainer: '#a16207', // accent-700
  
  // Status colors
  success: '#22c55e',
  successContainer: '#dcfce7',
  onSuccess: '#ffffff',
  warning: '#f59e0b',
  warningContainer: '#fef3c7',
  onWarning: '#ffffff',
  error: '#ef4444',
  errorContainer: '#fee2e2',
  onError: '#ffffff',
  info: '#3b82f6',
  infoContainer: '#dbeafe',
  onInfo: '#ffffff',
  
  // Semantic colors
  star: '#fbbf24', // Golden yellow for ratings
  favorite: '#ef4444', // Red for hearts/favorites
  verified: '#22c55e', // Green for verification
  online: '#22c55e', // Green for online status
  offline: '#94a3b8', // Gray for offline status
  
  // Border and divider
  border: '#e5e5e5', // neutral-200
  borderLight: '#f3f4f6', // neutral-100
  borderStrong: '#d4d4d4', // neutral-300
  divider: '#e5e5e5', // neutral-200
  
  // Card and elevation
  card: '#ffffff',
  cardElevated: '#ffffff',
  cardHover: '#f9fafb',
  cardPressed: '#f3f4f6',
  
  // Input colors
  inputBackground: '#ffffff',
  inputBorder: '#e5e5e5', // neutral-200
  inputBorderFocus: '#16a34a', // primary-600
  inputPlaceholder: '#a3a3a3', // neutral-400
  inputLabel: '#525252', // neutral-600
  inputError: '#ef4444',
  
  // Interactive states
  hover: '#f9fafb',
  pressed: '#f3f4f6',
  focus: '#dcfce7', // primary-100
  disabled: '#f5f5f5',
  
  // Overlay colors
  overlay: 'rgba(0, 0, 0, 0.5)',
  backdropLight: 'rgba(255, 255, 255, 0.8)',
  backdropDark: 'rgba(0, 0, 0, 0.3)',
  
  // Gradient colors
  gradientStart: '#f0fdf4', // primary-50
  gradientEnd: '#dcfce7', // primary-100
  gradientPrimaryStart: '#16a34a', // primary-600
  gradientPrimaryEnd: '#22c55e', // primary-500
  gradientSecondaryStart: '#f2e8e5', // secondary-100
  gradientSecondaryEnd: '#eaddd7', // secondary-200
};

const darkTheme: ThemeColors = {
  // Background colors
  background: '#0a0a0a', // Very dark
  surface: '#171717', // neutral-900
  surfaceVariant: '#262626', // neutral-800
  surfaceContainer: '#1f1f1f', // neutral-850
  
  // Text colors
  text: '#fafafa', // neutral-50
  textSecondary: '#d4d4d4', // neutral-300
  textTertiary: '#737373', // neutral-500
  textInverse: '#171717', // neutral-900
  
  // Primary colors
  primary: '#22c55e', // primary-500 (brighter in dark)
  primaryContainer: '#15803d', // primary-700
  primaryLight: '#4ade80', // primary-400
  primaryDark: '#166534', // primary-800
  onPrimary: '#0a0a0a',
  onPrimaryContainer: '#bbf7d0', // primary-200
  
  // Secondary colors
  secondary: '#d2bab0', // secondary-400 (lighter in dark)
  secondaryContainer: '#846358', // secondary-800
  secondaryLight: '#e0cec7', // secondary-300
  secondaryDark: '#43302b', // secondary-900
  onSecondary: '#0a0a0a',
  onSecondaryContainer: '#eaddd7', // secondary-200
  
  // Accent colors
  accent: '#fde047', // accent-300 (brighter in dark)
  accentContainer: '#a16207', // accent-700
  accentLight: '#fef08a', // accent-200
  accentDark: '#713f12', // accent-900
  onAccent: '#0a0a0a',
  onAccentContainer: '#fef08a', // accent-200
  
  // Status colors
  success: '#4ade80', // Brighter success
  successContainer: '#166534', // success-800
  onSuccess: '#0a0a0a',
  warning: '#fbbf24', // Brighter warning
  warningContainer: '#92400e', // warning-800
  onWarning: '#0a0a0a',
  error: '#f87171', // Brighter error
  errorContainer: '#991b1b', // error-800
  onError: '#0a0a0a',
  info: '#60a5fa', // Brighter info
  infoContainer: '#1e40af', // info-800
  onInfo: '#0a0a0a',
  
  // Semantic colors
  star: '#fde047', // Bright yellow for ratings in dark
  favorite: '#f87171', // Bright red for hearts/favorites
  verified: '#4ade80', // Bright green for verification
  online: '#4ade80', // Bright green for online status
  offline: '#64748b', // Gray for offline status
  
  // Border and divider
  border: '#404040', // neutral-700
  borderLight: '#525252', // neutral-600
  borderStrong: '#737373', // neutral-500
  divider: '#404040', // neutral-700
  
  // Card and elevation
  card: '#262626', // neutral-800
  cardElevated: '#404040', // neutral-700
  cardHover: '#2d2d2d',
  cardPressed: '#1f1f1f',
  
  // Input colors
  inputBackground: '#262626', // neutral-800
  inputBorder: '#404040', // neutral-700
  inputBorderFocus: '#22c55e', // primary-500
  inputPlaceholder: '#737373', // neutral-500
  inputLabel: '#d4d4d4', // neutral-300
  inputError: '#f87171',
  
  // Interactive states
  hover: '#2d2d2d',
  pressed: '#1f1f1f',
  focus: '#15803d', // primary-700
  disabled: '#262626',
  
  // Overlay colors
  overlay: 'rgba(0, 0, 0, 0.7)',
  backdropLight: 'rgba(23, 23, 23, 0.8)',
  backdropDark: 'rgba(0, 0, 0, 0.9)',
  
  // Gradient colors
  gradientStart: '#166534', // primary-800
  gradientEnd: '#15803d', // primary-700
  gradientPrimaryStart: '#22c55e', // primary-500
  gradientPrimaryEnd: '#4ade80', // primary-400
  gradientSecondaryStart: '#846358', // secondary-800
  gradientSecondaryEnd: '#d2bab0', // secondary-400
};

// Theme utility functions
export const createThemeStyle = (theme: ThemeColors) => ({
  // Background styles
  background: { backgroundColor: theme.background },
  surface: { backgroundColor: theme.surface },
  surfaceVariant: { backgroundColor: theme.surfaceVariant },
  
  // Text styles
  text: { color: theme.text },
  textSecondary: { color: theme.textSecondary },
  textTertiary: { color: theme.textTertiary },
  
  // Border styles
  border: { borderColor: theme.border },
  borderLight: { borderColor: theme.borderLight },
  borderStrong: { borderColor: theme.borderStrong },
  
  // Shadow styles
  shadow: {
    shadowColor: theme.text,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  shadowStrong: {
    shadowColor: theme.text,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 6,
  },
});

// Color opacity utility
export const withOpacity = (color: string, opacity: number): string => {
  // Convert hex to rgba with opacity
  const hex = color.replace('#', '');
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${opacity})`;
};

interface ThemeContextType {
  theme: ThemeColors;
  themeMode: ThemeMode;
  isDark: boolean;
  setThemeMode: (mode: ThemeMode) => void;
  toggleTheme: () => void;
  styles: ReturnType<typeof createThemeStyle>;
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

const THEME_STORAGE_KEY = '@agroconnect_theme_mode';

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [themeMode, setThemeMode] = useState<ThemeMode>('system');
  const [isLoading, setIsLoading] = useState(true);
  const systemColorScheme = useColorScheme();
  
  const isDark = themeMode === 'dark' || (themeMode === 'system' && systemColorScheme === 'dark');
  const theme = isDark ? darkTheme : lightTheme;
  const styles = createThemeStyle(theme);
  
  // Load saved theme preference on mount
  useEffect(() => {
    const loadThemePreference = async () => {
      try {
        const savedTheme = await AsyncStorage.getItem(THEME_STORAGE_KEY);
        if (savedTheme && ['light', 'dark', 'system'].includes(savedTheme)) {
          setThemeMode(savedTheme as ThemeMode);
        }
      } catch (error) {
        console.warn('Failed to load theme preference:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadThemePreference();
  }, []);

  // Save theme preference when it changes
  const updateThemeMode = async (mode: ThemeMode) => {
    try {
      await AsyncStorage.setItem(THEME_STORAGE_KEY, mode);
      setThemeMode(mode);
    } catch (error) {
      console.warn('Failed to save theme preference:', error);
      // Still update the state even if storage fails
      setThemeMode(mode);
    }
  };
  
  const toggleTheme = () => {
    const nextTheme = themeMode === 'light' ? 'dark' : themeMode === 'dark' ? 'system' : 'light';
    updateThemeMode(nextTheme);
  };
  
  const value: ThemeContextType = {
    theme,
    themeMode,
    isDark,
    setThemeMode: updateThemeMode,
    toggleTheme,
    styles,
  };

  // Don't render children until theme is loaded
  if (isLoading) {
    return null; // Or a loading screen component
  }
  
  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};