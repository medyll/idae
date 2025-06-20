import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { EntityDBModel } from './entity-db-model';

@Injectable()
export class EntityService {
  constructor(private readonly databaseService: DatabaseService) {}

  async getById(base: string, entity: string, id: string) {
    const model = EntityDBModel.getEntityModel(
      this.databaseService,
      base,
      entity,
    );
    console.log('red',base,model.fieldId);
    if (/^\d+$/.test(id)) {
      return model.model
        .findOne({ [model.fieldId]: Number(id) })
        .lean()
        .exec();
    }
    return model.model.findOne({ _id: id }).lean().exec();
  }

  async executeCommand(
    base: string,
    entity: string,
    command: string,
    query: any,
  ) {
    const model = EntityDBModel.getEntityModel(
      this.databaseService,
      base,
      entity,
    );
    if (command === 'list') {
      return model.model.find(query).lean().exec();
    }
    return { error: 'Unknown command' };
  }
}
