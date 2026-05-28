// Main barrel export for idae-machine v2

// Core
export { Machine } from './machine.js';
export { machine } from './machine.js';
export type { MachineComponentRegistry } from './machine.js';
export { MachineDb } from './machineDb.js';
export { MachineParserForge } from './machineParserForge.js';

// Schema builder helpers
export { field } from './machine/fieldBuilder.js';

// Rights / RBAC
export { machineRights } from './machine/MachineRights.js';

// Types
export * from '../types/index.js';

// API (v2 features)
export { MachineApi, createMachineApi } from './api/MachineApi.js';
export type { MachineApiOptions } from './api/MachineApi.js';
export { RealtimeClient, createRealtimeClient } from './api/RealtimeClient.js';
export { MachineApiError, NetworkError } from './api/errors.js';
export type { HealthResponse, SchemesResponse } from './api/types.js';

// Seed
export { seed } from './machineSeed.js';

// Multi-base (v2 features)
export { MachineMultiBase } from './multi-base/index.js';

// Router (v2 features)
export { MachineRouter } from './machine/MachineRouter.js';
export type { MachineRouterConfig } from './machine/MachineRouter.js';
