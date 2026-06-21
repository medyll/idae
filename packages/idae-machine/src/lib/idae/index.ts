// idae/index.ts — public exports for idae domain

export {
	initializeDomainPolicies,
	initializeDomainPoliciesWithMachine,
	initializeDomainPoliciesWithModel,
	registerPolicy,
	getPolicyRegistry,
	relationPolicy,
	userScopePolicy,
	metaModelProvider,
	rightsPolicy,
	capabilities,
	frameCatalog,
	type PolicyRegistry
} from '$lib/idae/boot.js';

export { IdaeRelationPolicy } from '$lib/idae/relations/RelationPolicy.js';
export { IdaeUserScopePolicy } from '$lib/idae/userscope/UserScopePolicy.js';
export { IdaeMetaModelProvider } from '$lib/idae/meta/MetaModelProvider.js';
export { IdaeRightsPolicy } from '$lib/idae/rights/RightsPolicy.js';
export { IdaeCapabilities } from '$lib/idae/capabilities/Capabilities.js';
export { IdaeFrameCatalog } from '$lib/idae/frames/FrameCatalog.js';
export { ensureCodeField, CODE_FIELD_NAME } from '$lib/idae/codefield/CodeFieldConvention.js';
export { idaeFieldTypesDef } from '$lib/idae/fieldcatalog/defaultFieldTypesDef.js';
export { registerDomainBridges } from '$lib/idae/bridge/register.js';
