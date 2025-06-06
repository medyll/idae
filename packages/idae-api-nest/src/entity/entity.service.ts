import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import * as mongoose from 'mongoose';

@Injectable()
export class EntityService {
  constructor(private readonly databaseService: DatabaseService) {}

  async getById(base: string, entity: string, id: number) {
    const connection = this.databaseService.getConnection(base);
    const schema = new mongoose.Schema({}, { strict: false }); // dynamic scheme
    const Model = connection.model(entity, schema, entity);
    return Model.findById(id).lean().exec();
  }

  async executeCommand(
    base: string,
    entity: string,
    command: string,
    query: any,
  ) {
    const connection = this.databaseService.getConnection(base);
    const schema = new mongoose.Schema({}, { strict: false });
    const Model = connection.model(entity, schema, entity);

    if (command === 'list') {
      return Model.find(query).lean().exec();
    }

    return { error: 'Unknown command' };
  }
}
