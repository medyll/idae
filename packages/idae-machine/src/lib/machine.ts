/**
 * Example usage:
 *
 * import { Machine } from './machine.js';
 *
 * // Create a new Machine instance with default parameters
 * const machine = new Machine();
 *
 * // Start the machine (initialize collections and IDBQL connection)
 * machine.start();
 *
 * // Access collections (schema logic)
 * const collections = machine.getCollections();
 *
 * // Access IDBQL (readonly)
 * const idbql = machine.getIdbql();
 *
 * // Access IDBQL (stateful)
 * const idbqlState = machine.getIdbqlState();
 *
 * // Access IndexedDB core
 * const db = machine.getIdbDatabase();
 *
 * // Access the IDBQL data model
 * const model = machine.getIdbqModel();
 */
import { schemeModel } from './db/dbSchema.js';
import { IDbCollections } from './db/dbFields.js';
import { createIdbqDb } from '@medyll/idae-idbql';

/**
 * Machine: main entry point for managing the IDBQL connection and centralized data access.
 */
export class Machine {
  /**

   * IDBQL (readonly collections instance)
   */
  idbql: ReturnType<ReturnType<typeof createIdbqDb>["create"]>["idbql"] | undefined;

  /**
   * IDBQL (stateful collections instance)
   */
  idbqlState: ReturnType<ReturnType<typeof createIdbqDb>["create"]>["idbqlState"] | undefined;

  /**
   * Direct access to IndexedDB (core)
   */
  idbDatabase: ReturnType<ReturnType<typeof createIdbqDb>["create"]>["idbDatabase"] | undefined;

  /**
   * IDBQL data model
   */
  idbqModel: ReturnType<ReturnType<typeof createIdbqDb>["create"]>["idbqModel"] | undefined;

  /**
   * Centralized access to schema and collection logic
   */
  collections: IDbCollections | undefined;

  /**
   * Database name
   */
  dbName: string;

  /**
   * Schema version
   */
  version: number;

  /**
   * Data model
   */
  model: any;

  /**
   * Main constructor
   * @param dbName Database name (default: 'idae-machine')
   * @param version Schema version (default: 1)
   * @param model Data model (default: schemeModel)
   */
  constructor(dbName = 'idae-machine', version = 1, model = schemeModel) {
    this.dbName = dbName;
    this.version = version;
    this.model = model;
    this.collections = undefined;
    this.idbql = undefined;
    this.idbqlState = undefined;
    this.idbDatabase = undefined;
    this.idbqModel = undefined;
  }

  /**
   * Start the machine: initialize collections and IDBQL connection.
   * @param options Optional overrides: { dbName, version, model }
   */
  start(options?: { dbName?: string; version?: number; model?: any }) {
    const dbName = options?.dbName ?? this.dbName;
    const version = options?.version ?? this.version;
    const model = options?.model ?? this.model;
    this.collections = new IDbCollections(model);
    const idbqStore = createIdbqDb(model, version);
    const { idbql, idbqlState, idbDatabase, idbqModel } = idbqStore.create(dbName);
    this.idbql = idbql;
    this.idbqlState = idbqlState;
    this.idbDatabase = idbDatabase;
    this.idbqModel = idbqModel;
  }

  /**
   * Get the IDbCollections (schema logic) instance
   */
  getCollections() {
    return this.collections;
  }

  /**
   * Get the IDBQL (readonly) instance
   */
  getIdbql() {
    return this.idbql;
  }

  /**
   * Get the IDBQL (stateful) instance
   */
  getIdbqlState() {
    return this.idbqlState;
  }

  /**
   * Get the IndexedDB (core) instance
   */
  getIdbDatabase() {
    return this.idbDatabase;
  }

  /**
   * Get the IDBQL data model instance
   */
  getIdbqModel() {
    return this.idbqModel;
  }
}
