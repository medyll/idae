import { beforeEach, describe, expect, it } from 'vitest';
import { idbqlEvent } from './idbqlEvent.svelte.js';

describe('idbqlStateEvent', () => {
	let stateEvent: any;

	beforeEach(() => {
		stateEvent = idbqlEvent;
	});

	it("should register 'set' event and update dataState", () => {
		const collection = 'users';
		const data = [{ id: 1, name: 'John' }];
		stateEvent.registerEvent('set', { collection, data });
		expect(stateEvent.dataState[collection]).toEqual(data);
	});

	it("should register 'delete' event and remove data from dataState", () => {
		const collection = 'users';
		const data = [
			{ id: 1, name: 'John' },
			{ id: 2, name: 'Jane' }
		];
		const dataToDelete = { id: 2, name: 'Jane' };
		const keyPath = 'id';
		stateEvent.dataState[collection] = data;
		stateEvent.registerEvent('delete', {
			collection,
			data: dataToDelete,
			keyPath
		});
		expect(stateEvent.dataState[collection]).toEqual([{ id: 1, name: 'John' }]);
	});

	it("should register 'put' event and update data in dataState", () => {
		const collection = 'users';
		const data = [
			{ id: 1, name: 'John' },
			{ id: 2, name: 'Jane' }
		];
		const keyPath = 'id';
		const newData = { id: 2, name: 'Alice' };
		stateEvent.dataState[collection] = data;
		stateEvent.registerEvent('put', { collection, data: newData, keyPath });
		expect(stateEvent.dataState[collection]).toEqual([
			{ id: 1, name: 'John' },
			{ id: 2, name: 'Alice' }
		]);
	});

	it("should register 'add' event and add data to dataState", () => {
		const collection = 'users';
		const data = [{ id: 1, name: 'John' }];
		const newData = { id: 2, name: 'Jane' };
		stateEvent.dataState[collection] = data;
		stateEvent.registerEvent('add', { collection, data: newData });
		expect(stateEvent.dataState[collection]).toEqual([
			{ id: 1, name: 'John' },
			{ id: 2, name: 'Jane' }
		]);
	});
});
