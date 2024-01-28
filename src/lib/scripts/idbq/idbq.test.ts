import { Idbq } from "./idbq.js";
import { Collection } from "../collection.js";
import { describe, beforeEach, afterEach, it, expect } from "vitest";
import { indexedDB, IDBKeyRange } from "fake-indexeddb";

// Set the global indexedDB to the fake one
global.indexedDB = indexedDB;
global.IDBKeyRange = IDBKeyRange;

describe("Idbq", () => {
  let idbq: Idbq;
  let version: number = 1;
  beforeEach(() => {
    idbq = new Idbq("testDatabase");
  });

  afterEach(() => {
    // Close the database connection after each test
    idbq.closeDatabase();
  });

  it("should create an instance of Idbq", () => {
    expect(idbq).toBeInstanceOf(Idbq);
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
      users: "++id",
      products: "++id",
    };
    await idbq.version(version).stores(schema);

    expect(idbq.schema).toEqual(schema);
    expect(idbq.users).toBeInstanceOf(Collection);
    expect(idbq.products).toBeInstanceOf(Collection);
  });

  it("should open the database connection", async () => {
    version = version++;
    await idbq.version(version).stores({});
    expect(idbq.idbDatabase).toBeDefined();
  });

  it("should close the database connection", () => {
    idbq.closeDatabase();
    expect(idbq.idbDatabase).toBeUndefined();
  });
});
