import React, { useState } from "react";
import { Text, View } from "react-native";
import { useTheme } from "../context/ThemeContext";
import { FloatingDevButton } from "../components/FloatingDevButton";

// Import all screens
import { WelcomeScreen } from "../screens/auth/WelcomeScreen";
import { LoginScreen } from "../screens/auth/LoginScreen";
import { RegisterScreen } from "../screens/auth/RegisterScreen";
import { RoleSelectionScreen } from "../screens/auth/RoleSelectionScreen";
import { FarmerHomeScreen } from "../screens/farmer/FarmerHomeScreen";
import { ProductBrowseScreen } from "../screens/farmer/ProductBrowseScreen";
import { OrdersScreen } from "../screens/farmer/OrdersScreen";
import { ShopDashboardScreen } from "../screens/shop/ShopDashboardScreen";
import { InventoryScreen } from "../screens/shop/InventoryScreen";
import { DevMenuScreen } from "../screens/shared/DevMenuScreen";
import { ComponentShowcaseScreen } from "../screens/shared/ComponentShowcaseScreen";

type ScreenType = 
  | 'welcome' | 'login' | 'register' | 'role-selection'
  | 'farmer-home' | 'product-browse' | 'farmer-orders'
  | 'shop-dashboard' | 'inventory'
  | 'dev-menu' | 'component-showcase';

export default function Page() {
  const { theme } = useTheme();
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('dev-menu');
  const [userRole, setUserRole] = useState<'farmer' | 'shop_owner' | null>(null);

  const navigateToScreen = (screen: string) => {
    setCurrentScreen(screen as ScreenType);
  };

  const handleLogin = (email: string, password: string) => {
    // Mock login - in real app, this would authenticate with backend
    console.log('Login attempt:', { email, password });
    setCurrentScreen('role-selection');
  };

  const handleRegister = (data: any) => {
    // Mock registration - in real app, this would register with backend
    console.log('Registration data:', data);
    setCurrentScreen('role-selection');
  };

  const handleRoleSelection = (role: 'farmer' | 'shop_owner') => {
    setUserRole(role);
    if (role === 'farmer') {
      setCurrentScreen('farmer-home');
    } else {
      setCurrentScreen('shop-dashboard');
    }
  };

  const renderScreen = () => {
    switch (currentScreen) {
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
          <RegisterScreen
            onRegister={handleRegister}
            onLogin={() => setCurrentScreen('login')}
            onBack={() => setCurrentScreen('welcome')}
          />
        );

      case 'role-selection':
        return (
          <RoleSelectionScreen
            onRoleSelect={handleRoleSelection}
            onBack={() => setCurrentScreen('welcome')}
          />
        );

      case 'farmer-home':
        return (
          <FarmerHomeScreen
            onSearchPress={() => setCurrentScreen('product-browse')}
            onProductPress={(id) => console.log('Product pressed:', id)}
            onShopPress={(id) => console.log('Shop pressed:', id)}
            onCategoryPress={(category) => console.log('Category:', category)}
            onViewAllProducts={() => setCurrentScreen('product-browse')}
            onViewAllShops={() => console.log('View all shops')}
          />
        );

      case 'product-browse':
        return (
          <ProductBrowseScreen
            onProductPress={(id) => console.log('Product pressed:', id)}
            onFilterPress={() => console.log('Filter pressed')}
            onBack={() => setCurrentScreen('farmer-home')}
          />
        );

      case 'farmer-orders':
        return (
          <OrdersScreen
            onOrderPress={(id) => console.log('Order pressed:', id)}
            onTrackOrder={(id) => console.log('Track order:', id)}
            onReorder={(id) => console.log('Reorder:', id)}
            onBack={() => setCurrentScreen('farmer-home')}
          />
        );

      case 'shop-dashboard':
        return (
          <ShopDashboardScreen
            onOrderPress={(id) => console.log('Order pressed:', id)}
            onInventoryPress={() => setCurrentScreen('inventory')}
            onAnalyticsPress={() => console.log('Analytics pressed')}
            onMessagesPress={() => console.log('Messages pressed')}
            onAddProductPress={() => console.log('Add product pressed')}
          />
        );

      case 'inventory':
        return (
          <InventoryScreen
            onProductPress={(id) => console.log('Product pressed:', id)}
            onAddProductPress={() => console.log('Add product pressed')}
            onEditProductPress={(id) => console.log('Edit product:', id)}
            onBack={() => setCurrentScreen('shop-dashboard')}
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
            onBack={() => setCurrentScreen('welcome')}
          />
        );
    }
  };

  return (
    <View style={{ flex: 1, backgroundColor: theme.background }}>
      {renderScreen()}
      
      {/* Floating Dev Button - Hide on dev-menu screen */}
      <FloatingDevButton
        onPress={() => setCurrentScreen('dev-menu')}
        visible={currentScreen !== 'dev-menu'}
      />
    </View>
  );
}
