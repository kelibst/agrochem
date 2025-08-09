import React, { useState } from "react";
import { Text, View } from "react-native";
import { useTheme } from "../context/ThemeContext";
import { FloatingDevButton } from "../components/FloatingDevButton";

// Import all screens
import { EntryScreen } from "../screens/shared/EntryScreen";
import { WelcomeScreen } from "../screens/auth/WelcomeScreen";
import { LoginScreen } from "../screens/auth/LoginScreen";
import { RegisterScreen } from "../screens/auth/RegisterScreen";
import { RoleSelectionScreen } from "../screens/auth/RoleSelectionScreen";
import { FarmerHomeScreen } from "../screens/farmer/FarmerHomeScreen";
import { ProductBrowseScreen } from "../screens/farmer/ProductBrowseScreen";
import { ProductDetailsScreen } from "../screens/farmer/ProductDetailsScreen";
import { CartScreen } from "../screens/farmer/CartScreen";
import { ShopFinderScreen } from "../screens/farmer/ShopFinderScreen";
import { OrdersScreen } from "../screens/farmer/OrdersScreen";
import { ShopDashboardScreen } from "../screens/shop/ShopDashboardScreen";
import { InventoryScreen } from "../screens/shop/InventoryScreen";
import { MessagesScreen } from "../screens/shared/MessagesScreen";
import { DevMenuScreen } from "../screens/shared/DevMenuScreen";
import { ComponentShowcaseScreen } from "../screens/shared/ComponentShowcaseScreen";

type ScreenType = 
  | 'entry' | 'welcome' | 'login' | 'register' | 'role-selection'
  | 'farmer-home' | 'product-browse' | 'product-details' | 'cart' | 'shop-finder' | 'farmer-orders'
  | 'shop-dashboard' | 'inventory'
  | 'farmer-messages' | 'shop-messages'
  | 'dev-menu' | 'component-showcase';

export default function Page() {
  const { theme } = useTheme();
  const [currentScreen, setCurrentScreen] = useState<ScreenType>('entry');
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
            onProductPress={(id) => setCurrentScreen('product-details')}
            onShopPress={(id) => setCurrentScreen('shop-finder')}
            onCategoryPress={(category) => setCurrentScreen('product-browse')}
            onViewAllProducts={() => setCurrentScreen('product-browse')}
            onViewAllShops={() => setCurrentScreen('shop-finder')}
          />
        );

      case 'product-browse':
        return (
          <ProductBrowseScreen
            onProductPress={(id) => setCurrentScreen('product-details')}
            onFilterPress={() => console.log('Filter pressed')}
            onBack={() => setCurrentScreen('farmer-home')}
          />
        );

      case 'product-details':
        return (
          <ProductDetailsScreen
            onBack={() => setCurrentScreen('product-browse')}
            onAddToCart={(productId, quantity) => {
              console.log('Added to cart:', productId, quantity);
              setCurrentScreen('cart');
            }}
            onShopPress={(shopId) => setCurrentScreen('shop-finder')}
            onMessageShop={(shopId) => setCurrentScreen('farmer-messages')}
          />
        );

      case 'cart':
        return (
          <CartScreen
            onBack={() => setCurrentScreen('product-details')}
            onCheckout={(items, total) => {
              console.log('Checkout:', items, total);
              setCurrentScreen('farmer-orders');
            }}
            onProductPress={(productId) => setCurrentScreen('product-details')}
            onShopPress={(shopId) => setCurrentScreen('shop-finder')}
            onContinueShopping={() => setCurrentScreen('product-browse')}
          />
        );

      case 'shop-finder':
        return (
          <ShopFinderScreen
            onBack={() => setCurrentScreen('farmer-home')}
            onShopPress={(shopId) => console.log('Shop pressed:', shopId)}
            onCallShop={(phone) => console.log('Call shop:', phone)}
            onGetDirections={(shopId) => console.log('Get directions:', shopId)}
            onMessageShop={(shopId) => setCurrentScreen('farmer-messages')}
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
            onMessagesPress={() => setCurrentScreen('shop-messages')}
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

      case 'farmer-messages':
        return (
          <MessagesScreen
            onBack={() => setCurrentScreen('farmer-home')}
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
