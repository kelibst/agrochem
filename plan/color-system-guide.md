# AgroConnect Color System Guide

## Overview

The AgroConnect app uses a **universal theme system** that provides consistent, semantic, and theme-aware colors throughout the application. This system eliminates hardcoded colors and ensures perfect theme switching between light and dark modes.

## 🎨 Core Principles

### 1. **Single Source of Truth**
All colors are defined once in `src/context/ThemeContext.tsx` and automatically propagate throughout the app.

### 2. **Semantic Naming**
Colors have meaningful names that describe their purpose, not their appearance:
- `theme.star` instead of `#FFD700`
- `theme.success` instead of `#22c55e`
- `theme.primaryContainer` instead of `#dcfce7`

### 3. **Theme Awareness**
Every color automatically adapts to light/dark themes with optimized contrast ratios.

### 4. **Universal Variables**
When users change themes, **every UI element** responds instantly with perfect color coordination.

---

## 📚 How to Use the Color System

### Basic Usage

```typescript
import { useTheme } from '../context/ThemeContext';

const MyComponent = () => {
  const { theme } = useTheme();
  
  return (
    <View style={{ backgroundColor: theme.surface }}>
      <Text style={{ color: theme.text }}>Hello World</Text>
    </View>
  );
};
```

### With Theme Utilities

```typescript
import { useTheme } from '../context/ThemeContext';
import { createThemeStyles } from '../utils/themeUtils';

const MyComponent = () => {
  const { theme, styles } = useTheme();
  const themeStyles = createThemeStyles(theme);
  
  return (
    <View style={themeStyles.container}>
      <Text style={themeStyles.heading1}>Title</Text>
      <Text style={themeStyles.body}>Content</Text>
    </View>
  );
};
```

---

## 🎯 Complete Color Reference

### Background Colors (4)
```typescript
theme.background        // Main app background
theme.surface          // Card/modal backgrounds
theme.surfaceVariant   // Secondary surfaces
theme.surfaceContainer // Container backgrounds
```

### Text Colors (4)
```typescript
theme.text         // Primary text
theme.textSecondary // Secondary text (descriptions)
theme.textTertiary  // Tertiary text (captions)
theme.textInverse   // Inverse text (on colored backgrounds)
```

### Primary Colors (6)
```typescript
theme.primary           // Main brand color
theme.primaryContainer  // Light background for primary content
theme.primaryLight      // Lighter variant
theme.primaryDark       // Darker variant
theme.onPrimary         // Text/icons on primary background
theme.onPrimaryContainer // Text/icons on primary container
```

### Secondary Colors (6)
```typescript
theme.secondary           // Secondary brand color
theme.secondaryContainer  // Light background for secondary content
theme.secondaryLight      // Lighter variant
theme.secondaryDark       // Darker variant
theme.onSecondary         // Text/icons on secondary background
theme.onSecondaryContainer // Text/icons on secondary container
```

### Accent Colors (6)
```typescript
theme.accent           // Accent/highlight color
theme.accentContainer  // Light background for accent content
theme.accentLight      // Lighter variant
theme.accentDark       // Darker variant
theme.onAccent         // Text/icons on accent background
theme.onAccentContainer // Text/icons on accent container
```

### Status Colors (12)
```typescript
// Success
theme.success          // Success color
theme.successContainer // Success background
theme.onSuccess        // Text on success background

// Warning
theme.warning          // Warning color
theme.warningContainer // Warning background
theme.onWarning        // Text on warning background

// Error
theme.error            // Error color
theme.errorContainer   // Error background
theme.onError          // Text on error background

// Info
theme.info             // Info color
theme.infoContainer    // Info background
theme.onInfo           // Text on info background
```

### Semantic Colors (5)
```typescript
theme.star      // ⭐ Rating stars
theme.favorite  // ❤️ Hearts/favorites
theme.verified  // ✅ Verification badges
theme.online    // 🟢 Online status
theme.offline   // ⚫ Offline status
```

### Border & Layout Colors (8)
```typescript
theme.border       // Standard borders
theme.borderLight  // Light borders
theme.borderStrong // Strong/emphasis borders
theme.divider      // Divider lines
theme.card         // Card backgrounds
theme.cardElevated // Elevated card backgrounds
theme.cardHover    // Card hover state
theme.cardPressed  // Card pressed state
```

### Input Colors (6)
```typescript
theme.inputBackground  // Input field background
theme.inputBorder     // Input field border
theme.inputBorderFocus // Input field focus border
theme.inputPlaceholder // Placeholder text
theme.inputLabel      // Input labels
theme.inputError      // Input error state
```

### Interactive States (4)
```typescript
theme.hover    // Hover effects
theme.pressed  // Press animations
theme.focus    // Focus indicators
theme.disabled // Disabled states
```

### Overlay Colors (3)
```typescript
theme.overlay      // Modal overlays
theme.backdropLight // Light backdrop
theme.backdropDark  // Dark backdrop
```

