import { MachineError } from './MachineError.js';
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
import { MachineSchemeFieldForge } from "$lib/main/machine/MachineSchemeFieldForge.js";
import { MachineSchemeValues } from "$lib/main/machine/MachineSchemeValues.js";
import { MachineSchemeValidate } from "$lib/main/machine/MachineSchemeValidate.js";
import { MachineSchemeField } from "$lib/main/machine/MachineSchemeField.js";

/**
 * @class MachineScheme
 * @role Provides schema and field utilities for a collection, including metadata, formatting, and field parsing.
 */
export class MachineScheme {
  /** The collection name. */
  collection: TplCollectionName;
  /** The collection template. */
  #template: Tpl;
  /** The MachineDb instance. */
  #machineDb: MachineDb;
  /** The collection model. */
  #collectionModel: IdbqModel["Collection"];

  #model: IdbqModel;

  /**
   * Create a new MachineScheme instance.
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
    this.#collectionModel = model[String(collectionName)];
    if (!this.#collectionModel || typeof this.#collectionModel["template"] === "undefined") {
      throw new MachineError(
        `Collection '${collectionName}' not found in model or missing 'template' property.`,
        'COLLECTION_NOT_FOUND'
      );
    }
    this.#template = this.#collectionModel["template"] as Tpl;
    this.#model = model;
  }

  /**
   * Get the collection model.
   * @role Accessor
   * @return {IdbqModel["Collection"]} The collection model.
   */
  get model() {
    return this.#collectionModel;
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
   * @return {MachineSchemeValidate} The form validator instance.
   */
  get validator(): MachineSchemeValidate {
    return new MachineSchemeValidate(this.collection, this.#machineDb);
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
   * @return {MachineSchemeValues} The collection values instance.
   */
  get collectionValues() {
    return new MachineSchemeValues(this.collection, this.#machineDb);
  }

  field(fieldName: keyof TplFields): MachineSchemeField  {
    return new MachineSchemeField(
      this.#model,
      this.collection,
      fieldName as keyof TplFields,
    );
  }
  /**
   * Get a field forge instance for a specific field and data.
   * @role Field forge factory
   * @template T
   * @param {keyof T} fieldName The field name.
   * @param {T} data The data object.
   * @return {MachineSchemeFieldForge<T>} The field forge instance.
   */
  fieldForge<T extends Record<string, any>>(
    fieldName: keyof T,
    data: T,
  ): MachineSchemeFieldForge<T> {
    return new MachineSchemeFieldForge<T>(
      this.collection,
      fieldName,
      data,
      this.collectionValues,
      this.#machineDb,
    );
  }

  /**
   * Parse all fields of a given collection.
   * @role Field parsing
   * @return {Record<string, IDbForge | undefined> | undefined} All parsed fields or undefined.
   */
  parse(): Record<string, IDbForge | undefined> | undefined {
    const fields = this.#template.fields;
    if (!fields) return;
    const out: Record<string, IDbForge | undefined> = {};
    Object.keys(fields).forEach((fieldName) => {
      const fieldType = fields[fieldName];
      if (fieldType) {
        out[fieldName] = this.field(fieldName).parse();
      }
    });
    return out;
  }

  /**
   * Get all foreign keys for this collection.
   * @role Foreign key accessor
   * @return {{ [collection: string]: Tpl }} Foreign key collections.
   */
  parseFks(): { [collection: string]: Record<string, IDbForge | undefined> } {
    const fks = this.#template?.fks;
    const out: Record<string, Record<string, IDbForge | undefined>> = {};
    if (fks) {
      Object.keys(fks).forEach((collection: TplCollectionName) => {
        const fkScheme = new MachineScheme(collection, this.#machineDb, this.#model);
        out[collection] = fkScheme.parse() ?? {};
      });
    }
    return out;
  }

  /**
   * Get all reverse foreign keys for this collection.
   * @role Reverse foreign key accessor
   * @return {Record<string, Record<string, IDbForge | undefined>>} Reverse foreign key collections.
   */
  parseReverseFks(): Record<string, Record<string, any>> {
    const result: Record<string, Record<string, any>> = {};
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
