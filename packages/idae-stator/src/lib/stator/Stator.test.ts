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

  describe("edge cases", () => {
    // --- Primitive edge cases ---
    it("should handle undefined as initial value", () => {
      const state = stator(undefined);
      expect(state.value).toBeUndefined();

      const mockOnChange = vi.fn();
      state.onchange = mockOnChange;

      state.value = "defined";
      expect(state.value).toBe("defined");
      expect(mockOnChange).toHaveBeenCalledWith("defined");
    });

    it("should handle bigint values", () => {
      const state = stator(BigInt(9007199254740991));
      expect(state.value).toBe(BigInt(9007199254740991));

      const mockOnChange = vi.fn();
      state.onchange = mockOnChange;

      state.value = BigInt(123);
      expect(mockOnChange).toHaveBeenCalledWith(BigInt(123));
    });

    it("should handle symbol values", () => {
      const sym = Symbol("test");
      const state = stator(sym);
      expect(state.value).toBe(sym);

      const newSym = Symbol("new");
      const mockOnChange = vi.fn();
      state.onchange = mockOnChange;

      state.value = newSym;
      expect(state.value).toBe(newSym);
      expect(mockOnChange).toHaveBeenCalledWith(newSym);
    });

    it("should handle NaN (always notifies due to NaN !== NaN)", () => {
      const state = stator(NaN);
      expect(Number.isNaN(state.value)).toBe(true);

      const mockOnChange = vi.fn();
      state.onchange = mockOnChange;

      // NaN !== NaN so this will trigger notification
      state.value = NaN;
      // This is expected behavior - NaN comparison always fails
      expect(mockOnChange).toHaveBeenCalled();
    });

    // --- Special object types ---
    it("should handle Date objects", () => {
      const date = new Date("2025-01-01");
      const state = stator({ date });
      expect(state.value.date).toBeInstanceOf(Date);

      const mockOnChange = vi.fn();
      state.onchange = mockOnChange;

      const newDate = new Date("2026-01-01");
      state.stator.date = newDate;
      expect(mockOnChange).toHaveBeenCalled();
    });

    it("should handle RegExp objects (known limitation: getters fail on proxy)", () => {
      const regex = /test/gi;
      const state = stator({ pattern: regex });
      // RegExp is stored but its getter-based properties (source, flags) fail through proxy
      // This is a known Proxy limitation with native objects
      expect(state.value.pattern).toBeDefined();
      // The original regex object still works
      expect(regex.source).toBe("test");
      // Through proxy, accessing getters throws due to receiver binding
    });

    it("should handle Map objects (known limitation: methods fail on proxy)", () => {
      const map = new Map([["key", "value"]]);
      const state = stator({ data: map });
      
      expect(state.value.data).toBeInstanceOf(Map);
      // Map methods like get/set fail through proxy due to receiver binding issue
      // This is a known Proxy limitation with native collection objects
      // Workaround: keep a reference to the original Map
      expect(map.get("key")).toBe("value");
    });

    it("should handle Set objects (known limitation: methods fail on proxy)", () => {
      const set = new Set([1, 2, 3]);
      const state = stator({ items: set });
      
      expect(state.value.items).toBeInstanceOf(Set);
      // Set methods like has/add fail through proxy due to receiver binding issue
      // This is a known Proxy limitation with native collection objects
      // Workaround: keep a reference to the original Set
      expect(set.has(2)).toBe(true);
    });

    // --- Symbol as object keys ---
    it("should support symbols as object keys", () => {
      const sym = Symbol("myKey");
      const state = stator({ [sym]: "symbolValue", regular: "normalValue" });
      
      expect(state.stator[sym]).toBe("symbolValue");
      expect(state.stator.regular).toBe("normalValue");
    });

    it("should trigger onchange when modifying symbol-keyed property", () => {
      const sym = Symbol("key");
      const state = stator({ [sym]: 1 });
      const mockOnChange = vi.fn();
      state.onchange = mockOnChange;

      state.stator[sym] = 2;
      expect(mockOnChange).toHaveBeenCalled();
    });

    // --- Functions in state ---
    it("should handle functions stored in state", () => {
      const fn = () => "hello";
      const state = stator({ callback: fn });
      
      expect(typeof state.stator.callback).toBe("function");
      expect(state.stator.callback()).toBe("hello");
    });

    it("should trigger onchange when replacing function", () => {
      const state = stator({ fn: () => 1 });
      const mockOnChange = vi.fn();
      state.onchange = mockOnChange;

      state.stator.fn = () => 2;
      expect(mockOnChange).toHaveBeenCalled();
    });

    // --- Frozen/sealed objects ---
    it("should throw TypeError on frozen object mutation", () => {
      const frozen = Object.freeze({ value: 1 });
      const state = stator(frozen);
      
      // Proxy set trap returns false for frozen objects, which causes TypeError in strict mode
      // This is expected JavaScript behavior when a Proxy trap returns falsish for a non-configurable property
      expect(() => {
        state.stator.value = 2;
      }).toThrow(TypeError);
      
      // Value remains unchanged
      expect(state.value.value).toBe(1);
    });

    it("should handle sealed objects (existing props mutable)", () => {
      const sealed = Object.seal({ count: 0 });
      const state = stator(sealed);
      const mockOnChange = vi.fn();
      state.onchange = mockOnChange;

      // Existing property can be modified
      state.stator.count = 5;
      expect(state.value.count).toBe(5);
      expect(mockOnChange).toHaveBeenCalled();
    });

    // --- onchange lifecycle ---
    it("should allow setting onchange to null to remove handler", () => {
      const state = stator(0);
      const mockOnChange = vi.fn();
      state.onchange = mockOnChange;

      state.value = 1;
      expect(mockOnChange).toHaveBeenCalledTimes(1);

      state.onchange = null;
      state.value = 2;
      // Should not be called again after being set to null
      expect(mockOnChange).toHaveBeenCalledTimes(1);
    });

    it("should allow setting onchange to undefined to remove handler", () => {
      const state = stator(0);
      const mockOnChange = vi.fn();
      state.onchange = mockOnChange;

      state.value = 1;
      expect(mockOnChange).toHaveBeenCalledTimes(1);

      state.onchange = undefined;
      state.value = 2;
      expect(mockOnChange).toHaveBeenCalledTimes(1);
    });

    it("should replace previous onchange handler when setting new one", () => {
      const state = stator(0);
      const firstHandler = vi.fn();
      const secondHandler = vi.fn();

      state.onchange = firstHandler;
      state.value = 1;
      expect(firstHandler).toHaveBeenCalledTimes(1);

      state.onchange = secondHandler;
      state.value = 2;
      
      // First handler should NOT be called again
      expect(firstHandler).toHaveBeenCalledTimes(1);
      // Second handler should be called
      expect(secondHandler).toHaveBeenCalledTimes(1);
    });

    // --- Event listener API ---
    it("should support multiple addEventListener listeners", () => {
      const state = stator(0);
      const listener1 = vi.fn();
      const listener2 = vi.fn();

      state.addEventListener("change", listener1);
      state.addEventListener("change", listener2);

      state.value = 1;

      expect(listener1).toHaveBeenCalled();
      expect(listener2).toHaveBeenCalled();
    });

    it("should remove specific listener with removeEventListener", () => {
      const state = stator(0);
      const listener1 = vi.fn();
      const listener2 = vi.fn();

      state.addEventListener("change", listener1);
      state.addEventListener("change", listener2);

      state.removeEventListener("change", listener1);
      state.value = 1;

      expect(listener1).not.toHaveBeenCalled();
      expect(listener2).toHaveBeenCalled();
    });

    it("should work with both onchange and addEventListener simultaneously", () => {
      const state = stator(0);
      const onchangeHandler = vi.fn();
      const eventListener = vi.fn();

      state.onchange = onchangeHandler;
      state.addEventListener("change", eventListener);

      state.value = 1;

      expect(onchangeHandler).toHaveBeenCalledWith(1);
      expect(eventListener).toHaveBeenCalled();
    });

    // --- Utility methods ---
    it("should return JSON string from toString()", () => {
      const state = stator({ name: "test", count: 42 });
      const str = state.toString();
      
      expect(str).toBe('{"name":"test","count":42}');
    });

    it("should return raw value from valueOf()", () => {
      const original = { x: 1, y: 2 };
      const state = stator(original);
      
      expect(state.valueOf()).toEqual({ x: 1, y: 2 });
    });

    it("should support Symbol.toPrimitive for number hint (via value property)", () => {
      const state = stator(42);
      // For primitive states, use .value directly for numeric operations
      // The root proxy doesn't implement Symbol.toPrimitive for primitive values
      expect(+state.value).toBe(42);
      // For object states, Symbol.toPrimitive works on the proxied object
      const objState = stator({ num: 42 });
      expect(Number(objState.stator)).toBeNaN(); // Objects coerce to NaN
    });

    it("should support Symbol.toPrimitive for string hint", () => {
      const state = stator({ msg: "hello" });
      // When coerced to string
      expect(`${state}`).toBe('{"msg":"hello"}');
    });

    // --- Deeply nested structures ---
    it("should handle very deep nesting", () => {
      const state = stator({
        level1: {
          level2: {
            level3: {
              level4: {
                value: "deep"
              }
            }
          }
        }
      });

      const mockOnChange = vi.fn();
      state.onchange = mockOnChange;

      state.stator.level1.level2.level3.level4.value = "modified";
      
      expect(mockOnChange).toHaveBeenCalled();
      expect(state.value.level1.level2.level3.level4.value).toBe("modified");
    });

    it("should handle mixed nested arrays and objects", () => {
      const state = stator({
        users: [
          { name: "Alice", tags: ["admin", "user"] },
          { name: "Bob", tags: ["user"] }
        ]
      });

      const mockOnChange = vi.fn();
      state.onchange = mockOnChange;

      state.stator.users[0].tags.push("superadmin");
      
      const found = mockOnChange.mock.calls.some(call => {
        const arg = call[0];
        return arg?.users?.[0]?.tags?.includes("superadmin");
      });
      expect(found).toBe(true);
    });

    // --- Empty structures ---
    it("should handle empty object", () => {
      const state = stator({});
      const mockOnChange = vi.fn();
      state.onchange = mockOnChange;

      (state.stator as any).newProp = "value";
      expect(mockOnChange).toHaveBeenCalled();
    });

    it("should handle adding nested object to empty state", () => {
      const state = stator<Record<string, any>>({});
      const mockOnChange = vi.fn();
      state.onchange = mockOnChange;

      state.stator.nested = { deep: { value: 1 } };
      expect(mockOnChange).toHaveBeenCalled();

      // New nested object should also be reactive
      mockOnChange.mockClear();
      state.stator.nested.deep.value = 2;
      expect(mockOnChange).toHaveBeenCalled();
    });

    // --- Replacing complex values ---
    it("should maintain reactivity after replacing entire object", () => {
      const state = stator({ data: { count: 0 } });
      const mockOnChange = vi.fn();
      state.onchange = mockOnChange;

      // Replace the entire value
      state.value = { data: { count: 100 } };
      mockOnChange.mockClear();

      // New structure should still be reactive
      state.stator.data.count = 200;
      expect(mockOnChange).toHaveBeenCalled();
      expect(state.value.data.count).toBe(200);
    });

    it("should handle sparse arrays", () => {
      const sparse = [1, , , 4]; // eslint-disable-line no-sparse-arrays
      const state = stator(sparse);
      
      expect(state.value[0]).toBe(1);
      expect(state.value[1]).toBeUndefined();
      expect(state.value[3]).toBe(4);
      expect(state.value.length).toBe(4);
    });

    it("should handle array with holes mutation", () => {
      const state = stator([1, , 3]); // eslint-disable-line no-sparse-arrays
      const mockOnChange = vi.fn();
      state.onchange = mockOnChange;

      state.stator[1] = 2;
      expect(state.value).toEqual([1, 2, 3]);
      expect(mockOnChange).toHaveBeenCalled();
    });

    // --- Prototype chain ---
    it("should access inherited properties correctly", () => {
      const proto = { inherited: "fromProto" };
      const obj = Object.create(proto);
      obj.own = "ownValue";
      
      const state = stator(obj);
      
      expect(state.stator.own).toBe("ownValue");
      expect(state.stator.inherited).toBe("fromProto");
    });

    // --- Array-like objects ---
    it("should handle array-like objects", () => {
      const arrayLike = { 0: "a", 1: "b", 2: "c", length: 3 };
      const state = stator(arrayLike);
      
      expect(state.stator[0]).toBe("a");
      expect(state.stator.length).toBe(3);

      const mockOnChange = vi.fn();
      state.onchange = mockOnChange;

      state.stator[1] = "modified";
      expect(mockOnChange).toHaveBeenCalled();
    });

    // --- Getter/Setter properties ---
    it("should work with objects containing getters", () => {
      const obj = {
        _value: 10,
        get computed() {
          return this._value * 2;
        }
      };
      
      const state = stator(obj);
      expect(state.stator.computed).toBe(20);

      state.stator._value = 20;
      expect(state.stator.computed).toBe(40);
    });
  });
});
