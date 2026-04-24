// Main barrel export for idae-machine v2

// Core
export { Machine } from './machine.js';
export { MachineDb } from './machineDb.js';
export { MachineParserForge } from './machineParserForge.js';

// Types
export * from './types/index.js';

// API (v2 features)
export * from './api/index.js';

// Sync (v2 features)
export * from './sync/index.js';

// Multi-base (v2 features)
export { MachineMultiBase } from './multi-base/index.js';

// Router (v2 features)
export { SchemaRouter } from './router/SchemaRouter.js';
export type { SchemaRouterConfig, RoutePermission } from './router/SchemaRouter.js';
