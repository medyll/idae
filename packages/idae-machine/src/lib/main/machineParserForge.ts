import type {
  TplCollectionName,
  TplFieldRules,
  TplFieldType,
  TplProperties,
  TplFieldArgs,
  TplFields,
} from "@medyll/idae-idbql";
import type { MachineDb } from "./machineDb.js";
import { MachineError } from "./machine/MachineError.js";

/**
 * Utility class for parsing and constructing database field definitions (IDbForge).
 * Provides methods to analyze field rules and extract type information for schema generation.
 */

export type IDbForge = {
  collection: TplCollectionName;
  fieldName: string;
  fieldType: TplFieldType;
  fieldRule: TplFieldRules;
  fieldArgs: TplFieldArgs;
  is: "array" | "object" | "fk" | "primitive";
};
export class MachineParserForge {
  #machineForge: MachineDb["machineForge"] | undefined;

  /**
   * Create a new MachineParserForge instance.
   */
  constructor() {
    // Correction : ne pas initialiser #machineForge récursivement
    this.#machineForge = undefined;
  }

  /**
   * Test if a field rule matches a specific type (array, object, fk, primitive).
   * @param what - The type to test for ("array", "object", "fk", "primitive").
   * @param fieldRule - The field rule string to analyze.
   * @returns Partial IDbForge object if the rule matches, otherwise undefined.
   */
  testIs(
    what: "array" | "object" | "fk" | "primitive",
    fieldRule: TplFieldRules,
  ): Partial<IDbForge> | undefined {
    const typeMappings = {
      fk: "fk-",
      array: "array-of-",
      object: "object-",
      primitive: "",
    };
    const prefix = typeMappings[what];
    // For primitive, ensure it does not start with any other type prefix
    if (what === "primitive") {
      if (
        !fieldRule.startsWith("array-of-") &&
        !fieldRule.startsWith("object-") &&
        !fieldRule.startsWith("fk-")
      ) {
        return this.is(what, fieldRule);
      }
      return undefined;
    }
    // For other types, check if the rule starts with the expected prefix
    if (fieldRule.startsWith(prefix)) {
      return this.is(what, fieldRule);
    }
    return undefined;
  }

  /**
   * Returns a partial IDbForge object for the given type and field rule.
   * @param what - The type to extract ("array", "object", "fk", "primitive").
   * @param fieldRule - The field rule string to analyze.
   * @returns Partial IDbForge object with extracted type info.
   */
  is(
    what: "array" | "object" | "fk" | "primitive",
    fieldRule: TplFieldRules,
  ): Partial<IDbForge> {
    return this.extract(what, fieldRule);
  }

  /**
   * Extracts type, rule, and argument information from a field rule string.
   * @param type - The type to extract ("array", "object", "fk", "primitive").
   * @param fieldRule - The field rule string to analyze.
   * @returns Partial IDbForge object with extracted details.
   */
  extract(
    type: "array" | "object" | "fk" | "primitive",
    fieldRule: TplFieldRules,
  ): Partial<IDbForge> {
    /**
     * Helper to extract the substring after a given pattern, before any arguments.
     * @param pattern - The prefix pattern to remove.
     * @param source - The field rule string.
     * @returns The substring after the pattern.
     */
    function extractAfter(pattern: string, source: string) {
      const reg = source?.split("(")?.[0];
      return reg.split(pattern)[1] as TplFieldRules;
    }

    /**
     * Helper to extract the main type and argument list from a field rule string.
     * @param source - The field rule string.
     * @returns Object with the main type (piece) and argument array (args).
     */
    function extractArgs(
      source: string,
    ): { piece: any; args: [TplProperties] | TplFieldArgs } | undefined {
      const [piece, remaining] = source.split("(");
      if (!remaining) return { piece: piece.trim(), args: undefined };
      let central: string | undefined;
      if (remaining !== undefined) {
        [central] = remaining.split(")");
      }
      const args = central
        ? (central.split(" ") as [TplProperties | keyof typeof TplProperties])
        : undefined;
      return { piece: piece.trim(), args };
    }

    const extractedArgs = extractArgs(fieldRule);
    let fieldType;
    const fieldArgs = extractedArgs?.args;
    switch (type) {
      case "array":
        fieldType = extractAfter("array-of-", fieldRule);
        break;
      case "object":
        fieldType = extractAfter("object-", fieldRule);
        break;
      case "fk":
        fieldType = "fk-" + extractAfter("fk-", fieldRule);
        break;
      case "primitive":
        fieldType = extractedArgs?.piece;
        break;
    }
    return { fieldType, fieldRule, fieldArgs, is: type };
  }


  /**
   * Constructs an IDbForge object from its components.
   * @param params - The components of the IDbForge object.
   * @returns A complete IDbForge object.
   */
  forge({
    collection,
    fieldName,
    fieldType,
    fieldRule,
    fieldArgs,
    is,
  }: IDbForge): IDbForge {
    return { collection, fieldName, fieldType, fieldRule, fieldArgs, is };
  }
}
