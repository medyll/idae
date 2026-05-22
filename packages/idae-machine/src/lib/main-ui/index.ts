// Main UI barrel export — retro-compat layer re-exporting from shell/ and data-ui/
// Hierarchy: explorer → card → field → input

// Explorer: collection-level browser components (moved to shell/)
export * from '../shell/frame/index.js';


// Layout: structural shells (no data) (moved to shell/)
export * from '../shell/layout/index.js';

// Field: atomic field display/edit (moved to data-ui)
export * from '../data-ui/field/index.js';

// Input: type-specific input atoms (moved to data-ui)
export * from '../data-ui/input/index.js';

// Fragments: micro UI (no business logic) (moved to data-ui)
export * from '../data-ui/fragments/index.js';

// Data: smart data components (moved to data-ui)
export * from '../data-ui/data/index.js';
