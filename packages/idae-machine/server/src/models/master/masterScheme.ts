import type { MachineModel } from '../../../../src/lib/types/machine-model.js';

/**
 * master scheme — registre général org/modèles (admin générale).
 * Catalogue des tenants (org), des schemes déployés (model) et de leurs
 * collections (model_collection). Sert de vue d'ensemble cross-org.
 */
export const masterScheme: MachineModel = {

	org: {
		base: 'machine_base',
		fields: {
			id:            { type: 'id',    readonly: true },
			code:          { type: 'text',  required: true },
			name:          { type: 'text',  required: true },
			domain:        { type: 'text' },
			version:       { type: 'text' },
			status:        { type: 'text' },   // active | archived
			mongo_prefix:  { type: 'text' },   // ex '{org}_machine'
			contact_email: { type: 'email' },
			notes:         { type: 'text-lg' },
			created_at:    { type: 'date' },
		},
		fkRelations: {},
		template: { presentation: 'name code status version' },
	},

	model: {
		base: 'machine_base',
		fields: {
			id:               { type: 'id',     readonly: true },
			code:             { type: 'text',   required: true },
			name:             { type: 'text',   required: true },
			version:          { type: 'text' },
			collection_count: { type: 'number' },
			status:           { type: 'text' },   // published | draft
			deployed_at:      { type: 'date' },
			notes:            { type: 'text-lg' },
		},
		fkRelations: {
			org: { code: 'org', multiple: false, required: true },
		},
		template: { presentation: 'name version collection_count status' },
	},

	model_collection: {
		base: 'machine_base',
		fields: {
			id:           { type: 'id',      readonly: true },
			code:         { type: 'text',    required: true },
			name:         { type: 'text' },
			base:         { type: 'text' },   // ex 'machine_base'
			field_count:  { type: 'number' },
			fk_count:     { type: 'number' },
			is_type:      { type: 'boolean' },
			is_group:     { type: 'boolean' },
			is_status:    { type: 'boolean' },
		},
		fkRelations: {
			model: { code: 'model', multiple: false, required: true },
		},
		template: { presentation: 'code base field_count fk_count' },
	},
};

// ── Seed data ──────────────────────────────────────────────────────────────

export const masterSeed = {

	org: [
		{ id: 1, code: 'demo',     name: 'Demo Fleet',          status: 'active', mongo_prefix: 'demo_machine',     created_at: new Date('2026-05-01') },
		{ id: 2, code: 'crfr',     name: 'CRFR',                status: 'active', mongo_prefix: 'crfr_machine',     created_at: new Date('2026-05-01') },
		{ id: 3, code: 'idaenext', name: 'IDAE Next',           status: 'active', mongo_prefix: 'idaenext_machine', created_at: new Date('2026-05-01') },
		{ id: 4, code: 'tactac',   name: 'Tactac',              status: 'active', mongo_prefix: 'tactac_machine',   created_at: new Date('2026-05-01') },
		{ id: 5, code: 'latent',   name: 'Latent Line',         status: 'active', mongo_prefix: 'latent_machine',   created_at: new Date('2026-06-01') },
		{ id: 6, code: 'sive',     name: 'Sive',                status: 'active', mongo_prefix: 'sive_machine',     created_at: new Date('2026-06-01') },
		{ id: 7, code: 'master',   name: 'Master Admin',        status: 'active', mongo_prefix: 'master_machine',   created_at: new Date('2026-06-07') },
	],

	model: [
		{ id: 1, code: 'demoScheme',     name: 'Demo Fleet Scheme',  org: 1, collection_count: 14, status: 'published', deployed_at: new Date('2026-05-01') },
		{ id: 2, code: 'crfrScheme',     name: 'CRFR Scheme',        org: 2, status: 'published', deployed_at: new Date('2026-05-01') },
		{ id: 3, code: 'idaenextScheme', name: 'IDAE Next Scheme',   org: 3, status: 'published', deployed_at: new Date('2026-05-01') },
		{ id: 4, code: 'tactacScheme',   name: 'Tactac Scheme',      org: 4, status: 'published', deployed_at: new Date('2026-05-01') },
		{ id: 5, code: 'latentScheme',   name: 'Latent Line Scheme', org: 5, collection_count: 11, status: 'published', deployed_at: new Date('2026-06-01') },
		{ id: 6, code: 'siveScheme',     name: 'Sive Scheme',        org: 6, status: 'published', deployed_at: new Date('2026-06-01') },
		{ id: 7, code: 'masterScheme',   name: 'Master Scheme',      org: 7, collection_count: 3,  status: 'published', deployed_at: new Date('2026-06-07') },
	],

	model_collection: [
		{ id: 1, code: 'vehicle', name: 'Vehicle', base: 'machine_base', model: 1, field_count: 9, fk_count: 2, is_type: false, is_group: false, is_status: true },
		{ id: 2, code: 'rental',  name: 'Rental',  base: 'machine_base', model: 1, field_count: 11, fk_count: 3, is_type: false, is_group: false, is_status: true },
		{ id: 3, code: 'customer', name: 'Customer', base: 'machine_base', model: 1, field_count: 9, fk_count: 0, is_type: false, is_group: false, is_status: false },
	],
};

export default masterScheme;
