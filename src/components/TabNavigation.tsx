import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { useTheme } from '@/context/ThemeContext';

export interface TabItem {
  id: string;
  label: string;
  icon: string;
  onPress: () => void;
}

interface TabNavigationProps {
  tabs: TabItem[];
  activeTabId: string;
  onTabPress: (tabId: string) => void;
}

export const TabNavigation: React.FC<TabNavigationProps> = ({
  tabs,
  activeTabId,
  onTabPress,
}) => {
  const { theme } = useTheme();

  return (
    <View style={{
      backgroundColor: theme.surface,
      borderTopWidth: 1,
      borderTopColor: theme.accent,
      paddingTop: 8,
      paddingBottom: 8,
      paddingHorizontal: 8,
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
    }}>
      {tabs.map((tab) => {
        const isActive = tab.id === activeTabId;
        return (
          <TouchableOpacity
            key={tab.id}
            onPress={() => {
              onTabPress(tab.id);
              tab.onPress();
            }}
            style={{
              flex: 1,
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              paddingVertical: 8,
              paddingHorizontal: 4,
              borderRadius: 12,
              backgroundColor: isActive ? theme.primaryContainer : 'transparent',
              maxWidth: 80,
              minHeight: 60,
            }}
          >
            <Text style={{ 
              fontSize: 18, 
              marginBottom: 4,
              opacity: isActive ? 1 : 0.7
            }}>
              {tab.icon}
            </Text>
            <Text 
              numberOfLines={1}
              style={{
                fontSize: 10,
                fontWeight: isActive ? '600' : '400',
                color: isActive ? theme.onPrimaryContainer : theme.textSecondary,
                textAlign: 'center',
              }}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};