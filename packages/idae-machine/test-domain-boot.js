// Test script to verify domain boot
import { initializeDomainPolicies, getPolicyRegistry } from './src/lib/idae/index.js';

console.log('Testing domain boot...');

// Initialize domain policies
initializeDomainPolicies();

// Get the registry
const registry = getPolicyRegistry();
console.log('Policy registry:', registry);

// Check if relation policy is registered
if (registry.relation) {
  console.log('✓ Relation policy registered successfully');
  console.log('Policy type:', typeof registry.relation);
  
  // Test a method
  try {
    const relations = registry.relation.relations('test-collection');
    console.log('✓ Relation policy methods accessible');
    console.log('Test relations result:', relations);
  } catch (error) {
    console.error('✗ Error calling relation policy method:', error);
  }
} else {
  console.log('✗ Relation policy not registered');
}

console.log('Domain boot test completed.');