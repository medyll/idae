

import type {
  IdbqModel,
  TplCollectionName,  
} from "@medyll/idae-idbql";
import { IDbCollection } from "$lib/main/machine/IDbCollection";
import { MachineParserForge } from "$lib/main/machineParserForge";

export enum enumPrimitive {
  id = "id",
  any = "any",
  date = "date",
  datetime = "datetime",
  time = "time",
  text = "text",
  number = "number",
  boolean = "boolean",
  url = "url",
  email = "email",
  phone = "phone",
  password = "password",
}

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

  #idbCollectionsList: Record<string, IDbCollection> = {};

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
   * @return {IDbCollection} The IDbCollection instance.
   */
  collection(collection: TplCollectionName): IDbCollection {
    if (!this.#idbCollectionsList[collection]) {
      this.#idbCollectionsList[collection] = new IDbCollection(
        collection,
        this,
        this.model,
      );
    }
    return this.#idbCollectionsList[collection];
  }
 

}
