# Backend Implementation Plan: Firebase

This document outlines the comprehensive step-by-step plan for integrating the Firebase backend into the AgroConnect application.

---

## **Phase 1: Project Setup & Configuration**

### **1.1 Firebase Project Creation**
1. Create new Firebase project in [Firebase Console](https://console.firebase.google.com/)
2. Register Android app with package name: `com.kelibst.agrochem`
3. Register iOS app with bundle ID (to be determined)
4. Download configuration files:
   - `google-services.json` → `android/app/`
   - `GoogleService-Info.plist` → `ios/agrochem/`

### **1.2 Install Firebase Dependencies**
```bash
npm install @react-native-firebase/app @react-native-firebase/auth @react-native-firebase/firestore @react-native-firebase/storage @react-native-firebase/functions @react-native-firebase/messaging
```

### **1.3 Native Configuration**
- **Android**: Configure `android/build.gradle` and `android/app/build.gradle`
- **iOS**: Update `ios/Podfile` and run `pod install`
- **Metro**: Update `metro.config.js` if needed for Firebase compatibility

### **1.4 Firebase Initialization**
- Create `src/config/firebase.ts` for Firebase configuration
- Initialize Firebase in `src/app/_layout.tsx`
- Add error handling and connection status monitoring

---

## **Phase 2: Authentication System**

### **2.1 Firebase Auth Setup**
- Enable Email/Password authentication in Firebase Console
- Configure auth domain and authorized domains
- Set up password requirements and user management settings

### **2.2 Auth Context Implementation**
Create `src/context/AuthContext.tsx` with:
- User state management (`User | null`)
- Authentication methods: `login`, `register`, `logout`, `resetPassword`
- Auth state listener with `onAuthStateChanged`
- Loading and error state handling
- Integration with existing theme system

### **2.3 Auth Screens Integration**
Update existing screens:
- `src/screens/auth/LoginScreen.tsx` - Firebase email/password login
- `src/screens/auth/RegisterScreen.tsx` - User registration with role selection
- `src/screens/auth/RoleSelectionScreen.tsx` - Role-based registration flow
- Add password reset functionality

### **2.4 Navigation Guards**
- Implement auth-based routing in Expo Router
- Create protected route wrapper components
- Handle auth state changes for navigation

---

## **Phase 3: Firestore Database Structure**

### **3.1 Database Design**
```typescript
// Collection structures
users: {
  uid: string,
  email: string,
  role: 'farmer' | 'shop_owner' | 'admin',
  profile: {
    name: string,
    phone?: string,
    profilePicture?: string,
    location?: GeoPoint,
    address?: string
  },
  createdAt: Timestamp,
  updatedAt: Timestamp
}

shops: {
  id: string,
  ownerId: string, // reference to users collection
  name: string,
  description: string,
  location: GeoPoint,
  address: string,
  contact: {
    phone: string,
    email?: string
  },
  isVerified: boolean,
  rating: number,
  totalReviews: number,
  businessHours: object,
  createdAt: Timestamp
}

products: {
  id: string,
  shopId: string, // reference to shops collection
  name: string,
  description: string,
  category: string,
  subcategory?: string,
  price: number,
  unit: string,
  stockQuantity: number,
  images: string[],
  isActive: boolean,
  createdAt: Timestamp
}

orders: {
  id: string,
  farmerId: string, // reference to users collection
  shopId: string, // reference to shops collection
  items: OrderItem[],
  status: 'pending' | 'confirmed' | 'preparing' | 'ready' | 'delivered' | 'cancelled',
  totalAmount: number,
  deliveryAddress: string,
  orderDate: Timestamp,
  estimatedDelivery?: Timestamp
}

categories: {
  id: string,
  name: string,
  description: string,
  icon?: string,
  subcategories: string[]
}
```

### **3.2 Security Rules**
Implement Firestore security rules:
```javascript
// Basic auth requirements
// User profile access restrictions
// Shop owner permissions for their shops/products
// Admin privileges
// Read permissions for public data
```

### **3.3 Firestore Service Layer**
Create `src/services/firestore.ts` with:
- **User operations**: `createUserProfile`, `getUserProfile`, `updateProfile`
- **Shop operations**: `createShop`, `updateShop`, `getShops`, `getNearbyShops`
- **Product operations**: `addProduct`, `updateProduct`, `getProducts`, `searchProducts`
- **Order operations**: `createOrder`, `updateOrderStatus`, `getOrders`
- **Real-time listeners** for live data updates

---

## **Phase 4: User Management System**

### **4.1 User Profile Management**
- Create user profile creation flow
- Implement profile editing screens
- Add profile picture upload with Firebase Storage
- Location services integration for user address

### **4.2 Role-Based Features**
- **Farmer Dashboard**: Order history, favorites, nearby shops
- **Shop Owner Dashboard**: Inventory management, order processing, analytics
- **Admin Panel**: User moderation, shop verification, system monitoring

### **4.3 User Onboarding**
- Welcome screens for new users
- Role-specific tutorial flows
- Initial setup completion tracking

---

## **Phase 5: Shop Management System**

### **5.1 Shop Registration**
- Shop creation form with validation
- Location picker with Google Maps integration
- Business hours configuration
- Contact information management

### **5.2 Shop Verification**
- Verification request system
- Admin approval workflow
- Verification badge display

### **5.3 Shop Discovery**
- Location-based shop finder
- Shop search and filtering
- Distance calculation and sorting
- Shop rating and review system

---

## **Phase 6: Product Management**

### **6.1 Product Creation**
- Product form with image upload
- Category and subcategory management
- Inventory tracking system
- Price management tools

### **6.2 Product Discovery**
- Product search with filters
- Category browsing
- Product recommendations
- Wishlist/favorites system

### **6.3 Inventory Management**
- Stock level tracking
- Low stock notifications
- Bulk operations for shop owners
- Product analytics

---

## **Phase 7: Order System**

### **7.1 Shopping Cart**
- Cart state management
- Item quantity controls
- Price calculations
- Cart persistence

### **7.2 Order Processing**
- Order placement flow
- Order confirmation
- Real-time status updates
- Order tracking for farmers

### **7.3 Order Management for Shops**
- Incoming order notifications
- Order status management
- Order history and analytics
- Customer communication

---

## **Phase 8: Notifications & Communication**

### **8.1 Push Notifications**
- Firebase Cloud Messaging setup
- Order status notifications
- New product alerts
- System announcements

### **8.2 In-App Messaging**
- Chat system between farmers and shops
- Order-related communications
- Message history and persistence

---

## **Implementation Priority**

### **Week 1-2: Foundation**
- [ ] Firebase project setup and configuration
- [ ] Install and configure Firebase SDKs
- [ ] Basic authentication implementation
- [ ] Auth context and navigation guards

### **Week 3-4: Core Authentication**
- [ ] Complete auth screens integration
- [ ] User registration with role selection
- [ ] Profile creation and management
- [ ] Password reset functionality

### **Week 5-6: Database Foundation**
- [ ] Firestore setup and security rules
- [ ] Basic data models and services
- [ ] User profile system
- [ ] Shop registration system

### **Week 7-8: Product System**
- [ ] Product management for shop owners
- [ ] Product discovery for farmers
- [ ] Image upload with Firebase Storage
- [ ] Search and filtering

### **Week 9-10: Order System**
- [ ] Shopping cart implementation
- [ ] Order placement and processing
- [ ] Real-time order tracking
- [ ] Push notifications

---

## **Configuration Files Needed**

1. `src/config/firebase.ts` - Firebase initialization and configuration
2. `src/types/firebase.ts` - TypeScript interfaces for Firestore documents
3. `src/services/firestore.ts` - Firestore operations and queries
4. `src/services/auth.ts` - Authentication helper functions
5. `src/services/storage.ts` - Firebase Storage operations
6. `src/utils/notifications.ts` - Push notification handling

---

## **Testing Strategy**

- Unit tests for service functions
- Integration tests for auth flows
- End-to-end tests for critical user journeys
- Firebase emulator for local development
- Test data setup and teardown procedures

---

## **Security Considerations**

- Implement proper Firestore security rules
- Validate all user inputs on client and server
- Secure file upload with size and type restrictions
- Rate limiting for API calls
- User data privacy and GDPR compliance
- Secure handling of sensitive information

---

## **Performance Optimization**

- Implement proper pagination for large datasets
- Use Firestore compound queries efficiently
- Optimize image loading and caching
- Implement lazy loading for screens
- Monitor and optimize bundle size
- Use Firebase Performance Monitoring
