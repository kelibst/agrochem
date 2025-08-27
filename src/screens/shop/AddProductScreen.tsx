import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { useTheme } from '../../context/ThemeContext';

interface AddProductScreenProps {
  onBackPress: () => void;
  onProductAdded: () => void;
}

export const AddProductScreen: React.FC<AddProductScreenProps> = ({
  onBackPress,
  onProductAdded,
}) => {
  const { theme } = useTheme();
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stock: '',
    unit: 'kg',
    brand: '',
    activeIngredient: '',
    applicationRate: '',
    safetyPeriod: '',
  });

  const categories = [
    'Fertilizers', 'Pesticides', 'Herbicides', 'Fungicides', 
    'Seeds', 'Growth Regulators', 'Soil Amendments', 'Equipment'
  ];

  const units = ['kg', 'liter', 'piece', 'bag', 'bottle', 'pack'];

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSave = () => {
    // Validate required fields
    if (!formData.name || !formData.price || !formData.category || !formData.stock) {
      Alert.alert('Missing Information', 'Please fill in all required fields.');
      return;
    }

    // Mock save - in real app, this would save to backend
    console.log('Saving product:', formData);
    Alert.alert(
      'Product Added',
      `${formData.name} has been added to your inventory.`,
      [{ text: 'OK', onPress: onProductAdded }]
    );
  };

  const CategorySelector = () => (
    <View>
      <Text style={{ fontSize: 16, fontWeight: '600', color: theme.text, marginBottom: 12 }}>
        Category *
      </Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
        {categories.map((category) => (
          <TouchableOpacity
            key={category}
            onPress={() => handleInputChange('category', category)}
            style={{
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderRadius: 20,
              backgroundColor: formData.category === category ? theme.primary : theme.surfaceVariant,
              borderWidth: 1,
              borderColor: formData.category === category ? theme.primary : theme.border,
            }}
          >
            <Text style={{
              color: formData.category === category ? theme.onPrimary : theme.text,
              fontSize: 14,
              fontWeight: '500',
            }}>
              {category}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  const UnitSelector = () => (
    <View>
      <Text style={{ fontSize: 16, fontWeight: '600', color: theme.text, marginBottom: 12 }}>
        Unit
      </Text>
      <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 16 }}>
        {units.map((unit) => (
          <TouchableOpacity
            key={unit}
            onPress={() => handleInputChange('unit', unit)}
            style={{
              paddingHorizontal: 12,
              paddingVertical: 6,
              borderRadius: 16,
              backgroundColor: formData.unit === unit ? theme.accent : theme.surfaceVariant,
              borderWidth: 1,
              borderColor: formData.unit === unit ? theme.accent : theme.border,
            }}
          >
            <Text style={{
              color: formData.unit === unit ? theme.onAccent : theme.text,
              fontSize: 12,
              fontWeight: '500',
            }}>
              {unit}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
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
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
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
                <Text style={{ fontSize: 24, fontWeight: 'bold', color: theme.text }}>Add Product ➕</Text>
                <Text style={{ color: theme.textSecondary }}>Create new inventory item</Text>
              </View>
            </View>
          </View>
        </Animated.View>

        {/* Form */}
        <Animated.View 
          entering={FadeInDown.delay(300).duration(800)}
          style={{ paddingHorizontal: 24, marginBottom: 24 }}
        >
          <Card>
            <View style={{ gap: 20 }}>
              {/* Basic Information */}
              <View>
                <Text style={{ fontSize: 18, fontWeight: 'bold', color: theme.text, marginBottom: 16 }}>
                  Basic Information
                </Text>
                
                <Input
                  label="Product Name *"
                  placeholder="e.g., NPK Fertilizer 20-10-10"
                  value={formData.name}
                  onChangeText={(text) => handleInputChange('name', text)}
                />
                
                <View style={{ marginTop: 16 }}>
                  <Text style={{ fontSize: 16, fontWeight: '600', color: theme.text, marginBottom: 8 }}>
                    Description
                  </Text>
                  <TextInput
                    style={{
                      borderWidth: 1,
                      borderColor: theme.border,
                      borderRadius: 8,
                      padding: 12,
                      backgroundColor: theme.surface,
                      color: theme.text,
                      minHeight: 80,
                      textAlignVertical: 'top',
                    }}
                    placeholder="Describe the product, its benefits, and usage instructions..."
                    placeholderTextColor={theme.textTertiary}
                    value={formData.description}
                    onChangeText={(text) => handleInputChange('description', text)}
                    multiline
                    numberOfLines={4}
                  />
                </View>

                <CategorySelector />
              </View>

              {/* Pricing & Stock */}
              <View>
                <Text style={{ fontSize: 18, fontWeight: 'bold', color: theme.text, marginBottom: 16 }}>
                  Pricing & Stock
                </Text>
                
                <View style={{ flexDirection: 'row', gap: 12 }}>
                  <View style={{ flex: 2 }}>
                    <Input
                      label="Price *"
                      placeholder="0.00"
                      value={formData.price}
                      onChangeText={(text) => handleInputChange('price', text)}
                      keyboardType="decimal-pad"
                    />
                  </View>
                  <View style={{ flex: 1 }}>
                    <Input
                      label="Stock *"
                      placeholder="100"
                      value={formData.stock}
                      onChangeText={(text) => handleInputChange('stock', text)}
                      keyboardType="numeric"
                    />
                  </View>
                </View>

                <UnitSelector />
              </View>

              {/* Product Details */}
              <View>
                <Text style={{ fontSize: 18, fontWeight: 'bold', color: theme.text, marginBottom: 16 }}>
                  Product Details
                </Text>
                
                <Input
                  label="Brand"
                  placeholder="e.g., AgroTech, FarmCorp"
                  value={formData.brand}
                  onChangeText={(text) => handleInputChange('brand', text)}
                />
                
                <Input
                  label="Active Ingredient"
                  placeholder="e.g., Glyphosate, Nitrogen"
                  value={formData.activeIngredient}
                  onChangeText={(text) => handleInputChange('activeIngredient', text)}
                />
                
                <Input
                  label="Application Rate"
                  placeholder="e.g., 2-3 kg per hectare"
                  value={formData.applicationRate}
                  onChangeText={(text) => handleInputChange('applicationRate', text)}
                />
                
                <Input
                  label="Safety Period (days)"
                  placeholder="e.g., 14"
                  value={formData.safetyPeriod}
                  onChangeText={(text) => handleInputChange('safetyPeriod', text)}
                  keyboardType="numeric"
                />
              </View>
            </View>
          </Card>
        </Animated.View>

        {/* Actions */}
        <Animated.View 
          entering={FadeInDown.delay(800).duration(800)}
          style={{ paddingHorizontal: 24, paddingBottom: 24 }}
        >
          <View style={{ gap: 12 }}>
            <Button
              title="💾 Save Product"
              onPress={handleSave}
              variant="primary"
              size="lg"
            />
            <Button
              title="Cancel"
              onPress={onBackPress}
              variant="outline"
            />
          </View>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
};

