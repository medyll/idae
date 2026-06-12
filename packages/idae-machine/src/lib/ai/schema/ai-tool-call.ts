import type { MachineModel } from '@medyll/idae-machine'

export const aiToolCallScheme: MachineModel = {
  ai_tool_call: {
    keyPath: '++id', base: 'machine_ai',
    fields: {
      id:            { type: 'id',   readonly: true },
      code:          { type: 'text', required: true },
      args:          { type: 'json' },
      result:        { type: 'json' },
      error:         { type: 'text' },
    },
    fks: {
      ai_message:        { code: 'ai_message',        multiple: false, required: true },
      ai_tool:           { code: 'ai_tool',           multiple: false, required: true },
      ai_tool_call_status: { code: 'ai_tool_call_status', multiple: false, required: false },
    },
    template: { presentation: 'ai_tool ai_tool_call_status' },
  },
}