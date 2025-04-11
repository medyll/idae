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
      expect(state).toEqual(initialState);

      state.foo = "baz";
      expect(state.value).toEqual({ foo: "baz" });
    });

    it("should trigger onchange for object properties", () => {
      const state = stator({ count: 0 });
      const mockOnChange = vi.fn();
      state.onchange = mockOnChange;

      state.value.count = 1;
      expect(mockOnChange).toHaveBeenCalledWith({ count: 0 }, { count: 1 });
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

      expect((state as any).nonExistent).toBeUndefined();
    });
  });
});
