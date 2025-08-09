import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  FadeInUp,
  FadeInDown,
  SlideInRight,
  BounceIn,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
} from 'react-native-reanimated';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { useTheme } from '../../context/ThemeContext';

const { width } = Dimensions.get('window');

interface ProductDetailsScreenProps {
  productId?: string;
  onBack: () => void;
  onAddToCart: (productId: string, quantity: number) => void;
  onShopPress: (shopId: string) => void;
  onMessageShop: (shopId: string) => void;
}

export const ProductDetailsScreen: React.FC<ProductDetailsScreenProps> = ({
  productId = '1',
  onBack,
  onAddToCart,
  onShopPress,
  onMessageShop,
}) => {
  const { theme } = useTheme();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  
  const addToCartScale = useSharedValue(1);

  // Mock product data
  const product = {
    id: productId,
    name: 'Premium Fertilizer NPK 20-20-20',
    price: 45.99,
    originalPrice: 52.99,
    discount: 13,
    rating: 4.8,
    reviews: 156,
    inStock: true,
    stockCount: 24,
    category: 'Fertilizers',
    brand: 'AgroMax',
    weight: '25kg',
    description: 'High-quality NPK fertilizer perfect for all crops. Provides balanced nutrition for optimal plant growth and increased yield. Suitable for both indoor and outdoor cultivation.',
    features: [
      'Balanced NPK formula (20-20-20)',
      'Water-soluble granules',
      'Suitable for all crop types',
      'Increases yield by up to 30%',
      'Long-lasting nutrition',
      'Easy application'
    ],
    specifications: {
      'Nitrogen (N)': '20%',
      'Phosphorus (P)': '20%',
      'Potassium (K)': '20%',
      'Package Size': '25kg',
      'Application Rate': '2-3 kg per acre',
      'Storage': 'Cool, dry place'
    },
    images: ['🌾', '🌱', '📦', '🔬'], // Using emojis as placeholders
    shop: {
      id: 'shop1',
      name: 'Green Valley Supplies',
      rating: 4.9,
      location: '2.5 km away',
      verified: true
    }
  };

  const addToCartAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: addToCartScale.value }],
    };
  });

  const handleAddToCart = () => {
    addToCartScale.value = withSpring(0.95, { duration: 100 }, () => {
      addToCartScale.value = withSpring(1, { duration: 100 });
    });
    onAddToCart(product.id, quantity);
  };

  const adjustQuantity = (change: number) => {
    const newQuantity = Math.max(1, Math.min(product.stockCount, quantity + change));
    setQuantity(newQuantity);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      {/* Header */}
      <Animated.View
        entering={FadeInUp.delay(200).duration(600)}
        style={{
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'space-between',
          paddingHorizontal: 20,
          paddingVertical: 16,
          backgroundColor: theme.surface,
        }}
      >
        <TouchableOpacity onPress={onBack} style={{ padding: 8, marginLeft: -8 }}>
          <Text style={{ fontSize: 24, color: theme.text }}>←</Text>
        </TouchableOpacity>
        <Text style={{ fontSize: 18, fontWeight: '600', color: theme.text }}>
          Product Details
        </Text>
        <TouchableOpacity style={{ padding: 8, marginRight: -8 }}>
          <Text style={{ fontSize: 20, color: theme.text }}>♡</Text>
        </TouchableOpacity>
      </Animated.View>

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {/* Product Images */}
        <Animated.View
          entering={FadeInDown.delay(300).duration(600)}
          style={{ backgroundColor: theme.surface, paddingVertical: 20 }}
        >
          <View style={{ alignItems: 'center', marginBottom: 16 }}>
            <View
              style={{
                width: width * 0.8,
                height: 200,
                backgroundColor: theme.surfaceVariant,
                borderRadius: 16,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={{ fontSize: 80 }}>{product.images[selectedImage]}</Text>
            </View>
          </View>

          {/* Image Thumbnails */}
          <View style={{ flexDirection: 'row', justifyContent: 'center' }}>
            {product.images.map((image, index) => (
              <TouchableOpacity
                key={index}
                onPress={() => setSelectedImage(index)}
                style={{
                  width: 60,
                  height: 60,
                  backgroundColor: selectedImage === index ? theme.primaryContainer : theme.surfaceVariant,
                  borderRadius: 12,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginHorizontal: 6,
                  borderWidth: selectedImage === index ? 2 : 0,
                  borderColor: theme.primary,
                }}
              >
                <Text style={{ fontSize: 24 }}>{image}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>

        {/* Product Info */}
        <View style={{ paddingHorizontal: 20, paddingTop: 20 }}>
          <Animated.View entering={SlideInRight.delay(400).duration(600)}>
            <Card>
              <View style={{ marginBottom: 16 }}>
                <Text style={{ fontSize: 24, fontWeight: 'bold', color: theme.text, marginBottom: 8 }}>
                  {product.name}
                </Text>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                  <Text style={{ fontSize: 20, fontWeight: 'bold', color: theme.primary, marginRight: 8 }}>
                    ${product.price}
                  </Text>
                  <Text style={{ 
                    fontSize: 16, 
                    color: theme.textSecondary, 
                    textDecorationLine: 'line-through',
                    marginRight: 8 
                  }}>
                    ${product.originalPrice}
                  </Text>
                  <View style={{ 
                    backgroundColor: theme.error + '20', 
                    paddingHorizontal: 8, 
                    paddingVertical: 4, 
                    borderRadius: 6 
                  }}>
                    <Text style={{ fontSize: 12, color: theme.error, fontWeight: '600' }}>
                      -{product.discount}%
                    </Text>
                  </View>
                </View>

                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 12 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginRight: 16 }}>
                    <Text style={{ color: theme.star, marginRight: 4 }}>★</Text>
                    <Text style={{ fontSize: 14, color: theme.text, fontWeight: '600' }}>
                      {product.rating}
                    </Text>
                    <Text style={{ fontSize: 14, color: theme.textSecondary, marginLeft: 4 }}>
                      ({product.reviews} reviews)
                    </Text>
                  </View>
                  <View style={{ 
                    backgroundColor: product.inStock ? theme.success + '20' : theme.error + '20',
                    paddingHorizontal: 8,
                    paddingVertical: 4,
                    borderRadius: 6
                  }}>
                    <Text style={{ 
                      fontSize: 12, 
                      color: product.inStock ? theme.success : theme.error,
                      fontWeight: '600'
                    }}>
                      {product.inStock ? `${product.stockCount} in stock` : 'Out of stock'}
                    </Text>
                  </View>
                </View>

                <View style={{ flexDirection: 'row', flexWrap: 'wrap', marginBottom: 16 }}>
                  <View style={{ 
                    backgroundColor: theme.primaryContainer,
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    borderRadius: 8,
                    marginRight: 8,
                    marginBottom: 8
                  }}>
                    <Text style={{ fontSize: 12, color: theme.onPrimaryContainer, fontWeight: '600' }}>
                      {product.category}
                    </Text>
                  </View>
                  <View style={{ 
                    backgroundColor: theme.secondaryContainer,
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    borderRadius: 8,
                    marginRight: 8,
                    marginBottom: 8
                  }}>
                    <Text style={{ fontSize: 12, color: theme.onSecondaryContainer, fontWeight: '600' }}>
                      {product.brand}
                    </Text>
                  </View>
                  <View style={{ 
                    backgroundColor: theme.surfaceVariant,
                    paddingHorizontal: 12,
                    paddingVertical: 6,
                    borderRadius: 8,
                    marginBottom: 8
                  }}>
                    <Text style={{ fontSize: 12, color: theme.text, fontWeight: '600' }}>
                      {product.weight}
                    </Text>
                  </View>
                </View>
              </View>
            </Card>
          </Animated.View>

          {/* Description */}
          <Animated.View entering={SlideInRight.delay(500).duration(600)} style={{ marginTop: 16 }}>
            <Card>
              <Text style={{ fontSize: 18, fontWeight: 'bold', color: theme.text, marginBottom: 12 }}>
                Description
              </Text>
              <Text style={{ fontSize: 14, color: theme.textSecondary, lineHeight: 22 }}>
                {product.description}
              </Text>
            </Card>
          </Animated.View>

          {/* Features */}
          <Animated.View entering={SlideInRight.delay(600).duration(600)} style={{ marginTop: 16 }}>
            <Card>
              <Text style={{ fontSize: 18, fontWeight: 'bold', color: theme.text, marginBottom: 12 }}>
                Key Features
              </Text>
              {product.features.map((feature, index) => (
                <View key={index} style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 8 }}>
                  <Text style={{ color: theme.primary, marginRight: 8 }}>✓</Text>
                  <Text style={{ fontSize: 14, color: theme.textSecondary, flex: 1 }}>
                    {feature}
                  </Text>
                </View>
              ))}
            </Card>
          </Animated.View>

          {/* Specifications */}
          <Animated.View entering={SlideInRight.delay(700).duration(600)} style={{ marginTop: 16 }}>
            <Card>
              <Text style={{ fontSize: 18, fontWeight: 'bold', color: theme.text, marginBottom: 12 }}>
                Specifications
              </Text>
              {Object.entries(product.specifications).map(([key, value], index) => (
                <View key={index} style={{ 
                  flexDirection: 'row', 
                  justifyContent: 'space-between',
                  paddingVertical: 8,
                  borderBottomWidth: index < Object.entries(product.specifications).length - 1 ? 1 : 0,
                  borderBottomColor: theme.divider
                }}>
                  <Text style={{ fontSize: 14, color: theme.textSecondary, fontWeight: '600' }}>
                    {key}
                  </Text>
                  <Text style={{ fontSize: 14, color: theme.text }}>
                    {value}
                  </Text>
                </View>
              ))}
            </Card>
          </Animated.View>

          {/* Shop Info */}
          <Animated.View entering={SlideInRight.delay(800).duration(600)} style={{ marginTop: 16 }}>
            <Card onPress={() => onShopPress(product.shop.id)}>
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <View style={{ flex: 1 }}>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 4 }}>
                    <Text style={{ fontSize: 16, fontWeight: 'bold', color: theme.text, marginRight: 8 }}>
                      {product.shop.name}
                    </Text>
                    {product.shop.verified && (
                      <Text style={{ color: theme.primary }}>✓</Text>
                    )}
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ color: theme.star, marginRight: 4 }}>★</Text>
                    <Text style={{ fontSize: 14, color: theme.text, marginRight: 8 }}>
                      {product.shop.rating}
                    </Text>
                    <Text style={{ fontSize: 14, color: theme.textSecondary }}>
                      {product.shop.location}
                    </Text>
                  </View>
                </View>
                <TouchableOpacity
                  onPress={() => onMessageShop(product.shop.id)}
                  style={{
                    backgroundColor: theme.primaryContainer,
                    paddingHorizontal: 16,
                    paddingVertical: 8,
                    borderRadius: 8,
                  }}
                >
                  <Text style={{ fontSize: 12, color: theme.onPrimaryContainer, fontWeight: '600' }}>
                    Message
                  </Text>
                </TouchableOpacity>
              </View>
            </Card>
          </Animated.View>

          <View style={{ height: 120 }} />
        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      <Animated.View
        entering={BounceIn.delay(900).duration(600)}
        style={{
          backgroundColor: theme.surface,
          paddingHorizontal: 20,
          paddingVertical: 16,
          borderTopWidth: 1,
          borderTopColor: theme.divider,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
          {/* Quantity Selector */}
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            <Text style={{ fontSize: 14, color: theme.textSecondary, marginRight: 12 }}>
              Quantity:
            </Text>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TouchableOpacity
                onPress={() => adjustQuantity(-1)}
                style={{
                  width: 36,
                  height: 36,
                  backgroundColor: theme.surfaceVariant,
                  borderRadius: 8,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text style={{ fontSize: 18, color: theme.text }}>−</Text>
              </TouchableOpacity>
              <Text style={{ 
                fontSize: 16, 
                fontWeight: 'bold', 
                color: theme.text, 
                marginHorizontal: 16,
                minWidth: 24,
                textAlign: 'center'
              }}>
                {quantity}
              </Text>
              <TouchableOpacity
                onPress={() => adjustQuantity(1)}
                style={{
                  width: 36,
                  height: 36,
                  backgroundColor: theme.surfaceVariant,
                  borderRadius: 8,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text style={{ fontSize: 18, color: theme.text }}>+</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Add to Cart Button */}
          <Animated.View style={[addToCartAnimatedStyle, { paddingHorizontal: 24 }]}>
            <Button
              title={`Add to Cart • $${(product.price * quantity).toFixed(2)}`}
              onPress={handleAddToCart}
              variant="primary"
              disabled={!product.inStock}
            />
          </Animated.View>
        </View>
      </Animated.View>
    </SafeAreaView>
  );
};
