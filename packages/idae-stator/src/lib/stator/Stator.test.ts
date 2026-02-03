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

  describe("array values", () => {
    it("should handle root array values", () => {
      const state = stator([1, 2, 3]);
      expect(state.value).toEqual([1, 2, 3]);
    });

    it("should trigger onchange for array pop", () => {
      const state = stator([1, 2, 3]);
      const mockOnChange = vi.fn();
      state.onchange = mockOnChange;

      const popped = state.stator.pop();
      expect(popped).toBe(3);
      expect(state.value).toEqual([1, 2]);
      expect(mockOnChange).toHaveBeenCalledWith([1, 2]);
    });

    it("should trigger onchange for array shift", () => {
      const state = stator([1, 2, 3]);
      const mockOnChange = vi.fn();
      state.onchange = mockOnChange;

      const shifted = state.stator.shift();
      expect(shifted).toBe(1);
      expect(state.value).toEqual([2, 3]);
      expect(mockOnChange).toHaveBeenCalledWith([2, 3]);
    });

    it("should trigger onchange for array unshift", () => {
      const state = stator([1, 2, 3]);
      const mockOnChange = vi.fn();
      state.onchange = mockOnChange;

      state.stator.unshift(0);
      expect(state.value).toEqual([0, 1, 2, 3]);
      expect(mockOnChange).toHaveBeenCalledWith([0, 1, 2, 3]);
    });

    it("should trigger onchange for array splice (remove)", () => {
      const state = stator([1, 2, 3, 4, 5]);
      const mockOnChange = vi.fn();
      state.onchange = mockOnChange;

      const removed = state.stator.splice(1, 2);
      expect(removed).toEqual([2, 3]);
      expect(state.value).toEqual([1, 4, 5]);
      expect(mockOnChange).toHaveBeenCalled();
    });

    it("should trigger onchange for array splice (insert)", () => {
      const state = stator([1, 2, 5]);
      const mockOnChange = vi.fn();
      state.onchange = mockOnChange;

      state.stator.splice(2, 0, 3, 4);
      expect(state.value).toEqual([1, 2, 3, 4, 5]);
      expect(mockOnChange).toHaveBeenCalled();
    });

    it("should trigger onchange for array splice (replace)", () => {
      const state = stator([1, 2, 3]);
      const mockOnChange = vi.fn();
      state.onchange = mockOnChange;

      state.stator.splice(1, 1, 10);
      expect(state.value).toEqual([1, 10, 3]);
      expect(mockOnChange).toHaveBeenCalled();
    });

    it("should trigger onchange for array sort", () => {
      const state = stator([3, 1, 2]);
      const mockOnChange = vi.fn();
      state.onchange = mockOnChange;

      state.stator.sort();
      expect(state.value).toEqual([1, 2, 3]);
      expect(mockOnChange).toHaveBeenCalled();
    });

    it("should trigger onchange for array sort with comparator", () => {
      const state = stator([1, 10, 2, 21]);
      const mockOnChange = vi.fn();
      state.onchange = mockOnChange;

      state.stator.sort((a: number, b: number) => a - b);
      expect(state.value).toEqual([1, 2, 10, 21]);
      expect(mockOnChange).toHaveBeenCalled();
    });

    it("should trigger onchange for array reverse", () => {
      const state = stator([1, 2, 3]);
      const mockOnChange = vi.fn();
      state.onchange = mockOnChange;

      state.stator.reverse();
      expect(state.value).toEqual([3, 2, 1]);
      expect(mockOnChange).toHaveBeenCalled();
    });

    it("should trigger onchange for array fill", () => {
      const state = stator([1, 2, 3]);
      const mockOnChange = vi.fn();
      state.onchange = mockOnChange;

      state.stator.fill(0);
      expect(state.value).toEqual([0, 0, 0]);
      expect(mockOnChange).toHaveBeenCalled();
    });

    it("should trigger onchange for array fill with range", () => {
      const state = stator([1, 2, 3, 4, 5]);
      const mockOnChange = vi.fn();
      state.onchange = mockOnChange;

      state.stator.fill(0, 1, 4);
      expect(state.value).toEqual([1, 0, 0, 0, 5]);
      expect(mockOnChange).toHaveBeenCalled();
    });

    it("should trigger onchange for array copyWithin", () => {
      const state = stator([1, 2, 3, 4, 5]);
      const mockOnChange = vi.fn();
      state.onchange = mockOnChange;

      state.stator.copyWithin(0, 3);
      expect(state.value).toEqual([4, 5, 3, 4, 5]);
      expect(mockOnChange).toHaveBeenCalled();
    });

    it("should trigger onchange for index-based mutation", () => {
      const state = stator([1, 2, 3]);
      const mockOnChange = vi.fn();
      state.onchange = mockOnChange;

      state.stator[1] = 10;
      expect(state.value).toEqual([1, 10, 3]);
      expect(mockOnChange).toHaveBeenCalledWith([1, 10, 3]);
    });

    it("should trigger onchange for adding element via index", () => {
      const state = stator([1, 2, 3]);
      const mockOnChange = vi.fn();
      state.onchange = mockOnChange;

      state.stator[3] = 4;
      expect(state.value).toEqual([1, 2, 3, 4]);
      expect(mockOnChange).toHaveBeenCalledWith([1, 2, 3, 4]);
    });

    it("should trigger onchange for setting length property", () => {
      const state = stator([1, 2, 3, 4, 5]);
      const mockOnChange = vi.fn();
      state.onchange = mockOnChange;

      state.stator.length = 3;
      expect(state.value).toEqual([1, 2, 3]);
      expect(mockOnChange).toHaveBeenCalled();
    });

    it("should handle nested arrays", () => {
      const state = stator([[1, 2], [3, 4]]);
      const mockOnChange = vi.fn();
      state.onchange = mockOnChange;

      state.stator[0].push(10);
      const found = mockOnChange.mock.calls.some(call => {
        const arg = call[0];
        return Array.isArray(arg) && Array.isArray(arg[0]) && arg[0].includes(10);
      });
      expect(found).toBe(true);
    });

    it("should handle nested array index mutation", () => {
      const state = stator([[1, 2], [3, 4]]);
      const mockOnChange = vi.fn();
      state.onchange = mockOnChange;

      state.stator[1][0] = 30;
      const found = mockOnChange.mock.calls.some(call => {
        const arg = call[0];
        return Array.isArray(arg) && Array.isArray(arg[1]) && arg[1][0] === 30;
      });
      expect(found).toBe(true);
    });

    it("should handle array of objects with property mutation", () => {
      const state = stator([{ name: 'Alice' }, { name: 'Bob' }]);
      const mockOnChange = vi.fn();
      state.onchange = mockOnChange;

      state.stator[0].name = 'Charlie';
      const found = mockOnChange.mock.calls.some(call => {
        const arg = call[0];
        return Array.isArray(arg) && arg[0]?.name === 'Charlie';
      });
      expect(found).toBe(true);
    });

    it("should handle pushing objects to array", () => {
      const state = stator<{ id: number }[]>([{ id: 1 }]);
      const mockOnChange = vi.fn();
      state.onchange = mockOnChange;

      state.stator.push({ id: 2 });
      expect(state.value).toHaveLength(2);
      expect(state.value[1]).toEqual({ id: 2 });
      expect(mockOnChange).toHaveBeenCalled();
    });

    it("should maintain reactivity after pushing object", () => {
      const state = stator<{ id: number; value: string }[]>([]);
      const mockOnChange = vi.fn();
      state.onchange = mockOnChange;

      state.stator.push({ id: 1, value: 'initial' });
      mockOnChange.mockClear();

      state.stator[0].value = 'updated';
      const found = mockOnChange.mock.calls.some(call => {
        const arg = call[0];
        return Array.isArray(arg) && arg[0]?.value === 'updated';
      });
      expect(found).toBe(true);
    });

    it("should handle replacing entire array via value", () => {
      const state = stator([1, 2, 3]);
      const mockOnChange = vi.fn();
      state.onchange = mockOnChange;

      state.value = [4, 5, 6];
      expect(state.value).toEqual([4, 5, 6]);
      expect(mockOnChange).toHaveBeenCalledWith([4, 5, 6]);
    });

    it("should not trigger onchange when setting same primitive value", () => {
      const state = stator([1, 2, 3]);
      const mockOnChange = vi.fn();
      state.onchange = mockOnChange;

      state.stator[0] = 1; // Same value
      expect(mockOnChange).not.toHaveBeenCalled();
    });

    it("should handle delete on array element", () => {
      const state = stator([1, 2, 3]);
      const mockOnChange = vi.fn();
      state.onchange = mockOnChange;

      delete state.stator[1];
      expect(state.value[1]).toBeUndefined();
      expect(mockOnChange).toHaveBeenCalled();
    });

    it("should preserve array methods like map, filter, reduce", () => {
      const state = stator([1, 2, 3, 4, 5]);

      const doubled = state.stator.map((x: number) => x * 2);
      expect(doubled).toEqual([2, 4, 6, 8, 10]);

      const evens = state.stator.filter((x: number) => x % 2 === 0);
      expect(evens).toEqual([2, 4]);

      const sum = state.stator.reduce((acc: number, x: number) => acc + x, 0);
      expect(sum).toBe(15);
    });

    it("should preserve array methods like find, findIndex, includes", () => {
      const state = stator([{ id: 1 }, { id: 2 }, { id: 3 }]);

      const found = state.stator.find((x: { id: number }) => x.id === 2);
      expect(found).toEqual({ id: 2 });

      const index = state.stator.findIndex((x: { id: number }) => x.id === 3);
      expect(index).toBe(2);
    });

    it("should preserve array methods like every, some", () => {
      const state = stator([2, 4, 6, 8]);

      const allEven = state.stator.every((x: number) => x % 2 === 0);
      expect(allEven).toBe(true);

      const hasLarge = state.stator.some((x: number) => x > 5);
      expect(hasLarge).toBe(true);
    });

    it("should preserve array methods like forEach", () => {
      const state = stator([1, 2, 3]);
      const results: number[] = [];

      state.stator.forEach((x: number) => results.push(x * 2));
      expect(results).toEqual([2, 4, 6]);
    });

    it("should preserve array methods like concat, slice", () => {
      const state = stator([1, 2, 3]);

      const concatenated = state.stator.concat([4, 5]);
      expect(concatenated).toEqual([1, 2, 3, 4, 5]);
      expect(state.value).toEqual([1, 2, 3]); // Original unchanged

      const sliced = state.stator.slice(1, 3);
      expect(sliced).toEqual([2, 3]);
      expect(state.value).toEqual([1, 2, 3]); // Original unchanged
    });

    it("should preserve array methods like flat, flatMap", () => {
      const state = stator([[1, 2], [3, [4, 5]]]);

      const flattened = state.stator.flat();
      expect(flattened).toEqual([1, 2, 3, [4, 5]]);

      const deepFlat = state.stator.flat(2);
      expect(deepFlat).toEqual([1, 2, 3, 4, 5]);
    });

    it("should handle array with mixed types", () => {
      const state = stator([1, 'two', { three: 3 }, [4]]);
      const mockOnChange = vi.fn();
      state.onchange = mockOnChange;

      state.stator[2].three = 30;
      const found = mockOnChange.mock.calls.some(call => {
        const arg = call[0];
        return Array.isArray(arg) && arg[2]?.three === 30;
      });
      expect(found).toBe(true);
    });

    it("should handle empty array", () => {
      const state = stator<number[]>([]);
      const mockOnChange = vi.fn();
      state.onchange = mockOnChange;

      state.stator.push(1);
      expect(state.value).toEqual([1]);
      expect(mockOnChange).toHaveBeenCalledWith([1]);
    });

    it("should handle multiple consecutive array operations", () => {
      const state = stator([1, 2, 3]);
      const mockOnChange = vi.fn();
      state.onchange = mockOnChange;

      state.stator.push(4);
      state.stator.push(5);
      state.stator.pop();
      state.stator.unshift(0);

      expect(state.value).toEqual([0, 1, 2, 3, 4]);
      // Array methods may trigger multiple internal updates (index + length)
      // so we check that onchange was called at least once per operation
      expect(mockOnChange.mock.calls.length).toBeGreaterThanOrEqual(4);
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
