# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview
AgroConnect is a React Native app connecting farmers with agrochemical shop owners, enabling easy buying/selling of agrochemicals and farm produce. Built with Expo Router, TypeScript, and NativeWind for styling with a comprehensive theme system.

### Always create a todo list
- Always creae  to do list in @plan when you need to carry out a complex task. 
- I will manually delete the todo list myself later.
-

### User Roles & Features
- **Farmers**: Browse agrochemicals, place orders, sell produce, find nearby shops, track orders, rate/review
- **Shop Owners**: Manage inventory, process orders, update shop details, view analytics, customer management
- **Admin**: Moderate listings, manage users, view analytics, handle disputes

## Development Commands

### Core Development
- `npm start` - Start Expo development server on port 19001
- `npm run android` - Start with Android simulator on port 19001
- `npm run ios` - Run on iOS simulator
- `npm run web` - Start web development server

### Building & Deployment
- `npm run build-apk` - Build APK for Android (preview profile)
- `npm run build-apk-local` - Build APK locally
- `npm run deploy` - Export for web and deploy

### Testing
No specific test commands defined in package.json - check with user if testing framework is set up.

## Architecture

### Project Structure
```
src/
├── app/           # Expo Router app directory
├── components/    # Reusable UI components
├── screens/       # Screen components organized by feature
├── context/       # React contexts (ThemeContext)
└── utils/         # Utility functions
```

### Frontend Technologies
- **Expo Router** (v5.1.4) - File-based routing system
- **NativeWind** (v4.0.1) - Tailwind CSS for React Native
- **TypeScript** with path aliases (`@/*` → `./src/*`)
- **React Native Reanimated** (v3.17.4) - Animations
- **AsyncStorage** - Local data persistence
- **React Hook Form** - Form handling and validation

### Backend & Services (Planned)
- **Firebase Authentication** - User authentication and authorization
- **Firestore Database** - Real-time NoSQL database
- **Firebase Storage** - Image and file storage
- **Firebase Cloud Functions** - Server-side logic
- **Firebase Cloud Messaging** - Push notifications

### Maps & Location Services (Planned)
- **React Native Maps** - Map integration
- **React Native Geolocation** - Location services
- **Google Places API** - Address autocomplete and geocoding

### Database Structure (Firestore)
**Collections:**
- `users` - User profiles and authentication data
- `shops` - Shop information and locations
- `products` - Product listings and details
- `orders` - Order transactions and status
- `categories` - Product categories
- `reviews` - Product and shop reviews
- `messages` - Communication between users

### Screen Organization
- `auth/` - Authentication screens (Login, Register, Role Selection)
- `farmer/` - Farmer-specific screens (Home, Cart, Orders, etc.)
- `shop/` - Shop owner screens (Dashboard, Inventory, Analytics)
- `shared/` - Shared screens (Dev Menu, Component Showcase)

## Theme System

### Universal Theme Architecture
The app uses a comprehensive theme system with 50+ semantic color variables in `src/context/ThemeContext.tsx`:

- **Theme Modes**: `light`, `dark`, `system` (auto-switching)
- **Semantic Colors**: Use `theme.star`, `theme.success`, not hardcoded hex values
- **Container Pattern**: Follow `color` + `colorContainer` + `onColor` pattern
- **Storage**: Theme preference persisted with AsyncStorage

### Theme Usage Rules
**ALWAYS:**
- Use `useTheme()` hook in components
- Use semantic color names (`theme.primary`, `theme.success`)
- Use pre-built styles from `createThemeStyle(theme)`
- Follow container + onContainer pattern for proper contrast

**NEVER:**
- Use hardcoded hex colors
- Use Tailwind color classes for colors (use spacing/layout only)
- Ignore theme context in new components

### Key Theme Colors
```typescript
theme.background, theme.surface, theme.text
theme.primary, theme.primaryContainer, theme.onPrimary
theme.success, theme.warning, theme.error, theme.info
theme.star, theme.favorite, theme.verified (semantic colors)
```

## Component Development

### Important Rules from .cursor/rules
- Use `Pressable` instead of `TouchableOpacity` (always replace when encountered)

### Theme Integration
All components must:
1. Import and use `useTheme()` hook
2. Use theme colors instead of hardcoded values
3. Support both light and dark modes
4. Use theme utilities for shadows, borders

### Example Component Pattern
```typescript
import { useTheme } from '@/context/ThemeContext';

export function MyComponent() {
  const { theme, styles } = useTheme();
  
  return (
    <View style={[styles.surface, { padding: 16 }]}>
      <Text style={styles.text}>Content</Text>
    </View>
  );
}
```

## File System Patterns

### Import Aliases
- `@/*` maps to `src/*` (configured in tsconfig.json)
- Use absolute imports: `import { Button } from '@/components/Button'`

### Asset Management
- Icons and images in `assets/` directory
- Fonts in `assets/fonts/`
- App icons and splash screens managed by Expo

## Build Configuration

### Expo Configuration
- App name: "agrochem"
- Uses Expo SDK 53.0.4
- EAS Build profiles: development, preview (APK), production (AAB)

### Android/iOS Native
- Android package: `com.kelibst.agrochem`
- Native code in `android/` and `ios/` directories
- Gradle configuration for Android builds

## Development Notes

### State Management
- Theme state managed by ThemeContext with AsyncStorage persistence
- No global state management library currently implemented

### Navigation
- Expo Router with file-based routing
- Layout component wraps entire app with theme and gesture handler
- Navigation structure follows app directory structure

### Styling Approach
- NativeWind for utility-first styling (spacing, layout)
- Theme system for all colors
- Custom animations defined in tailwind.config.js

## Common Patterns

### Screen Components
Most screens follow this pattern:
1. Import `useTheme` hook
2. Use theme colors and styles
3. Implement responsive design with NativeWind utilities
4. Handle loading/error states

### Form Components
- Input components use theme colors for borders and focus states
- Button components support different variants using theme colors
- Form validation patterns not yet established

## Backend Implementation Notes

### Core Features to Implement
**Authentication & User Management:**
- Email/phone registration and login
- Profile management with role-based access
- Password recovery

**Product Management:**
- Add/edit/delete products with image upload
- Category and subcategory organization
- Inventory tracking and price management

**Location Services:**
- Shop location mapping with distance calculation
- Route optimization and geofencing for delivery areas

**Order Management:**
- Shopping cart functionality and order placement
- Order tracking and history
- Payment integration (future)

**Communication:**
- In-app messaging system
- Push notifications and order status updates
- Review and rating system

### Development Phases for Backend
1. **Phase 1**: Firebase project setup and configuration
2. **Phase 2**: Authentication system implementation
3. **Phase 3**: Firestore database structure and rules
4. **Phase 4**: User profiles and shop management
5. **Phase 5**: Product management system
6. **Phase 6**: Location and maps integration
7. **Phase 7**: Order management system
8. **Phase 8**: Communication features

### Security Considerations
- Implement proper authentication flows
- Secure API endpoints with Firebase rules
- Validate all user inputs
- Protect sensitive data

When working with this codebase, always prioritize the theme system for colors and ensure new components integrate with the existing theme architecture.