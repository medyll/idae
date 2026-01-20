

import type {
  IdbqModel,
  TplCollectionName,  
} from "@medyll/idae-idbql";
import { MachineScheme } from "$lib/main/machine/MachineScheme.js";
import { MachineParserForge } from "$lib/main/machineParserForge.js";



/**
 * @class MachineDb
 * @role Central class for parsing, introspecting, and extracting metadata from the database schema. Provides methods to access collections, templates, fields, foreign keys, and type information. Used for dynamic UI generation, validation, and schema-driven logic.
 */
export class MachineDb {
  /**
   * The database model (schema) used for introspection.
   */
  model: IdbqModel;

  machineForge: MachineParserForge = new MachineParserForge();

  #idbCollectionsList: Record<string, MachineScheme> = {};

  /**
   * Create a new MachineDb instance.
   * @role Constructor
   * @param {IdbqModel} model Custom model to use.
   */
  constructor(model: IdbqModel) {
    this.model = model;
    this.machineForge = new MachineParserForge();
  }

  /**
   * Get an IDbCollection instance for a collection name.
   * @role Collection accessor
   * @param {TplCollectionName} collection The collection name.
   * @return {MachineScheme} The IDbCollection instance.
   */
  collection(collection: TplCollectionName): MachineScheme {
    if (!this.#idbCollectionsList[collection]) {
      this.#idbCollectionsList[collection] = new MachineScheme(
        collection,
        this,
        this.model,
      );
    }
    return this.#idbCollectionsList[collection];
  }
 

}
