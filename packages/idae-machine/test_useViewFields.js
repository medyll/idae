// Test script to debug useViewFields with view='fk'

// Mock scheme structure
const mockScheme = {
  fields: {
    id: { name: 'id', group: 'system' },
    code: { name: 'code', group: 'identification' },
    name: { name: 'name', group: 'identification' },
    description: { name: 'description', group: 'details' }
  },
  fks: {
    category: {
      name: 'category',
      code: 'category',
      multiple: false,
      required: true
    },
    tags: {
      name: 'tags',
      code: 'tags',
      multiple: true,
      required: false
    }
  }
};

// Simulate the useViewFields logic for view='fk'
function testViewFk(scheme) {
  const fields = scheme.fields;
  const fks = scheme.fks ?? {};
  
  // Get FK names that are not in fields
  const fkNames = Object.keys(fks).filter((n) => !(n in fields));
  const names = [...Object.keys(fields), ...fkNames];
  
  console.log('All names:', names);
  console.log('FK names:', fkNames);
  console.log('Fields keys:', Object.keys(fields));
  console.log('FKs keys:', Object.keys(fks));
  
  const isFk = (name) => name in fks;
  
  // Test the fk view filter
  const fkViewResult = names.filter(isFk);
  console.log('FK view result:', fkViewResult);
  
  return fkViewResult;
}

console.log('Testing useViewFields with view="fk":');
testViewFk(mockScheme);