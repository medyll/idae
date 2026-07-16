// Main barrel export for idae-machine v2

// Core
export { Machine } from './machine.js';
export { machine } from './machine.js';
export type {
	MachineBootPhase,
	MachineBootStatus,
	MachineBootTraceEntry,
	MachineComponentRegistry,
	MachineStoreDiagnostic
} from './machine.js';
export { MachineDb } from './machineDb.js';
export { MachineParserForge } from './machineParserForge.js';
export { diagnoseMachineModel } from './machineSchemaDoctor.js';
export type {
	SchemaDiagnostic,
	SchemaDiagnosticReport,
	SchemaDiagnosticSeverity
} from './machineSchemaDoctor.js';

// Schema builder helpers
export { field } from './machine/fieldBuilder.js';

// Rights / RBAC
export { machineRights } from './machine/MachineRights.js';

// Record identity normalization
export { MachineRecordIdentity } from './machine/MachineRecordIdentity.js';

// Types
export * from '../types/index.js';

// Scheme types (ViewFields/ViewFieldDef re-export to avoid main type-index conflict)
export type { AppScheme, ViewFieldDef, ViewFields } from './api/types.js';

// Seed
export { seed } from './machineSeed.js';

// Router (v2 features)
export { MachineRouter } from './machine/MachineRouter.js';
export type { MachineRouterConfig } from './machine/MachineRouter.js';
