import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { Button } from '../../components/Button';
import { Card } from '../../components/Card';
import { useTheme } from '../../context/ThemeContext';

interface RoleSelectionScreenProps {
  onRoleSelect: (role: 'farmer' | 'shop_owner') => void;
  onBack: () => void;
}

export const RoleSelectionScreen: React.FC<RoleSelectionScreenProps> = ({
  onRoleSelect,
  onBack,
}) => {
  const { theme } = useTheme();
  const [selectedRole, setSelectedRole] = React.useState<'farmer' | 'shop_owner' | null>(null);

  const handleContinue = () => {
    if (selectedRole) {
      onRoleSelect(selectedRole);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
      <ScrollView style={{ flex: 1 }} contentContainerStyle={{ flexGrow: 1 }}>
        <View style={{ flex: 1, paddingHorizontal: 24, backgroundColor: theme.background }}>
          {/* Header */}
          <Animated.View 
            entering={FadeInUp.delay(200).duration(800)}
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'space-between',
              paddingVertical: 16,
            }}
          >
            <Text style={{
              fontSize: 18,
              fontWeight: '600',
              color: theme.primary,
              textAlign: 'center',
            }}>
              Choose Your Role
            </Text>
          </Animated.View>

          {/* Title */}
          <Animated.View 
            entering={FadeInUp.delay(300).duration(800)}
            style={{
              alignItems: 'center',
              marginBottom: 48,
              marginTop: 32,
            }}
          >
            <Text style={{
              fontSize: 24,
              fontWeight: 'bold',
              color: theme.primaryDark,
              textAlign: 'center',
              marginBottom: 16,
            }}>
              How will you use AgroConnect?
            </Text>
            <Text style={{
              fontSize: 16,
              color: theme.textSecondary,
              textAlign: 'center',
              lineHeight: 24,
            }}>
              Select your role to customize your experience
            </Text>
          </Animated.View>

          {/* Role Options */}
          <Animated.View 
            entering={FadeInDown.delay(400).duration(800)}
            style={{
              flex: 1,
              gap: 16,
            }}
          >
            <RoleCard
              title="I'm a Farmer"
              description="Browse and purchase agrochemicals, find nearby suppliers, and manage your orders"
              icon="👨‍🌾"
              features={[
                "Browse products and suppliers",
                "Place and track orders",
                "Find nearby shops",
                "Get farming recommendations"
              ]}
              isSelected={selectedRole === 'farmer'}
              onSelect={() => setSelectedRole('farmer')}
            />

            <RoleCard
              title="I'm a Shop Owner"
              description="Manage your inventory, receive orders from farmers, and grow your business"
              icon="🏪"
              features={[
                "Manage product inventory",
                "Receive and process orders",
                "Connect with local farmers",
                "Track sales and analytics"
              ]}
              isSelected={selectedRole === 'shop_owner'}
              onSelect={() => setSelectedRole('shop_owner')}
            />
          </Animated.View>

          {/* Continue Button */}
          <Animated.View 
            entering={FadeInDown.delay(600).duration(800)}
            style={{ marginTop: 32 }}
          >
            <Button
              title="Continue"
              onPress={handleContinue}
              size="lg"
              disabled={!selectedRole}
            />
          </Animated.View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

interface RoleCardProps {
  title: string;
  description: string;
  icon: string;
  features: string[];
  isSelected: boolean;
  onSelect: () => void;
}

const RoleCard: React.FC<RoleCardProps> = ({
  title,
  description,
  icon,
  features,
  isSelected,
  onSelect,
}) => {
  const { theme } = useTheme();
  
  return (
    <TouchableOpacity onPress={onSelect} style={{ marginBottom: 16 }}>
      <View 
        style={{
          padding: 24,
          borderWidth: isSelected ? 2 : 1,
          borderColor: isSelected ? theme.primary : theme.border,
          backgroundColor: isSelected ? theme.primaryContainer : theme.card,
          borderRadius: 12,
          shadowColor: theme.text,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.1,
          shadowRadius: 4,
          elevation: 3,
        }}
      >
        <View style={{ flexDirection: 'row', alignItems: 'flex-start', marginBottom: 16 }}>
          <View style={{
            width: 64,
            height: 64,
            borderRadius: 16,
            alignItems: 'center',
            justifyContent: 'center',
            marginRight: 16,
            backgroundColor: isSelected ? theme.primaryContainer : theme.surfaceVariant,
          }}>
            <Text style={{ fontSize: 24 }}>{icon}</Text>
          </View>
          
          <View style={{ flex: 1 }}>
            <Text style={{
              fontSize: 18,
              fontWeight: 'bold',
              marginBottom: 8,
              color: isSelected ? theme.onPrimaryContainer : theme.text,
            }}>
              {title}
            </Text>
            <Text style={{
              fontSize: 14,
              lineHeight: 20,
              color: isSelected ? theme.onPrimaryContainer : theme.textSecondary,
            }}>
              {description}
            </Text>
          </View>
          
          <View style={{
            width: 24,
            height: 24,
            borderRadius: 12,
            borderWidth: 2,
            alignItems: 'center',
            justifyContent: 'center',
            borderColor: isSelected ? theme.primary : theme.border,
            backgroundColor: isSelected ? theme.primary : theme.card,
          }}>
            {isSelected && <Text style={{ color: theme.onPrimary, fontSize: 12 }}>✓</Text>}
          </View>
        </View>

        <View style={{ gap: 8 }}>
          {features.map((feature, index) => (
            <View key={index} style={{ flexDirection: 'row', alignItems: 'center' }}>
              <Text style={{
                marginRight: 8,
                color: isSelected ? theme.primary : theme.textTertiary,
              }}>
                ✓
              </Text>
              <Text style={{
                fontSize: 14,
                color: isSelected ? theme.onPrimaryContainer : theme.textSecondary,
              }}>
                {feature}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </TouchableOpacity>
  );
};