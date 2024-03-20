import { describe, beforeEach, afterEach, it, expect } from "vitest";
import "fake-indexeddb/auto";
import { IdbqlIndexedCore, createIdbqDb } from "../idbqlCore/idbqlCore.js";
import { Collection } from "./collection.js";

const schema = {
  users: "&userId, created_at, dateLastMessage" as any,
  products: "++id, userId, created_at",
};

const idbqModel = {
  chat: {
    keyPath: "&chatId, created_at, dateLastMessage" as any,
    model: {} as any,
  },
  messages: {
    keyPath: "++id, chatId, created_at",
    model: {} as any,
  },
} as const;

describe("Collection", () => {
  let collectionUsers: typeof Collection;

  let idbq = createIdbqDb<typeof idbqModel>(idbqModel, 1);

  beforeEach(async () => {
    idbq = createIdbqDb<typeof idbqModel>(idbqModel, 1);
  });

  afterEach(() => {});

  it("should create an instance of Collection", () => {
    // @ts-ignore
    collectionUsers = new Collection("chat", "chatId", {
      dbName: "myDatabase",
      version: 1,
    });
    expect(collectionUsers).toBeInstanceOf(Collection);
  });
  return;

  it("should put data to the store", async () => {
    const data = { userId: 256, name: "John Doe" };
    const op = await collectionUsers.put(data);

    const result = await collectionUsers.get(op);
    expect(result).toEqual(data);
  });

  it("should get data from the store", async () => {
    const data = { userId: 1, name: "John Doe" };
    await collectionUsers.add(data);

    const result = await collectionUsers.get(1);
    console.log(result);
    expect(result).toEqual(data);
  });

  it("should get all data from the store", async () => {
    const data1 = { userId: 1, name: "John Doe" };
    const data2 = { userId: 2, name: "Jane Smith" };
    await collectionUsers.add(data1);
    await collectionUsers.add(data2);

    const result = await collectionUsers.getAll();
    expect(result).toEqual([data1, data2]);
  });

  it("should retrieve filtered data from the store", async () => {
    const data1 = { id: 1, name: "John Doe", age: 30 };
    const data2 = { id: 2, name: "Jane Smith", age: 25 };
    await collectionUsers.add(data1);
    await collectionUsers.add(data2);

    const result = await collectionUsers.where({ age: 30 });
    expect(result).toEqual([data1]);
  });
});
