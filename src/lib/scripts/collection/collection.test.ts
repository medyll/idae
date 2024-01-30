import { describe, beforeEach, afterEach, it, expect } from "vitest";
import "fake-indexeddb/auto";
import { Idbq } from "../idbq/idbq.js";
import { Collection } from "./collection.js";

const schema = {
  users: "&userId, created_at, dateLastMessage",
  products: "++id, userId, created_at",
};

class DataBase extends Idbq {
  users!: Collection<any>;
  products!: Collection<any>;

  constructor() {
    super("myDatabase");

    this.version(1).stores({
      users: "&userId",
      products: "++id, userId",
    });
  }
}

export const dbaseTest = new DataBase();

describe("Collection", () => {
  let collectionUsers: Collection;
  let collectionProducts: Collection;

  beforeEach(async () => {});

  afterEach(() => {});

  it("should create an instance of Collection", () => {
    collectionUsers = new Collection("myDatabase", "users", 1);
    collectionProducts = new Collection("myDatabase", "products", 1);
    expect(collectionUsers).toBeInstanceOf(Collection);
    expect(collectionProducts).toBeInstanceOf(Collection);
  });

  it("should add data to the store ?", async () => {
    collectionUsers = new Collection("myDatabase", "users", 1);
    const data = { userId: 5, name: "John Doe" };
    await collectionUsers.add(data);
    const result = await collectionUsers.get(5);

    expect(result).toEqual(data);
  });

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
  return;

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

  it("should observe the collection", () => {
    const result = collectionUsers.observe();
    expect(result).toBe(collectionUsers);
  });
});
