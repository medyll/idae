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
      expect(mockOnChange).toHaveBeenCalledWith(100);
    });

    it("should handle string values", () => {
      const state = stator("hello");
      expect(state.value).toBe("hello");

      const mockOnChange = vi.fn();
      state.onchange = mockOnChange;

      state.value = "world";
      expect(state.value).toBe("world");
      expect(mockOnChange).toHaveBeenCalledWith("world");
    });

    it("should handle boolean values", () => {
      const state = stator(true);
      expect(state.value).toBe(true);

      const mockOnChange = vi.fn();
      state.onchange = mockOnChange;

      state.value = false;
      expect(state.value).toBe(false);
      expect(mockOnChange).toHaveBeenCalledWith(false);
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
      expect(mockOnChange).toHaveBeenCalledWith({ count: 1 });
    });

    // --- Deep reactivity tests ---

    it("should trigger onchange for nested object mutation", () => {
      // Create a deeply nested object
      const state = stator({ user: { profile: { age: 20 } } });
      const mockOnChange = vi.fn();
      state.onchange = mockOnChange;
      // Mutate a nested property
      state.stator.user.profile.age = 21;
      // Vérifie qu'au moins un appel du handler contient la valeur modifiée quelque part
      const found = mockOnChange.mock.calls.some(call => {
        const arg = call[0];
        // Recherche récursive de la valeur modifiée
        function deepFind(obj: any): boolean {
          if (obj && typeof obj === 'object') {
            if (obj.age === 21) return true;
            return Object.values(obj).some(deepFind);
          }
          return false;
        }
        return deepFind(arg);
      });
      expect(found).toBe(true);
    });

    it("should trigger onchange for nested array mutation", () => {
      // Create an object with a nested array
      const state = stator({ items: [1, 2, 3] });
      const mockOnChange = vi.fn();
      state.onchange = mockOnChange;
      // Mutate the nested array
      state.stator.items.push(4);
      // Vérifie qu'au moins un appel du handler contient un array avec 4 en dernière position
      const found = mockOnChange.mock.calls.some(call => {
        const arg = call[0];
        function deepFindArrayWith4(obj: any): boolean {
          if (Array.isArray(obj)) {
            return obj.includes(4);
          }
          if (obj && typeof obj === 'object') {
            return Object.values(obj).some(deepFindArrayWith4);
          }
          return false;
        }
        return deepFindArrayWith4(arg);
      });
      expect(found).toBe(true);
    });

    it("should trigger onchange for deep array of objects mutation", () => {
      // Create an array of objects
      const state = stator([{ a: 1 }, { b: 2 }]);
      const mockOnChange = vi.fn();
      state.onchange = mockOnChange;
      // Mutate a property inside an object in the array
      state.stator[1].b = 3;
      // Vérifie qu'au moins un appel du handler contient un objet { b: 3 }
      const found = mockOnChange.mock.calls.some(call => {
        const arg = call[0];
        function deepFindB3(obj: any): boolean {
          if (obj && typeof obj === 'object') {
            if (obj.b === 3) return true;
            if (Array.isArray(obj)) return obj.some(deepFindB3);
            return Object.values(obj).some(deepFindB3);
          }
          return false;
        }
        return deepFindB3(arg);
      });
      expect(found).toBe(true);
    });

    it("should trigger onchange for array push at root", () => {
      // Create a root array
      const state = stator([1, 2, 3]);
      const mockOnChange = vi.fn();
      state.onchange = mockOnChange;
      // Push to the array
      state.stator.push(4);
      expect(mockOnChange).toHaveBeenCalledWith([1, 2, 3, 4]);
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
