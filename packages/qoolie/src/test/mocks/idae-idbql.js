// Mock for @medyll/idae-idbql

export function createDb(model, version) {
  return {
    create: (name) => ({
      idbDatabase: {
        idbql: model,
        idbqlState: {},
        qolie: {},
        idbqModel: model,
      },
      idbql: model,
      idbqlState: {},
      qolie: {},
      idbqModel: model,
    }),
  };
}
