import type {
	DbCharacterLink,
	DBAgent,
	DbAgentOf,
	DbAgentPrompt,
	DbBook,
	DbBookPrompts,
	DbCategory,
	DbChapter,
	DbCharacter,
	DbCharacterChapterStatus,
	DbChat,
	DbTags,
	DbWritingGoal,
	PromptType,
	DbSpaces
} from '$types/db';
import type { DBMessage } from '$types/db';
import type { SettingsType } from '$types/settings.js';
import type { UserType } from '$types/user';
import {
	createIdbqDb,
	type IdbqModel,
	type Tpl,
	type DbFieldTypes,
	type TplFieldType
} from '@medyll/idae-idbql';

import type { DbDataModel, DbDataModelTs } from './dataModel.js';


// Schéma de test (copie explicite de schemeModelDb)
export const schemeModelTestDb = {
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
	}
	// Ajoute ici d'autres collections si besoin pour les tests
} satisfies DbDataModel;

export const schemeModelTest: IdbqModel = {
	...schemeModelTestDb
} as unknown as IdbqModel<typeof schemeModelTestDb>;

export type DataModelTestFinal = DbDataModelTs<typeof schemeModelTestDb>;

const idbqStore = createIdbqDb<typeof schemeModelTest>(schemeModelTest, 99);
export const { idbql, idbqlState, idbDatabase, idbqModel } = idbqStore.create('idae-machine-test');
