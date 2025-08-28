import { productService, Product, CATEGORIES } from '../services/ProductService';
import { Timestamp } from 'firebase/firestore';

// Sample products data organized by category
const sampleProducts = {
  'Fertilizers': [
    {
      shopId: 'sample-shop-1',
      shopName: 'Green Valley Supplies',
      name: 'NPK 15-15-15 Fertilizer',
      description: 'High-quality balanced fertilizer perfect for all crops. Contains equal parts nitrogen, phosphorus, and potassium for optimal plant growth.',
      price: 25.99,
      stock: 150,
      unit: 'kg',
      isActive: true,
    },
    {
      shopId: 'sample-shop-2', 
      shopName: 'Farm Tech Solutions',
      name: 'Organic Compost Fertilizer',
      description: 'Natural organic compost made from farm waste. Rich in nutrients and perfect for sustainable farming practices.',
      price: 18.50,
      stock: 200,
      unit: 'kg',
      isActive: true,
    },
    {
      shopId: 'sample-shop-1',
      shopName: 'Green Valley Supplies',
      name: 'Urea Nitrogen Fertilizer',
      description: 'High nitrogen content fertilizer (46-0-0) ideal for promoting leaf growth and overall plant vigor.',
      price: 22.75,
      stock: 100,
      unit: 'kg',
      isActive: true,
    },
    {
      shopId: 'sample-shop-3',
      shopName: 'AgriCare Center',
      name: 'Phosphate Rock Fertilizer',
      description: 'Natural phosphate fertilizer that slowly releases phosphorus for long-term plant nutrition.',
      price: 28.00,
      stock: 75,
      unit: 'kg',
      isActive: true,
    }
  ],
  'Pesticides': [
    {
      shopId: 'sample-shop-2',
      shopName: 'Farm Tech Solutions',
      name: 'Neem Oil Insecticide',
      description: 'Natural organic pesticide extracted from neem seeds. Effective against aphids, whiteflies, and other soft-bodied insects.',
      price: 15.99,
      stock: 120,
      unit: 'liter',
      isActive: true,
    },
    {
      shopId: 'sample-shop-1',
      shopName: 'Green Valley Supplies',
      name: 'Copper Fungicide Spray',
      description: 'Broad-spectrum fungicide for controlling various plant diseases. Safe for organic farming when used as directed.',
      price: 19.50,
      stock: 80,
      unit: 'liter',
      isActive: true,
    },
    {
      shopId: 'sample-shop-3',
      shopName: 'AgriCare Center',
      name: 'Pyrethrin Insect Spray',
      description: 'Fast-acting natural insecticide derived from chrysanthemum flowers. Effective against flying and crawling insects.',
      price: 24.75,
      stock: 60,
      unit: 'liter',
      isActive: true,
    },
    {
      shopId: 'sample-shop-2',
      shopName: 'Farm Tech Solutions',
      name: 'Bacillus thuringiensis (Bt)',
      description: 'Biological pesticide effective against caterpillars and other lepidoptera larvae. Safe for beneficial insects.',
      price: 32.00,
      stock: 45,
      unit: 'kg',
      isActive: true,
    }
  ],
  'Seeds': [
    {
      shopId: 'sample-shop-1',
      shopName: 'Green Valley Supplies',
      name: 'Hybrid Tomato Seeds',
      description: 'High-yield hybrid tomato variety with excellent disease resistance. Perfect for greenhouse or field cultivation.',
      price: 8.99,
      stock: 300,
      unit: 'packet',
      isActive: true,
    },
    {
      shopId: 'sample-shop-3',
      shopName: 'AgriCare Center',
      name: 'Sweet Corn Seeds',
      description: 'Premium sweet corn variety with excellent flavor and texture. High germination rate and uniform growth.',
      price: 6.50,
      stock: 250,
      unit: 'packet',
      isActive: true,
    },
    {
      shopId: 'sample-shop-2',
      shopName: 'Farm Tech Solutions',
      name: 'Cucumber Seeds - F1 Hybrid',
      description: 'Disease-resistant cucumber variety with excellent yield potential. Suitable for both fresh market and processing.',
      price: 12.25,
      stock: 180,
      unit: 'packet',
      isActive: true,
    },
    {
      shopId: 'sample-shop-1',
      shopName: 'Green Valley Supplies',
      name: 'Lettuce Seeds Mix',
      description: 'Assorted lettuce varieties including romaine, butterhead, and leaf lettuce. Perfect for continuous harvesting.',
      price: 4.75,
      stock: 400,
      unit: 'packet',
      isActive: true,
    }
  ],
  'Tools': [
    {
      shopId: 'sample-shop-3',
      shopName: 'AgriCare Center',
      name: 'Garden Hoe - Steel Blade',
      description: 'Heavy-duty steel blade hoe with comfortable wooden handle. Perfect for weeding and soil cultivation.',
      price: 35.99,
      stock: 50,
      unit: 'piece',
      isActive: true,
    },
    {
      shopId: 'sample-shop-2',
      shopName: 'Farm Tech Solutions',
      name: 'Pruning Shears - Professional',
      description: 'Sharp, durable pruning shears with ergonomic grip. Ideal for trimming branches and harvesting crops.',
      price: 28.50,
      stock: 75,
      unit: 'piece',
      isActive: true,
    },
    {
      shopId: 'sample-shop-1',
      shopName: 'Green Valley Supplies',
      name: 'Sprayer Pump - 5 Liter',
      description: 'Manual pressure sprayer with adjustable nozzle. Perfect for applying pesticides and fertilizers.',
      price: 45.00,
      stock: 30,
      unit: 'piece',
      isActive: true,
    },
    {
      shopId: 'sample-shop-3',
      shopName: 'AgriCare Center',
      name: 'Soil pH Meter',
      description: 'Digital soil pH and moisture meter. Essential tool for monitoring soil conditions and crop health.',
      price: 22.99,
      stock: 40,
      unit: 'piece',
      isActive: true,
    }
  ]
};

