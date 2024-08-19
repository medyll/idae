// packages\idae-db\lib\IdaeDBModel.ts
import { Collection, Document } from "mongodb";
import { IdaeDbConnection } from "./IdaeDbConnection";

export class IdaeDBModel<T extends Document> {
  private _collection: Collection<T>;
  private _autoIncrementField: string | undefined = undefined;
  private _fieldId: string = "_id";

  constructor(
    connection: IdaeDbConnection,
    collectionName: string,
    options?: { autoIncrementFormat?: (collection: string) => string }
  ) {
    this._collection = connection.getDb().collection<T>(collectionName);

    this._autoIncrementField = options?.autoIncrementFormat?.(collectionName);
    this._fieldId = this._autoIncrementField ?? "_id";
  }

  get collection(): Collection<T> {
    return this._collection;
  }

  get fieldId(): string | undefined {
    return this._fieldId;
  }
}
