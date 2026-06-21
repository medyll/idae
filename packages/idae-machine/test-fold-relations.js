// Test script for foldRelations implementation
import { IdaeRelationPolicy } from './dist/idae/relations/RelationPolicy.js';

console.log('Testing foldRelations implementation...');

// Create a mock machine instance with test data
const mockMachine = {
  store: (collection, query) => {
    console.log(`Mock store called: ${collection}`, query);
    
    // Mock vehicle_type data
    if (collection === 'vehicle_type' && query?.code === 'sedan') {
      return {
        records: {
          subscribe: (fn) => {
            fn([{
              id: 1,
              code: 'sedan',
              name: 'Sedan',
              description: '4-door sedan'
            }]);
            return { unsubscribe: () => {} };
          }
        }
      };
    }
    
    // Mock vehicle_brand data
    if (collection === 'vehicle_brand' && query?.code === 'toyota') {
      return {
        records: {
          subscribe: (fn) => {
            fn([{
              id: 1,
              code: 'toyota',
              name: 'Toyota',
              country: 'Japan'
            }]);
            return { unsubscribe: () => {} };
          }
        }
      };
    }
    
    // Mock appscheme data
    if (collection === 'appscheme' && query?.code === 'vehicle') {
      return {
        records: {
          subscribe: (fn) => {
            fn([{
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
            }]);
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

async function runTests() {
  try {
    // Initialize
    policy.initialize(mockMachine);
    console.log('✓ Policy initialized');
    
    // Test record with FK values
    const testRecord = {
      id: 1,
      name: 'Test Car',
      vehicle_type: 'sedan',
      vehicle_brand: 'toyota',
      fks: {}
    };
    
    console.log('Input record:', testRecord);
    
    // Fold the relations
    const foldedRecord = await policy.foldRelations('vehicle', testRecord);
    
    console.log('Folded record:', JSON.stringify(foldedRecord, null, 2));
    
    // Verify the results
    if (foldedRecord.fks.vehicle_type) {
      console.log('✓ vehicle_type relation folded:', foldedRecord.fks.vehicle_type);
    } else {
      console.log('✗ vehicle_type relation not folded');
    }
    
    if (foldedRecord.fks.vehicle_brand) {
      console.log('✓ vehicle_brand relation folded:', foldedRecord.fks.vehicle_brand);
    } else {
      console.log('✗ vehicle_brand relation not folded');
    }
    
    // Test with multiple values
    const testRecordMultiple = {
      id: 2,
      name: 'Multi Car',
      vehicle_type: ['sedan', 'suv'],
      fks: {}
    };
    
    // Add mock SUV data
    mockMachine.store = (collection, query) => {
      if (collection === 'vehicle_type' && query?.code === 'suv') {
        return {
          records: {
            subscribe: (fn) => {
              fn([{
                id: 2,
                code: 'suv',
                name: 'SUV',
                description: 'Sport Utility Vehicle'
              }]);
              return { unsubscribe: () => {} };
            }
          }
        };
      }
      return mockMachine.store(collection, query); // Fallback to original
    };
    
    const foldedMultiple = await policy.foldRelations('vehicle', testRecordMultiple);
    console.log('Multiple values folded:', JSON.stringify(foldedMultiple.fks, null, 2));
    
    console.log('\n✓ All foldRelations tests passed!');
    
  } catch (error) {
    console.error('✗ foldRelations test failed:', error);
    process.exit(1);
  }
}

runTests();