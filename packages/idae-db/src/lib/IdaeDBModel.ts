// packages\idae-db\lib\IdaeDBModel.ts
import type { Collection, Db } from 'mongodb';
import { IdaeDbConnection } from './IdaeDbConnection.js';
import { IdaeDb } from './idaeDb.js';

export interface IdaeModelOptions {
	autoIncrementFormat?: (collection: string) => string;
	autoIncrementDbCollection?: string;
}

/**
 * Models are attached to a connection.
 */
export class IdaeDBModel<T extends object> {
	private _collection: Collection<T>;
	private _autoIncrementField: string | undefined = undefined;
	private _autoIncrementDbCollection: string | undefined = undefined;
	private _fieldId: string = '_id';

	/**
	 * Creates an instance of IdaeDBModel.
	 * @param connection The database connection.
	 * @param _collectionName The name of the collection.
	 * @param options Optional model options.
	 */
	constructor(
		private connection: IdaeDbConnection,
		private _collectionName: string,
		options?: Partial<IdaeModelOptions>
	) {
		this._collection = (this.connection.getDb() as Db).collection<T>(_collectionName);

		this._autoIncrementField = options?.autoIncrementFormat?.(_collectionName);
		this._autoIncrementDbCollection = options?.autoIncrementDbCollection ?? 'auto_increment';
		this._fieldId = this._autoIncrementField ?? '_id';
	}

	get collection(): Collection<T> {
		return this._collection;
	}

	get collectionName(): string {
		return this._collectionName;
	}

	get fieldId(): string {
		return this._fieldId;
	}

	/**
	 * Gets the next auto-increment value.
	 * @returns The next increment value.
	 */
	async getNextIncrement() {
		const idaeAuto = IdaeDb.init(this.connection.idaeDb.uri, this.connection.idaeDb.options);
		const increment_name = 'increment';

		await idaeAuto.db(increment_name);
		const incrementCollection = idaeAuto.collection(this._autoIncrementDbCollection as string);
		// await incrementCollection.createIndex({ _id: 1 }, { unique: true });
		await incrementCollection.updateWhere(
			{ query: { _id: this.fieldId } },
			{ $inc: { value: 1 } },
			{ upsert: true }
		);

		const next = await incrementCollection.findOne({ query: { _id: this.fieldId } });
		return next?.value;
	}
}
