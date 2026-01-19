/**
 * Example usage:
 *
 * import { Machine } from './machine.js';
 *
 * // Create a new Machine instance with default parameters
 * const machine = new Machine( 'example-db', 1, { collections: {} });
 *
 * // Start the machine (initialize collections and IDBQL connection)
 * machine.start();
 *
 * // Access collections (schema logic)
 * const collections = machine.collections;
 *
 * // Access IDBQL (readonly)
 * const idbql = machine.idbql;
 *
 * // Access IDBQL (stateful)
 * const idbqlState = machine.idbqlState;
 *
 * // Access IndexedDB core
 * const db = machine.indexedb;
 *
 * // Access the IDBQL data model
 * const model = machine.idbqModel;
 */

import { MachineDb } from "$lib/main/machineDb.js";
import { createIdbqDb, type IdbqModel } from "@medyll/idae-idbql";

/**
 * Machine: main entry point for managing the IDBQL connection and centralized data access.
 */
export class Machine {
  /**
   * IDBQL (readonly collections instance)
   */
  _idbql!:
    | ReturnType<ReturnType<typeof createIdbqDb>["create"]>["idbql"]
    | undefined;

  /**
   * IDBQL (stateful collections instance)
   */
  _idbqlState!: ReturnType<
    ReturnType<typeof createIdbqDb>["create"]
  >["idbqlState"];

  /**
   * Direct access to IndexedDB (core)
   */
  _idbDatabase!:
    | ReturnType<ReturnType<typeof createIdbqDb>["create"]>["idbDatabase"]
    | undefined;

  /**
   * IDBQL data model
   */
  _idbqModel!:
    | ReturnType<ReturnType<typeof createIdbqDb>["create"]>["idbqModel"]
    | undefined;

  /**
   * Centralized access to schema and collection logic
   */
  _idbbase!: MachineDb;

  /**
   * Database name
   */
  _dbName!: string;

  /**
   * Schema version
   */
  _version!: number;

  /**
   * Data model
   */
  _model!: IdbqModel;

  /**
   * Main constructor
   */
  constructor(dbName?: string, version?: number, model?: IdbqModel) {
    this._dbName = dbName ?? "";
    this._version = version ?? 1;
    this._model = model ?? undefined;
  }

  /**
   * Initialize the machine with configuration parameters.
   *
   * @param {Object} [options] - Optional parameters to set dbName, version, and model.
   * @param {string} [options.dbName] - The name of the database.
   * @param {number} [options.version] - The schema version number.
   * @param {IdbqModel} [options.model] - The IDBQL data model.
   */
  init(options?: { dbName?: string; version?: number; model: IdbqModel }) {
    this._dbName = options?.dbName ?? this._dbName;
    this._version = options?.version ?? this._version;
    this._model = options?.model ?? this._model;
  }

  /**
   * Start the machine: initializes collections and the IDBQL connection.
   * Call this after constructing the Machine to set up the database and collections.
   *
   * @returns {void}
   */
  start(): void {
    this.createCollections();
    this.createStore();
  }

  /**
   * Internal: Creates the collections logic using the provided data model.
   * Throws an error if the model is not defined.
   *
   * @private
   * @returns {void}
   */
  private createCollections(): void {
    if (!this._model) {
      throw new Error("Data model is not defined");
    }
    this._idbbase = new MachineDb(this._model);
  }

  /**
   * Internal: Creates the IDBQL store and initializes database connections.
   * Throws an error if model, dbName, or version is missing.
   *
   * @private
   * @returns {void}
   */
  private createStore(): void {
    if (!this._model || !this._dbName || !this._version) {
      throw new Error("Model, dbName, or version is not defined");
    }
    const idbqStore = createIdbqDb(this._model, this._version);
    const { idbql, idbqlState, idbDatabase, idbqModel } = idbqStore.create(
      this._dbName,
    );
    this._idbql = idbql;
    this._idbqlState = idbqlState;
    this._idbDatabase = idbDatabase;
    this._idbqModel = idbqModel;
  }

  /**
   * Get the IDbBase (schema logic) instance.
   *
   * @deprecated Use logic instead.
   * @returns {MachineDb} The schema and collection logic instance.
   */
  get collections(): MachineDb {
    return this._idbbase;
  }

  /**
   * Get the IDbBase (schema logic) instance.
   * Recommended accessor for schema and collection logic.
   *
   * @returns {MachineDb} The schema and collection logic instance.
   */
  get logic(): MachineDb {
    return this._idbbase;
  }

  /**
   * Get the IDBQL (readonly) instance.
   * Use for read-only access to collections.
   *
   * @returns {ReturnType<ReturnType<typeof createIdbqDb>["create"]>["idbql"] | undefined}
   */
  get idbql(): ReturnType<ReturnType<typeof createIdbqDb>["create"]>["idbql"] | undefined {
    return this._idbql;
  }

  /**
   * Get the IDBQL (stateful) instance.
   * Previously called idbqlState; use for stateful operations.
   *
   * @returns {ReturnType<ReturnType<typeof createIdbqDb>["create"]>["idbqlState"]}
   */
  get store(): ReturnType<ReturnType<typeof createIdbqDb>["create"]>["idbqlState"] {
    return this._idbqlState;
  }

  /**
   * Direct getter for idbqlState (for test compatibility).
   * Returns the stateful IDBQL instance.
   *
   * @returns {ReturnType<ReturnType<typeof createIdbqDb>["create"]>["idbqlState"]}
   */
  get idbqlState(): ReturnType<ReturnType<typeof createIdbqDb>["create"]>["idbqlState"] {
    return this._idbqlState;
  }

  /**
   * Get the IndexedDB (core) instance.
   *
   * @deprecated Use IDBQL accessors instead.
   * @returns {ReturnType<ReturnType<typeof createIdbqDb>["create"]>["idbDatabase"] | undefined}
   */
  get indexedb(): ReturnType<ReturnType<typeof createIdbqDb>["create"]>["idbDatabase"] | undefined {
    return this._idbDatabase;
  }

  /**
   * Get the IDBQL data model instance.
   * Returns the current IDBQL model used by the machine.
   *
   * @returns {ReturnType<ReturnType<typeof createIdbqDb>["create"]>["idbqModel"] | undefined}
   */
  get idbqModel(): ReturnType<ReturnType<typeof createIdbqDb>["create"]>["idbqModel"] | undefined {
    return this._idbqModel;
  }
}

export const machine = new Machine();
