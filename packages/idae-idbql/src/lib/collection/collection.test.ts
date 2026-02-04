import { createIdbqDb } from "../idbqlCore/idbqlCore.js";
import { idbqlEvent } from "../state/idbqlEvent.svelte.js";
import { CollectionCore } from "./collection.svelte.js";
import { describe, beforeEach, afterEach, it, expect } from "vitest";
import "fake-indexeddb/auto";

const idbqModel = {
  chat: {
    keyPath: "&chatId, title" as any,
    model: {} as any,
  },
  users: {
    keyPath: "++id",
    model: {} as any,
  },
} as const;

describe("CollectionCore", () => {
  let collection: CollectionCore;
  let idbqStore = createIdbqDb<typeof idbqModel>(idbqModel, 1);
  const { idbql, idbqlState, idbDatabase } = idbqStore.create("oneDatabase");

  idbql.chat.put({ chatId: "1", title: "Chat 1" });
  idbql.chat.put({ chatId: "2", title: "Chat 2" });
  idbql.chat.put({ chatId: "3", title: "Chat 3" });

  idbql.users.put({ id: 1, name: "John" });
  idbql.users.put({ id: 2, name: "Jane" });
  idbql.users.put({ id: 3, name: "Alice" });

  beforeEach(() => {
    collection = idbql.chat;
  });

  it("should get the name of the collection", () => {
    expect(collection.name).toEqual("chat");
  });

  it("should retrieve data based on the provided query", async () => {
    const query = { chatId: { eq: "1" } };
    const resultSet = await collection.where(query);
    expect(resultSet).toBeDefined();
  });

  it("should get data by value", async () => {
    const value = "1";
    const data = await collection.get(value);
    expect(data).toBeDefined();
  });

  it("should get all data", async () => {
    const allData = await collection.getAll();
    expect(allData).toBeDefined();
  });

  it("should update data by keyPathValue", async () => {
    const keyPathValue = "1";
    const data = { name: "Alice" };
    const updatedData = await collection.update(keyPathValue, data);
    console.log("updatedData", updatedData);
    expect(updatedData).toStrictEqual({
      chatId: "1",
      title: "Chat 1",
      name: "Alice",
    });
  });

  it("should update data where condition is met", async () => {
    const where = { name: "John" };
    const data = { age: 30 };
    const result = await collection.updateWhere(where, data);
    expect(result).toBe(true);
  });

  it("should put data to indexedDB", async () => {
    const data = { chatId: "4", title: "John" };
    const result = await collection.put(data);
    expect(result).toBeDefined();
  });

  it("should add data to the store", async () => {
    const data = { chatId: "7", title: "Jane" };
    const result = await collection.add(data);
    expect(result).toBeDefined();
  });

  it("should delete data by keyPathValue", async () => {
    const keyPathValue = 1;
    const result = await collection.delete(keyPathValue);
    expect(result).toBe(true);
  });

  it("should delete data where condition is met", async () => {
    const where = { name: "John" };
    const result = await collection.deleteWhere(where);
    expect(result).toBe(true);
  });

  it("should count all documents in the collection", async () => {
    const count = await collection.count();
    expect(count).toBeGreaterThan(0);
    expect(typeof count).toBe("number");
  });

  it("should count documents matching a query", async () => {
    const count = await collection.count({ title: "Chat 1" });
    expect(count).toBe(1);
  });

  it("should return 0 for query with no matches", async () => {
    const count = await collection.count({ title: "NonExistent" });
    expect(count).toBe(0);
  });

  it("should count documents with complex query", async () => {
    await collection.put({ chatId: "5", title: "Chat 5" });
    const count = await collection.count({ chatId: { $in: ["1", "2", "3"] } });
    expect(count).toBeGreaterThanOrEqual(3);
  });
});