### Gradient Colors (6)
```typescript
theme.gradientStart         // Surface gradient start
theme.gradientEnd           // Surface gradient end
theme.gradientPrimaryStart  // Primary gradient start
theme.gradientPrimaryEnd    // Primary gradient end
theme.gradientSecondaryStart // Secondary gradient start
theme.gradientSecondaryEnd   // Secondary gradient end
```

---

## 🛠️ Utility Functions

### Color Opacity
```typescript
import { withOpacity } from '../context/ThemeContext';

// Add transparency to any color
const semiTransparentText = withOpacity(theme.text, 0.7);
// Result: "rgba(23, 23, 23, 0.7)"
```

### Pre-built Styles
```typescript
import { createThemeStyles } from '../utils/themeUtils';

const styles = createThemeStyles(theme);

// Typography
styles.heading1    // Large heading
styles.heading2    // Medium heading
styles.heading3    // Small heading
styles.body        // Body text
styles.bodySecondary // Secondary body text
styles.caption     // Caption text
styles.small       // Small text

// Components
styles.card        // Standard card
styles.cardElevated // Elevated card
styles.buttonPrimary // Primary button
styles.buttonSecondary // Secondary button
styles.buttonOutline // Outline button
styles.input       // Input field
styles.inputFocused // Focused input
styles.inputError  // Error input

// Status
styles.success     // Success styling
styles.warning     // Warning styling
styles.error       // Error styling
styles.info        // Info styling
```

### Shadow Utilities
```typescript
import { createShadow, createStrongShadow } from '../utils/themeUtils';

const cardStyle = {
  backgroundColor: theme.card,
  ...createShadow(theme), // Subtle shadow
};

const elevatedCardStyle = {
  backgroundColor: theme.cardElevated,
  ...createStrongShadow(theme), // Strong shadow
};
```

---

## ✅ Best Practices

### 1. **Always Use Theme Colors**
```typescript
// ✅ GOOD
<Text style={{ color: theme.text }}>Hello</Text>

// ❌ BAD
<Text style={{ color: '#171717' }}>Hello</Text>
<Text className="text-neutral-800">Hello</Text>
```

### 2. **Use Semantic Colors**
```typescript
// ✅ GOOD - Semantic meaning
<Text style={{ color: theme.star }}>★</Text>
<View style={{ backgroundColor: theme.successContainer }}>
  <Text style={{ color: theme.onSuccess }}>Success!</Text>
</View>

// ❌ BAD - Hardcoded colors
<Text style={{ color: '#FFD700' }}>★</Text>
<View style={{ backgroundColor: '#dcfce7' }}>
  <Text style={{ color: '#ffffff' }}>Success!</Text>
</View>
```

### 3. **Use Container + OnContainer Pattern**
```typescript
// ✅ GOOD - Proper contrast
<View style={{ backgroundColor: theme.primaryContainer }}>
  <Text style={{ color: theme.onPrimaryContainer }}>Text</Text>
</View>

// ❌ BAD - May have contrast issues
<View style={{ backgroundColor: theme.primary }}>
  <Text style={{ color: theme.text }}>Text</Text>
</View>
```

### 4. **Leverage Pre-built Styles**
```typescript
// ✅ GOOD - Consistent styling
const { styles } = useTheme();
<Text style={styles.heading1}>Title</Text>

// ❌ BAD - Inconsistent manual styling
<Text style={{ fontSize: 32, fontWeight: 'bold', color: theme.text }}>Title</Text>
```

### 5. **Use Status Colors Appropriately**
```typescript
// ✅ GOOD - Proper status usage
const getStatusColor = (status: string) => {
  switch (status) {
    case 'success': return theme.success;
    case 'warning': return theme.warning;
    case 'error': return theme.error;
    default: return theme.info;
  }
};

// ❌ BAD - Hardcoded status colors
const getStatusColor = (status: string) => {
  switch (status) {
    case 'success': return '#22c55e';
    case 'warning': return '#f59e0b';
    case 'error': return '#ef4444';
    default: return '#3b82f6';
  }
};
```

---

## 🔄 Migration Guide

### From Tailwind Classes to Theme

```typescript
// Before (Tailwind)
<View className="bg-white border border-neutral-200 rounded-xl p-4">
  <Text className="text-lg font-bold text-neutral-800 mb-2">Title</Text>
  <Text className="text-sm text-neutral-600">Description</Text>
</View>

// After (Theme)
<View style={{
  backgroundColor: theme.surface,
  borderWidth: 1,
  borderColor: theme.border,
  borderRadius: 12,
  padding: 16,
}}>
  <Text style={{
    fontSize: 18,
    fontWeight: 'bold',
    color: theme.text,
    marginBottom: 8,
  }}>Title</Text>
  <Text style={{
    fontSize: 14,
    color: theme.textSecondary,
  }}>Description</Text>
</View>
```

### From Hardcoded Colors to Theme

