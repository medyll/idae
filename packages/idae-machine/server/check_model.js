import { buildIdaeModel } from './src/bootstrap/seed/idaeModel.js';

const model = buildIdaeModel();

console.log('=== Checking core model fkRelations ===');
console.log('appuser fkRelations:', JSON.stringify(model.appuser?.fkRelations, null, 2));
console.log('ai_chat_session fkRelations:', JSON.stringify(model.ai_chat_session?.fkRelations, null, 2));
console.log('appscheme_field fkRelations:', JSON.stringify(model.appscheme_field?.fkRelations, null, 2));

// Count collections with fkRelations
const collectionsWithFk = Object.entries(model).filter(([name, def]) => 
  def.fkRelations && Object.keys(def.fkRelations).length > 0
);
console.log(`\nCollections with fkRelations: ${collectionsWithFk.length}/${Object.keys(model).length}`);
console.log('Collections:', collectionsWithFk.map(([name]) => name).join(', '));
