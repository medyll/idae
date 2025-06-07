// EntityDBModel: Dynamic, cacheable, auto-incremented Mongoose model factory for multi-DB NestJS APIs
import * as mongoose from 'mongoose';
import { DatabaseService } from 'src/database/database.service';

export interface EntityModelOptions {
  autoIncrementField?: string;
  autoIncrementDbCollection?: string;
}

export class EntityDBModel<T extends object> {
  private _model: mongoose.Model<T>;
  private _autoIncrementField: string;
  private _autoIncrementDbCollection: string;
  private _fieldId: string;
  private connection: mongoose.Connection;

  constructor(
    private databaseService: DatabaseService,
    private entity: string,
    private base: string,
    options?: Partial<EntityModelOptions>,
  ) {
    this._autoIncrementField = options?.autoIncrementField || 'id';
    this._autoIncrementDbCollection = options?.autoIncrementDbCollection || 'auto_increment';
    this._fieldId = this._autoIncrementField;
    this.connection = this.databaseService.getConnection(this.base);
    const schema = this.getSchema();
    this._model = this.connection.model<T>(this.entity, schema, this.entity);
  }

  getSchema(): mongoose.Schema {
    const schema = new mongoose.Schema({}, { strict: false });
    // Use require to avoid TypeScript plugin issues
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const AutoIncrementFactory = require('mongoose-sequence');
    const AutoIncrement = AutoIncrementFactory(
      this.databaseService.getIncrementConnection(),
    );
    schema.plugin(AutoIncrement, {
      inc_field: this._autoIncrementField,
      id: `${this.base}_${this.entity}_seq`,
      collection_name: this._autoIncrementDbCollection,
    });
    return schema;
  }

  get model(): mongoose.Model<T> {
    return this._model;
  }

  get fieldId(): string {
    return this._fieldId;
  }

  get collectionName(): string {
    return this.entity;
  }

  static getEntityModel(
    databaseService: DatabaseService,
    entity: string,
    base: string,
    options?: Partial<EntityModelOptions>,
  ): EntityDBModel<any> {
    return EntityDBModelCache.getInstance().getOrCreate(
      databaseService,
      entity,
      base,
      options,
    );
  }
}

export class EntityDBModelCache {
  private static instance: EntityDBModelCache;
  private modelCache: { [key: string]: EntityDBModel<any> } = {};

  private constructor() {}

  static getInstance(): EntityDBModelCache {
    if (!EntityDBModelCache.instance) {
      EntityDBModelCache.instance = new EntityDBModelCache();
    }
    return EntityDBModelCache.instance;
  }

  getOrCreate(
    databaseService: DatabaseService,
    entity: string,
    base: string,
    options?: Partial<EntityModelOptions>,
  ): EntityDBModel<any> {
    const autoIncField = options?.autoIncrementField || 'id';
    const autoIncColl = options?.autoIncrementDbCollection || 'auto_increment';
    const cacheKey = `${base}_${entity}_${autoIncField}_${autoIncColl}`;
    if (!this.modelCache[cacheKey]) {
      this.modelCache[cacheKey] = new EntityDBModel(
        databaseService,
        entity,
        base,
        options,
      );
    }
    return this.modelCache[cacheKey];
  }
}
