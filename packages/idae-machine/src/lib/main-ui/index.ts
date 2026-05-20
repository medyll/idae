// Main UI barrel export for idae-machine
// Hierarchy: explorer → card → field → input

// Explorer: collection-level browser components
export * from './explorer/index.js';

// Card: record-level components (CRUD, relations, context)
export * from './card/index.js';

// Field: atomic field display/edit (moved to data-ui)
export * from '../data-ui/field/index.js';

// Input: type-specific input atoms (moved to data-ui)
export * from '../data-ui/input/index.js';

// Layout: structural shells (no data)
export * from './layout/index.js';

// Fragments: micro UI (no business logic) (moved to data-ui)
export * from '../data-ui/fragments/index.js';
