import { createIdbqDb } from '$lib/idbqlCore/idbqlCore.js';
import { type IdbqModel } from '$lib/idbqlCore/types.js';

/** define the data typings to activate autocomplete feature */
export type Chat = {
	id?:              number;
	chatId?:          string;
	title?:           string;
	models?:          string[];
	created_at?:      Date;
	dateLastMessage?: Date;
	context?:         number[];
};

export type ChatMessage = {
	id?:        string;
	chatId:     string;
	messageId?: string;
	content?:   string;
	images?:    string[];
	status?:    'done' | 'sent' | 'streaming' | 'error';
	context?:   number[];
	model?:     string;
};

/**
 * Define a model for the IndexedDB database and forward the types to the IndexedDB wrapper.
 */
const exampleModel: IdbqModel = {
	messages: {
		keyPath: '++id, chatId, created_at',
		ts:      {} as ChatMessage // this will provide autocompletion
	},
	chat:     {
		keyPath:  '&chatId, created_at, dateLastMessage',
		/* model: {}, i removed CollectionModel.model in favor of ts, it does only serve for typescript purposes */
		ts:       {} as Chat,
		template: {}
	}
} as const;

const idbqStore = createIdbqDb(exampleModel, 3);
// export const dbase = idbqStore.create("oneDatabase");
// or
export const { idbql, idbqlState, idbDatabase, idbqModel } = idbqStore.create('oneDatabase');
