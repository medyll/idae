import { describe, it, expect, vi } from "vitest";
import { stator } from "./Stator.js";

describe("stator", () => {
  describe("primitive values", () => {
    it("should handle number values", () => {
      const state = stator(42);
      expect(state.value).toBe(42);

      const mockOnChange = vi.fn();
      state.onchange = mockOnChange;

      state.value = 100;
      expect(state.value).toBe(100);
      expect(mockOnChange).toHaveBeenCalledWith(42, 100);
    });

    it("should handle string values", () => {
      const state = stator("hello");
      expect(state.value).toBe("hello");

      const mockOnChange = vi.fn();
      state.onchange = mockOnChange;

      state.value = "world";
      expect(state.value).toBe("world");
      expect(mockOnChange).toHaveBeenCalledWith("hello", "world");
    });

    it("should handle boolean values", () => {
      const state = stator(true);
      expect(state.value).toBe(true);

      const mockOnChange = vi.fn();
      state.onchange = mockOnChange;

      state.value = false;
      expect(state.value).toBe(false);
      expect(mockOnChange).toHaveBeenCalledWith(true, false);
    });
  });

  describe("object values", () => {
    it("should handle object values", () => {
      const initialState = { foo: "bar" };
      const state = stator(initialState);
      expect(state.value).toEqual(initialState);
    });
    it("should handle object values update", () => {
      const initialState = { foo: "bar" };
      const state = stator(initialState);
      expect(state.value).toEqual(initialState);

      state.value.foo = "baz";
      expect(state.value).toEqual({ foo: "baz" });
    });

    it("should trigger onchange for object properties", () => {
      const state = stator({ count: 0 });
      const mockOnChange = vi.fn();
      state.onchange = mockOnChange;

      state.value.count = 1;
      expect(mockOnChange).toHaveBeenCalledWith({ count: 0 }, { count: 1 });
    });

    // --- Deep reactivity tests ---

    it("should trigger onchange for nested object mutation", () => {
      // Create a deeply nested object
      const state = stator({ user: { profile: { age: 20 } } });
      const mockOnChange = vi.fn();
      state.onchange = mockOnChange;
      // Mutate a nested property
      state.stator.user.profile.age = 21;
      expect(mockOnChange).toHaveBeenCalledWith(
        { user: { profile: { age: 20 } } },
        { user: { profile: { age: 21 } } }
      );
    });

    it("should trigger onchange for nested array mutation", () => {
      // Create an object with a nested array
      const state = stator({ items: [1, 2, 3] });
      const mockOnChange = vi.fn();
      state.onchange = mockOnChange;
      // Mutate the nested array
      state.stator.items.push(4);
      expect(mockOnChange).toHaveBeenCalledWith(
        { items: [1, 2, 3] },
        { items: [1, 2, 3, 4] }
      );
    });

    it("should trigger onchange for deep array of objects mutation", () => {
      // Create an array of objects
      const state = stator([{ a: 1 }, { b: 2 }]);
      const mockOnChange = vi.fn();
      state.onchange = mockOnChange;
      // Mutate a property inside an object in the array
      state.stator[1].b = 3;
      expect(mockOnChange).toHaveBeenCalledWith(
        [{ a: 1 }, { b: 2 }],
        [{ a: 1 }, { b: 3 }]
      );
    });

    it("should trigger onchange for array push at root", () => {
      // Create a root array
      const state = stator([1, 2, 3]);
      const mockOnChange = vi.fn();
      state.onchange = mockOnChange;
      // Push to the array
      state.stator.push(4);
      expect(mockOnChange).toHaveBeenCalledWith([1, 2, 3], [1, 2, 3, 4]);
    });
  });

  describe("error handling", () => {
    it("should throw TypeError when setting onchange to non-function", () => {
      const state = stator(42);
      expect(() => {
        (state as any).onchange = "not a function";
      }).toThrow(TypeError);
    });

    it("should not enumerate onchange property", () => {
      const state = stator({ foo: "bar" });
      state.onchange = () => {};
      expect(Object.keys(state)).not.toContain("onchange");
    });

    it("should handle null values", () => {
      const state = stator(null);
      expect(state.value).toBeNull();
    });

    it("should be undefined when accessing non-existent property", () => {
      const state = stator({});

      expect(state.value.nonExistent).toBeUndefined();
    });
  });
});
