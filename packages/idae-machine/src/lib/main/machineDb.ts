/* 
    path: D:\boulot\python\wollama\src\lib\db\dbFields.ts
 */

import type {
  CollectionModel,
  IdbqModel,
  TplCollectionName,
  Tpl,
  TplFields,
} from "@medyll/idae-idbql";
import { IDbCollection } from "./machine/IDbCollection.js";
import { IDbError } from "$lib/main/machine/IDbError.js";
import type { IDbForge } from "./machineForge.js";
import { MachineForge } from "./machineForge.js";

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

export enum TplProperties {
  "private" = "private",
  "readonly" = "readonly",
  "required" = "required",
}

type CombineElements<T extends string, U extends string = T> = T extends any
  ? T | `${T} ${CombineElements<Exclude<U, T>>}`
  : never;
type CombinedArgs = CombineElements<TplProperties>;

type IdbObjectify<T extends string = "number"> =
  | `array-of-${T}`
  | `object-${T}`;

// make a method parse primitive types
export type IdDbPrimitive<T = {}> =
  | keyof typeof enumPrimitive
  | `text-${"tiny" | "short" | "medium" | "long" | "area"}`
  | `${string}.${string}`
  | `fk-${string}.${string}`;

export type IDbObjectPrimitive = IdbObjectify<IdDbPrimitive>;
export type IDbFk = `fk-${string}.${string}`;
export type IDbFkObject = IdbObjectify<IDbFk>;
export type IDbTypes = IdDbPrimitive | IDbObjectPrimitive | IDbFk | IDbFkObject;

export type IDBArgumentsTypes = `${IDbTypes}(${CombinedArgs})`;
const a: IDBArgumentsTypes = "any(private required readonly)";
// final types all together
export type IDbFieldRules = IDBArgumentsTypes | IDbTypes;
export type IDbFieldType = IDBArgumentsTypes | IDbTypes;

export type IDbForgeArgs = keyof typeof TplProperties;
/**
 * Central class for parsing, introspecting, and extracting metadata from the database schema.
 * Provides methods to access collections, templates, fields, foreign keys, and type information.
 * Used for dynamic UI generation, validation, and schema-driven logic.
 */
export class MachineDb {
  /**
   * The database model (schema) used for introspection.
   */
  model: IdbqModel;

  machineForge: MachineForge = new MachineForge();

  #idbCollectionsList: Record<string, IDbCollection> = {};

  /**
   * Create a new IDbBase instance.
   * @param model  Custom model to use
   */
  constructor(model: IdbqModel) {
    this.model = model;
    this.machineForge = new MachineForge();
  }

  /**
   * Get an IDbCollection instance for a collection name.
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

 
  reverseFks(targetCollection: TplCollectionName): Record<string, any> {
    const result: Record<string, any> = {};
    Object.entries(this.model).forEach(([collectionName, collectionModel]) => {
      const template = (collectionModel as CollectionModel).template;
      if (template && template.fks) {
        Object.entries(template.fks).forEach(([fkName, fkConfig]) => {
          if (fkConfig?.code === targetCollection) {
            if (!result[collectionName]) {
              result[collectionName] = {};
            }
            result[collectionName][fkName] = fkConfig;
          }
        });
      }
    });
    return result;
  }

  /**
   * Parse all fields of a given collection.
   * @deprecated use IDbCollection.parseRawCollection
   */
  parseRawCollection(
    collection: TplCollectionName,
  ): Record<string, IDbForge | undefined> | undefined {
    const fields = this.collection(collection).template.fields;
    if (!fields) return;
    const out: Record<string, IDbForge | undefined> = {};
    Object.keys(fields).forEach((fieldName) => {
      const fieldType = fields[fieldName];
      if (fieldType) {
        out[fieldName] = this.parseCollectionFieldName(collection, fieldName);
      }
    });
    return out;
  }

  /**
   * Parse a single field of a collection and return its IDbForge metadata.
   * @deprecated use IDbCollection.parseCollectionFieldName
   */
  parseCollectionFieldName(
    collection: TplCollectionName,
    fieldName: keyof TplFields,
  ): IDbForge | undefined {
    const field = this.collection(collection).getFieldRule(fieldName);
    if (!field) {
      IDbError.throwError(
        `Field ${fieldName} not found in collection ${collection}`,
        "FIELD_NOT_FOUND",
      );
      return undefined;
    }
    const array = this.machineForge.testIs("array", field);
    const object = this.machineForge.testIs("object", field);
    const fk = this.machineForge.testIs("fk", field);
    const primitive = this.machineForge.testIs("primitive", field);
    const fieldType = array ?? object ?? fk ?? primitive;

    return this.machineForge.forge({ collection, fieldName, ...fieldType });
  }
}
