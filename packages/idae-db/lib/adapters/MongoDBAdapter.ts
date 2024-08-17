// packages\idae-db\src\lib\adapters\MongoDBAdapter.ts

import dotenv from "dotenv";
import type {
  IdaeDbParams,
  IdaeDbAdapter,
  IdaeDbParamsSortOptions,
} from "./types.js";

import { Document, type Filter, type FindCursor } from "mongodb";
import { IdaeDbConnection } from "../IdaeDbConnection.js";
import { IdaeDBModel } from "../IdaeDBModel.js";

// Load environment variables
dotenv.config();

// MongoDB Adapter
export class MongoDBAdapter<T extends Document> implements IdaeDbAdapter<T> {
  private model: IdaeDBModel<T>;
  private connection: IdaeDbConnection;
  private fieldId;

  constructor(collection: string, connection: IdaeDbConnection) {
    // just in case
    collection = collection.split(".")[1] ?? collection.split(".")[0];

    this.connection = connection;
    this.model = this.connection.getModel<T>(collection);
    this.fieldId = this.model.fieldId;
  }

  async findById(id: string): Promise<FindCursor<T>> {
    return this.model.collection.find(
      { [this.fieldId]: id },
      { hint: this.fieldId }
    );
  }

  async find(params: IdaeDbParams<T>) {
    const { query = {}, sortBy, limit, skip } = params;
    const sortOptions: IdaeDbParamsSortOptions = this.parseSortOptions(sortBy);

    return await this.model.collection
      .find(query as Filter<T>)
      .sort(sortOptions)
      .limit(Number(limit) || 0)
      .skip(Number(skip) || 0);
  }

  findOne(params: IdaeDbParams<T>) {
    return this.model.collection.findOne(params.query);
  }

  async update(id: string, updateData: Partial<T>) {
    return this.model.collection.updateMany(
      { [this.fieldId]: id },
      updateData,
      {
        new: true,
      }
    );
  }

  async deleteById(id: string): Promise<T | null> {
    return this.model.collection.deleteMany({ _id: { $eq: id } });
  }

  async deleteManyByQuery(
    params: IdaeDbParams
  ): Promise<{ deletedCount?: number }> {
    const result = await this.model.collection.deleteMany(
      params.query as Filter<T>
    );
    return { deletedCount: result.deletedCount };
  }

  private parseSortOptions(sortBy?: string): IdaeDbParamsSortOptions {
    const sortOptions: IdaeDbParamsSortOptions = {};
    if (sortBy) {
      const sortFields = sortBy.split(",");
      sortFields.forEach((field) => {
        const [key, order] = field.split(":");
        sortOptions[key] = order === "desc" ? -1 : 1;
      });
    }
    return sortOptions;
  }
}
