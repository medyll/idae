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

import { IDbCollections } from '$lib/db/dbFields.js';
import { createIdbqDb, type IdbqModel } from '@medyll/idae-idbql';

/**
 * Machine: main entry point for managing the IDBQL connection and centralized data access.
 */
export class Machine {
  /**

   * IDBQL (readonly collections instance)
   */
  _idbql!: ReturnType<ReturnType<typeof createIdbqDb>["create"]>["idbql"] | undefined;

  /**
   * IDBQL (stateful collections instance)
   */
  _idbqlState!: ReturnType<ReturnType<typeof createIdbqDb>["create"]>["idbqlState"] ;

  /**
   * Direct access to IndexedDB (core)
   */
  _idbDatabase!: ReturnType<ReturnType<typeof createIdbqDb>["create"]>["idbDatabase"] | undefined;

  /**
   * IDBQL data model
   */
  _idbqModel!: ReturnType<ReturnType<typeof createIdbqDb>["create"]>["idbqModel"] | undefined;

  /**
   * Centralized access to schema and collection logic
   */
  _collections!: IDbCollections ;

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
  constructor() {
  }
  
  init(options?: { dbName?: string; version?: number; model?: IdbqModel }) {
    this._dbName = options?.dbName ?? this._dbName;
    this._version = options?.version ?? this._version;
    this._model = options?.model ?? this._model;
  }

  /**
   * Start the machine: initialize collections and IDBQL connection.
   */
  start() {
    this.createCollections();
    this.createStore();
  }

  private createCollections() {
    if (!this._model) {
      throw new Error('Data model is not defined');
    }
    this._collections = new IDbCollections(this._model);
  }


  private createStore() {
    if (!this._model || !this._dbName || !this._version) {
        throw new Error('Model, dbName, or version is not defined');
    }
    const idbqStore = createIdbqDb(this._model, this._version);
    const { idbql, idbqlState, idbDatabase, idbqModel } = idbqStore.create(this._dbName);
    this._idbql = idbql;
    this._idbqlState = idbqlState;
    this._idbDatabase = idbDatabase;
    this._idbqModel = idbqModel;
  }


  /**
   * Get the IDbCollections (schema logic) instance
   */
  get collections() {
    return this._collections;
  }

  /**
   * IDBQL (readonly) instance
   */
  get idbql() {
    return this._idbql;
  }

  /**
   * IDBQL (stateful) instance
   */
  get store() {
    return this._idbqlState;
  }

  /**
   * IndexedDB (core) instance
   * @deprecated
   */
  get indexedb() {
    return this._idbDatabase;
  }

  /**
   * IDBQL data model instance
   */
  get idbqModel() {
    return this._idbqModel;
  }
}

export const machine = new Machine();