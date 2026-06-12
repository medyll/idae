import type { MachineModel } from '@medyll/idae-machine'

export const aiCatalogScheme: MachineModel = {
  // ── Provider ───────────────────────────────────────────────────────────
  ai_provider: {
    keyPath: '++id', base: 'machine_ai', isType: true,
    fields: {
      id:          { type: 'id',   readonly: true },
      code:        { type: 'text', required: true },
      name:        { type: 'text', required: true },
      endpoint:    { type: 'text' },
      api_key_env: { type: 'text' },
    },
    fks: {}, template: { presentation: 'name code' },
  },

  // ── Model (catalog — replaces every free-text `model` field) ───────────
  ai_model: {
    keyPath: '++id', base: 'machine_ai', isType: true,
    fields: {
      id:             { type: 'id',      readonly: true },
      code:           { type: 'text',    required: true },
      name:           { type: 'text',    required: true },
      supports_tools: { type: 'boolean' },
      context_size:   { type: 'number' },
      is_active:      { type: 'boolean' },
    },
    fks: {
      ai_provider: { code: 'ai_provider', multiple: false, required: true },
    },
    template: { presentation: 'name ai_provider supports_tools' },
  },

  ai_mood: {
    keyPath: '++id', base: 'machine_ai', isType: true,
    fields: { id: { type: 'id', readonly: true }, code: { type: 'text', required: true }, name: { type: 'text', required: true } },
    fks: {}, template: { presentation: 'name' },
  },

  ai_voice: {
    keyPath: '++id', base: 'machine_ai', isType: true,
    fields: {
      id: { type: 'id', readonly: true }, code: { type: 'text', required: true }, name: { type: 'text', required: true },
      tone: { type: 'text' },
    },
    fks: {}, template: { presentation: 'name tone' },
  },

  ai_specialization: {
    keyPath: '++id', base: 'machine_ai', isType: true,
    fields: { id: { type: 'id', readonly: true }, code: { type: 'text', required: true }, name: { type: 'text', required: true }, description: { type: 'text' } },
    fks: {}, template: { presentation: 'name' },
  },

  // ── Tool catalog (MCP tools surfaced as records; hitl flag = HITL policy) ─
  ai_tool: {
    keyPath: '++id', base: 'machine_ai', isType: true,
    fields: {
      id:   { type: 'id',   readonly: true },
      code: { type: 'text', required: true },
      name: { type: 'text', required: true },
      hitl: { type: 'boolean' },
    },
    fks: {}, template: { presentation: 'name code hitl' },
  },

  // ── Extensibility catalogs (phase 2 engines read these) ────────────────
  ai_skill: {
    keyPath: '++id', base: 'machine_ai',
    fields: { id: { type: 'id', readonly: true }, code: { type: 'text', required: true }, name: { type: 'text', required: true }, description: { type: 'text' }, is_active: { type: 'boolean' } },
    fks: {}, template: { presentation: 'name code' },
  },

  ai_hook: {
    keyPath: '++id', base: 'machine_ai',
    fields: { id: { type: 'id', readonly: true }, code: { type: 'text', required: true }, name: { type: 'text', required: true }, event: { type: 'text' }, is_active: { type: 'boolean' } },
    fks: {}, template: { presentation: 'name event' },
  },

  // ── Status catalogs (isStatus → hasStatus capability, status UI) ────────
  ai_chat_session_status: {
    keyPath: '++id', base: 'machine_ai', isStatus: true,
    fields: { id: { type: 'id', readonly: true }, code: { type: 'text', required: true }, name: { type: 'text', required: true }, ordre: { type: 'number' }, color: { type: 'text' } },
    fks: {}, template: { presentation: 'name code ordre' },
  },

  ai_message_status: {
    keyPath: '++id', base: 'machine_ai', isStatus: true,
    fields: { id: { type: 'id', readonly: true }, code: { type: 'text', required: true }, name: { type: 'text', required: true }, ordre: { type: 'number' }, color: { type: 'text' } },
    fks: {}, template: { presentation: 'name code ordre' },
  },

  ai_tool_call_status: {
    keyPath: '++id', base: 'machine_ai', isStatus: true,
    fields: { id: { type: 'id', readonly: true }, code: { type: 'text', required: true }, name: { type: 'text', required: true }, ordre: { type: 'number' }, color: { type: 'text' } },
    fks: {}, template: { presentation: 'name code ordre' },
  },
}