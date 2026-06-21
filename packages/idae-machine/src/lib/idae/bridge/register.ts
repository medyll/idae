// idae/bridge/register.ts
// Registers all domain implementations with the engine bridge hooks.
// Called once during boot — after this, engine files can delegate to domain
// via the abstract hooks without importing from idae/.

import {
	registerRelationResolver,
	registerMetaCollectionResolver,
	registerCodeFieldConvention,
	registerGrantDecoder
} from '$lib/machine/ext/hooks.js';
import type { IdaeRelationPolicy } from '$lib/idae/relations/RelationPolicy.js';
import type { IdaeMetaModelProvider } from '$lib/idae/meta/MetaModelProvider.js';
import type { IdaeRightsPolicy } from '$lib/idae/rights/RightsPolicy.js';
import { ensureCodeField, CODE_FIELD_NAME } from '$lib/idae/codefield/CodeFieldConvention.js';

export function registerDomainBridges(
	relationPolicy: IdaeRelationPolicy,
	metaModelProvider: IdaeMetaModelProvider,
	rightsPolicy: IdaeRightsPolicy
): void {
	registerRelationResolver(relationPolicy);
	registerMetaCollectionResolver(metaModelProvider);
	registerCodeFieldConvention({
		codeFieldName: CODE_FIELD_NAME,
		ensureCodeField
	});
	registerGrantDecoder(rightsPolicy);
}
