import { 
  collection, 
  getDocs, 
  query, 
  where,
  orderBy,
  Timestamp 
} from 'firebase/firestore';
import { firebaseFirestore } from '../config/firebase';

export interface Shop {
  id: string;
  businessName: string;
  ownerName: string;
  ownerId: string;
  description: string;
  location: string;
  phone: string;
  email: string;
  rating: number;
  productsCount: number;
  isOpen: boolean;
  distance?: string;
  deliveryFee: number;
  minOrder: number;
  createdAt: Timestamp;
  updatedAt: Timestamp;
}

class ShopService {
  async getAllShops(): Promise<Shop[]> {
    try {
      const q = query(
        collection(firebaseFirestore, 'users'), 
        where('role', '==', 'shop_owner')
      );
      const snapshot = await getDocs(q);
      
      const shops: Shop[] = [];
      for (const doc of snapshot.docs) {
        const userData = doc.data();
        const profile = userData.profile;
        
        if (profile && 'businessName' in profile) {
          // Calculate products count for this shop
          const productsQuery = query(
            collection(firebaseFirestore, 'products'),
            where('shopId', '==', doc.id),
            where('isActive', '==', true)
          );
          const productsSnapshot = await getDocs(productsQuery);
          
          shops.push({
            id: doc.id,
            businessName: profile.businessName || 'Unknown Shop',
            ownerName: profile.name || 'Unknown Owner',
            ownerId: doc.id,
            description: profile.description || 'Agricultural products and supplies',
            location: profile.location || 'Location not specified',
            phone: profile.phone || 'No phone provided',
            email: userData.email || 'No email provided',
            rating: 4.5, // Default rating - will be calculated from reviews later
            productsCount: productsSnapshot.size,
            isOpen: true, // Default to open - will be dynamic later
            distance: `${(Math.random() * 10 + 1).toFixed(1)} km`, // Random distance for now
            deliveryFee: Math.floor(Math.random() * 20) + 5, // Random delivery fee 5-25
            minOrder: Math.floor(Math.random() * 100) + 50, // Random min order 50-150
            createdAt: userData.createdAt || Timestamp.now(),
            updatedAt: userData.updatedAt || Timestamp.now(),
          });
        }
      }
      
      // Sort shops by creation date, newest first (client-side sorting)
      const sortedShops = shops.sort((a, b) => {
        const aSeconds = a.createdAt?.seconds || 0;
        const bSeconds = b.createdAt?.seconds || 0;
        return bSeconds - aSeconds;
      });
      
      return sortedShops;
    } catch (error) {
      console.error('Error getting shops:', error);
      throw new Error('Failed to load shops');
    }
  }
}

export const shopService = new ShopService();