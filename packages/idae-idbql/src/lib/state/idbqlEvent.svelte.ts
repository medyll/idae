type EventType = 'add' | 'put' | 'update' | 'updateWhere' | 'delete' | 'deleteWhere' | 'set';

interface EventData<T = any> {
	collection: string;
	data: T;
	keyPath: string;
}
class IdbqlStateEvent {
	#dataState = $state<Record<string, any[]>>({});

	get dataState() {
		return this.#dataState;
	}

	registerEvent(event: EventType, eventData: EventData) {
		const { collection, data, keyPath } = eventData;

		if (!collection) {
			console.error(`Collection is mandatory`);
			return;
		}

		if (!this.#dataState[collection]) {
			this.#dataState[collection] = [];
		}

		switch (event) {
			case 'set':
				if (data) {
					this.#dataState[collection] = Array.isArray(data) ? data : [data];
				}
				break;

			case 'add':
				if (data) {
					this.#dataState[collection].push(data);
				}
				break;

			case 'put':
			case 'update':
				if (data && keyPath) {
					const index = this.#dataState[collection].findIndex(
						(item) => item[keyPath] === data[keyPath]
					);
					if (index !== -1) {
						this.#dataState[collection][index] = {
							...this.#dataState[collection][index],
							...data
						};
					} else {
						this.#dataState[collection].push(data);
					}
				}
				break;

			case 'updateWhere':
				if (data && typeof data === 'object') {
					this.#dataState[collection] = this.#dataState[collection].map((item) =>
						Object.entries(data).every(([key, value]) => item[key] === value)
							? { ...item, ...data }
							: item
					);
				}
				break;

			case 'delete':
				if (data && keyPath) {
					this.#dataState[collection] = this.#dataState[collection].filter(
						(item) => item[keyPath] !== data[keyPath]
					);
				}
				break;

			case 'deleteWhere':
				if (data && typeof data === 'object') {
					this.#dataState[collection] = this.#dataState[collection].filter(
						(item) => !Object.entries(data).every(([key, value]) => item[key] === value)
					);
				}
				break;

			default:
				console.error(`Unhandled event type: ${event}`);
		}
	}
}

export const idbqlEvent = new IdbqlStateEvent();
