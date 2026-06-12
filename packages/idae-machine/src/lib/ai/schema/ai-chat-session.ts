import type { MachineModel } from '@medyll/idae-machine'

export const aiChatSessionScheme: MachineModel = {
  ai_chat_session: {
    keyPath: '++id', base: 'machine_ai',
    fields: {
      id:            { type: 'id',   readonly: true },
      code:          { type: 'text', required: true },
      title:         { type: 'text' },
      description:   { type: 'text' },
      category:      { type: 'text' },
      collection:    { type: 'text' },
      collectionId:  { type: 'text' },
      system_prompt: { type: 'textarea' },
      context:       { type: 'json' },
      token_count:   { type: 'number' },
    },
    fks: {
      ai_companion:           { code: 'ai_companion',           multiple: false, required: true },
      ai_model:               { code: 'ai_model',               multiple: false, required: false },
      ai_chat_session_status: { code: 'ai_chat_session_status', multiple: false, required: false },
      tag:                    { code: 'tag',                    multiple: true,  required: false },
    },
    template: { presentation: 'title ai_chat_session_status code' },
  },
}