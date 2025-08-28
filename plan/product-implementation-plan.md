# Simple Product CRUD Implementation Plan

## Overview
Basic product management system for AgroConnect student project - just core CRUD operations for products with simple Firebase integration.

## Current Status
- ✅ **UI Screens**: AddProductScreen, ProductBrowseScreen, ProductDetailsScreen exist with mock data
- ✅ **Authentication**: Firebase Auth working with farmers and shop owners
- ✅ **Theme System**: UI components ready
- ❌ **Backend**: No Firebase integration yet

## Step 1: Simple Product Database

### Firestore Collection: `products`
```typescript
interface Product {
  id: string;              // Auto-generated
  shopId: string;          // Who owns this product
  shopName: string;        // Shop name for display
  
  // Basic Info
  name: string;
  description: string;
  category: string;        // Simple dropdown selection
  price: number;
  stock: number;
  unit: string;           // kg, liter, piece, etc.
  
  // Simple metadata
  isActive: boolean;      // true/false
  createdAt: Timestamp;
  updatedAt: Timestamp;
}
```

### Simple Categories (Hardcoded for now)
```javascript
const CATEGORIES = [
  'Fertilizers',
  'Pesticides', 
  'Seeds',
  'Tools'
];
```

### Basic Firestore Security Rules
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Products - shop owners can CRUD their own, everyone can read active products
    match /products/{productId} {
      allow read: if resource.data.isActive == true;
      allow read, write: if request.auth != null && 
                           request.auth.uid == resource.data.shopId;
    }
  }
}
```

## Step 2: Create Simple Product Service

### ProductService (`src/services/ProductService.ts`)
```typescript
import { 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where,
  Timestamp 
} from 'firebase/firestore';
import { firebaseFirestore } from '../config/firebase';

export interface Product {
  id: string;
  shopId: string;
  shopName: string;
  name: string;
  description: string;
  category: string;
  price: number;
  stock: number;
  unit: string;
  isActive: boolean;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

class ProductService {
  // Create new product
  async addProduct(productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const docRef = await addDoc(collection(firebaseFirestore, 'products'), {
      ...productData,
      createdAt: Timestamp.now(),
      updatedAt: Timestamp.now(),
    });
    return docRef.id;
  }

  // Get all active products (for farmers)
  async getAllProducts(): Promise<Product[]> {
    const q = query(
      collection(firebaseFirestore, 'products'), 
      where('isActive', '==', true)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
  }

  // Get shop's products (for shop owners)
  async getShopProducts(shopId: string): Promise<Product[]> {
    const q = query(
      collection(firebaseFirestore, 'products'), 
      where('shopId', '==', shopId)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
  }

  // Update product
  async updateProduct(productId: string, updates: Partial<Product>): Promise<void> {
    const productRef = doc(firebaseFirestore, 'products', productId);
    await updateDoc(productRef, {
      ...updates,
      updatedAt: Timestamp.now(),
    });
  }

  // Delete product
  async deleteProduct(productId: string): Promise<void> {
    await deleteDoc(doc(firebaseFirestore, 'products', productId));
  }
}

export const productService = new ProductService();
```

## Step 3: Update Existing Screens

### 3.1 Fix AddProductScreen to use Firebase
**Changes needed:**
- Import `productService` 
- Get current user info from auth context
- Replace mock save with real Firebase save
- Add loading states and error handling

### 3.2 Fix ProductBrowseScreen to use Firebase  
**Changes needed:**
- Replace mock products array with `productService.getAllProducts()`
- Add loading spinner
- Add error handling
- Keep the simple search (just filter by product name)

### 3.3 Fix InventoryScreen to use Firebase
**Changes needed:**
- Replace mock data with `productService.getShopProducts(currentUser.uid)`
- Add loading and error states
- Make edit/delete buttons actually work

## Step 4: Simple Dashboard Updates

### For Shop Owners:
- Show total products count
- Show active/inactive products count  
- Recent products added
- Simple sales stats (just product view counts)

### For Farmers:
- Show recently viewed products
- Show available product categories
- Simple product recommendations (just newest products)

## Implementation Checklist

### Week 1: Basic Firebase Integration
- [ ] Create ProductService with basic CRUD
- [ ] Update AddProductScreen to save to Firebase
- [ ] Update ProductBrowseScreen to load from Firebase  
- [ ] Add loading states and error handling

### Week 2: Complete Basic Features
- [ ] Update InventoryScreen with real data
- [ ] Add edit/delete functionality
- [ ] Update dashboards with real product counts
- [ ] Test with multiple users

### Week 3: Polish and Bug Fixes
- [ ] Fix any UI issues
- [ ] Add input validation
- [ ] Test edge cases
- [ ] Prepare for demo

## Success Criteria (Simple Version)
- ✅ Shop owners can add/edit/delete products
- ✅ Farmers can view all active products  
- ✅ Data persists in Firebase
- ✅ Basic error handling works
- ✅ App doesn't crash

That's it! No complex search, no image uploads, no analytics - just basic CRUD operations that work.