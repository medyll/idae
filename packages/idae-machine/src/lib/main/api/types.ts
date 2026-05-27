// Re-export from canonical source — machine-model.ts is the single source of truth
export type { ViewFieldDef, FieldViews } from '$lib/types/machine-model.js';
import type { FieldViews } from '$lib/types/machine-model.js';

/**
 * AppScheme type
 */
export interface AppScheme {
	id: string;
	code: string;
	name: string;
	_views?: FieldViews;
	fields?: unknown[];
	createdAt?: string;
	updatedAt?: string;
}

/**
 * Health response
 */
export interface HealthResponse {
	status: string;
	version: string;
	timestamp: string;
	environment: string;
}

/**
 * Schemes list response
 */
export interface SchemesResponse {
	schemes: AppScheme[];
}
