// Test script for UserScopePolicy implementation
import { IdaeUserScopePolicy } from './dist/idae/userscope/UserScopePolicy.js';

console.log('Testing UserScopePolicy implementation...');

// Create a mock machine instance
const mockMachine = {
  rights: {
    currentUser: {
      id: 'user123',
      login: 'testuser'
    }
  }
};

// Test the policy
const policy = new IdaeUserScopePolicy();

try {
  // Test initialization
  policy.initialize(mockMachine);
  console.log('✓ Policy initialized successfully');
  
  // Test currentUserId
  const userId = policy.currentUserId();
  console.log('✓ currentUserId:', userId);
  
  if (userId !== 'user123') {
    throw new Error(`Expected userId 'user123', got '${userId}'`);
  }
  
  // Test scopedCollections
  const collections = policy.scopedCollections();
  console.log('✓ scopedCollections:', collections);
  
  if (!collections.includes('appuser_history')) {
    throw new Error('appuser_history not found in scoped collections');
  }
  
  // Test naturalKey
  const historyKey = policy.naturalKey('appuser_history');
  console.log('✓ appuser_history naturalKey:', historyKey);
  
  if (!historyKey || !historyKey.includes('code')) {
    throw new Error('appuser_history naturalKey should include code');
  }
  
  const prefsKey = policy.naturalKey('appuser_prefs');
  console.log('✓ appuser_prefs naturalKey:', prefsKey);
  
  if (!prefsKey || prefsKey.length < 3) {
    throw new Error('appuser_prefs naturalKey should have multiple fields');
  }
  
  // Test unknown collection
  const unknownKey = policy.naturalKey('unknown_collection');
  console.log('✓ unknown_collection naturalKey:', unknownKey);
  
  if (unknownKey !== null) {
    throw new Error('unknown_collection should return null');
  }
  
  console.log('\n✓ All UserScopePolicy tests passed!');
  
} catch (error) {
  console.error('✗ UserScopePolicy test failed:', error);
  process.exit(1);
}