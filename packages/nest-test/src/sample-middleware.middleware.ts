// This file defines a custom middleware for NestJS.
// Middleware is used to process requests before they reach the route handler (e.g., logging, authentication, etc.).

import { Injectable, NestMiddleware } from '@nestjs/common';

// Decorator: Marks this class as a NestJS injectable middleware.
@Injectable()
export class SampleMiddlewareMiddleware implements NestMiddleware {
  use(req: any, res: any, next: () => void) {
    next();
  }
}
