// This file defines the users module, grouping related controllers and providers for users.
import { Module } from '@nestjs/common';
import { UsersController } from './users.controller';
import { UsersService } from './users.service';

// Decorator: Marks this class as a NestJS module for the users feature.
@Module({
  controllers: [UsersController],
  providers: [UsersService],
})
export class UsersModule {}
