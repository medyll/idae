/**
 * Storage Adapters Demo
 * 
 * Demonstrates the usage of different storage adapters for Qoolie multi-mode architecture
 */

import { MemoryStorageAdapter } from '../MemoryStorageAdapter.js';
import { ApiStorageAdapter } from '../ApiStorageAdapter.js';

// Define a simple data type
interface User {
  id: string;
  name: string;
  email: string;
  age: number;
  active: boolean;
}

// Mock API client for demonstration
const mockApiClient = {
  get: async (collection: string, id: string) => {
    console.log(`[API] GET ${collection}/${id}`);
    return { id, name: 'API User', email: 'api@example.com', age: 30, active: true };
  },
  create: async (collection: string, data: any) => {
    console.log(`[API] CREATE ${collection}`, data);
    return { id: 'api-' + Math.random().toString(36).substr(2, 9), ...data };
  },
  update: async (collection: string, id: string, data: any) => {
    console.log(`[API] UPDATE ${collection}/${id}`, data);
    return { id, ...data };
  },
  delete: async (collection: string, id: string) => {
    console.log(`[API] DELETE ${collection}/${id}`);
    return true;
  },
  query: async (collection: string, query: any) => {
    console.log(`[API] QUERY ${collection}`, query);
    return [];
  }
};

async function demonstrateMemoryStorage() {
  console.log('=== Memory Storage Demo ===');
  
  const memoryStorage = new MemoryStorageAdapter<User>();
  
  // Subscribe to events
  memoryStorage.on('create', (user) => {
    console.log('📝 Created:', user.name);
  });
  
  memoryStorage.on('change', () => {
    console.log('🔄 Data changed. Total users:', memoryStorage.size);
  });
  
  // Create users
  const user1 = await memoryStorage.create({ 
    name: 'Alice', 
    email: 'alice@example.com', 
    age: 28, 
    active: true 
  });
  
  const user2 = await memoryStorage.create({ 
    name: 'Bob', 
    email: 'bob@example.com', 
    age: 32, 
    active: false 
  });
  
  console.log('All users:', memoryStorage.getAll());
  
  // Query users
  const activeUsers = memoryStorage.where({ active: true });
  console.log('Active users:', activeUsers.map(u => u.name));
  
  // Query with operator
  const olderUsers = memoryStorage.where({ age: { $gt: 30 } });
  console.log('Users over 30:', olderUsers.map(u => u.name));
  
  // Update user
  await memoryStorage.update(user1.id, { age: 29 });
  console.log('Updated Alice:', await memoryStorage.get(user1.id));
  
  // Delete user
  await memoryStorage.delete(user2.id);
  console.log('After deletion:', memoryStorage.getAll().map(u => u.name));
  
  console.log('Mode:', memoryStorage.getMode());
  console.log('');
}

async function demonstrateApiStorage() {
  console.log('=== API Storage Demo ===');
  
  const apiStorage = new ApiStorageAdapter<User>(mockApiClient, 'users');
  
  // Subscribe to events
  apiStorage.on('create', (user) => {
    console.log('📝 API Created:', user.name);
  });
  
  // Create user via API
  const newUser = await apiStorage.create({ 
    name: 'Charlie', 
    email: 'charlie@example.com', 
    age: 25, 
    active: true 
  });
  
  console.log('Created via API:', newUser);
  
  // Fetch user (will use cache after first call)
  const fetchedUser = await apiStorage.get(newUser.id);
  console.log('Fetched user:', fetchedUser);
  
  console.log('Mode:', apiStorage.getMode());
  console.log('');
}

// Run demonstrations
async function runDemo() {
  try {
    await demonstrateMemoryStorage();
    await demonstrateApiStorage();
    console.log('✅ Storage adapters demo completed successfully!');
  } catch (error) {
    console.error('❌ Demo failed:', error);
  }
}

// Export for potential use in tests or other modules
export { 
  demonstrateMemoryStorage, 
  demonstrateApiStorage, 
  runDemo,
  mockApiClient
};

// Run demo if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  runDemo();
}