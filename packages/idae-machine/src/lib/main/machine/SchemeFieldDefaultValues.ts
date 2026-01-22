// Example: How to use SchemeFieldDefaultValues in a Svelte form
// (for documentation/demo, not for direct import)

/**
 * Example: Using SchemeFieldDefaultValues to get default values for a collection
 *
 * import { SchemeFieldDefaultValues } from '$lib/main/machine/SchemeFieldDefaultValues';
 *
 * // For a collection 'agents' with fields ['name', 'role', 'createdAt']
 * const defaults = SchemeFieldDefaultValues.getDefaults(['name', 'role', 'createdAt'], 'agents');
 * // defaults = { name: ..., role: ..., createdAt: ... }
 *
 * // In a Svelte form (pseudo-code):
 * let formData = { ...SchemeFieldDefaultValues.getDefaults(Object.keys(formFields), collection) };
 *
 * // When rendering the form, fields with no user value will use the default
 * <input name="name" bind:value={formData.name} />
 * <input name="role" bind:value={formData.role} />
 * <input name="createdAt" bind:value={formData.createdAt} />
 *
 * // To set or override a default globally:
 * SchemeFieldDefaultValues.setDefault('role', () => 'admin');
 *
 * // To set a default for a specific collection:
 * SchemeFieldDefaultValues.setDefault('role', () => 'user', 'agents');
 *
 * // To set multiple defaults at once:
 * SchemeFieldDefaultValues.setDefaults({ status: () => 'active', country: () => 'FR' });
 *
 * // To set multiple defaults for a collection:
 * SchemeFieldDefaultValues.setDefaults({ status: () => 'pending' }, 'orders');
 */

import type { TplCollectionName } from "@medyll/idae-idbql";


// Single class declaration with all static methods and properties
export class SchemeFieldDefaultValues {
  /**
   * Default value factories for all collections (global fields).
   * Each key is a field name, value is a function returning the default value.
   * @type {Record<string, () => any>}
   */
  static defaultFieldFactories: Record<string, () => any> = {
    createdAt: () => new Date(),
    updatedAt: () => new Date(),
    status: () => "draft",
    // Add more global defaults here
  };

  /**
   * Default value factories per collection.
   * Each key is a collection name, value is an object of field factories.
   * @type {Record<string, Record<string, () => any>>}
   */
  static defaultCollectionFactories: Record<string, Record<string, () => any>> = {
    // Example:
    // agents: {
    //   role: () => "user",
    // },
  };

  /**
   * Add or update a default value factory for a single field (global or collection-specific).
   * @param {string} field - The field name.
   * @param {() => any} factory - The factory function.
   * @param {TplCollectionName} [collectionName] - Optional collection name for specific default.
   */
  static setDefault(field: string, factory: () => any, collectionName?: TplCollectionName): void {
    if (collectionName) {
      if (!this.defaultCollectionFactories[collectionName]) {
        this.defaultCollectionFactories[collectionName] = {};
      }
      this.defaultCollectionFactories[collectionName][field] = factory;
    } else {
      this.defaultFieldFactories[field] = factory;
    }
  }

  /**
   * Add or update multiple default value factories at once (global or collection-specific).
   * @param {Record<string, () => any>} factories - Object of field:factory pairs.
   * @param {TplCollectionName} [collectionName] - Optional collection name for specific defaults.
   */
  static setDefaults(factories: Record<string, () => any>, collectionName?: TplCollectionName): void {
    if (collectionName) {
      if (!this.defaultCollectionFactories[collectionName]) {
        this.defaultCollectionFactories[collectionName] = {};
      }
      Object.assign(this.defaultCollectionFactories[collectionName], factories);
    } else {
      Object.assign(this.defaultFieldFactories, factories);
    }
  }

  /**
   * Get default values for a set of fields, using global and optionally collection-specific factories.
   * If collectionName is provided, collection-specific factories take priority over global ones.
   * If not, only global defaults are used.
   *
   * @param {string[]} fields - The list of field names.
   * @param {TplCollectionName} [collectionName] - Optional collection name for specific defaults.
   * @returns {Record<string, any>} An object with default values for each field.
   */
  static getDefaults(fields: string[], collectionName?: TplCollectionName): Record<string, any> {
    const result: Record<string, any> = {};
    const collectionDefaults = collectionName ? (this.defaultCollectionFactories[collectionName] || {}) : {};
    for (const field of fields) {
      if (collectionDefaults[field]) {
        result[field] = collectionDefaults[field]();
      } else if (this.defaultFieldFactories[field]) {
        result[field] = this.defaultFieldFactories[field]();
      }
      // else: no default
    }
    return result;
  }

  /**
   * Get the default value for a single field, using collection-specific or global factory.
   * @param {string} field - The field name.
   * @param {TplCollectionName} [collectionName] - Optional collection name for specific default.
   * @returns {any} The default value for the field, or undefined if none.
   */
  static getDefault(field: string, collectionName?: TplCollectionName): any {
    if (collectionName && this.defaultCollectionFactories[collectionName]?.[field]) {
      return this.defaultCollectionFactories[collectionName][field]();
    }
    if (this.defaultFieldFactories[field]) {
      return this.defaultFieldFactories[field]();
    }
    return undefined;
  }
}
