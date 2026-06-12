import type { MachineModel } from '@medyll/idae-machine'

export const aiMessageScheme: MachineModel = {
  ai_message: {
    keyPath: '++id', base: 'machine_ai',
    fields: {
      id:            { type: 'id',   readonly: true },
      code:          { type: 'text', required: true },
      role:          { type: 'text', required: true },
      content:       { type: 'textarea' },
      token_count:   { type: 'number' },
      collection:    { type: 'text' },
      collectionId:  { type: 'text' },
    },
    fks: {
      ai_chat_session: { code: 'ai_chat_session', multiple: false, required: true },
      ai_model:        { code: 'ai_model',        multiple: false, required: false },
      ai_message_status: { code: 'ai_message_status', multiple: false, required: false },
      ai_tool_call:    { code: 'ai_tool_call',    multiple: true,  required: false },
    },
    template: { presentation: 'role content ai_message_status' },
  },
}