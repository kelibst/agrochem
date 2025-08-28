import React, { useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  FadeInUp,
  FadeInDown,
  SlideInRight,
  SlideInLeft,
  BounceIn,
  Layout,
} from 'react-native-reanimated';
import { Card } from '../../components/Card';
import { Button } from '../../components/Button';
import { useTheme } from '../../context/ThemeContext';

interface Message {
  id: string;
  text: string;
  timestamp: Date;
  isFromMe: boolean;
  status: 'sent' | 'delivered' | 'read';
}

interface Conversation {
  id: string;
  name: string;
  avatar: string;
  lastMessage: string;
  lastMessageTime: Date;
  unreadCount: number;
  isOnline: boolean;
  type: 'farmer' | 'shop';
}

interface MessagesScreenProps {
  onBack: () => void;
  userType: 'farmer' | 'shop_owner';
  conversationId?: string;
}

export const MessagesScreen: React.FC<MessagesScreenProps> = ({
  onBack,
  userType,
  conversationId,
}) => {
  const { theme } = useTheme();
  const [selectedConversation, setSelectedConversation] = useState<string | null>(conversationId || null);
  const [newMessage, setNewMessage] = useState('');

  // Mock conversations data
  const [conversations] = useState<Conversation[]>([
    {
      id: '1',
      name: 'Green Valley Supplies',
      avatar: '🏪',
      lastMessage: 'Your order has been confirmed and will be delivered tomorrow.',
      lastMessageTime: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
      unreadCount: 2,
      isOnline: true,
      type: 'shop',
    },
    {
      id: '2',
      name: 'John Farmer',
      avatar: '👨‍🌾',
      lastMessage: 'Do you have NPK fertilizer in stock?',
      lastMessageTime: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      unreadCount: 0,
      isOnline: false,
      type: 'farmer',
    },
    {
      id: '3',
      name: 'EcoFarm Solutions',
      avatar: '🌱',
      lastMessage: 'Thank you for your purchase! Let us know if you need anything.',
      lastMessageTime: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      unreadCount: 0,
      isOnline: true,
      type: 'shop',
    },
    {
      id: '4',
      name: 'Maria Rodriguez',
      avatar: '👩‍🌾',
      lastMessage: 'What are your delivery charges to my location?',
      lastMessageTime: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
      unreadCount: 1,
      isOnline: false,
      type: 'farmer',
    },
  ]);

  // Mock messages for selected conversation
  const [messages] = useState<Record<string, Message[]>>({
    '1': [
      {
        id: '1',
        text: 'Hello! I would like to inquire about your fertilizer prices.',
        timestamp: new Date(Date.now() - 60 * 60 * 1000),
        isFromMe: true,
        status: 'read',
      },
      {
        id: '2',
        text: 'Hello! Thank you for your interest. Our NPK 20-20-20 is currently $45.99 per 25kg bag.',
        timestamp: new Date(Date.now() - 55 * 60 * 1000),
        isFromMe: false,
        status: 'read',
      },
      {
        id: '3',
        text: 'That sounds good. Can I place an order for 10 bags?',
        timestamp: new Date(Date.now() - 50 * 60 * 1000),
        isFromMe: true,
        status: 'read',
      },
      {
        id: '4',
        text: 'Absolutely! I\'ll prepare your order. Total would be $459.90. Do you need delivery?',
        timestamp: new Date(Date.now() - 45 * 60 * 1000),
        isFromMe: false,
        status: 'read',
      },
      {
        id: '5',
        text: 'Yes, please deliver to my farm. Here\'s my address: 123 Farm Road, Agricultural District.',
        timestamp: new Date(Date.now() - 40 * 60 * 1000),
        isFromMe: true,
        status: 'read',
      },
      {
        id: '6',
        text: 'Perfect! Delivery fee is GHc12.99. Your order has been confirmed and will be delivered tomorrow.',
        timestamp: new Date(Date.now() - 5 * 60 * 1000),
        isFromMe: false,
        status: 'delivered',
      },
    ],
  });

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'Just now';
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    
    return date.toLocaleDateString();
  };

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedConversation) return;
    
    // In a real app, this would send the message to the backend
    console.log('Sending message:', newMessage);
    setNewMessage('');
  };

  const ConversationItem = ({ conversation, index }: { conversation: Conversation; index: number }) => (
    <Animated.View
      key={conversation.id}
      entering={SlideInRight.delay(index * 100).duration(600)}
      layout={Layout.springify()}
      style={{ marginBottom: 12 }}
    >
      <Card onPress={() => setSelectedConversation(conversation.id)}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          {/* Avatar */}
          <View style={{ position: 'relative', marginRight: 16 }}>
            <View
              style={{
                width: 50,
                height: 50,
                backgroundColor: theme.primaryContainer,
                borderRadius: 25,
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={{ fontSize: 24 }}>{conversation.avatar}</Text>
            </View>
            {conversation.isOnline && (
              <View
                style={{
                  position: 'absolute',
                  bottom: 2,
                  right: 2,
                  width: 12,
                  height: 12,
                  backgroundColor: theme.success,
                  borderRadius: 6,
                  borderWidth: 2,
                  borderColor: theme.surface,
                }}
              />
            )}
          </View>

          {/* Conversation Info */}
          <View style={{ flex: 1 }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
              <Text
                style={{
                  fontSize: 16,
                  fontWeight: 'bold',
                  color: theme.text,
                  flex: 1,
                }}
                numberOfLines={1}
              >
                {conversation.name}
              </Text>
              <Text
                style={{
                  fontSize: 12,
                  color: theme.textSecondary,
                  marginLeft: 8,
                }}
              >
                {formatTime(conversation.lastMessageTime)}
              </Text>
            </View>

            <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
              <Text
                style={{
                  fontSize: 14,
                  color: conversation.unreadCount > 0 ? theme.text : theme.textSecondary,
                  fontWeight: conversation.unreadCount > 0 ? '600' : 'normal',
                  flex: 1,
                }}
                numberOfLines={1}
              >
                {conversation.lastMessage}
              </Text>
              
              {conversation.unreadCount > 0 && (
                <View
                  style={{
                    backgroundColor: theme.primary,
                    borderRadius: 10,
                    minWidth: 20,
                    height: 20,
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginLeft: 8,
                  }}
                >
                  <Text
                    style={{
                      fontSize: 12,
                      color: theme.onPrimary,
                      fontWeight: 'bold',
                    }}
                  >
                    {conversation.unreadCount}
                  </Text>
                </View>
              )}
            </View>
          </View>
        </View>
      </Card>
    </Animated.View>
  );

  const MessageBubble = ({ message, index }: { message: Message; index: number }) => (
    <Animated.View
      key={message.id}
      entering={message.isFromMe ? SlideInRight.delay(index * 50).duration(400) : SlideInLeft.delay(index * 50).duration(400)}
      style={{
        alignItems: message.isFromMe ? 'flex-end' : 'flex-start',
        marginBottom: 12,
      }}
    >
      <View
        style={{
          backgroundColor: message.isFromMe ? theme.primary : theme.surfaceVariant,
          borderRadius: 16,
          paddingHorizontal: 16,
          paddingVertical: 12,
          maxWidth: '80%',
          borderBottomRightRadius: message.isFromMe ? 4 : 16,
          borderBottomLeftRadius: message.isFromMe ? 16 : 4,
        }}
      >
        <Text
          style={{
            fontSize: 14,
            color: message.isFromMe ? theme.onPrimary : theme.text,
            lineHeight: 20,
          }}
        >
          {message.text}
        </Text>
      </View>
      
      <View style={{ flexDirection: 'row', alignItems: 'center', marginTop: 4, paddingHorizontal: 8 }}>
        <Text
          style={{
            fontSize: 12,
            color: theme.textTertiary,
            marginRight: 4,
          }}
        >
          {formatTime(message.timestamp)}
        </Text>
        {message.isFromMe && (
          <Text style={{ fontSize: 12, color: theme.textTertiary }}>
            {message.status === 'sent' ? '✓' : message.status === 'delivered' ? '✓✓' : '✓✓'}
          </Text>
        )}
      </View>
    </Animated.View>
  );

  if (selectedConversation) {
    const conversation = conversations.find(c => c.id === selectedConversation);
    const conversationMessages = messages[selectedConversation] || [];

    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: theme.background }}>
        {/* Chat Header */}
        <Animated.View
          entering={FadeInUp.delay(200).duration(600)}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 20,
            paddingVertical: 16,
            backgroundColor: theme.surface,
            borderBottomWidth: 1,
            borderBottomColor: theme.divider,
          }}
        >
          <TouchableOpacity onPress={() => setSelectedConversation(null)} style={{ padding: 8, marginLeft: -8, marginRight: 8 }}>
            <Text style={{ fontSize: 24, color: theme.text }}>←</Text>
          </TouchableOpacity>
          
          <View
            style={{
              width: 40,
              height: 40,
              backgroundColor: theme.primaryContainer,
              borderRadius: 20,
              alignItems: 'center',
              justifyContent: 'center',
              marginRight: 12,
            }}
          >
            <Text style={{ fontSize: 20 }}>{conversation?.avatar}</Text>
          </View>

          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 16, fontWeight: 'bold', color: theme.text }}>
              {conversation?.name}
            </Text>
            <Text style={{ fontSize: 12, color: theme.textSecondary }}>
              {conversation?.isOnline ? 'Online now' : 'Last seen recently'}
            </Text>
          </View>

          <TouchableOpacity style={{ padding: 8 }}>
            <Text style={{ fontSize: 20, color: theme.text }}>📞</Text>
          </TouchableOpacity>
        </Animated.View>

        {/* Messages */}
        <ScrollView
          style={{ flex: 1, paddingHorizontal: 20, paddingVertical: 16 }}
          showsVerticalScrollIndicator={false}
        >
          {conversationMessages.map((message, index) => (
            <MessageBubble key={message.id} message={message} index={index} />
          ))}
        </ScrollView>

        {/* Message Input */}
        <Animated.View
          entering={BounceIn.delay(400).duration(600)}
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 20,
            paddingVertical: 16,
            backgroundColor: theme.surface,
            borderTopWidth: 1,
            borderTopColor: theme.divider,
          }}
        >
          <View
            style={{
              flex: 1,
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: theme.surfaceVariant,
              borderRadius: 24,
              paddingHorizontal: 16,
              marginRight: 12,
            }}
          >
            <TextInput
              style={{
                flex: 1,
                fontSize: 16,
                color: theme.text,
                paddingVertical: 12,
                maxHeight: 100,
              }}
              placeholder="Type a message..."
              placeholderTextColor={theme.textSecondary}
              value={newMessage}
              onChangeText={setNewMessage}
              multiline
            />
            <TouchableOpacity style={{ padding: 8 }}>
              <Text style={{ fontSize: 20 }}>📎</Text>
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            onPress={sendMessage}
            disabled={!newMessage.trim()}
            style={{
              backgroundColor: newMessage.trim() ? theme.primary : theme.surfaceVariant,
              width: 48,
              height: 48,
              borderRadius: 24,
              alignItems: 'center',
              justifyContent: 'center',
            }}
          >
            <Text style={{ fontSize: 20, color: newMessage.trim() ? theme.onPrimary : theme.textSecondary }}>
              ➤
            </Text>
          </TouchableOpacity>
        </Animated.View>
      </SafeAreaView>
    );
  }

  // Conversations List
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
          Messages
        </Text>
        <TouchableOpacity style={{ padding: 8, marginRight: -8 }}>
          <Text style={{ fontSize: 20, color: theme.text }}>✏️</Text>
        </TouchableOpacity>
      </Animated.View>

      {/* Filter Tabs */}
      <Animated.View
        entering={SlideInRight.delay(300).duration(600)}
        style={{ paddingHorizontal: 20, paddingVertical: 16 }}
      >
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {[
            { id: 'all', label: 'All', count: conversations.length },
            { id: 'unread', label: 'Unread', count: conversations.filter(c => c.unreadCount > 0).length },
            { id: 'shops', label: 'Shops', count: conversations.filter(c => c.type === 'shop').length },
            { id: 'farmers', label: 'Farmers', count: conversations.filter(c => c.type === 'farmer').length },
          ].map((filter, index) => (
            <TouchableOpacity
              key={filter.id}
              style={{
                backgroundColor: index === 0 ? theme.primary : theme.surfaceVariant,
                paddingHorizontal: 16,
                paddingVertical: 10,
                borderRadius: 20,
                marginRight: 12,
                flexDirection: 'row',
                alignItems: 'center',
              }}
            >
              <Text
                style={{
                  fontSize: 14,
                  fontWeight: '600',
                  color: index === 0 ? theme.onPrimary : theme.text,
                  marginRight: filter.count > 0 ? 6 : 0,
                }}
              >
                {filter.label}
              </Text>
              {filter.count > 0 && (
                <View
                  style={{
                    backgroundColor: index === 0 ? theme.onPrimary + '30' : theme.primaryContainer,
                    borderRadius: 10,
                    minWidth: 20,
                    height: 20,
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Text
                    style={{
                      fontSize: 12,
                      color: index === 0 ? theme.onPrimary : theme.onPrimaryContainer,
                      fontWeight: 'bold',
                    }}
                  >
                    {filter.count}
                  </Text>
                </View>
              )}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </Animated.View>

      {/* Conversations List */}
      {conversations.length === 0 ? (
        <Animated.View
          entering={FadeInDown.delay(400).duration(800)}
          style={{
            flex: 1,
            alignItems: 'center',
            justifyContent: 'center',
            paddingHorizontal: 32,
          }}
        >
          <Text style={{ fontSize: 80, marginBottom: 24 }}>💬</Text>
          <Text
            style={{
              fontSize: 24,
              fontWeight: 'bold',
              color: theme.text,
              textAlign: 'center',
              marginBottom: 12,
            }}
          >
            No messages yet
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
            Start a conversation with {userType === 'farmer' ? 'shop owners' : 'farmers'} to discuss products, orders, and more.
          </Text>
          <Button
            title={`Find ${userType === 'farmer' ? 'Shops' : 'Customers'}`}
            onPress={() => console.log('Navigate to find shops/customers')}
            variant="primary"
          />
        </Animated.View>
      ) : (
        <ScrollView
          style={{ flex: 1, paddingHorizontal: 20 }}
          showsVerticalScrollIndicator={false}
        >
          {conversations.map((conversation, index) => (
            <ConversationItem key={conversation.id} conversation={conversation} index={index} />
          ))}
          <View style={{ height: 20 }} />
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

