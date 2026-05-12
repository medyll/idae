// Main UI barrel export for idae-machine
// Hierarchy: explorer → card → field → input

// Explorer: collection-level browser components
export * from './explorer/index.js';

// Card: record-level components (CRUD, relations, context)
export * from './card/index.js';

// Field: atomic field display/edit
export * from './field/index.js';

// Input: type-specific input atoms
export * from './input/index.js';

// Layout: structural shells (no data)
export * from './layout/index.js';

// Fragments: micro UI (no business logic)
export * from './fragments/index.js';
