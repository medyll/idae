import type { MachineModel } from '$lib/types/index.js'

export const tagScheme: MachineModel = {
  tag: {
    keyPath: '++id', base: 'machine_ai',
    fields: {
      id:          { type: 'id',   readonly: true },
      code:        { type: 'text', required: true },
      name:        { type: 'text', required: true },
      color:       { type: 'text' },
      description: { type: 'text' },
    },
    fkRelations: {},
    template: { presentation: 'name code' },
  },
}