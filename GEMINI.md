# Gemini Code Assistant Project Configuration

## 1. Project Overview

This project is a React Native application designed to connect farmers with agrochemical shop owners. The platform facilitates the buying and selling of agrochemicals and farm produce, enhancing communication and commerce within the agricultural community.

- **Project Name**: AgroConnect
- **Primary Goal**: To create a mobile marketplace for farmers and agrochemical suppliers.

## 2. Technology Stack

The project is built with a modern mobile development stack:

- **Core Framework**: React Native
- **Language**: TypeScript
- **Styling**: NativeWind (Tailwind CSS for React Native)
- **Navigation**: Expo Router
- **State Management**: React Context & Hooks
- **Backend Services**: Firebase (Authentication, Firestore, Storage)
- **Platform**: Expo

## 3. Development Guidelines & Conventions

### Running the App

- **Start Development Server**: `npm start`
- **Run on Android**: `npm run android`
- **Run on iOS**: `npm run ios`

### Color System & Theming

The app uses a centralized, theme-aware color system. **All color usage must adhere to these guidelines.** Refer to `plan/color-system-guide.md` for the full documentation.

- **DO NOT** use hardcoded color values (e.g., `#FFFFFF`, `red`).
- **DO NOT** use Tailwind CSS color utilities (e.g., `bg-blue-500`, `text-gray-900`).
- **ALWAYS** use the `useTheme()` hook to access theme-specific colors.
- **ALWAYS** use semantic color names from the theme object (e.g., `theme.primary`, `theme.background`, `theme.onSurface`).

**Example Usage:**
```tsx
import { useTheme } from '../context/ThemeContext';
import { Text, View } from 'react-native';

const ThemedComponent = () => {
  const { theme } = useTheme();

  return (
    <View style={{ backgroundColor: theme.background }}>
      <Text style={{ color: theme.onBackground }}>
        This text color will adapt to the theme.
      </Text>
    </View>
  );
};
```

### Component Architecture

- **Reusability**: Create reusable components for common UI elements (buttons, inputs, cards).
- **Theming**: Ensure all components are theme-aware and use the `useTheme()` hook for styling.
- **Location**: Place new components in the appropriate subdirectory within `src/components/`.

### File and Folder Structure

- **Screens**: Located in `src/screens/`, organized by user role (e.g., `farmer`, `shop`) or shared context.
- **Components**: Reusable UI elements are in `src/components/`.
- **Context/State**: Global state and context providers are in `src/context/`.
- **Utilities**: Helper functions and utilities are in `src/utils/`.
- **Navigation**: The primary navigation and layout setup is in `src/app/_layout.tsx`.

### Linting & Formatting

The project uses Prettier and ESLint (configurations to be formalized). Please ensure your code adheres to the existing style before committing.

### Commit Messages

Follow the conventional commit format:

- `feat`: A new feature
- `fix`: A bug fix
- `docs`: Documentation only changes
- `style`: Changes that do not affect the meaning of the code (white-space, formatting, etc)
- `refactor`: A code change that neither fixes a bug nor adds a feature
- `chore`: Changes to the build process or auxiliary tools

**Example:** `feat: add user profile screen`
