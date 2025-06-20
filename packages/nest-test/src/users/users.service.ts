// This file defines the users service, providing business logic related to users.
import { Injectable } from '@nestjs/common';

// Decorator: Marks this class as a NestJS injectable service, allowing it to be injected into other components.
@Injectable()
export class UsersService {
  findAll(): string {
    return 'This action returns all users';
  }
}
