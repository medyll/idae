// This file defines the module for the 'idae' resource, grouping its controller and service.
import { Module } from '@nestjs/common';
import { IdaeService } from './idae.service';
import { IdaeController } from './idae.controller';

// Decorator: Marks this class as a NestJS module for the 'idae' resource.
@Module({
  controllers: [IdaeController],
  providers: [IdaeService],
})
export class IdaeModule {}
