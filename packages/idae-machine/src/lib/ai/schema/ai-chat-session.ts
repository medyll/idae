import type { MachineModel } from '$lib/types/index.js'

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
    fkRelations: {
      ai_companion:           { code: 'ai_companion', required: true },
      ai_model:               { code: 'ai_model', required: false },
      ai_chat_session_status: { code: 'ai_chat_session_status', required: false },
    },
    template: { presentation: 'title ai_chat_session_status code' },
  },
  ai_chat_session_has_tag: {
    keyPath: '++id', base: 'machine_ai',
    fields: {
      id:   { type: 'id', readonly: true },
      code: { type: 'text', required: true },
    },
    fkRelations: {
      ai_chat_session: { code: 'ai_chat_session', required: true },
      tag:             { code: 'tag', required: true },
    },
    template: { presentation: 'fks.ai_chat_session.code fks.tag.code' },
  },
}