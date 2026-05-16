// Main barrel export for idae-machine v2

// Core
export { Machine } from './machine.js';
export { MachineDb } from './machineDb.js';
export { MachineParserForge } from './machineParserForge.js';

// Schema builder helpers
export { field } from './machine/fieldBuilder.js';

// Rights / RBAC
export { machineRights } from './machine/MachineRights.js';

// Types
export * from '../types/index.js';
export type { MachineModel, MachineCollectionModel, MachineDisplayTemplate, MachineFieldDef, MachineFkDef } from '../types/machine-model.js';

// API (v2 features)
export { MachineApi, createMachineApi } from './api/MachineApi.js';
export type { MachineApiOptions } from './api/MachineApi.js';
export { RealtimeClient, createRealtimeClient } from './api/RealtimeClient.js';
export { MachineApiError, NetworkError } from './api/errors.js';
export type { HealthResponse, SchemesResponse } from './api/types.js';

// Sync (v2 features)
export * from './sync/index.js';

// Multi-base (v2 features)
export { MachineMultiBase } from './multi-base/index.js';

// Router (v2 features)
export { SchemaRouter } from './router/SchemaRouter.js';
export type { SchemaRouterConfig, RoutePermission } from './router/SchemaRouter.js';
