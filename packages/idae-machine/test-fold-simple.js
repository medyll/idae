// Simple test for foldRelations
import { IdaeRelationPolicy } from './dist/idae/relations/RelationPolicy.js';

console.log('Testing foldRelations with simple mock...');

// Simple mock that returns consistent data
const mockData = {
  appscheme: {
    vehicle: [{
      id: 1,
      code: 'vehicle',
      fkRelations: {
        vehicle_type: { code: 'vehicle_type', multiple: false, required: true },
        vehicle_brand: { code: 'vehicle_brand', multiple: false, required: false }
      }
    }]
  },
  vehicle_type: {
    sedan: [{ id: 1, code: 'sedan', name: 'Sedan' }],
    suv: [{ id: 2, code: 'suv', name: 'SUV' }]
  },
  vehicle_brand: {
    toyota: [{ id: 1, code: 'toyota', name: 'Toyota' }]
  }
};

const mockMachine = {
  store: (collection, query) => {
    console.log(`Store call: ${collection}`, query);
    
    // Find the right mock data
    if (collection === 'appscheme' && query?.code) {
      const record = mockData.appscheme[query.code]?.[0];
      if (record) {
        return {
          records: {
            subscribe: (fn) => {
              fn([record]);
              return { unsubscribe: () => {} };
            }
          }
        };
      }
    }
    
    // Find FK target data
    if (query?.[FK_INDEX_FIELD]) {
      const targetData = mockData[collection]?.[query[FK_INDEX_FIELD]];
      if (targetData) {
        return {
          records: {
            subscribe: (fn) => {
              fn(targetData);
              return { unsubscribe: () => {} };
            }
          }
        };
      }
    }
    
    console.log(`No mock data found for ${collection} with query`, query);
    return { records: { subscribe: (fn) => { fn([]); return { unsubscribe: () => {} }; } } };
  }
};

const FK_INDEX_FIELD = 'code';

async function runTest() {
  try {
    const policy = new IdaeRelationPolicy();
    policy.initialize(mockMachine);
    console.log('✓ Policy initialized');
    
    // Test relations reading first
    const relations = policy.relations('vehicle');
    console.log('Relations:', relations);
    
    if (Object.keys(relations).length === 0) {
      console.log('✗ No relations found - check mock data');
      return;
    }
    
    // Test record
    const testRecord = {
      id: 1,
      vehicle_type: 'sedan',
      vehicle_brand: 'toyota',
      fks: {}
    };
    
    console.log('Folding record:', testRecord);
    
    const folded = await policy.foldRelations('vehicle', testRecord);
    
    console.log('Folded result:', JSON.stringify(folded, null, 2));
    
    if (folded.fks.vehicle_type) {
      console.log('✓ vehicle_type folded:', folded.fks.vehicle_type);
    } else {
      console.log('✗ vehicle_type not folded');
    }
    
    if (folded.fks.vehicle_brand) {
      console.log('✓ vehicle_brand folded:', folded.fks.vehicle_brand);
    } else {
      console.log('✗ vehicle_brand not folded');
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

runTest();