export class DatabaseSeeder {
  private static seededProducts: string[] = [];

  static async seedProducts(): Promise<{ success: boolean; message: string; count: number }> {
    try {
      console.log('🌱 Starting database seeding...');
      
      let totalAdded = 0;
      const errors: string[] = [];

      for (const category of CATEGORIES) {
        const products = sampleProducts[category as keyof typeof sampleProducts];
        if (!products) continue;

        console.log(`📦 Adding ${products.length} ${category} products...`);

        for (const productData of products) {
          try {
            const productId = await productService.addProduct({
              ...productData,
              category,
            });
            
            DatabaseSeeder.seededProducts.push(productId);
            totalAdded++;
            
            console.log(`✅ Added: ${productData.name} (ID: ${productId})`);
          } catch (error: any) {
            const errorMsg = `Failed to add ${productData.name}: ${error.message}`;
            errors.push(errorMsg);
            console.error(`❌ ${errorMsg}`);
          }
        }
      }

      if (errors.length > 0) {
        console.warn(`⚠️ Completed with ${errors.length} errors:`);
        errors.forEach(error => console.warn(`  - ${error}`));
      }

      const message = `Successfully added ${totalAdded} products to the database${errors.length > 0 ? ` (${errors.length} errors)` : ''}`;
      console.log(`🎉 ${message}`);
      
      return {
        success: totalAdded > 0,
        message,
        count: totalAdded
      };

    } catch (error: any) {
      const errorMsg = `Database seeding failed: ${error.message}`;
      console.error(`💥 ${errorMsg}`);
      return {
        success: false,
        message: errorMsg,
        count: 0
      };
    }
  }

  static async clearSeededProducts(): Promise<{ success: boolean; message: string; count: number }> {
    try {
      console.log('🧹 Clearing seeded products...');
      
      let deletedCount = 0;
      const errors: string[] = [];

      for (const productId of DatabaseSeeder.seededProducts) {
        try {
          await productService.deleteProduct(productId);
          deletedCount++;
          console.log(`🗑️ Deleted product: ${productId}`);
        } catch (error: any) {
          errors.push(`Failed to delete ${productId}: ${error.message}`);
        }
      }

      // Clear the tracking array
      DatabaseSeeder.seededProducts = [];

      const message = `Deleted ${deletedCount} seeded products${errors.length > 0 ? ` (${errors.length} errors)` : ''}`;
      console.log(`✨ ${message}`);

      return {
        success: true,
        message,
        count: deletedCount
      };

    } catch (error: any) {
      const errorMsg = `Failed to clear seeded products: ${error.message}`;
      console.error(`💥 ${errorMsg}`);
      return {
        success: false,
        message: errorMsg,
        count: 0
      };
    }
  }

  static getSeededProductIds(): string[] {
    return [...DatabaseSeeder.seededProducts];
  }

  static getProductCounts(): Record<string, number> {
    const counts: Record<string, number> = {};
    
    for (const category of CATEGORIES) {
      const products = sampleProducts[category as keyof typeof sampleProducts];
      counts[category] = products ? products.length : 0;
    }
    
    return counts;
  }
}

// Export for easy use in dev environment
export const seedDatabase = DatabaseSeeder.seedProducts;
export const clearSeededProducts = DatabaseSeeder.clearSeededProducts;