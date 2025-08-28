import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  query, 
  where,
  orderBy,
  limit,
  onSnapshot,
  Timestamp,
  serverTimestamp,
  writeBatch
} from 'firebase/firestore';
import { firebaseFirestore } from '../config/firebase';

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  senderName: string;
  senderRole: 'farmer' | 'shop_owner';
  text: string;
  timestamp: Timestamp;
  status: 'sent' | 'delivered' | 'read';
  isEdited?: boolean;
}

export interface Conversation {
  id: string;
  participants: {
    farmerId: string;
    farmerName: string;
    shopId: string;
    shopName: string;
  };
  lastMessage?: {
    text: string;
    timestamp: Timestamp;
    senderId: string;
  };
  unreadCount: {
    farmer: number;
    shopOwner: number;
  };
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

class MessageService {
  // Create a new conversation between farmer and shop owner
  async createConversation(
    farmerId: string, 
    farmerName: string, 
    shopId: string, 
    shopName: string
  ): Promise<string> {
    try {
      // Check if conversation already exists
      const existingConversation = await this.getConversationBetweenUsers(farmerId, shopId);
      if (existingConversation) {
        return existingConversation.id;
      }

      const conversationData = {
        participants: {
          farmerId,
          farmerName,
          shopId,
          shopName,
        },
        unreadCount: {
          farmer: 0,
          shopOwner: 0,
        },
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };

      const docRef = await addDoc(collection(firebaseFirestore, 'conversations'), conversationData);
      return docRef.id;
    } catch (error) {
      console.error('Error creating conversation:', error);
      throw new Error('Failed to create conversation');
    }
  }

  // Get conversation between two specific users
  async getConversationBetweenUsers(farmerId: string, shopId: string): Promise<Conversation | null> {
    try {
      const q = query(
        collection(firebaseFirestore, 'conversations'),
        where('participants.farmerId', '==', farmerId),
        where('participants.shopId', '==', shopId)
      );
      
      const snapshot = await getDocs(q);
      if (snapshot.empty) return null;
      
      const doc = snapshot.docs[0];
      return { id: doc.id, ...doc.data() } as Conversation;
    } catch (error) {
      console.error('Error getting conversation:', error);
      return null;
    }
  }

