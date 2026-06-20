// Test to reproduce the FK view issue
import { machine } from './src/lib/main/machine.js';
import { demoScheme } from './src/lib/__fixtures__/demoModel.js';

// Minimal core for testing
const testCore = {
  appscheme:           { keyPath: '++id', base: 'machine_app', model: {}, fields: { id: { type: 'id', readonly: true }, code: { type: 'text', required: true } }, fks: {}, template: { presentation: 'code' } },
  appscheme_view_type: { keyPath: '++id', base: 'machine_app', model: {}, fields: { id: { type: 'id', readonly: true }, code: { type: 'text', required: true } }, fks: {}, template: { presentation: 'code' } },
  appscheme_field_type:{ keyPath: '++id', base: 'machine_app', model: {}, fields: { id: { type: 'id', readonly: true }, code: { type: 'text', required: true } }, fks: {}, template: { presentation: 'code' } },
  appscheme_field: {
    keyPath: '++id', base: 'machine_app', model: {},
    fields: { id: { type: 'id', readonly: true }, code: { type: 'text', required: true } },
    fks: { appscheme_field_type: { code: 'appscheme_field_type', multiple: false, required: true } },
    template: { presentation: 'code' }
  },
  appscheme_view: {
    keyPath: '++id', base: 'machine_app', model: {},
    fields: { id: { type: 'id', readonly: true }, code: { type: 'text', required: true } },
    fks: {
      appscheme:           { code: 'appscheme',           multiple: false, required: true },
      appscheme_view_type: { code: 'appscheme_view_type', multiple: false, required: true },
      appscheme_field:     { code: 'appscheme_field',     multiple: false, required: true }
    },
    template: { presentation: 'fks.appscheme.code fks.appscheme_view_type.code fks.appscheme_field.code' }
  }
};

async function testFkView() {
  console.log('Initializing machine...');
  
  machine.init({ dbName: 'test-fk-view', version: 1, core: testCore, business: demoScheme, sync: false });
  await machine.boot();
  
  console.log('Machine booted. Testing vehicle scheme...');
  
  const vehicleScheme = machine.logic.collectionOr('vehicle', null);
  console.log('Vehicle scheme:', {
    fields: Object.keys(vehicleScheme?.fields || {}),
    fks: Object.keys(vehicleScheme?.fks || {})
  });
  
  // Test the useViewFields logic manually
  if (vehicleScheme) {
    const fields = vehicleScheme.fields;
    const fks = vehicleScheme.fks ?? {};
    
    console.log('Fields:', Object.keys(fields));
    console.log('FKs:', Object.keys(fks));
    
    // Get FK names that are not in fields
    const fkNames = Object.keys(fks).filter((n) => !(n in fields));
    const names = [...Object.keys(fields), ...fkNames];
    
    console.log('All names:', names);
    console.log('FK names (not in fields):', fkNames);
    
    const isFk = (name) => name in fks;
    
    // Test different views
    console.log('\nView tests:');
    console.log('full view:', names);
    console.log('flat view:', names.filter((n) => !isFk(n)));
    console.log('fk view:', names.filter(isFk));
    console.log('focus view:', names.filter((n) => fields[n]?.group === 'identification') || ['code', 'name'].filter((n) => n in fields) || (Object.keys(fields).includes('code') ? ['code'] : []));
  }
  
  machine.destroy();
}

testFkView().catch(console.error);