/**
 * Utility functions for schema-related operations.
 * Separates presentation logic from deployment logic.
 */

/**
 * Infers the field group based on field name and type.
 * Used for categorizing fields in the UI (e.g., 'identification', 'finance').
 */
export function inferFieldGroup(name: string, type: string): string {
	const n = name.toLowerCase();
	// Identity/label fields drive the focus view (mini-fiche).
	if (['code', 'name', 'label', 'title', 'nom', 'libelle'].includes(n)) return 'identification';
	if (n === 'id' || type === 'id')                      return 'system';
	if (type.startsWith('fk'))                            return 'classification';
	if (['date', 'datetime', 'time'].includes(type))      return 'date';
	if (['email', 'phone', 'url'].includes(type))         return 'contact';
	if (type === 'boolean')                               return 'status';
	if (type === 'number')                                return 'metrics';
	if (type === 'currency')                              return 'finance';
	if (['image', 'file'].includes(type))                 return 'presentation';
	if (type === 'password')                              return 'security';
	return 'presentation';
}

/**
 * Maps field groups to icons for UI display.
 * Centralizes presentation logic to avoid duplication.
 */
export const ICON_BY_GROUP: Record<string, string> = {
	audit:          'history',
	classification: 'tag',
	codification:   'hash',
	contact:        'mail',
	date:           'calendar',
	finance:        'dollar',
	identification: 'key',
	inventory:      'box',
	location:       'map',
	metrics:        'ruler',
	presentation:   'eye',
	progress:       'trending-up',
	quantity:       'package',
	security:       'lock',
	status:         'flag',
	system:         'cog',
	custom:         'star',
};