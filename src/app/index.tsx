import React, { useState } from "react";
import { Text, View } from "react-native";
import { useTheme } from "../context/ThemeContext";
import { useAuth } from "../context/AuthContext";
import { useNotification } from "../context/NotificationContext";
import { FloatingDevButton } from "../components/FloatingDevButton";

// Import all screens
import { EntryScreen } from "../screens/shared/EntryScreen";
import { WelcomeScreen } from "../screens/auth/WelcomeScreen";
import { LoginScreen } from "../screens/auth/LoginScreen";
import { RegisterScreen } from "../screens/auth/RegisterScreen";
import { FarmerRegisterScreen } from "../screens/auth/FarmerRegisterScreen";
import { ShopOwnerRegisterScreen } from "../screens/auth/ShopOwnerRegisterScreen";
import { RoleSelectionScreen } from "../screens/auth/RoleSelectionScreen";
import { FarmerDashboard } from "../screens/farmer/FarmerDashboard";
import { ShopOwnerDashboard } from "../screens/shop/ShopOwnerDashboard";
import { ProductDetailsScreen } from "../screens/farmer/ProductDetailsScreen";
import { ShopFinderScreen } from "../screens/farmer/ShopFinderScreen";
import { RecommendationsScreen } from "../screens/farmer/RecommendationsScreen";
import { MessagesScreen } from "../screens/shared/MessagesScreen";
import { DevMenuScreen } from "../screens/shared/DevMenuScreen";
import { ComponentShowcaseScreen } from "../screens/shared/ComponentShowcaseScreen";

type ScreenType = 
  | 'entry' | 'welcome' | 'login' | 'register' | 'farmer-register' | 'shop-owner-register' | 'role-selection'
  | 'farmer-dashboard' | 'product-details' | 'shop-finder' | 'recommendations'
  | 'shop-dashboard'
  | 'farmer-messages' | 'shop-messages'
  | 'dev-menu' | 'component-showcase';

