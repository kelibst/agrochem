import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, { FadeInDown, FadeInUp } from 'react-native-reanimated';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { Input } from '../../components/Input';
import { useTheme } from '../../context/ThemeContext';
import { useAuth } from '../../context/AuthContext';

interface ShopOwnerProfileScreenProps {
  onBackPress: () => void;
  onThemeToggle: () => void;
  onLogout?: () => void;
}

export const ShopOwnerProfileScreen: React.FC<ShopOwnerProfileScreenProps> = ({
  onBackPress,
  onThemeToggle,
  onLogout,
}) => {
  const { theme, isDark } = useTheme();
  const { userProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  
  // Get user data from auth context
  const shopProfile = userProfile?.profile && 'businessName' in userProfile.profile ? userProfile.profile : null;
  const [profileData, setProfileData] = useState({
    name: userProfile?.profile?.name || 'Shop Owner',
    email: userProfile?.email || '',
    phone: userProfile?.profile?.phone || '',
    businessName: shopProfile?.businessName || '',
    address: userProfile?.profile?.address || '',
    businessRegistrationNumber: shopProfile?.businessRegistrationNumber || '',
    yearsInBusiness: shopProfile?.yearsInBusiness ? `${shopProfile.yearsInBusiness} years` : '',
  });

  const handleSave = () => {
    // Mock save - in real app, this would save to backend
    console.log('Saving profile:', profileData);
    Alert.alert('Profile Updated', 'Your business profile has been saved successfully.');
    setIsEditing(false);
  };

  const handleInputChange = (field: string, value: string) => {
    setProfileData(prev => ({ ...prev, [field]: value }));
  };

  const achievements = [
    { icon: '🏪', title: 'Established Business', description: 'Operating for multiple years' },
    { icon: '⭐', title: 'Top Rated', description: 'Excellent customer reviews' },
    { icon: '📦', title: 'Fast Delivery', description: 'Quick order processing' },
    { icon: '🤝', title: 'Trusted Partner', description: 'Reliable service provider' },
  ];

  const stats = [
    { label: 'Total Sales', value: '1,247', icon: '💰' },
    { label: 'Active Products', value: '89', icon: '📦' },
    { label: 'Total Customers', value: '156', icon: '👥' },
    { label: 'Member Since', value: userProfile?.createdAt ? new Date(userProfile.createdAt.toDate()).toLocaleDateString('en-US', { month: 'short', year: 'numeric' }) : 'Recently', icon: '📅' },
  ];

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }} edges={['top', 'left', 'right']}>
      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <Animated.View 
          entering={FadeInUp.delay(200).duration(800)}
          style={{
            paddingHorizontal: 24,
            paddingTop: 8,
            paddingBottom: 24,
            backgroundColor: theme.surface,
          }}
        >
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 20 }}>
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
                <Text style={{ fontSize: 24, fontWeight: 'bold', color: theme.text }}>Profile 🏪</Text>
                <Text style={{ color: theme.textSecondary }}>Business account settings</Text>
              </View>
            </View>
            <TouchableOpacity 
              onPress={() => setIsEditing(!isEditing)}
              style={{
                paddingHorizontal: 16,
                paddingVertical: 8,
                borderRadius: 8,
                backgroundColor: theme.primaryContainer,
              }}
            >
              <Text style={{ color: theme.onPrimaryContainer, fontWeight: '500' }}>
                {isEditing ? 'Cancel' : 'Edit'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Profile Avatar */}
          <View style={{ alignItems: 'center', marginBottom: 20 }}>
            <View style={{
              width: 80,
              height: 80,
              borderRadius: 40,
              backgroundColor: theme.primary,
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 12,
            }}>
              <Text style={{ fontSize: 32, color: theme.onPrimary }}>🏪</Text>
            </View>
            <Text style={{ fontSize: 20, fontWeight: 'bold', color: theme.text }}>
              {profileData.name}
            </Text>
            <Text style={{ fontSize: 16, color: theme.primary, marginTop: 4 }}>
              {profileData.businessName}
            </Text>
          </View>
        </Animated.View>

        {/* Business Information */}
        <Animated.View 
          entering={FadeInDown.delay(300).duration(800)}
          style={{ paddingHorizontal: 24, marginBottom: 24 }}
        >
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: theme.text, marginBottom: 16 }}>
            Business Information
          </Text>
          
          <Card>
            <View style={{ gap: 16 }}>
              {isEditing ? (
                <>
                  <Input
                    label="Owner Name"
                    value={profileData.name}
                    onChangeText={(text) => handleInputChange('name', text)}
                  />
                  <Input
                    label="Email"
                    value={profileData.email}
                    onChangeText={(text) => handleInputChange('email', text)}
                    keyboardType="email-address"
                  />
                  <Input
                    label="Phone"
                    value={profileData.phone}
                    onChangeText={(text) => handleInputChange('phone', text)}
                    keyboardType="phone-pad"
                  />
                  <Input
                    label="Business Name"
                    value={profileData.businessName}
                    onChangeText={(text) => handleInputChange('businessName', text)}
                  />
                  <Input
                    label="Business Address"
                    value={profileData.address}
                    onChangeText={(text) => handleInputChange('address', text)}
                  />
                  <Input
                    label="Registration Number"
                    value={profileData.businessRegistrationNumber}
                    onChangeText={(text) => handleInputChange('businessRegistrationNumber', text)}
                  />
                  <Input
                    label="Years in Business"
                    value={profileData.yearsInBusiness}
                    onChangeText={(text) => handleInputChange('yearsInBusiness', text)}
                  />
                  
                  <View style={{ flexDirection: 'row', gap: 12, marginTop: 8 }}>
                    <Button
                      title="Save Changes"
                      onPress={handleSave}
                      variant="primary"
                      size="lg"
                    />
                  </View>
                </>
              ) : (
                <>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ color: theme.textSecondary }}>Email</Text>
                    <Text style={{ fontWeight: '500', color: theme.text }}>{profileData.email}</Text>
                  </View>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ color: theme.textSecondary }}>Phone</Text>
                    <Text style={{ fontWeight: '500', color: theme.text }}>{profileData.phone}</Text>
                  </View>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ color: theme.textSecondary }}>Business Address</Text>
                    <Text style={{ fontWeight: '500', color: theme.text }}>{profileData.address}</Text>
                  </View>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ color: theme.textSecondary }}>Registration #</Text>
                    <Text style={{ fontWeight: '500', color: theme.text }}>{profileData.businessRegistrationNumber}</Text>
                  </View>
                  <View style={{ flexDirection: 'row', justifyContent: 'space-between' }}>
                    <Text style={{ color: theme.textSecondary }}>Years in Business</Text>
                    <Text style={{ fontWeight: '500', color: theme.text }}>{profileData.yearsInBusiness}</Text>
                  </View>
                </>
              )}
            </View>
          </Card>
        </Animated.View>

        {/* Statistics */}
        <Animated.View 
          entering={FadeInDown.delay(400).duration(800)}
          style={{ paddingHorizontal: 24, marginBottom: 24 }}
        >
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: theme.text, marginBottom: 16 }}>
            Business Statistics
          </Text>
          
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
            {stats.map((stat) => (
              <View key={stat.label} style={{ width: '48%' }}>
                <Card>
                  <View style={{ padding: 16, alignItems: 'center' }}>
                    <Text style={{ fontSize: 24, marginBottom: 8 }}>{stat.icon}</Text>
                    <Text style={{ fontSize: 12, color: theme.textSecondary, marginBottom: 4, textAlign: 'center' }}>
                      {stat.label}
                    </Text>
                    <Text style={{ fontSize: 18, fontWeight: 'bold', color: theme.text }}>
                      {stat.value}
                    </Text>
                  </View>
                </Card>
              </View>
            ))}
          </View>
        </Animated.View>

        {/* Achievements */}
        {/* <Animated.View 
          entering={FadeInDown.delay(500).duration(800)}
          style={{ paddingHorizontal: 24, marginBottom: 24 }}
        >
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: theme.text, marginBottom: 16 }}>
            Achievements
          </Text>
          
          <View style={{ flexDirection: 'row', flexWrap: 'wrap', gap: 12 }}>
            {achievements.map((achievement) => (
              <View key={achievement.title} style={{ width: '48%' }}>
                <Card>
                  <View style={{ padding: 16, alignItems: 'center' }}>
                    <Text style={{ fontSize: 32, marginBottom: 8 }}>{achievement.icon}</Text>
                    <Text style={{ fontSize: 14, fontWeight: '600', color: theme.text, marginBottom: 4, textAlign: 'center' }}>
                      {achievement.title}
                    </Text>
                    <Text style={{ fontSize: 12, color: theme.textSecondary, textAlign: 'center' }}>
                      {achievement.description}
                    </Text>
                  </View>
                </Card>
              </View>
            ))}
          </View>
        </Animated.View> */}

        {/* Settings */}
        <Animated.View 
          entering={FadeInDown.delay(600).duration(800)}
          style={{ paddingHorizontal: 24, marginBottom: 24 }}
        >
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: theme.text, marginBottom: 16 }}>
            Settings
          </Text>
          
          <Card>
            <View style={{ gap: 16 }}>
              {/* Theme Toggle */}
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <View>
                  <Text style={{ fontSize: 16, fontWeight: '500', color: theme.text }}>
                    Dark Mode
                  </Text>
                  <Text style={{ fontSize: 14, color: theme.textSecondary }}>
                    Switch between light and dark themes
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={onThemeToggle}
                  style={{
                    width: 50,
                    height: 28,
                    borderRadius: 14,
                    backgroundColor: isDark ? theme.primary : theme.surfaceVariant,
                    justifyContent: 'center',
                    paddingHorizontal: 2,
                  }}
                >
                  <View style={{
                    width: 24,
                    height: 24,
                    borderRadius: 12,
                    backgroundColor: theme.surface,
                    transform: [{ translateX: isDark ? 22 : 0 }],
                  }} />
                </TouchableOpacity>
              </View>

              {/* Business Settings */}
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <View>
                  <Text style={{ fontSize: 16, fontWeight: '500', color: theme.text }}>
                    🏪 Business Hours
                  </Text>
                  <Text style={{ fontSize: 14, color: theme.textSecondary }}>
                    Manage your operating hours
                  </Text>
                </View>
                <TouchableOpacity>
                  <Text style={{ color: theme.primary, fontWeight: '500' }}>Configure</Text>
                </TouchableOpacity>
              </View>

              {/* Notifications */}
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <View>
                  <Text style={{ fontSize: 16, fontWeight: '500', color: theme.text }}>
                    🔔 Notifications
                  </Text>
                  <Text style={{ fontSize: 14, color: theme.textSecondary }}>
                    Order alerts and updates
                  </Text>
                </View>
                <TouchableOpacity>
                  <Text style={{ color: theme.primary, fontWeight: '500' }}>Configure</Text>
                </TouchableOpacity>
              </View>

              {/* Support */}
              <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                <View>
                  <Text style={{ fontSize: 16, fontWeight: '500', color: theme.text }}>
                    🆘 Help & Support
                  </Text>
                  <Text style={{ fontSize: 14, color: theme.textSecondary }}>
                    Get help or contact us
                  </Text>
                </View>
                <TouchableOpacity>
                  <Text style={{ color: theme.primary, fontWeight: '500' }}>Contact</Text>
                </TouchableOpacity>
              </View>
            </View>
          </Card>
        </Animated.View>

        {/* Account Actions */}
        <Animated.View 
          entering={FadeInDown.delay(700).duration(800)}
          style={{ paddingHorizontal: 24, paddingBottom: 24 }}
        >
          <Text style={{ fontSize: 18, fontWeight: 'bold', color: theme.error, marginBottom: 16 }}>
            Account Actions
          </Text>
          
          <Card>
            <View style={{ gap: 12 }}>
              <Button
                title="🔄 Reset Password"
                onPress={() => Alert.alert('Reset Password', 'Password reset link will be sent to your email.')}
                variant="outline"
              />
              <Button
                title="📤 Export Business Data"
                onPress={() => Alert.alert('Export Data', 'Your business data will be prepared for download.')}
                variant="outline"
              />
              {onLogout && (
                <Button
                  title="🚪 Logout"
                  onPress={() => Alert.alert(
                    'Logout',
                    'Are you sure you want to logout?',
                    [
                      { text: 'Cancel', style: 'cancel' },
                      { text: 'Logout', onPress: onLogout }
                    ]
                  )}
                  variant="outline"
                />
              )}
              <Button
                title="❌ Delete Business Account"
                onPress={() => Alert.alert(
                  'Delete Account',
                  'Are you sure? This will permanently delete your business account and all data.',
                  [
                    { text: 'Cancel', style: 'cancel' },
                    { text: 'Delete', style: 'destructive' }
                  ]
                )}
                variant="outline"
              />
            </View>
          </Card>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  );
};