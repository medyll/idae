import type { MachineModel } from '$lib/types/index.js'

export const aiUserPromptScheme: MachineModel = {
  ai_user_prompt: {
    keyPath: '++id', base: 'machine_ai',
    fields: {
      id:            { type: 'id',   readonly: true },
      code:          { type: 'text', required: true },
      name:          { type: 'text', required: true },
      content:       { type: 'textarea', required: true },
      is_active:     { type: 'boolean' },
      is_system:     { type: 'boolean' },
    },
    fkRelations: {
      appuser: { code: 'appuser', multiple: false, required: false },
    },
    template: { presentation: 'name code is_active' },
  },
}