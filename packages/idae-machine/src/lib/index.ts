// auto exports of entry components

// Main UI Components (all UI in one place)
export * from '$lib/main-ui/index.js';

// Main Logic (machine, types, API, sync)
export * from '$lib/main/index.js';

// Demo & Examples
export * from '$lib/demo/analyzeDemo.js';
export * from '$lib/demo/dbSchema.js';
export * from '$lib/demo/demoInit.js';
export * from '$lib/demo/seedData.js';
export * from '$lib/demo/testScheme.js';

// Types
export * from '$lib/types/appschemeTypes.js';

// Form types
export * from '$lib/form/types.js';

// Demo components (for showcase, not production)
export { default as DemoCollectionTable } from '$lib/demo/CollectionTable.svelte';
export { default as DemoCollectionCard } from '$lib/demo/CollectionCard.svelte';
