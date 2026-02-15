import { describe, it, expect } from "vitest";
import { createStatorAdapter } from "./statorAdapter.js";

describe("statorAdapter basic", () => {
  it("put event adds item", () => {
    const adapter = createStatorAdapter();
    adapter.applyEvent({
      collection: "users",
      op: "put",
      data: { id: 1, name: "Alice" },
      keyPath: "id",
    });
    const s = adapter.getCollectionState("users");
    expect(Array.isArray(s.stator)).toBe(true);
    expect(s.stator.find((x: any) => x.id === 1).name).toBe("Alice");
  });

  it("set event replaces collection", () => {
    const adapter = createStatorAdapter();
    adapter.applyEvent({
      collection: "items",
      op: "set",
      data: [{ id: 1 }, { id: 2 }],
    });
    const s = adapter.getCollectionState("items");
    expect(s.stator.length).toBe(2);
  });
});
