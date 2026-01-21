import type { IdbqModel } from "@medyll/idae-idbql";

 

 
 


// Schéma de test (copie explicite de schemeModelDb)
export const testScheme = {
	agent: {
 		keyPath: '++id, promptId, created_at',
 		model: {} ,
 		ts: {} ,
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
 				agentPromptId: 'fk-agentPrompt.id (required)',
 				tags: 'array-of-text', // array field
 				meta: 'object-any',    // object field
 				relatedAgents: 'array-of-fk-agent.id', // fk multiple
 				status: 'text (required readonly)'
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
		model: {} ,
		ts: {} ,
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
	} 
} satisfies IdbqModel;
 
