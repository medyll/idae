// This file defines the DTO for updating an existing 'idae' resource.
// DTOs (Data Transfer Objects) are used for data validation and typing in NestJS.
import { PartialType } from '@nestjs/mapped-types';
import { CreateIdaeDto } from './create-idae.dto';

export class UpdateIdaeDto extends PartialType(CreateIdaeDto) {}
