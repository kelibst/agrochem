import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
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
      borderTopColor: theme.outline,
      paddingTop: 8,
      paddingBottom: 8,
      paddingHorizontal: 4,
    }}>
      <ScrollView 
        horizontal 
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16 }}
      >
        <View style={{ flexDirection: 'row', gap: 4 }}>
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
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  paddingHorizontal: 16,
                  paddingVertical: 8,
                  borderRadius: 12,
                  backgroundColor: isActive ? theme.primaryContainer : 'transparent',
                  minWidth: 80,
                }}
              >
                <Text style={{ 
                  fontSize: 20, 
                  marginBottom: 4,
                  opacity: isActive ? 1 : 0.7
                }}>
                  {tab.icon}
                </Text>
                <Text style={{
                  fontSize: 12,
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
      </ScrollView>
    </View>
  );
};