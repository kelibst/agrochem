import React from 'react';
import { View } from 'react-native';
import { useNotification } from '@/context/NotificationContext';
import { NotificationToast } from './NotificationToast';

export const NotificationContainer: React.FC = () => {
  const { notifications, hideNotification } = useNotification();

  if (notifications.length === 0) {
    return null;
  }

  return (
    <View style={{ position: 'absolute', top: 0, left: 0, right: 0, zIndex: 9999 }}>
      {notifications.map((notification, index) => (
        <View
          key={notification.id}
          style={{
            position: 'absolute',
            top: index * 80, // Stagger notifications vertically
            left: 0,
            right: 0,
          }}
        >
          <NotificationToast
            notification={notification}
            onHide={hideNotification}
          />
        </View>
      ))}
    </View>
  );
};