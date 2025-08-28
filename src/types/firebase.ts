import { Timestamp } from 'firebase/firestore';

// Create type aliases for Firebase types
export type FirestoreTimestamp = Timestamp;
export type FirestoreGeoPoint = {
  latitude: number;
  longitude: number;
};

// User related types
export type UserRole = 'farmer' | 'shop_owner' | 'admin';

export interface BaseUserProfile {
  name: string;
  phone?: string;
  profilePicture?: string;
  location?: FirestoreGeoPoint;
  address?: string;
}

export interface FarmerProfile extends BaseUserProfile {
  farmName?: string;
  farmSize?: number; // in acres
  cropsGrown?: string[];
  experienceYears?: number;
}

export interface ShopOwnerProfile extends BaseUserProfile {
  businessName: string;
  businessRegistrationNumber?: string;
  yearsInBusiness?: number;
  specializations?: string[]; // types of products they specialize in
}

export type UserProfile = FarmerProfile | ShopOwnerProfile;

export interface User {
  uid: string;
  email: string;
  role: UserRole;
  profile: UserProfile;
  createdAt: FirestoreTimestamp;
  updatedAt: FirestoreTimestamp;
}

// Shop related types
export interface ShopContact {
  phone: string;
  email?: string;
}

export interface BusinessHours {
  [day: string]: {
    open: string;
    close: string;
    isOpen: boolean;
  };
}

export interface Shop {
  id: string;
  ownerId: string; // reference to users collection
  name: string;
  description: string;
  location: FirestoreGeoPoint;
  address: string;
  contact: ShopContact;
  isVerified: boolean;
  rating: number;
  totalReviews: number;
  businessHours: BusinessHours;
  createdAt: FirestoreTimestamp;
  updatedAt: FirestoreTimestamp;
}

// Product related types
export interface Product {
  id: string;
  shopId: string; // reference to shops collection
  name: string;
  description: string;
  category: string;
  subcategory?: string;
  price: number;
  unit: string; // 'kg', 'liter', 'piece', etc.
  stockQuantity: number;
  images: string[];
  isActive: boolean;
  createdAt: FirestoreTimestamp;
  updatedAt: FirestoreTimestamp;
}

// Order related types
export type OrderStatus = 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled';

export interface OrderItem {
  productId: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Order {
  id: string;
  farmerId: string; // reference to users collection
  shopId: string; // reference to shops collection
  items: OrderItem[];
  status: OrderStatus;
  totalAmount: number;
  deliveryAddress: string;
  orderDate: FirestoreTimestamp;
  estimatedDelivery?: FirestoreTimestamp;
  actualDelivery?: FirestoreTimestamp;
  notes?: string;
}

// Category related types
export interface Category {
  id: string;
  name: string;
  description: string;
  icon?: string;
  subcategories: string[];
}

// Review related types
export interface Review {
  id: string;
  userId: string; // reference to users collection
  targetId: string; // product or shop id
  targetType: 'product' | 'shop';
  rating: number; // 1-5 stars
  comment?: string;
  images?: string[];
  createdAt: FirestoreTimestamp;
}

// Message related types
export interface Message {
  id: string;
  conversationId: string;
  senderId: string; // reference to users collection
  receiverId: string; // reference to users collection
  content: string;
  type: 'text' | 'image' | 'order_update';
  metadata?: {
    orderId?: string;
    productId?: string;
    imageUrl?: string;
  };
  isRead: boolean;
  createdAt: FirestoreTimestamp;
}

export interface Conversation {
  id: string;
  participantIds: string[]; // array of user ids
  lastMessage: string;
  lastMessageTimestamp: FirestoreTimestamp;
  unreadCount: { [userId: string]: number };
  createdAt: FirestoreTimestamp;
}

// Notification types
export type NotificationType = 
  | 'order_placed' 
  | 'order_confirmed' 
  | 'order_ready' 
  | 'order_delivered'
  | 'new_message'
  | 'shop_verified'
  | 'product_low_stock'
  | 'system_announcement';

export interface Notification {
  id: string;
  userId: string; // reference to users collection
  title: string;
  body: string;
  type: NotificationType;
  metadata?: {
    orderId?: string;
    productId?: string;
    shopId?: string;
    messageId?: string;
  };
  isRead: boolean;
  createdAt: FirestoreTimestamp;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Form data types for creating/updating documents
export interface CreateUserProfileData {
  email: string;
  role: UserRole;
  profile: UserProfile;
}

export interface CreateFarmerProfileData {
  email: string;
  role: 'farmer';
  profile: FarmerProfile;
}

export interface CreateShopOwnerProfileData {
  email: string;
  role: 'shop_owner';  
  profile: ShopOwnerProfile;
}

export interface CreateShopData {
  name: string;
  description: string;
  address: string;
  location: FirestoreGeoPoint;
  contact: ShopContact;
  businessHours: BusinessHours;
}

export interface CreateProductData {
  shopId: string;
  name: string;
  description: string;
  category: string;
  subcategory?: string;
  price: number;
  unit: string;
  stockQuantity: number;
  images: string[];
}

export interface CreateOrderData {
  farmerId: string;
  shopId: string;
  items: Omit<OrderItem, 'totalPrice'>[];
  deliveryAddress: string;
  notes?: string;
}