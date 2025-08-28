import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  FadeInUp,
  FadeInDown,
  SlideInRight,
  SlideOutRight,
  BounceIn,
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  Layout,
} from 'react-native-reanimated';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { useTheme } from '../../context/ThemeContext';

interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
  shop: string;
  inStock: boolean;
  maxStock: number;
}

interface CartScreenProps {
  onBack: () => void;
  onCheckout: (items: CartItem[], total: number) => void;
  onProductPress: (productId: string) => void;
  onShopPress: (shopId: string) => void;
  onContinueShopping: () => void;
}

export const CartScreen: React.FC<CartScreenProps> = ({
  onBack,
  onCheckout,
  onProductPress,
  onShopPress,
  onContinueShopping,
}) => {
  const { theme } = useTheme();
  
  // Mock cart data
  const [cartItems, setCartItems] = useState<CartItem[]>([
    {
      id: '1',
      name: 'Premium Fertilizer NPK 20-20-20',
      price: 45.99,
      quantity: 2,
      image: '🌾',
      shop: 'Green Valley Supplies',
      inStock: true,
      maxStock: 24,
    },
    {
      id: '2',
      name: 'Organic Pesticide Spray',
      price: 28.50,
      quantity: 1,
      image: '🧪',
      shop: 'EcoFarm Solutions',
      inStock: true,
      maxStock: 15,
    },
    {
      id: '3',
      name: 'Soil pH Test Kit',
      price: 19.99,
      quantity: 1,
      image: '🔬',
      shop: 'AgriTools Pro',
      inStock: false,
      maxStock: 0,
    },
  ]);

  const checkoutScale = useSharedValue(1);

  const subtotal = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const shipping = subtotal > 100 ? 0 : 12.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;

  const updateQuantity = (itemId: string, newQuantity: number) => {
    if (newQuantity === 0) {
      removeItem(itemId);
      return;
    }

    setCartItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId
          ? { ...item, quantity: Math.min(newQuantity, item.maxStock) }
          : item
      )
    );
  };

  const removeItem = (itemId: string) => {
    Alert.alert(
      'Remove Item',
      'Are you sure you want to remove this item from your cart?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Remove',
          style: 'destructive',
          onPress: () => {
            setCartItems(prevItems => prevItems.filter(item => item.id !== itemId));
          },
        },
      ]
    );
  };

  const handleCheckout = () => {
    const availableItems = cartItems.filter(item => item.inStock);
    if (availableItems.length === 0) {
      Alert.alert('Cart Empty', 'Please add items to your cart before checkout.');
      return;
    }

    checkoutScale.value = withSpring(0.95, { duration: 100 }, () => {
      checkoutScale.value = withSpring(1, { duration: 100 });
    });

    onCheckout(availableItems, total);
  };

  const checkoutAnimatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: checkoutScale.value }],
    };
  });

  const CartItemCard = ({ item, index }: { item: CartItem; index: number }) => (
    <Animated.View
      key={item.id}
      entering={SlideInRight.delay(index * 100).duration(600)}
      exiting={SlideOutRight.duration(400)}
      layout={Layout.springify()}
      style={{ marginBottom: 16 }}
    >
      <Card>
        <TouchableOpacity onPress={() => onProductPress(item.id)}>
          <View style={{ flexDirection: 'row', alignItems: 'center' }}>
            {/* Product Image */}
            <View
              style={{
                width: 80,
                height: 80,
                backgroundColor: theme.surfaceVariant,
                borderRadius: 12,
                alignItems: 'center',
                justifyContent: 'center',
                marginRight: 16,
              }}
            >
              <Text style={{ fontSize: 32 }}>{item.image}</Text>
            </View>

            {/* Product Info */}
            <View style={{ flex: 1 }}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: '600',
                  color: theme.text,
                  marginBottom: 4,
                }}
                numberOfLines={2}
              >
                {item.name}
              </Text>
              
              <TouchableOpacity onPress={() => onShopPress(item.shop)}>
                <Text
                  style={{
                    fontSize: 14,
                    color: theme.primary,
                    marginBottom: 8,
                  }}
                >
                  {item.shop}
                </Text>
              </TouchableOpacity>

              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: 'bold',
                    color: theme.primary,
                  }}
                >
                  GHC ${item.price.toFixed(2)}
                </Text>

                {!item.inStock && (
                  <View
                    style={{
                      backgroundColor: theme.error + '20',
                      paddingHorizontal: 8,
                      paddingVertical: 4,
                      borderRadius: 6,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 12,
                        color: theme.error,
                        fontWeight: '600',
                      }}
                    >
                      Out of Stock
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </View>

          {/* Quantity Controls */}
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              marginTop: 16,
              paddingTop: 16,
              borderTopWidth: 1,
              borderTopColor: theme.divider,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <TouchableOpacity
                onPress={() => updateQuantity(item.id, item.quantity - 1)}
                style={{
                  width: 32,
                  height: 32,
                  backgroundColor: theme.surfaceVariant,
                  borderRadius: 8,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text style={{ fontSize: 16, color: theme.text }}>−</Text>
              </TouchableOpacity>

              <Text
                style={{
                  fontSize: 16,
                  fontWeight: 'bold',
                  color: theme.text,
                  marginHorizontal: 16,
                  minWidth: 24,
                  textAlign: 'center',
                }}
              >
                {item.quantity}
              </Text>

              <TouchableOpacity
                onPress={() => updateQuantity(item.id, item.quantity + 1)}
                disabled={item.quantity >= item.maxStock || !item.inStock}
                style={{
                  width: 32,
                  height: 32,
                  backgroundColor: theme.surfaceVariant,
                  borderRadius: 8,
                  alignItems: 'center',
                  justifyContent: 'center',
                  opacity: (item.quantity >= item.maxStock || !item.inStock) ? 0.5 : 1,
                }}
              >
                <Text style={{ fontSize: 16, color: theme.text }}>+</Text>
              </TouchableOpacity>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: 'bold',
                  color: theme.text,
                  marginRight: 16,
                }}
              >
                GHC ${(item.price * item.quantity).toFixed(2)}
              </Text>

              <TouchableOpacity
                onPress={() => removeItem(item.id)}
                style={{
                  padding: 8,
                  borderRadius: 8,
                }}
              >
                <Text style={{ fontSize: 18, color: theme.error }}>🗑️</Text>
              </TouchableOpacity>
            </View>
          </View>
        </TouchableOpacity>
      </Card>
    </Animated.View>
  );

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
          Shopping Cart ({cartItems.length})
        </Text>
        <View style={{ width: 40 }} />
      </Animated.View>

      {cartItems.length === 0 ? (
        /* Empty Cart */
        <Animated.View
          entering={FadeInDown.delay(400).duration(800)}
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: 32,
          }}
        >
          <Text style={{ fontSize: 80, marginBottom: 24 }}>🛒</Text>
          <Text
            style={{
              fontSize: 24,
              fontWeight: 'bold',
              color: theme.text,
              textAlign: 'center',
              marginBottom: 12,
            }}
          >
            Your cart is empty
          </Text>
          <Text
            style={{
              fontSize: 16,
              color: theme.textSecondary,
              textAlign: 'center',
              marginBottom: 32,
              lineHeight: 24,
            }}
          >
            Looks like you haven't added any products to your cart yet.
            Start shopping to fill it up!
          </Text>
          <Button
            title="Continue Shopping"
            onPress={onContinueShopping}
            variant="primary"
            size="lg"
          />
        </Animated.View>
      ) : (
        <>
          {/* Cart Items */}
          <ScrollView
            style={{ flex: 1, paddingHorizontal: 20, paddingTop: 20 }}
            showsVerticalScrollIndicator={false}
          >
            {cartItems.map((item, index) => (
              <CartItemCard key={item.id} item={item} index={index} />
            ))}

            {/* Order Summary */}
            <Animated.View
              entering={FadeInUp.delay(600).duration(600)}
              style={{ marginTop: 16, marginBottom: 32 }}
            >
              <Card>
                <Text
                  style={{
                    fontSize: 18,
                    fontWeight: 'bold',
                    color: theme.text,
                    marginBottom: 16,
                  }}
                >
                  Order Summary
                </Text>

                <View style={{ marginBottom: 12 }}>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                    <Text style={{ fontSize: 14, color: theme.textSecondary }}>
                      Subtotal ({cartItems.length} items)
                    </Text>
                    <Text style={{ fontSize: 14, color: theme.text }}>
                      GHC ${subtotal.toFixed(2)}
                    </Text>
                  </View>

                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                    <Text style={{ fontSize: 14, color: theme.textSecondary }}>
                      Shipping
                    </Text>
                    <Text style={{ fontSize: 14, color: shipping === 0 ? theme.success : theme.text }}>
                      {shipping === 0 ? 'FREE' : `GHC ${shipping.toFixed(2)}`}
                    </Text>
                  </View>

                  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 }}>
                    <Text style={{ fontSize: 14, color: theme.textSecondary }}>
                      Tax
                    </Text>
                    <Text style={{ fontSize: 14, color: theme.text }}>
                      GHC ${tax.toFixed(2)}
                    </Text>
                  </View>

                  {shipping === 0 && (
                    <View
                      style={{
                        backgroundColor: theme.success + '20',
                        padding: 12,
                        borderRadius: 8,
                        marginTop: 12,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 14,
                          color: theme.success,
                          fontWeight: '600',
                          textAlign: 'center',
                        }}
                      >
                        🎉 You've qualified for FREE shipping!
                      </Text>
                    </View>
                  )}
                </View>

                <View
                  style={{
                    borderTopWidth: 1,
                    borderTopColor: theme.divider,
                    paddingTop: 12,
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Text
                    style={{
                      fontSize: 18,
                      fontWeight: 'bold',
                      color: theme.text,
                    }}
                  >
                    Total
                  </Text>
                  <Text
                    style={{
                      fontSize: 20,
                      fontWeight: 'bold',
                      color: theme.primary,
                    }}
                  >
                    GHC ${total.toFixed(2)}
                  </Text>
                </View>
              </Card>
            </Animated.View>
          </ScrollView>

          {/* Bottom Actions */}
          <Animated.View
            entering={BounceIn.delay(800).duration(600)}
            style={{
              backgroundColor: theme.surface,
              paddingHorizontal: 20,
              paddingVertical: 16,
              borderTopWidth: 1,
              borderTopColor: theme.divider,
            }}
          >
            <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
              <View style={{ flex: 1, marginRight: 12 }}>
                <Button
                  title="Continue Shopping"
                  onPress={onContinueShopping}
                  variant="outline"
                />
              </View>
              
              <Animated.View style={[{ flex: 1 }, checkoutAnimatedStyle]}>
                <Button
                  title={`Checkout • GHC ${total.toFixed(2)}`}
                  onPress={handleCheckout}
                  variant="primary"
                  disabled={cartItems.filter(item => item.inStock).length === 0}
                />
              </Animated.View>
            </View>

            {cartItems.some(item => !item.inStock) && (
              <View
                style={{
                  backgroundColor: theme.warning + '20',
                  padding: 12,
                  borderRadius: 8,
                }}
              >
                <Text
                  style={{
                    fontSize: 14,
                    color: theme.warning,
                    fontWeight: '600',
                    textAlign: 'center',
                  }}
                >
                  ⚠️ Some items are out of stock and won't be included in checkout
                </Text>
              </View>
            )}
          </Animated.View>
        </>
      )}
    </SafeAreaView>
  );
};
