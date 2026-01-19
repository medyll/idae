// machine.spec.ts
import { describe, it, expect } from "vitest";
import { Machine } from "./machine.js";
import { MachineDb } from "$lib/main/machineDb.js";

// Copie simplifiée de schemeModel pour le test
const testSchemeModel = {
  collections: {
    test: {
      fields: {
        id: { type: "number" },
        name: { type: "string" },
      },
    },
  },
};

describe("Machine", () => {
  it("should initialize and expose core properties", () => {
    const machine = new Machine("test-db", 1, testSchemeModel as any);
    machine.start();
    expect(machine.collections).toBeInstanceOf(MachineDb);

    expect(machine.collections).toBeDefined();
    expect(machine.idbql).toBeDefined();
    expect(machine.store).toBeDefined();
    expect(machine.idbqModel).toBeDefined();
    expect(machine.logic).toBeDefined();
    expect(machine.collections).toBeDefined();
    expect(machine.indexedb).toBeDefined();

    // Test d'instance

    // Pour idbql, idbqlState, indexedb, idbqModel : on vérifie le type object
    expect(typeof machine.idbql).toBe("object");
    expect(typeof machine.idbqlState).toBe("object");
    expect(typeof machine.indexedb).toBe("object");
    expect(typeof machine.idbqModel).toBe("object");
    expect(typeof machine.collections).toBe("object");
    expect(typeof machine.logic).toBe("object");
  });
});
