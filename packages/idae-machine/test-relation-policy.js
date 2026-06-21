// Test script for RelationPolicy implementation
import { IdaeRelationPolicy } from './dist/idae/relations/RelationPolicy.js';

console.log('Testing RelationPolicy implementation...');

// Create a mock machine instance
const mockMachine = {
  store: (collection, query) => {
    console.log(`Mock store called with collection: ${collection}, query:`, query);
    
    // Mock appscheme data
    if (collection === 'appscheme' && query?.code === 'vehicle') {
      return {
        records: {
          subscribe: (fn) => {
            const mockData = [{
              id: 1,
              code: 'vehicle',
              name: 'Vehicle',
              fkRelations: {
                vehicle_type: {
                  code: 'vehicle_type',
                  multiple: false,
                  required: true
                },
                vehicle_brand: {
                  code: 'vehicle_brand',
                  multiple: false,
                  required: false
                }
              }
            }];
            fn(mockData);
            return { unsubscribe: () => {} };
          }
        }
      };
    }
    
    return { records: { subscribe: (fn) => { fn([]); return { unsubscribe: () => {} }; } } };
  }
};

// Test the policy
const policy = new IdaeRelationPolicy();

try {
  // Test initialization
  policy.initialize(mockMachine);
  console.log('✓ Policy initialized successfully');
  
  // Test relations reading
  const relations = policy.relations('vehicle');
  console.log('✓ Relations read successfully:', relations);
  
  // Test findRelationField
  const relationField = policy.findRelationField('vehicle', 'vehicle_type');
  console.log('✓ findRelationField result:', relationField);
  
  // Test hasRelationValue
  const hasValue = policy.hasRelationValue('vehicle', {
    fks: { vehicle_type: 'type1' }
  }, 'vehicle_type');
  console.log('✓ hasRelationValue result:', hasValue);
  
  // Test reverseRelations (should warn)
  const reverseRelations = policy.reverseRelations('vehicle');
  console.log('✓ reverseRelations result:', reverseRelations);
  
  console.log('\n✓ All RelationPolicy tests passed!');
  
} catch (error) {
  console.error('✗ RelationPolicy test failed:', error);
  process.exit(1);
}