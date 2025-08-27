import React, { useEffect, useState } from 'react';
import { View, Text, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  FadeIn,
  FadeInUp,
  FadeInDown,
  SlideInUp,
  SlideInDown,
  SlideInLeft,
  SlideInRight,
  BounceIn,
  ZoomIn,
  useSharedValue,
  useAnimatedStyle,
  withTiming,
  withSpring,
  withSequence,
  withDelay,
  withRepeat,
  interpolate,
  Easing,
  runOnJS,
} from 'react-native-reanimated';
import { Logo } from '@/components/Logo';
import { Button } from '@/components/Button';
import { useTheme } from '@/context/ThemeContext';

const { width, height } = Dimensions.get('window');

interface EntryScreenProps {
  onGetStarted: () => void;
}

export const EntryScreen: React.FC<EntryScreenProps> = ({ onGetStarted }) => {
  const { theme } = useTheme();
  const [showContent, setShowContent] = useState(false);
  
  // Animation values
  const logoScale = useSharedValue(0);
  const logoRotation = useSharedValue(0);
  const particleOpacity = useSharedValue(0);
  const backgroundGradient = useSharedValue(0);
  const pulseScale = useSharedValue(1);

  useEffect(() => {
    // Sequence of animations
    const startAnimations = () => {
      // Background gradient animation
      backgroundGradient.value = withTiming(1, { duration: 1500, easing: Easing.ease });
      
      // Logo entrance with spring and rotation
      logoScale.value = withDelay(
        500,
        withSpring(1, {
          damping: 8,
          stiffness: 100,
          mass: 1,
        })
      );
      
      logoRotation.value = withDelay(
        500,
        withSequence(
          withTiming(360, { duration: 1000, easing: Easing.ease }),
          withTiming(0, { duration: 0 })
        )
      );

      // Particle effect
      particleOpacity.value = withDelay(
        1000,
        withTiming(1, { duration: 800 })
      );

      // Pulsing effect for logo
      pulseScale.value = withDelay(
        1500,
        withRepeat(
          withSequence(
            withTiming(1.1, { duration: 1000 }),
            withTiming(1, { duration: 1000 })
          ),
          -1,
          true
        )
      );

      // Show content after logo animation
      setTimeout(() => {
        setShowContent(true);
      }, 1200);
    };

    startAnimations();
  }, []);

  const backgroundStyle = useAnimatedStyle(() => {
    const opacity = interpolate(backgroundGradient.value, [0, 1], [0, 0.1]);
    return {
      opacity,
    };
  });

  const logoAnimatedStyle = useAnimatedStyle(() => {
    const scale = logoScale.value * pulseScale.value;
    const rotateZ = `${logoRotation.value}deg`;
    
    return {
      transform: [
        { scale },
        { rotateZ },
      ] as any,
    };
  });

  const particleStyle = useAnimatedStyle(() => {
    return {
      opacity: particleOpacity.value,
    };
  });

  const Particle = ({ delay, x, y }: { delay: number; x: number; y: number }) => (
    <Animated.View
      entering={FadeIn.delay(delay).duration(1000)}
      style={[
        particleStyle,
        {
          position: 'absolute',
          left: x,
          top: y,
          width: 4,
          height: 4,
          borderRadius: 2,
          backgroundColor: theme.primary,
        },
      ]}
    />
  );

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      {/* Animated Background */}
      <Animated.View
        style={[
          {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: theme.primary,
          },
          backgroundStyle,
        ]}
      />

      {/* Floating Particles */}
      <Particle delay={1200} x={width * 0.1} y={height * 0.2} />
      <Particle delay={1400} x={width * 0.85} y={height * 0.15} />
      <Particle delay={1600} x={width * 0.2} y={height * 0.8} />
      <Particle delay={1800} x={width * 0.9} y={height * 0.7} />
      <Particle delay={2000} x={width * 0.15} y={height * 0.6} />
      <Particle delay={2200} x={width * 0.8} y={height * 0.9} />

      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', paddingHorizontal: 32 }}>
        {/* Logo Section */}
        <Animated.View
          style={[
            logoAnimatedStyle as any,
            {
              alignItems: 'center',
              marginBottom: 60,
            },
          ]}
        >
          <Logo width={160} height={160} />
        </Animated.View>

        {/* Content Section */}
        {showContent && (
          <>
            {/* App Name */}
            <Animated.View
              entering={SlideInUp.delay(200).duration(800)}
              style={{ alignItems: 'center', marginBottom: 24 }}
            >
              <Text
                style={{
                  fontSize: 36,
                  fontWeight: 'bold',
                  color: theme.text,
                  textAlign: 'center',
                  marginBottom: 8,
                }}
              >
                AgroConnect
              </Text>
              <View
                style={{
                  height: 4,
                  width: 60,
                  backgroundColor: theme.primary,
                  borderRadius: 2,
                }}
              />
            </Animated.View>

            {/* Description */}
            <Animated.View
              entering={SlideInUp.delay(400).duration(800)}
              style={{ alignItems: 'center', marginBottom: 48 }}
            >
              <Text
                style={{
                  fontSize: 18,
                  color: theme.textSecondary,
                  textAlign: 'center',
                  lineHeight: 26,
                  marginBottom: 16,
                }}
              >
                Your Gateway to Agricultural Excellence
              </Text>
            </Animated.View>

            {/* Features */}
            <Animated.View
              entering={FadeInUp.delay(600).duration(800)}
              style={{ alignItems: 'center', marginBottom: 48 }}
            >
              <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center' }}>
                {[
                  { icon: '🌱', text: 'Quality Products' },
                  { icon: '🚚', text: 'Fast Delivery' },
                  { icon: '💰', text: 'Best Prices' },
                  { icon: '🤝', text: 'Trusted Network' },
                ].map((feature, index) => (
                  <Animated.View
                    key={feature.text}
                    entering={SlideInLeft.delay(800 + index * 100).duration(600)}
                    style={{
                      flexDirection: 'row',
                      alignItems: 'center',
                      backgroundColor: theme.surfaceVariant,
                      paddingHorizontal: 16,
                      paddingVertical: 8,
                      borderRadius: 20,
                      margin: 6,
                    }}
                  >
                    <Text style={{ fontSize: 16, marginRight: 8 }}>{feature.icon}</Text>
                    <Text
                      style={{
                        fontSize: 14,
                        fontWeight: '600',
                        color: theme.text,
                      }}
                    >
                      {feature.text}
                    </Text>
                  </Animated.View>
                ))}
              </View>
            </Animated.View>

            {/* Get Started Button */}
            <Animated.View
              entering={BounceIn.delay(1200).duration(800)}
              style={{ width: '100%', alignItems: 'center' }}
            >
              <View style={{ width: '80%', marginBottom: 16 }}>
                <Button
                  title="Get Started"
                  onPress={onGetStarted}
                  variant="primary"
                  size="lg"
                />
              </View>
              <Text
                style={{
                  fontSize: 12,
                  color: theme.textTertiary,
                  textAlign: 'center',
                }}
              >
                Join thousands of farmers and suppliers
              </Text>
            </Animated.View>
          </>
        )}
      </View>

      {/* Bottom Decoration - Changed from absolute to avoid covering content */}
      {showContent && (
        <Animated.View
          entering={SlideInDown.delay(1000).duration(800)}
          style={{
            height: 60,
            backgroundColor: theme.primary,
            opacity: 0.05,
            borderTopLeftRadius: 50,
            borderTopRightRadius: 50,
            marginTop: 20,
          }}
        />
      )}
    </SafeAreaView>
  );
};
