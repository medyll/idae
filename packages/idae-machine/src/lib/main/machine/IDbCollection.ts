import type {
  TplCollectionName,
  Tpl,
  IdbqModel,
  TplFields,
  IDbForge,
  CollectionModel,
  TplFieldRules,
} from "@medyll/idae-idbql";
import { MachineDb } from "$lib/main/machineDb.js";
import { MachineParserForge } from "$lib/main/machineParserForge.js";
import { IDbFormValidate } from "$lib/main/machine/IDbFormValidate.js";
import { IDbCollectionFieldForge } from "$lib/main/machine/IDbCollectionFieldForge.js";
import { IDbCollectionFieldValues } from "$lib/main/machine/IDbCollectionFieldValues.js";
import { IDbCollectionValues } from "$lib/main/machine/IDbCollectionValues.js";
import { IDbError } from "$lib/main/machine/IDbError.js";

 /**
  * @class IDbCollection
  * @role Provides schema and field utilities for a collection, including metadata, formatting, and field parsing.
  */
 export class IDbCollection {
  /** The collection name. */
  collection: TplCollectionName;
  /** The collection template. */
  #template: Tpl;
  /** The MachineDb instance. */
  #machineDb: MachineDb;
  /** The collection model. */
  #model: IdbqModel["Collection"];

  #machineForge: MachineDb["machineForge"];

  /**
   * Create a new IDbCollection instance.
   * @role Constructor
   * @param {TplCollectionName} collectionName The collection name.
   * @param {MachineDb} idbBase The MachineDb instance.
   * @param {IdbqModel} model The IdbqModel instance.
   */
  constructor(
    collectionName: TplCollectionName,
    idbBase: MachineDb,
    model: IdbqModel,
  ) {
    this.collection = collectionName;
    this.#machineDb = idbBase;
    this.#model = model[String(collectionName)];
    this.#template = this.#model["template"] as Tpl;
    this.#machineForge = new MachineParserForge();
  }

  /**
   * Get the collection model.
   * @role Accessor
   * @return {IdbqModel["Collection"]} The collection model.
   */
  get model() {
    return this.#model;
  }

  /**
   * Get the collection template.
   * @role Accessor
   * @return {Tpl} The collection template.
   */
  get template(): Tpl {
    return this.#template;
  }

  /**
   * Get a form validator for this collection.
   * @role Utility
   * @return {IDbFormValidate} The form validator instance.
   */
  get validator(): IDbFormValidate {
    return new IDbFormValidate(this.collection, this.#machineDb);
  }

  /**
   * Get the field rule for a given field name.
   * @role Field rule accessor
   * @param {keyof TplFields} fieldName The field name.
   * @return {TplFieldRules | undefined} The field rule or undefined.
   */
  getFieldRule(fieldName: keyof TplFields) {
    return this.#template.fields[String(fieldName)] as
      | TplFieldRules
      | undefined;
  }

  /**
   * Get a new IDbCollectionValues instance for this collection.
   * @role Utility
   * @return {IDbCollectionValues} The collection values instance.
   */
  get collectionValues() {
    return new IDbCollectionValues(this.collection, this.#machineDb);
  }

 
  /**
   * Get a field forge instance for a specific field and data.
   * @role Field forge factory
   * @template T
   * @param {keyof T} fieldName The field name.
   * @param {T} data The data object.
   * @return {IDbCollectionFieldForge<T>} The field forge instance.
   */
  fieldForge<T extends Record<string, any>>(
    fieldName: keyof T,
    data: T,
  ): IDbCollectionFieldForge<T> {
    return new IDbCollectionFieldForge<T>(
      this.collection,
      fieldName,
      data,
      this.collectionValues ,
    );
  }

  /**
   * Parse all fields of a given collection.
   * @role Field parsing
   * @return {Record<string, IDbForge | undefined> | undefined} All parsed fields or undefined.
   */
  parseRawCollection(): Record<string, IDbForge | undefined> | undefined {
    const fields = this.#template.fields;
    if (!fields) return;
    const out: Record<string, IDbForge | undefined> = {};
    Object.keys(fields).forEach((fieldName) => {
      const fieldType = fields[fieldName];
      if (fieldType) {
        out[fieldName] = this.parseCollectionFieldName(fieldName);
      }
    });
    return out;
  }

  /**
   * Parse a single field of a collection and return its IDbForge metadata.
   * @role Field parsing
   * @param {keyof TplFields} fieldName The field name.
   * @return {IDbForge | undefined} The field metadata or undefined.
   */
  parseCollectionFieldName(fieldName: keyof TplFields): IDbForge | undefined {
    const field = this.getFieldRule(fieldName);
    if (!field) {
      IDbError.throwError(
        `Field ${fieldName} not found in collection ${this.collection}`,
        "FIELD_NOT_FOUND",
      );
      return undefined;
    }
    const array = this.#machineForge.testIs("array", field);
    const object = this.#machineForge.testIs("object", field);
    const fk = this.#machineForge.testIs("fk", field);
    const primitive = this.#machineForge.testIs("primitive", field);
    const fieldType = array ?? object ?? fk ?? primitive;

     return this.#machineForge.forge({ collection: this.collection, fieldName, ...(fieldType ?? {}), is: fieldType?.is ?? undefined,});
  }

  /**
   * Get all foreign keys for this collection.
   * @role Foreign key accessor
   * @return {{ [collection: string]: Tpl }} Foreign key collections.
   */
  fks(): { [collection: string]: Tpl } {
    const fks = this.#template?.fks;
    const out: Record<string, IDbForge | undefined> = {};
    if (fks) {
      Object.keys(fks).forEach((collection: TplCollectionName) => {
        out[collection] = this.parseRawCollection(
          collection as TplCollectionName,
        );
      });
    }
    return out;
  }

  /**
   * Get all reverse foreign keys for this collection.
   * @role Reverse foreign key accessor
   * @return {Record<string, any>} Reverse foreign key collections.
   */
  reverseFks(): Record<string, any> {
    const result: Record<string, any> = {};
    Object.entries(this.model).forEach(([collectionName, collectionModel]) => {
      const template = (collectionModel as CollectionModel).template;
      if (template && template.fks) {
        Object.entries(template.fks).forEach(([fkName, fkConfig]) => {
          if (fkConfig?.code === this.collection) {
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
}