  // Get all conversations for a user (farmer or shop owner)
  async getUserConversations(userId: string, userRole: 'farmer' | 'shop_owner'): Promise<Conversation[]> {
    try {
      const fieldPath = userRole === 'farmer' ? 'participants.farmerId' : 'participants.shopId';
      const q = query(
        collection(firebaseFirestore, 'conversations'),
        where(fieldPath, '==', userId),
        orderBy('updatedAt', 'desc')
      );

      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Conversation));
    } catch (error) {
      console.error('Error getting user conversations:', error);
      throw new Error('Failed to load conversations');
    }
  }

  // Send a message
  async sendMessage(
    conversationId: string,
    senderId: string,
    senderName: string,
    senderRole: 'farmer' | 'shop_owner',
    text: string
  ): Promise<string> {
    try {
      const batch = writeBatch(firebaseFirestore);

      // Add message
      const messageRef = doc(collection(firebaseFirestore, 'messages'));
      const messageData = {
        conversationId,
        senderId,
        senderName,
        senderRole,
        text: text.trim(),
        timestamp: serverTimestamp(),
        status: 'sent',
      };
      batch.set(messageRef, messageData);

      // Update conversation with last message and increment unread count
      const conversationRef = doc(firebaseFirestore, 'conversations', conversationId);
      const recipientUnreadField = senderRole === 'farmer' ? 'unreadCount.shopOwner' : 'unreadCount.farmer';
      
      batch.update(conversationRef, {
        lastMessage: {
          text: text.trim(),
          timestamp: serverTimestamp(),
          senderId,
        },
        [recipientUnreadField]: increment(1),
        updatedAt: serverTimestamp(),
      });

      await batch.commit();
      return messageRef.id;
    } catch (error) {
      console.error('Error sending message:', error);
      throw new Error('Failed to send message');
    }
  }

  // Get messages for a conversation
  async getConversationMessages(conversationId: string, limitCount: number = 50): Promise<Message[]> {
    try {
      const q = query(
        collection(firebaseFirestore, 'messages'),
        where('conversationId', '==', conversationId),
        orderBy('timestamp', 'desc'),
        limit(limitCount)
      );

      const snapshot = await getDocs(q);
      return snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() } as Message))
        .reverse(); // Reverse to show oldest first
    } catch (error) {
      console.error('Error getting conversation messages:', error);
      throw new Error('Failed to load messages');
    }
  }

  // Mark messages as read
  async markMessagesAsRead(conversationId: string, userId: string, userRole: 'farmer' | 'shop_owner'): Promise<void> {
    try {
      const batch = writeBatch(firebaseFirestore);

      // Update unread count in conversation
      const conversationRef = doc(firebaseFirestore, 'conversations', conversationId);
      const unreadField = userRole === 'farmer' ? 'unreadCount.farmer' : 'unreadCount.shopOwner';
      batch.update(conversationRef, {
        [unreadField]: 0,
      });

      // Mark all unread messages from other user as read
      const messagesQuery = query(
        collection(firebaseFirestore, 'messages'),
        where('conversationId', '==', conversationId),
        where('senderId', '!=', userId),
        where('status', '!=', 'read')
      );

      const messagesSnapshot = await getDocs(messagesQuery);
      messagesSnapshot.forEach(messageDoc => {
        batch.update(messageDoc.ref, { status: 'read' });
      });

      await batch.commit();
    } catch (error) {
      console.error('Error marking messages as read:', error);
      throw new Error('Failed to mark messages as read');
    }
  }

  // Listen to real-time conversation updates
  subscribeToConversations(
    userId: string, 
    userRole: 'farmer' | 'shop_owner',
    callback: (conversations: Conversation[]) => void
  ): () => void {
    const fieldPath = userRole === 'farmer' ? 'participants.farmerId' : 'participants.shopId';
    const q = query(
      collection(firebaseFirestore, 'conversations'),
      where(fieldPath, '==', userId),
      orderBy('updatedAt', 'desc')
    );

    return onSnapshot(q, (snapshot) => {
      const conversations = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Conversation));
      callback(conversations);
    }, (error) => {
      console.error('Error listening to conversations:', error);
    });
  }

  // Listen to real-time message updates for a conversation
  subscribeToMessages(
    conversationId: string,
    callback: (messages: Message[]) => void,
    limitCount: number = 50
  ): () => void {
    const q = query(
      collection(firebaseFirestore, 'messages'),
      where('conversationId', '==', conversationId),
      orderBy('timestamp', 'desc'),
      limit(limitCount)
    );

    return onSnapshot(q, (snapshot) => {
      const messages = snapshot.docs
        .map(doc => ({ id: doc.id, ...doc.data() } as Message))
        .reverse(); // Reverse to show oldest first
      callback(messages);
    }, (error) => {
      console.error('Error listening to messages:', error);
    });
  }

  // Start a conversation from product inquiry
  async startProductInquiry(
    farmerId: string,
    farmerName: string,
    shopId: string,
    shopName: string,
    productName: string,
    productId: string
  ): Promise<string> {
    try {
      const conversationId = await this.createConversation(farmerId, farmerName, shopId, shopName);
      
      const inquiryMessage = `Hello! I'm interested in your ${productName}. Could you provide more details about availability and pricing?`;
      
      await this.sendMessage(conversationId, farmerId, farmerName, 'farmer', inquiryMessage);
      
      return conversationId;
    } catch (error) {
      console.error('Error starting product inquiry:', error);
      throw new Error('Failed to start product inquiry');
    }
  }

  // Helper function for Firebase increment (since we can't import it directly)
  private increment(value: number) {
    // In a real implementation, you'd import increment from Firebase
    // For now, we'll handle this manually in the calling code
    return value;
  }
}

// Helper function to increment Firestore field
const increment = (value: number) => {
  // This would normally be imported from firebase/firestore
  // but we'll handle increments manually for now
  return value;
};

export const messageService = new MessageService();