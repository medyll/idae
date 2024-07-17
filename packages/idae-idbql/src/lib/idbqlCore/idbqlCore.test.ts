import { IdbqlIndexedCore } from './idbqlCore.js';
import { Collection } from '../collection/collection.js';
import { describe, beforeEach, afterEach, it, expect } from 'vitest';
import 'fake-indexeddb/auto';

describe('Idbq', () => {
	let idbq: IdbqlIndexedCore;
	let version: number = 1;
	let idbqModel = {
		chat: {
			keyPath: '&chatId, created_at, dateLastMessage' as any,
			model: {} as any
		},
		messages: {
			keyPath: '++id, chatId, created_at',
			model: {} as any
		}
	} as const;
	beforeEach(() => {
		idbq = new IdbqlIndexedCore('testDatabase', idbqModel, version);
	});

	afterEach(() => {});

	it('should create an instance of Idbq', () => {
		expect(idbq).toBeInstanceOf(IdbqlIndexedCore);
	});

	it('should create object stores based on the provided schema', async () => {
		version = version++;
		const schema = {
			chat: '&chatId, created_at, dateLastMessage',
			messages: '++id, chatId, created_at'
		};
		await idbq.stores(schema);

		expect(idbq.schema).toEqual(schema);
		//@ts-ignore
		expect(idbq.chat).toBeInstanceOf(Collection);
		//@ts-ignore
		expect(idbq.messages).toBeInstanceOf(Collection);
	});
});
