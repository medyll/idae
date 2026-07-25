import type { MachineModel } from '$lib/types/index.js'

export const aiCompanionScheme: MachineModel = {
  ai_companion: {
    keyPath: '++id', base: 'machine_ai',
    fields: {
      id:            { type: 'id',     readonly: true },
      code:          { type: 'text',   required: true },
      name:          { type: 'text',   required: true },
      description:   { type: 'text' },
      system_prompt: { type: 'textarea' },
      temperature:   { type: 'number' },
      max_tokens:    { type: 'number' },
      is_active:     { type: 'boolean' },
      avatar:        { type: 'text' },
      is_locked:     { type: 'boolean' },
    },
    fkRelations: {
      ai_model:          { code: 'ai_model', required: true },
      appuser:           { code: 'appuser', required: false },
      ai_mood:           { code: 'ai_mood', required: false },
      ai_voice:          { code: 'ai_voice', required: false },
      ai_specialization: { code: 'ai_specialization', required: false },
    },
    template: { presentation: 'name ai_model' },
  },
}