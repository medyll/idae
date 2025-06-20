// This file defines a custom pipe for validating CreateIdaeDto objects in NestJS.
// Pipes can transform or validate incoming data before it reaches the controller.
import { ArgumentMetadata, Injectable, PipeTransform, BadRequestException } from '@nestjs/common';
import { CreateIdaeDto } from './idae/dto/create-idae.dto';

// Decorator: Marks this class as a NestJS injectable pipe.
@Injectable()
export class CreateIdaeValidationPipe implements PipeTransform {
  transform(value: CreateIdaeDto, metadata: ArgumentMetadata) {
    // Example validation: ensure the DTO has a 'name' property
    if (!value || typeof value !== 'object' || !('name' in value)) {
      throw new BadRequestException('Missing required property: name');
    }
    return value;
  }
}
