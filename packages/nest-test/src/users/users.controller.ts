// This file defines the users controller for handling HTTP requests related to users.
import { Controller, Get } from '@nestjs/common';
import { UsersService } from './users.service';

// Decorator: Marks this class as a NestJS controller to handle requests for the 'users' route.
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  // Decorator: Maps HTTP GET requests to the findAll() method for the '/users' path.
  @Get()
  findAll(): string {
    return this.usersService.findAll();
  }
}
