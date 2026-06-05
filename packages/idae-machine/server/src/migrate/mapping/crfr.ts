/**
 * crfr legacy → canonical mapping (SKELETON — fill incrementally).
 *
 * Only a couple of collections are sketched as examples. The FR→EN renames here
 * are the seed of the deferred WS-rename pass. Extend collection by collection,
 * prioritising the ones you actually need to migrate.
 */
import type { OrgMapping } from './types.js';

export const crfrMapping: OrgMapping = {
	// example — referential
	aeroport: {
		target: 'airport',
		fields: {
			petitNom: 'short_name',
			description: 'description',
			image: 'image',
		},
	},

	// example — relational (fk reconstruction)
	agent: {
		target: 'agent',
		fields: {
			prenom: 'first_name',
			estActif: 'is_active',
			login: 'login',
			groupe: 'group',
		},
		drop: ['password', 'mailPassword', 'PHPSESSID', 'md5', 'private_key'],
		fks: {
			// legacy `groupe` (a group code) → fk to engine appuser_group
			appuser_group: { collection: 'appuser_group', from: 'groupe', on: 'code' },
		},
	},

	// TODO: remaining ~149 collections.
};

export default crfrMapping;
