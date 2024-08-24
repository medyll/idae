// packages\idae-db\lib\IdaeDBModel.ts
import type { Collection, Db, Document } from 'mongodb';
import { IdaeDbConnection } from './IdaeDbConnection.js';
import { IdaeDb } from './idaeDb.js';

export interface IdaeModelOptions {
	autoIncrementFormat?: (collection: string) => string;
	autoIncrementDbCollection?: string;
}
// models are attached to a connection
export class IdaeDBModel<T> {
	private _collection: Collection<T extends Document ? Document : any>;
	private _autoIncrementField: string | undefined = undefined;
	private _autoIncrementDbCollection: string | undefined = undefined;
	private _fieldId: string = '_id';

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
