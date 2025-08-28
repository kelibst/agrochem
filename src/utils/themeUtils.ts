import { ViewStyle, TextStyle } from 'react-native';
import { ThemeColors, withOpacity } from '../context/ThemeContext';

/**
 * Universal theme utility functions for consistent styling across the app
 */

// Common style presets using theme colors
export const createThemeStyles = (theme: ThemeColors) => ({
  // Container styles
  container: {
    flex: 1,
    backgroundColor: theme.background,
  } as ViewStyle,

  surface: {
    backgroundColor: theme.surface,
  } as ViewStyle,

  surfaceVariant: {
    backgroundColor: theme.surfaceVariant,
  } as ViewStyle,

  // Text styles
  heading1: {
    fontSize: 32,
    fontWeight: 'bold' as const,
    color: theme.text,
    lineHeight: 40,
  } as TextStyle,

  heading2: {
    fontSize: 24,
    fontWeight: 'bold' as const,
    color: theme.text,
    lineHeight: 32,
  } as TextStyle,

  heading3: {
    fontSize: 20,
    fontWeight: '600' as const,
    color: theme.text,
    lineHeight: 28,
  } as TextStyle,

  body: {
    fontSize: 16,
    color: theme.text,
    lineHeight: 24,
  } as TextStyle,

  bodySecondary: {
    fontSize: 16,
    color: theme.textSecondary,
    lineHeight: 24,
  } as TextStyle,

  caption: {
    fontSize: 14,
    color: theme.textSecondary,
    lineHeight: 20,
  } as TextStyle,

  small: {
    fontSize: 12,
    color: theme.textTertiary,
    lineHeight: 16,
  } as TextStyle,

  // Card styles
  card: {
    backgroundColor: theme.card,
    borderRadius: 12,
    padding: 16,
    ...createShadow(theme),
  } as ViewStyle,

  cardElevated: {
    backgroundColor: theme.cardElevated,
    borderRadius: 12,
    padding: 16,
    ...createStrongShadow(theme),
  } as ViewStyle,

  // Button styles
  buttonPrimary: {
    backgroundColor: theme.primary,
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 16,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  } as ViewStyle,

  buttonSecondary: {
    backgroundColor: theme.secondary,
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 16,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  } as ViewStyle,

  buttonOutline: {
    backgroundColor: 'transparent',
    borderWidth: 2,
    borderColor: theme.primary,
    borderRadius: 12,
    paddingHorizontal: 24,
    paddingVertical: 16,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  } as ViewStyle,

  // Input styles
  input: {
    backgroundColor: theme.inputBackground,
    borderWidth: 1,
    borderColor: theme.inputBorder,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: theme.text,
  } as ViewStyle & TextStyle,

  inputFocused: {
    borderColor: theme.inputBorderFocus,
    borderWidth: 2,
  } as ViewStyle,

  inputError: {
    borderColor: theme.inputError,
    borderWidth: 2,
  } as ViewStyle,

  // Border styles
  border: {
    borderColor: theme.border,
  } as ViewStyle,

  borderLight: {
    borderColor: theme.borderLight,
  } as ViewStyle,

  borderStrong: {
    borderColor: theme.borderStrong,
  } as ViewStyle,

  // Divider
  divider: {
    height: 1,
    backgroundColor: theme.divider,
  } as ViewStyle,

  // Status styles
  success: {
    backgroundColor: theme.successContainer,
    color: theme.onSuccess,
  } as ViewStyle & TextStyle,

  warning: {
    backgroundColor: theme.warningContainer,
    color: theme.onWarning,
  } as ViewStyle & TextStyle,

  error: {
    backgroundColor: theme.errorContainer,
    color: theme.onError,
  } as ViewStyle & TextStyle,

  info: {
    backgroundColor: theme.infoContainer,
    color: theme.onInfo,
  } as ViewStyle & TextStyle,

  // Interactive states
  pressable: {
    backgroundColor: theme.card,
    borderRadius: 12,
  } as ViewStyle,

  pressablePressed: {
    backgroundColor: theme.cardPressed,
  } as ViewStyle,

  pressableHover: {
    backgroundColor: theme.cardHover,
  } as ViewStyle,

  // Gradient backgrounds (for LinearGradient components)
  gradientPrimary: [theme.gradientPrimaryStart, theme.gradientPrimaryEnd],
  gradientSecondary: [theme.gradientSecondaryStart, theme.gradientSecondaryEnd],
  gradientSurface: [theme.gradientStart, theme.gradientEnd],
});

// Shadow utilities
export const createShadow = (theme: ThemeColors): ViewStyle => ({
  shadowColor: theme.text,
shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.1,
  shadowRadius: 4,
  elevation: 3,
});

export const createStrongShadow = (theme: ThemeColors): ViewStyle => ({
  shadowColor: theme.text,
  shadowOffset: { width: 0, height: 4 },
  shadowOpacity: 0.15,
  shadowRadius: 8,
  elevation: 6,
});

// Color utilities
export const getStatusColor = (theme: ThemeColors, status: 'success' | 'warning' | 'error' | 'info') => {
  switch (status) {
    case 'success': return theme.success;
    case 'warning': return theme.warning;
    case 'error': return theme.error;
    case 'info': return theme.info;
  }
};

export const getStatusContainerColor = (theme: ThemeColors, status: 'success' | 'warning' | 'error' | 'info') => {
  switch (status) {
    case 'success': return theme.successContainer;
    case 'warning': return theme.warningContainer;
    case 'error': return theme.errorContainer;
    case 'info': return theme.infoContainer;
  }
};

// Responsive utilities
export const createResponsivePadding = (base: number) => ({
  paddingHorizontal: Math.max(16, base),
  paddingVertical: Math.max(12, base * 0.75),
});

export const createResponsiveMargin = (base: number) => ({
  marginHorizontal: Math.max(8, base * 0.5),
  marginVertical: Math.max(6, base * 0.375),
});

// Animation utilities
export const createPressAnimation = () => ({
  scale: 0.95,
  opacity: 0.8,
});

export const createHoverAnimation = () => ({
  scale: 1.02,
  opacity: 1,
});

// Layout utilities
export const createFlexCenter = (): ViewStyle => ({
  alignItems: 'center',
  justifyContent: 'center',
});

export const createFlexRow = (): ViewStyle => ({
  flexDirection: 'row',
  alignItems: 'center',
});

export const createFlexColumn = (): ViewStyle => ({
  flexDirection: 'column',
});

// Typography utilities
export const createTextWithOpacity = (theme: ThemeColors, opacity: number): TextStyle => ({
  color: withOpacity(theme.text, opacity),
});

export const createSecondaryTextWithOpacity = (theme: ThemeColors, opacity: number): TextStyle => ({
  color: withOpacity(theme.textSecondary, opacity),
});

// Spacing utilities (following 8px grid system)
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  xxxl: 64,
};

// Border radius utilities
export const borderRadius = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  full: 9999,
};

// Font weight utilities
export const fontWeight = {
  normal: '400' as const,
  medium: '500' as const,
  semibold: '600' as const,
  bold: '700' as const,
  extrabold: '800' as const,
};

// Font size utilities
export const fontSize = {
  xs: 12,
  sm: 14,
  base: 16,
  lg: 18,
  xl: 20,
  '2xl': 24,
  '3xl': 30,
  '4xl': 36,
  '5xl': 48,
};

// Line height utilities
export const lineHeight = {
  tight: 1.25,
  normal: 1.5,
  relaxed: 1.75,
  loose: 2,
};
