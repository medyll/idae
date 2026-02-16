import { describe, it, expect } from "vitest";
import { createStatorAdapter } from "./statorAdapter.js";

describe("statorAdapter additional ops", () => {
  it("add event appends item", () => {
    const adapter = createStatorAdapter();
    adapter.applyEvent({
      collection: "users",
      op: "add",
      data: { id: 2, name: "Bob" },
    });
    const s = adapter.getCollectionState("users");
    expect(Array.isArray(s.stator)).toBe(true);
    expect(s.stator.find((x: any) => x.id === 2).name).toBe("Bob");
  });

  it("updateWhere updates matching items", () => {
    const adapter = createStatorAdapter();
    adapter.applyEvent({ collection: "items", op: "set", data: [{ id: 1, a: 1 }, { id: 2, a: 2 }] });
    adapter.applyEvent({ collection: "items", op: "updateWhere", data: { a: 2, updated: true } });
    const s = adapter.getCollectionState("items");
    const matched = s.stator.find((x: any) => x.id === 2);
    expect(matched.updated).toBe(true);
    // ensure other item unchanged
    expect(s.stator.find((x: any) => x.id === 1).updated).toBeUndefined();
  });

  it("delete removes by keyPath", () => {
    const adapter = createStatorAdapter();
    adapter.applyEvent({ collection: "things", op: "set", data: [{ id: 10 }, { id: 11 }] });
    adapter.applyEvent({ collection: "things", op: "delete", data: { id: 10 }, keyPath: "id" });
    const s = adapter.getCollectionState("things");
    expect(s.stator.find((x: any) => x.id === 10)).toBeUndefined();
    expect(s.stator.length).toBe(1);
  });

  it("deleteWhere removes matching items", () => {
    const adapter = createStatorAdapter();
    adapter.applyEvent({ collection: "things2", op: "set", data: [{ id: 1, tag: 'a' }, { id: 2, tag: 'b' }, { id: 3, tag: 'a' }] });
    adapter.applyEvent({ collection: "things2", op: "deleteWhere", data: { tag: 'a' } });
    const s = adapter.getCollectionState("things2");
    expect(s.stator.find((x: any) => x.tag === 'a')).toBeUndefined();
    expect(s.stator.length).toBe(1);
  });

  it("dispose clears collections", () => {
    const adapter = createStatorAdapter();
    adapter.applyEvent({ collection: "c1", op: "add", data: { id: 1 } });
    adapter.applyEvent({ collection: "c2", op: "add", data: { id: 2 } });
    adapter.dispose();
    // after dispose, new collections should be empty when re-created
    const s = adapter.getCollectionState("c1");
    expect(Array.isArray(s.stator)).toBe(true);
    expect(s.stator.length).toBe(0);
  });
});
