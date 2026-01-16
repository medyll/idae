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

/* Single collection template relies on IDbBase */

export class IDbCollection {
  collection: TplCollectionName;
  #template: Tpl;
  #machineDb: MachineDb;
  #model: IdbqModel["Collection"];

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

  get model() {
    return this.#model;
  }
  get fields() {
    return this.#template?.fields as TplFields;
  }
  getPresentation() {
    return this.#template?.presentation as string;
  }
  getFieldRule(fieldName: keyof TplFields) {
    return this.fields[String(fieldName)] as IDbFieldRules | undefined;
  }

  getTemplate() {
    return this.#template;
  }

  getModelTemplateFks() {
    return this.#template?.fks as Tpl["fks"];
  }

  getIndexName() {
    return this.#template?.index;
  }

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
