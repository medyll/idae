import type { TplCollectionName } from "@medyll/idae-idbql";
import { MachineSchemeValues } from "./MachineSchemeValues.js";
import type { IDbForge } from "../machineParserForge.js"; 
import { machine } from "../machine.js";

/**
 * @class MachineSchemeFieldValues
 * @role Utility class for introspecting and formatting field values for a given collection and data object.
 *
 * Provides utilities to introspect and format field values for a given collection and data object.
 *
 * Main responsibilities:
 * - Holds references to the collection, data, and collection values instance.
 * - Provides methods to get field metadata, format values, and generate input attributes.
 * - Supports iteration over array and object fields for advanced UI layouts.
 *
 * Usage:
 *   const fieldValues = new MachineSchemeFieldValues('agents', agentData);
 *   const forge = fieldValues.getForge('name');
 *   const formatted = fieldValues.format('name');
 *
 * @template T The type of the data object for the collection.
 */
export class MachineSchemeFieldValues<T extends Record<string, any>> {
  #collection: TplCollectionName;
  #collectionValues: MachineSchemeValues<T>;
  #data: T;

  /**
   * Returns the IDbForge metadata for a given field name.
   * @role Field metadata introspection
   * @param {keyof T} fieldName The field name to introspect.
   * @return {IDbForge | undefined} The field metadata object or undefined if not found.
   */
  public getForge(fieldName: keyof T): IDbForge | undefined {
    return this.#collectionValues.machine
      .collection(this.#collection)
      .field(fieldName).parse();
  }

  /**
   * Create a new IDbCollectionFieldValues instance.
   * @role Constructor
   * @param {TplCollectionName} collection The collection name.
   * @param {T} data The data object.
   * @param {MachineSchemeValues<T>=} collectionValues Optional IDbCollectionValues instance.
   */
  constructor(
    collection: TplCollectionName,
    data: T,
    collectionValues?: MachineSchemeValues<T>,
  ) {
    this.#collection = collection;
    this.#collectionValues =
      collectionValues ?? new MachineSchemeValues(collection, machine);
    this.#data = data;
  }

  /**
   * Format the value of a field, handling arrays and objects.
   * @role Field value formatting
   * @param {keyof T} fieldName The field name.
   * @return {string | string[]} The formatted value or array of formatted values.
   */
  format(fieldName: keyof T): string | string[] {
    const fieldInfo = this.#collectionValues.machine.collection(this.#collection).field(fieldName).parse();
    if (fieldInfo?.is === "array") {
      return this.iterateArray(String(fieldName), this.#data);
    }
    if (fieldInfo?.is === "object") {
      return this.iterateObject(String(fieldName), this.#data);
    }
    return this.#collectionValues.format(fieldName, this.#data);
  }

  /**
   * Get input attributes for a field.
   * @role Input attribute generation
   * @param {keyof T} fieldName The field name.
   * @return {any} The input attributes for the field.
   */
  getInputDataSet(fieldName: keyof T) {
    return this.#collectionValues.getInputDataSet(
      String(fieldName),
      this.#data,
    );
  }

  // renamed from parseCollectionFieldName
  // get forge(): IDbForge | undefined {
  //     return undefined; // Pas de #fieldName dans cette classe, getter non pertinent
  // }

  /**
   * Iterate over an array field and return field metadata for each item.
   * @role Array field iteration
   * @param {string} fieldName The field name.
   * @param {any[]} data The array data.
   * @return {IDbForge[]} Array of field metadata objects for each item.
   */
  iterateArray(fieldName: string, data: any[]): IDbForge[] {
    return this.#collectionValues.iterateArrayField(fieldName, data);
  }

  /**
   * Iterate over an object field and return field metadata for each property.
   * @role Object field iteration
   * @param {string} fieldName The field name.
   * @param {Record<string, any>} data The object data.
   * @return {IDbForge[]} Array of field metadata objects for each property.
   */
  iterateObject(fieldName: string, data: Record<string, any>): IDbForge[] {
    return this.#collectionValues.iterateObjectField(fieldName, data);
  }
}
