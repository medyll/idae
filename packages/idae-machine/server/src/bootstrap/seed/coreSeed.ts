/**
 * idaeCoreSeed — system-wide catalog data (AI providers/models/tools/statuses,
 * companions, tags, image presets). Same as a per-org `<org>Seed`: published
 * via seedBusinessData() against buildEngineModel(), which routes each
 * collection to its `base` (machine_ai / machine_app) and folds FKs via
 * foldFks (scalar id refs, referentials before dependents).
 */

export const idaeCoreSeed = {
	ai_provider: [
		{ id: 1, code: 'ollama',    name: 'Ollama',    endpoint: 'http://localhost:11434',   order: 10 },
		{ id: 2, code: 'anthropic', name: 'Anthropic', endpoint: 'https://api.anthropic.com', order: 20 },
	],

	ai_model: [
		{ id: 1, code: 'llama3',         name: 'Llama 3',         ai_provider: 1, supports_tools: false, order: 10 },
		{ id: 2, code: 'mistral',        name: 'Mistral',         ai_provider: 1, supports_tools: false, order: 20 },
		{ id: 3, code: 'claude-3-haiku', name: 'Claude 3 Haiku',  ai_provider: 2, supports_tools: true,  order: 30 },
	],

	// Phase 1b/2b agent tool surface (AgentRouter buildTools, §12-13). hitl=true
	// gates a tool behind the confirm/cancel resume flow (delete/restore).
	ai_tool: [
		{ id: 1, code: 'find',        name: 'Find',        description: 'Query records in a collection.',  hitl: false, order: 10 },
		{ id: 2, code: 'get_by_id',   name: 'Get by id',   description: 'Get a single record by its id.',  hitl: false, order: 20 },
		{ id: 3, code: 'count',       name: 'Count',       description: 'Count records matching a query.', hitl: false, order: 30 },
		{ id: 4, code: 'distinct',    name: 'Distinct',    description: 'Distinct values of a field.',     hitl: false, order: 40 },
		{ id: 5, code: 'aggregate',   name: 'Aggregate',   description: 'Run an aggregation pipeline.',    hitl: false, order: 50 },
		{ id: 6, code: 'create',      name: 'Create',      description: 'Insert a new record.',            hitl: false, order: 60 },
		{ id: 7, code: 'update_by_id', name: 'Update',     description: 'Update a record by id.',          hitl: false, order: 70 },
		{ id: 8, code: 'delete_by_id', name: 'Delete',     description: 'Soft-delete a record by id.',     hitl: true,  order: 80 },
		{ id: 9, code: 'restore',     name: 'Restore',     description: 'Restore a soft-deleted record.',  hitl: true,  order: 90 },
	],

	ai_chat_session_status: [
		{ id: 1, code: 'idle',      name: 'Idle',      order: 10 },
		{ id: 2, code: 'streaming', name: 'Streaming', order: 20 },
		{ id: 3, code: 'done',      name: 'Done',      order: 30 },
		{ id: 4, code: 'error',     name: 'Error',     order: 40 },
	],

	ai_message_status: [
		{ id: 1, code: 'streaming', name: 'Streaming', order: 10 },
		{ id: 2, code: 'done',      name: 'Done',      order: 20 },
		{ id: 3, code: 'error',     name: 'Error',     order: 30 },
	],

	ai_tool_call_status: [
		{ id: 1, code: 'pending',   name: 'Pending',   order: 10 },
		{ id: 2, code: 'running',   name: 'Running',   order: 20 },
		{ id: 3, code: 'done',      name: 'Done',      order: 30 },
		{ id: 4, code: 'error',     name: 'Error',     order: 40 },
		{ id: 5, code: 'cancelled', name: 'Cancelled', order: 50 },
	],

	ai_companion: [
		{
			id: 1, code: 'general-assistant', name: 'General Assistant',
			system_prompt: 'You are a helpful AI assistant.',
			ai_model: 1, is_active: true, order: 10,
		},
		{
			id: 2, code: 'code-expert', name: 'Code Expert',
			system_prompt: 'You are an expert programmer who provides clear, concise code examples.',
			ai_model: 2, is_active: true, order: 20,
		},
	],

	tag: [
		{ id: 1, code: 'work',     name: 'Work',     color: '#4285F4', icon: 'briefcase',      order: 10 },
		{ id: 2, code: 'personal', name: 'Personal', color: '#34A853', icon: 'user',           order: 20 },
		{ id: 3, code: 'learning', name: 'Learning', color: '#FBBC05', icon: 'graduation-cap', order: 30 },
		{ id: 4, code: 'fun',      name: 'Fun',       color: '#EA4335', icon: 'gamepad',        order: 40 },
	],

	appimage_preset: [
		{ id: 1, code: 'thumb',  name: 'Vignette',  width: 150,  height: 150, fit: 'cover',  format: 'auto', quality: 82, auto: false, scope: 'global', order: 10 },
		{ id: 2, code: 'square', name: 'Carré',     width: 120,  height: 120, fit: 'cover',  format: 'auto', quality: 82, auto: false, scope: 'global', order: 20 },
		{ id: 3, code: 'small',  name: 'Petit',     width: 480,               fit: 'inside', format: 'auto', quality: 82, auto: false, scope: 'global', order: 30 },
		{ id: 4, code: 'medium', name: 'Moyen',     width: 1024,              fit: 'inside', format: 'auto', quality: 82, auto: false, scope: 'global', order: 40 },
		{ id: 5, code: 'large',  name: 'Grand',     width: 2048,              fit: 'inside', format: 'auto', quality: 82, auto: false, scope: 'global', order: 50 },
		{ id: 6, code: 'banner', name: 'Bannière',  width: 1920, height: 480, fit: 'cover',  format: 'auto', quality: 82, auto: false, scope: 'global', order: 60 },
		{ id: 7, code: 'avatar', name: 'Avatar',    width: 256,  height: 256, fit: 'cover',  format: 'auto', quality: 82, auto: false, scope: 'global', order: 70 },
	],
};

export default idaeCoreSeed;
