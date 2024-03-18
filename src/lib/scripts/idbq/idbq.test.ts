import { IdbqlCore } from "./idbq.js";
import { Collection } from "../collection/collection.js";
import { describe, beforeEach, afterEach, it, expect } from "vitest";
import "fake-indexeddb/auto";

describe("Idbq", () => {
  let idbq: IdbqlCore;
  let version: number = 1;
  let idbqModel = {
    chat: {
      keyPath: "&chatId, created_at, dateLastMessage" as any,
      model: {} as any,
    },
    messages: {
      keyPath: "++id, chatId, created_at",
      model: {} as any,
    },
  } as const;
  beforeEach(() => {
    idbq = new IdbqlCore("testDatabase", idbqModel, version);
  });

  afterEach(() => {
    // Close the database connection after each test
    idbq.closeDatabase();
  });

  it("should create an instance of Idbq", () => {
    expect(idbq).toBeInstanceOf(IdbqlCore);
  });

  it("should set the version of the database", () => {
    version = version++;
    const result = idbq.version(version);
    expect(result).toHaveProperty("stores");
    expect(idbq.dbVersion).toBe(version);
  });

  it("should create object stores based on the provided schema", async () => {
    version = version++;
    const schema = {
      chat: "&chatId, created_at, dateLastMessage",
      messages: "++id, chatId, created_at",
    };
    await idbq.version(version).stores(schema);

    expect(idbq.schema).toEqual(schema);
    //@ts-ignore
    expect(idbq.chat).toBeInstanceOf(Collection);
    //@ts-ignore
    expect(idbq.messages).toBeInstanceOf(Collection);
  });

  it("should close the database connection", () => {
    idbq.closeDatabase();
    expect(idbq.idbDatabase).toBeUndefined();
  });
});