export default function Page() {
  const { theme } = useTheme();
  const { user, userProfile, isAuthenticated, isLoading, login, register, logout } = useAuth();
  const { showSuccess, showError } = useNotification();
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('entry');

  // Auto-navigate based on authentication status
  React.useEffect(() => {
    if (!isLoading) {
      if (isAuthenticated && userProfile) {
        // User is authenticated, navigate to appropriate dashboard ONLY if they're on auth screens
        const authScreens = ['entry', 'welcome', 'login', 'register', 'farmer-register', 'shop-owner-register', 'role-selection'];
        if (authScreens.includes(currentScreen)) {
          if (userProfile.role === 'farmer') {
            setCurrentScreen('farmer-dashboard');
          } else if (userProfile.role === 'shop_owner') {
            setCurrentScreen('shop-dashboard');
          }
        }
      } else if (!isAuthenticated && !['entry', 'welcome', 'login', 'register', 'farmer-register', 'shop-owner-register', 'dev-menu', 'component-showcase'].includes(currentScreen)) {
        // User is not authenticated and not on auth screens or dev screens, go back to entry
        setCurrentScreen('entry');
      }
    }
  }, [isAuthenticated, userProfile, isLoading, currentScreen]);

  const navigateToScreen = (screen: string) => {
    setCurrentScreen(screen as ScreenType);
  };

  const handleLogin = async (email: string, password: string) => {
    const result = await login(email, password);
    if (result.success) {
      showSuccess('Welcome back!', 'You have successfully signed in to your account.');
      // Navigate based on user role
      if (userProfile?.role === 'farmer') {
        setCurrentScreen('farmer-dashboard');
      } else if (userProfile?.role === 'shop_owner') {
        setCurrentScreen('shop-dashboard');
      }
    } else {
      showError('Login Failed', result.error || 'An error occurred during login. Please try again.');
      console.error('Login failed:', result.error);
    }
  };

  const handleRegister = async (data: any) => {
    const result = await register(data.email, data.password, data.userData);
    if (result.success) {
      showSuccess('Account Created!', 'Welcome to AgroConnect! Your account has been successfully created.');
      // Navigation will be handled by the useEffect when userProfile updates
    } else {
      showError('Registration Failed', result.error || 'An error occurred during registration. Please try again.');
      console.error('Registration failed:', result.error);
    }
  };

  const handleRoleSelection = (role: 'farmer' | 'shop_owner') => {
    // This is now handled during registration
    if (role === 'farmer') {
      setCurrentScreen('farmer-dashboard');
    } else {
      setCurrentScreen('shop-dashboard');
    }
  };

  // Show loading screen while authentication is loading
  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.background }}>
        <Text style={{ color: theme.text, fontSize: 18 }}>Loading...</Text>
      </View>
    );
  }

  const renderScreen = () => {
    switch (currentScreen) {
      case 'entry':
        return (
          <EntryScreen
            onGetStarted={() => setCurrentScreen('welcome')}
          />
        );

      case 'welcome':
        return (
          <WelcomeScreen
            onLogin={() => setCurrentScreen('login')}
            onRegister={() => setCurrentScreen('register')}
          />
        );

      case 'login':
        return (
          <LoginScreen
            onLogin={handleLogin}
            onForgotPassword={() => console.log('Forgot password')}
            onRegister={() => setCurrentScreen('register')}
            onBack={() => setCurrentScreen('welcome')}
          />
        );

      case 'register':
        return (
          <RoleSelectionScreen
            onRoleSelect={(role) => {
              if (role === 'farmer') {
                setCurrentScreen('farmer-register');
              } else {
                setCurrentScreen('shop-owner-register');
              }
            }}
            onBack={() => setCurrentScreen('welcome')}
          />
        );

      case 'farmer-register':
        return (
          <FarmerRegisterScreen
            onRegister={handleRegister}
            onLogin={() => setCurrentScreen('login')}
            onBack={() => setCurrentScreen('register')}
          />
        );

      case 'shop-owner-register':
        return (
          <ShopOwnerRegisterScreen
            onRegister={handleRegister}
            onLogin={() => setCurrentScreen('login')}
            onBack={() => setCurrentScreen('register')}
          />
        );

      case 'role-selection':
        return (
          <RoleSelectionScreen
            onRoleSelect={handleRoleSelection}
            onBack={() => setCurrentScreen('welcome')}
          />
        );

      case 'farmer-dashboard':
        return (
          <FarmerDashboard
            onProductPress={(id) => setCurrentScreen('product-details')}
            onShopPress={(id) => setCurrentScreen('shop-finder')}
            onMessageShop={(shopId) => setCurrentScreen('farmer-messages')}
            onLogout={async () => {
              await logout();
              showSuccess('Signed Out', 'You have been successfully signed out.');
              setCurrentScreen('entry');
            }}
          />
        );

      case 'product-details':
        return (
          <ProductDetailsScreen
            onBack={() => setCurrentScreen('farmer-dashboard')}
            onAddToCart={(productId, quantity) => {
              console.log('Added to cart:', productId, quantity);
              setCurrentScreen('farmer-dashboard');
            }}
            onShopPress={(shopId) => setCurrentScreen('shop-finder')}
            onMessageShop={(shopId) => setCurrentScreen('farmer-messages')}
          />
        );

      case 'shop-finder':
        return (
          <ShopFinderScreen
            onBack={() => setCurrentScreen('farmer-dashboard')}
            onShopPress={(shopId) => console.log('Shop pressed:', shopId)}
            onCallShop={(phone) => console.log('Call shop:', phone)}
            onGetDirections={(shopId) => console.log('Get directions:', shopId)}
            onMessageShop={(shopId) => setCurrentScreen('farmer-messages')}
          />
        );

      case 'shop-dashboard':
        return (
          <ShopOwnerDashboard
            onProductPress={(id) => console.log('Product pressed:', id)}
            onMessageCustomer={(customerId) => setCurrentScreen('shop-messages')}
            onLogout={async () => {
              await logout();
              showSuccess('Signed Out', 'You have been successfully signed out.');
              setCurrentScreen('entry');
            }}
          />
        );

      case 'recommendations':
        return (
          <RecommendationsScreen
            onBackPress={() => setCurrentScreen('farmer-dashboard')}
            onProductPress={(productId) => setCurrentScreen('product-details')}
            onAddToCart={(productId) => {
              console.log('Added to cart:', productId);
              setCurrentScreen('farmer-dashboard');
            }}
          />
        );

      case 'farmer-messages':
        return (
          <MessagesScreen
            onBack={() => setCurrentScreen('farmer-dashboard')}
            userType="farmer"
          />
        );

      case 'shop-messages':
        return (
          <MessagesScreen
            onBack={() => setCurrentScreen('shop-dashboard')}
            userType="shop_owner"
          />
        );

      case 'component-showcase':
        return (
          <ComponentShowcaseScreen
            onBack={() => setCurrentScreen('dev-menu')}
          />
        );

      case 'dev-menu':
      default:
        return (
          <DevMenuScreen
            onNavigate={navigateToScreen}
            onBack={() => setCurrentScreen('entry')}
          />
        );
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      {renderScreen()}
      
      {/* Floating Dev Button - Hide on dev-menu and entry screens */}
      <FloatingDevButton
        onPress={() => setCurrentScreen('dev-menu')}
        visible={currentScreen !== 'dev-menu' && currentScreen !== 'entry'}
      />
    </View>
  );
}
