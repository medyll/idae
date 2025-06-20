// This file provides the business logic for the 'idae' resource.
// Injectable: Allows this service to be injected into controllers or other providers.
import { Injectable } from '@nestjs/common';
import { CreateIdaeDto } from './dto/create-idae.dto';
import { UpdateIdaeDto } from './dto/update-idae.dto';

// Decorator: Marks this class as a NestJS injectable service for the idae resource.
@Injectable()
export class IdaeService {
  create(createIdaeDto: CreateIdaeDto) {
    // Example logic: return the created object with a generated id
    return { id: Date.now(), ...createIdaeDto };
  }

  findAll() {
    // Example logic: return a static array of idae objects
    return [
      { id: 1, name: 'Idae 1' },
      { id: 2, name: 'Idae 2' },
    ];
  }

  findOne(id: number) {
    // Example logic: return a single idae object by id
    return { id, name: `Idae ${id}` };
  }

  update(id: number, updateIdaeDto: UpdateIdaeDto) {
    // Example logic: return the updated object
    return { id, ...updateIdaeDto };
  }

  remove(id: number) {
    // Example logic: confirm deletion
    return { message: `Idae #${id} deleted` };
  }
}
