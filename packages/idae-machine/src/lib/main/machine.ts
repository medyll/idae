
import { MachineDb } from "$lib/main/machineDb.js";
import { createIdbqDb, type IdbqModel } from "@medyll/idae-idbql";

/**
 * @class Machine
 * @role Main entry point for managing the IDBQL connection and centralized data access.
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
  _machineDb!: MachineDb;

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
   * @role Constructor
   * @param {string=} dbName The name of the database.
   * @param {number=} version The schema version number.
   * @param {IdbqModel=} model The IDBQL data model.
   */
  constructor(dbName?: string, version?: number, model?: IdbqModel) {
    this._dbName = dbName ?? "";
    this._version = version ?? 1;
    this._model = model ?? undefined;
  }

  /**
   * Initialize the machine with configuration parameters.
   * @role Initializer
   * @param {{ dbName?: string; version?: number; model: IdbqModel }} [options] Optional parameters to set dbName, version, and model.
   * @return {void}
   */
  init(options?: { dbName?: string; version?: number; model: IdbqModel }) {
    this._dbName = options?.dbName ?? this._dbName;
    this._version = options?.version ?? this._version;
    this._model = options?.model ?? this._model;
  }

  /**
   * Start the machine: initializes collections and the IDBQL connection.
   * Call this after constructing the Machine to set up the database and collections.
   * @role Initializer
   * @return {void}
   */
  start(): void {
    this.createCollections();
    this.createStore();
  }

  /**
   * Internal: Creates the collections logic using the provided data model.
   * Throws an error if the model is not defined.
   * @role Internal
   * @private
   * @return {void}
   */
  private createCollections(): void {
    if (!this._model) {
      throw new Error("Data model is not defined");
    }
    this._machineDb = new MachineDb(this._model);
  }

  /**
   * Internal: Creates the IDBQL store and initializes database connections.
   * Throws an error if model, dbName, or version is missing.
   * @role Internal
   * @private
   * @return {void}
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

    console.log("Machine started with DB:", this._dbName, "Version:", this._version);
    console.log("IDBQL State Instance:", this._idbqlState);
  }

  /**
   * Get the MachineDb (schema logic) instance.
   * @role Accessor
   * @deprecated Use logic instead.
   * @return {MachineDb} The schema and collection logic instance.
   */
  get collections(): MachineDb {
    return this._machineDb;
  }

  /**
   * Get the IDbBase (schema logic) instance.
   * Recommended accessor for schema and collection logic.
   * @role Accessor
   * @return {MachineDb} The schema and collection logic instance.
   */
  get logic(): MachineDb {
    return this._machineDb;
  }

  /**
   * Get the IDBQL (readonly) instance.
   * Use for read-only access to collections.
   * @role Accessor
   * @return {ReturnType<ReturnType<typeof createIdbqDb>["create"]>["idbql"] | undefined} The readonly IDBQL instance.
   */
  get idbql(): ReturnType<ReturnType<typeof createIdbqDb>["create"]>["idbql"] | undefined {
    return this._idbql;
  }

  /**
   * Get the IDBQL (stateful) instance.
   * Previously called idbqlState; use for stateful operations.
   * @role Accessor
   * @return {ReturnType<ReturnType<typeof createIdbqDb>["create"]>["idbqlState"]} The stateful IDBQL instance.
   */
  get store(): ReturnType<ReturnType<typeof createIdbqDb>["create"]>["idbqlState"] {
    return this._idbqlState;
  }

  /**
   * Direct getter for idbqlState (for test compatibility).
   * Returns the stateful IDBQL instance.
   * @role Accessor
   * @deprecated Use store instead.
   * @return {ReturnType<ReturnType<typeof createIdbqDb>["create"]>["idbqlState"]} The stateful IDBQL instance.
   */
  get idbqlState(): ReturnType<ReturnType<typeof createIdbqDb>["create"]>["idbqlState"] {
    return this._idbqlState;
  }

  /**
   * Get the IndexedDB (core) instance.
   * @role Accessor
   * @deprecated Use IDBQL accessors instead.
   * @return {ReturnType<ReturnType<typeof createIdbqDb>["create"]>["idbDatabase"] | undefined} The IndexedDB instance.
   */
  get indexedb(): ReturnType<ReturnType<typeof createIdbqDb>["create"]>["idbDatabase"] | undefined {
    return this._idbDatabase;
  }

  /**
   * Get the IDBQL data model instance.
   * Returns the current IDBQL model used by the machine.
   * @role Accessor
   * @return {ReturnType<ReturnType<typeof createIdbqDb>["create"]>["idbqModel"] | undefined} The IDBQL model instance.
   */
  get idbqModel(): ReturnType<ReturnType<typeof createIdbqDb>["create"]>["idbqModel"] | undefined {
    return this._idbqModel;
  }
}

export const machine = new Machine();
