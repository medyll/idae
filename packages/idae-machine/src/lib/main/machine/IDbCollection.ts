
import type {
  TplCollectionName,
  Tpl,
  IdbqModel,
  TplFields,
} from "@medyll/idae-idbql";
import { MachineDb, type IDbFieldRules } from "../machineDb.js";
import { IDbFormValidate } from "$lib/main/machine/IDbFormValidate.js";
import { IDbCollectionFieldForge } from "$lib/main/machine/IDbCollectionFieldForge.js";
import { IDbCollectionFieldValues } from "./IDbCollectionFieldValues.js";
import { IDbCollectionValues } from "./IDbCollectionValues.js";

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
  }

  /**
   * Get the collection model.
   */
  get model() {
    return this.#model;
  }
  /**
   * Get the collection fields.
   */
  get fields() {
    return this.#template?.fields as TplFields;
  }
  /**
   * Get the presentation string for the collection.
   */
  getPresentation() {
    return this.#template?.presentation as string;
  }
  /**
   * Get the field rule for a given field name.
   * @param fieldName The field name.
   */
  getFieldRule(fieldName: keyof TplFields) {
    return this.fields[String(fieldName)] as IDbFieldRules | undefined;
  }

  /**
   * Get the collection template.
   */
  getTemplate() {
    return this.#template;
  }

  /**
   * Get the foreign keys from the model template.
   */
  getModelTemplateFks() {
    return this.#template?.fks as Tpl["fks"];
  }

  /**
   * Get the index name for the collection.
   */
  getIndexName() {
    return this.#template?.index;
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

  getFormValidate(): IDbFormValidate {
    return new IDbFormValidate(this.collection, this.#machineDb);
  }
 
}
