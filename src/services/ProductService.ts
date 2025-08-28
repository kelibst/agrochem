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

export const CATEGORIES = [
  'Fertilizers',
  'Pesticides', 
  'Seeds',
  'Tools'
];

class ProductService {
  async addProduct(productData: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    try {
      const docRef = await addDoc(collection(firebaseFirestore, 'products'), {
        ...productData,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now(),
      });
      return docRef.id;
    } catch (error) {
      console.error('Error adding product:', error);
      throw new Error('Failed to add product');
    }
  }

  async getAllProducts(): Promise<Product[]> {
    try {
      const q = query(
        collection(firebaseFirestore, 'products'), 
        where('isActive', '==', true)
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
    } catch (error) {
      console.error('Error getting products:', error);
      throw new Error('Failed to load products');
    }
  }

  async getShopProducts(shopId: string): Promise<Product[]> {
    try {
      const q = query(
        collection(firebaseFirestore, 'products'), 
        where('shopId', '==', shopId)
      );
      const snapshot = await getDocs(q);
      return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Product));
    } catch (error) {
      console.error('Error getting shop products:', error);
      throw new Error('Failed to load shop products');
    }
  }

  async updateProduct(productId: string, updates: Partial<Product>): Promise<void> {
    try {
      const productRef = doc(firebaseFirestore, 'products', productId);
      await updateDoc(productRef, {
        ...updates,
        updatedAt: Timestamp.now(),
      });
    } catch (error) {
      console.error('Error updating product:', error);
      throw new Error('Failed to update product');
    }
  }

  async deleteProduct(productId: string): Promise<void> {
    try {
      await deleteDoc(doc(firebaseFirestore, 'products', productId));
    } catch (error) {
      console.error('Error deleting product:', error);
      throw new Error('Failed to delete product');
    }
  }
}

export const productService = new ProductService();