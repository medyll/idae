import { describe, beforeEach, it, expect } from "vitest";
import { createIdbqlState } from "./idbstate.svelte";

describe("createIdbqlState", () => {
  let idbBaseMock: any;
  let state: any;

  beforeEach(() => {
    idbBaseMock = {
      schema: {
        users: "id",
        posts: "id",
      },
      users: {
        getAll: jest.fn().mockResolvedValue([{ id: 1, name: "John" }]),
        update: jest.fn(),
        updateWhere: jest.fn(),
        put: jest.fn(),
        add: jest.fn(),
        delete: jest.fn(),
        deleteWhere: jest.fn(),
      },
      posts: {
        getAll: jest.fn().mockResolvedValue([{ id: 1, title: "Hello" }]),
        update: jest.fn(),
        updateWhere: jest.fn(),
        put: jest.fn(),
        add: jest.fn(),
        delete: jest.fn(),
        deleteWhere: jest.fn(),
      },
    };

    state = createIdbqlState(idbBaseMock).state;
  });

  it("should initialize state with empty collections", () => {
    expect(state).toEqual({});
  });

  it("should add collections to the state", () => {
    expect(state.users).toBeDefined();
    expect(state.posts).toBeDefined();
  });

  it("should synchronize collections with indexedDB if it exists", async () => {
    await state.users.getAll();
    expect(idbBaseMock.users.getAll).toHaveBeenCalled();
    expect(state.users).toEqual([{ id: 1, name: "John" }]);

    await state.posts.getAll();
    expect(idbBaseMock.posts.getAll).toHaveBeenCalled();
    expect(state.posts).toEqual([{ id: 1, title: "Hello" }]);
  });

  // Add more tests for other methods and scenarios
});
