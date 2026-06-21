// Test script to verify imports work correctly
console.log('Testing imports...');

try {
  // Test machine/ext imports
  const { getPolicyRegistry } = await import('./dist/machine/ext/registry.js');
  console.log('✓ machine/ext/registry.js imported successfully');
  
  // Test idae imports  
  const { initializeDomainPolicies, getPolicyRegistry: getIdaeRegistry } = await import('./dist/idae/boot.js');
  console.log('✓ idae/boot.js imported successfully');
  
  // Initialize domain policies
  initializeDomainPolicies();
  console.log('✓ Domain policies initialized');
  
  // Get registry
  const registry = getIdaeRegistry();
  console.log('✓ Policy registry retrieved:', Object.keys(registry));
  
  if (registry.relation) {
    console.log('✓ Relation policy is registered');
    console.log('Policy type:', typeof registry.relation);
  } else {
    console.log('✗ Relation policy not found in registry');
  }
  
  console.log('\n✓ All imports and initializations successful!');
  
} catch (error) {
  console.error('✗ Import test failed:', error);
  process.exit(1);
}