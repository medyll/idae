// idae/boot.ts — domain policy registration
// Registers all idae domain implementations with the machine engine.

import type {
	RelationPolicy,
	MetaModelProvider,
	UserScopePolicy,
	RightsPolicy,
	Capabilities,
	FrameCatalog
} from '$lib/machine/ext/interfaces.js';
import type { MachineModel } from '$lib/types/index.js';

import { IdaeRelationPolicy } from './relations/RelationPolicy.js';
import { IdaeUserScopePolicy } from './userscope/UserScopePolicy.js';
import { IdaeMetaModelProvider } from './meta/MetaModelProvider.js';
import { IdaeRightsPolicy } from './rights/RightsPolicy.js';
import { IdaeCapabilities } from './capabilities/Capabilities.js';
import { IdaeFrameCatalog } from './frames/FrameCatalog.js';
import { registerDomainBridges } from './bridge/register.js';

const relationPolicy = new IdaeRelationPolicy();
const userScopePolicy = new IdaeUserScopePolicy();
const metaModelProvider = new IdaeMetaModelProvider();
const rightsPolicy = new IdaeRightsPolicy();
const capabilities = new IdaeCapabilities();
const frameCatalog = new IdaeFrameCatalog();

export interface PolicyRegistry {
	relation?: RelationPolicy;
	meta?: MetaModelProvider;
	userScope?: UserScopePolicy;
	rights?: RightsPolicy;
	capabilities?: Capabilities;
	frameCatalog?: FrameCatalog;
}

let policyRegistry: PolicyRegistry = {};

export function registerPolicy<T extends keyof PolicyRegistry>(
	policyName: T,
	implementation: PolicyRegistry[T]
): void {
	policyRegistry[policyName] = implementation;
}

export function getPolicyRegistry(): PolicyRegistry {
	return policyRegistry;
}

export function initializeDomainPoliciesWithMachine(machine: any): void {
	relationPolicy.initialize(machine);
	userScopePolicy.initialize(machine);

	registerPolicy('relation', relationPolicy);
	registerPolicy('userScope', userScopePolicy);

	registerDomainBridges(relationPolicy, metaModelProvider, rightsPolicy);
}

export function initializeDomainPoliciesWithModel(model: MachineModel): void {
	metaModelProvider.initialize(model);
	rightsPolicy.initialize(model);
	capabilities.initialize(model);

	registerPolicy('meta', metaModelProvider);
	registerPolicy('rights', rightsPolicy);
	registerPolicy('capabilities', capabilities);
	registerPolicy('frameCatalog', frameCatalog);

	registerDomainBridges(relationPolicy, metaModelProvider, rightsPolicy);
}

export function initializeDomainPolicies(): void {
	// stub — call initializeDomainPoliciesWithMachine + initializeDomainPoliciesWithModel for full init
}

export {
	relationPolicy,
	userScopePolicy,
	metaModelProvider,
	rightsPolicy,
	capabilities,
	frameCatalog
};
