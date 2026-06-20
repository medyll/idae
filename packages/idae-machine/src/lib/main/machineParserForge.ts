import type {
	TplCollectionName,
	TplFieldRules,
	TplFieldType,
	TplFields,
	MachineFieldDef,
	IDbForge
} from '$lib/types/index.js';
import { MachineError } from './machine/MachineError.js';

/**
 * Utility class for parsing and constructing database field definitions (IDbForge).
 * Provides methods to analyze field rules and extract type information for schema generation.
 */

export class MachineParserForge {

	/**
	 * Create a new MachineParserForge instance.
	 */
	constructor() {}

	/**
	 * Test if a field rule matches a specific type (array, object, fk, primitive).
	 * Accepts both legacy string rules ('text-long (required)') and new object rules ({ type: 'text', required: true }).
	 * @param what - The type to test for ("array", "object", "fk", "primitive").
	 * @param fieldRule - The field rule (string or object) to analyze.
	 * @returns Partial IDbForge object if the rule matches, otherwise undefined.
	 */
	testIs(
		what: 'array' | 'object' | 'fk' | 'primitive',
		fieldRule: TplFieldRules | string
	): Partial<IDbForge> | undefined {
		// New world: object-based field rule
		if (typeof fieldRule === 'object' && fieldRule !== null) {
			return this.#fromObjectRule(what, fieldRule);
		}
		// Legacy: string-based field rule
		const typeMappings = {
			fk:        'fk-',
			array:     'array-of-',
			object:    'object-',
			primitive: ''
		};
		const prefix = typeMappings[what];
		// For primitive, ensure it does not start with any other type prefix
		if (what === 'primitive') {
			if (
				!fieldRule.startsWith('array-of-') &&
				!fieldRule.startsWith('object-') &&
				!fieldRule.startsWith('fk-')
			) {
				return this.is(what, fieldRule);
			}
			return undefined;
		}
		// For other types, check if the rule starts with the expected prefix
		if (fieldRule.startsWith(prefix)) {
			return this.is(what, fieldRule);
		}
		return undefined;
	}

	/**
	 * Parse a new-world object field rule into IDbForge format.
	 * Only returns a value when `what` matches the actual type of the rule.
	 */
	#fromObjectRule(
		what: 'array' | 'object' | 'fk' | 'primitive',
		rule: MachineFieldDef
	): Partial<IDbForge> | undefined {
		const type = rule.type;
		const isArray     = type.startsWith('array-of-');
		const isObject    = type.startsWith('object-');
		const isFk        = type.startsWith('fk-');
		const isPrimitive = !isArray && !isObject && !isFk;

		const matches: Record<string, boolean> = {
			array: isArray, object: isObject, fk: isFk, primitive: isPrimitive
		};
		if (!matches[what]) return undefined;

		const fieldArgs = this.#argsFromObject(rule);
		// Pass through any extra display/forge options (presets, preset, free, maxSize, etc.).
		// `group` is scheme metadata, not part of IDbForge, so it's stripped along with the
		// other known base keys.
		const { type: _t, required: _req, readonly: _ro, private: _priv, group: _grp, ...extras } = rule;
		return {
			fieldType: type,
			fieldArgs,
			is:        what,
			...extras,
			...(type === 'image' ? { accept: 'image/*' } : {}),
		};
	}

	/**
	 * Extract fieldArgs array from an object rule's boolean flags.
	 */
	#argsFromObject(rule: MachineFieldDef): string[] | undefined {
		const args: string[] = [];
		if (rule.required) args.push('required');
		if (rule.readonly) args.push('readonly');
		if (rule.private)  args.push('private');
		return args.length ? args : undefined;
	}

	/**
	 * Returns a partial IDbForge object for the given type and field rule.
	 * @param what - The type to extract ("array", "object", "fk", "primitive").
	 * @param fieldRule - The field rule string to analyze.
	 * @returns Partial IDbForge object with extracted type info.
	 */
	is(
		what: 'array' | 'object' | 'fk' | 'primitive',
		fieldRule: string
	): Partial<IDbForge> {
		return this.extract(what, fieldRule);
	}

	/**
	 * Extracts type, rule, and argument information from a string field rule.
	 * Only called after object rules are handled by #fromObjectRule.
	 */
	extract(
		type: 'array' | 'object' | 'fk' | 'primitive',
		fieldRule: string
	): Partial<IDbForge> {
		/**
		 * Helper to extract the substring after a given pattern, before any arguments.
		 * @param pattern - The prefix pattern to remove.
		 * @param source - The field rule string.
		 * @returns The substring after the pattern.
		 */
		function extractAfter(pattern: string, source: string): string {
			const reg = source?.split('(')?.[0];
			const after = reg.split(pattern)[1];
			return (after?.split('(')?.[0]?.trim() ?? '') as string;
		}

		/**
		 * Helper to extract the main type and argument list from a field rule string.
		 * @param source - The field rule string.
		 * @returns Object with the main type (piece) and argument array (args).
		 */
		function extractArgs(source: string): { piece: string; args?: string[] } {
			const [piece, remaining] = source.split('(');
			if (!remaining) return { piece: piece.trim() };
			let central: string | undefined;
			if (remaining !== undefined) {
				[central] = remaining.split(')');
			}
			const args = central
				? central
						.split(' ')
						.map((s) => s.trim())
						.filter(Boolean)
				: undefined;
			return { piece: piece.trim(), args };
		}

		const extractedArgs = extractArgs(fieldRule);
		let fieldType: TplFieldType | undefined;
		const fieldArgs = extractedArgs?.args;
		switch (type) {
			case 'array':
				fieldType = extractAfter('array-of-', fieldRule);
				break;
			case 'object':
				fieldType = extractAfter('object-', fieldRule);
				break;
			case 'fk':
				fieldType = 'fk-' + extractAfter('fk-', fieldRule);
				break;
			case 'primitive':
				fieldType = extractedArgs?.piece;
				break;
		}
		const result: Partial<IDbForge> = {
			fieldType,
			fieldArgs,
			is: type
		};
		return result;
	}

	/**
	 * Constructs an IDbForge object from its components.
	 * @param params - The components of the IDbForge object.
	 * @returns A complete IDbForge object.
	 */
	forge(input: IDbForge): IDbForge {
		return { ...input };
	}
}
