import type {
  TplCollectionName,
  Tpl,
  IdbqModel,
  TplFields,
  IDbForge,
} from "@medyll/idae-idbql";
import { MachineDb, type IDbFieldRules } from "../machineDb.js";
import { MachineForge } from "$lib/main/machineForge.js";
import { IDbFormValidate } from "$lib/main/machine/IDbFormValidate.js";
import { IDbCollectionFieldForge } from "$lib/main/machine/IDbCollectionFieldForge.js";
import { IDbCollectionFieldValues } from "./IDbCollectionFieldValues.js";
import { IDbCollectionValues } from "./IDbCollectionValues.js";
import { IDbError } from "$lib/index.js";

/**
 * IDbCollection
 *
 * Represents a single collection template, providing access to its schema, fields, and metadata.
 *
 * Main responsibilities:
 * - Holds references to the collection name, template, and model.
 * - Provides access to field rules, presentation, and foreign keys.
 * - Supplies utilities for retrieving collection values and templates.
 *
 * Usage:
 *   const collection = new IDbCollection('agents', idbBase, model);
 *   const fields = collection.fields;
 *   const presentation = collection.getPresentation();
 *
 * This class is typically used for schema-driven applications and dynamic UI generation.
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

  machineForge: MachineDb["machineForge"];

  /**
   * Create a new IDbCollection instance.
   * @param collectionName The collection name.
   * @param idbBase The MachineDb instance.
   * @param model The IdbqModel instance.
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
    this.machineForge = new MachineForge();
  }

  /**
   * Get the collection model.
   */
  get model() {
    return this.#model;
  }
 
  /**
   * Get the collection template.
   */
  get template():Tpl {
    return this.#template;
  }

  get validator(): IDbFormValidate {
    return new IDbFormValidate(this.collection, this.#machineDb);
  }

  /**
   * Get the field rule for a given field name.
   * @param fieldName The field name.
   */
  getFieldRule(fieldName: keyof TplFields) {
    return this.#template.fields[String(fieldName)] as IDbFieldRules | undefined;
  }

  /**
   * Get a new IDbCollectionValues instance for this collection.
   */
  collectionValues() {
    return new IDbCollectionValues(this.collection, this.#machineDb);
  }

  collectionFieldValues<T extends Record<string, any>>(
    data: T,
  ): IDbCollectionFieldValues<T> {
    return new IDbCollectionFieldValues<T>(
      this.collection,
      data,
      this.collectionValues(),
    );
  }

  fieldForge<T extends Record<string, any>>(
    fieldName: keyof T,
    data: T,
  ): IDbCollectionFieldForge<T> {
    return new IDbCollectionFieldForge<T>(
      this.collection,
      fieldName,
      data,
      this.collectionValues(),
    );
  }



  /**
   * Parse all fields of a given collection.
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
    const array = this.machineForge.testIs("array", field);
    const object = this.machineForge.testIs("object", field);
    const fk = this.machineForge.testIs("fk", field);
    const primitive = this.machineForge.testIs("primitive", field);
    const fieldType = array ?? object ?? fk ?? primitive;

    return this.machineForge.forge({
      collection: this.collection,
      fieldName,
      ...fieldType,
    });
  }

  fks(): { [collection: string]: Tpl } {
    const fks = this.#template?.fks
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
}
