import type { MachineModel } from '$lib/types/index.js'

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
    fkRelations: {
      ai_message:        { code: 'ai_message', required: true },
      ai_tool:           { code: 'ai_tool', required: true },
      ai_tool_call_status: { code: 'ai_tool_call_status', required: false },
    },
    template: { presentation: 'ai_tool ai_tool_call_status' },
  },
}