import React, { useState } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { TabNavigation, TabItem } from '@/components/TabNavigation';

import { FarmerHomeScreen } from './FarmerHomeScreen';
import { ProfileScreen } from './ProfileScreen';
import { OrdersScreen } from './OrdersScreen';
import { CartScreen } from './CartScreen';
import { ProductBrowseScreen } from './ProductBrowseScreen';

type FarmerTabType = 'home' | 'browse' | 'cart' | 'orders' | 'profile';

interface FarmerDashboardProps {
  onProductPress: (productId: string) => void;
  onShopPress: (shopId: string) => void;
  onMessageShop: (shopId: string) => void;
  onLogout: () => void;
}

export const FarmerDashboard: React.FC<FarmerDashboardProps> = ({
  onProductPress,
  onShopPress,
  onMessageShop,
  onLogout,
}) => {
  const { theme } = useTheme();
  const { userProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<FarmerTabType>('home');

  // Route protection - only allow farmers to access this dashboard
  if (!userProfile || userProfile.role !== 'farmer') {
    return null; // This should be handled by parent component
  }

  const tabs: TabItem[] = [
    {
      id: 'home',
      label: 'Home',
      icon: '🏠',
      onPress: () => setActiveTab('home'),
    },
    {
      id: 'browse',
      label: 'Browse',
      icon: '🔍',
      onPress: () => setActiveTab('browse'),
    },
    {
      id: 'cart',
      label: 'Cart',
      icon: '🛒',
      onPress: () => setActiveTab('cart'),
    },
    {
      id: 'orders',
      label: 'Orders',
      icon: '📦',
      onPress: () => setActiveTab('orders'),
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: '👤',
      onPress: () => setActiveTab('profile'),
    },
  ];

  const renderActiveScreen = () => {
    switch (activeTab) {
      case 'home':
        return (
          <FarmerHomeScreen
            onSearchPress={() => setActiveTab('browse')}
            onProductPress={onProductPress}
            onShopPress={onShopPress}
            onCategoryPress={() => setActiveTab('browse')}
            onViewAllProducts={() => setActiveTab('browse')}
            onViewAllShops={() => {}}
            onProfilePress={() => setActiveTab('profile')}
            onRecommendationsPress={() => {}}
            onOrdersPress={() => setActiveTab('orders')}
            onCartPress={() => setActiveTab('cart')}
          />
        );
      
      case 'browse':
        return (
          <ProductBrowseScreen
            onProductPress={onProductPress}
            onFilterPress={() => {}}
            onBack={() => setActiveTab('home')}
          />
        );
      
      case 'cart':
        return (
          <CartScreen
            onBack={() => setActiveTab('browse')}
            onCheckout={() => setActiveTab('orders')}
            onProductPress={onProductPress}
            onShopPress={onShopPress}
            onContinueShopping={() => setActiveTab('browse')}
          />
        );
      
      case 'orders':
        return (
          <OrdersScreen
            onOrderPress={() => {}}
            onTrackOrder={() => {}}
            onReorder={() => {}}
            onBack={() => setActiveTab('home')}
          />
        );
      
      case 'profile':
        return (
          <ProfileScreen
            onBackPress={() => setActiveTab('home')}
            onThemeToggle={() => {}}
            onLogout={onLogout}
          />
        );
      
      default:
        return (
          <FarmerHomeScreen
            onSearchPress={() => setActiveTab('browse')}
            onProductPress={onProductPress}
            onShopPress={onShopPress}
            onCategoryPress={() => setActiveTab('browse')}
            onViewAllProducts={() => setActiveTab('browse')}
            onViewAllShops={() => {}}
            onProfilePress={() => setActiveTab('profile')}
            onRecommendationsPress={() => {}}
            onOrdersPress={() => setActiveTab('orders')}
            onCartPress={() => setActiveTab('cart')}
          />
        );
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }} edges={['top', 'left', 'right']}>
      <View style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          {renderActiveScreen()}
        </View>
        <TabNavigation
          tabs={tabs}
          activeTabId={activeTab}
          onTabPress={(tabId) => setActiveTab(tabId as FarmerTabType)}
        />
      </View>
    </SafeAreaView>
  );
};