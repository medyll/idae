/**
 * Pure validation rules — no browser/Svelte dependencies.
 * Server-side copy — keep in sync with src/lib/main/machine/validateRules.ts
 *
 * Legacy PHP InputValidator.php rules ported:
 *   validateInt, validateEmail, validateDate, validateUrl,
 *   validateCp (code postal FR), validateAlpha, validateAlphanum
 */

export type FieldRule = {
	required?: boolean;
	type?: string;
	min?: number;
	max?: number;
	minLength?: number;
	maxLength?: number;
	pattern?: RegExp | string;
};

export type ValidationResult = {
	valid: boolean;
	errors: Record<string, string>;
};

// ── Type validators ──────────────────────────────────────────────────────────

const validators: Record<string, (value: unknown) => boolean | string> = {
	email: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v)) || 'Format email invalide',
	url: (v) => {
		try {
			const url = new URL(String(v));
			if (!['http:', 'https:'].includes(url.protocol)) return 'URL doit commencer par http:// ou https://';
			return true;
		} catch { return 'URL invalide'; }
	},
	date: (v) => !isNaN(Date.parse(String(v))) || 'Format de date invalide',
	datetime: (v) => !isNaN(Date.parse(String(v))) || 'Format date/heure invalide',
	time: (v) => /^([01]\d|2[0-3]):[0-5]\d(:[0-5]\d)?$/.test(String(v)) || "Format d'heure invalide (HH:MM)",
	number: (v) => !isNaN(Number(v)) || 'Doit être un nombre',
	integer: (v) => Number.isInteger(Number(v)) || 'Doit être un entier',
	boolean: (v) => (typeof v === 'boolean' || v === 'true' || v === 'false') || 'Doit être vrai ou faux',
	phone: (v) => /^\+?[\d\s-]{10,}$/.test(String(v)) || 'Format de téléphone invalide',
	cp: (v) => /^\d{5}$/.test(String(v)) || 'Code postal invalide (5 chiffres)',
	alpha: (v) => /^[a-zA-ZÀ-ÿ\s'-]+$/.test(String(v)) || 'Ne doit contenir que des lettres',
	alphanum: (v) => /^[a-zA-Z0-9À-ÿ\s'-]+$/.test(String(v)) || 'Ne doit contenir que des lettres et chiffres',
	password: () => true,
	text: () => true,
	'text-area': () => true,
	currency: (v) => !isNaN(Number(v)) || 'Montant invalide',
};

// ── Core validation ──────────────────────────────────────────────────────────

export function validateField(value: unknown, rule: FieldRule): string | null {
	if (rule.required && (value === undefined || value === null || value === '')) {
		return 'Ce champ est obligatoire';
	}
	if (value === undefined || value === null || value === '') return null;

	if (rule.type) {
		const typeValidator = validators[rule.type];
		if (typeValidator) {
			const result = typeValidator(value);
			if (result !== true) return typeof result === 'string' ? result : 'Format invalide';
		}
	}

	if (rule.pattern) {
		const regex = typeof rule.pattern === 'string' ? new RegExp(rule.pattern) : rule.pattern;
		if (!regex.test(String(value))) return 'Format invalide';
	}

	if (rule.type && ['number', 'integer', 'currency'].includes(rule.type)) {
		const num = Number(value);
		if (rule.min !== undefined && num < rule.min) return `Minimum ${rule.min}`;
		if (rule.max !== undefined && num > rule.max) return `Maximum ${rule.max}`;
	}

	if (typeof value === 'string') {
		if (rule.minLength !== undefined && value.length < rule.minLength)
			return `Minimum ${rule.minLength} caractères`;
		if (rule.maxLength !== undefined && value.length > rule.maxLength)
			return `Maximum ${rule.maxLength} caractères`;
	}

	return null;
}

export function validateRecord(
	data: Record<string, unknown>,
	fields: Record<string, FieldRule>
): ValidationResult {
	const errors: Record<string, string> = {};
	for (const [name, rule] of Object.entries(fields)) {
		const error = validateField(data[name], rule);
		if (error) errors[name] = error;
	}
	return { valid: Object.keys(errors).length === 0, errors };
}

export function getSupportedTypes(): string[] {
	return Object.keys(validators);
}

export function registerTypeValidator(
	type: string,
	validator: (value: unknown) => boolean | string
): void {
	validators[type] = validator;
}
