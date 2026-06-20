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
    fks: {
      ai_model:          { code: 'ai_model',          multiple: false, required: true },
      appuser:           { code: 'appuser',           multiple: false, required: false },
      ai_mood:           { code: 'ai_mood',           multiple: false, required: false },
      ai_voice:          { code: 'ai_voice',          multiple: false, required: false },
      ai_specialization: { code: 'ai_specialization', multiple: false, required: false },
      ai_skill:          { code: 'ai_skill',          multiple: true,  required: false },
      ai_hook:           { code: 'ai_hook',           multiple: true,  required: false },
    },
    template: { presentation: 'name ai_model' },
  },
}