import type {
  TplCollectionName,
  TplFields,
  IDbForge,
  TplFieldRules,
  IdbqModel,
  Tpl,
} from "@medyll/idae-idbql";
import type { MachineDb } from "../machineDb.js";
import { MachineParserForge } from "../machineParserForge.js";
import { MachineError } from "./MachineError.js";

export class MachineSchemeField {
  #collection: TplCollectionName;
  #fieldName: keyof TplFields;
  #machineForge: MachineDb["machineForge"];
  /** The collection model. */
  #model: IdbqModel["Collection"];
  /** The collection template. */
  #template: Tpl;

  constructor(
    model: IdbqModel,
    collection: TplCollectionName,
    fieldName: keyof TplFields,
  ) {
    this.#collection = collection;
    this.#fieldName = fieldName;
    this.#machineForge = new MachineParserForge();

    this.#model = model[String(collection)];
    this.#template = this.#model["template"] as Tpl;
  }

  /**
   * Parse a single field of a collection and return its IDbForge metadata.
   * @role Field parsing
   * @param {keyof TplFields} fieldName The field name.
   * @return {IDbForge | undefined} The field metadata or undefined.
   */
  parse(): IDbForge | undefined {
    const field = this.getFieldRule(this.#fieldName);
    if (!field) {
      MachineError.throwError(
        `Field ${this.#fieldName} not found in collection ${this.#collection}`,
        "FIELD_NOT_FOUND",
      );
      return undefined;
    }
    const array = this.#machineForge.testIs("array", field);
    const object = this.#machineForge.testIs("object", field);
    const fk = this.#machineForge.testIs("fk", field);
    const primitive = this.#machineForge.testIs("primitive", field);
    const fieldType = array ?? object ?? fk ?? primitive;

    return this.#machineForge.forge({
      collection: this.#collection,
      fieldName: String(this.#fieldName),
      ...(fieldType ?? {}),
      is: fieldType?.is ?? undefined,
    });
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
}
