import type {
  TplCollectionName,
  TplFields,
  TplProperties,
} from "@medyll/idae-idbql";
import type { IDbFieldType, IDbFieldRules, IDbForgeArgs } from "./machineDb.js";

export type IDbForge = {
  collection?: TplCollectionName;
  fieldName?: keyof TplFields;
  fieldType?: IDbFieldType;
  fieldRule?: IDbFieldRules;
  fieldArgs?: IDbForgeArgs | undefined;
  is: unknown;
};

export class MachineForge {

  constructor() {}
  testIs(
    what: "array" | "object" | "fk" | "primitive",
    fieldRule: IDbFieldRules,
  ): Partial<IDbForge> | undefined {
    const typeMappings = {
      fk: "fk-",
      array: "array-of-",
      object: "object-",
      primitive: "",
    };
    const prefix = typeMappings[what];
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
    if (fieldRule.startsWith(prefix)) {
      return this.is(what, fieldRule);
    }
    return undefined;
  }
  is(
    what: "array" | "object" | "fk" | "primitive",
    fieldRule: IDbFieldRules,
  ): Partial<IDbForge> {
    return this.extract(what, fieldRule);
  }
  extract(
    type: "array" | "object" | "fk" | "primitive",
    fieldRule: IDbFieldRules,
  ): Partial<IDbForge> {
    function extractAfter(pattern: string, source: string) {
      const reg = source?.split("(")?.[0];
      return reg.split(pattern)[1] as IDbFieldRules;
    }
    function extractArgs(
      source: string,
    ): { piece: any; args: [TplProperties] | IDbForgeArgs } | undefined {
      const [piece, remaining] = source.split("(");
      if (!remaining) return { piece: piece.trim(), args: undefined };
      const [central] = remaining?.split(")");
      const args = central?.split(" ") as [
        TplProperties | keyof typeof TplProperties,
      ];
      return { piece: piece.trim(), args };
    }
    let extractedArgs = extractArgs(fieldRule);
    let fieldType;
    let is = extractedArgs?.piece;
    let fieldArgs = extractedArgs?.args;
    switch (type) {
      case "array":
        fieldType = extractAfter("array-of-", fieldRule);
        is = is ?? fieldType;
        break;
      case "object":
        fieldType = extractAfter("object-", fieldRule);
        is = is ?? fieldType;
        break;
      case "fk":
        fieldType = "fk-" + extractAfter("fk-", fieldRule);
        is = extractedArgs?.piece;
        break;
      case "primitive":
        fieldType = extractedArgs?.piece;
        is = is ?? fieldType;
        break;
    }
    return { fieldType, fieldRule, fieldArgs, is: type };
  }

  /**
   * construct an IDbForge object from its components.
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
