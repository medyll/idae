// This file defines a custom decorator for use in NestJS or TypeScript classes/functions.
// Decorators add metadata or modify the behavior of classes, methods, or properties.

// Decorator: Custom decorator example for demonstration purposes.

import { SetMetadata } from '@nestjs/common';

export const SampleDecorator = (...args: string[]) =>
  SetMetadata('sample-decorator', args);
