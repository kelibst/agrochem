import React, { useEffect } from 'react';
import { View, Text, TouchableOpacity, Dimensions } from 'react-native';
import Animated, { 
  useAnimatedStyle, 
  useSharedValue, 
  withSpring, 
  withTiming,
  runOnJS 
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@/context/ThemeContext';
import { Notification, NotificationType } from '@/context/NotificationContext';

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const TOAST_WIDTH = SCREEN_WIDTH - 32; // 16px margin on each side

interface NotificationToastProps {
  notification: Notification;
  onHide: (id: string) => void;
}

export const NotificationToast: React.FC<NotificationToastProps> = ({
  notification,
  onHide
}) => {
  const { theme } = useTheme();
  const insets = useSafeAreaInsets();
  
  const translateX = useSharedValue(TOAST_WIDTH);
  const opacity = useSharedValue(0);

  useEffect(() => {
    // Show animation
    translateX.value = withSpring(0, { damping: 15 });
    opacity.value = withTiming(1, { duration: 300 });

    // Auto-hide timer is handled by the NotificationProvider
    return () => {
      // Hide animation when component unmounts
      translateX.value = withTiming(TOAST_WIDTH, { duration: 300 });
      opacity.value = withTiming(0, { duration: 300 });
    };
  }, []);

  const handleHide = () => {
    translateX.value = withTiming(TOAST_WIDTH, { duration: 300 }, () => {
      runOnJS(onHide)(notification.id);
    });
    opacity.value = withTiming(0, { duration: 300 });
  };

  const getNotificationStyles = (type: NotificationType) => {
    switch (type) {
      case 'success':
        return {
          backgroundColor: theme.successContainer,
          borderColor: theme.success,
          titleColor: theme.onSuccess,
          messageColor: theme.onSuccess,
          icon: '✅',
        };
      case 'error':
        return {
          backgroundColor: theme.errorContainer,
          borderColor: theme.error,
          titleColor: theme.onError,
          messageColor: theme.onError,
          icon: '❌',
        };
      case 'warning':
        return {
          backgroundColor: theme.warningContainer,
          borderColor: theme.warning,
          titleColor: theme.onWarning,
          messageColor: theme.onWarning,
          icon: '⚠️',
        };
      case 'info':
        return {
          backgroundColor: theme.infoContainer,
          borderColor: theme.info,
          titleColor: theme.onInfo,
          messageColor: theme.onInfo,
          icon: 'ℹ️',
        };
      default:
        return {
          backgroundColor: theme.surface,
          borderColor: theme.border,
          titleColor: theme.text,
          messageColor: theme.textSecondary,
          icon: '📢',
        };
    }
  };

  const styles = getNotificationStyles(notification.type);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: translateX.value }],
      opacity: opacity.value,
    };
  });

  return (
    <Animated.View
      style={[
        animatedStyle,
        {
          position: 'absolute',
          top: insets.top + 16,
          right: 16,
          left: 16,
          backgroundColor: styles.backgroundColor,
          borderRadius: 12,
          borderWidth: 1,
          borderColor: styles.borderColor,
          padding: 16,
          shadowColor: theme.text,
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 8,
          zIndex: 9999,
        },
      ]}
    >
      <TouchableOpacity onPress={handleHide} activeOpacity={0.8}>
        <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
          {/* Icon */}
          <Text style={{ fontSize: 20, marginRight: 12, marginTop: 2 }}>
            {styles.icon}
          </Text>

          {/* Content */}
          <View style={{ flex: 1, marginRight: 8 }}>
            <Text 
              style={{ 
                fontSize: 16, 
                fontWeight: '600', 
                color: styles.titleColor,
                marginBottom: notification.message ? 4 : 0
              }}
            >
              {notification.title}
            </Text>
            
            {notification.message && (
              <Text 
                style={{ 
                  fontSize: 14, 
                  color: styles.messageColor,
                  lineHeight: 20
                }}
              >
                {notification.message}
              </Text>
            )}

            {/* Action Button */}
            {notification.action && (
              <TouchableOpacity
                onPress={() => {
                  notification.action?.onPress();
                  handleHide();
                }}
                style={{
                  marginTop: 12,
                  alignSelf: 'flex-start',
                }}
              >
                <Text 
                  style={{ 
                    fontSize: 14, 
                    fontWeight: '600',
                    color: styles.borderColor,
                    textDecorationLine: 'underline'
                  }}
                >
                  {notification.action.label}
                </Text>
              </TouchableOpacity>
            )}
          </View>

          {/* Close button */}
          <TouchableOpacity onPress={handleHide} style={{ padding: 4 }}>
            <Text style={{ fontSize: 18, color: styles.titleColor, opacity: 0.7 }}>
              ×
            </Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Animated.View>
  );
};