import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { useTheme } from '../../context/ThemeContext';

const { width } = Dimensions.get('window');

interface AnalyticsScreenProps {
  onBackPress: () => void;
}

export const AnalyticsScreen: React.FC<AnalyticsScreenProps> = ({
  onBackPress,
}) => {
  const { theme } = useTheme();
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('month');

  const analytics = {
    week: {
      revenue: 'GHc1,247.50',
      orders: 12,
      customers: 8,
      avgOrder: 'GHc103.96',
      growth: '+12%',
    },
    month: {
      revenue: 'GHc8,456.25',
      orders: 67,
      customers: 34,
      avgOrder: 'GHc126.21',
      growth: '+18%',
    },
    year: {
      revenue: 'GHc89,342.75',
      orders: 523,
      customers: 189,
      avgOrder: 'GHc170.83',
      growth: '+24%',
    },
  };

  const topProducts = [
    { name: 'NPK Fertilizer 20-10-10', sales: 45, revenue: 'GHc2,250' },
    { name: 'Organic Pesticide Spray', sales: 32, revenue: 'GHc1,920' },
    { name: 'Corn Seeds Premium', sales: 28, revenue: 'GHc1,680' },
    { name: 'Soil pH Test Kit', sales: 23, revenue: 'GHc1,150' },
    { name: 'Growth Hormone', sales: 19, revenue: 'GHc950' },
  ];

  const customerMetrics = [
    { label: 'New Customers', value: '12', change: '+15%', isPositive: true },
    { label: 'Returning Customers', value: '22', change: '+8%', isPositive: true },
    { label: 'Customer Retention', value: '78%', change: '+5%', isPositive: true },
    { label: 'Avg. Order Frequency', value: '2.3x', change: '-2%', isPositive: false },
  ];

  const currentData = analytics[selectedPeriod];

  const PeriodSelector = () => (
    <View style={{ 
      flexDirection: 'row', 
      backgroundColor: theme.surfaceVariant, 
      borderRadius: 12, 
      padding: 4,
      marginBottom: 24,
    }}>
      {(['week', 'month', 'year'] as const).map((period) => (
        <TouchableOpacity
          key={period}
          onPress={() => setSelectedPeriod(period)}
          style={{
            flex: 1,
            paddingVertical: 8,
            paddingHorizontal: 16,
            borderRadius: 8,
            backgroundColor: selectedPeriod === period ? theme.primary : 'transparent',
            alignItems: 'center',
          }}
        >
          <Text style={{
            color: selectedPeriod === period ? theme.onPrimary : theme.text,
            fontWeight: selectedPeriod === period ? '600' : '500',
            textTransform: 'capitalize',
          }}>
            {period}
          </Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
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
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TouchableOpacity 
                onPress={onBackPress}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 12,
                  backgroundColor: theme.surfaceVariant,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: 16,
                }}
              >
                <Text style={{ fontSize: 18 }}>←</Text>
              </TouchableOpacity>
              <View>
                <Text style={{ fontSize: 24, fontWeight: 'bold', color: theme.text }}>Analytics 📊</Text>
                <Text style={{ color: theme.textSecondary }}>Business Performance</Text>
              </View>
            </View>
          </View>

          <PeriodSelector />

          {/* Key Metrics Cards */}
          <View style={{ flexDirection: 'row', gap: 12, marginBottom: 16 }}>
            <View style={{ flex: 1 }}>
              <Card>
                <View style={{ padding: 16, alignItems: 'center' }}>
                  <Text style={{ fontSize: 12, color: theme.textSecondary, marginBottom: 4 }}>Revenue</Text>
                  <Text style={{ fontSize: 20, fontWeight: 'bold', color: theme.text }}>{currentData.revenue}</Text>
                  <Text style={{ fontSize: 12, color: theme.success, marginTop: 2 }}>{currentData.growth}</Text>
                </View>
              </Card>
            </View>
            <View style={{ flex: 1 }}>
              <Card>
                <View style={{ padding: 16, alignItems: 'center' }}>
                  <Text style={{ fontSize: 12, color: theme.textSecondary, marginBottom: 4 }}>Orders</Text>
                  <Text style={{ fontSize: 20, fontWeight: 'bold', color: theme.text }}>{currentData.orders}</Text>
                  <Text style={{ fontSize: 12, color: theme.info, marginTop: 2 }}>Total</Text>
                </View>
              </Card>
            </View>
          </View>

          <View style={{ flexDirection: 'row', gap: 12 }}>
            <View style={{ flex: 1 }}>
              <Card>
                <View style={{ padding: 16, alignItems: 'center' }}>
                  <Text style={{ fontSize: 12, color: theme.textSecondary, marginBottom: 4 }}>Customers</Text>
                  <Text style={{ fontSize: 20, fontWeight: 'bold', color: theme.text }}>{currentData.customers}</Text>
                  <Text style={{ fontSize: 12, color: theme.accent, marginTop: 2 }}>Active</Text>
                </View>
              </Card>
            </View>
            <View style={{ flex: 1 }}>
              <Card>
                <View style={{ padding: 16, alignItems: 'center' }}>
                  <Text style={{ fontSize: 12, color: theme.textSecondary, marginBottom: 4 }}>Avg Order</Text>
                  <Text style={{ fontSize: 20, fontWeight: 'bold', color: theme.text }}>{currentData.avgOrder}</Text>
                  <Text style={{ fontSize: 12, color: theme.primary, marginTop: 2 }}>Value</Text>
                </View>
              </Card>
            </View>
          </View>
        </Animated.View>

        {/* Top Products */}
        <Animated.View 
          entering={FadeInDown.delay(300).duration(800)}
          style={{ paddingHorizontal: 24, marginBottom: 24 }}
        >
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: theme.text, marginBottom: 16 }}>Top Products</Text>
          
          {topProducts.map((product, index) => (
            <Animated.View
              key={product.name}
              entering={FadeInDown.delay(400 + index * 100).duration(600)}
              style={{ marginBottom: 12 }}
            >
              <Card>
                <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                  <View style={{ flex: 1 }}>
                    <Text style={{ fontSize: 16, fontWeight: '600', color: theme.text, marginBottom: 4 }}>
                      {product.name}
                    </Text>
                    <Text style={{ fontSize: 14, color: theme.textSecondary }}>
                      {product.sales} units sold
                    </Text>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={{ fontSize: 18, fontWeight: 'bold', color: theme.primary }}>
                      {product.revenue}
                    </Text>
                    <Text style={{ fontSize: 12, color: theme.textSecondary }}>
                      #{index + 1}
                    </Text>
                  </View>
                </View>
              </Card>
            </Animated.View>
          ))}
        </Animated.View>

        {/* Customer Metrics */}
        <Animated.View 
          entering={FadeInDown.delay(600).duration(800)}
          style={{ paddingHorizontal: 24, marginBottom: 24 }}
        >
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: theme.text, marginBottom: 16 }}>Customer Insights</Text>
          
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
            {customerMetrics.map((metric, index) => (
              <View key={metric.label} style={{ width: (width - 60) / 2 }}>
                <Card>
                  <View style={{ padding: 16, alignItems: 'center' }}>
                    <Text style={{ fontSize: 12, color: theme.textSecondary, marginBottom: 4, textAlign: 'center' }}>
                      {metric.label}
                    </Text>
                    <Text style={{ fontSize: 20, fontWeight: 'bold', color: theme.text, marginBottom: 4 }}>
                      {metric.value}
                    </Text>
                    <Text style={{ 
                      fontSize: 12, 
                      color: metric.isPositive ? theme.success : theme.error,
                      fontWeight: '500',
                    }}>
                      {metric.change}
                    </Text>
                  </View>
                </Card>
              </View>
            ))}
          </View>
        </Animated.View>

        {/* Actions */}
        <Animated.View 
          entering={FadeInDown.delay(800).duration(800)}
          style={{ paddingHorizontal: 24, paddingBottom: 24 }}
        >
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: theme.text, marginBottom: 16 }}>Export & Reports</Text>
          
          <Card>
            <View style={{ gap: 12 }}>
              <Button
                title="📊 Download Sales Report"
                onPress={() => {}}
                variant="outline"
              />
              <Button
                title="📈 Export Analytics Data"
                onPress={() => {}}
                variant="outline"
              />
              <Button
                title="👥 Customer Report"
                onPress={() => {}}
                variant="outline"
              />
            </View>
          </Card>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
};

