import React, { useState } from 'react';
import { View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useTheme } from '@/context/ThemeContext';
import { useAuth } from '@/context/AuthContext';
import { TabNavigation, TabItem } from '@/components/TabNavigation';

import { ShopDashboardScreen } from './ShopDashboardScreen';
import { InventoryScreen } from './InventoryScreen';
import { AnalyticsScreen } from './AnalyticsScreen';
import { AddProductScreen } from './AddProductScreen';
import { CustomerManagementScreen } from './CustomerManagementScreen';
import { ShopOwnerProfileScreen } from './ShopOwnerProfileScreen';

type ShopTabType = 'dashboard' | 'inventory' | 'analytics' | 'customers' | 'messages' | 'profile';

interface ShopOwnerDashboardProps {
  onProductPress: (productId: string) => void;
  onMessageCustomer: (customerId: string) => void;
  onMessagesPress: () => void;
  onLogout: () => void;
}

export const ShopOwnerDashboard: React.FC<ShopOwnerDashboardProps> = ({
  onProductPress,
  onMessageCustomer,
  onMessagesPress,
  onLogout,
}) => {
  const { theme, toggleTheme } = useTheme();
  const { userProfile } = useAuth();
  const [activeTab, setActiveTab] = useState<ShopTabType>('dashboard');
  const [showAddProduct, setShowAddProduct] = useState(false);

  // Route protection - only allow shop owners to access this dashboard
  if (!userProfile || userProfile.role !== 'shop_owner') {
    return null; // This should be handled by parent component
  }

  const tabs: TabItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: '📊',
      onPress: () => setActiveTab('dashboard'),
    },
    {
      id: 'inventory',
      label: 'Inventory',
      icon: '📦',
      onPress: () => setActiveTab('inventory'),
    },
    {
      id: 'analytics',
      label: 'Analytics',
      icon: '📈',
      onPress: () => setActiveTab('analytics'),
    },
    {
      id: 'customers',
      label: 'Customers',
      icon: '👥',
      onPress: () => setActiveTab('customers'),
    },
    {
      id: 'messages',
      label: 'Messages',
      icon: '💬',
      onPress: () => onMessagesPress(),
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: '👤',
      onPress: () => setActiveTab('profile'),
    },
  ];

  const renderActiveScreen = () => {
    if (showAddProduct) {
      return (
        <AddProductScreen
          onBackPress={() => setShowAddProduct(false)}
          onProductAdded={() => {
            setShowAddProduct(false);
            setActiveTab('inventory');
          }}
        />
      );
    }

    switch (activeTab) {
      case 'dashboard':
        return (
          <ShopDashboardScreen
            onOrderPress={() => {}}
            onInventoryPress={() => setActiveTab('inventory')}
            onAnalyticsPress={() => setActiveTab('analytics')}
            onMessagesPress={onMessagesPress}
            onAddProductPress={() => setShowAddProduct(true)}
            onCustomerManagementPress={() => setActiveTab('customers')}
          />
        );
      
      case 'inventory':
        return (
          <InventoryScreen
            onProductPress={onProductPress}
            onAddProductPress={() => setShowAddProduct(true)}
            onEditProductPress={(id) => {}}
            onBack={() => setActiveTab('dashboard')}
          />
        );
      
      case 'analytics':
        return (
          <AnalyticsScreen
            onBackPress={() => setActiveTab('dashboard')}
          />
        );
      
      case 'customers':
        return (
          <CustomerManagementScreen
            onBackPress={() => setActiveTab('dashboard')}
            onCustomerPress={(customerId) => onMessageCustomer(customerId)}
          />
        );
      
      case 'messages':
        // This should not render - navigation should happen in the tab press handler
        setActiveTab('dashboard');
        return null;
      
      case 'profile':
        return (
          <ShopOwnerProfileScreen
            onBackPress={() => setActiveTab('dashboard')}
            onThemeToggle={toggleTheme}
            onLogout={onLogout}
          />
        );
      
      default:
        return (
          <ShopDashboardScreen
            onOrderPress={() => {}}
            onInventoryPress={() => setActiveTab('inventory')}
            onAnalyticsPress={() => setActiveTab('analytics')}
            onMessagesPress={onMessagesPress}
            onAddProductPress={() => setShowAddProduct(true)}
            onCustomerManagementPress={() => setActiveTab('customers')}
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
        {!showAddProduct && (
          <TabNavigation
            tabs={tabs}
            activeTabId={activeTab}
            onTabPress={(tabId) => setActiveTab(tabId as ShopTabType)}
          />
        )}
      </View>
    </SafeAreaView>
  );
};