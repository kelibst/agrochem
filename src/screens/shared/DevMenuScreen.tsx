import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { Card } from '../../components/Card';
import { ThemeToggle } from '../../components/ThemeToggle';
import { Logo } from '../../components/Logo';
import { useTheme } from '../../context/ThemeContext';

interface DevMenuScreenProps {
  onNavigate: (screen: string) => void;
  onBack: () => void;
}

export const DevMenuScreen: React.FC<DevMenuScreenProps> = ({
  onNavigate,
  onBack,
}) => {
  const { theme } = useTheme();
  const screenCategories = [
    {
      title: 'Authentication Screens',
      icon: '🔐',
      screens: [
        { name: 'Welcome Screen', id: 'welcome', description: 'Landing page with app introduction' },
        { name: 'Login Screen', id: 'login', description: 'User login form' },
        { name: 'Register Screen', id: 'register', description: 'User registration form' },
        { name: 'Role Selection', id: 'role-selection', description: 'Choose farmer or shop owner' },
      ]
    },
    {
      title: 'Farmer Screens',
      icon: '👨‍🌾',
      screens: [
        { name: 'Farmer Home', id: 'farmer-home', description: 'Main dashboard for farmers' },
        { name: 'Product Browse', id: 'product-browse', description: 'Browse and search products' },
        { name: 'Product Details', id: 'product-details', description: 'Detailed product view' },
        { name: 'Cart Screen', id: 'cart', description: 'Shopping cart and checkout' },
        { name: 'Orders Screen', id: 'farmer-orders', description: 'Order history and tracking' },
        { name: 'Shop Finder', id: 'shop-finder', description: 'Find nearby shops with map' },
        { name: 'Messages', id: 'farmer-messages', description: 'Chat with shop owners' },
        { name: 'Profile', id: 'farmer-profile', description: 'Farmer profile management' },
      ]
    },
    {
      title: 'Shop Owner Screens',
      icon: '🏪',
      screens: [
        { name: 'Shop Dashboard', id: 'shop-dashboard', description: 'Main dashboard for shop owners' },
        { name: 'Inventory Management', id: 'inventory', description: 'Product inventory management' },
        { name: 'Add/Edit Product', id: 'product-form', description: 'Add or edit products' },
        { name: 'Order Management', id: 'shop-orders', description: 'Manage incoming orders' },
        { name: 'Analytics', id: 'analytics', description: 'Sales analytics and reports' },
        { name: 'Shop Profile', id: 'shop-profile', description: 'Shop information and settings' },
        { name: 'Customer Messages', id: 'shop-messages', description: 'Chat with customers' },
      ]
    },
    {
      title: 'Shared Screens',
      icon: '🔄',
      screens: [
        { name: 'Settings', id: 'settings', description: 'App settings and preferences' },
        { name: 'Notifications', id: 'notifications', description: 'Push notifications center' },
        { name: 'Help & Support', id: 'help', description: 'Help documentation and support' },
        { name: 'About', id: 'about', description: 'App information and credits' },
      ]
    },
    {
      title: 'Component Showcase',
      icon: '🧩',
      screens: [
        { name: 'Button Variants', id: 'button-showcase', description: 'All button styles and states' },
        { name: 'Card Components', id: 'card-showcase', description: 'Different card layouts' },
        { name: 'Input Components', id: 'input-showcase', description: 'Form inputs and validation' },
        { name: 'Color Palette', id: 'color-palette', description: 'App color scheme' },
        { name: 'Typography', id: 'typography', description: 'Text styles and fonts' },
        { name: 'Icons & Emojis', id: 'icons', description: 'Icon library showcase' },
      ]
    }
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      {/* Header */}
      <Animated.View 
        entering={FadeInUp.delay(200).duration(800)}
        style={{ 
          paddingHorizontal: 24,
          paddingTop: 16,
          paddingBottom: 24,
          backgroundColor: theme.surface,
        }}
      >
        <View style={{ 
          flexDirection: 'row', 
          alignItems: 'center', 
          justifyContent: 'space-between', 
          marginBottom: 16 
        }}>
          <TouchableOpacity onPress={onBack} style={{ padding: 8, marginLeft: -8 }}>
            <Text style={{ fontSize: 24, color: theme.text }}>←</Text>
          </TouchableOpacity>
          <Text style={{ 
            fontSize: 18, 
            fontWeight: '600', 
            color: theme.text 
          }}>
            Developer Menu
          </Text>
          <ThemeToggle />
        </View>

        <View style={{
          backgroundColor: theme.primary,
          borderRadius: 16,
          padding: 16,
          flexDirection: 'row',
          alignItems: 'center',
        }}>
          <View style={{ marginRight: 16 }}>
            <Logo width={48} height={48} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ 
              color: theme.onPrimary, 
              fontSize: 18, 
              fontWeight: '600', 
              marginBottom: 4 
            }}>
              AgroConnect Prototype
            </Text>
            <Text style={{ 
              color: theme.onPrimary + 'CC', 
              fontSize: 14 
            }}>
              Navigate to any screen for development and testing
            </Text>
          </View>
        </View>
      </Animated.View>

      {/* Screen Categories */}
      <ScrollView style={{ flex: 1, paddingHorizontal: 24 }} showsVerticalScrollIndicator={false}>
        {screenCategories.map((category, categoryIndex) => (
          <Animated.View
            key={category.title}
            entering={FadeInDown.delay(300 + categoryIndex * 100).duration(600)}
            style={{ marginBottom: 24 }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
              <Text style={{ fontSize: 24, marginRight: 12 }}>{category.icon}</Text>
              <Text style={{ 
                fontSize: 18, 
                fontWeight: 'bold', 
                color: theme.text 
              }}>
                {category.title}
              </Text>
            </View>

            {category.screens.map((screen, screenIndex) => (
              <Animated.View
                key={screen.id}
                entering={FadeInDown.delay(400 + categoryIndex * 100 + screenIndex * 50).duration(600)}
                style={{ marginBottom: 12 }}
              >
                <Card onPress={() => onNavigate(screen.id)}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                    <View style={{ flex: 1 }}>
                      <Text style={{ 
                        fontSize: 16, 
                        fontWeight: '600', 
                        color: theme.text, 
                        marginBottom: 4 
                      }}>
                        {screen.name}
                      </Text>
                      <Text style={{ 
                        fontSize: 14, 
                        color: theme.textSecondary 
                      }}>
                        {screen.description}
                      </Text>
                    </View>
                    <Text style={{ 
                      color: theme.primary, 
                      fontSize: 20, 
                      marginLeft: 16 
                    }}>
                      →
                    </Text>
                  </View>
                </Card>
              </Animated.View>
            ))}
          </Animated.View>
        ))}

        {/* App Info */}
        <Animated.View 
          entering={FadeInDown.delay(800).duration(800)}
          style={{ marginBottom: 32 }}
        >
          <Card>
            <View style={{ 
              alignItems: 'center',
              backgroundColor: theme.primaryContainer,
              borderRadius: 12,
              padding: 16,
              marginHorizontal: -16,
              marginVertical: -16,
            }}>
              <Text style={{ fontSize: 32, marginBottom: 12 }}>🌱</Text>
              <Text style={{ 
                fontSize: 18, 
                fontWeight: 'bold', 
                color: theme.onPrimaryContainer, 
                marginBottom: 8 
              }}>
                AgroConnect v1.0.0
              </Text>
              <Text style={{ 
                fontSize: 14, 
                color: theme.onPrimaryContainer, 
                textAlign: 'center',
                opacity: 0.8,
              }}>
                Beautiful prototype showcasing the complete agrochemical marketplace experience
              </Text>
            </View>
          </Card>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
};