```typescript
// Before (Hardcoded)
<Text style={{ color: '#FFD700' }}>★</Text>
<View style={{ backgroundColor: '#22c55e' }}>
  <Text style={{ color: '#ffffff' }}>Success</Text>
</View>

// After (Theme)
<Text style={{ color: theme.star }}>★</Text>
<View style={{ backgroundColor: theme.successContainer }}>
  <Text style={{ color: theme.onSuccess }}>Success</Text>
</View>
```

---

## 🎨 Theme Customization

### Adding New Colors

1. **Add to ThemeColors interface:**
```typescript
// src/context/ThemeContext.tsx
export interface ThemeColors {
  // ... existing colors
  customColor: string;
  customColorContainer: string;
  onCustomColor: string;
}
```

2. **Add to light and dark themes:**
```typescript
const lightTheme: ThemeColors = {
  // ... existing colors
  customColor: '#your-light-color',
  customColorContainer: '#your-light-container',
  onCustomColor: '#your-light-on-color',
};

const darkTheme: ThemeColors = {
  // ... existing colors
  customColor: '#your-dark-color',
  customColorContainer: '#your-dark-container',
  onCustomColor: '#your-dark-on-color',
};
```

3. **Use in components:**
```typescript
<View style={{ backgroundColor: theme.customColorContainer }}>
  <Text style={{ color: theme.onCustomColor }}>Custom Content</Text>
</View>
```

### Creating Theme Variants

```typescript
// Create a custom theme variant
const createCustomTheme = (baseTheme: ThemeColors): ThemeColors => ({
  ...baseTheme,
  primary: '#your-custom-primary',
  primaryContainer: '#your-custom-container',
  // ... other customizations
});
```

---

## 🚀 Advanced Usage

### Dynamic Color Generation

```typescript
import { withOpacity } from '../context/ThemeContext';

// Create variations of existing colors
const primaryVariants = {
  primary10: withOpacity(theme.primary, 0.1),
  primary20: withOpacity(theme.primary, 0.2),
  primary50: withOpacity(theme.primary, 0.5),
  primary80: withOpacity(theme.primary, 0.8),
};
```

### Conditional Theming

```typescript
const getThemedStyle = (condition: boolean) => ({
  backgroundColor: condition ? theme.successContainer : theme.errorContainer,
  borderColor: condition ? theme.success : theme.error,
  color: condition ? theme.onSuccess : theme.onError,
});
```

### Animation-Friendly Colors

```typescript
import Animated from 'react-native-reanimated';

// Colors work perfectly with animations
<Animated.View 
  style={{
    backgroundColor: theme.primary,
    // ... animation styles
  }}
/>
```

---

## 📱 StatusBar Theme Integration

### ThemedStatusBar Component

The app includes a `ThemedStatusBar` component that automatically adjusts based on the current theme:

```typescript
import { ThemedStatusBar } from '../components/ThemedStatusBar';

// Basic usage (automatic theme detection)
<ThemedStatusBar />

// With custom overrides
<ThemedStatusBar 
  barStyle="light-content"
  backgroundColor={theme.primary}
  translucent={false}
/>
```

### StatusBar Behavior

**Light Theme:**
- Bar style: `dark-content` (dark icons/text)
- Background: `theme.surface` (Android only)

**Dark Theme:**
- Bar style: `light-content` (white icons/text)  
- Background: `theme.surface` (Android only)

## 📱 Platform Considerations

### iOS Specific
- StatusBar style automatically matches theme
- Background color is handled by system
- Use `theme.overlay` for modal backgrounds
- `theme.backdropLight` works well with iOS blur effects

### Android Specific  
- StatusBar background color matches `theme.surface`
- `translucent` mode for full-screen experiences
- `elevation` values work with theme shadow colors
- Material Design patterns align with container/onContainer colors

### Web Specific
- All colors are web-safe
- CSS custom properties can be generated from theme colors
- StatusBar styling may not apply on web platforms

---

## 🔍 Troubleshooting

### Common Issues

1. **Color not updating on theme change**
   - Ensure you're using `theme.colorName` not hardcoded values
   - Check that component re-renders when theme changes

2. **Poor contrast in dark mode**
   - Use `onContainer` colors for text on colored backgrounds
   - Test both light and dark themes

3. **Inconsistent colors across screens**
   - Always import colors from theme context
   - Avoid mixing Tailwind classes with theme colors

### Debugging

```typescript
// Log current theme colors
console.log('Current theme:', theme);

// Check if theme is updating
useEffect(() => {
  console.log('Theme changed:', isDark ? 'dark' : 'light');
}, [isDark]);
```

---

## 🎯 Summary

The AgroConnect color system provides:

✅ **50+ semantic color variables**  
✅ **Perfect light/dark theme support**  
✅ **Zero hardcoded colors**  
✅ **Automatic theme persistence**  
✅ **Type-safe color usage**  
✅ **Pre-built style utilities**  
✅ **Animation compatibility**  
✅ **Platform optimization**  

By following this guide, you'll create consistent, beautiful, and maintainable UI components that automatically adapt to any theme changes, providing users with a seamless experience across light and dark modes.

---

**Need help?** Check the existing farmer screens (`src/screens/farmer/`) for real-world examples of the color system in action!
