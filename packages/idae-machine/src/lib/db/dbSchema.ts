import type { 
	DBAgent,
	DbAgentOf,
	DbAgentPrompt, 
	DbCategory, 
	DbChat,
	DbTags, 
	PromptType, 
	DBMessage,
	UserType
} from '$lib/demo/types.js';  
import { 
	type IdbqModel, 
} from '@medyll/idae-idbql';



/* here is an example of how to declare a dataModel*/
export const schemeModelDb = {
	agent: {
		keyPath: '++id, promptId, created_at',
		model: {} as DBAgent,
		ts: {} as DBAgent,
		template: {
			index: 'id',
			presentation: 'name model',
			fields: {
				id: 'id (readonly)',
				name: 'text (private)',
				code: 'text',
				model: 'text',
				prompt: 'text-long',
				created_at: 'date (private)',
				ia_lock: 'boolean (private)',
				agentPromptId: 'fk-agentPrompt.id (required)'
			},
			fks: {
				agentPrompt: {
					code: 'agentPrompt',
					rules: 'readonly private',
					multiple: true
				}
			}
		}
	},
	agentPrompt: {
		keyPath: '++id, created_at',
		model: {} as DbAgentPrompt,
		ts: {} as DbAgentPrompt,
		template: {
			index: 'id',
			presentation: 'name',
			fields: {
				id: 'id (readonly)',
				created_at: 'date (private)',
				value: 'text-long (required)',
				name: 'text (required)',
				code: 'text (required)',
				ia_lock: 'boolean (private)'
			},
			fks: {}
		}
	},
	agentOf: {
		keyPath: '++id, created_at',
		model: {} as DbAgentOf,
		ts: {} as DbAgentOf,
		template: {
			index: 'id',
			presentation: 'name',
			fields: {
				code: 'text',
				name: 'text',
				context: 'array-of-number'
			},
			fks: {}
		}
	},
	chat: {
		keyPath: '++id, &chatId, &chatPassKey, created_at, category, categoryId, dateLastMessage',
		model: {} as DbChat,
		ts: {} as DbChat,
		template: {
			index: 'id',
			presentation: 'name',
			fields: {
				id: 'id',
				chatId: 'fk.chat.id ',
				chatPassKey: 'text',
				created_at: 'date',
				category: 'text',
				categoryId: 'id',
				dateLastMessage: 'date',
				name: 'text',
				description: 'text',
				ia_lock: 'boolean',
				spaceId: 'fk-space.id (required)'
			},
			fks: {
				space: {
					code: 'text',
					rules: 'private required',
					multiple: false
				}
			}
		}
	},
	category: {
		keyPath: '++id, code',
		model: {} as DbCategory,
		ts: {} as DbCategory,
		template: {
			index: 'id',
			presentation: 'name',
			fields: {
				id: 'id',
				code: 'text',
				name: 'text',
				ia_lock: 'boolean (private)'
			},
			fks: {}
		}
	},
	tags: {
		keyPath: '++id, code',
		model: {} as DbTags,
		ts: {} as DbTags,
		template: {
			index: 'id',
			presentation: 'name',
			fields: {
				id: 'id',
				code: 'text',
				name: 'text',
				ia_lock: 'boolean (private)'
			},
			fks: {}
		}
	},
	messages: {
		keyPath: '++id, messageId, chatId, created_at',
		model: {} as DBMessage,
		ts: {} as DBMessage,
		template: {
			index: 'id',
			presentation: 'resume',
			fields: {
				id: 'id',
				chatId: 'id',
				messageId: 'id',
				created_at: 'date',
				content: 'text-long',
				status: 'text',
				context: 'array-of-number',
				resume: 'text',
				model: 'text',
				ia_lock: 'boolean'
			},
			fks: {}
		}
	},
	prompts: {
		keyPath: '++id, created_at',
		model: {} as PromptType,
		ts: {} as PromptType,
		template: {
			index: 'id',
			presentation: 'name',
			fields: {
				id: 'id',
				name: 'text',
				code: 'text',
				value: 'text',
				created_at: 'date',
				ia_lock: 'boolean'
			},
			fks: {}
		}
	},
	settings: {
		keyPath: '++id, userId',
		model: {} as SettingsType,
		ts: {} as SettingsType,
		template: {
			index: 'id',
			presentation: 'code',
			fields: {
				id: 'id',
				userId: 'id',
				created_at: 'date (readonly)',
				updated_at: 'date (readonly)',
				code: 'text',
				value: 'text',
				ia_lock: 'boolean (private)'
			},
			fks: {}
		}
	},
	user: {
		keyPath: '++id, created_at, email',
		model: {} as UserType,
		ts: {} as UserType,
		template: {
			index: 'id',
			presentation: 'email',
			fields: {
				id: 'id',
				name: 'text',
				color: 'text',
				created_at: 'date (readonly)',
				email: 'email',
				password: 'password',
				ia_lock: 'boolean (private)'
			},
			fks: {}
		}
	} 
} satisfies IdbqModel;


/* const idbqStore = createIdbqDb<typeof schemeModelDb>(schemeModelDb, 13);
export const { idbql,idbqlState , idbDatabase, idbqModel } = idbqStore.create('idae-machine');
 */

