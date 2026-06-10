import type { TplCollectionName } from '$lib/types/index.js';
import type { MachineModel } from '$lib/types/index.js';
import { MachineScheme } from '$lib/main/machine/MachineScheme.js';
import { MachineParserForge } from '$lib/main/machineParserForge.js';

/**
 * @class MachineDb
 * @role Central class for parsing, introspecting, and extracting metadata from the database schema. Provides methods to access collections, templates, fields, foreign keys, and type information. Used for dynamic UI generation, validation, and schema-driven logic.
 */
export class MachineDb {
	/**
	 * The database model (schema) used for introspection.
	 */
	model:               MachineModel;
	machineForge:        MachineParserForge = new MachineParserForge();
	#idbCollectionsList: Record<string, MachineScheme> = {};

	/**
	 * Create a new MachineDb instance.
	 * @role Constructor
	 * @param {IdbqModel} model Custom model to use (typically from buildEffectiveModel).
	 */
	constructor(model: MachineModel) {
		this.model = model;
		this.machineForge = new MachineParserForge();
	}

	/**
	 * List all collections defined in the model as MachineScheme instances.
	 * @role Schema introspection
	 * @return {MachineScheme[]} A list of MachineScheme instances.
	 */
	collections(): MachineScheme[] {
		const list: MachineScheme[] = [];
		for (const name of Object.keys(this.model)) {
			list.push(this.collection(name as TplCollectionName));
		}
		return list
	}

	/**
	 * Get an IDbCollection instance for a collection name.
	 * @role Collection accessor
	 * @param {TplCollectionName} collection The collection name.
	 * @return {MachineScheme} The IDbCollection instance.
	 */
	collection(collection: TplCollectionName): MachineScheme {
		if (!this.#idbCollectionsList[collection]) {
			this.#idbCollectionsList[collection] = new MachineScheme(collection, this, this.model);
		}
		return this.#idbCollectionsList[collection];
	}

	/**
	 * Non-throwing variant of `collection()`. Returns null when the collection is not in the model.
	 * Use in components/UI layers that must not throw on unknown collection names.
	 */
	collectionOr<F>(collection: string, fallback: F): MachineScheme | F {
		try {
			return this.collection(collection as TplCollectionName);
		} catch {
			return fallback;
		}
	}

	/**
	 * Return all unique `base` module names declared in the model.
	 * Used by the server to know which MongoDB databases to create.
	 * e.g. ['machine_base', 'machine_app']
	 */
	getBaseModules(): string[] {
		const bases = new Set<string>();
		for (const col of Object.values(this.model)) {
			const base = col.base;
			if (base) bases.add(base);
		}
		return [...bases];
	}
}
